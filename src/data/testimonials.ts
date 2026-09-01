/**
 * Client testimonials. Only ever populate this with genuine reviews
 * — this section stays empty rather than showing invented quotes.
 */

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating?: number; // 1-5
  date?: string;
}

export const testimonials: Testimonial[] = [];
