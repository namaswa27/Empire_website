/**
 * Frequently asked questions, shown on the Contact page once
 * populated. Stays empty until real Q&A content is provided.
 */

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const faqs: Faq[] = [];
