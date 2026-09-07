"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { BouquetCanvas } from "@/components/bouquet/BouquetCanvas";
import { PRESETS } from "@/data/presets";
import { elementsFromPreset } from "@/lib/bouquet/build";
import { createEmptyBouquet } from "@/lib/bouquet/types";
import { Footer } from "@/components/landing/Footer";

const CATEGORIES = [
  { id: "romantic", label: "Romantic", emoji: "\u{1F495}" },
  { id: "birthday", label: "Birthday", emoji: "\u{1F382}" },
  { id: "friendship", label: "Friendship", emoji: "\u{1F91D}" },
  { id: "thank_you", label: "Thank You", emoji: "\u{1F49C}" },
  { id: "sorry", label: "Sorry", emoji: "\u{1F327}\uFE0F" },
  { id: "just_because", label: "Just Because", emoji: "\u2728" },
];

const PRESET_CATEGORIES: Record<string, string[]> = {
  romantic: ["classic_romance", "soft_love"],
  birthday: ["golden_sunshine", "pastel_dream"],
  friendship: ["spring_morning", "pastel_dream"],
  thank_you: ["elegant_white", "spring_morning"],
  sorry: ["elegant_white", "soft_love"],
  just_because: ["spring_morning", "golden_sunshine"],
};

export default function GalleryPage() {
  return (
    <main className="flex flex-col">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-script text-2xl italic text-charcoal">
          BloomStory
        </Link>
        <Link
          href="/create"
          className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
        >
          Create Your Bouquet
        </Link>
      </header>

      {/* Hero */}
      <section className="border-b border-charcoal/8 bg-ivory-deep/40 px-6 py-16 text-center md:py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-script text-lg italic text-dusty-rose"
        >
          inspiration
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 font-display text-4xl text-charcoal sm:text-5xl"
        >
          Bouquet Gallery
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-4 max-w-lg text-sm text-charcoal-soft"
        >
          Browse beautiful example bouquets for every occasion. Start with one and make it your own.
        </motion.p>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-charcoal/12 bg-paper px-4 py-2 text-sm text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy"
            >
              {cat.emoji} {cat.label}
            </a>
          ))}
        </div>
      </section>

      {/* Preset bouquets by category */}
      {CATEGORIES.map((cat) => {
        const presetIds = PRESET_CATEGORIES[cat.id] ?? [];
        const presets = PRESETS.filter((p) => presetIds.includes(p.id));

        if (presets.length === 0) return null;

        return (
          <section key={cat.id} id={cat.id} className="border-y border-charcoal/8 bg-ivory-deep/30 px-6 py-12">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.emoji}</span>
                <h2 className="font-display text-2xl text-charcoal">{cat.label}</h2>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {presets.map((preset) => {
                  const bouquet = {
                    ...createEmptyBouquet(),
                    elements: elementsFromPreset(preset),
                    wrapper: preset.wrapper,
                    ribbon: preset.ribbon,
                  };

                  return (
                    <motion.div
                      key={preset.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="group rounded-2xl border border-charcoal/10 bg-paper p-5 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="overflow-hidden rounded-xl bg-[linear-gradient(165deg,#f5edde,#efe4cd)]">
                        <BouquetCanvas bouquet={bouquet} />
                      </div>
                      <div className="mt-4">
                        <h3 className="font-display text-lg text-charcoal">{preset.name}</h3>
                        <p className="mt-1 text-sm text-charcoal-soft">{preset.description}</p>
                      </div>
                      <Link
                        href={`/create?preset=${preset.id}`}
                        // Was opacity-0 revealed only on hover, which meant
                        // this card's one call-to-action was invisible (and
                        // effectively undiscoverable) on every touch device —
                        // no real :hover state to reveal it. Always visible
                        // now; the hover nudge (color shift) is decoration,
                        // not the only way in.
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-burgundy transition group-hover:text-burgundy-dark"
                      >
                        Create Something Like This <ArrowRight size={14} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center md:py-24">
        <Sparkles className="mx-auto mb-4 text-dusty-rose" size={24} />
        <h2 className="font-display text-3xl text-charcoal sm:text-4xl">Ready to create your own?</h2>
        <p className="mt-4 text-base text-charcoal-soft">
          Every bouquet starts with a feeling. What&apos;s yours?
        </p>
        <Link
          href="/create"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-burgundy px-7 py-3.5 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
        >
          Create Your Bouquet <Heart size={16} />
        </Link>
      </section>

      <Footer />
    </main>
  );
}
