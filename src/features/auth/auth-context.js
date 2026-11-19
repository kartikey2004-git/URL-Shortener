import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

/**
 * Returns `{ user, isAuthenticated, loading, refreshUser }`.
 * `loading` is true until the persisted session has been read once.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
