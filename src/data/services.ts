/**
 * SERVICES CATALOGUE
 * ---------------------------------------------------------------
 * This is the single place to add, edit, or remove a service. The
 * Services page, homepage "Featured Services", and the appointment
 * form's service dropdown all read from this file automatically —
 * no component changes needed when you update it.
 *
 * Intentionally empty: no invented services. Add real entries here
 * as Empire Beauty Space confirms its offering. See
 * CONTENT_MANAGEMENT.md for a step-by-step guide.
 * ---------------------------------------------------------------
 */

export interface Service {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription?: string;
  description?: string;
  /** Numeric price in KSh, or null/omitted for "price on request". */
  price?: number | null;
  priceDisplayMode?: "fixed" | "from" | "on_request";
  duration?: string | null; // e.g. "60 minutes"
  image?: string | null;
  gallery?: string[];
  benefits?: string[];
  preparation?: string | null;
  aftercare?: string | null;
  featured?: boolean;
  active?: boolean;
  bookingAvailable?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export const services: Service[] = [];
