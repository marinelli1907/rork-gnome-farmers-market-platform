import * as React from "react";
import { Link } from "react-router-dom";
import { Sprout, MapPin, Handshake, Leaf } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GnomeMark } from "@/components/layout/GnomeMark";
import { useSeo, CORE_DESCRIPTION } from "@/lib/seo";

export default function About(): React.JSX.Element {
  useSeo({
    title: "About Gnome",
    description: "Gnome is a neighborhood marketplace that helps people grow, find, share, and sell local food and garden goods.",
  });

  return (
    <div>
      <section className="border-b border-border bg-grain">
        <div className="container py-14 sm:py-20">
          <div className="max-w-2xl">
            <GnomeMark className="h-14 w-14" />
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] sm:text-6xl">
              We started with too many tomatoes.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-foreground/75">
              Gnome is a neighborhood marketplace that helps people grow, find, share, and sell local food and
              garden goods. The idea is simple: most gardens produce more than one household can eat, and most
              neighborhoods have someone who&rsquo;d love to take the extra off your hands.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-14 sm:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Sprout className="h-8 w-8 text-moss" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold">Why we&rsquo;re building this</h2>
            <p className="mt-3 text-muted-foreground">
              Food waste happens at every scale, but the most absurd kind is a backyard zucchini plant
              producing more than anyone can use while a neighbor three streets over buys zucchini from a
              grocery store that flew it in from another state. That gap is fixable.
            </p>
          </div>
          <div>
            <MapPin className="h-8 w-8 text-moss" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold">Why local matters</h2>
            <p className="mt-3 text-muted-foreground">
              Not because local food is trendy. Because a tomato picked this morning from a garden down the
              street tastes like a tomato, and one shipped 2,000 miles doesn&rsquo;t. Because knowing who grew
              your food changes how you think about it. Because a neighborhood where people trade food is a
              neighborhood where people know each other.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="container py-14 sm:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Handshake, title: "Neighborly first", body: "Everything we build should make it easier to be a good neighbor. If a feature makes people trust each other less, we don't ship it." },
              { icon: Leaf, title: "Grow more, waste less", body: "The simplest climate action most people can take is growing some of their own food and sharing what they can't use. We want to make that normal." },
              { icon: Sprout, title: "Start small", body: "You don't need a farm to participate. A windowsill of herbs, a balcony of containers, one raised bed — it all counts and it all helps." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
                <item.icon className="h-7 w-7 text-moss" aria-hidden="true" />
                <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{CORE_DESCRIPTION}</h2>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-13 px-8">
            <Link to="/browse">Browse what&rsquo;s nearby</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-13 px-8">
            <Link to="/contact">Get in touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
