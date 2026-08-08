import type { ListingType, ListingCategory, PickupPreference } from "./types";

/** Money is stored as integer cents everywhere. Format only at the edge. */
export function formatCents(cents: number | null): string {
  if (cents === null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatDistance(miles: number): string {
  if (miles < 0.5) return "Just around the corner";
  if (miles < 1) return "Less than a mile away";
  return `${miles.toFixed(1)} mi away`;
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

/**
 * Listing type presentation. Every type pairs a color with a distinct label and
 * icon name so status is never communicated by color alone.
 */
export const LISTING_TYPE_META: Record<
  ListingType,
  { label: string; verb: string; blurb: string; className: string; dot: string }
> = {
  free: {
    label: "Free",
    verb: "Claim it",
    blurb: "Free to a neighbor",
    className: "bg-type-free/12 text-type-free border-type-free/30",
    dot: "bg-type-free",
  },
  trade: {
    label: "Trade",
    verb: "Offer a trade",
    blurb: "Open to a swap",
    className: "bg-type-trade/12 text-type-trade border-type-trade/30",
    dot: "bg-type-trade",
  },
  sale: {
    label: "For sale",
    verb: "Request to buy",
    blurb: "Available to buy",
    className: "bg-type-sale/12 text-type-sale border-type-sale/30",
    dot: "bg-type-sale",
  },
  wanted: {
    label: "Wanted",
    verb: "I have this",
    blurb: "A neighbor is looking for this",
    className: "bg-type-wanted/12 text-type-wanted border-type-wanted/30",
    dot: "bg-type-wanted",
  },
};

export const CATEGORY_LABELS: Record<ListingCategory, string> = {
  vegetables: "Vegetables",
  fruit: "Fruit",
  herbs: "Herbs",
  eggs: "Eggs",
  flowers: "Flowers",
  seedlings: "Seedlings",
  seeds: "Seeds",
  preserves: "Preserves",
  compost: "Compost & soil",
  tools: "Tools & gear",
  other: "Other",
};

export const PICKUP_LABELS: Record<PickupPreference, string> = {
  porch: "Porch pickup",
  "meet-public": "Meet somewhere public",
  "at-market": "Pickup at my market stand",
  arrange: "We'll arrange it in messages",
};

/** Categories that carry extra local-law or food-safety considerations. */
export const REGULATED_CATEGORIES: ListingCategory[] = ["eggs", "preserves"];
