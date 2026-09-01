import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { business, about } from "../data/business";
import SectionHeading from "../components/SectionHeading";
import EmptyState from "../components/EmptyState";
import ServiceCard from "../components/ServiceCard";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import ContactActions from "../components/ContactActions";
import { featuredServices, featuredProducts } from "../utils/catalog";
import { testimonials } from "../data/testimonials";
import { instagramLink, tiktokLink } from "../utils/contact";

export default function HomePage() {
  useDocumentMeta({
    title: "Beauty & Wellness in Nakuru",
    description: "Empire Beauty Space is a premium beauty destination in Nakuru offering skincare, bodycare, makeup and beauty treatments. Explore services, browse products, or request an appointment.",
  });

  const fServices = featuredServices(3);
  const fProducts = featuredProducts(3);

  return (
    <>
      {/* HERO */}
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Nakuru · Maombini Plaza</span>
            <h1>{business.name}</h1>
            <p className="subhead">{business.tagline}.</p>
            <p className="lede">A premium beauty space offering skincare, bodycare and makeup services — book an appointment or explore what we offer.</p>
            <div className="hero-actions">
              <Link to="/contact#booking" className="btn btn--primary">Book an Appointment</Link>
              <Link to="/services" className="btn btn--outline">Explore Our Services</Link>
            </div>
          </div>
          <div className="hero-art">
            <img src="/images/empire-logo-refined.svg" alt="Empire Beauty Space logo" className="hero-logo" />
            <p className="placeholder-note">Real studio/treatment photography can replace this panel once provided.</p>
          </div>
        </div>
      </section>

      <hr className="rule container" />

      {/* WHY CHOOSE US */}
      <section className="section" aria-labelledby="why-heading">
        <div className="container">
          <SectionHeading eyebrow="Why Empire Beauty Space" title="A beauty experience built around you" id="why-heading" />
          <div className="value-grid">
            <div className="value-item">
              <span className="num">I.</span>
              <h3>Personal attention</h3>
              <p>Every treatment is tailored to you — from consultation through aftercare.</p>
            </div>
            <div className="value-item">
              <span className="num">II.</span>
              <h3>A trusted local space</h3>
              <p>Conveniently located at Maombini Plaza on Kenyatta Avenue, Nakuru.</p>
            </div>
            <div className="value-item">
              <span className="num">III.</span>
              <h3>Simple booking</h3>
              <p>Request an appointment online and we'll confirm the details with you directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="section section--panel" aria-labelledby="about-preview-heading">
        <div className="container about-grid">
          <div>
            <span className="eyebrow">About Us</span>
            <h2 id="about-preview-heading">Get to know {business.name}</h2>
            {about.intro ? (
              <p>{about.intro}</p>
            ) : (
              <EmptyState title="Business story coming soon">
                Once {business.name} shares its story, mission, and values, they'll appear here — no placeholder claims are shown in the meantime.
              </EmptyState>
            )}
            <p style={{ marginTop: "1.5rem" }}>
              <Link to="/about" className="btn btn--outline">More about us</Link>
            </p>
          </div>
          <div>
            <div className="about-card">
              <h3>Our mission</h3>
              <p>{about.mission || "To be added — share your mission statement and it will appear here."}</p>
            </div>
            <div className="about-card">
              <h3>Our vision</h3>
              <p>{about.vision || "To be added — share your vision statement and it will appear here."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="section" aria-labelledby="featured-services-heading">
        <div className="container">
          <SectionHeading eyebrow="Featured Services" title="Popular with our clients" id="featured-services-heading" />
          {fServices.length ? (
            <div className="catalog-grid">
              {fServices.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          ) : (
            <EmptyState title="Service catalogue coming soon">
              Our full list of services, categories, pricing and durations will appear here as soon as they're confirmed. Feel free to request an appointment and let us know what you're interested in.
            </EmptyState>
          )}
          {fServices.length ? (
            <p style={{ marginTop: "2rem" }}>
              <Link to="/services" className="btn btn--outline">View all services</Link>
            </p>
          ) : null}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section section--panel" aria-labelledby="featured-products-heading">
        <div className="container">
          <SectionHeading eyebrow="Featured Products" title="What we recommend and use" id="featured-products-heading" />
          {fProducts.length ? (
            <div className="catalog-grid">
              {fProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <EmptyState title="Product showcase coming soon">
              Products Empire Beauty Space offers or uses will be added here for browsing — they're for enquiry, not online purchase.
            </EmptyState>
          )}
          {fProducts.length ? (
            <p style={{ marginTop: "2rem" }}>
              <Link to="/products" className="btn btn--outline">View all products</Link>
            </p>
          ) : null}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" aria-labelledby="testimonials-heading">
        <div className="container">
          <SectionHeading eyebrow="Testimonials" title="What clients say" id="testimonials-heading" />
          {testimonials.length ? (
            <div className="catalog-grid">
              {testimonials.map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
            </div>
          ) : (
            <EmptyState title="No testimonials published yet">
              Real client reviews will be added here as they come in — this section only ever shows genuine testimonials.
            </EmptyState>
          )}
        </div>
      </section>

      {/* SOCIAL */}
      <section className="section section--tight section--panel" aria-labelledby="social-heading">
        <div className="container">
          <div className="section-head" style={{ marginBottom: "1.5rem" }}>
            <span className="eyebrow">Follow Along</span>
            <h2 id="social-heading">Stay connected with {business.name}</h2>
          </div>
          <div className="hero-actions">
            <a className="btn btn--outline" href={instagramLink()} target="_blank" rel="noopener noreferrer">Instagram · @{business.social.instagram}</a>
            <a className="btn btn--outline" href={tiktokLink()} target="_blank" rel="noopener noreferrer">TikTok · @{business.social.tiktok}</a>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="section" aria-labelledby="contact-cta-heading">
        <div className="container" style={{ textAlign: "center" }}>
          <SectionHeading eyebrow="Get in Touch" title="Ready to book your visit?" center id="contact-cta-heading" />
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link to="/contact#booking" className="btn btn--primary">Request an Appointment</Link>
          </div>
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
            <ContactActions />
          </div>
        </div>
      </section>
    </>
  );
}
