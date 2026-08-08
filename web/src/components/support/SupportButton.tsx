import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Leaf } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "How do I report a listing?",
  "Why can't I post more listings?",
  "How do pickup locations stay private?",
  "What's the difference between plans?",
  "Is there a commission on sales?",
];

export function SupportButton(): React.JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [thinking, setThinking] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string): void => {
    const trimmed = text.trim();
    if (trimmed.length < 2) return;

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
            "Gnome support isn't connected to a backend yet. When it is, this chat will be answered by a support AI that can look up your account, plan, listings, and orders. Right now your messages stay in this browser and aren't sent anywhere.",
        },
      ]);
    }, 1000);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className={cn(
            "fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lift transition-transform hover:scale-105 active:scale-95 md:bottom-6",
            "bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
          aria-label="Customer support chat"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[92dvh]">
        <DrawerHeader className="border-b border-border text-left">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-moss" aria-hidden="true" />
            <DrawerTitle className="font-display text-xl">Gnome support</DrawerTitle>
          </div>
          <DrawerDescription>Ask anything about Gnome — buying, selling, growing, or safety.</DrawerDescription>
        </DrawerHeader>

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
          style={{ minHeight: "18rem", maxHeight: "50dvh" }}
        >
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Popular questions:</p>
              <div className="flex flex-wrap gap-2">
                {STARTERS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border border-border bg-secondary px-3 py-2 text-left text-sm font-medium transition-colors hover:border-primary hover:bg-secondary/80"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "rounded-tr-sm bg-primary text-primary-foreground"
                    : "rounded-tl-sm border border-border bg-card whitespace-pre-line",
                )}
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

        <div className="border-t border-border bg-card px-4 py-3 pb-safe">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 rounded-2xl border border-border bg-background p-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="h-12 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground"
              aria-label="Support question"
            />
            <Button type="submit" size="icon" className="h-12 w-12 shrink-0" disabled={thinking}>
              <Send className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Not connected yet — this is a preview support chat.
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
