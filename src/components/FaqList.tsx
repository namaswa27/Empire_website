import type { Faq } from "../data/faqs";

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div>
      {faqs.map((f) => (
        <details className="faq-item" key={f.id}>
          <summary>{f.question}</summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
