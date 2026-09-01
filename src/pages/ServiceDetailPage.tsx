import { Link, useParams } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { getServiceBySlug, serviceCategoryName } from "../utils/catalog";
import { formatPrice } from "../utils/contact";
import NotFoundPage from "./NotFoundPage";

export default function ServiceDetailPage() {
  const { slug = "" } = useParams();
  const service = getServiceBySlug(slug);

  useDocumentMeta({
    title: service ? (service.seoTitle || service.name) : "Service not found",
    description: service ? (service.seoDescription || service.shortDescription) : undefined,
  });

  if (!service) return <NotFoundPage message="That service couldn't be found — it may have been renamed or removed." backTo="/services" backLabel="Back to Services" />;

  const bookingLink = service.bookingAvailable === false ? null : { pathname: "/contact", hash: "#booking" };

  return (
    <section className="section">
      <div className="container">
        <p className="breadcrumb"><Link to="/services">Services</Link> / {service.name}</p>

        <div className="detail-layout">
          <div>
            <img
              className="detail-image"
              src={service.image || "/images/empire-mark-refined.svg"}
              alt={service.image ? service.name : ""}
            />
            {service.gallery && service.gallery.length ? (
              <div className="detail-gallery">
                {service.gallery.map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}
              </div>
            ) : null}
          </div>

          <div>
            <span className="eyebrow">{serviceCategoryName(service.categoryId)}</span>
            <h1>{service.name}</h1>
            {service.shortDescription ? <p style={{ marginTop: "0.75rem" }}>{service.shortDescription}</p> : null}

            <p className="detail-price">{formatPrice(service.price, service.priceDisplayMode)}</p>
            {service.duration ? <div className="detail-meta-row"><span>Duration: {service.duration}</span></div> : null}

            {service.description ? (
              <div className="detail-section">
                <h2>About this service</h2>
                <p>{service.description}</p>
              </div>
            ) : null}

            {service.benefits && service.benefits.length ? (
              <div className="detail-section">
                <h2>Benefits</h2>
                <ul className="detail-benefits">
                  {service.benefits.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            ) : null}

            {service.preparation ? (
              <div className="detail-section">
                <h2>Preparation</h2>
                <p>{service.preparation}</p>
              </div>
            ) : null}

            {service.aftercare ? (
              <div className="detail-section">
                <h2>Aftercare</h2>
                <p>{service.aftercare}</p>
              </div>
            ) : null}

            <div className="detail-actions">
              {bookingLink ? (
                <Link to={bookingLink} state={{ serviceSlug: service.slug }} className="btn btn--primary">
                  Book Appointment
                </Link>
              ) : (
                <Link to="/contact" className="btn btn--primary">Contact Us</Link>
              )}
              <Link to="/services" className="btn btn--outline">Back to Services</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
