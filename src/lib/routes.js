/** Query parameter carrying a long URL through the login flow into the create-link dialog. */
export const CREATE_NEW_PARAM = "createNew";

export const routes = {
  home: "/",
  auth: "/auth",
  dashboard: "/dashboard",
  link: (id) => `/link/${id}`,
};

/**
 * Appends the pending long URL (if any) to a path so it survives the
 * login -> dashboard redirect. The value is URL-encoded.
 */
export function withPendingUrl(path, longUrl) {
  if (!longUrl) return path;
  return `${path}?${CREATE_NEW_PARAM}=${encodeURIComponent(longUrl)}`;
}
