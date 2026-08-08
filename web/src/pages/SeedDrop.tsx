import * as React from "react";
import { Link } from "react-router-dom";
import { Package, Sprout, Truck, RefreshCw, Check, Info, Leaf, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const STARTER_INCLUDED = [
  "5 seed varieties chosen for your zone and season",
  "Roughly 30–50 seeds per variety",
  "Simple growing instructions for each one",
  "Planting calendar for your frost dates",
  "Kraft seed packets, labeled by variety",
];

const WHAT_TO_KNOW = [
  { icon: Sprout, title: "Personalized by zone", body: "Tell us your ZIP and we pick varieties that work for your climate and the current season." },
  { icon: CalendarDays, title: "Ships within a week", body: "Orders ship within 5 business days. You'll get a tracking number by email." },
  { icon: Leaf, title: "Substitutions may happen", body: "If a variety is out of stock, we substitute something similar and note it on the packing slip." },
  { icon: RefreshCw, title: "Germination policy", body: "Seeds are tested for germination rate. If a packet doesn't sprout, we'll replace it free." },
];

export default function SeedDrop(): React.JSX.Element {
  useSeo({
    title: "Seed Drop",
    description:
      "A small box of seeds chosen for your zone and season, with growing instructions that assume nothing. The easiest way to start growing.",
  });

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-grain">
        <div className="container py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">Grow</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.08] sm:text-6xl">
              Seeds to start with.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-foreground/75">
              A small box of seeds picked for your zone and the current season, with instructions that assume
              you&rsquo;ve never grown anything before. The lowest-risk way to find out if you enjoy this.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-13 px-7 text-base">
                <Package className="mr-2 h-5 w-5" aria-hidden="true" />
                Get a Starter Pack — $18
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 px-7 text-base">
                <Link to="/garden-planner">Plan first, then pick seeds</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Starter pack detail */}
      <section className="container py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Visual */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary bg-speckle p-12 text-center">
            <span className="text-8xl" aria-hidden="true">📦</span>
            <p className="mt-4 font-display text-2xl font-bold">Starter Pack</p>
            <p className="mt-1 text-muted-foreground">$18 · one-time · free shipping</p>
          </div>

          {/* Details */}
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">What&rsquo;s in the box</h2>
            <ul className="mt-5 space-y-3">
              {STARTER_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-type-free" aria-hidden="true" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-4">
              {WHAT_TO_KNOW.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="mt-8 h-13 w-full text-base sm:w-auto sm:px-10">
              <Package className="mr-2 h-5 w-5" aria-hidden="true" />
              Order Starter Pack — $18
            </Button>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              Checkout isn&rsquo;t connected yet. This needs a payment processor and fulfillment system before
              we can accept real orders.
            </p>
          </div>
        </div>
      </section>

      {/* Coming later */}
      <section className="border-t border-border bg-secondary/50">
        <div className="container py-14 sm:py-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Coming later</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            We&rsquo;re starting with one box. Once fulfillment is reliable, we&rsquo;ll add these.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-dashed border-border bg-card p-6">
              <Truck className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg font-semibold">Seasonal Plan</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A new box four times a year, timed to what you should be planting each season. Skip or pause
                anytime.
              </p>
              <span className="mt-3 inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                Not yet available
              </span>
            </div>
            <div className="rounded-2xl border border-dashed border-border bg-card p-6">
              <CalendarDays className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg font-semibold">Year-Round Plan</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Monthly deliveries with seasonal seeds, supplies, and a fresh planting calendar. For people who
                grow every month they can.
              </p>
              <span className="mt-3 inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                Not yet available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Not sure what to grow?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Ask the Garden Planner first, then come back for seeds.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-6 h-13 px-7">
          <Link to="/garden-planner">Try the Garden Planner</Link>
        </Button>
      </section>
    </div>
  );
}
