import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import { PageProgress } from "@/components/shared/PageProgress";
import { routes } from "@/lib/routes";
import { useAuth } from "./auth-context";

/** Renders its children only for signed-in users; everyone else goes to /auth. */
export function RequireAuth({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <PageProgress />;
  if (!isAuthenticated) return <Navigate to={routes.auth} replace />;

  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
