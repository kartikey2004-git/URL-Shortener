export const APP_NAME = "ShortenX";
export const APP_TAGLINE =
  "High-performance URL shortening for modern teams and creators.";

export const AUTHOR = {
  name: "Kartikey",
  twitter: "https://x.com/Bh20291Kartikey",
  github: "https://github.com/kartikey2004-git/URL-Shortener",
  linkedin: "https://www.linkedin.com/in/kartikey-bhatnagar-2702a4337",
};

/** Supabase storage bucket names. */
export const STORAGE_BUCKETS = {
  profilePics: "profile_pic",
  qrCodes: "qrs",
};

/** Number of characters in an auto-generated short code. */
export const SHORT_CODE_LENGTH = 4;

/** Public IP geolocation endpoint used to attribute clicks to a city/country. */
export const GEO_LOOKUP_URL = "https://ipapi.co/json";

/** Minimum password length enforced by the client-side forms. */
export const MIN_PASSWORD_LENGTH = 6;
