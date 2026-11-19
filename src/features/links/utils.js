/** Public short link for a link row (custom slug wins over the generated code). */
export function getShortUrl(link) {
  return `${window.location.origin}/${link.custom_url || link.short_url}`;
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

const IMAGE_EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

/** QR codes are always uploaded as PNG; used when storage reports no usable type. */
const FALLBACK_QR_TYPE = "image/png";

/** How long the temporary object URL stays valid after the click that uses it. */
const OBJECT_URL_REVOKE_DELAY_MS = 1000;

/** `"Summer Campaign!"` -> `"summer-campaign-qr"`, safe for any file system. */
export function getQrBaseName(title) {
  const slug = String(title ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return `${slug || "link"}-qr`;
}

/**
 * Downloads the link's QR code image.
 *
 * `<a download>` is ignored by browsers for cross-origin URLs (the image just
 * opens), so the image is fetched and saved from a same-origin `blob:` URL.
 * This needs the storage host to send CORS headers (Supabase public buckets
 * do; see README). Every failure throws an Error with a user-facing message;
 * a resolved promise means the browser was handed the file.
 */
export async function downloadQrCode(link) {
  if (!link?.qr) throw new Error("This link has no QR code to download.");

  let response;
  try {
    response = await fetch(link.qr, { mode: "cors" });
  } catch (error) {
    console.error("QR download request failed:", error);
    throw new Error(
      "Couldn't download the QR code. Check your connection and try again."
    );
  }

  if (!response.ok) {
    console.error("QR download failed with HTTP", response.status, link.qr);
    throw new Error(`Couldn't download the QR code (server returned ${response.status}).`);
  }

  let blob = await response.blob();
  let type = (blob.type || response.headers.get("content-type") || "")
    .split(";")[0]
    .trim()
    .toLowerCase();

  // Older uploads may have been stored without a content type.
  if (type === "" || type === "application/octet-stream") type = FALLBACK_QR_TYPE;

  const extension = IMAGE_EXTENSIONS[type];
  if (!extension) {
    throw new Error(`Couldn't download the QR code: unsupported file type (${type}).`);
  }
  if (blob.size === 0) throw new Error("Couldn't download the QR code: the file is empty.");
  if (blob.type !== type) blob = new Blob([blob], { type });

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `${getQrBaseName(link.title)}.${extension}`;
  anchor.style.display = "none";

  try {
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    // The download has started synchronously by now; revoke shortly after so
    // browsers that read the blob lazily (Safari) still get it.
    setTimeout(() => URL.revokeObjectURL(objectUrl), OBJECT_URL_REVOKE_DELAY_MS);
  }
}

export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString();
}
