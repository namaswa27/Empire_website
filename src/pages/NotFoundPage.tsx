import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

interface NotFoundPageProps {
  message?: string;
  backTo?: string;
  backLabel?: string;
}

export default function NotFoundPage({
  message = "The page you're looking for doesn't exist or may have moved.",
  backTo = "/",
  backLabel = "Back to Home",
}: NotFoundPageProps) {
  useDocumentMeta({ title: "Page not found" });

  return (
    <div className="container not-found">
      <span className="eyebrow">404</span>
      <h1>We couldn't find that page</h1>
      <p style={{ margin: "1rem auto 2rem", maxWidth: "48ch" }}>{message}</p>
      <Link to={backTo} className="btn btn--primary">{backLabel}</Link>
    </div>
  );
}
