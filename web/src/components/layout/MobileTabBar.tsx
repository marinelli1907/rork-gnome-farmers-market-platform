import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, Sprout, Store } from "lucide-react";

import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const TABS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/browse", label: "Browse", icon: Search, exact: false },
  { to: "/garden-planner", label: "Grow", icon: Sprout, exact: false },
] as const;

/**
 * Thumb-reachable bottom navigation for phones. Hidden from md upward, where the
 * full header nav takes over.
 */
export function MobileTabBar(): React.JSX.Element {
  const { pathname } = useLocation();
  const { myMarket } = useStore();

  const active = (to: string, exact: boolean): boolean =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  const postTo = myMarket ? "/my-market/new-listing" : "/sell";
  const marketTo = "/my-market";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur-md md:hidden"
      aria-label="Primary"
    >
      <ul className="flex items-stretch">
        {TABS.map((tab) => (
          <li key={tab.to} className="flex-1">
            <Link
              to={tab.to}
              aria-current={active(tab.to, tab.exact) ? "page" : undefined}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
                active(tab.to, tab.exact) ? "text-primary" : "text-muted-foreground",
              )}
            >
              <tab.icon className="h-5 w-5" aria-hidden="true" />
              {tab.label}
            </Link>
          </li>
        ))}

        <li className="flex-1">
          <Link
            to={postTo}
            className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-accent"
          >
            <PlusCircle className="h-5 w-5" aria-hidden="true" />
            Post
          </Link>
        </li>

        <li className="flex-1">
          <Link
            to={marketTo}
            aria-current={active(marketTo, false) ? "page" : undefined}
            className={cn(
              "flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
              active(marketTo, false) ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Store className="h-5 w-5" aria-hidden="true" />
            Market
          </Link>
        </li>
      </ul>
    </nav>
  );
}
