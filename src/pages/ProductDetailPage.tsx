import { Link, useParams } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { getProductBySlug, productCategoryName } from "../utils/catalog";
import { formatPrice, bestEnquiryLink } from "../utils/contact";
import NotFoundPage from "./NotFoundPage";

export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const product = getProductBySlug(slug);

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
            <img
              className="detail-image"
              src={product.image || "/images/empire-mark-refined.svg"}
              alt={product.image ? product.name : ""}
            />
            {product.gallery && product.gallery.length ? (
              <div className="detail-gallery">
                {product.gallery.map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}
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
