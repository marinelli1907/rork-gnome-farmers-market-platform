import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, LISTING_TYPE_META } from "@/lib/format";
import type { ListingCategory, ListingType } from "@/lib/types";

export type SortKey = "distance" | "recent" | "price-low";

export interface FilterState {
  types: ListingType[];
  categories: ListingCategory[];
  maxMiles: number;
  sort: SortKey;
}

export const DEFAULT_FILTERS: FilterState = {
  types: [],
  categories: [],
  maxMiles: 25,
  sort: "distance",
};

const ALL_TYPES: ListingType[] = ["free", "trade", "sale", "wanted"];
const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ListingCategory[];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "distance", label: "Closest" },
  { key: "recent", label: "Newest" },
  { key: "price-low", label: "Lowest price" },
];

interface BrowseFiltersProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
}

export function countActiveFilters(f: FilterState): number {
  return (
    f.types.length +
    f.categories.length +
    (f.maxMiles !== DEFAULT_FILTERS.maxMiles ? 1 : 0) +
    (f.sort !== DEFAULT_FILTERS.sort ? 1 : 0)
  );
}

/** Compact chip that stays legible and tappable down to 320px. */
function Chip({
  active,
  onClick,
  children,
  dotClass,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dotClass?: string;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground/80 hover:bg-secondary",
      )}
    >
      {dotClass && <span className={cn("h-2 w-2 rounded-full", dotClass)} aria-hidden="true" />}
      {children}
    </button>
  );
}

/** The shared filter body, reused by the desktop sidebar and the mobile drawer. */
function FilterBody({ filters, onChange }: Omit<BrowseFiltersProps, "resultCount">): React.JSX.Element {
  const toggleType = (t: ListingType): void => {
    onChange({
      ...filters,
      types: filters.types.includes(t) ? filters.types.filter((x) => x !== t) : [...filters.types, t],
    });
  };

  const toggleCategory = (c: ListingCategory): void => {
    onChange({
      ...filters,
      categories: filters.categories.includes(c)
        ? filters.categories.filter((x) => x !== c)
        : [...filters.categories, c],
    });
  };

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Listing type
        </legend>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((t) => (
            <Chip
              key={t}
              active={filters.types.includes(t)}
              onClick={() => toggleType(t)}
              dotClass={LISTING_TYPE_META[t].dot}
            >
              {LISTING_TYPE_META[t].label}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          What is it
        </legend>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((c) => (
            <Chip key={c} active={filters.categories.includes(c)} onClick={() => toggleCategory(c)}>
              {CATEGORY_LABELS[c]}
            </Chip>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <Label htmlFor="distance-slider" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Distance
          </Label>
          <span className="text-sm font-semibold">Within {filters.maxMiles} mi</span>
        </div>
        <Slider
          id="distance-slider"
          min={1}
          max={50}
          step={1}
          value={[filters.maxMiles]}
          onValueChange={([v]) => onChange({ ...filters, maxMiles: v })}
          aria-label="Maximum distance in miles"
        />
      </div>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Sort by
        </legend>
        <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-secondary p-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange({ ...filters, sort: opt.key })}
              aria-pressed={filters.sort === opt.key}
              className={cn(
                "min-h-[40px] rounded-md px-2 text-sm font-medium transition-colors",
                filters.sort === opt.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export function BrowseFilters({ filters, onChange, resultCount }: BrowseFiltersProps): React.JSX.Element {
  const activeCount = countActiveFilters(filters);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Filters</h2>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => onChange(DEFAULT_FILTERS)}
                className="text-sm font-medium text-accent hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <FilterBody filters={filters} onChange={onChange} />
        </div>
      </aside>

      {/* Mobile: one-handed bottom drawer */}
      <div className="lg:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="h-11 gap-2">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
              {activeCount > 0 && (
                <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[88dvh]">
            <DrawerHeader className="flex-row items-center justify-between border-b border-border pb-3 text-left">
              <DrawerTitle className="font-display text-xl">Filters</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" aria-label="Close filters">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </DrawerHeader>

            <div className="overflow-y-auto overscroll-contain px-4 py-5">
              <FilterBody filters={filters} onChange={onChange} />
            </div>

            <div className="flex gap-3 border-t border-border bg-card px-4 py-3 pb-safe">
              <Button variant="outline" className="h-12 flex-1" onClick={() => onChange(DEFAULT_FILTERS)}>
                Clear
              </Button>
              <DrawerClose asChild>
                <Button className="h-12 flex-[2]">
                  Show {resultCount} {resultCount === 1 ? "listing" : "listings"}
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
