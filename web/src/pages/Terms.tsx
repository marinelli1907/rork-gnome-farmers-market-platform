import * as React from "react";
import { Link } from "react-router-dom";

import { useSeo } from "@/lib/seo";

const SECTIONS = [
  {
    title: "1. What Gnome is",
    body: "Gnome is a neighborhood marketplace that helps people grow, find, share, and sell local food and garden goods. Gnome provides a platform for neighbors to connect. Gnome is not a party to any transaction between users, does not verify sellers or inspect food, and does not provide legal, food-safety, or agricultural advice.",
  },
  {
    title: "2. Your account",
    body: "You are responsible for maintaining the security of your account and for all activity that occurs under it. You must provide accurate information when creating an account. You may not create an account if you have been previously suspended. You can request account deletion at any time.",
  },
  {
    title: "3. Listings and transactions",
    body: "You are solely responsible for the accuracy of your listings and for completing any exchange you agree to. Gnome does not take a commission on neighbor-to-neighbor transactions. Payment arrangements are made directly between users — Gnome is not involved in payment processing and cannot mediate payment disputes. You are responsible for following all local, state, and federal laws regarding the sale, trade, and distribution of food and agricultural products.",
  },
  {
    title: "4. Prohibited items",
    body: "You may not list items that are illegal to sell in your jurisdiction, including but not limited to: alcohol, cannabis, tobacco, prescription medications, weapons, explosives, hazardous chemicals, and adulterated or misbranded food. Gnome reserves the right to remove any listing at any time.",
  },
  {
    title: "5. Location and privacy",
    body: "Gnome displays approximate locations only. Exact pickup details are shared privately between users after a request is approved. You are responsible for your own safety when meeting another user. Gnome does not verify the identity or background of any user.",
  },
  {
    title: "6. Acceptable use",
    body: "You may not use Gnome to harass, threaten, or defraud other users; to list prohibited items; to spam or solicit unrelated to the platform's purpose; or to attempt to circumvent plan limits or platform restrictions. Violations may result in listing removal, account suspension, or permanent ban.",
  },
  {
    title: "7. Disclaimers",
    body: "Gnome is provided 'as is' without warranty of any kind. We do not guarantee that any listing is accurate, that any seller is trustworthy, or that any food is safe to consume. You use Gnome at your own risk. AI-generated content on Gnome is for informational purposes only and must not be relied upon as legal, medical, safety, or food-regulation guidance.",
  },
  {
    title: "8. Limitation of liability",
    body: "To the maximum extent permitted by law, Gnome shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform or any transaction conducted through it.",
  },
  {
    title: "9. Changes to these terms",
    body: "We may update these terms from time to time. We will notify users of material changes. Continued use of Gnome after changes take effect constitutes acceptance of the updated terms.",
  },
];

export default function Terms(): React.JSX.Element {
  useSeo({ title: "Terms of Service", noIndex: false });

  return (
    <div className="container max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: August 2026</p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-xl font-semibold">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-dashed border-border bg-muted/50 p-5 text-sm text-muted-foreground">
        This is a summary of key terms for a prototype platform, not a complete legal document. Before
        launching, have a qualified attorney review and finalize all terms.{" "}
        <Link to="/contact" className="font-medium text-accent hover:underline">Questions?</Link>
      </div>
    </div>
  );
}
