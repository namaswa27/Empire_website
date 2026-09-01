import type { Service } from "../data/services";
import type { Product } from "../data/products";
import type { Category } from "../data/categories";
import { serviceCategories, productCategories } from "../data/categories";
import { services } from "../data/services";
import { products } from "../data/products";

export function categoryName(categories: Category[], id: string): string {
  return categories.find((c) => c.id === id)?.name ?? "Uncategorized";
}
export const serviceCategoryName = (id: string) => categoryName(serviceCategories, id);
export const productCategoryName = (id: string) => categoryName(productCategories, id);

export function activeServices(): Service[] {
  return services.filter((s) => s.active !== false);
}
export function activeProducts(): Product[] {
  return products.filter((p) => p.active !== false);
}

export function featuredServices(limit = 3): Service[] {
  return activeServices().filter((s) => s.featured).slice(0, limit);
}
export function featuredProducts(limit = 3): Product[] {
  return activeProducts().filter((p) => p.featured).slice(0, limit);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug && s.active !== false);
}
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.active !== false);
}

export interface CatalogFilter {
  search?: string;
  categoryId?: string | null;
  featuredOnly?: boolean;
}

function matchesSearch(haystacks: (string | undefined)[], query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return haystacks.some((h) => (h || "").toLowerCase().includes(q));
}

export function filterServices(list: Service[], filter: CatalogFilter): Service[] {
  return list.filter((s) => {
    if (filter.categoryId && s.categoryId !== filter.categoryId) return false;
    if (filter.featuredOnly && !s.featured) return false;
    if (filter.search && !matchesSearch([s.name, s.shortDescription, s.description, serviceCategoryName(s.categoryId)], filter.search)) return false;
    return true;
  });
}

export function filterProducts(list: Product[], filter: CatalogFilter): Product[] {
  return list.filter((p) => {
    if (filter.categoryId && p.categoryId !== filter.categoryId) return false;
    if (filter.featuredOnly && !p.featured) return false;
    if (filter.search && !matchesSearch([p.name, p.brand, p.shortDescription, p.description, productCategoryName(p.categoryId)], filter.search)) return false;
    return true;
  });
}

/** Dev-time sanity check: warns (never throws) about duplicate slugs, since
 * routing (/services/:slug) depends on each slug being unique. There's no
 * backend to enforce this, so this is the closest thing to validation. */
export function warnOnDuplicateSlugs(): void {
  if (!import.meta.env.DEV) return;
  const check = (list: { slug: string; name: string }[], label: string) => {
    const seen = new Map<string, string>();
    for (const item of list) {
      if (seen.has(item.slug)) {
        console.warn(`[catalog data] Duplicate ${label} slug "${item.slug}": "${seen.get(item.slug)}" and "${item.name}". Routes for this slug will only reach the first match.`);
      } else {
        seen.set(item.slug, item.name);
      }
    }
  };
  check(services, "service");
  check(products, "product");
}
