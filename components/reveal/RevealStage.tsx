"use client";

import { motion } from "framer-motion";
import { Gift, Mail, Sparkles } from "lucide-react";
import type { RevealStyle } from "@/lib/bouquet/types";

interface RevealStageProps {
  style: RevealStyle;
  recipient?: string;
  onOpen: () => void;
}

export function RevealStage({ style, recipient, onOpen }: RevealStageProps) {
  const icon =
    style === "envelope" ? (
      <Mail size={38} />
    ) : style === "curtain" ? (
      <Sparkles size={38} />
    ) : style === "minimal" ? (
      <Sparkles size={38} />
    ) : (
      <Gift size={38} />
    );

  const label =
    style === "envelope"
      ? "Open your letter"
      : style === "curtain"
      ? "Reveal your bouquet"
      : style === "minimal"
      ? "View your bouquet"
      : "Open your gift";

  return (
    <motion.div
      key="stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-script text-2xl italic text-charcoal-soft"
      >
        {recipient ? `${recipient}, someone made you something...` : "Someone made you something..."}
      </motion.p>

      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={label}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-40 w-40 flex-col items-center justify-center gap-3 rounded-3xl bg-burgundy text-ivory shadow-xl transition hover:bg-burgundy-dark"
      >
        {icon}
        <span className="text-xs font-medium tracking-wide">{label}</span>
      </motion.button>
    </motion.div>
  );
}
