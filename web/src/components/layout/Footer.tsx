import * as React from "react";
import { Link } from "react-router-dom";

import { CORE_DESCRIPTION } from "@/lib/seo";

import { GnomeMark } from "./GnomeMark";

const COLUMNS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Marketplace",
    links: [
      { to: "/browse", label: "Browse" },
      { to: "/sell", label: "Sell" },
      { to: "/my-market", label: "My Market" },
      { to: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Grow",
    links: [
      { to: "/garden-planner", label: "Garden Planner" },
      { to: "/seed-drop", label: "Seed Drop" },
      { to: "/plots", label: "Reserve a Plot" },
    ],
  },
  {
    title: "About",
    links: [
      { to: "/how-it-works", label: "How Gnome works" },
      { to: "/trust-and-safety", label: "Trust & safety" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

export function Footer(): React.JSX.Element {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <GnomeMark className="h-12 w-auto" variant="wordmark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              {CORE_DESCRIPTION}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-marigold">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-1">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex min-h-[40px] items-center text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Gnome. Grow more, waste less.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/terms" className="hover:text-primary-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-primary-foreground">
              Privacy
            </Link>
            <Link to="/trust-and-safety" className="hover:text-primary-foreground">
              Trust &amp; safety
            </Link>
            <Link to="/contact" className="hover:text-primary-foreground">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
