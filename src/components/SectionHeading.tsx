interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
  id?: string;
}

export default function SectionHeading({ eyebrow, title, description, center, id }: SectionHeadingProps) {
  return (
    <div className={`section-head${center ? " section-head--center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
