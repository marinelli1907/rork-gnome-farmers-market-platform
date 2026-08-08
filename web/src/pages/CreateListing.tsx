import { useRef, useState, type ChangeEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Camera, ImagePlus, Sparkles, Loader2, X, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { useSeo } from "@/lib/seo";
import { CATEGORY_LABELS, LISTING_TYPE_META, PICKUP_LABELS, REGULATED_CATEGORIES } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ListingCategory, ListingType, PickupPreference } from "@/lib/types";

const TYPES: ListingType[] = ["free", "trade", "sale", "wanted"];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as ListingCategory[];
const EMOJI_BY_CATEGORY: Record<ListingCategory, string> = {
  vegetables: "🥬",
  fruit: "🍓",
  herbs: "🌿",
  eggs: "🥚",
  flowers: "💐",
  seedlings: "🌱",
  seeds: "🫘",
  preserves: "🍯",
  compost: "🪴",
  tools: "🧰",
  other: "🧺",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function CreateListing(): React.JSX.Element {
  useSeo({ title: "Add a listing", noIndex: true });

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { myMarket, createListing, atListingLimit } = useStore();

  const initialType = (params.get("type") as ListingType | null) ?? "free";

  const [type, setType] = useState<ListingType>(TYPES.includes(initialType) ? initialType : "free");
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<ListingCategory>("vegetables");
  const [quantity, setQuantity] = useState<string>("1");
  const [unit, setUnit] = useState<string>("lbs");
  const [price, setPrice] = useState<string>("");
  const [tradeFor, setTradeFor] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");
  const [pickup, setPickup] = useState<PickupPreference>(myMarket?.pickupPreference ?? "porch");
  const [privateNote, setPrivateNote] = useState<string>("");
  const [drafting, setDrafting] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  if (!myMarket) {
    return (
      <div className="container max-w-lg py-20 pb-24 text-center">
        <h1 className="font-display text-3xl font-bold">Create a Market first</h1>
        <p className="mt-3 text-muted-foreground">
          Listings live inside a Market. Setting one up takes about five minutes.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/my-market/setup">Create my Market</Link>
        </Button>
      </div>
    );
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side guardrails. A real backend must re-validate type, size, and
    // strip EXIF (including GPS) before storing anything.
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("That file type isn't supported", { description: "Use a JPEG, PNG, or WebP photo." });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("That photo is too large", { description: "Please pick one under 5 MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => toast.error("We couldn't read that photo. Try another one.");
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /** Placeholder for the AI listing assistant. Output is always shown for review. */
  const draftWithAssistant = (): void => {
    if (!photoDataUrl && title.trim().length < 3) {
      toast.error("Add a photo or a few words first", {
        description: "The assistant needs something to work from.",
      });
      return;
    }
    setDrafting(true);
    window.setTimeout(() => {
      setDrafting(false);
      toast("The AI assistant isn't connected yet", {
        description:
          "This needs a backend so API keys stay server-side. Nothing would publish without your review anyway.",
      });
    }, 900);
  };

  const handleSubmit = (status: "active" | "draft"): void => {
    if (title.trim().length < 3) {
      toast.error("Give your listing a title.");
      return;
    }
    if (description.trim().length < 10) {
      toast.error("Add a sentence or two so neighbors know what they're getting.");
      return;
    }
    const priceCents =
      type === "sale" ? Math.round(Number.parseFloat(price.replace(/[^0-9.]/g, "")) * 100) : null;
    if (type === "sale" && (priceCents === null || Number.isNaN(priceCents) || priceCents <= 0)) {
      toast.error("Add a price for a listing that's for sale.");
      return;
    }

    const result = createListing({
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      photo: EMOJI_BY_CATEGORY[category],
      photoDataUrl: photoDataUrl || undefined,
      quantity: Math.max(1, Number.parseInt(quantity, 10) || 1),
      unit: unit.trim() || "items",
      priceCents,
      tradeFor: type === "trade" ? tradeFor.trim() || undefined : undefined,
      availability: availability.trim() || "Message me to arrange a time",
      pickupPreference: pickup,
      privatePickupNote: privateNote.trim(),
      status,
    });

    if (result.ok === false) {
      toast.error("Couldn't publish", { description: result.reason });
      return;
    }

    toast.success(status === "active" ? "Your listing is live" : "Draft saved");
    navigate("/my-market");
  };

  const isRegulated = REGULATED_CATEGORIES.includes(category);

  return (
    <div className="container max-w-2xl py-6 pb-40 sm:py-10 md:pb-24">
      <Link
        to="/my-market"
        className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        My Market
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Add a listing</h1>
      <p className="mt-2 text-muted-foreground">
        Snap a photo, say what it is, and you&rsquo;re done. Should take about a minute.
      </p>

      {atListingLimit && (
        <div className="mt-5 flex gap-3 rounded-xl border border-marigold/40 bg-marigold/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-marigold" aria-hidden="true" />
          <p>
            <span className="font-semibold">You&rsquo;re at your plan&rsquo;s active listing limit.</span>{" "}
            <span className="text-foreground/80">
              You can still save this as a draft, or{" "}
              <Link to="/pricing" className="font-medium underline">
                upgrade your plan
              </Link>
              .
            </span>
          </p>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {/* Type */}
        <fieldset>
          <legend className="text-sm font-medium">What kind of listing is this?</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={cn(
                  "flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-all",
                  type === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-secondary",
                )}
              >
                <span className="text-sm font-semibold">{LISTING_TYPE_META[t].label}</span>
                <span
                  className={cn(
                    "text-[11px] leading-tight",
                    type === t ? "text-primary-foreground/70" : "text-muted-foreground",
                  )}
                >
                  {t === "wanted" ? "You're looking" : "You have it"}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Photo */}
        <div>
          <Label>Photo</Label>
          {photoDataUrl ? (
            <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-xl border border-border">
              <img src={photoDataUrl} alt="Your listing" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotoDataUrl("")}
                aria-label="Remove photo"
                className="absolute right-2 top-2 rounded-full bg-foreground/75 p-2 text-background backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Camera className="h-6 w-6 text-moss" aria-hidden="true" />
                Take a photo
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card text-sm font-medium transition-colors hover:bg-secondary"
              >
                <ImagePlus className="h-6 w-6 text-moss" aria-hidden="true" />
                Choose from library
              </button>
            </div>
          )}
          <input
            ref={cameraRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={handleFile}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            JPEG, PNG, or WebP, up to 5 MB. Location data embedded in photos is removed before anything is
            shared publicly.
          </p>
        </div>

        {/* AI assist */}
        <button
          type="button"
          onClick={draftWithAssistant}
          disabled={drafting}
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-accent/50 bg-accent/[0.06] p-4 text-left transition-colors hover:bg-accent/10 disabled:opacity-70"
        >
          {drafting ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-accent" aria-hidden="true" />
          ) : (
            <Sparkles className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          )}
          <span>
            <span className="block text-sm font-semibold">Draft this for me</span>
            <span className="block text-xs text-muted-foreground">
              Suggests a title, description, and price. You review everything before it publishes.
            </span>
          </span>
        </button>

        <div>
          <Label htmlFor="l-title">Title</Label>
          <Input
            id="l-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Way too many cherry tomatoes"
            maxLength={70}
            className="mt-1.5 h-12"
          />
        </div>

        <div>
          <Label htmlFor="l-desc">Description</Label>
          <Textarea
            id="l-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What it is, how much there is, when you picked it…"
            className="mt-1.5 resize-none"
          />
        </div>

        <div>
          <Label htmlFor="l-cat">Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as ListingCategory)}>
            <SelectTrigger id="l-cat" className="mt-1.5 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {EMOJI_BY_CATEGORY[c]} {CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isRegulated && (
          <div className="flex gap-3 rounded-xl border border-marigold/40 bg-marigold/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-marigold" aria-hidden="true" />
            <p>
              <span className="font-semibold">Check your local rules first.</span>{" "}
              <span className="text-foreground/80">
                Selling eggs, preserves, and other home-produced foods is regulated differently in every state
                and county — some require licensing, labeling, or inspection. Gnome doesn&rsquo;t provide legal
                advice.{" "}
                <Link to="/trust-and-safety" className="font-medium underline">
                  What to know
                </Link>
              </span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="l-qty">How many</Label>
            <Input
              id="l-qty"
              type="number"
              inputMode="numeric"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>
          <div>
            <Label htmlFor="l-unit">Unit</Label>
            <Input
              id="l-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="lbs, bunches, dozen"
              className="mt-1.5 h-12"
            />
          </div>
        </div>

        {type === "sale" && (
          <div>
            <Label htmlFor="l-price">Price per {unit.replace(/s$/, "") || "item"}</Label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="l-price"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="4.00"
                className="h-12 pl-7"
              />
            </div>
          </div>
        )}

        {type === "trade" && (
          <div>
            <Label htmlFor="l-trade">What would you like in return?</Label>
            <Input
              id="l-trade"
              value={tradeFor}
              onChange={(e) => setTradeFor(e.target.value)}
              placeholder="Pepper seedlings, or anything you've canned"
              className="mt-1.5 h-12"
            />
          </div>
        )}

        <div>
          <Label htmlFor="l-avail">When is it available?</Label>
          <Input
            id="l-avail"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="All week, mornings are best"
            className="mt-1.5 h-12"
          />
        </div>

        <div>
          <Label htmlFor="l-pickup">Pickup</Label>
          <Select value={pickup} onValueChange={(v) => setPickup(v as PickupPreference)}>
            <SelectTrigger id="l-pickup" className="mt-1.5 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PICKUP_LABELS) as PickupPreference[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {PICKUP_LABELS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="l-private">
            Private pickup details
            <span className="ml-1.5 font-normal text-muted-foreground">(never shown publicly)</span>
          </Label>
          <Textarea
            id="l-private"
            rows={2}
            value={privateNote}
            onChange={(e) => setPrivateNote(e.target.value)}
            placeholder="Cooler on the side porch, house number is…"
            className="mt-1.5 resize-none"
          />
          <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Only shared with people whose request you approve. Never on your public listing.
          </p>
        </div>
      </div>

      {/* Sticky publish bar — sits above the mobile tab bar */}
      <div className="fixed inset-x-0 bottom-14 z-30 flex gap-3 border-t border-border bg-background/95 p-3 pb-safe backdrop-blur-md md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <Button variant="outline" className="h-12 flex-1 md:flex-none md:px-8" onClick={() => handleSubmit("draft")}>
          Save draft
        </Button>
        <Button className="h-12 flex-[2] md:flex-none md:px-10" onClick={() => handleSubmit("active")}>
          Publish listing
        </Button>
      </div>
    </div>
  );
}
