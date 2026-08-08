import * as React from "react";
import { Link } from "react-router-dom";
import { Search, Store, MessagesSquare, HandHeart, Package, MapPinned, ArrowRight, Sprout, Handshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSeo, CORE_DESCRIPTION } from "@/lib/seo";

const STEPS = [
  {
    icon: Search,
    title: "Find what's growing nearby",
    body: "Enter your ZIP code and browse listings from neighbors within a few miles. Free produce, trades, garden goods for sale, and wanted posts — all clearly labeled.",
    cta: { to: "/browse", label: "Browse listings" },
  },
  {
    icon: Store,
    title: "Open a Market (if you grow)",
    body: "A Market is your page on Gnome. It holds your listings and tells neighbors what you grow. You don't need a farm — a couple of raised beds is plenty.",
    cta: { to: "/sell", label: "Start selling" },
  },
  {
    icon: HandHeart,
    title: "Claim, trade, buy, or respond",
    body: "Tap a listing to claim free produce, offer a trade, request to buy, or respond to a wanted post. Your message goes to the grower privately.",
    cta: { to: "/browse", label: "See how it works" },
  },
  {
    icon: Handshake,
    title: "Arrange pickup",
    body: "The grower approves your request and shares pickup details privately. Porch, a public spot, or a market stand — whatever works for both of you.",
    cta: { to: "/trust-and-safety", label: "Read safety tips" },
  },
];

const GROW_OPTIONS = [
  {
    icon: MessagesSquare,
    title: "Garden Planner",
    body: "Ask what to plant and when, with your zone and frost dates in mind.",
    to: "/garden-planner",
  },
  {
    icon: Package,
    title: "Seed Drop",
    body: "A small box of seeds chosen for your zone and season. The easiest start.",
    to: "/seed-drop",
  },
  {
    icon: MapPinned,
    title: "Reserve a Plot",
    body: "No yard? Arrange growing space with a nearby grower.",
    to: "/plots",
  },
];

export default function HowItWorks(): React.JSX.Element {
  useSeo({
    title: "How Gnome works",
    description: CORE_DESCRIPTION,
  });

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-grain">
        <div className="container py-14 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold leading-[1.08] sm:text-6xl">
              How Gnome works
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-foreground/75">
              Gnome is a neighborhood marketplace that helps people grow, find, share, and sell local food and
              garden goods. Here&rsquo;s the whole thing in four steps.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="container py-14 sm:py-20">
        <ol className="space-y-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex shrink-0 items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <step.icon className="h-7 w-7 text-moss" aria-hidden="true" />
                <h2 className="mt-3 font-display text-xl font-semibold sm:text-2xl">{step.title}</h2>
                <p className="mt-2 text-muted-foreground">{step.body}</p>
                <Link
                  to={step.cta.to}
                  className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  {step.cta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Grow section */}
      <section className="border-y border-border bg-secondary/50">
        <div className="container py-14 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Don&rsquo;t grow anything yet?</h2>
            <p className="mt-3 text-muted-foreground">
              The marketplace works better when more people are growing. These are the three easiest ways to
              start.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {GROW_OPTIONS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <item.icon className="h-8 w-8 text-moss" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product story */}
      <section className="container py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Sprout className="mx-auto h-10 w-10 text-moss" aria-hidden="true" />
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">The simple story</h2>
          <ol className="mt-8 space-y-4 text-left">
            {[
              "Find what is growing nearby.",
              "Grow your own with help from Gnome.",
              "Share or sell what you do not use.",
              "Build relationships with local buyers and growers.",
              "Strengthen the neighborhood food network.",
            ].map((line, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-base">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20 text-center">
        <Button asChild size="lg" className="h-13 px-8 text-base">
          <Link to="/browse">See what&rsquo;s growing nearby</Link>
        </Button>
      </section>
    </div>
  );
}
