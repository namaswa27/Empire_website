import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import ProductImage, { PRODUCT_IMAGE_SIZES, getProductPhotos } from "../components/ProductImage";
import { getProductBySlug, productCategoryName } from "../utils/catalog";
import { formatPrice, bestEnquiryLink } from "../utils/contact";
import NotFoundPage from "./NotFoundPage";

export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const product = getProductBySlug(slug);
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = product ? getProductPhotos(product.slug) : [];

  useDocumentMeta({
    title: product ? (product.seoTitle || product.name) : "Product not found",
    description: product ? (product.seoDescription || product.shortDescription) : undefined,
  });

  if (!product) return <NotFoundPage message="That product couldn't be found — it may have been renamed or removed." backTo="/products" backLabel="Back to Products" />;

  const enquiry = bestEnquiryLink(`Hi Empire Beauty Space, I would like to enquire about "${product.name}".`);

  return (
    <section className="section">
      <div className="container">
        <p className="breadcrumb"><Link to="/products">Products</Link> / {product.name}</p>

        <div className="detail-layout">
          <div>
            <ProductImage
              product={product}
              index={activePhoto}
              sizes={PRODUCT_IMAGE_SIZES.detail}
              eager
              className="detail-image"
            />
            {photos.length > 1 ? (
              <div className="detail-gallery" role="group" aria-label="Product photos">
                {photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    type="button"
                    className="detail-gallery-button"
                    aria-pressed={i === activePhoto}
                    aria-label={`Show photo ${i + 1} of ${photos.length}`}
                    onClick={() => setActivePhoto(i)}
                  >
                    <ProductImage product={product} index={i} sizes={PRODUCT_IMAGE_SIZES.thumb} className="detail-gallery-media" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <span className="eyebrow">{productCategoryName(product.categoryId)}</span>
            <h1>{product.name}</h1>
            {product.brand ? <p className="brand" style={{ marginTop: "0.35rem" }}>{product.brand}</p> : null}
            {product.shortDescription ? <p style={{ marginTop: "0.75rem" }}>{product.shortDescription}</p> : null}

            <p className="detail-price">{formatPrice(product.price, product.priceDisplayMode)}</p>
            {product.size ? <div className="detail-meta-row"><span>Size: {product.size}</span></div> : null}

            {product.description ? (
              <div className="detail-section">
                <h2>About this product</h2>
                <p>{product.description}</p>
              </div>
            ) : null}

            {product.benefits && product.benefits.length ? (
              <div className="detail-section">
                <h2>Benefits</h2>
                <ul className="detail-benefits">
                  {product.benefits.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            ) : null}

            {product.usageInstructions ? (
              <div className="detail-section">
                <h2>How to use</h2>
                <p>{product.usageInstructions}</p>
              </div>
            ) : null}

            {product.ingredients ? (
              <div className="detail-section">
                <h2>Ingredients</h2>
                <p>{product.ingredients}</p>
              </div>
            ) : null}

            {product.suitableFor ? (
              <div className="detail-section">
                <h2>Suitable for</h2>
                <p>{product.suitableFor}</p>
              </div>
            ) : null}

            <div className="detail-section">
              <p className="text-muted" style={{ fontWeight: 600, color: "var(--color-ink)" }}>Interested in this product?</p>
            </div>

            <div className="detail-actions">
              {enquiry ? (
                <a href={enquiry.href} target="_blank" rel="noopener noreferrer" className="btn btn--primary">{enquiry.label}</a>
              ) : (
                <Link to="/contact" className="btn btn--primary">Contact Us</Link>
              )}
              <Link to="/products" className="btn btn--outline">Back to Products</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
