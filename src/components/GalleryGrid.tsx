import type { GalleryImage } from "../data/gallery";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  return (
    <div className="gallery-grid">
      {images.map((img) => (
        <div className="gallery-tile" key={img.id}>
          <img src={img.src} alt={img.alt} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
