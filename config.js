/**
 * EMPIRE BEAUTY SPACE — SITE CONTENT CONFIGURATION
 * ---------------------------------------------------------------
 * This is the single source of truth for all business content.
 * Update names, copy, services, hours, gallery, and testimonials
 * here — nothing else in the site should need to change.
 *
 * When a real backend/admin panel is built later, this file is
 * exactly what that admin panel would be editing in a database.
 * ---------------------------------------------------------------
 */

const SITE_CONFIG = {
  business: {
    name: "Empire Beauty Space",
    tagline: "Where Beauty Meets Confidence",
    phone: "0728 864 460",
    phoneHref: "tel:+254728864460",
    email: null, // not yet provided — contact section hides this field until set
    whatsapp: "+254728864460",
    address: {
      line1: "Maombini Plaza, Kenyatta Avenue",
      line2: "G16, Nakuru",
      mapQuery: "Maombini Plaza, Kenyatta Avenue, Nakuru",
    },
    social: {
      instagram: "empire_beauty_space",
      tiktok: "empire.beauty.space",
    },
  },

  // Set to null/[] until real hours are provided — the UI shows an
  // honest "hours coming soon" state rather than inventing hours.
  hours: null,
  // Example of the shape once provided:
  // hours: [
  //   { day: "Monday", open: "09:00", close: "18:00" },
  //   { day: "Tuesday", open: "09:00", close: "18:00" },
  //   ...
  //   { day: "Sunday", open: null, close: null }, // null = closed
  // ],

  about: {
    intro: null, // awaiting real business description
    mission: null,
    vision: null,
    values: [],
  },

  serviceCategories: [
    // Populate with real categories + services when provided, e.g.:
    // {
    //   name: "Skincare",
    //   services: [
    //     {
    //       slug: "signature-facial",
    //       name: "Signature Facial",
    //       description: "...",
    //       duration: "60 min",
    //       price: null, // null = "Price on request"
    //       image: null,
    //       benefits: [],
    //       preparation: null,
    //       aftercare: null,
    //     },
    //   ],
    // },
  ],

  gallery: [
    // { image: "/images/gallery-1.jpg", caption: "..." },
  ],

  testimonials: [
    // { name: "...", quote: "...", rating: 5, date: "..." },
  ],

  faqs: [
    // { question: "...", answer: "..." },
  ],
};
