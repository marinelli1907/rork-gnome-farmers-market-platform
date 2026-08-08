import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, Search, Sprout, Store, X, ChevronRight, Package, MapPinned, MessagesSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

import { GnomeMark } from "./GnomeMark";


const GROW_LINKS = [
  {
    to: "/garden-planner",
    label: "Garden Planner",
    blurb: "Ask what to plant and when",
    icon: MessagesSquare,
  },
  { to: "/seed-drop", label: "Seed Drop", blurb: "Seeds picked for your zone", icon: Package },
  { to: "/plots", label: "Reserve a Plot", blurb: "Grow without the yard", icon: MapPinned },
];

export function Header(): React.JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [growOpen, setGrowOpen] = useState<boolean>(false);
  const { pathname } = useLocation();
  const { myMarket } = useStore();

  const isActive = (to: string): boolean => pathname === to || pathname.startsWith(`${to}/`);
  const growActive = GROW_LINKS.some((l) => isActive(l.to));

  const linkClass = (active: boolean): string =>
    cn(
      "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
      active
        ? "text-primary-foreground bg-primary"
        : "text-foreground/75 hover:text-foreground hover:bg-secondary",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-3">
        <Link
          to="/"
          className="flex shrink-0 items-center"
          aria-label="Gnome home"
          onClick={() => setOpen(false)}
        >
          <GnomeMark className="h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
          <Link to="/browse" className={linkClass(isActive("/browse"))}>
            Browse
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setGrowOpen(true)}
            onMouseLeave={() => setGrowOpen(false)}
          >
            <button
              type="button"
              className={cn(linkClass(growActive), "inline-flex items-center gap-1")}
              aria-expanded={growOpen}
              aria-haspopup="true"
              onClick={() => setGrowOpen((v) => !v)}
            >
              Grow
              <ChevronRight
                className={cn("h-3.5 w-3.5 transition-transform", growOpen && "rotate-90")}
                aria-hidden="true"
              />
            </button>
            {growOpen && (
              <div className="absolute left-0 top-full w-[19rem] pt-2">
                <div className="animate-grow-in overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lift">
                  {GROW_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setGrowOpen(false)}
                      className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary"
                    >
                      <item.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-moss" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className="block text-xs text-muted-foreground">{item.blurb}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/sell" className={linkClass(isActive("/sell"))}>
            Sell
          </Link>
          <Link to="/my-market" className={linkClass(isActive("/my-market"))}>
            My Market
          </Link>
          <Link to="/pricing" className={linkClass(isActive("/pricing"))}>
            Pricing
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="md:hidden" aria-label="Browse listings">
            <Link to="/browse">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <Button asChild className="hidden sm:inline-flex" size="sm">
            <Link to={myMarket ? "/my-market/new-listing" : "/sell"}>
              <Sprout className="mr-1.5 h-4 w-4" aria-hidden="true" />
              {myMarket ? "Add a listing" : "Sell what you grow"}
            </Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm overflow-y-auto p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
                <GnomeMark className="h-8 w-auto" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="ml-auto rounded-full p-2 hover:bg-secondary"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="p-5" aria-label="Mobile">
                <MobileGroup title="Marketplace">
                  <MobileLink to="/browse" onNavigate={() => setOpen(false)} icon={Search}>
                    Browse what&rsquo;s nearby
                  </MobileLink>
                  <MobileLink to="/sell" onNavigate={() => setOpen(false)} icon={Store}>
                    Sell what you grow
                  </MobileLink>
                  <MobileLink to="/my-market" onNavigate={() => setOpen(false)} icon={Leaf}>
                    My Market
                  </MobileLink>
                </MobileGroup>

                <MobileGroup title="Grow">
                  {GROW_LINKS.map((item) => (
                    <MobileLink key={item.to} to={item.to} onNavigate={() => setOpen(false)} icon={item.icon}>
                      {item.label}
                    </MobileLink>
                  ))}
                </MobileGroup>

                <MobileGroup title="About Gnome">
                  <MobileLink to="/how-it-works" onNavigate={() => setOpen(false)}>
                    How Gnome works
                  </MobileLink>
                  <MobileLink to="/pricing" onNavigate={() => setOpen(false)}>
                    Pricing
                  </MobileLink>
                  <MobileLink to="/trust-and-safety" onNavigate={() => setOpen(false)}>
                    Trust &amp; safety
                  </MobileLink>
                </MobileGroup>

                <Button asChild size="lg" className="mt-4 w-full">
                  <Link to="/browse" onClick={() => setOpen(false)}>
                    See what neighbors are growing
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="mb-6">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function MobileLink({
  to,
  children,
  onNavigate,
  icon: Icon,
}: {
  to: string;
  children: React.ReactNode;
  onNavigate: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}): React.JSX.Element {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="flex min-h-[48px] items-center gap-3 rounded-lg px-3 text-base font-medium transition-colors hover:bg-secondary active:bg-secondary"
    >
      {Icon && <Icon className="h-4.5 w-4.5 text-moss" />}
      {children}
    </Link>
  );
}
