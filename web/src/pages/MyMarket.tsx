import * as React from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Settings,
  Eye,
  Pause,
  Play,
  CheckCircle2,
  Trash2,
  Inbox,
  Store,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TypeBadge } from "@/components/marketplace/TypeBadge";
import { useStore } from "@/lib/store";
import { useSeo } from "@/lib/seo";
import { getPlan } from "@/lib/plans";
import { formatCents, formatRelativeTime, daysUntil } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Listing } from "@/lib/types";

export default function MyMarket(): React.JSX.Element {
  useSeo({ title: "My Market", noIndex: true });

  const {
    myMarket,
    myListings,
    requests,
    plan,
    listingLimit,
    activeListingCount,
    updateListingStatus,
    deleteListing,
    setRequestStatus,
  } = useStore();

  if (!myMarket) return <NoMarketYet />;

  const planDef = getPlan(plan);
  const drafts = myListings.filter((l) => l.status === "draft");
  const live = myListings.filter((l) => l.status === "active" || l.status === "paused");
  const done = myListings.filter((l) => l.status === "completed" || l.status === "expired");
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const limitPct = Math.min(100, (activeListingCount / listingLimit) * 100);

  return (
    <div className="container max-w-5xl py-6 pb-24 sm:py-10">
      {/* Market header */}
      <div className="flex flex-wrap items-start gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl">
          {myMarket.emblem}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{myMarket.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{myMarket.tagline}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {myMarket.location.label || myMarket.location.zip} · {planDef.name} plan
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Link to={`/market/${myMarket.slug}`}>
              <Eye className="mr-1.5 h-4 w-4" aria-hidden="true" />
              View public page
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Link to="/my-market/setup">
              <Settings className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Plan usage */}
      <div className="mt-7 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-semibold">
            {activeListingCount} of {listingLimit} active listings
          </p>
          <Link to="/pricing" className="text-sm font-medium text-accent hover:underline">
            {plan === "farm" ? "Manage plan" : "Upgrade for more"}
          </Link>
        </div>
        <Progress value={limitPct} className="mt-3 h-2" />
        {activeListingCount >= listingLimit && (
          <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-marigold" aria-hidden="true" />
            You&rsquo;ve hit your plan&rsquo;s limit. Mark a listing complete or upgrade to post more. New
            listings can still be saved as drafts.
          </p>
        )}
      </div>

      {/* Primary action */}
      <Button asChild size="lg" className="mt-5 h-13 w-full text-base sm:w-auto sm:px-8">
        <Link to="/my-market/new-listing">
          <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
          Add a listing
        </Link>
      </Button>

      {/* Requests */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">
          Requests{pendingRequests.length > 0 && ` (${pendingRequests.length} waiting)`}
        </h2>
        {requests.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-border bg-card px-5 py-9 text-center">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 font-medium">No requests yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When a neighbor claims, offers a trade, or asks to buy, it shows up here.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            {requests.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {r.fromName} · <span className="font-normal text-muted-foreground">{r.listingTitle}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{r.message}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {formatRelativeTime(r.createdAt)} · wants {r.quantity}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                      r.status === "pending" && "bg-marigold/20 text-marigold-foreground",
                      r.status === "approved" && "bg-type-free/15 text-type-free",
                      r.status === "declined" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {r.status}
                  </span>
                </div>

                {r.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        setRequestStatus(r.id, "approved");
                        toast.success("Approved", {
                          description: "Now share your pickup details in the conversation.",
                        });
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => setRequestStatus(r.id, "declined")}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Listings */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Your listings</h2>
        <Tabs defaultValue="live" className="mt-3">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-grid">
            <TabsTrigger value="live">Live ({live.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
            <TabsTrigger value="done">Done ({done.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-4">
            <ListingRows
              listings={live}
              emptyText="Nothing live right now. Add your first listing and neighbors will see it in Browse."
              onStatus={updateListingStatus}
              onDelete={deleteListing}
            />
          </TabsContent>
          <TabsContent value="drafts" className="mt-4">
            <ListingRows
              listings={drafts}
              emptyText="No drafts saved."
              onStatus={updateListingStatus}
              onDelete={deleteListing}
            />
          </TabsContent>
          <TabsContent value="done" className="mt-4">
            <ListingRows
              listings={done}
              emptyText="Completed exchanges will collect here."
              onStatus={updateListingStatus}
              onDelete={deleteListing}
            />
          </TabsContent>
        </Tabs>
      </section>

      <p className="mt-10 rounded-xl border border-dashed border-border bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Where this data lives:</span> your Market and listings
        are currently saved in this browser only. They aren&rsquo;t on a server, aren&rsquo;t visible to anyone
        else, and will disappear if you clear your browser data. Connecting a real backend is the next step.
      </p>
    </div>
  );
}

function ListingRows({
  listings,
  emptyText,
  onStatus,
  onDelete,
}: {
  listings: Listing[];
  emptyText: string;
  onStatus: (id: string, status: Listing["status"]) => void;
  onDelete: (id: string) => void;
}): React.JSX.Element {
  if (listings.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">
        {emptyText}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {listings.map((l) => {
        const expiring = l.status === "active" && daysUntil(l.expiresAt) <= 3;
        return (
          <li key={l.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-2xl">
                {l.photoDataUrl ? (
                  <img src={l.photoDataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  l.photo
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <TypeBadge type={l.type} />
                  {l.status === "paused" && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">Paused</span>
                  )}
                  {expiring && (
                    <span className="rounded-full bg-marigold/20 px-2 py-0.5 text-xs font-semibold text-marigold-foreground">
                      Expires in {daysUntil(l.expiresAt)}d
                    </span>
                  )}
                </div>
                <p className="mt-1.5 truncate font-semibold">{l.title}</p>
                <p className="text-xs text-muted-foreground">
                  {l.quantity} {l.unit}
                  {l.priceCents !== null && ` · ${formatCents(l.priceCents)}`} ·{" "}
                  {formatRelativeTime(l.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {l.status !== "draft" && (
                <Button asChild size="sm" variant="ghost">
                  <Link to={`/listing/${l.id}`}>
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    View
                  </Link>
                </Button>
              )}
              {l.status === "active" && (
                <>
                  <Button size="sm" variant="outline" onClick={() => onStatus(l.id, "paused")}>
                    <Pause className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Pause
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onStatus(l.id, "completed");
                      toast.success("Marked complete");
                    }}
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Complete
                  </Button>
                </>
              )}
              {(l.status === "paused" || l.status === "draft") && (
                <Button size="sm" onClick={() => onStatus(l.id, "active")}>
                  <Play className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Publish
                </Button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                    <AlertDialogDescription>
                      &ldquo;{l.title}&rdquo; will be removed. This can&rsquo;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep it</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onDelete(l.id);
                        toast.success("Listing deleted");
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function NoMarketYet(): React.JSX.Element {
  return (
    <div className="container max-w-xl py-16 pb-24 text-center sm:py-24">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
        <Store className="h-9 w-9 text-moss" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">You don&rsquo;t have a Market yet</h1>
      <p className="mt-3 text-muted-foreground">
        A Market is your page on Gnome — it holds your listings and tells neighbors what you grow. Setting one
        up takes about five minutes, and you don&rsquo;t need a farm or a business to have one.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="h-13 px-7 text-base">
          <Link to="/my-market/setup">Create my Market</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-13 px-7 text-base">
          <Link to="/sell">What&rsquo;s involved?</Link>
        </Button>
      </div>
    </div>
  );
}
