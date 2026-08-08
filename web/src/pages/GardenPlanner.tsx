import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Sparkles, MapPin, Sun, Ruler, CalendarDays, Trash2, Info, Leaf, Loader2, Camera, ScanLine } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { useSeo } from "@/lib/seo";

const EXAMPLE_PROMPTS = [
  "What can I plant this week in Richmond Heights, Ohio?",
  "Why are my tomato leaves turning yellow?",
  "What should I plant after spring lettuce?",
  "How many tomato plants fit in a 4-by-8 raised bed?",
  "What vegetables will mature before my first frost?",
  "What grows well with partial afternoon shade?",
];

const CONSIDERS = [
  { icon: MapPin, label: "Where you are", detail: "Your ZIP, hardiness zone, and typical frost dates" },
  { icon: CalendarDays, label: "What time of year it is", detail: "Today's date and how much season is left" },
  { icon: Ruler, label: "How much room you have", detail: "Beds, containers, or a balcony rail" },
  { icon: Sun, label: "How much sun it gets", detail: "Full sun, part shade, or mostly shade" },
  { icon: Leaf, label: "What you've grown before", detail: "Soil notes, past crops, and how they did" },
];

const SAMPLE_ANSWER = `You're in zone 6a, and your average first frost is around October 15 — so you've got roughly 9 weeks of growing season left. That rules out anything needing a long summer, but there's a good fall window open right now.

Plant these from seed this week:
• Spinach (40 days) — direct sow, thin to 4"
• Arugula (30 days) — direct sow, loves the cooler nights
• Radishes (28 days) — direct sow, fast and forgiving
• Lettuce mixes (45 days) — direct sow or start indoors
• Garlic — wait until mid-October, but order now

Skip for now: tomatoes, peppers, squash — not enough warm days left to ripen.

A 4×8 bed gives you 32 square feet. At 4" spacing for greens you could fit about 8 rows. Sow in two-week succession waves so it doesn't all come ready at once.

Reminder: actual timing depends on your soil temperature, this year's weather, and local microclimate. This is a starting point, not a guarantee.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function GardenPlanner(): React.JSX.Element {
  useSeo({
    title: "Garden Planner",
    description:
      "Ask Gnome's Garden Planner what to plant, when to plant it, and how to fix what's going wrong — with your zone, frost dates, and space in mind.",
  });

  const { gardenContext, saveGardenContext, clearGardenContext, zip } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [thinking, setThinking] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(!gardenContext);
  const [plantPhoto, setPlantPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [plantResult, setPlantResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const handlePhoto = (file: File): void => {
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Photo is too large", { description: "Choose a photo under 8 MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPlantPhoto(reader.result as string);
      setPlantResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = (): void => {
    if (!plantPhoto) return;
    setAnalyzing(true);
    window.setTimeout(() => {
      setAnalyzing(false);
      setPlantResult(
        `Plant analysis isn't connected to a backend yet — this needs a vision model and an API key kept server-side. When it's live, a photo like this would be checked for common issues like:\n\n• Leaf spot / fungal disease\n• Pest damage (aphids, flea beetles, etc.)\n• Nutrient deficiencies (yellowing, browning, chlorosis)\n• Water stress (wilting, drooping, edema)\n\nFor now, the photo stays in your browser and isn't sent anywhere.`,
      );
    }, 1500);
  };

  const send = (text: string): void => {
    const trimmed = text.trim();
    if (trimmed.length < 3) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setThinking(true);

    window.setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "The Garden Planner isn't connected to a backend yet — it needs one so API keys stay server-side and usage limits can be enforced. When it's ready, your question will go to an AI model with your saved garden context attached. Nothing here leaves your browser right now.",
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b border-border bg-grain">
        <div className="container py-8 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">Grow</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-5xl">Garden Planner</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Ask what to plant, when to plant it, or why your tomato leaves are turning yellow. It considers
            your zone, frost dates, space, sun, and what you&rsquo;ve grown before.
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
        {/* Example prompts */}
        {messages.length === 0 && (
          <div className="mb-6 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h2 className="font-display text-lg font-semibold">Try asking</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="rounded-full border border-border bg-background px-3.5 py-2 text-left text-sm font-medium transition-colors hover:border-primary hover:bg-secondary"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample answer */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                <h2 className="font-display text-sm font-semibold uppercase tracking-wide">
                  Example answer
                </h2>
              </div>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                &ldquo;{EXAMPLE_PROMPTS[0]}&rdquo;
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{SAMPLE_ANSWER}</p>
            </div>

            {/* Plant photo analysis */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-accent" aria-hidden="true" />
                <h2 className="font-display text-lg font-semibold">Plant doctor</h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Snap a photo of a leaf, pest, or problem and get a quick diagnosis and next steps.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhoto(file);
                  if (e.target) e.target.value = "";
                }}
              />

              {!plantPhoto ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-secondary"
                >
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  Take a picture or choose one
                </button>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary">
                    <img
                      src={plantPhoto}
                      alt="Plant to analyze"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={analyze}
                      disabled={analyzing}
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" />
                          Analyzing…
                        </>
                      ) : (
                        <>
                          <ScanLine className="mr-1.5 h-4 w-4" aria-hidden="true" />
                          Analyze photo
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPlantPhoto(null);
                        setPlantResult(null);
                      }}
                    >
                      Retake
                    </Button>
                  </div>
                  {plantResult && (
                    <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm whitespace-pre-line leading-relaxed text-foreground/85">
                      {plantResult}
                    </div>
                  )}
                </div>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Photos are not sent to a server yet. When plant analysis is connected, images will be
                processed by a vision model and not stored permanently.
              </p>
            </div>

            {/* What it considers */}
            <div className="rounded-2xl border border-border bg-secondary/50 p-5">
              <h2 className="font-display text-lg font-semibold">What it considers</h2>
              <ul className="mt-3 space-y-2.5">
                {CONSIDERS.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-moss" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="block text-xs text-muted-foreground">{item.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-background p-3 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Results depend on weather, soil, pests, disease, seed quality, and local conditions. This is a
                helpful starting point, not a guarantee — and it&rsquo;s never a substitute for pesticide,
                food-safety, or legal guidance.
              </p>
            </div>
          </div>
        )}

        {/* Chat */}
        {messages.length > 0 && (
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground"
                      : "max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm whitespace-pre-line"
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Thinking…
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved context toggle */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className="text-sm font-medium text-accent hover:underline"
          >
            {showSettings ? "Hide" : "My garden details"}
            {gardenContext && !showSettings && " (saved)"}
          </button>
          {gardenContext && (
            <button
              type="button"
              onClick={() => {
                clearGardenContext();
                toast.success("Garden details cleared");
                setShowSettings(true);
              }}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>

        {showSettings && (
          <GardenSettings
            saved={gardenContext}
            defaultZip={zip}
            onSave={(ctx) => {
              saveGardenContext(ctx);
              toast.success("Garden details saved");
              setShowSettings(false);
            }}
          />
        )}

        {/* Input */}
        <div className="sticky bottom-14 mt-3 md:static md:bottom-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your garden question…"
              className="h-12 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground"
              aria-label="Ask a question"
            />
            <Button type="submit" size="icon" className="h-12 w-12 shrink-0" disabled={thinking}>
              <Send className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Not connected yet — needs a backend.{" "}
          <Link to="/seed-drop" className="font-medium text-accent hover:underline">
            Start with seeds instead →
          </Link>
        </p>
      </div>
    </div>
  );
}

function GardenSettings({
  saved,
  defaultZip,
  onSave,
}: {
  saved: import("@/lib/types").SavedGardenContext | null;
  defaultZip: string;
  onSave: (ctx: import("@/lib/types").SavedGardenContext) => void;
}): React.JSX.Element {
  const [zip, setZip] = useState<string>(saved?.zip ?? defaultZip);
  const [space, setSpace] = useState<string>(saved?.spaceDescription ?? "");
  const [sun, setSun] = useState<string>(saved?.sunExposure ?? "full-sun");
  const [experience, setExperience] = useState<string>(saved?.experience ?? "beginner");

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
      <p className="text-sm font-semibold">Save your garden details</p>
      <p className="mt-1 text-xs text-muted-foreground">
        So you don&rsquo;t have to re-enter them every time. Stored in your browser for now.
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="g-zip">ZIP code</Label>
          <Input
            id="g-zip"
            inputMode="numeric"
            maxLength={5}
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="44143"
            className="mt-1.5 h-11"
          />
        </div>
        <div>
          <Label htmlFor="g-space">Describe your growing space</Label>
          <Textarea
            id="g-space"
            rows={2}
            value={space}
            onChange={(e) => setSpace(e.target.value)}
            placeholder="Two 4×8 raised beds, a balcony with containers"
            className="mt-1.5 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="g-sun">Sun exposure</Label>
            <Select value={sun} onValueChange={setSun}>
              <SelectTrigger id="g-sun" className="mt-1.5 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-sun">Full sun (6+ hrs)</SelectItem>
                <SelectItem value="part-sun">Part sun (3–6 hrs)</SelectItem>
                <SelectItem value="shade">Mostly shade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="g-exp">Experience</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger id="g-exp" className="mt-1.5 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Some experience</SelectItem>
                <SelectItem value="experienced">Experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="h-11 w-full"
          onClick={() => onSave({ zip, spaceDescription: space, sunExposure: sun, experience })}
        >
          Save details
        </Button>
      </div>
    </div>
  );
}
