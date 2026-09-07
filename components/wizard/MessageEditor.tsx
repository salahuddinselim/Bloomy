"use client";

import { motion } from "framer-motion";
import { LIMITS } from "@/lib/bouquet/types";
import type { ResolvedSignatureTheme } from "@/data/signatureThemes";

interface MessageEditorProps {
  recipientName: string;
  senderName: string;
  message: string;
  signature: ResolvedSignatureTheme;
  onChangeMessage: (message: string) => void;
}

export function MessageEditor({
  recipientName,
  senderName,
  message,
  signature,
  onChangeMessage,
}: MessageEditorProps) {
  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-script text-lg italic text-dusty-rose"
        >
          Find the words
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 font-display text-3xl text-charcoal sm:text-4xl"
        >
          Write a short note
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-soft/60"
        >
          Keep it simple. The bouquet already carries the emotion.
        </motion.p>
      </div>

      <div className="grid w-full max-w-3xl gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="msg-body" className="text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">
                Message
              </label>
              <span className="text-xs text-charcoal-soft/50">
                {message.length}/{LIMITS.MAX_MESSAGE}
              </span>
            </div>
            <textarea
              id="msg-body"
              value={message}
              onChange={(e) => onChangeMessage(e.target.value)}
              maxLength={LIMITS.MAX_MESSAGE}
              rows={6}
              placeholder={signature.message}
              className="w-full resize-none rounded-xl border border-charcoal/12 bg-paper px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-burgundy focus-visible:border-burgundy"
            />
            {message.length >= LIMITS.MAX_MESSAGE && (
              <p className="mt-1 text-xs text-burgundy/70">You&apos;ve reached the {LIMITS.MAX_MESSAGE}-character limit.</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="md:pt-6"
        >
          <div className="rounded-xl border border-charcoal/8 bg-paper p-5 shadow-[0_18px_48px_rgba(40,25,20,0.08)]">
            {recipientName && (
              <p className="mb-1 text-center font-script text-xl italic text-burgundy">
                For {recipientName}
              </p>
            )}
            {!recipientName && !message && (
              <p className="text-center text-sm text-charcoal-soft/40 italic">
                Your message will appear here.
              </p>
            )}
            {message && (
              <p className="mt-4 text-center text-sm leading-relaxed text-charcoal-soft">
                &ldquo;{message}&rdquo;
              </p>
            )}
            {senderName && (
              <p className="mt-4 text-center text-sm text-charcoal-soft/70">
                - {senderName}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
