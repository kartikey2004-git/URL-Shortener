import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { PageProgress } from "@/components/shared/PageProgress";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <>
      {/* Gutter lives on a wrapper, not <body>: Radix scroll-lock overwrites body padding when a dialog opens. */}
      <div className="px-3">
        <Header />
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col overflow-x-hidden">
          <main className="page-shell flex-1">
            <Suspense fallback={<PageProgress />}>
              <Outlet />
            </Suspense>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
