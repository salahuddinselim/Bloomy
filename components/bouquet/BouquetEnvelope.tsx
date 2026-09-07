"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface EnvelopePalette {
  body: string;
  deep: string;
  wax: string;
}

/** Envelope colors tuned to each signature emotion, so the letter tucked into
 *  the flowers borrows the mood of the bouquet the moment you look at it. */
export const EMOTION_ENVELOPE_PALETTES: Record<string, EnvelopePalette> = {
  love: { body: "#d96a8a", deep: "#a83c5e", wax: "#8c1f2e" },
  miss_you: { body: "#9d82d2", deep: "#6f56ab", wax: "#4b3a7d" },
  thank_you: { body: "#e0a35c", deep: "#c07a2f", wax: "#8f5a1f" },
  proud: { body: "#e2b858", deep: "#c09034", wax: "#8f6e18" },
  birthday: { body: "#e27ca5", deep: "#c14f80", wax: "#8c1f4b" },
  sorry: { body: "#93a5bc", deep: "#6b7f9a", wax: "#47576f" },
  just_because: { body: "#7d8fe0", deep: "#5668bd", wax: "#3a4a90" },
  get_well: { body: "#77bd85", deep: "#549d63", wax: "#2f7a41" },
};

const DEFAULT_PALETTE: EnvelopePalette = { body: "#d96a8a", deep: "#a83c5e", wax: "#8c1f2e" };

export function envelopePalette(emotionId?: string): EnvelopePalette {
  return (emotionId && EMOTION_ENVELOPE_PALETTES[emotionId]) || DEFAULT_PALETTE;
}

interface BouquetEnvelopeProps {
  recipient: string;
  title: string;
  message: string;
  sender: string;
  emotion?: string;
  /** Called the first time the envelope is opened (music, analytics, ...). */
  onOpen?: () => void;
  className?: string;
}

/**
 * The story travels inside this envelope, nestled among the flowers. It
 * trembles gently to invite a tap, then the flap lifts and the letter slips
 * out — the message you tucked in when you made the bouquet.
 */
export function BouquetEnvelope({
  recipient,
  title,
  message,
  sender,
  emotion,
  onOpen,
  className,
}: BouquetEnvelopeProps) {
  const [open, setOpen] = useState(false);
  const palette = envelopePalette(emotion);
  const hasContent = Boolean(recipient || title || message || sender);

  if (!hasContent) return null;

  function handleOpen() {
    if (!open) {
      setOpen(true);
      onOpen?.();
    }
  }

  return (
    <motion.div
      className={cn("absolute left-1/2 top-[66%] z-[60] w-[42%] -translate-x-1/2", className)}
      animate={open ? { rotate: 0, y: 0 } : { rotate: [0, -3.5, 3, -2.5, 2, 0], y: [0, -2, 1, -1, 0] }}
      transition={
        open
          ? { duration: 0.3, ease: "easeOut" }
          : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <div className="relative aspect-[5/3.4] w-full" style={{ perspective: 900 }}>
        {/* The letter, waiting inside */}
        <motion.div
          className="absolute inset-x-1 bottom-[30%] top-[6%] z-[2] overflow-hidden rounded-[4px] px-2 py-1.5 shadow-md"
          style={{ background: "#fffdf7" }}
          initial={false}
          animate={{ y: open ? "-78%" : 14, rotate: open ? 0 : -1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <div
            className="absolute inset-x-0 top-0 h-0.5"
            style={{ background: "linear-gradient(180deg, rgba(60,35,20,0.10), transparent)" }}
          />
          {title && (
            <p className="pr-1 text-center font-script text-[clamp(9px,1.6cqw,13px)] italic leading-tight" style={{ color: "#8a3340" }}>
              {title}
            </p>
          )}
          {message && (
            <p
              className={cn("text-center text-[clamp(7px,1.2cqw,10px)] leading-snug", title ? "mt-1" : "mt-0.5")}
              style={{ color: "#312931" }}
            >
              &ldquo;{message}&rdquo;
            </p>
          )}
          {sender && (
            <p className="mt-1 text-center text-[clamp(6px,1cqw,8px)]" style={{ color: "#6a5257" }}>
              &mdash; {sender}
            </p>
          )}
        </motion.div>

        {/* Envelope back */}
        <div
          className="absolute inset-0 z-[1] rounded-lg shadow-[0_10px_22px_rgba(30,15,10,0.35)]"
          style={{ background: `linear-gradient(150deg, ${palette.body}, ${palette.deep})` }}
        />

        {/* Front pocket */}
        <div
          className="absolute inset-x-0 bottom-0 h-[58%] z-[3]"
          style={{ clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)", background: `linear-gradient(180deg, ${palette.deep}, ${palette.body})` }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[58%] z-[3]"
          style={{ clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)", background: "rgba(20,8,5,0.16)" }}
        />

        {/* Sealing flap (lifts to open) */}
        <motion.div
          className="absolute inset-x-0 top-0 z-[4] h-[52%]"
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          initial={false}
          animate={{ rotateX: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          <div
            className="absolute inset-0"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 96%)", background: `linear-gradient(180deg, ${palette.body}, ${palette.deep})` }}
          />
          <div
            className="absolute inset-0"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 96%)", background: "rgba(255,255,255,0.12)" }}
          />
        </motion.div>

        {/* Wax seal */}
        <motion.div
          className={cn("absolute left-1/2 z-[5] h-[16%] w-[16%] -translate-x-1/2 rounded-full shadow", open && "opacity-0")}
          style={{ top: open ? "64%" : "52%", background: `radial-gradient(circle at 32% 28%, ${palette.wax}, #000 150%)` }}
          initial={false}
          animate={{ top: open ? "64%" : "52%", opacity: open ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Address */}
        {recipient && (
          <p className="absolute inset-x-0 top-[38%] z-[3] text-center font-script text-[clamp(8px,1.5cqw,12px)] italic drop-shadow-sm" style={{ color: "#fff8f2" }}>
            For {recipient}
          </p>
        )}

        {/* Muted seam so the pocket reads clearly on any palette */}
        <div
          className="absolute inset-x-0 bottom-[52%] z-[3] h-px"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />

        {/* Whole envelope is the tap target */}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close the envelope" : "Open the envelope"}
          onClick={handleOpen}
          className="absolute inset-0 z-[10] cursor-pointer outline-none"
        />
      </div>
    </motion.div>
  );
}