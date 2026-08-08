import * as React from "react";
import { useState } from "react";
import { Flag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { readLocal, writeLocal } from "@/lib/storage";

const REASONS = [
  { value: "spam", label: "Spam or scam" },
  { value: "fraud", label: "Fraud or counterfeit goods" },
  { value: "harassment", label: "Harassment or threats" },
  { value: "prohibited", label: "Prohibited item (eggs, alcohol, cannabis, etc.)" },
  { value: "misleading", label: "Misleading information" },
  { value: "other", label: "Something else" },
];

interface StoredReport {
  id: string;
  targetType: "listing" | "market";
  targetId: string;
  targetName: string;
  reason: string;
  details: string;
  createdAt: string;
}

interface ReportDrawerProps {
  targetType: "listing" | "market";
  targetId: string;
  targetName: string;
  trigger?: React.ReactNode;
  className?: string;
}

export function ReportDrawer({
  targetType,
  targetId,
  targetName,
  trigger,
  className,
}: ReportDrawerProps): React.JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  const handleSubmit = (): void => {
    if (!reason) {
      toast.error("Choose a reason");
      return;
    }
    if (details.trim().length < 10) {
      toast.error("Add a few details", { description: "Help us understand what happened." });
      return;
    }

    const reports = readLocal<StoredReport[]>("reports", []);
    reports.push({
      id: `report-${Date.now()}`,
      targetType,
      targetId,
      targetName,
      reason,
      details: details.trim(),
      createdAt: new Date().toISOString(),
    });
    writeLocal("reports", reports);

    setOpen(false);
    setReason("");
    setDetails("");
    toast.success("Report received", {
      description: "This prototype stores it locally. A real backend would route it to moderation.",
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger || (
          <button
            type="button"
            className={cn(
              "inline-flex min-h-[44px] items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
              className,
            )}
          >
            <Flag className="h-4 w-4" aria-hidden="true" />
            Report
          </button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[92dvh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-display text-2xl">Report</DrawerTitle>
          <DrawerDescription>{targetName}</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-5 overflow-y-auto overscroll-contain px-4 pb-4">
          <div className="flex gap-3 rounded-lg border border-marigold/40 bg-marigold/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-marigold" aria-hidden="true" />
            <p>
              Reports are taken seriously. In emergencies, contact local authorities. Gnome moderation
              handles marketplace policy violations only.
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold">What happened?</legend>
            <div className="mt-3 space-y-2">
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                    reason === r.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-secondary/50",
                  )}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <span className="text-sm font-medium">{r.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <Label htmlFor="report-details">Details</Label>
            <Textarea
              id="report-details"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please describe what you saw. Include specific listing details if you can."
              className="mt-1.5 resize-none"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Your report is stored locally in this prototype. A production system would send it to a
              moderation team.
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border bg-card px-4 py-3 pb-safe">
          <DrawerClose asChild>
            <Button variant="outline" className="h-12 flex-1">
              Cancel
            </Button>
          </DrawerClose>
          <Button className="h-12 flex-[2]" onClick={handleSubmit}>
            Submit report
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
