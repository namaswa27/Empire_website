import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { productCategoryName } from "../utils/catalog";
import { formatPrice } from "../utils/contact";
import ProductImage, { PRODUCT_IMAGE_SIZES } from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.slug}`} className="catalog-card">
      <div className="thumb">
        <ProductImage product={product} sizes={PRODUCT_IMAGE_SIZES.card} className="thumb-media" />
        {product.featured ? <span className="featured-flag">Featured</span> : null}
      </div>
      <div className="body">
        <span className="cat-label">{productCategoryName(product.categoryId)}</span>
        <h3>{product.name}</h3>
        {product.brand ? <p className="brand">{product.brand}</p> : null}
        <p className="catalog-card-meta">{formatPrice(product.price, product.priceDisplayMode)}</p>
        {product.shortDescription ? <p>{product.shortDescription}</p> : null}
        <span className="card-actions">
          <span className="btn btn--outline">View Details</span>
        </span>
      </div>
    </Link>
  );
}
