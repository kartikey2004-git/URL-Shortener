/**
 * Slug policy for short links.
 *
 * Two different inputs exist and they are deliberately treated differently:
 *
 *  - NEW custom slugs (create flow) must satisfy the strict policy below.
 *  - LOOKUP slugs (resolving `/:slug`) may be legacy values created before the
 *    policy existed, so they only get a permissive sanity check. They are never
 *    interpolated into a PostgREST expression; see `getLongUrl`.
 *
 * The same custom-slug rules are enforced in Postgres by a CHECK constraint
 * (see supabase/migrations), so clients that bypass this module are covered.
 */

export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 32;

/** Upper bound for a slug we are willing to look up (legacy slugs included). */
export const LOOKUP_MAX_LENGTH = 64;

/**
 * Lowercase letters, digits, `-` and `_`; must start and end with a letter or
 * digit. Case is folded so `Promo` and `promo` can never be two different links.
 */
const CUSTOM_SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]*[a-z0-9]$/;

/**
 * Paths that are (or may become) application routes or look like infrastructure
 * endpoints. Keep in sync with the CHECK constraint in the slug migration.
 */
export const RESERVED_SLUGS = Object.freeze([
  "about",
  "admin",
  "api",
  "app",
  "assets",
  "auth",
  "create",
  "dashboard",
  "help",
  "link",
  "links",
  "login",
  "logout",
  "new",
  "null",
  "privacy",
  "register",
  "robots",
  "settings",
  "signin",
  "signup",
  "sitemap",
  "static",
  "support",
  "terms",
  "undefined",
  "www",
]);

const RESERVED_SET = new Set(RESERVED_SLUGS);

export function isReservedSlug(slug) {
  return RESERVED_SET.has(slug);
}

/** Trim and lowercase a user-typed custom slug. Non-strings become "". */
export function normalizeCustomSlug(input) {
  return typeof input === "string" ? input.trim().toLowerCase() : "";
}

/**
 * Validates a user-typed custom slug.
 *
 * Returns `{ slug, error }`. An empty input is valid and yields `slug: null`
 * (meaning "generate a code for me").
 */
export function validateCustomSlug(input) {
  const slug = normalizeCustomSlug(input);
  if (slug === "") return { slug: null, error: null };

  if (slug.length < SLUG_MIN_LENGTH || slug.length > SLUG_MAX_LENGTH) {
    return {
      slug: null,
      error: `Custom URL must be ${SLUG_MIN_LENGTH}-${SLUG_MAX_LENGTH} characters long`,
    };
  }
  if (!CUSTOM_SLUG_PATTERN.test(slug)) {
    return {
      slug: null,
      error:
        "Custom URL may only contain letters, numbers, hyphens and underscores, and must start and end with a letter or number",
    };
  }
  if (isReservedSlug(slug)) {
    return { slug: null, error: "This custom URL is reserved. Please choose another" };
  }
  return { slug, error: null };
}

/**
 * Normalizes a slug taken from the URL path before it is used in a query.
 *
 * Returns the trimmed slug, or `null` when it cannot possibly identify a link
 * (empty, too long, or containing whitespace, control characters or path
 * separators). Everything else is passed through verbatim - including commas,
 * parentheses, quotes and dots - because it is only ever bound as a single
 * `eq` value, where those characters carry no meaning. Case is NOT folded:
 * legacy custom slugs may be mixed-case and must keep resolving.
 */
export function normalizeLookupSlug(input) {
  if (typeof input !== "string") return null;
  const slug = input.trim();
  if (slug.length === 0 || slug.length > LOOKUP_MAX_LENGTH) return null;
  // \p{C}: control/format/unassigned/surrogate code points.
  if (/[\s\p{C}/\\]/u.test(slug)) return null;
  return slug;
}

const SHORT_CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Cryptographically random short code over `[a-z0-9]`.
 *
 * Uses rejection sampling so every character is equally likely (256 is not a
 * multiple of 36, so a plain modulo would favour the first four characters).
 * Codes that collide with a reserved slug are discarded and redrawn.
 */
export function generateShortCode(length, cryptoImpl = globalThis.crypto) {
  const maxUnbiased = 256 - (256 % SHORT_CODE_ALPHABET.length);

  for (;;) {
    let code = "";
    while (code.length < length) {
      const bytes = cryptoImpl.getRandomValues(new Uint8Array(length * 2));
      for (const byte of bytes) {
        if (byte >= maxUnbiased) continue;
        code += SHORT_CODE_ALPHABET[byte % SHORT_CODE_ALPHABET.length];
        if (code.length === length) break;
      }
    }
    if (!isReservedSlug(code)) return code;
  }
}
