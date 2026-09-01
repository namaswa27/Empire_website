/**
 * Gallery images of the space, treatments, and results. No stock or
 * placeholder photography is shown as if it were real work — this
 * stays empty until real photos are added.
 */

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category?: "space" | "makeup" | "skincare" | "bodycare" | "services" | "results";
}

export const galleryImages: GalleryImage[] = [];
