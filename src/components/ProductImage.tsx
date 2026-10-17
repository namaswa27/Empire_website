import { useState } from "react";
import type { Product } from "../data/products";
import manifest from "../data/productImages.json";

/**
 * Single rendering path for product photographs. Every page that shows a
 * product image goes through here so the rules stay consistent:
 * - the real, owner-uploaded photo for THIS product slug is used (no shared placeholders)
 * - WebP variants are offered through srcset, so phones download the small one
 * - width/height come from the processed file, so the layout never shifts
 * - the photo is shown whole (object-fit: contain), never cropped or stretched
 * - below-the-fold images lazy-load; the hero image on a detail page loads eagerly
 * - if a file fails to load, the component falls back gracefully
 */

export interface PublishedVariant {
  width: number;
  url: string;
}

export interface PublishedPhoto {
  id: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  variants: PublishedVariant[];
}

interface ProductImageManifest {
  version: number;
  products: Record<string, PublishedPhoto[]>;
}

const images = (manifest as ProductImageManifest).products;

/** All published photos for a product, primary photo first. */
export function getProductPhotos(slug: string): PublishedPhoto[] {
  return images[slug] ?? [];
}

export const PRODUCT_IMAGE_SIZES = {
  card: "(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw",
  detail: "(min-width: 900px) 50vw, 100vw",
  thumb: "120px",
} as const;

interface ProductImageProps {
  product: Product;
  /** Which photo to show: 0 is the primary photo. */
  index?: number;
  sizes: string;
  eager?: boolean;
  className?: string;
  /** Used for the alt text when no caption is set for the photo. */
  altOverride?: string;
}

export default function ProductImage({ product, index = 0, sizes, eager = false, className, altOverride }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const photo = getProductPhotos(product.slug)[index];

  if (!photo || failed) {
    return <ProductImageFallback product={product} className={className} legacySrc={!photo ? product.image : null} />;
  }

  const medium = photo.variants[Math.floor(photo.variants.length / 2)] ?? photo.variants[0];
  const srcSet = photo.variants.map((v) => `${v.url} ${v.width}w`).join(", ");
  const alt = altOverride ?? (photo.alt || product.name);

  return (
    <picture className={className}>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={medium.url}
        alt={alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}

function ProductImageFallback({ product, className, legacySrc }: { product: Product; className?: string; legacySrc: string | null | undefined }) {
  if (legacySrc) {
    // A path set directly in products.ts (for example /images/products/x.jpg) is still honoured.
    return <img className={className} src={legacySrc} alt={product.name} loading="lazy" decoding="async" />;
  }
  return (
    <div className={`product-image-fallback ${className ?? ""}`} role="img" aria-label={`${product.name}: photo coming soon`}>
      <img src="/images/empire-mark-refined.svg" alt="" width={48} height={48} aria-hidden="true" />
      <span>Photo coming soon</span>
    </div>
  );
}
