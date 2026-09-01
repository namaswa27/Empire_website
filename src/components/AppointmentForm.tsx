import { useState, type FormEvent } from "react";
import { activeServices } from "../utils/catalog";
import type { Category } from "../data/categories";
import { serviceCategories } from "../data/categories";
import { whatsAppLink, mailtoLink } from "../utils/contact";

interface AppointmentFormProps {
  /** Pre-selects a service, e.g. when arriving via a service's "Book Appointment" button. */
  initialServiceSlug?: string;
}

function groupByCategory(categories: Category[]) {
  const services = activeServices().filter((s) => s.bookingAvailable !== false);
  return categories
    .map((cat) => ({ cat, services: services.filter((s) => s.categoryId === cat.id) }))
    .filter((g) => g.services.length > 0);
}

export default function AppointmentForm({ initialServiceSlug }: AppointmentFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(initialServiceSlug ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<null | { type: "success" | "error"; text: string }>(null);

  const groups = groupByCategory(serviceCategories);

  function isValidPhone(v: string) {
    return /^[+0-9()\-\s]{7,}$/.test(v);
  }
  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function isFutureOrToday(v: string) {
    if (!v) return false;
    const chosen = new Date(v + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return chosen >= today;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);

    const nextErrors: Record<string, boolean> = {
      name: !name.trim(),
      phone: !isValidPhone(phone),
      email: !!email && !isValidEmail(email),
      service: !service,
      date: !isFutureOrToday(date),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setStatus({ type: "error", text: "Please check the highlighted fields and try again." });
      return;
    }

    const serviceName =
      service === "general" ? "General enquiry — not sure yet" : activeServices().find((s) => s.slug === service)?.name ?? service;

    const lines = [
      "Appointment Request",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Service: ${serviceName}`,
      `Preferred date: ${date}`,
      time ? `Preferred time: ${time}` : null,
      message ? `Message: ${message}` : null,
    ].filter(Boolean);
    const text = lines.join("\n");

    const wa = whatsAppLink(text);
    const mail = mailtoLink("Appointment Request", text);
    const link = wa ?? mail;

    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
      setStatus({
        type: "success",
        text: wa
          ? "Your appointment request is ready — continue in WhatsApp to send it. Empire Beauty Space will confirm your appointment; no payment is required."
          : "Your appointment request is ready — continue in your email app to send it. Empire Beauty Space will confirm your appointment; no payment is required.",
      });
    } else {
      setStatus({
        type: "success",
        text: `Please call ${name ? "us" : "Empire Beauty Space"} directly to confirm your request — no online contact channel is configured yet.`,
      });
    }
  }

  return (
    <div className="form-card">
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "0.35rem" }}>
        Request an appointment
      </h3>
      <p className="form-note">This is an appointment request, not a confirmed booking — Empire Beauty Space will contact you to confirm. No payment is required.</p>

      {status ? (
        <div className={`form-status ${status.type === "success" ? "is-success" : "is-error"}`} role="status">
          {status.text}
        </div>
      ) : null}

      <form noValidate onSubmit={handleSubmit}>
        <div className="field-row">
          <div className={`field${errors.name ? " has-error" : ""}`}>
            <label htmlFor="bk-name">Full name <span className="required">*</span></label>
            <input id="bk-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="field-error">Please enter your name.</div>
          </div>
          <div className={`field${errors.phone ? " has-error" : ""}`}>
            <label htmlFor="bk-phone">Phone number <span className="required">*</span></label>
            <input id="bk-phone" name="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <div className="field-error">Please enter a valid phone number.</div>
          </div>
        </div>

        <div className={`field${errors.email ? " has-error" : ""}`}>
          <label htmlFor="bk-email">Email (optional)</label>
          <input id="bk-email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="field-error">Please enter a valid email address.</div>
        </div>

        <div className="field-row">
          <div className={`field${errors.service ? " has-error" : ""}`}>
            <label htmlFor="bk-service">Service <span className="required">*</span></label>
            <select id="bk-service" name="service" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">Select a service</option>
              <option value="general">General enquiry — not sure yet</option>
              {groups.map((g) => (
                <optgroup key={g.cat.id} label={g.cat.name}>
                  {g.services.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="field-error">Please select a service.</div>
          </div>
          <div className={`field${errors.date ? " has-error" : ""}`}>
            <label htmlFor="bk-date">Preferred date <span className="required">*</span></label>
            <input id="bk-date" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <div className="field-error">Please choose a valid, future date.</div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="bk-time">Preferred time</label>
          <input id="bk-time" name="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="bk-message">Message (optional)</label>
          <textarea id="bk-message" name="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        <button type="submit" className="btn btn--primary btn--block">Request Appointment</button>
      </form>
    </div>
  );
}
