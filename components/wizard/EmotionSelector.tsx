"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EMOTIONS, type Emotion } from "@/data/emotions";

interface EmotionSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function EmotionSelector({ selected, onSelect }: EmotionSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-script text-lg italic text-dusty-rose"
        >
          Start with your heart
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 font-display text-3xl text-charcoal sm:text-4xl"
        >
          What do you want to say?
        </motion.h2>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
        {EMOTIONS.map((emotion, i) => (
          <EmotionCard
            key={emotion.id}
            emotion={emotion}
            isSelected={selected === emotion.id}
            onSelect={onSelect}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

function EmotionCard({
  emotion,
  isSelected,
  onSelect,
  index,
}: {
  emotion: Emotion;
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
      onClick={() => onSelect(emotion.id)}
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-300",
        isSelected
          ? "border-burgundy bg-burgundy/5 shadow-md"
          : "border-charcoal/8 bg-paper hover:border-burgundy/25 hover:shadow-sm"
      )}
    >
      <span className="text-3xl">{emotion.emoji}</span>
      <div>
        <p className={cn("text-sm font-medium", isSelected ? "text-burgundy" : "text-charcoal")}>
          {emotion.label}
        </p>
        <p className="mt-1 text-xs text-charcoal-soft/60">{emotion.description}</p>
      </div>
      {isSelected && (
        <motion.div
          layoutId="emotion-indicator"
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
