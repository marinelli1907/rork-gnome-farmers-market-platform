import * as React from "react";
import { Gift, Repeat, Tag, HandHeart } from "lucide-react";

import { cn } from "@/lib/utils";
import { LISTING_TYPE_META } from "@/lib/format";
import type { ListingType } from "@/lib/types";

const ICONS: Record<ListingType, React.ComponentType<{ className?: string }>> = {
  free: Gift,
  trade: Repeat,
  sale: Tag,
  wanted: HandHeart,
};

interface TypeBadgeProps {
  type: ListingType;
  className?: string;
}

/**
 * Listing type indicator. Always pairs color with an icon and a text label so
 * meaning never depends on color alone.
 */
export function TypeBadge({ type, className }: TypeBadgeProps): React.JSX.Element {
  const meta = LISTING_TYPE_META[type];
  const Icon = ICONS[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        meta.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

/** Explicit label for illustrative records so demo data is never mistaken for inventory. */
export function PreviewBadge({ className }: { className?: string }): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-dashed border-foreground/35 bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/70 backdrop-blur-sm",
        className,
      )}
      title="An example showing how Gnome works — not real inventory"
    >
      Preview listing
    </span>
  );
}
