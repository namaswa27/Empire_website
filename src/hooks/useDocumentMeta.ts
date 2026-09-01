import { useEffect } from "react";

interface DocumentMeta {
  title: string;
  description?: string;
}

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Sets the document title and description/OG meta tags per page. No extra
 * dependency (react-helmet, etc.) — this app has very few routes, so a tiny
 * hook is enough and keeps the dependency count down. */
export function useDocumentMeta({ title, description }: DocumentMeta): void {
  useEffect(() => {
    const fullTitle = `${title} · Empire Beauty Space`;
    document.title = fullTitle;
    setMetaTag("property", "og:title", fullTitle);
    if (description) {
      setMetaTag("name", "description", description);
      setMetaTag("property", "og:description", description);
    }
  }, [title, description]);
}
