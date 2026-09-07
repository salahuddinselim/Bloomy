import type { CSSProperties } from "react";

/**
 * A small message card that appears to be tucked into the bouquet wrapper —
 * the "feelings slip" the recipient pulls out. Rendered on top of the canvas
 * near the base of the wrap, skewed slightly so it reads as physically nested
 * in the paper.
 */
export function BouquetCard({
  recipient = "",
  message = "",
  sender = "",
  className,
  style,
}: {
  recipient?: string;
  message?: string;
  sender?: string;
  className?: string;
  style?: CSSProperties;
}) {
  // Only render when there is something meaningful to say.
  if (!recipient.trim() && !message.trim() && !sender.trim()) return null;

  return (
    <div
      className={`pointer-events-none absolute left-1/2 z-[60] ${className ?? ""}`}
      style={{
        width: "34%",
        transform: "translateX(-50%) rotate(-4deg)",
        ...style,
      }}
    >
      <div className="relative rounded-md border border-charcoal/15 bg-[#fffdf7] p-2.5 shadow-[0_8px_18px_rgba(40,25,20,0.18)]">
        {/* paper fold shade along the top, like a tucked envelope lip */}
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-md bg-gradient-to-b from-black/10 to-transparent" />
        {/* subtle inner margin line */}
        <div className="rounded-sm border border-black/5 px-2 py-1.5 text-center">
          {recipient.trim() && (
            <p className="font-script text-[clamp(8px,0.9vw,13px)] italic leading-tight text-burgundy">
              For {recipient}
            </p>
          )}
          {message.trim() && (
            <p className="mt-0.5 line-clamp-3 text-[clamp(7px,0.75vw,11px)] leading-snug text-charcoal-soft">
              &ldquo;{message}&rdquo;
            </p>
          )}
          {sender.trim() && (
            <p className="mt-0.5 text-[clamp(7px,0.7vw,10px)] text-charcoal-soft/70">&mdash; {sender}</p>
          )}
        </div>
      </div>
      {/* small wax-seal dot on the corner for charm */}
      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark shadow-sm" />
    </div>
  );
}
