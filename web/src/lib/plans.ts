import type { PlanDefinition, PlanTier } from "./types";

/**
 * Plan definitions. In production these limits must be enforced server-side;
 * this module is the single client-side source so the UI never invents a limit.
 */
export const PLANS: PlanDefinition[] = [
  {
    tier: "neighbor",
    name: "Neighbor",
    who: "For people browsing, sharing occasionally, and creating wanted posts.",
    priceCents: 0,
    listingLimit: 3,
    marketLimit: 1,
    promotionsPerMonth: 0,
    aiCreditsPerMonth: 5,
    analytics: "Basic view counts",
    support: "Help center",
    highlights: [
      "Browse everything nearby",
      "Message neighbors directly",
      "Post up to 3 listings at a time",
      "Create wanted posts",
      "Claim free listings",
    ],
  },
  {
    tier: "grower",
    name: "Grower",
    who: "For serious gardeners who want an active storefront and regular listings.",
    priceCents: 900,
    listingLimit: 40,
    marketLimit: 1,
    promotionsPerMonth: 4,
    aiCreditsPerMonth: 100,
    analytics: "Views, requests, repeat buyers",
    support: "Email support",
    highlights: [
      "Everything in Neighbor",
      "Up to 40 active listings",
      "Customizable Market page",
      "4 featured listings each month",
      "AI listing assistant + Garden Planner",
      "Repeat-buyer insights",
    ],
  },
  {
    tier: "farm",
    name: "Farm",
    who: "For high-volume sellers, farm stands, and established local producers.",
    priceCents: 2900,
    listingLimit: 500,
    marketLimit: 3,
    promotionsPerMonth: 20,
    aiCreditsPerMonth: 600,
    analytics: "Full dashboard + CSV export",
    support: "Priority email support",
    highlights: [
      "Everything in Grower",
      "Up to 500 active listings",
      "Up to 3 Markets",
      "20 featured listings each month",
      "Plot arrangements and pre-orders",
      "Priority placement in Browse",
    ],
  },
];

export function getPlan(tier: PlanTier): PlanDefinition {
  const found = PLANS.find((p) => p.tier === tier);
  if (!found) throw new Error(`Unknown plan tier: ${tier}`);
  return found;
}
