import * as React from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, Store, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useSeo } from "@/lib/seo";
import { PLANS } from "@/lib/plans";
import { formatCents } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PlanTier } from "@/lib/types";

export default function Pricing(): React.JSX.Element {
  useSeo({
    title: "Pricing",
    description:
      "Gnome has three plans: Neighbor (free), Grower ($9/mo), and Farm ($29/mo). No commission on neighbor-to-neighbor sales, ever.",
  });

  const { plan, setPlan } = useStore();

  const selectPlan = (tier: PlanTier): void => {
    setPlan(tier);
    // In production, this would redirect to a checkout provider. The backend
    // would verify the payment event via webhook before updating access.
  };

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-grain">
        <div className="container py-14 sm:py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">Pricing</p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-bold leading-[1.08] sm:text-6xl">
            No commission. Ever.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-foreground/75">
            Gnome charges a flat monthly plan. Whatever you sell, you keep all of it. Start free, upgrade when
            you&rsquo;re growing more than you can give away.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="container py-14 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {PLANS.map((p) => {
            const isCurrent = plan === p.tier;
            const isGrower = p.tier === "grower";
            return (
              <div
                key={p.tier}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-7 shadow-soft",
                  isGrower && "border-primary lg:scale-[1.03] lg:shadow-lift",
                  isCurrent && "ring-2 ring-primary",
                )}
              >
                {isGrower && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                    Most popular
                  </span>
                )}

                <h2 className="font-display text-2xl font-bold">{p.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.who}</p>

                <div className="mt-5">
                  <span className="font-display text-4xl font-bold">
                    {p.priceCents === 0 ? "Free" : formatCents(p.priceCents)}
                  </span>
                  {p.priceCents > 0 && (
                    <span className="text-base font-medium text-muted-foreground">/month</span>
                  )}
                </div>

                <ul className="mt-6 space-y-2.5">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-type-free" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
                  <Row label="Active listings" value={`${p.listingLimit}`} />
                  <Row label="Markets" value={`${p.marketLimit}`} />
                  <Row label="Featured / month" value={p.promotionsPerMonth > 0 ? `${p.promotionsPerMonth}` : "—"} />
                  <Row label="AI credits / month" value={`${p.aiCreditsPerMonth}`} />
                  <Row label="Analytics" value={p.analytics} />
                  <Row label="Support" value={p.support} />
                  <Row label="Transaction fee" value="0% — no commission" />
                </dl>

                <div className="mt-7 flex-1" />
                <Button
                  variant={isCurrent ? "outline" : isGrower ? "default" : "outline"}
                  className="h-12 w-full"
                  disabled={isCurrent}
                  onClick={() => selectPlan(p.tier)}
                >
                  {isCurrent ? "Current plan" : p.priceCents === 0 ? "Start free" : `Choose ${p.name}`}
                </Button>
                {p.priceCents > 0 && (
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Billing monthly. Cancel anytime. No refund for partial months.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Honest note */}
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-dashed border-border bg-muted/50 p-5 text-center text-sm text-muted-foreground">
          <Sparkles className="mx-auto h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <p className="mt-2">
            Plan switching here is for demonstration — it updates your browser only. In production, plan
            changes go through a payment provider and the backend verifies the webhook before granting access.
            No one can change their own tier from the frontend.
          </p>
        </div>
      </section>

      {/* Comparison FAQ */}
      <section className="border-t border-border bg-secondary/50">
        <div className="container py-14 sm:py-20">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Common questions</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              {
                q: "What's the difference between Neighbor and Grower?",
                a: "Neighbor is free and lets you post up to 3 listings — perfect for the occasional surplus. Grower ($9/mo) gives you 40 listings, a customizable Market page, featured listings, and the AI assistant. If you're regularly selling from your garden, Grower is the plan for you.",
              },
              {
                q: "When should I consider Farm?",
                a: "Farm ($29/mo) is for high-volume sellers running a farm stand or selling at multiple markets. It raises your limit to 500 listings, allows up to 3 Markets, and includes plot arrangements and priority placement in Browse.",
              },
              {
                q: "Do you really take zero commission?",
                a: "Yes. Gnome never takes a percentage of neighbor-to-neighbor transactions. You and your buyer settle payment directly — cash, an app, or a trade. Gnome's only revenue is the monthly plan.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel from your account settings and your plan reverts to Neighbor at the end of the current billing period. No refund for partial months, but no penalty either.",
              },
              {
                q: "What happens to my listings if I downgrade?",
                a: "Your listings stay where they are. If you have more active listings than the new plan allows, the oldest ones get paused automatically. You can republish them when you upgrade again or when older listings expire.",
              },
              {
                q: "Is there a free trial of Grower?",
                a: "Not yet. We're keeping it simple: start free as a Neighbor, and upgrade when you're ready. The free plan is genuinely usable — it's not a teaser.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-border bg-card p-5">
                <p className="font-display text-base font-semibold">{item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 text-center">
        <Store className="mx-auto h-10 w-10 text-moss" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Start with what you have.</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Even one extra tomato plant is enough to open a Market.
        </p>
        <Button asChild size="lg" className="mt-6 h-13 px-8">
          <Link to="/sell">
            Create your Market
            <ArrowRight className="ml-2 h-4.5 w-4.5" aria-hidden="true" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}
