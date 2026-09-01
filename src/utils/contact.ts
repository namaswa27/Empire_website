import { business } from "../data/business";

/** Builds a wa.me deep link with a prefilled message. Returns null if no WhatsApp number is configured. */
export function whatsAppLink(message: string): string | null {
  if (!business.whatsapp) return null;
  const digits = business.whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string): string | null {
  if (!business.email) return null;
  return `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function directionsLink(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address.mapQuery)}`;
}

export function instagramLink(): string {
  return `https://instagram.com/${business.social.instagram}`;
}
export function tiktokLink(): string {
  return `https://www.tiktok.com/@${business.social.tiktok}`;
}

/** Best available contact channel for a quick enquiry: WhatsApp, then email, then null (caller should fall back to phone/contact page). */
export function bestEnquiryLink(message: string): { href: string; label: string } | null {
  const wa = whatsAppLink(message);
  if (wa) return { href: wa, label: "Enquire on WhatsApp" };
  const mail = mailtoLink("Product enquiry", message);
  if (mail) return { href: mail, label: "Enquire by Email" };
  return null;
}

export function formatPrice(
  price: number | null | undefined,
  mode: "fixed" | "from" | "on_request" | undefined
): string {
  if (mode === "on_request" || price == null) return "Price on request";
  const formatted = `KSh ${price.toLocaleString("en-KE")}`;
  return mode === "from" ? `From ${formatted}` : formatted;
}
