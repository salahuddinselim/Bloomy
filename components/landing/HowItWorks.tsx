"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useTransform, animate, MotionConfig } from "framer-motion";
import { Heart, Gift, BookOpen, Sparkles, Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface JourneyStep {
  icon: LucideIcon;
  title: string;
  body: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    icon: Heart,
    title: "Choose Your Emotion",
    body: "Start with what you feel. Love, gratitude, missing someone — let the emotion guide everything.",
  },
  {
    icon: Gift,
    title: "Build Your Bouquet",
    body: "Select flowers, wrapping, and ribbon. Every stem is placed by you, with intention.",
  },
  {
    icon: BookOpen,
    title: "Write a Letter",
    body: "Tuck your words into the envelope hidden in the bouquet. It travels sealed, like the real thing.",
  },
  {
    icon: Sparkles,
    title: "Share the Magic",
    body: "One link carries your entire bouquet. They unwrap it with a cinematic reveal and your music.",
  },
];

const STEP_PAUSE = 850;
const STEP_BREAK = 650;
const BAR_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-18% 0px" });
  const progress = useMotionValue(0);
  const pctText = useTransform(progress, (v) => `${Math.round(v * 100)}%`);
  const dotX = useTransform(progress, (v) => `${v * 100}%`);
  const [active, setActive] = useState(-1);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const idle = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    (async () => {
      if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        animate(progress, 1, { duration: 0 });
        setCompleted(JOURNEY_STEPS.length);
        return;
      }
      await idle(250);
      for (let i = 0; i < JOURNEY_STEPS.length; i++) {
        if (cancelled) return;
        setActive(i);
        await idle(STEP_PAUSE);
        if (cancelled) return;
        setCompleted((c) => c + 1);
        setActive(-1);
        animate(progress, (i + 1) / JOURNEY_STEPS.length, { duration: 0.8, ease: BAR_EASE });
        if (i < JOURNEY_STEPS.length - 1) await idle(STEP_BREAK);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inView, progress]);

  function nodeClass(i: number) {
    if (completed > i) return "border-burgundy bg-burgundy";
    if (active === i) return "border-burgundy";
    return "border-charcoal/15";
  }

  return (
    <MotionConfig reducedMotion="user">
      <section ref={sectionRef} id="how-it-works" className="border-y border-charcoal/8 bg-ivory-deep/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <p className="font-script text-base italic text-dusty-rose">your emotional journey</p>
          <h2 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">How BloomStory works</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal-soft/80">
            Four steps from feeling to finished link. Each step marks itself complete, and the progress
            bar keeps moving.
          </p>

          {/* Desktop: horizontal stepper */}
          <div className="mt-14 hidden lg:block">
            <div className="mb-6 flex justify-end">
              <motion.span
                className="rounded-full border border-burgundy/25 bg-paper px-3 py-1 font-display text-sm text-burgundy"
              >
                {pctText}
              </motion.span>
            </div>

            <div className="relative">
              <div className="absolute inset-x-0 top-4 h-px bg-charcoal/10" />
              <motion.div
                className="absolute inset-x-0 top-4 h-px origin-left bg-gradient-to-r from-burgundy/50 to-burgundy"
                style={{ scaleX: progress }}
              />
              <motion.span
                className="absolute left-0 top-4 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy ring-4 ring-burgundy/15"
                style={{ left: dotX }}
              />

              <div className="grid grid-cols-4 gap-6">
                {JOURNEY_STEPS.map((step, i) => (
                  <div key={step.title} className="flex flex-col">
                    <motion.span
                      className={cn(
                        "relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 bg-paper transition-colors duration-300",
                        nodeClass(i)
                      )}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                    >
                      {completed > i ? (
                        <motion.span
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          <Check size={14} strokeWidth={3} className="text-ivory" />
                        </motion.span>
                      ) : active === i ? (
                        <motion.span
                          className="h-2.5 w-2.5 rounded-full bg-burgundy"
                          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      ) : null}
                    </motion.span>

                    <div
                      className={cn(
                        "mt-6 rounded-2xl p-5 transition duration-500",
                        active === i ? "bg-paper shadow-md" : "",
                        completed > i ? "bg-paper/90 shadow-sm" : "",
                        active === -1 && completed <= i ? "opacity-70" : ""
                      )}
                    >
                      <motion.div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-full transition duration-300",
                          active === i ? "bg-burgundy text-ivory" : "bg-burgundy/10 text-burgundy"
                        )}
                        animate={active === i ? { y: [0, -4, 0] } : {}}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <step.icon size={20} />
                      </motion.div>
                      <h3 className="mt-3 font-display text-lg text-charcoal">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: vertical stepper */}
          <div className="mt-10 lg:hidden">
            <div className="relative pl-10">
              <div className="absolute bottom-2 left-[15px] top-2 w-px bg-charcoal/10" />
              <motion.div
                className="absolute left-[15px] top-2 w-px origin-top bg-gradient-to-b from-burgundy/50 to-burgundy"
                style={{ scaleY: progress }}
              />
              {JOURNEY_STEPS.map((step, i) => (
                <div key={step.title} className="relative pb-8 last:pb-0">
                  <span
                    className={cn(
                      "absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-paper transition-colors duration-300",
                      nodeClass(i)
                    )}
                  >
                    {completed > i ? (
                      <Check size={14} strokeWidth={3} className="text-ivory" />
                    ) : active === i ? (
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-burgundy" />
                    ) : null}
                  </span>
                  <div className="ml-4">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                      <step.icon size={18} />
                    </div>
                    <h3 className="mt-3 font-display text-lg text-charcoal">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            className="mt-14 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={completed === JOURNEY_STEPS.length ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full bg-burgundy px-7 py-3.5 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
            >
              Start Your Journey <Sparkles size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}