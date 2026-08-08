import { useState } from "react";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSeo } from "@/lib/seo";

export default function Contact(): React.JSX.Element {
  useSeo({
    title: "Contact",
    description: "Get in touch with the Gnome team — questions, feedback, support, or partnership ideas.",
  });

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Add your name so we know who's reaching out.");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Add a valid email so we can reply.");
      return;
    }
    if (message.trim().length < 10) {
      toast.error("Tell us a bit more about what you need.");
      return;
    }
    toast.success("Thanks for reaching out", {
      description: "This form isn't connected to a backend yet, so nothing was actually sent. Email us directly at hello@gnomefarmersmarket.com.",
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="container max-w-2xl py-14 sm:py-20">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Get in touch</h1>
      <p className="mt-3 text-muted-foreground">
        Questions, feedback, or want to talk about bringing Gnome to your neighborhood? We&rsquo;d love to
        hear from you.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Mail, label: "Email", value: "hello@gnomefarmersmarket.com" },
          { icon: MessageCircle, label: "Support", value: "support@gnomefarmersmarket.com" },
          { icon: MapPin, label: "Based in", value: "Cleveland, Ohio" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card p-4">
            <item.icon className="h-5 w-5 text-moss" aria-hidden="true" />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="mt-0.5 text-sm font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="c-name">Your name</Label>
          <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-12" />
        </div>
        <div>
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-12" />
        </div>
        <div>
          <Label htmlFor="c-msg">Message</Label>
          <Textarea id="c-msg" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1.5 resize-none" />
        </div>
        <Button type="submit" size="lg" className="h-13 w-full text-base">
          Send message
        </Button>
      </form>
    </div>
  );
}
