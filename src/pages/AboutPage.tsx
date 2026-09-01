import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { business, about, businessHours } from "../data/business";
import SectionHeading from "../components/SectionHeading";
import EmptyState from "../components/EmptyState";

export default function AboutPage() {
  useDocumentMeta({
    title: "About Us",
    description: `Learn about ${business.name}, a beauty destination in Nakuru.`,
  });

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About Us</span>
          <h1>Get to know {business.name}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div>
            {about.intro ? (
              <p>{about.intro}</p>
            ) : (
              <EmptyState title="Business story coming soon">
                Once {business.name} shares its story, they'll appear here — no placeholder claims are shown in the meantime.
              </EmptyState>
            )}

            {about.values.length ? (
              <>
                <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Our values</h3>
                <ul className="values-list">
                  {about.values.map((v) => <li key={v}>{v}</li>)}
                </ul>
              </>
            ) : null}
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

      <section className="section section--panel">
        <div className="container">
          <SectionHeading eyebrow="Business Information" title="Hours & location" />
          <div className="value-grid">
            <div className="value-item">
              <h3>Business hours</h3>
              {businessHours && businessHours.length ? (
                <p>
                  {businessHours.map((h) => (
                    <span key={h.day}>
                      {h.day}: {h.open ? `${h.open} – ${h.close}` : "Closed"}<br />
                    </span>
                  ))}
                </p>
              ) : (
                <p>Coming soon — hours will be listed here once confirmed.</p>
              )}
            </div>
            <div className="value-item">
              <h3>Location</h3>
              <p>{business.address.line1}<br />{business.address.line2}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
