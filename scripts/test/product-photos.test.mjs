/**
 * Tests for the product photo pipeline. Run with: npm run test:images
 * All fixtures are generated in a temporary directory; no real photos or
 * production paths are touched.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { inspectImage, LIMITS, ImageRejectedError } from "../lib/image-policy.mjs";
import { processProductPhotos, VARIANT_WIDTHS } from "../lib/process-product-photos.mjs";

let tmp;
before(async () => {
  tmp = await fs.mkdtemp(path.join(os.tmpdir(), "empire-images-"));
});
after(async () => {
  await fs.rm(tmp, { recursive: true, force: true });
});

async function makePhoto({ width = 800, height = 600, format = "jpeg", exif = false } = {}) {
  let img = sharp({ create: { width, height, channels: 3, background: { r: 200, g: 120, b: 80 } } });
  if (exif) img = img.withExif({ IFD0: { Copyright: "private-owner-note", Artist: "Jane Doe" } });
  return img.toFormat(format).toBuffer();
}

async function expectRejected(buffer, pattern) {
  await assert.rejects(inspectImage(buffer), (err) => {
    assert.ok(err instanceof ImageRejectedError, `expected ImageRejectedError, got ${err}`);
    if (pattern) assert.match(err.message, pattern);
    // Messages must never leak filesystem paths or library internals.
    assert.doesNotMatch(err.message, /\/home|\/tmp|[A-Za-z]:\\|libvips|\.mjs|\.js:\d|stack/i);
    return true;
  });
}

// ---------- Validation: accepted formats ----------

test("accepts valid JPEG, PNG and WebP by content", async () => {
  for (const format of ["jpeg", "png", "webp"]) {
    const info = await inspectImage(await makePhoto({ format }));
    assert.equal(info.format, format);
    assert.equal(info.width, 800);
    assert.equal(info.height, 600);
  }
});

// ---------- Validation: negative and security cases ----------

test("rejects an executable renamed to .jpg (content, not extension, decides)", async () => {
  // PE/MZ header followed by junk, as a renamed Windows executable would look.
  const exe = Buffer.concat([Buffer.from("MZ"), Buffer.alloc(4096, 0x90)]);
  await expectRejected(exe, /Only JPEG, PNG and WebP/);
});

test("rejects a script disguised as a PNG (spoofed MIME/extension)", async () => {
  const script = Buffer.from("<?php system($_GET['c']); ?>");
  await expectRejected(script, /Only JPEG, PNG and WebP/);
});

test("rejects SVG and HTML content even when named as an image", async () => {
  await expectRejected(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'), /Only JPEG/);
  await expectRejected(Buffer.from("<!doctype html><script>alert(1)</script>"), /Only JPEG/);
});

test("rejects a GIF (unsupported format)", async () => {
  await expectRejected(Buffer.from("GIF89a" + "\0".repeat(64)), /Only JPEG/);
});

test("rejects empty files", async () => {
  await expectRejected(Buffer.alloc(0), /empty/);
});

test("rejects corrupted image data that has a valid header", async () => {
  const good = await makePhoto({ format: "jpeg", width: 1200, height: 900 });
  const truncated = good.subarray(0, Math.floor(good.length / 3));
  // Header-level validation may pass; the full decode in the pipeline must reject it.
  const dir = await fs.mkdtemp(path.join(tmp, "corrupt-"));
  await fs.mkdir(path.join(dir, "src", "broken-lamp"), { recursive: true });
  await fs.writeFile(path.join(dir, "src", "broken-lamp", "01.jpg"), truncated);
  const report = await processProductPhotos({
    sourceRoot: path.join(dir, "src"),
    outputRoot: path.join(dir, "out"),
    manifestPath: path.join(dir, "manifest.json"),
    knownSlugs: new Set(["broken-lamp"]),
  });
  assert.equal(report.published, 0);
  assert.equal(report.rejected.length, 1);
});

test("rejects files larger than the configured byte limit before decoding", async () => {
  const big = Buffer.alloc(LIMITS.maxBytes + 1, 0);
  big.set([0xff, 0xd8, 0xff], 0);
  await expectRejected(big, /larger than 5 MB/);
});

test("rejects a 20.25 MP image, above the 20 MP pixel limit", async () => {
  const huge = await sharp({
    create: { width: 4500, height: 4500, channels: 3, background: { r: 1, g: 2, b: 3 } },
  }).png().toBuffer();
  await expectRejected(huge, /too large/);
});

test("rejects images whose shortest side is too small to display well", async () => {
  await expectRejected(await makePhoto({ width: 120, height: 120 }), /shortest side/);
});

test("rejects images with a longest side above the maximum", async () => {
  const wide = await sharp({
    create: { width: LIMITS.maxSide + 1, height: 400, channels: 3, background: { r: 1, g: 1, b: 1 } },
  }).png().toBuffer();
  await expectRejected(wide, /longest side/);
});

// ---------- Pipeline: publishing, metadata, naming, cleanup ----------

async function setupProject(name) {
  const dir = await fs.mkdtemp(path.join(tmp, `${name}-`));
  return {
    dir,
    sourceRoot: path.join(dir, "product-photos"),
    outputRoot: path.join(dir, "public", "images", "products"),
    manifestPath: path.join(dir, "src", "data", "productImages.json"),
    knownSlugs: new Set(["hydrating-lotion", "rose-serum"]),
  };
}

test("publishes valid photos as WebP variants with metadata stripped and safe names", async () => {
  const p = await setupProject("publish");
  const productDir = path.join(p.sourceRoot, "hydrating-lotion");
  await fs.mkdir(productDir, { recursive: true });
  // Original filename deliberately contains private text; it must not reach the output.
  await fs.writeFile(path.join(productDir, "01-jane-doe-home-address.jpg"), await makePhoto({ width: 2000, height: 1500, exif: true }));
  await fs.writeFile(path.join(productDir, "02-side.png"), await makePhoto({ width: 700, height: 900, format: "png" }));
  await fs.writeFile(
    path.join(productDir, "captions.json"),
    JSON.stringify({ "01-jane-doe-home-address.jpg": { alt: "Hydrating lotion bottle", caption: "250ml" } })
  );

  const report = await processProductPhotos({ ...p, log: () => {} });
  assert.equal(report.rejected.length, 0);
  assert.equal(report.published, 2);

  const manifest = JSON.parse(await fs.readFile(p.manifestPath, "utf8"));
  const [first, second] = manifest.products["hydrating-lotion"];
  assert.equal(first.alt, "Hydrating lotion bottle");
  assert.equal(first.caption, "250ml");
  assert.equal(second.alt, "");

  // Variant widths are capped at the original width and written as WebP.
  assert.deepEqual(first.variants.map((v) => v.width), [...VARIANT_WIDTHS]);
  for (const v of first.variants) {
    assert.match(v.url, /^\/images\/products\/hydrating-lotion\/[a-f0-9]{16}-\d+\.webp$/);
    assert.doesNotMatch(v.url, /jane|doe|address/i);
    const meta = await sharp(path.join(p.dir, "public", v.url)).metadata();
    assert.equal(meta.format, "webp");
    assert.equal(meta.width, v.width);
    assert.equal(meta.exif, undefined, "EXIF must be stripped");
    assert.equal(meta.orientation, undefined, "orientation must be applied and dropped");
  }

  // The manifest contains only web paths, never filesystem paths.
  assert.doesNotMatch(JSON.stringify(manifest), /\/home\/|\/tmp\/|\\\\/);
});

test("a rejected file does not block valid siblings from publishing", async () => {
  const p = await setupProject("mixed");
  const productDir = path.join(p.sourceRoot, "rose-serum");
  await fs.mkdir(productDir, { recursive: true });
  await fs.writeFile(path.join(productDir, "01-good.jpg"), await makePhoto());
  await fs.writeFile(path.join(productDir, "02-bad.jpg"), Buffer.from("not an image at all"));
  await fs.writeFile(path.join(productDir, "03-notes.txt"), "hello");

  const report = await processProductPhotos({ ...p, log: () => {} });
  assert.equal(report.published, 1);
  assert.equal(report.rejected.length, 2);
  const manifest = JSON.parse(await fs.readFile(p.manifestPath, "utf8"));
  assert.equal(manifest.products["rose-serum"].length, 1);
});

test("skips unknown products and invalid folder names", async () => {
  const p = await setupProject("unknown");
  await fs.mkdir(path.join(p.sourceRoot, "not-a-product"), { recursive: true });
  await fs.writeFile(path.join(p.sourceRoot, "not-a-product", "a.jpg"), await makePhoto());
  await fs.mkdir(path.join(p.sourceRoot, "Bad Name"), { recursive: true });

  const report = await processProductPhotos({ ...p, log: () => {} });
  assert.equal(report.published, 0);
  assert.equal(report.skipped.length, 2);
  const manifest = JSON.parse(await fs.readFile(p.manifestPath, "utf8"));
  assert.deepEqual(manifest.products, {});
});

test("replacing a photo removes its obsolete variants, without leaving duplicates", async () => {
  const p = await setupProject("replace");
  const productDir = path.join(p.sourceRoot, "hydrating-lotion");
  await fs.mkdir(productDir, { recursive: true });
  await fs.writeFile(path.join(productDir, "01.jpg"), await makePhoto());
  await processProductPhotos({ ...p, log: () => {} });
  const firstUrls = JSON.parse(await fs.readFile(p.manifestPath, "utf8")).products["hydrating-lotion"][0].variants.map((v) => v.url);

  await fs.writeFile(path.join(productDir, "01.jpg"), await makePhoto({ width: 900, height: 700 }));
  await processProductPhotos({ ...p, log: () => {} });

  const current = JSON.parse(await fs.readFile(p.manifestPath, "utf8")).products["hydrating-lotion"][0].variants;
  const dirFiles = await fs.readdir(path.join(p.outputRoot, "hydrating-lotion"));
  assert.equal(dirFiles.length, current.length, "only the current variants should remain");
  for (const url of firstUrls) {
    await assert.rejects(fs.access(path.join(p.dir, "public", url)), "old variant should be deleted");
  }
});

test("if every upload for a product fails, its previously published images are kept", async () => {
  const p = await setupProject("keep");
  const productDir = path.join(p.sourceRoot, "rose-serum");
  await fs.mkdir(productDir, { recursive: true });
  await fs.writeFile(path.join(productDir, "01.jpg"), await makePhoto());
  await processProductPhotos({ ...p, log: () => {} });
  const before = JSON.parse(await fs.readFile(p.manifestPath, "utf8")).products["rose-serum"];

  await fs.writeFile(path.join(productDir, "01.jpg"), Buffer.from("broken upload"));
  const report = await processProductPhotos({ ...p, log: () => {} });
  const after = JSON.parse(await fs.readFile(p.manifestPath, "utf8")).products["rose-serum"];

  assert.equal(report.rejected.length, 1);
  assert.deepEqual(after, before, "working images must not be deleted by a failed replacement");
  for (const img of after) {
    for (const v of img.variants) await fs.access(path.join(p.dir, "public", v.url));
  }
});
