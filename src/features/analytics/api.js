import supabase from "@/lib/supabase";
import { raiseApiError } from "@/lib/api-error";
import { GEO_LOOKUP_URL } from "@/lib/constants";

/** Clicks for several links at once (dashboard totals). */
export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) raiseApiError(error, "Unable to load clicks");
  return data;
}

/** Clicks for a single link (link detail analytics). */
export async function getClicksForUrl(urlId) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", urlId);

  if (error) raiseApiError(error, "Unable to load stats");
  return data;
}

/**
 * Records a click with the visitor's device and approximate location.
 * Best effort: a failed lookup or insert is logged and never blocks the
 * visitor from reaching their destination.
 */
export async function recordClick(urlId) {
  try {
    // Loaded on demand: only the redirect path needs it, and it is ~22 kB.
    const { UAParser } = await import("ua-parser-js");
    const device = new UAParser().getResult().type || "desktop";

    const response = await fetch(GEO_LOOKUP_URL);
    const { city, country_name: country } = await response.json();

    const { error } = await supabase
      .from("clicks")
      .insert({ url_id: urlId, city, country, device });

    if (error) throw error;
  } catch (error) {
    console.error("Error recording click:", error);
  }
}
