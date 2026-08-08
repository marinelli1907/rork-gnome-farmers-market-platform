import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Package,
  CalendarDays,
  ShieldCheck,
  Lock,
  Flag,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { TypeBadge, PreviewBadge } from "@/components/marketplace/TypeBadge";
import { ReportDrawer } from "@/components/marketplace/ReportDrawer";
import { useStore } from "@/lib/store";
import { useSeo } from "@/lib/seo";
import {
  formatCents,
  formatDistance,
  formatRelativeTime,
  daysUntil,
  LISTING_TYPE_META,
  CATEGORY_LABELS,
  PICKUP_LABELS,
  REGULATED_CATEGORIES,
} from "@/lib/format";
import type { RequestKind } from "@/lib/types";

const KIND_BY_TYPE: Record<string, RequestKind> = {
  free: "claim",
  trade: "trade-offer",
  sale: "purchase",
  wanted: "wanted-response",
};

export default function ListingDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allVisibleListings, getMarket, submitRequest, requests } = useStore();

  const listing = useMemo(
    () => allVisibleListings.find((l) => l.id === id),
    [allVisibleListings, id],
  );

  useSeo({
    title: listing ? listing.title : "Listing",
    description: listing?.description.slice(0, 155) ?? "A local listing on Gnome.",
  });

  if (!listing) {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <span className="text-5xl" aria-hidden="true">
          🥕
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold">This listing is gone</h1>
        <p className="mt-2 text-muted-foreground">
          It may have been claimed, completed, or taken down by the grower.
        </p>
        <Button asChild className="mt-6">
          <Link to="/browse">Back to browse</Link>
        </Button>
      </div>
    );
  }

  const market = getMarket(listing.marketId);
  const meta = LISTING_TYPE_META[listing.type];
  const isPreview = listing.origin === "preview";
  const isClosed = listing.status === "completed" || listing.status === "expired";
  const existingRequest = requests.find((r) => r.listingId === listing.id);
  const expiresInDays = daysUntil(listing.expiresAt);
  const isRegulated = REGULATED_CATEGORIES.includes(listing.category);

  return (
    <div className="pb-28 md:pb-0">
      <div className="container py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
      </div>

      <div className="container grid gap-8 pb-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        {/* Photo */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary bg-speckle">
            {listing.photoDataUrl ? (
              <img
                src={listing.photoDataUrl}
                alt={listing.title}
                className="h-full w-full object-cover"
                decoding="async"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-8xl sm:text-9xl" aria-hidden="true">
                {listing.photo}
              </span>
            )}
            {isPreview && <PreviewBadge className="absolute left-3 top-3" />}
            {isClosed && (
              <div className="absolute inset-x-0 bottom-0 bg-foreground/85 py-2.5 text-center text-sm font-semibold uppercase tracking-wider text-background">
                {listing.status === "completed" ? "Exchange complete" : "Listing expired"}
              </div>
            )}
          </div>

          {isPreview && (
            <div className="mt-4 flex gap-3 rounded-xl border border-dashed border-foreground/25 bg-muted/60 p-4 text-sm">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <p>
                <span className="font-semibold">This is a preview listing.</span>{" "}
                <span className="text-muted-foreground">
                  It shows how a real listing looks and behaves. Nothing here is actually available, and no
                  request you send will reach a real person.
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={listing.type} />
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {CATEGORY_LABELS[listing.category]}
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{listing.title}</h1>

          {listing.type === "sale" && listing.priceCents !== null ? (
            <p className="mt-3 font-display text-3xl font-bold">
              {formatCents(listing.priceCents)}
              <span className="ml-1.5 text-base font-medium text-muted-foreground">
                per {listing.unit.replace(/s$/, "")}
              </span>
            </p>
          ) : (
            <p className="mt-3 text-lg font-semibold text-moss">{meta.blurb}</p>
          )}

          {listing.tradeFor && (
            <p className="mt-2 rounded-lg bg-type-trade/10 px-3 py-2 text-sm">
              <span className="font-semibold">Hoping to trade for:</span> {listing.tradeFor}
            </p>
          )}

          <p className="mt-5 whitespace-pre-line leading-relaxed text-foreground/85">{listing.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-4">
            <Fact icon={MapPin} label="Distance" value={formatDistance(listing.location.approxMiles)} />
            <Fact icon={Package} label="Available" value={`${listing.quantity} ${listing.unit}`} />
            <Fact icon={CalendarDays} label="When" value={listing.availability} />
            <Fact
              icon={Clock}
              label="Posted"
              value={`${formatRelativeTime(listing.createdAt)}${
                expiresInDays > 0 ? ` · expires in ${expiresInDays}d` : ""
              }`}
            />
          </dl>

          {/* Location privacy — reassurance in-product, not buried in the policy */}
          <div className="mt-4 flex gap-3 rounded-xl border border-border bg-secondary/50 p-4">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold">{listing.location.label} — approximate</p>
              <p className="mt-1 text-muted-foreground">
                Gnome shows a general area, never a home address. {PICKUP_LABELS[listing.pickupPreference]} —
                exact pickup details are shared privately, only after the grower approves your request.
              </p>
            </div>
          </div>

          {isRegulated && (
            <div className="mt-4 flex gap-3 rounded-xl border border-marigold/40 bg-marigold/10 p-4 text-sm">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-marigold" aria-hidden="true" />
              <p>
                <span className="font-semibold">Local rules may apply.</span>{" "}
                <span className="text-foreground/80">
                  Eggs, preserves, and other home-produced foods are regulated differently in every state and
                  county. Both people are responsible for knowing their local rules. Gnome doesn&rsquo;t provide
                  legal advice. <Link to="/trust-and-safety" className="font-medium underline">Read more</Link>
                </span>
              </p>
            </div>
          )}

          {/* Grower */}
          {market && (
            <Link
              to={`/market/${market.slug}`}
              className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary text-2xl">
                {market.emblem}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold">{market.name}</span>
                <span className="block truncate text-sm text-muted-foreground">{market.tagline}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Growing since {market.growingSince} · {market.completedExchanges} completed exchanges ·
                  usually replies in ~{market.responseHours}h
                </span>
              </span>
            </Link>
          )}

          {/* Desktop action */}
          <div className="mt-6 hidden md:block">
            {existingRequest ? (
              <RequestSentNotice />
            ) : isClosed ? (
              <Button size="lg" disabled className="w-full">
                No longer available
              </Button>
            ) : (
              <RequestDrawer
                trigger={
                  <Button size="lg" className="h-13 w-full text-base">
                    {meta.verb}
                  </Button>
                }
                listing={listing}
                isPreview={isPreview}
                onSubmit={submitRequest}
              />
            )}
          </div>

          <ReportDrawer
            targetType="listing"
            targetId={listing.id}
            targetName={listing.title}
            className="mt-4"
            trigger={
              <button
                type="button"
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <Flag className="h-4 w-4" aria-hidden="true" />
                Report this listing
              </button>
            }
          />
        </div>
      </div>

      {/* Mobile sticky action */}
      {!isClosed && !existingRequest && (
        <div className="fixed inset-x-0 bottom-14 z-40 border-t border-border bg-background/95 p-3 pb-safe backdrop-blur-md md:hidden">
          <RequestDrawer
            trigger={
              <Button size="lg" className="h-13 w-full text-base">
                {meta.verb}
                {listing.type === "sale" && listing.priceCents !== null && (
                  <span className="ml-2 opacity-80">· {formatCents(listing.priceCents)}</span>
                )}
              </Button>
            }
            listing={listing}
            isPreview={isPreview}
            onSubmit={submitRequest}
          />
        </div>
      )}
      {existingRequest && (
        <div className="fixed inset-x-0 bottom-14 z-40 border-t border-border bg-background/95 p-3 pb-safe backdrop-blur-md md:hidden">
          <RequestSentNotice />
        </div>
      )}
    </div>
  );
}

function RequestSentNotice(): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-type-free/40 bg-type-free/10 px-4 py-3">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-type-free" aria-hidden="true" />
      <p className="text-sm">
        <span className="font-semibold">Request sent.</span>{" "}
        <span className="text-muted-foreground">
          You&rsquo;ll hear back in messages once the grower reviews it.
        </span>
      </p>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
    </div>
  );
}

