import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { business } from "../data/business";
import AppointmentForm from "../components/AppointmentForm";
import FaqList from "../components/FaqList";
import EmptyState from "../components/EmptyState";
import SectionHeading from "../components/SectionHeading";
import { directionsLink } from "../utils/contact";
import { faqs } from "../data/faqs";

export default function ContactPage() {
  useDocumentMeta({
    title: "Contact & Booking",
    description: `Contact ${business.name} or request an appointment. Find us at ${business.address.line1}, ${business.address.line2}.`,
  });

  const location = useLocation();
  const serviceSlug = (location.state as { serviceSlug?: string } | null)?.serviceSlug;

  useEffect(() => {
    if (location.hash === "#booking") {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Visit or Reach Us</span>
          <h1>Contact & Location</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container contact-layout">
          <div>
            <div className="contact-panel">
              <div className="contact-item">
                <span className="contact-badge" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" stroke="currentColor" strokeWidth="1.4" /></svg>
                </span>
                <div>
                  <div className="label">Phone</div>
                  <a className="value" href={business.phoneHref}>{business.phone}</a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-badge" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.1 7-11.3A7 7 0 0 0 5 9.7C5 14.9 12 21 12 21Z" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.4" /></svg>
                </span>
                <div>
                  <div className="label">Location</div>
                  <div className="value">{business.address.line1}<br />{business.address.line2}</div>
                  <a className="value" style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.85rem", textDecoration: "underline" }} href={directionsLink()} target="_blank" rel="noopener noreferrer">
                    Get Directions →
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-badge" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.4" /></svg>
                </span>
                <div>
                  <div className="label">Instagram &amp; TikTok</div>
                  <div className="value">@{business.social.instagram} · @{business.social.tiktok}</div>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-badge" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                </span>
                <div>
                  <div className="label">Business Hours</div>
                  <div className="value">Coming soon — hours will be listed here once confirmed.</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "2.5rem" }}>
              <SectionHeading eyebrow="Common Questions" title="FAQs" />
              {faqs.length ? (
                <FaqList faqs={faqs} />
              ) : (
                <EmptyState title="No FAQs published yet">
                  Answers to common questions will appear here once added.
                </EmptyState>
              )}
            </div>
          </div>

          <div id="booking">
            <AppointmentForm initialServiceSlug={serviceSlug} />
          </div>
        </div>
      </section>
    </>
  );
}
