import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sprout,
  Store,
  MessagesSquare,
  Package,
  MapPinned,
  Lock,
  Recycle,
  Handshake,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ZipGate } from "@/components/marketplace/ZipGate";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { useStore } from "@/lib/store";
import { useSeo, CORE_DESCRIPTION } from "@/lib/seo";
import { GnomeMark } from "@/components/layout/GnomeMark";

const ECOSYSTEM = [
  {
    n: "01",
    title: "Find what's growing nearby",
    body: "Browse free produce, trades, and garden goods from people on your side of town.",
    to: "/browse",
    cta: "Browse listings",
    icon: Sprout,
  },
  {
    n: "02",
    title: "Grow your own with help",
    body: "Ask the Garden Planner what to plant and when, or start from a Seed Drop box.",
    to: "/garden-planner",
    cta: "Try the planner",
    icon: MessagesSquare,
  },
  {
    n: "03",
    title: "Share or sell what you don't use",
    body: "Open a Market in a few minutes. Post the extra tomatoes instead of composting them.",
    to: "/sell",
    cta: "Start selling",
    icon: Store,
  },
  {
    n: "04",
    title: "Build a neighborhood market",
    body: "Repeat buyers, standing trades, and neighbors who know what you grow each season.",
    to: "/how-it-works",
    cta: "See how it works",
    icon: Handshake,
  },
];

const GROW_WAYS = [
  {
    to: "/garden-planner",
    icon: MessagesSquare,
    label: "Garden Planner",
    body: "Ask what to plant this week, why your tomato leaves are yellow, or what fits a 4×8 bed.",
    accent: "text-moss",
  },
  {
    to: "/seed-drop",
    icon: Package,
    label: "Seed Drop",
    body: "A small box of seeds chosen for your zone and season, with instructions that assume nothing.",
    accent: "text-terracotta",
  },
  {
    to: "/plots",
    icon: MapPinned,
    label: "Reserve a Plot",
    body: "No yard, no time, or no idea where to start? Arrange growing space with a nearby grower.",
    accent: "text-sky",
  },
];

export default function Home(): React.JSX.Element {
  useSeo({ title: "Gnome", description: CORE_DESCRIPTION, path: "/" });

  const navigate = useNavigate();
  const { allVisibleListings, getMarket, zip } = useStore();

  const featured = useMemo(
    () =>
      allVisibleListings
        .filter((l) => l.status === "active")
        .sort((a, b) => a.location.approxMiles - b.location.approxMiles)
        .slice(0, 6),
    [allVisibleListings],
  );

  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-border bg-grain">
        <div className="pointer-events-none absolute -right-20 -top-16 hidden opacity-[0.07] lg:block">
          <GnomeMark className="h-[26rem] w-[26rem] animate-sway" />
        </div>

        <div className="container relative py-14 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-type-free" aria-hidden="true" />
              Neighborhood marketplace
            </span>

            <h1 className="mt-5 font-display text-[2.6rem] font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              Fresh from the
              <br />
              <span className="text-terracotta">garden next door.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/75 sm:text-xl">
              Gnome helps neighbors grow, find, share, and sell local food. See what&rsquo;s ripe a few
              streets away — or pass along the zucchini you can&rsquo;t keep up with.
            </p>

            {/* Primary action: answer "is anything near me?" immediately */}
            <div className="mt-8 max-w-xl">
              <ZipGate onSubmitted={() => navigate("/browse")} />
            </div>

            {/* Secondary action */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button asChild variant="outline" size="lg" className="h-12">
                <Link to="/sell">
                  <Store className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
                  Sell what you grow
                </Link>
              </Button>
              <Link
                to="/how-it-works"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
              >
                How Gnome works
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Nearby listings ---------------- */}
      <section className="container py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              {zip ? `Growing near ${zip}` : "See what neighbors are growing"}
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Free, trade, for sale, or wanted — every listing says exactly what it is and how far away.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/browse">
              Browse everything
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} market={getMarket(listing.marketId)} />
          ))}
        </div>

        <Button asChild size="lg" className="mt-7 w-full sm:hidden">
          <Link to="/browse">Browse everything nearby</Link>
        </Button>
      </section>

      {/* ---------------- Ecosystem ---------------- */}
      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="container py-16 sm:py-24">
          <h2 className="max-w-2xl font-display text-3xl font-bold sm:text-5xl">
            One neighborhood, four steps.
          </h2>
          <p className="mt-3 max-w-xl text-primary-foreground/70">
            Gnome isn&rsquo;t four products. It&rsquo;s one loop that starts with a single tomato.
          </p>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
            {ECOSYSTEM.map((step) => (
              <li key={step.n} className="bg-primary p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl font-bold text-marigold">{step.n}</span>
                  <step.icon className="h-5 w-5 text-primary-foreground/50" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">{step.body}</p>
                <Link
                  to={step.to}
                  className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-marigold underline-offset-4 hover:underline"
                >
                  {step.cta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Ways to grow ---------------- */}
      <section className="container py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">Ways to grow</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            If you don&rsquo;t grow anything yet, start here.
          </h2>
          <p className="mt-3 text-muted-foreground">
            The marketplace works better when more people are growing. These are the three easiest ways in.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {GROW_WAYS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <item.icon className={`h-8 w-8 ${item.accent}`} aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-semibold">{item.label}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                Learn more
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- Trust strip ---------------- */}
      <section className="border-t border-border bg-secondary/50">
        <div className="container py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">
                Built for neighborly exchanges
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                Local means being careful with details.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Trading food with someone nearby only works if people feel safe doing it. Here&rsquo;s how
                Gnome handles the parts that matter.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/trust-and-safety">Read our trust &amp; safety approach</Link>
              </Button>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              <TrustCard
                icon={Lock}
                title="Approximate locations only"
                body="Listings show a general area. Your home address is never displayed publicly by default."
              />
              <TrustCard
                icon={MessagesSquare}
                title="You choose what to share"
                body="Exact pickup details go out privately, only after you approve someone's request."
              />
              <TrustCard
                icon={Handshake}
                title="Meet how you're comfortable"
                body="Porch pickup, a public spot, or a market stand. Every listing states the preference up front."
              />
              <TrustCard
                icon={Recycle}
                title="Grow more, waste less"
                body="Surplus produce goes to a neighbor instead of a compost pile or a landfill."
              />
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="container py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-soft sm:px-12">
          <div className="absolute inset-0 bg-grain" aria-hidden="true" />
          <div className="relative">
            <GnomeMark className="mx-auto h-14 w-14" />
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-bold sm:text-5xl">
              Someone nearby wants what you grow.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Opening a Market takes a few minutes. You don&rsquo;t need a farm, a business, or more than one
              raised bed.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 px-8 text-base">
                <Link to="/sell">Start your Market</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 px-8 text-base">
                <Link to="/browse">Browse first</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrustCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}): React.JSX.Element {
  return (
    <li className="rounded-xl border border-border bg-card p-5">
      <Icon className="h-6 w-6 text-moss" aria-hidden="true" />
      <h3 className="mt-3 font-display text-base font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </li>
  );
}
