"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, MotionConfig, type TargetAndTransition } from "framer-motion";
import Link from "next/link";
import type { Bouquet } from "@/lib/bouquet/types";
import { BouquetCanvas } from "@/components/bouquet/BouquetCanvas";
import { getCardPaper } from "@/data/cardPaper";
import { getPresentation } from "@/data/presentations";
import { getSignatureThemeById } from "@/data/signatureThemes";
import { RevealStage } from "./RevealStage";
import { PresentationParticles } from "./PresentationParticles";
import { playEmotionMusic, stopEmotionMusic } from "./music";
import { AdSlot } from "@/components/ads/AdSlot";
import { cn } from "@/lib/utils";

type Stage = "invitation" | "opening" | "revealed";

interface RevealExperienceProps {
  bouquet: Bouquet;
}

const OPENING_VARIANTS: Record<
  string,
  { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }
> = {
  gift_box: {
    initial: { scaleY: 1, opacity: 1 },
    animate: { scaleY: 1, opacity: 1 },
    exit: { scaleY: 0, opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  },
  envelope: {
    initial: { rotateX: 0, opacity: 1 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -110, opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  },
  curtain: {
    initial: { scaleX: 1, opacity: 1 },
    animate: { scaleX: 1, opacity: 1 },
    exit: { scaleX: 0, opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  },
  minimal: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.6 } },
  },
};

export function RevealExperience({ bouquet }: RevealExperienceProps) {
  const [stage, setStage] = useState<Stage>("invitation");
  const [letterRead, setLetterRead] = useState(false);
  const variant = OPENING_VARIANTS[bouquet.revealStyle] ?? OPENING_VARIANTS.minimal;
  const paper = getCardPaper(bouquet.cardPaper);
  const presentation = getPresentation(bouquet.presentation ?? "");
  const isDarkTheme = presentation
    ? ["rainy_evening", "under_the_moon", "fairy_lights", "candlelight"].includes(presentation.id)
    : false;
  const signature = getSignatureThemeById(bouquet.signatureTheme);
  const hasEnvelope = Boolean(bouquet.recipient || bouquet.title || bouquet.message || bouquet.sender);

  useEffect(() => {
    return () => stopEmotionMusic();
  }, []);

  function handleOpen() {
    setStage("opening");
    window.setTimeout(() => setStage("revealed"), 900);
  }

  function handleEnvelopeOpen() {
    setLetterRead(true);
    playEmotionMusic(signature?.emotion);
  }

  return (
    <MotionConfig reducedMotion="user">
    <div
      className="min-h-screen transition-colors duration-1000"
      style={{
        background: presentation?.bgGradient ?? undefined,
      }}
    >
      {presentation && <PresentationParticles themeId={presentation.id} />}

      <AnimatePresence mode="wait">
        {stage === "invitation" && (
          <RevealStage style={bouquet.revealStyle} recipient={bouquet.recipient} onOpen={handleOpen} />
        )}

        {stage === "opening" && (
          <motion.div
            key="opening"
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            style={{ transformOrigin: "center" }}
            className="flex min-h-screen items-center justify-center bg-burgundy"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <span className="font-script text-3xl italic text-ivory">Someone made something special for you</span>
              <motion.div
                className="mt-4 flex justify-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-ivory/60"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {stage === "revealed" && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex min-h-screen flex-col items-center gap-8 px-6 py-16"
          >
            {/* No visible text on this stage doubles as a page title (the
                intro line lives on the invitation stage, which is gone by
                now) — a screen-reader user landing here otherwise gets no
                heading at all. Visually hidden, so this changes nothing
                about how the reveal looks. */}
            <h1 className="sr-only">
              {bouquet.recipient ? `A bouquet for ${bouquet.recipient}` : "Your bouquet has arrived"}
            </h1>

            <Link
              href="/"
              className={cn(
                "font-script text-2xl italic transition",
                isDarkTheme ? "text-ivory/80 hover:text-ivory" : "text-charcoal-soft hover:text-burgundy"
              )}
            >
              BloomStory
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm"
            >
              <BouquetCanvas
                bouquet={bouquet}
                envelope={
                  hasEnvelope
                    ? {
                        recipient: bouquet.recipient,
                        title: bouquet.title ?? "",
                        message: bouquet.message,
                        sender: bouquet.sender,
                        emotion: signature?.emotion,
                        onOpen: handleEnvelopeOpen,
                      }
                    : undefined
                }
              />
            </motion.div>

            {hasEnvelope && !letterRead && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className={cn("text-center text-sm italic", isDarkTheme ? "text-ivory/70" : "text-charcoal-muted")}
              >
                A letter is hidden in the bouquet &mdash; tap the envelope.
              </motion.p>
            )}

            {letterRead && (
              <motion.div
                initial={{ opacity: 0, y: 24, rotate: -1.5, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, rotate: -1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-md rounded-md bg-[#fffdf7] px-8 py-7 text-center shadow-[0_24px_60px_rgba(30,20,10,0.28)]"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(180deg,rgba(60,35,20,0.10),transparent)]" />
                {signature && (
                  <p className="mb-2 text-xs uppercase tracking-widest" style={{ color: paper.inkSoft }}>
                    {signature.emoji} {signature.name}
                  </p>
                )}
                {bouquet.title && (
                  <p className="font-script text-3xl italic leading-snug text-burgundy">{bouquet.title}</p>
                )}
                {bouquet.message && (
                  <p className={cn("leading-relaxed", bouquet.title ? "mt-4 text-base" : "mt-1 text-lg")} style={{ color: paper.ink }}>
                    {bouquet.message}
                  </p>
                )}
                {bouquet.sender && (
                  <p className="mt-5 text-sm" style={{ color: paper.inkSoft }}>
                    &mdash; {bouquet.sender}
                  </p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex w-full max-w-sm flex-col items-center gap-6 pt-6"
            >
              <AdSlot position="reveal-bottom" />
              <div className="text-center">
                <p className={cn("mb-3 text-sm", isDarkTheme ? "text-ivory/50" : "text-charcoal-muted")}>
                  Want to send one back?
                </p>
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
    </MotionConfig>
  );
}
