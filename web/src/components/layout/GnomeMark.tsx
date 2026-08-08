import * as React from "react";

interface GnomeMarkProps {
  className?: string;
  variant?: "mark" | "wordmark";
}

/** The Gnome brand mark: the uploaded gnome-and-garden logo. */
export function GnomeMark({
  className = "h-9 w-auto",
  variant = "mark",
}: GnomeMarkProps): React.JSX.Element {
  return (
    <img
      src="/gnome-logo.png"
      alt="Gnome Farmers Market"
      className={className}
      style={variant === "wordmark" ? { maxWidth: "12rem" } : undefined}
      loading="eager"
      decoding="async"
    />
  );
}

/** Smaller circular avatar mark using the same logo. */
export function GnomeAvatar({ className = "h-9 w-9" }: { className?: string }): React.JSX.Element {
  return (
    <span className={className}>
      <img
        src="/gnome-logo.png"
        alt="Gnome"
        className="h-full w-full rounded-full object-cover"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}
