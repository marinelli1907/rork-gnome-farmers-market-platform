import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileTabBar } from "./MobileTabBar";
import { SupportButton } from "@/components/support/SupportButton";

/** App shell: header, routed page, footer, and a phone-only bottom tab bar. */
export function Layout(): React.JSX.Element {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Spacer so the fixed tab bar never covers footer content on phones */}
      <div className="h-14 md:hidden" aria-hidden="true" />
      <MobileTabBar />
      <SupportButton />
    </div>
  );
}
