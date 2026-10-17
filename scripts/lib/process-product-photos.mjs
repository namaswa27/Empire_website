/**
 * Turns owner-supplied original photos into publishable WebP variants.
 *
 * Layout (source, never served directly):
 *   product-photos/<product-slug>/01-front.jpg
 *   product-photos/<product-slug>/02-detail.png
 *   product-photos/<product-slug>/captions.json   (optional)
 *
 * Output (served by the site):
 *   public/images/products/<product-slug>/<contenthash>-<width>.webp
 *   src/data/productImages.json                    (manifest read by the UI)
 *
 * Guarantees:
 * - Only files that pass inspectImage() are published.
 * - Every output is re-encoded from decoded pixels, so EXIF/GPS/XMP/ICC
 *   metadata from the original is not carried over. Orientation is applied
 *   from EXIF first, so photos are not displayed sideways.
 * - Output names come from a content hash, never from the source filename.
 *   Each URL is therefore immutable and can be cached forever.
 * - Writes are atomic (temp file then rename). Obsolete generated files are
 *   removed only after the new manifest has been written.
 * - A product whose uploads ALL fail keeps its previously published images.
 */
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  ACCEPTED_EXTENSIONS,
  ImageRejectedError,
  LIMITS,
  inspectImage,
} from "./image-policy.mjs";

export const VARIANT_WIDTHS = Object.freeze([480, 960, 1600]);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const GENERATED_FILE_PATTERN = /^[a-f0-9]{16}-\d+\.webp$/;
const WEBP_QUALITY = 82;
const MAX_ALT = 200;
const MAX_CAPTION = 300;

