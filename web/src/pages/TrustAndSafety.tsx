import * as React from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  MessageCircle,
  Flag,
  Ban,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Handshake,
  HeartHandshake,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const RESTRICTED = [
  {
    category: "Eggs, dairy, meat",
    note: "Regulated differently in every state. Some require licensing, labeling, refrigeration, or inspection. Check your local cottage food and poultry rules before listing.",
  },
  {
    category: "Prepared & baked goods",
    note: "Cottage food laws vary widely. Some states allow home kitchens for certain non-potentially-hazardous foods; others don't. Labeling is often required.",
  },
  {
    category: "Canned goods & preserves",
    note: "Low-acid canning carries botulism risk and may require a commercial kitchen. Acidified foods have specific FDA registration requirements in the US.",
  },
  {
    category: "Seeds & plants",
    note: "Some states require phytosanitary certificates or prohibit certain invasive species. Seed labeling laws may apply to sold seeds.",
  },
  {
    category: "Pesticides & fertilizers",
    note: "Restricted-use pesticides require licensing to sell. Even general-use products may have state restrictions. Gnome is not a place to sell these.",
  },
  {
    category: "Alcohol, cannabis, tobacco",
    note: "Heavily regulated or prohibited. Do not list these on Gnome. Sales typically require specific licenses that vary by jurisdiction.",
  },
  {
    category: "Prescription products & medicines",
    note: "Never permitted. Do not list prescription medications, medical devices, or anything claiming to treat, cure, or prevent disease.",
  },
  {
    category: "Weapons & unsafe chemicals",
    note: "Not permitted on Gnome. This includes firearms, ammunition, explosives, and hazardous chemicals.",
  },
];

export default function TrustAndSafety(): React.JSX.Element {
  useSeo({
    title: "Trust & Safety",
    description:
      "How Gnome keeps neighborly exchanges safe: approximate locations, private messaging, reporting, blocking, and clear guidance on regulated items.",
  });

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-grain">
        <div className="container py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">Trust &amp; safety</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.08] sm:text-6xl">
              Built for neighborly exchanges.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-foreground/75">
              Trading food with someone nearby only works if people feel safe doing it. Here&rsquo;s how Gnome
              handles the parts that matter — and what we expect from you.
            </p>
          </div>
        </div>
      </section>

      {/* How we protect you */}
      <section className="container py-14 sm:py-20">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">How Gnome protects you</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Lock,
              title: "Approximate locations only",
              body: "Your home address is never displayed publicly. Listings show a general area and distance. You share exact pickup details only after approving someone's request.",
            },
            {
              icon: MessageCircle,
              title: "Private messaging",
              body: "Conversations are between the two of you. Nobody else can read them. You can report or block anyone at any time.",
            },
            {
              icon: Handshake,
              title: "You choose how to meet",
              body: "Porch pickup, a public spot, or a market stand — every listing states the preference up front. You're never obligated to invite someone to your home.",
            },
            {
              icon: Flag,
              title: "Report anything",
              body: "Report a listing, a message, or a user. Reports are reviewed by a person, not an algorithm. We preserve evidence for review.",
            },
            {
              icon: Ban,
              title: "Block anyone",
              body: "Block a user and they can't message you or see your listings. The block works both ways.",
            },
            {
              icon: HeartHandshake,
              title: "Seller history",
              body: "Completed exchanges show on a seller's Market page so you can see they've done this before. We don't verify sellers or inspect listings — trust is built through history.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <item.icon className="h-7 w-7 text-moss" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safe pickup guidance */}
      <section className="border-y border-border bg-secondary/50">
        <div className="container py-14 sm:py-20">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Safe pickup guidance</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold text-moss">If you&rsquo;re picking up</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Meet in a public place when possible — a library, a coffee shop, a market.</li>
                <li>• Tell someone where you&rsquo;re going and when to expect you back.</li>
                <li>• Bring exact change or agree on the payment method beforehand.</li>
                <li>• Trust your instincts. If something feels off, cancel and walk away.</li>
                <li>• Keep conversations on Gnome so there&rsquo;s a record if something goes wrong.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold text-moss">If you&rsquo;re the grower</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Porch pickup works if you&rsquo;re comfortable — use a cooler, not your front door.</li>
                <li>• Share your address only after you&rsquo;ve approved the request.</li>
                <li>• Don&rsquo;t leave items out indefinitely. Agree on a time window.</li>
                <li>• You can decline any request for any reason. No explanation required.</li>
                <li>• Keep conversations on Gnome so there&rsquo;s a record.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Restricted & prohibited */}
      <section className="container py-14 sm:py-20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-7 w-7 shrink-0 text-marigold" aria-hidden="true" />
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Restricted &amp; prohibited items</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Some items are regulated differently in every state and county. Others aren&rsquo;t allowed on
              Gnome at all. You&rsquo;re responsible for knowing and following your local laws — Gnome
              doesn&rsquo;t provide legal advice and can&rsquo;t tell you what&rsquo;s legal where you live.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {RESTRICTED.map((item) => (
            <div key={item.category} className="rounded-xl border border-border bg-card p-5">
              <p className="font-display text-base font-semibold">{item.category}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3 rounded-2xl border-2 border-destructive/30 bg-destructive/[0.06] p-6">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-destructive" aria-hidden="true" />
          <div>
            <h3 className="font-display text-lg font-semibold">Gnome does not verify sellers or inspect food</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We don&rsquo;t have the capacity or the legal authority to inspect listings, verify food safety,
              or confirm that sellers are licensed. Every exchange is between two people who are both
              responsible for following their local laws. If something seems unsafe or illegal, report it and
              we&rsquo;ll review it.
            </p>
          </div>
        </div>
      </section>

      {/* Reporting & blocking */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="container py-14 sm:py-20">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Reporting &amp; blocking</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: Flag, title: "Report", body: "Flag a listing, message, or user. Our team reviews every report. Reported content is preserved for review — we don't delete it before someone looks at it." },
              { icon: Ban, title: "Block", body: "Block a user and they can't message you or see your listings. The block works both ways. You can unblock later if you change your mind." },
              { icon: ShieldCheck, title: "Moderation", body: "We can suspend listings or users who violate our rules. Suspended users can't post, message, or claim. Actions are recorded for transparency." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-primary-foreground/10 p-6">
                <item.icon className="h-7 w-7 text-marigold" aria-hidden="true" />
                <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-primary-foreground/60">
            Note: Reporting and blocking aren&rsquo;t connected to a backend yet. They need one to store and
            act on reports.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 text-center">
        <MapPin className="mx-auto h-10 w-10 text-moss" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
          Start with something small.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          The safest first exchange is a free listing on your porch. See how it feels.
        </p>
        <Button asChild size="lg" className="mt-6 h-13 px-8">
          <Link to="/browse">Browse what&rsquo;s nearby</Link>
        </Button>
      </section>
    </div>
  );
}
