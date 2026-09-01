/**
 * PRODUCT SHOWCASE CATALOGUE
 * ---------------------------------------------------------------
 * Products displayed here are for advertising and enquiry only —
 * there is no cart, checkout, or online purchase anywhere in this
 * app. Every product card links to an "Enquire" action instead of
 * "Buy". See CONTENT_MANAGEMENT.md for how to add/edit products.
 *
 * Intentionally empty: no invented products. Add real entries here
 * as Empire Beauty Space confirms its product lineup.
 * ---------------------------------------------------------------
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

export const products: Product[] = [];
