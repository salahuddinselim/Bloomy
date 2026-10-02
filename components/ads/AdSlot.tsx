"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const SIZES: Record<string, string> = {
  banner: "h-24 w-full max-w-3xl",
  leaderboard: "h-20 w-full",
  square: "h-40 w-40",
};

const AD_CLIENT = "ca-pub-9963403374347904";
const AD_SLOT = "2797558849";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Reserved ad placement. Renders a real AdSense unit in production; shows a
 * subtle outline in development so layout can be checked without pushing
 * dev/localhost traffic to AdSense.
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
  const pushed = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script blocked (ad blocker, offline) — fail silently, this is a non-critical placement.
    }
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return (
      <ins
        className={cn("adsbygoogle", SIZES[size], className)}
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
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