function clean(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

async function readJsonIfExists(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeFileAtomic(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, data);
  await fs.rename(tmp, file);
}

/**
 * @param {object} opts
 * @param {string} opts.sourceRoot     directory containing one folder per product slug
 * @param {string} opts.outputRoot     public directory for generated variants
 * @param {string} opts.manifestPath   JSON manifest the UI imports
 * @param {Set<string>} [opts.knownSlugs] slugs that exist in products.ts (unknown ones are skipped)
 * @param {(msg: string) => void} [opts.log]
 */
export async function processProductPhotos({ sourceRoot, outputRoot, manifestPath, knownSlugs, log = () => {} }) {
  const previous = await readJsonIfExists(manifestPath, { version: 1, products: {} });
  const report = { published: 0, rejected: [], skipped: [], products: {} };

  let entries = [];
  try {
    entries = await fs.readdir(sourceRoot, { withFileTypes: true });
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  const manifest = { version: 1, products: {} };

  for (const entry of entries.filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const slug = entry.name;
    if (!SLUG_PATTERN.test(slug)) {
      report.skipped.push(`"${slug}": folder name must be a lowercase product slug`);
      continue;
    }
    if (knownSlugs && !knownSlugs.has(slug)) {
      report.skipped.push(`"${slug}": no product with this slug exists in src/data/products.ts`);
      continue;
    }

    const productDir = path.join(sourceRoot, slug);
    const files = (await fs.readdir(productDir, { withFileTypes: true }))
      .filter((f) => f.isFile() && !f.name.startsWith("."))
      .map((f) => f.name)
      .sort((a, b) => a.localeCompare(b));

    const captions = await readJsonIfExists(path.join(productDir, "captions.json"), {});
    const candidates = files.filter((name) => name !== "captions.json");

    if (candidates.length > LIMITS.maxImagesPerProduct) {
      report.rejected.push({ file: `${slug}/*`, reason: `at most ${LIMITS.maxImagesPerProduct} photos per product` });
      candidates.length = LIMITS.maxImagesPerProduct;
    }

    const published = [];
    const failures = [];

    for (const name of candidates) {
      const ext = path.extname(name).toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        failures.push({ file: `${slug}/${name}`, reason: "only .jpg, .png and .webp files are accepted" });
        continue;
      }
      try {
        const stat = await fs.stat(path.join(productDir, name));
        if (stat.size > LIMITS.maxBytes) {
          throw new ImageRejectedError(`The file is larger than ${LIMITS.maxBytes / (1024 * 1024)} MB.`);
        }
        const buffer = await fs.readFile(path.join(productDir, name));
        const info = await inspectImage(buffer);
        const variants = await encodeVariants(buffer, info);
        const hash = createHash("sha256").update(variants[variants.length - 1].data).digest("hex").slice(0, 16);

        const outDir = path.join(outputRoot, slug);
        const urls = [];
        for (const v of variants) {
          const fileName = `${hash}-${v.width}.webp`;
          await writeFileAtomic(path.join(outDir, fileName), v.data);
          urls.push({ width: v.width, url: `/images/products/${slug}/${fileName}` });
        }
        const largest = variants[variants.length - 1];
        const meta = captions[name] || {};
        published.push({
          id: hash,
          alt: clean(meta.alt, MAX_ALT),
          caption: clean(meta.caption, MAX_CAPTION),
          width: largest.width,
          height: largest.height,
          variants: urls,
        });
      } catch (err) {
        if (err instanceof ImageRejectedError) {
          failures.push({ file: `${slug}/${name}`, reason: err.message });
        } else {
          // Decode failures from libvips are reported generically; details stay in the log.
          log(`[images] ${slug}/${name}: decode error: ${err.message}`);
          failures.push({ file: `${slug}/${name}`, reason: "This photo could not be decoded. It may be corrupted or unsupported." });
        }
      }
    }

    report.rejected.push(...failures);

    if (published.length === 0 && failures.length > 0 && previous.products[slug]) {
      // Every upload failed: keep the currently published set rather than emptying the product.
      manifest.products[slug] = previous.products[slug];
      report.products[slug] = { kept: previous.products[slug].length, failed: failures.length };
      log(`[images] ${slug}: all uploads rejected, keeping previously published images`);
      continue;
    }

    if (published.length > 0) {
      manifest.products[slug] = published;
      report.published += published.length;
    }
    report.products[slug] = { published: published.length, failed: failures.length };
  }

  await writeFileAtomic(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  await removeObsoleteVariants(outputRoot, manifest);
  return report;
}

/** Decodes with orientation applied, drops all metadata, and resizes to each variant width. */
async function encodeVariants(buffer, info) {
  const base = sharp(buffer, { limitInputPixels: LIMITS.maxPixels, failOn: "warning" })
    .rotate() // apply EXIF orientation; the orientation tag is not re-emitted
    .toColourspace("srgb");

  const variants = [];
  const seen = new Set();
  for (const target of VARIANT_WIDTHS) {
    const width = Math.min(target, info.width);
    if (seen.has(width)) continue;
    seen.add(width);
    const { data, info: out } = await base
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer({ resolveWithObject: true });
    variants.push({ width: out.width, height: out.height, data });
  }
  return variants;
}

/** Deletes generated files that no manifest entry references. Only touches files matching our naming pattern. */
async function removeObsoleteVariants(outputRoot, manifest) {
  let dirs = [];
  try {
    dirs = await fs.readdir(outputRoot, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return;
    throw err;
  }
  for (const dir of dirs.filter((d) => d.isDirectory())) {
    if (!SLUG_PATTERN.test(dir.name)) continue;
    const keep = new Set(
      (manifest.products[dir.name] || []).flatMap((img) => img.variants.map((v) => path.basename(v.url)))
    );
    const dirPath = path.join(outputRoot, dir.name);
    for (const f of await fs.readdir(dirPath)) {
      if (GENERATED_FILE_PATTERN.test(f) && !keep.has(f)) {
        await fs.rm(path.join(dirPath, f), { force: true });
      }
    }
    if ((await fs.readdir(dirPath)).length === 0) await fs.rmdir(dirPath);
  }
}
