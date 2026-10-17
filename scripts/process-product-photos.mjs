#!/usr/bin/env node
/**
 * Usage: npm run images:products
 *
 * Processes every folder in product-photos/ into optimized, metadata-free
 * WebP variants and refreshes src/data/productImages.json. Run it before
 * `npm run build` whenever product photos change. Exits with code 1 if any
 * file was rejected, so problems are visible in CI and at the terminal.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { processProductPhotos } from "./lib/process-product-photos.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Products are one JSON file each in content/products/, named after the slug.
const productDir = path.join(root, "content/products");
let productFiles = [];
try {
  productFiles = await fs.readdir(productDir);
} catch (err) {
  if (err.code !== "ENOENT") throw err;
}
const knownSlugs = new Set(productFiles.filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -".json".length)));

const report = await processProductPhotos({
  sourceRoot: path.join(root, "product-photos"),
  outputRoot: path.join(root, "public/images/products"),
  manifestPath: path.join(root, "src/data/productImages.json"),
  knownSlugs,
  log: (msg) => console.warn(msg),
});

for (const [slug, info] of Object.entries(report.products)) {
  console.log(`${slug}: ${info.published ?? `kept ${info.kept}`} published, ${info.failed} rejected`);
}
for (const note of report.skipped) console.warn(`skipped ${note}`);
for (const r of report.rejected) console.error(`REJECTED ${r.file}: ${r.reason}`);
console.log(`\nDone. ${report.published} photo(s) published.`);

process.exitCode = report.rejected.length > 0 ? 1 : 0;
