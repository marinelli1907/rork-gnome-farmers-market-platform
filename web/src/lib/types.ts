/** Core domain types for the Gnome neighborhood marketplace. */

export type ListingType = "free" | "trade" | "sale" | "wanted";

export type ListingStatus = "active" | "paused" | "completed" | "expired" | "draft";

/** Where a record came from. Preview records are illustrative, never real inventory. */
export type RecordOrigin = "preview" | "user";

export type PlanTier = "neighbor" | "grower" | "farm";

export type ListingCategory =
  | "vegetables"
  | "fruit"
  | "herbs"
  | "eggs"
  | "flowers"
  | "seedlings"
  | "seeds"
  | "preserves"
  | "compost"
  | "tools"
  | "other";

export type RequestKind = "claim" | "trade-offer" | "purchase" | "wanted-response" | "question";

export type RequestStatus = "pending" | "approved" | "declined" | "cancelled" | "completed";

export type PickupPreference = "porch" | "meet-public" | "at-market" | "arrange";

/**
 * Public locations are always approximate. We store a display label plus a ZIP,
 * never a street address. Exact pickup detail lives in `privatePickupNote`,
 * which is only revealed after a seller approves a request.
 */
export interface ApproximateLocation {
  /** e.g. "Richmond Heights, OH" */
  label: string;
  zip: string;
  /** Rough distance in miles from the viewer's ZIP. Derived, never precise. */
  approxMiles: number;
}

export interface Market {
  id: string;
  ownerId: string;
  origin: RecordOrigin;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  emblem: string;
  location: ApproximateLocation;
  pickupPreference: PickupPreference;
  published: boolean;
  plan: PlanTier;
  growingSince: string;
  completedExchanges: number;
  responseHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  origin: RecordOrigin;
  marketId: string;
  type: ListingType;
  status: ListingStatus;
  title: string;
  description: string;
  category: ListingCategory;
  /** Emoji stand-in for produce photography. Real listings use uploaded photos. */
  photo: string;
  photoDataUrl?: string;
  quantity: number;
  unit: string;
  /** Money is always integer cents. Null for free / trade / wanted listings. */
  priceCents: number | null;
  /** What a trade listing is hoping to receive. */
  tradeFor?: string;
  location: ApproximateLocation;
  availability: string;
  pickupPreference: PickupPreference;
  /** Never shown publicly — revealed only after the seller approves a request. */
  privatePickupNote: string;
  featured: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface ListingRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  kind: RequestKind;
  status: RequestStatus;
  fromName: string;
  message: string;
  quantity: number;
  createdAt: string;
}

export interface PlanDefinition {
  tier: PlanTier;
  name: string;
  who: string;
  priceCents: number;
  listingLimit: number;
  marketLimit: number;
  promotionsPerMonth: number;
  aiCreditsPerMonth: number;
  analytics: string;
  support: string;
  highlights: string[];
}

export interface SavedGardenContext {
  zip: string;
  spaceDescription: string;
  sunExposure: string;
  experience: string;
}
