"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RECIPIENT_TYPES, type RecipientType } from "@/data/recipients";
import { LIMITS } from "@/lib/bouquet/types";

interface RecipientSelectorProps {
  recipientType: string | null;
  recipientName: string;
  senderName: string;
  onSelectType: (id: string) => void;
  onChangeName: (name: string) => void;
  onChangeSender: (name: string) => void;
}

export function RecipientSelector({
  recipientType,
  recipientName,
  senderName,
  onSelectType,
  onChangeName,
  onChangeSender,
}: RecipientSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-script text-lg italic text-dusty-rose"
        >
          Make it personal
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 font-display text-3xl text-charcoal sm:text-4xl"
        >
          Who deserves these flowers?
        </motion.h2>
      </div>

      <div className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
        {RECIPIENT_TYPES.map((r, i) => (
          <RecipientCard
            key={r.id}
            recipient={r}
            isSelected={recipientType === r.id}
            onSelect={onSelectType}
            index={i}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md space-y-4"
      >
        <div>
          <label htmlFor="recipient-name" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">
            Recipient&apos;s Name
          </label>
          <input
            id="recipient-name"
            value={recipientName}
            onChange={(e) => onChangeName(e.target.value)}
            maxLength={LIMITS.MAX_RECIPIENT}
            placeholder="e.g. Emma"
            className="w-full rounded-xl border border-charcoal/12 bg-paper px-4 py-3 text-sm outline-none transition focus:border-burgundy focus-visible:border-burgundy"
          />
        </div>

        <div>
          <label htmlFor="sender-name" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">
            Your Name <span className="text-charcoal-muted">(optional)</span>
          </label>
          <input
            id="sender-name"
            value={senderName}
            onChange={(e) => onChangeSender(e.target.value)}
            maxLength={LIMITS.MAX_SENDER}
            placeholder="e.g. James"
            className="w-full rounded-xl border border-charcoal/12 bg-paper px-4 py-3 text-sm outline-none transition focus:border-burgundy focus-visible:border-burgundy"
          />
        </div>
      </motion.div>
    </div>
  );
}

function RecipientCard({
  recipient,
  isSelected,
  onSelect,
  index,
}: {
  recipient: RecipientType;
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
      onClick={() => onSelect(recipient.id)}
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-300",
        isSelected
          ? "border-burgundy bg-burgundy/5 shadow-md"
          : "border-charcoal/8 bg-paper hover:border-burgundy/25 hover:shadow-sm"
      )}
    >
      <span className="text-3xl">{recipient.emoji}</span>
      <div>
        <p className={cn("text-sm font-medium", isSelected ? "text-burgundy" : "text-charcoal")}>
          {recipient.label}
        </p>
        <p className="mt-1 text-xs text-charcoal-muted">{recipient.description}</p>
      </div>
      {isSelected && (
        <motion.div
          layoutId="recipient-indicator"
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
