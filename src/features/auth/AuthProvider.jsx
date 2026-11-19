import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { useFetch } from "@/hooks/use-fetch";
import { getCurrentUser } from "./api";
import { AuthContext } from "./auth-context";

/** Loads the persisted session once and exposes the current user to the app. */
export function AuthProvider({ children }) {
  const { data: user, loading: refreshing, run } = useFetch(getCurrentUser);
  const [initialised, setInitialised] = useState(false);

  const refreshUser = useCallback(() => run(), [run]);

  useEffect(() => {
    let active = true;
    refreshUser().then(() => {
      if (active) setInitialised(true);
    });
    return () => {
      active = false;
    };
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user?.role === "authenticated",
      loading: refreshing || !initialised,
      refreshUser,
    }),
    [user, refreshing, initialised, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
