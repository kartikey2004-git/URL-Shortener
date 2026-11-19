/**
 * Logs the underlying error for debugging and throws one with a user-facing
 * message. Every API function funnels failures through here so callers always
 * receive an Error whose `message` is safe to display.
 */
export function raiseApiError(error, userMessage) {
  console.error(error);
  throw new Error(userMessage ?? error.message);
}
