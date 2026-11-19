import supabase, { supabaseUrl } from "@/lib/supabase";
import { raiseApiError } from "@/lib/api-error";
import { SHORT_CODE_LENGTH, STORAGE_BUCKETS } from "@/lib/constants";
import {
  generateShortCode,
  normalizeLookupSlug,
  validateCustomSlug,
} from "./slug";

/** Postgres unique-violation error code. */
const UNIQUE_VIOLATION = "23505";

/** How many freshly generated short codes we try before giving up. */
export const MAX_SHORT_CODE_ATTEMPTS = 5;

const SHORT_URL_NOT_FOUND = "This short link does not exist";

/**
 * True when `error` is a unique violation on `column` specifically. A unique
 * violation on any other column (or any other error) must not be retried or
 * reported as a short-code clash. PostgREST reports the constraint name in
 * `message` (`..."urls_short_url_key"`) and the column in `details`
 * (`Key (short_url)=(abcd) already exists.`).
 */
function isUniqueViolationOn(error, column) {
  if (error?.code !== UNIQUE_VIOLATION) return false;
  const text = `${error.message ?? ""} ${error.details ?? ""}`;
  return text.includes(`urls_${column}_key`) || text.includes(`(${column})`);
}

export async function getUrls(userId) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", userId);

  if (error) raiseApiError(error, "Unable to load URLs");
  return data;
}

export async function getUrl({ id, userId }) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) raiseApiError(error, "Short URL not found");
  return data;
}

/** Finds the link whose `column` equals `slug`; `null` when there is none. */
async function findLinkBy(column, slug) {
  // `.eq()` binds the slug as a single filter value. Unlike `.or()`, which
  // parses a comma/parenthesis-delimited expression, nothing inside the value
  // can add, remove or reshape conditions.
  const { data, error } = await supabase
    .from("urls")
    .select("id,original_url")
    .eq(column, slug)
    .limit(1)
    .maybeSingle();

  if (error) raiseApiError(error, "Unable to resolve this short link");
  return data;
}

/**
 * Resolves a short code or custom slug to the link it points at.
 *
 * A custom slug wins over a generated code, mirroring `getShortUrl`, which
 * shows the custom slug whenever a link has one.
 */
export async function getLongUrl(rawSlug) {
  const slug = normalizeLookupSlug(rawSlug);
  if (slug === null) throw new Error(SHORT_URL_NOT_FOUND);

  const link =
    (await findLinkBy("custom_url", slug)) ?? (await findLinkBy("short_url", slug));
  if (!link) throw new Error(SHORT_URL_NOT_FOUND);
  return link;
}

/** Best-effort removal of an uploaded QR image whose link row was never created. */
async function discardQrImage(fileName) {
  try {
    await supabase.storage.from(STORAGE_BUCKETS.qrCodes).remove([fileName]);
  } catch (error) {
    console.error("Failed to clean up orphaned QR image:", error);
  }
}

/**
 * Uploads the QR code image, then inserts the link row. Returns the created rows.
 *
 * Short-code uniqueness is guaranteed by the `urls_short_url_key` UNIQUE
 * constraint, never by a prior existence check (which would race). We insert,
 * and only when Postgres reports a unique violation on `short_url` do we draw a
 * new code, up to MAX_SHORT_CODE_ATTEMPTS times.
 */
export async function createUrl({ title, longUrl, customUrl, userId }, qrCodeBlob) {
  const { slug: customSlug, error: slugError } = validateCustomSlug(customUrl);
  if (slugError) throw new Error(slugError);

  // The QR file name is independent of the short code so a retry with a new
  // code does not need to re-upload the image.
  const qrFileName = `qr-${crypto.randomUUID()}.png`;

  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKETS.qrCodes)
    .upload(qrFileName, qrCodeBlob, { contentType: "image/png" });

  if (storageError) raiseApiError(storageError);

  const qr = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKETS.qrCodes}/${qrFileName}`;

  for (let attempt = 1; attempt <= MAX_SHORT_CODE_ATTEMPTS; attempt++) {
    const { data, error } = await supabase
      .from("urls")
      .insert([
        {
          title,
          original_url: longUrl,
          custom_url: customSlug,
          user_id: userId,
          short_url: generateShortCode(SHORT_CODE_LENGTH),
          qr,
        },
      ])
      .select();

    if (!error) return data;

    if (isUniqueViolationOn(error, "short_url")) continue; // draw a new code

    await discardQrImage(qrFileName);
    if (isUniqueViolationOn(error, "custom_url")) {
      raiseApiError(error, "Custom URL already exists!");
    }
    raiseApiError(error, "Error creating short URL");
  }

  await discardQrImage(qrFileName);
  throw new Error("Couldn't generate a unique short code. Please try again.");
}

export async function deleteUrl(id) {
  const { data, error } = await supabase.from("urls").delete().eq("id", id);

  if (error) raiseApiError(error, "Unable to delete URL");
  return data;
}