interface RequestDrawerProps {
  trigger: React.ReactNode;
  listing: import("@/lib/types").Listing;
  isPreview: boolean;
  onSubmit: ReturnType<typeof useStore>["submitRequest"];
}

function RequestDrawer({ trigger, listing, isPreview, onSubmit }: RequestDrawerProps): React.JSX.Element {
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [open, setOpen] = useState<boolean>(false);
  const meta = LISTING_TYPE_META[listing.type];

  const prompts: Record<string, string> = {
    free: "Let them know when you can swing by.",
    trade: "What are you offering in exchange?",
    sale: "How much would you like, and when can you pick up?",
    wanted: "Tell them what you have and how much.",
  };

  const handleSubmit = (): void => {
    if (name.trim().length < 2) {
      toast.error("Add your first name so the grower knows who's asking.");
      return;
    }
    if (message.trim().length < 5) {
      toast.error("Add a short note — growers respond much faster to a real message.");
      return;
    }
    onSubmit({
      listing,
      kind: KIND_BY_TYPE[listing.type],
      message: message.trim(),
      quantity: Math.max(1, Number.parseInt(quantity, 10) || 1),
      fromName: name.trim(),
    });
    setOpen(false);
    toast.success(
      isPreview ? "Saved to your requests (preview listing)" : "Request sent",
      {
        description: isPreview
          ? "This is a preview listing, so no real grower was contacted."
          : "The grower will see it in their Market.",
      },
    );
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="max-h-[92dvh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-display text-2xl">{meta.verb}</DrawerTitle>
          <DrawerDescription>{listing.title}</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 overflow-y-auto overscroll-contain px-4 pb-4">
          {isPreview && (
            <p className="rounded-lg border border-dashed border-foreground/25 bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
              This is a preview listing. Your request is saved locally so you can see the flow — no real
              person is contacted.
            </p>
          )}

          <div>
            <Label htmlFor="req-name">Your first name</Label>
            <Input
              id="req-name"
              autoComplete="given-name"
              placeholder="Sam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>

          {listing.type !== "wanted" && (
            <div>
              <Label htmlFor="req-qty">How many {listing.unit}?</Label>
              <Input
                id="req-qty"
                type="number"
                inputMode="numeric"
                min={1}
                max={listing.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1.5 h-12"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {listing.quantity} {listing.unit} available
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="req-msg">Message</Label>
            <Textarea
              id="req-msg"
              rows={4}
              placeholder={prompts[listing.type]}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1.5 resize-none"
            />
          </div>

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Your message stays between the two of you. Pickup details are shared after the grower approves.
          </p>
        </div>

        <div className="flex gap-3 border-t border-border bg-card px-4 py-3 pb-safe">
          <DrawerClose asChild>
            <Button variant="outline" className="h-12 flex-1">
              Cancel
            </Button>
          </DrawerClose>
          <Button className="h-12 flex-[2]" onClick={handleSubmit}>
            Send request
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
