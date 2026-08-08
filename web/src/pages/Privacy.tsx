import * as React from "react";
import { Link } from "react-router-dom";
import { Lock, MapPin, Camera, MessageCircle, Trash2 } from "lucide-react";

import { useSeo } from "@/lib/seo";

const SECTIONS = [
  {
    icon: MapPin,
    title: "Location information",
    body: "Gnome uses your ZIP code to sort listings by distance. We display approximate locations only — never your street address. Exact pickup details are shared privately between users, only after a request is approved. We do not publicly display precise coordinates. If you use the 'use my location' feature, your coordinates are used only to find an approximate ZIP and are not stored unless you choose to save your ZIP code.",
  },
  {
    icon: Camera,
    title: "Photos and EXIF data",
    body: "When you upload a photo for a listing, we strip EXIF metadata (which can include GPS coordinates) before the photo is displayed publicly. In production, this happens server-side before storage. Your private photos are never shared without your explicit action.",
  },
  {
    icon: MessageCircle,
    title: "Messages",
    body: "Your conversations with other users are private. Other users cannot read your conversations. We do not use the content of your messages for advertising. If you report a message, we may review it as part of the report. We do not sell your message data.",
  },
  {
    icon: Lock,
    title: "What we collect",
    body: "Your display name, email, ZIP code, listings, and messages. Analytics events (page views, listing views, searches) that do not include personal message content or exact addresses. We collect only what we need to run the platform.",
  },
  {
    icon: Trash2,
    title: "Your controls",
    body: "You can edit or delete your listings at any time. You can clear your saved garden details. You can request full account deletion, which removes your profile, listings, and messages. Reported content may be retained for moderation review even after deletion, as described in our Trust & Safety page.",
  },
];

export default function Privacy(): React.JSX.Element {
  useSeo({ title: "Privacy Policy" });

  return (
    <div className="container max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: August 2026</p>

      <p className="mt-8 text-base leading-relaxed text-foreground/80">
        Gnome is designed to help neighbors exchange food locally. That only works if you trust us with your
        information. Here&rsquo;s what we collect, why, and what controls you have.
      </p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title} className="rounded-xl border border-border bg-card p-6">
            <section.icon className="h-6 w-6 text-moss" aria-hidden="true" />
            <h2 className="mt-3 font-display text-xl font-semibold">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">What we don&rsquo;t do</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• We don&rsquo;t sell your data to third parties.</li>
          <li>• We don&rsquo;t use your messages for advertising.</li>
          <li>• We don&rsquo;t publicly display your home address.</li>
          <li>• We don&rsquo;t share your exact location with other users.</li>
          <li>• We don&rsquo;t store payment card details — payments happen outside Gnome.</li>
        </ul>
      </section>

      <div className="mt-12 rounded-xl border border-dashed border-border bg-muted/50 p-5 text-sm text-muted-foreground">
        This is a summary for a prototype platform. Before launching, have a qualified attorney review and
        finalize a complete privacy policy that complies with applicable laws (including GDPR, CCPA, and
        state-specific requirements).{" "}
        <Link to="/contact" className="font-medium text-accent hover:underline">Questions about privacy?</Link>
      </div>
    </div>
  );
}
