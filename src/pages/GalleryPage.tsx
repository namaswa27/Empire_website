import { useDocumentMeta } from "../hooks/useDocumentMeta";
import EmptyState from "../components/EmptyState";
import GalleryGrid from "../components/GalleryGrid";
import { galleryImages } from "../data/gallery";

export default function GalleryPage() {
  useDocumentMeta({
    title: "Gallery",
    description: "A look inside Empire Beauty Space — the space, treatments, and results.",
  });

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Gallery</span>
          <h1>A look inside Empire Beauty Space</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          {galleryImages.length ? (
            <GalleryGrid images={galleryImages} />
          ) : (
            <EmptyState title="Gallery coming soon">
              Photos of treatments, the space, and results will be added here — no stock or placeholder imagery is shown as if it were real work.
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
