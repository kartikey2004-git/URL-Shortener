import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { RequireAuth } from "@/features/auth/RequireAuth";
import RedirectPage from "@/pages/RedirectPage";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const LinkDetailsPage = lazy(() => import("@/pages/LinkDetailsPage"));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      { path: "/auth", element: <AuthPage /> },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <LinkDetailsPage />
          </RequireAuth>
        ),
      },
      { path: "/:id", element: <RedirectPage /> },
    ],
  },
]);
