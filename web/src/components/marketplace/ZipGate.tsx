import { useState, type FormEvent } from "react";
import { MapPin, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ZipGateProps {
  onSubmitted?: (zip: string) => void;
  className?: string;
  size?: "hero" | "compact";
}

/**
 * ZIP-first local discovery. Answers a visitor's first question — "is anything
 * near me?" — before asking them to sign up for anything.
 */
export function ZipGate({ onSubmitted, className, size = "hero" }: ZipGateProps): React.JSX.Element {
  const { zip, setZip } = useStore();
  const [value, setValue] = useState<string>(zip);
  const [error, setError] = useState<string>("");
  const [locating, setLocating] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const cleaned = value.replace(/\D/g, "").slice(0, 5);
    if (cleaned.length !== 5) {
      setError("Enter a 5-digit ZIP code so we can show what's close to you.");
      return;
    }
    setError("");
    setZip(cleaned);
    onSubmitted?.(cleaned);
  };

  const useMyLocation = (): void => {
    if (!("geolocation" in navigator)) {
      setError("Your browser can't share location. Enter a ZIP code instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        // Production note: coordinates would be resolved to an approximate ZIP
        // server-side. We never store or display precise coordinates.
        setLocating(false);
        setError("Location lookup isn't connected yet — please enter your ZIP code.");
      },
      () => {
        setLocating(false);
        setError("We couldn't get your location. Enter a ZIP code instead.");
      },
      { timeout: 8000, maximumAge: 600_000 },
    );
  };

  const isHero = size === "hero";

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} noValidate>
        <div
          className={cn(
            "flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft sm:flex-row sm:items-center",
            isHero && "sm:p-2.5",
          )}
        >
          <div className="relative flex-1">
            <MapPin
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="zip-input" className="sr-only">
              Your ZIP code
            </label>
            <Input
              id="zip-input"
              inputMode="numeric"
              autoComplete="postal-code"
              pattern="[0-9]*"
              maxLength={5}
              placeholder="Enter your ZIP code"
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 5))}
              aria-invalid={error !== ""}
              aria-describedby={error ? "zip-error" : undefined}
              className={cn(
                "border-0 bg-transparent pl-11 shadow-none focus-visible:ring-0",
                isHero ? "h-14 text-lg" : "h-12",
              )}
            />
          </div>
          <Button type="submit" size={isHero ? "lg" : "default"} className={cn(isHero && "h-14 px-7 text-base")}>
            See what&rsquo;s nearby
          </Button>
        </div>
      </form>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 px-1">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline disabled:opacity-60"
        >
          {locating && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
          Use my current location
        </button>
        <p className="text-xs text-muted-foreground">
          We only use this to sort by distance. Your address is never public.
        </p>
      </div>

      {error && (
        <p id="zip-error" role="alert" className="mt-2 px-1 text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
