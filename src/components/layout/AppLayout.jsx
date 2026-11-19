import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { PageProgress } from "@/components/shared/PageProgress";
import { Footer } from "./Footer";
import { Header } from "./Header";


export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="w-full flex-1">
        <div className="mx-auto max-w-6xl px-4 pb-32 pt-8 sm:px-6 lg:px-8">
          <Suspense fallback={<PageProgress />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
