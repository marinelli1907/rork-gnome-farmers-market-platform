import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { PREVIEW_LISTINGS, PREVIEW_MARKETS } from "./preview-data";
import { readLocal, writeLocal } from "./storage";
import type {
  Listing,
  ListingRequest,
  ListingStatus,
  Market,
  PlanTier,
  RequestKind,
  SavedGardenContext,
} from "./types";
import { getPlan } from "./plans";

interface CreateListingInput {
  type: Listing["type"];
  title: string;
  description: string;
  category: Listing["category"];
  photo: string;
  photoDataUrl?: string;
  quantity: number;
  unit: string;
  priceCents: number | null;
  tradeFor?: string;
  availability: string;
  pickupPreference: Listing["pickupPreference"];
  privatePickupNote: string;
  status: Extract<ListingStatus, "active" | "draft">;
}

interface CreateMarketInput {
  name: string;
  tagline: string;
  description: string;
  emblem: string;
  zip: string;
  cityLabel: string;
  pickupPreference: Market["pickupPreference"];
}

interface GnomeStore {
  /** Viewer's chosen ZIP for local discovery. Empty until they enter one. */
  zip: string;
  setZip: (zip: string) => void;
  plan: PlanTier;
  setPlan: (plan: PlanTier) => void;
  myMarket: Market | null;
  createMarket: (input: CreateMarketInput) => Market;
  updateMarket: (patch: Partial<Market>) => void;
  myListings: Listing[];
  previewListings: Listing[];
  allVisibleListings: Listing[];
  markets: Market[];
  createListing: (input: CreateListingInput) => { ok: true; listing: Listing } | { ok: false; reason: string };
  updateListingStatus: (id: string, status: ListingStatus) => void;
  deleteListing: (id: string) => void;
  requests: ListingRequest[];
  submitRequest: (input: {
    listing: Listing;
    kind: RequestKind;
    message: string;
    quantity: number;
    fromName: string;
  }) => ListingRequest;
  setRequestStatus: (id: string, status: ListingRequest["status"]) => void;
  gardenContext: SavedGardenContext | null;
  saveGardenContext: (ctx: SavedGardenContext) => void;
  clearGardenContext: () => void;
  activeListingCount: number;
  listingLimit: number;
  atListingLimit: boolean;
  getMarket: (id: string) => Market | undefined;
}

