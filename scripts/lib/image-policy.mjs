/**
 * Image acceptance policy for product photographs.
 *
 * Security notes:
 * - The accepted format is decided by the file's own bytes (magic
 *   signatures), never by its filename or the browser-supplied MIME type.
 * - Decoding is delegated to sharp (libvips), a maintained image library.
 * - Dimensions and pixel counts are checked BEFORE any pixel buffer is
 *   allocated, which blocks decompression-bomb style inputs.
 * - Error messages are generic and never include filesystem paths or
 *   library internals, so they are safe to show to the site owner.
 */
import sharp from "sharp";

export const LIMITS = Object.freeze({
  maxBytes: 5 * 1024 * 1024, // 5 MB per original upload
  maxPixels: 20_000_000, // 20 megapixels
  maxSide: 8000, // longest side, in px
  minSide: 300, // shortest side, in px (too small to show well)
  maxImagesPerProduct: 12,
});

export const ACCEPTED_EXTENSIONS = Object.freeze([".jpg", ".jpeg", ".png", ".webp"]);

export class ImageRejectedError extends Error {
  constructor(message) {
    super(message);
    this.name = "ImageRejectedError";
  }
}

const SIGNATURES = {
  jpeg: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: (b) =>
    b.length >= 8 &&
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  webp: (b) =>
    b.length >= 12 &&
    b.toString("ascii", 0, 4) === "RIFF" &&
    b.toString("ascii", 8, 12) === "WEBP",
};

/** Returns "jpeg" | "png" | "webp" based on magic bytes, or null. */
export function sniffFormat(buffer) {
  for (const [format, matches] of Object.entries(SIGNATURES)) {
    if (matches(buffer)) return format;
  }
  return null;
}

/**
 * Validates an uploaded photo buffer. Resolves with the verified format and
 * dimensions, or throws ImageRejectedError with a user-safe message.
 */
export async function inspectImage(buffer, limits = LIMITS) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new ImageRejectedError("The file is empty.");
  }
  if (buffer.length > limits.maxBytes) {
    throw new ImageRejectedError(
      `The file is larger than ${Math.round(limits.maxBytes / (1024 * 1024))} MB. Please compress it and try again.`
    );
  }

  const sniffed = sniffFormat(buffer);
  if (!sniffed) {
    throw new ImageRejectedError("Only JPEG, PNG and WebP photographs are accepted.");
  }

  // Header-only read: dimensions are known without decoding pixels.
  let meta;
  try {
    meta = await sharp(buffer, { failOn: "none", limitInputPixels: false }).metadata();
  } catch {
    throw new ImageRejectedError("This file is not a valid image.");
  }

  if (meta.format !== sniffed) {
    throw new ImageRejectedError("This file is not a valid image.");
  }
  if ((meta.pages ?? 1) > 1) {
    throw new ImageRejectedError("Animated images are not accepted. Please upload a still photograph.");
  }

  const { width, height } = meta;
  if (!width || !height) {
    throw new ImageRejectedError("This file is not a valid image.");
  }
  if (width * height > limits.maxPixels) {
    throw new ImageRejectedError(
      `The photo is too large (${width}×${height}). The maximum is ${Math.round(limits.maxPixels / 1_000_000)} megapixels.`
    );
  }
  if (Math.max(width, height) > limits.maxSide) {
    throw new ImageRejectedError(`The longest side must be ${limits.maxSide}px or less.`);
  }
  if (Math.min(width, height) < limits.minSide) {
    throw new ImageRejectedError(`The shortest side must be at least ${limits.minSide}px so the photo stays sharp.`);
  }

  return { format: sniffed, width, height };
}
