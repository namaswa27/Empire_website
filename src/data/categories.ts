/**
 * Service & product categories.
 *
 * These starting names are EXAMPLES ONLY, provided so the catalogue
 * has somewhere to organize into from day one. Rename, reorder,
 * remove, or add to these freely once the real category list is
 * decided — nothing else in the app needs to change when you do,
 * since services.ts/products.ts reference categories by `id`.
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const serviceCategories: Category[] = [
  { id: "svc-skincare", name: "Skincare", slug: "skincare" },
  { id: "svc-bodycare", name: "Bodycare", slug: "bodycare" },
  { id: "svc-makeup", name: "Makeup", slug: "makeup" },
  { id: "svc-facial", name: "Facial Treatments", slug: "facial-treatments" },
  { id: "svc-beauty", name: "Beauty Treatments", slug: "beauty-treatments" },
  { id: "svc-other", name: "Other", slug: "other" },
];

export const productCategories: Category[] = [
  { id: "prod-skincare", name: "Skincare", slug: "skincare" },
  { id: "prod-bodycare", name: "Bodycare", slug: "bodycare" },
  { id: "prod-makeup", name: "Makeup", slug: "makeup" },
  { id: "prod-haircare", name: "Haircare", slug: "haircare" },
  { id: "prod-accessories", name: "Beauty Accessories", slug: "beauty-accessories" },
  { id: "prod-other", name: "Other", slug: "other" },
];
