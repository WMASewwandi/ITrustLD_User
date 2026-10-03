const MAX_EDGE = 1600;
const MAX_BYTES = 700 * 1024;

function canvasBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

/**
 * Shrink camera photos before upload. Large files are dropped by the network
 * or proxy and the browser only reports "Failed to fetch".
 */
export async function prepareUploadImage(file) {
  if (!file || typeof document === "undefined") return file;
  const name = String(file.name || "document");
  const type = String(file.type || "").toLowerCase();
  const looksImage = type.startsWith("image/") || /\.(jpe?g|png|gif|bmp|webp)$/i.test(name);
  if (!looksImage) return file;
  if (file.size > 0 && file.size <= MAX_BYTES) return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);

    let quality = 0.82;
    let blob = await canvasBlob(canvas, "image/jpeg", quality);
    while (blob && blob.size > MAX_BYTES && quality > 0.45) {
      quality = Math.round((quality - 0.1) * 100) / 100;
      blob = await canvasBlob(canvas, "image/jpeg", quality);
    }
    if (!blob) return file;
    const base = name.replace(/\.[^.]+$/, "") || "document";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
  } finally {
    bitmap.close?.();
  }
}
