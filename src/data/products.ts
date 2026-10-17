/**
 * PRODUCT SHOWCASE CATALOGUE
 * ---------------------------------------------------------------
 * Products displayed here are for advertising and enquiry only —
 * there is no cart, checkout, or online purchase anywhere in this
 * app. Every product card links to an "Enquire" action instead of
 * "Buy". See CONTENT_MANAGEMENT.md for how to add/edit products.
 *
 * Intentionally empty: no invented products. Products are added in /admin.
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  categoryId: string;
  shortDescription?: string;
  description?: string;
  /** Numeric price in KSh, or null/omitted for "enquire for price". */
  price?: number | null;
  priceDisplayMode?: "fixed" | "from" | "on_request";
  size?: string; // e.g. "250ml"
  image?: string | null;
  gallery?: string[];
  benefits?: string[];
  ingredients?: string;
  usageInstructions?: string;
  suitableFor?: string;
  featured?: boolean;
  active?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Products are edited in the owner admin at /admin and stored as one JSON
 * file per product in content/products/ (the file name is the slug).
 */
const productFiles = import.meta.glob<Omit<Product, "id">>("../../content/products/*.json", {
  eager: true,
  import: "default",
});

export const products: Product[] = Object.values(productFiles).map((p) => ({ ...p, id: p.slug }));
