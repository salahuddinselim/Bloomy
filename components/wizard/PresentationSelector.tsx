"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PRESENTATIONS, type PresentationTheme } from "@/data/presentations";

interface PresentationSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function PresentationSelector({ selected, onSelect }: PresentationSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-script text-lg italic text-dusty-rose"
        >
          Set the stage
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 font-display text-3xl text-charcoal sm:text-4xl"
        >
          How should they receive your flowers?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-3 text-sm text-charcoal-soft"
        >
          This sets the mood for their magical reveal
        </motion.p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
        {PRESENTATIONS.map((theme, i) => (
          <PresentationCard
            key={theme.id}
            theme={theme}
            isSelected={selected === theme.id}
            onSelect={onSelect}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

function PresentationCard({
  theme,
  isSelected,
  onSelect,
  index,
}: {
  theme: PresentationTheme;
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
      onClick={() => onSelect(theme.id)}
      className={cn(
        "group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border p-5 text-center transition-all duration-300",
        isSelected
          ? "border-burgundy shadow-md"
          : "border-charcoal/8 hover:border-burgundy/25 hover:shadow-sm"
      )}
    >
      <div
        className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-30"
        style={{ background: theme.bgGradient }}
      />
      <span className="relative text-3xl">{theme.emoji}</span>
      <div className="relative">
        <p className={cn("text-sm font-medium", isSelected ? "text-burgundy" : "text-charcoal")}>
          {theme.label}
        </p>
        <p className="mt-1 text-xs text-charcoal-soft/60">{theme.description}</p>
      </div>

      {isSelected && (
        <motion.div
          layoutId="presentation-indicator"
          className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-burgundy text-ivory"
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
