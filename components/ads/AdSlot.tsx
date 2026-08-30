import { cn } from "@/lib/utils";

const SIZES: Record<string, string> = {
  banner: "h-24 w-full max-w-3xl",
  leaderboard: "h-20 w-full",
  square: "h-40 w-40",
};

/**
 * Reserved ad placement. Renders nothing in production until a provider is
 * wired in; shows a subtle outline in development so layout can be checked.
 */
export function AdSlot({
  position,
  size = "banner",
  className,
}: {
  position: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  if (process.env.NODE_ENV !== "development") {
    return <div data-ad-slot={position} className={className} aria-hidden="true" />;
  }
  return (
    <div
      data-ad-slot={position}
      className={cn(
        "mx-auto flex items-center justify-center rounded-lg border border-dashed border-charcoal/15 bg-charcoal/[0.02] text-xs tracking-wide text-charcoal/35",
        SIZES[size],
        className
      )}
    >
      Ad slot · {position}
    </div>
  );
}
