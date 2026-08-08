import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, CheckCircle2, Store, Package, Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { PreviewBadge } from "@/components/marketplace/TypeBadge";
import { ReportDrawer } from "@/components/marketplace/ReportDrawer";
import { useStore } from "@/lib/store";
import { useSeo } from "@/lib/seo";
import { PICKUP_LABELS } from "@/lib/format";

export default function MarketDetail(): React.JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const { markets, allVisibleListings } = useStore();

  const market = useMemo(() => markets.find((m) => m.slug === slug), [markets, slug]);

  useSeo({
    title: market ? market.name : "Market",
    description: market?.tagline,
  });

  if (!market) {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <Store className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-5 font-display text-3xl font-bold">Market not found</h1>
        <p className="mt-2 text-muted-foreground">This Market may have been removed or is no longer published.</p>
        <Button asChild className="mt-6">
          <Link to="/browse">Back to browse</Link>
        </Button>
      </div>
    );
  }

  const listings = allVisibleListings.filter(
    (l) => l.marketId === market.id && l.status === "active",
  );
  const isPreview = market.origin === "preview";

  return (
    <div className="pb-10">
      {/* Header banner */}
      <div className="relative border-b border-border bg-primary">
        <div className="absolute inset-0 bg-grain opacity-30" aria-hidden="true" />
        <div className="container relative py-12 sm:py-16">
          <Link
            to="/browse"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to browse
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/10 text-3xl sm:h-20 sm:w-20 sm:text-4xl">
              {market.emblem}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
                  {market.name}
                </h1>
                {isPreview && <PreviewBadge />}
              </div>
              <p className="mt-1 text-lg text-primary-foreground/80">{market.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-primary-foreground/70">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {market.location.label}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {market.completedExchanges} completed
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  ~{market.responseHours}h response
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-start">
          <div>
            <h2 className="font-display text-xl font-semibold">About this garden</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/85">
              {market.description}
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold">
              {listings.length > 0 ? `What's available (${listings.length})` : "No active listings"}
            </h2>
            {listings.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} market={market} />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-border bg-card px-5 py-9 text-center">
                <Package className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <p className="mt-3 font-medium">Nothing available right now</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check back soon, or browse other Markets nearby.
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/browse">Browse all listings</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Pickup
              </h3>
              <p className="mt-2 text-sm">{PICKUP_LABELS[market.pickupPreference]}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Growing since
              </h3>
              <p className="mt-2 text-sm">{market.growingSince}</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/50 p-5 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Approximate location</p>
              <p className="mt-1">
                {market.location.label} — the general area only. Exact pickup details are shared privately
                after the grower approves a request.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Concerns?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                If something about this Market feels off, let us know.
              </p>
              <ReportDrawer
                targetType="market"
                targetId={market.id}
                targetName={market.name}
                className="mt-3"
                trigger={
                  <button
                    type="button"
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-terracotta hover:text-terracotta/80"
                  >
                    <Flag className="h-4 w-4" aria-hidden="true" />
                    Report this Market
                  </button>
                }
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
