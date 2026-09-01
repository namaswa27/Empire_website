import type { Testimonial } from "../data/testimonials";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="testimonial-card">
      <p className="quote">“{testimonial.quote}”</p>
      <p className="who">
        {testimonial.name}
        {testimonial.date ? ` · ${testimonial.date}` : ""}
      </p>
    </div>
  );
}
