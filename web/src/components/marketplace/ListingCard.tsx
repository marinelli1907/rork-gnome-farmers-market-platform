import { memo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCents, formatDistance, formatRelativeTime, LISTING_TYPE_META } from "@/lib/format";
import type { Listing, Market } from "@/lib/types";

import { TypeBadge, PreviewBadge } from "./TypeBadge";

interface ListingCardProps {
  listing: Listing;
  market?: Market;
  className?: string;
}

/** Compact, tap-friendly listing card. Answers what / how far / what kind / how fresh. */
function ListingCardBase({ listing, market, className }: ListingCardProps): React.JSX.Element {
  const meta = LISTING_TYPE_META[listing.type];
  const isPreview = listing.origin === "preview";
  const isClosed = listing.status === "completed" || listing.status === "expired";

  return (
    <Link
      to={`/listing/${listing.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-soft transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lift focus-visible:-translate-y-0.5",
        isClosed && "opacity-70",
        className,
      )}
    >
      {/* Photo area — emoji stand-in for preview records, uploaded photo for real ones */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-secondary bg-speckle">
        {listing.photoDataUrl ? (
          <img
            src={listing.photoDataUrl}
            alt={listing.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="absolute inset-0 flex items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-110 sm:text-6xl"
            aria-hidden="true"
          >
            {listing.photo}
          </span>
        )}

        <span className="absolute left-2 top-2">
          <TypeBadge type={listing.type} className="bg-background/90 backdrop-blur-sm" />
        </span>

        {isPreview && <PreviewBadge className="absolute right-2 top-2" />}

        {listing.featured && !isPreview && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-marigold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-marigold-foreground">
            <Star className="h-3 w-3 fill-current" aria-hidden="true" />
            Featured
          </span>
        )}

        {isClosed && (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/85 px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-wider text-background">
            {listing.status === "completed" ? "Exchange complete" : "Expired"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-display text-base font-semibold leading-snug sm:text-lg">{listing.title}</h3>

        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {listing.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDistance(listing.location.approxMiles)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatRelativeTime(listing.createdAt)}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2 border-t border-border/70 pt-3">
          <div className="min-w-0">
            {listing.type === "sale" && listing.priceCents !== null ? (
              <p className="font-display text-xl font-bold text-foreground">
                {formatCents(listing.priceCents)}
                <span className="ml-1 text-xs font-medium text-muted-foreground">
                  / {listing.unit.replace(/s$/, "")}
                </span>
              </p>
            ) : (
              <p className="text-sm font-semibold text-foreground">{meta.blurb}</p>
            )}
            {market && (
              <p className="truncate text-xs text-muted-foreground">
                {market.emblem} {market.name}
              </p>
            )}
          </div>
          {!isClosed && (
            <span className="shrink-0 text-xs font-semibold text-accent group-hover:underline">
              {meta.verb}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export const ListingCard = memo(ListingCardBase);
