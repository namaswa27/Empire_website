import { useMemo, useState } from "react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import EmptyState from "../components/EmptyState";
import ServiceCard from "../components/ServiceCard";
import CatalogToolbar from "../components/CatalogToolbar";
import { serviceCategories } from "../data/categories";
import { activeServices, filterServices } from "../utils/catalog";

export default function ServicesPage() {
  useDocumentMeta({
    title: "Services",
    description: "Explore Empire Beauty Space's skincare, bodycare, makeup and beauty treatment services in Nakuru.",
  });

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const all = activeServices();
  const results = useMemo(
    () => filterServices(all, { search, categoryId, featuredOnly }),
    [all, search, categoryId, featuredOnly]
  );

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Services</span>
          <h1>Explore our beauty services</h1>
          <p>Browse by category. Full details, pricing and duration are shown for each confirmed service.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          {all.length === 0 ? (
            <EmptyState title="Service catalogue coming soon">
              Empire Beauty Space's full list of services, categories, pricing and durations will appear here as soon as they're confirmed. In the meantime, feel free to request an appointment and let us know what you're interested in.
            </EmptyState>
          ) : (
            <>
              <CatalogToolbar
                categories={serviceCategories}
                search={search}
                onSearchChange={setSearch}
                categoryId={categoryId}
                onCategoryChange={setCategoryId}
                featuredOnly={featuredOnly}
                onFeaturedOnlyChange={setFeaturedOnly}
                searchPlaceholder="Search services…"
              />
              {results.length ? (
                <div className="catalog-grid">
                  {results.map((s) => <ServiceCard key={s.id} service={s} />)}
                </div>
              ) : (
                <EmptyState title="No services match your search">
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
