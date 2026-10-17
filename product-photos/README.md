# Product photos — source folder

Put original product photos in a folder named after the product slug, for example `product-photos/hydrating-body-lotion/`.

Then run `npm run images:products`. The script is the only thing that publishes these photos. Full instructions are in CONTENT_MANAGEMENT.md (section **Product photos**).

Originals in this folder are never served directly; only the processed WebP versions in `public/images/products/` are published.
