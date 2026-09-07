"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { VIBES, type Vibe } from "@/data/vibes";

interface VibeSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function VibeSelector({ selected, onSelect }: VibeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-script text-lg italic text-dusty-rose"
        >
          Set the mood
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 font-display text-3xl text-charcoal sm:text-4xl"
        >
          How should your bouquet feel?
        </motion.h2>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
        {VIBES.map((vibe, i) => (
          <VibeCard
            key={vibe.id}
            vibe={vibe}
            isSelected={selected === vibe.id}
            onSelect={onSelect}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

function VibeCard({
  vibe,
  isSelected,
  onSelect,
  index,
}: {
  vibe: Vibe;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(vibe.id)}
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-300",
        isSelected
          ? "border-burgundy bg-burgundy/5 shadow-md"
          : "border-charcoal/8 bg-paper hover:border-burgundy/25 hover:shadow-sm"
      )}
    >
      <span className="text-3xl">{vibe.emoji}</span>
      <div>
        <p className={cn("text-sm font-medium", isSelected ? "text-burgundy" : "text-charcoal")}>
          {vibe.label}
        </p>
        <p className="mt-1 text-xs text-charcoal-muted">{vibe.description}</p>
      </div>

      <div className="flex gap-1">
        {vibe.palette.slice(0, 4).map((color) => (
          <div
            key={color}
            className="h-3 w-3 rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {isSelected && (
        <motion.div
          layoutId="vibe-indicator"
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-burgundy text-ivory"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
