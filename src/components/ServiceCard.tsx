import { Link } from "react-router-dom";
import type { Service } from "../data/services";
import { serviceCategoryName } from "../utils/catalog";
import { formatPrice } from "../utils/contact";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link to={`/services/${service.slug}`} className="catalog-card">
      <div className="thumb">
        {service.image ? <img src={service.image} alt="" loading="lazy" /> : "Image coming soon"}
        {service.featured ? <span className="featured-flag">Featured</span> : null}
      </div>
      <div className="body">
        <span className="cat-label">{serviceCategoryName(service.categoryId)}</span>
        <h3>{service.name}</h3>
        <p className="catalog-card-meta">
          {service.duration ? service.duration : ""}
          {service.duration ? " · " : ""}
          {formatPrice(service.price, service.priceDisplayMode)}
        </p>
        {service.shortDescription ? <p>{service.shortDescription}</p> : null}
        <span className="card-actions">
          <span className="btn btn--outline">View Details</span>
        </span>
      </div>
    </Link>
  );
}
