import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Camera, Store, Share2, Inbox, HandHeart, MapPin, CheckCircle2, Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useStore } from "@/lib/store";
import { useSeo } from "@/lib/seo";
import { PLANS } from "@/lib/plans";
import { formatCents } from "@/lib/format";

const JOURNEY = [
  { icon: Store, title: "Create your Market", body: "Name it, add a line about what you grow. Five minutes." },
  { icon: Camera, title: "Add what you're growing", body: "Snap a photo on your phone. The assistant drafts the rest." },
  { icon: Share2, title: "Share it locally", body: "Your listings show up for neighbors browsing your area." },
  { icon: Inbox, title: "Review requests", body: "People claim, offer trades, or ask to buy. You see it all in one place." },
  { icon: CheckCircle2, title: "Approve the right buyer", body: "Pick who gets it. Pickup details go out privately, only then." },
  { icon: MapPin, title: "Arrange pickup", body: "Porch, public spot, or your market stand — however you're comfortable." },
  { icon: Check, title: "Mark it complete", body: "Inventory updates and the exchange is on your record." },
  { icon: Repeat, title: "Build repeat customers", body: "Neighbors come back for the eggs every week. That's the whole idea." },
];

const FAQ = [
  {
    q: "Do I need to be a farm or a registered business?",
    a: "No. Most people on Gnome have a couple of raised beds and more zucchini than sense. A Market is just a page that holds your listings — a balcony with herb pots counts.",
  },
  {
    q: "Does Gnome take a cut of what I sell?",
    a: "No. Gnome does not take a percentage of neighbor-to-neighbor transactions. Money changes hands directly between you and your buyer, in whatever way you both agree on — cash, an app, or a trade. Gnome charges a flat monthly plan and nothing else.",
  },
  {
    q: "How does payment actually work?",
    a: "For now, outside of Gnome. You and the buyer agree on the amount in messages and settle it at pickup. That keeps it simple, but it also means Gnome can't mediate a payment dispute — so use your judgment, the same way you would at a yard sale.",
  },
  {
    q: "What does the AI listing assistant do?",
    a: "You take a photo and it drafts a title, description, category, and a suggested price based on similar local listings. You review and edit everything before it publishes — nothing goes live automatically.",
  },
  {
    q: "Who sees my address?",
    a: "Nobody, by default. Your listings show an approximate area only. When you approve someone's request, you choose to share the exact pickup details privately in that conversation.",
  },
  {
    q: "What happens when a listing gets old?",
    a: "Listings expire after two weeks so browse never fills up with produce that's long gone. You get a reminder before it happens and can renew with one tap.",
  },
  {
    q: "What am I responsible for?",
    a: "Being honest about what you're offering, and following your local rules. Eggs, dairy, meat, baked goods, and canned goods are regulated differently everywhere — that's on you to check. Gnome doesn't inspect listings or verify sellers, and we don't give legal advice.",
  },
];

export default function Sell(): React.JSX.Element {
  useSeo({
    title: "Sell what you grow",
    description:
      "Open a Market on Gnome and share extra produce with neighbors. No commission on neighbor-to-neighbor sales. You don't need a farm — a couple of raised beds is plenty.",
  });

  const { myMarket } = useStore();
  const grower = PLANS.find((p) => p.tier === "grower");

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-grain">
        <div className="container py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">For growers</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.08] sm:text-6xl">
              Someone nearby wants what you grow.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-foreground/75">
              You don&rsquo;t need a farm, a business license, or a website. If you have more tomatoes than
              you can eat, you have enough to start a Market.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 px-7 text-base">
                <Link to={myMarket ? "/my-market" : "/my-market/setup"}>
                  {myMarket ? "Go to my Market" : "Create your Market"}
                  <ArrowRight className="ml-2 h-4.5 w-4.5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 px-7 text-base">
                <Link to="/pricing">See plans</Link>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              {["No commission on sales", "Free plan to start", "Cancel anytime"].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-type-free" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Fees — stated plainly */}
      <section className="container py-14 sm:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border-2 border-type-free/40 bg-type-free/[0.07] p-6">
            <p className="font-display text-4xl font-bold text-type-free">0%</p>
            <h2 className="mt-2 font-display text-lg font-semibold">Commission on your sales</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Gnome takes no percentage of neighbor-to-neighbor transactions. Whatever you charge is what you
              keep.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-4xl font-bold">
              {grower ? formatCents(grower.priceCents) : "$9"}
              <span className="text-base font-medium text-muted-foreground">/mo</span>
            </p>
            <h2 className="mt-2 font-display text-lg font-semibold">For an active storefront</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The Grower plan. A free Neighbor plan covers three listings if you just want to try it.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-4xl font-bold">You</p>
            <h2 className="mt-2 font-display text-lg font-semibold">Handle the money directly</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Cash, an app, or a trade — you and your buyer settle it at pickup. Gnome isn&rsquo;t in the
              middle, which also means we can&rsquo;t mediate payment disputes.
            </p>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="container py-16 sm:py-24">
          <h2 className="max-w-xl font-display text-3xl font-bold sm:text-5xl">
            From raised bed to repeat customer.
          </h2>
          <p className="mt-3 max-w-lg text-primary-foreground/70">
            The whole journey, start to finish. Most of it happens from your phone.
          </p>

          <ol className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((step, i) => (
              <li key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-marigold font-display text-base font-bold text-marigold-foreground">
                    {i + 1}
                  </span>
                  <step.icon className="h-5 w-5 text-primary-foreground/45" aria-hidden="true" />
                </div>
                <h3 className="mt-3.5 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Wanted posts */}
      <section className="container py-16 sm:py-20">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-soft sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <HandHeart className="h-8 w-8 text-type-wanted" aria-hidden="true" />
              <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                Not sure anyone wants what you grow?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Check the wanted posts. Neighbors say what they&rsquo;re looking for before the season starts —
                it&rsquo;s the closest thing to a guaranteed buyer you&rsquo;ll get, and it tells you what to
                plant more of next year.
              </p>
              <Button asChild variant="outline" className="mt-5">
                <Link to="/browse">See what people are asking for</Link>
              </Button>
            </div>
            <ul className="space-y-2.5">
              {[
                "Looking for extra canning jars",
                "Anyone have pepper seedlings?",
                "Want to buy eggs weekly",
                "Need mulch or finished compost",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-type-wanted" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-20">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Straight answers</h2>
        <Accordion type="single" collapsible className="mt-6 max-w-3xl">
          {FAQ.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 rounded-2xl border border-border bg-secondary/50 p-7 text-center">
          <h2 className="font-display text-2xl font-bold">Ready when you are</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Start with one listing. See how it feels to have a neighbor pick up the extra basil.
          </p>
          <Button asChild size="lg" className="mt-6 h-13 px-8 text-base">
            <Link to={myMarket ? "/my-market" : "/my-market/setup"}>
              {myMarket ? "Go to my Market" : "Create your Market"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
