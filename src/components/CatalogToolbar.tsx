import type { Category } from "../data/categories";

interface CatalogToolbarProps {
  categories: Category[];
  search: string;
  onSearchChange: (v: string) => void;
  categoryId: string | null;
  onCategoryChange: (id: string | null) => void;
  featuredOnly: boolean;
  onFeaturedOnlyChange: (v: boolean) => void;
  searchPlaceholder: string;
}

export default function CatalogToolbar({
  categories,
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  featuredOnly,
  onFeaturedOnlyChange,
  searchPlaceholder,
}: CatalogToolbarProps) {
  return (
    <div>
      <div className="catalog-toolbar">
        <div className="catalog-search">
          <label className="visually-hidden" htmlFor="catalog-search-input">Search</label>
          <input
            id="catalog-search-input"
            type="search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <label className="featured-toggle">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => onFeaturedOnlyChange(e.target.checked)}
          />
          Featured only
        </label>
      </div>

      <div className="category-tabs" role="tablist" aria-label="Categories">
        <button
          type="button"
          className="category-tab"
          role="tab"
          aria-selected={categoryId === null}
          onClick={() => onCategoryChange(null)}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className="category-tab"
            role="tab"
            aria-selected={categoryId === c.id}
            onClick={() => onCategoryChange(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
