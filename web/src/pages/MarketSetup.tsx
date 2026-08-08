import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { useSeo } from "@/lib/seo";
import { PICKUP_LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PickupPreference } from "@/lib/types";

const EMBLEMS = ["🍅", "🥬", "🥚", "🌿", "🌻", "🥕", "🍓", "🌾", "🫑", "🪴", "🍯", "🐝"];

export default function MarketSetup(): React.JSX.Element {
  useSeo({ title: "Create your Market", noIndex: true });

  const navigate = useNavigate();
  const { createMarket, zip, myMarket } = useStore();

  const [name, setName] = useState<string>(myMarket?.name ?? "");
  const [tagline, setTagline] = useState<string>(myMarket?.tagline ?? "");
  const [description, setDescription] = useState<string>(myMarket?.description ?? "");
  const [emblem, setEmblem] = useState<string>(myMarket?.emblem ?? "🍅");
  const [cityLabel, setCityLabel] = useState<string>(myMarket?.location.label ?? "");
  const [zipValue, setZipValue] = useState<string>(myMarket?.location.zip ?? zip);
  const [pickup, setPickup] = useState<PickupPreference>(myMarket?.pickupPreference ?? "porch");

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (name.trim().length < 3) {
      toast.error("Give your Market a name — even something simple works.");
      return;
    }
    if (zipValue.replace(/\D/g, "").length !== 5) {
      toast.error("Add a 5-digit ZIP code so neighbors can find you.");
      return;
    }
    createMarket({
      name: name.trim(),
      tagline: tagline.trim() || "A small garden with extra to share.",
      description: description.trim(),
      emblem,
      zip: zipValue.replace(/\D/g, ""),
      cityLabel: cityLabel.trim(),
      pickupPreference: pickup,
    });
    toast.success("Your Market is open", { description: "Add your first listing whenever you're ready." });
    navigate("/my-market");
  };

  return (
    <div className="container max-w-2xl py-6 pb-24 sm:py-10">
      <Link
        to="/sell"
        className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
        {myMarket ? "Edit your Market" : "Create your Market"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        This is the page neighbors see when they tap your name on a listing. You can change all of it later.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-7">
        <div>
          <Label htmlFor="mkt-name">Market name</Label>
          <Input
            id="mkt-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sycamore Street Garden"
            maxLength={60}
            className="mt-1.5 h-12"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Your street, your last name, your dog&rsquo;s name — anything neighbors will recognize.
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Pick an emblem</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {EMBLEMS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmblem(e)}
                aria-pressed={emblem === e}
                aria-label={`Choose ${e} emblem`}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl border text-2xl transition-all",
                  emblem === e
                    ? "border-primary bg-primary/10 ring-2 ring-primary"
                    : "border-border bg-card hover:bg-secondary",
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <Label htmlFor="mkt-tagline">One line about your garden</Label>
          <Input
            id="mkt-tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Two raised beds and more tomatoes than we can eat."
            maxLength={90}
            className="mt-1.5 h-12"
          />
        </div>

        <div>
          <Label htmlFor="mkt-desc">Tell neighbors a bit more</Label>
          <Textarea
            id="mkt-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What you grow, how long you've been at it, how pickup usually works…"
            className="mt-1.5 resize-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="mkt-city">Your area</Label>
            <Input
              id="mkt-city"
              value={cityLabel}
              onChange={(e) => setCityLabel(e.target.value)}
              placeholder="Richmond Heights, OH"
              className="mt-1.5 h-12"
            />
          </div>
          <div>
            <Label htmlFor="mkt-zip">ZIP code</Label>
            <Input
              id="mkt-zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              value={zipValue}
              onChange={(e) => setZipValue(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="44143"
              className="mt-1.5 h-12"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="mkt-pickup">How do you prefer to hand things off?</Label>
          <Select value={pickup} onValueChange={(v) => setPickup(v as PickupPreference)}>
            <SelectTrigger id="mkt-pickup" className="mt-1.5 h-12">
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

        <div className="flex gap-3 rounded-xl border border-border bg-secondary/50 p-4 text-sm">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
          <p className="text-muted-foreground">
            Your Market page shows your <span className="font-semibold text-foreground">area and ZIP only</span>
            . Gnome never publishes your street address. You share exact pickup details privately, per request,
            after you approve someone.
          </p>
        </div>

        <Button type="submit" size="lg" className="h-13 w-full text-base">
          {myMarket ? "Save changes" : "Open my Market"}
        </Button>
      </form>
    </div>
  );
}
