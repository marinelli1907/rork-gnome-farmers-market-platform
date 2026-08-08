import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Info, SproutIcon, Bell, HandHeart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/marketplace/ListingCard";
import {
  BrowseFilters,
  DEFAULT_FILTERS,
  countActiveFilters,
  type FilterState,
} from "@/components/marketplace/BrowseFilters";
import { ZipGate } from "@/components/marketplace/ZipGate";
import { useStore } from "@/lib/store";
import { useSeo } from "@/lib/seo";
import type { Listing } from "@/lib/types";

export default function Browse(): React.JSX.Element {
  useSeo({
    title: "Browse local food and garden goods",
    description:
      "See what neighbors are growing near you — free produce, trades, garden goods for sale, and wanted posts from local growers.",
  });

  const { zip, allVisibleListings, getMarket } = useStore();
  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const results = useMemo<Listing[]>(() => {
    const q = query.trim().toLowerCase();
    const list = allVisibleListings.filter((l) => {
      if (l.status !== "active") return false;
      if (l.location.approxMiles > filters.maxMiles) return false;
      if (filters.types.length > 0 && !filters.types.includes(l.type)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(l.category)) return false;
      if (q) {
        const haystack = `${l.title} ${l.description} ${l.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (filters.sort === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filters.sort === "price-low") {
        return (a.priceCents ?? 0) - (b.priceCents ?? 0);
      }
      return a.location.approxMiles - b.location.approxMiles;
    });
  }, [allVisibleListings, filters, query]);

  const closed = useMemo(
    () => allVisibleListings.filter((l) => l.status === "completed").slice(0, 4),
    [allVisibleListings],
  );

  const realCount = results.filter((l) => l.origin === "user").length;
  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="bg-background">
      {/* Page head */}
      <div className="border-b border-border bg-grain">
        <div className="container py-7 sm:py-10">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">What&rsquo;s growing nearby</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {zip
              ? `Sorted by distance from ${zip}. Public locations are approximate — exact pickup details stay private until a grower shares them.`
              : "Add your ZIP code to sort by distance. Public locations are always approximate."}
          </p>

          {!zip && <ZipGate size="compact" className="mt-5 max-w-xl" />}
        </div>
      </div>

      <div className="container py-6">
        {/* Search + filter bar — sticks under the header on phones */}
        <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="browse-search" className="sr-only">
                Search listings
              </label>
              <Input
                id="browse-search"
                type="search"
                placeholder="Tomatoes, eggs, seedlings…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 pl-10 pr-9"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <BrowseFilters filters={filters} onChange={setFilters} resultCount={results.length} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
          <div className="hidden lg:block">
            <BrowseFilters filters={filters} onChange={setFilters} resultCount={results.length} />
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{results.length}</span>{" "}
                {results.length === 1 ? "listing" : "listings"} within {filters.maxMiles} mi
                {activeFilterCount > 0 && " with your filters"}
              </p>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="text-sm font-medium text-accent hover:underline lg:hidden"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Honest disclosure about preview records */}
            {realCount === 0 && results.length > 0 && (
              <div className="mb-5 flex gap-3 rounded-xl border border-dashed border-foreground/25 bg-muted/60 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="text-sm">
                  <p className="font-semibold">These are preview listings showing how Gnome works.</p>
                  <p className="mt-1 text-muted-foreground">
                    They aren&rsquo;t real inventory and nothing here is actually available near you yet.
                    When you post a listing it will appear alongside them, clearly marked as real.
                  </p>
                </div>
              </div>
            )}

            {results.length === 0 ? (
              <EmptyState
                onWiden={() => setFilters({ ...filters, maxMiles: 50 })}
                onReset={() => {
                  setFilters(DEFAULT_FILTERS);
                  setQuery("");
                }}
                hasFilters={activeFilterCount > 0 || query !== ""}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-3">
                {results.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} market={getMarket(listing.marketId)} />
                ))}
              </div>
            )}

            {closed.length > 0 && results.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-xl font-semibold">Recently completed</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  These exchanges already happened. Kept visible so you can see the neighborhood is active.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-3">
                  {closed.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} market={getMarket(listing.marketId)} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  onWiden,
  onReset,
  hasFilters,
}: {
  onWiden: () => void;
  onReset: () => void;
  hasFilters: boolean;
}): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-12 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl">
        🌱
      </span>
      <h2 className="mt-5 font-display text-2xl font-bold">Nothing here yet</h2>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        Every neighborhood starts empty. Here are a few ways to get things moving.
      </p>

      <div className="mx-auto mt-7 grid max-w-lg gap-3 text-left">
        {hasFilters && (
          <button
            type="button"
            onClick={onWiden}
            className="flex min-h-[56px] items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-secondary"
          >
            <Search className="h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
            <span>
              <span className="block text-sm font-semibold">Widen the distance to 50 miles</span>
              <span className="block text-xs text-muted-foreground">More growers, a longer drive</span>
            </span>
          </button>
        )}

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex min-h-[56px] items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-secondary"
          >
            <X className="h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
            <span>
              <span className="block text-sm font-semibold">Clear your filters</span>
              <span className="block text-xs text-muted-foreground">Start over with everything visible</span>
            </span>
          </button>
        )}

        <Link
          to="/sell"
          className="flex min-h-[56px] items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:bg-secondary"
        >
          <SproutIcon className="h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
          <span>
            <span className="block text-sm font-semibold">Be the first grower nearby</span>
            <span className="block text-xs text-muted-foreground">Post whatever you have extra of</span>
          </span>
        </Link>

        <Link
          to="/my-market/new-listing?type=wanted"
          className="flex min-h-[56px] items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:bg-secondary"
        >
          <HandHeart className="h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
          <span>
            <span className="block text-sm font-semibold">Post what you&rsquo;re looking for</span>
            <span className="block text-xs text-muted-foreground">
              Growers check wanted posts before they plant
            </span>
          </span>
        </Link>

        <div className="flex min-h-[56px] items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
          <Bell className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>
            <span className="block text-sm font-semibold">Get an alert when something appears</span>
            <span className="block text-xs text-muted-foreground">
              Not connected yet — alerts need an account and a backend
            </span>
          </span>
        </div>
      </div>

      <Button asChild variant="outline" className="mt-7">
        <Link to="/how-it-works">Learn how Gnome works</Link>
      </Button>
    </div>
  );
}
