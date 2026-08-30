"use client";

import { useState } from "react";
import { AnimatePresence, motion, type TargetAndTransition } from "framer-motion";
import Link from "next/link";
import type { Bouquet } from "@/lib/bouquet/types";
import { BouquetCanvas } from "@/components/bouquet/BouquetCanvas";
import { RevealStage } from "./RevealStage";
import { AdSlot } from "@/components/ads/AdSlot";

type Stage = "invitation" | "opening" | "revealed";

const OPENING_VARIANTS: Record<
  string,
  { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }
> = {
  gift_box: {
    initial: { scaleY: 1, opacity: 1 },
    animate: { scaleY: 1, opacity: 1 },
    exit: { scaleY: 0, opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  envelope: {
    initial: { rotateX: 0, opacity: 1 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -110, opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  curtain: {
    initial: { scaleX: 1, opacity: 1 },
    animate: { scaleX: 1, opacity: 1 },
    exit: { scaleX: 0, opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  minimal: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  },
};

export function RevealExperience({ bouquet }: { bouquet: Bouquet }) {
  const [stage, setStage] = useState<Stage>("invitation");
  const variant = OPENING_VARIANTS[bouquet.revealStyle] ?? OPENING_VARIANTS.minimal;

  function handleOpen() {
    setStage("opening");
    window.setTimeout(() => setStage("revealed"), 750);
  }

  return (
    <div className="min-h-screen bg-ivory">
      <AnimatePresence mode="wait">
        {stage === "invitation" && <RevealStage style={bouquet.revealStyle} onOpen={handleOpen} />}

        {stage === "opening" && (
          <motion.div
            key="opening"
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            style={{ transformOrigin: "center" }}
            className="flex min-h-screen items-center justify-center bg-burgundy"
          >
            <span className="font-script text-2xl italic text-ivory">Opening…</span>
          </motion.div>
        )}

        {stage === "revealed" && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16"
          >
            <div className="w-full max-w-sm">
              <BouquetCanvas bouquet={bouquet} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="max-w-md text-center"
            >
              {bouquet.recipient && (
                <p className="font-script text-2xl italic text-charcoal">For {bouquet.recipient}</p>
              )}
              {bouquet.message && (
                <p className="mt-4 text-base leading-relaxed text-charcoal-soft">&ldquo;{bouquet.message}&rdquo;</p>
              )}
              {bouquet.sender && (
                <p className="mt-4 text-sm text-charcoal-soft/70">Made with love, {bouquet.sender}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex w-full max-w-sm flex-col items-center gap-6 pt-6"
            >
              <AdSlot position="reveal-bottom" />
              <div className="text-center">
                <p className="mb-3 text-sm text-charcoal-soft/70">Want to send one back?</p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
                >
                  Create Your Own Bouquet
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