const StoreContext = createContext<GnomeStore | null>(null);

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const newId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function StoreProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [zip, setZipState] = useState<string>(() => readLocal<string>("zip", ""));
  const [plan, setPlanState] = useState<PlanTier>(() => readLocal<PlanTier>("plan", "neighbor"));
  const [myMarket, setMyMarket] = useState<Market | null>(() => readLocal<Market | null>("market", null));
  const [myListings, setMyListings] = useState<Listing[]>(() => readLocal<Listing[]>("listings", []));
  const [requests, setRequests] = useState<ListingRequest[]>(() => readLocal<ListingRequest[]>("requests", []));
  const [gardenContext, setGardenContext] = useState<SavedGardenContext | null>(() =>
    readLocal<SavedGardenContext | null>("garden", null),
  );

  useEffect(() => writeLocal("zip", zip), [zip]);
  useEffect(() => writeLocal("plan", plan), [plan]);
  useEffect(() => writeLocal("market", myMarket), [myMarket]);
  useEffect(() => writeLocal("listings", myListings), [myListings]);
  useEffect(() => writeLocal("requests", requests), [requests]);
  useEffect(() => writeLocal("garden", gardenContext), [gardenContext]);

  const setZip = useCallback((value: string) => setZipState(value.trim().slice(0, 5)), []);
  const setPlan = useCallback((value: PlanTier) => setPlanState(value), []);

  const listingLimit = getPlan(plan).listingLimit;
  const activeListingCount = useMemo(
    () => myListings.filter((l) => l.status === "active").length,
    [myListings],
  );
  const atListingLimit = activeListingCount >= listingLimit;

  const createMarket = useCallback(
    (input: CreateMarketInput): Market => {
      const now = new Date().toISOString();
      const market: Market = {
        id: newId("mkt"),
        ownerId: "usr-local",
        origin: "user",
        name: input.name,
        slug: slugify(input.name),
        tagline: input.tagline,
        description: input.description,
        emblem: input.emblem,
        location: { label: input.cityLabel || "Your neighborhood", zip: input.zip, approxMiles: 0 },
        pickupPreference: input.pickupPreference,
        published: true,
        plan,
        growingSince: new Date().getFullYear().toString(),
        completedExchanges: 0,
        responseHours: 24,
        createdAt: now,
        updatedAt: now,
      };
      setMyMarket(market);
      return market;
    },
    [plan],
  );

  const updateMarket = useCallback((patch: Partial<Market>) => {
    setMyMarket((prev) =>
      prev ? { ...prev, ...patch, updatedAt: new Date().toISOString() } : prev,
    );
  }, []);

  const createListing = useCallback(
    (input: CreateListingInput) => {
      if (!myMarket) {
        return { ok: false as const, reason: "You need a Market before you can post a listing." };
      }
      // Mirrors the server-side rule: plan tier caps concurrent active listings.
      if (input.status === "active" && activeListingCount >= listingLimit) {
        return {
          ok: false as const,
          reason: `Your ${getPlan(plan).name} plan allows ${listingLimit} active listings. Save this as a draft, or mark another listing complete first.`,
        };
      }
      const listing: Listing = {
        id: newId("lst"),
        origin: "user",
        marketId: myMarket.id,
        type: input.type,
        status: input.status,
        title: input.title,
        description: input.description,
        category: input.category,
        photo: input.photo,
        photoDataUrl: input.photoDataUrl,
        quantity: input.quantity,
        unit: input.unit,
        priceCents: input.priceCents,
        tradeFor: input.tradeFor,
        location: myMarket.location,
        availability: input.availability,
        pickupPreference: input.pickupPreference,
        privatePickupNote: input.privatePickupNote,
        featured: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 14 * 86_400_000).toISOString(),
      };
      setMyListings((prev) => [listing, ...prev]);
      return { ok: true as const, listing };
    },
    [myMarket, activeListingCount, listingLimit, plan],
  );

  const updateListingStatus = useCallback((id: string, status: ListingStatus) => {
    setMyListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const deleteListing = useCallback((id: string) => {
    setMyListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const submitRequest = useCallback(
    (input: {
      listing: Listing;
      kind: RequestKind;
      message: string;
      quantity: number;
      fromName: string;
    }): ListingRequest => {
      const request: ListingRequest = {
        id: newId("req"),
        listingId: input.listing.id,
        listingTitle: input.listing.title,
        kind: input.kind,
        status: "pending",
        fromName: input.fromName,
        message: input.message,
        quantity: input.quantity,
        createdAt: new Date().toISOString(),
      };
      setRequests((prev) => [request, ...prev]);
      return request;
    },
    [],
  );

  const setRequestStatus = useCallback((id: string, status: ListingRequest["status"]) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const saveGardenContext = useCallback((ctx: SavedGardenContext) => setGardenContext(ctx), []);
  const clearGardenContext = useCallback(() => setGardenContext(null), []);

  const markets = useMemo<Market[]>(
    () => (myMarket ? [myMarket, ...PREVIEW_MARKETS] : PREVIEW_MARKETS),
    [myMarket],
  );

  const getMarket = useCallback((id: string) => markets.find((m) => m.id === id), [markets]);

  const allVisibleListings = useMemo<Listing[]>(
    () => [...myListings.filter((l) => l.status !== "draft"), ...PREVIEW_LISTINGS],
    [myListings],
  );

  const value = useMemo<GnomeStore>(
    () => ({
      zip,
      setZip,
      plan,
      setPlan,
      myMarket,
      createMarket,
      updateMarket,
      myListings,
      previewListings: PREVIEW_LISTINGS,
      allVisibleListings,
      markets,
      createListing,
      updateListingStatus,
      deleteListing,
      requests,
      submitRequest,
      setRequestStatus,
      gardenContext,
      saveGardenContext,
      clearGardenContext,
      activeListingCount,
      listingLimit,
      atListingLimit,
      getMarket,
    }),
    [
      zip,
      setZip,
      plan,
      setPlan,
      myMarket,
      createMarket,
      updateMarket,
      myListings,
      allVisibleListings,
      markets,
      createListing,
      updateListingStatus,
      deleteListing,
      requests,
      submitRequest,
      setRequestStatus,
      gardenContext,
      saveGardenContext,
      clearGardenContext,
      activeListingCount,
      listingLimit,
      atListingLimit,
      getMarket,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): GnomeStore {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
