import * as React from "react";
import { Link } from "react-router-dom";
import {
  MapPinned,
  Sprout,
  CalendarDays,
  Handshake,
  ShieldCheck,
  AlertTriangle,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const HOW_IT_WORKS = [
  { icon: MessageCircle, title: "Find a grower with space", body: "Browse growers offering plot arrangements, or post what you're looking for." },
  { icon: Handshake, title: "Agree on what you're arranging", body: "Space, labor, a share of the harvest, or a pre-order. You both confirm the terms up front." },
  { icon: Sprout, title: "They grow it. You follow along.", body: "Check in through the season. Photos, updates, and questions go through Gnome messages." },
  { icon: CalendarDays, title: "Pick up your share at harvest", body: "Arrange pickup when the crop is ready. Anything you arranged is yours to collect." },
];

const ARRANGEMENT_TYPES = [
  {
    title: "Reserve growing space",
    body: "You pay for a bed or row in someone's garden. You decide what goes in it. The grower provides the land, water, and basic upkeep.",
  },
  {
    title: "Pay for growing labor",
    body: "A grower tends a crop for you from seed to harvest. You pay for the labor, not the produce — though you typically receive the harvest.",
  },
  {
    title: "Pre-order part of a harvest",
    body: "You commit to buying a portion of what a grower is already planning to plant. They know it's sold before they sow.",
  },
  {
    title: "Sponsor a crop",
    body: "You cover seeds and supplies for a specific planting. In exchange, you get a share of what it produces, at a set price or as trade.",
  },
];

const SAMPLE_AGREEMENT = [
  { label: "What you're purchasing", value: "One 4×8 raised bed for the 2026 growing season" },
  { label: "What the grower promises", value: "Prepare the bed, start seedlings, water weekly, notify you of problems" },
  { label: "What you're responsible for", value: "Choosing crops, picking up harvest, communicating timing" },
  { label: "Payment", value: "$120 for the season, paid in two installments" },
  { label: "Crop-failure policy", value: "If weather destroys the crop, 50% credit toward next season" },
  { label: "Harvest timing", value: "June through September, arranged by message" },
  { label: "Communication", value: "Weekly photo update via Gnome messages" },
];

const TIMELINE = [
  { month: "March", event: "Agree on terms, choose crops, first payment" },
  { month: "April", event: "Bed prepared, seedlings started indoors" },
  { month: "May", event: "Transplant outdoors, first photos" },
  { month: "June–Aug", event: "Weekly updates, first harvests, ongoing pickup" },
  { month: "September", event: "Final harvest, settle up, discuss next year" },
];

export default function Plots(): React.JSX.Element {
  useSeo({
    title: "Reserve a Plot",
    description:
      "No yard, no time, or no experience? Arrange growing space with a nearby grower. Reserve a bed, pre-order a harvest, or sponsor a crop for the season.",
  });

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-grain">
        <div className="container py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">Grow</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.08] sm:text-6xl">
              Grow without the yard.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-foreground/75">
              No land, no time, or no idea where to start. Arrange growing space with a nearby grower — they
              provide the ground and the experience, you get the harvest.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-13 px-7 text-base">
                <MapPinned className="mr-2 h-5 w-5" aria-hidden="true" />
                Find a plot near me
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 px-7 text-base">
                <Link to="/garden-planner">Plan what to grow first</Link>
              </Button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              Plot listings and inquiry tools aren&rsquo;t connected yet — this needs a backend.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-14 sm:py-20">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">How it works</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="font-display text-5xl font-bold text-border">{i + 1}</span>
              <step.icon className="mt-2 h-7 w-7 text-moss" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Arrangement types */}
      <section className="border-y border-border bg-secondary/50">
        <div className="container py-14 sm:py-20">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">What a plot arrangement can be</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            It&rsquo;s flexible. You and the grower agree on what makes sense, and Gnome keeps a record of the
            terms.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {ARRANGEMENT_TYPES.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample agreement */}
      <section className="container py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">A sample arrangement</h2>
            <p className="mt-3 text-muted-foreground">
              Here&rsquo;s what a real agreement might look like. It&rsquo;s reassuring, not legalistic — the
              point is that both people know what they agreed to before the season starts.
            </p>
            <div className="mt-6 flex gap-3 rounded-xl border border-marigold/40 bg-marigold/10 p-4 text-sm">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-marigold" aria-hidden="true" />
              <p className="text-foreground/80">
                This is an example, not a contract. Gnome doesn&rsquo;t enforce terms or guarantee a
                successful crop. Weather, pests, and life happen — the crop-failure policy is where you plan
                for that together.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Example agreement</h3>
            <dl className="mt-4 divide-y divide-border">
              {SAMPLE_AGREEMENT.map((row) => (
                <div key={row.label} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[1fr_1.4fr] sm:gap-4">
                  <dt className="text-sm font-semibold text-muted-foreground">{row.label}</dt>
                  <dd className="text-sm">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="container py-14 sm:py-20">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">A season at a glance</h2>
          <div className="mt-8 space-y-1">
            {TIMELINE.map((item, i) => (
              <div key={item.month} className="flex items-stretch gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-marigold font-display text-sm font-bold text-marigold-foreground">
                    {i + 1}
                  </span>
                  {i < TIMELINE.length - 1 && <span className="w-px flex-1 bg-primary-foreground/20" />}
                </div>
                <div className="pb-8 pt-1.5">
                  <p className="font-display text-lg font-semibold text-marigold">{item.month}</p>
                  <p className="mt-0.5 text-sm text-primary-foreground/70">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect / what if */}
      <section className="container py-14 sm:py-20">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">What if things go wrong?</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            { q: "The crop underperforms", a: "You agreed on a crop-failure policy up front. Usually that's a partial credit, a replacement crop, or a smaller harvest at no extra charge." },
            { q: "Weather destroys everything", a: "Same policy applies. A fair arrangement accounts for acts of weather. The grower isn't expected to guarantee a harvest they can't control." },
            { q: "The grower stops responding", a: "Message through Gnome so there's a record. If they go silent for an extended period, contact support. We can't refund money that changed hands outside Gnome, but we can mediate communication." },
            { q: "You want to change crops mid-season", a: "That's a conversation. Most growers are flexible if there's still time. Anything you both agree to change should be updated in your arrangement notes." },
          ].map((item) => (
            <div key={item.q} className="rounded-xl border border-border bg-card p-5">
              <p className="font-display text-base font-semibold">{item.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20 text-center">
        <div className="rounded-3xl border border-border bg-card p-10 shadow-soft">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Interested in a plot?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            We&rsquo;ll let you know when plot listings are available near you.
          </p>
          <Button size="lg" className="mt-6 h-13 px-8 text-base">
            Get notified
            <ArrowRight className="ml-2 h-4.5 w-4.5" aria-hidden="true" />
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Needs an account and a backend. Not available yet.
          </p>
        </div>
      </section>
    </div>
  );
}
