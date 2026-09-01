/**
 * Central business information. Every phone number, address, and
 * social handle used anywhere in the app is read from here — never
 * hardcode contact details inside a component or page.
 */

export interface BusinessHours {
  day: string;
  open: string | null; // e.g. "09:00"; null = closed
  close: string | null;
}

export interface AboutContent {
  intro: string | null;
  mission: string | null;
  vision: string | null;
  values: string[];
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  email: string | null;
  /** Digits-only, international format, no "+" — used to build wa.me links. Null hides WhatsApp actions. */
  whatsapp: string | null;
  address: {
    line1: string;
    line2: string;
    mapQuery: string;
  };
  social: {
    instagram: string;
    tiktok: string;
  };
}

export const business: BusinessInfo = {
  name: "Empire Beauty Space",
  tagline: "Where Beauty Meets Confidence",
  phone: "0728 864 460",
  phoneHref: "tel:+254728864460",
  email: null, // not yet provided — contact section hides this field until set
  whatsapp: "254728864460",
  address: {
    line1: "Maombini Plaza, Kenyatta Avenue",
    line2: "G16, Nakuru",
    mapQuery: "Maombini Plaza, Kenyatta Avenue, Nakuru",
  },
  social: {
    instagram: "empire_beauty_space",
    tiktok: "empire.beauty.space",
  },
};

// Set to null until real hours are provided — the UI shows an honest
// "hours coming soon" state rather than inventing hours. Shape once
// provided:
// export const businessHours: BusinessHours[] = [
//   { day: "Monday", open: "09:00", close: "18:00" },
//   { day: "Sunday", open: null, close: null }, // null = closed
// ];
export const businessHours: BusinessHours[] | null = null;

export const about: AboutContent = {
  intro: null, // awaiting real business description
  mission: null,
  vision: null,
  values: [],
};
