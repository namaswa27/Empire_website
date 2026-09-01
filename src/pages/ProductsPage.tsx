import { useMemo, useState } from "react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import CatalogToolbar from "../components/CatalogToolbar";
import { productCategories } from "../data/categories";
import { activeProducts, filterProducts } from "../utils/catalog";

export default function ProductsPage() {
  useDocumentMeta({
    title: "Products",
    description: "Browse the beauty products Empire Beauty Space offers and uses — for enquiry, not online purchase.",
  });

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const all = activeProducts();
  const results = useMemo(
    () => filterProducts(all, { search, categoryId, featuredOnly }),
    [all, search, categoryId, featuredOnly]
  );

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Products</span>
          <h1>Our product showcase</h1>
          <p>
            Products Empire Beauty Space offers or uses in treatments. These are on display for browsing — interested in
            one? Reach out and we'll help with availability.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          {all.length === 0 ? (
            <EmptyState title="Product showcase coming soon">
              Our product collection will be updated soon. In the meantime, get in touch if you're looking for something specific.
            </EmptyState>
          ) : (
            <>
              <CatalogToolbar
                categories={productCategories}
                search={search}
                onSearchChange={setSearch}
                categoryId={categoryId}
                onCategoryChange={setCategoryId}
                featuredOnly={featuredOnly}
                onFeaturedOnlyChange={setFeaturedOnly}
                searchPlaceholder="Search products…"
              />
              {results.length ? (
                <div className="catalog-grid">
                  {results.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <EmptyState title="No products match your search">
                  Try a different search term, or clear the category filter.
                </EmptyState>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
