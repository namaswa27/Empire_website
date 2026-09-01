import { business } from "../data/business";
import { whatsAppLink, instagramLink, tiktokLink, directionsLink } from "../utils/contact";

interface ContactActionsProps {
  whatsAppMessage?: string;
  variant?: "outline" | "primary";
}

/** Call / WhatsApp / Instagram / TikTok / Get Directions — always built
 * from data/business.ts, never hardcoded per-page. */
export default function ContactActions({ whatsAppMessage = "Hi Empire Beauty Space, I'd like to find out more.", variant = "outline" }: ContactActionsProps) {
  const wa = whatsAppLink(whatsAppMessage);
  const btnClass = `btn btn--${variant}`;

  return (
    <div className="contact-actions-row">
      <a className={btnClass} href={business.phoneHref}>Call Us</a>
      {wa ? (
        <a className={btnClass} href={wa} target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
      ) : null}
      <a className={btnClass} href={instagramLink()} target="_blank" rel="noopener noreferrer">Instagram</a>
      <a className={btnClass} href={tiktokLink()} target="_blank" rel="noopener noreferrer">TikTok</a>
      <a className={btnClass} href={directionsLink()} target="_blank" rel="noopener noreferrer">Get Directions</a>
    </div>
  );
}
