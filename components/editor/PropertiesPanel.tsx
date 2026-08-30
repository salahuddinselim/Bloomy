"use client";

import type { Bouquet, CardPaper, RevealStyle } from "@/lib/bouquet/types";
import { LIMITS } from "@/lib/bouquet/types";
import { BACKGROUNDS } from "@/data/backgrounds";
import { CARD_PAPERS } from "@/data/cardPaper";
import { cn } from "@/lib/utils";

const REVEALS: { id: RevealStyle; label: string; description: string }[] = [
  { id: "gift_box", label: "Gift Box", description: "A box opens to reveal the bouquet" },
  { id: "envelope", label: "Envelope", description: "A letter unfolds and blooms" },
  { id: "curtain", label: "Curtain", description: "Soft curtains part" },
  { id: "minimal", label: "Minimal", description: "A simple elegant fade-in" },
];

interface PropertiesPanelProps {
  bouquet: Bouquet;
  onRecipient: (v: string) => void;
  onSender: (v: string) => void;
  onMessage: (v: string) => void;
  onReveal: (v: RevealStyle) => void;
  onBackground: (v: string) => void;
  onMono: (v: boolean) => void;
  onCardPaper: (v: CardPaper) => void;
  /** Mobile splits this panel across two tabs; desktop renders everything ("all", the default). */
  section?: "all" | "details" | "style";
}

function DetailsFields({
  bouquet,
  onRecipient,
  onSender,
  onMessage,
}: Pick<PropertiesPanelProps, "bouquet" | "onRecipient" | "onSender" | "onMessage">) {
  return (
    <>
      <section>
        <label htmlFor="recipient-input" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">
          Recipient
        </label>
        <input
          id="recipient-input"
          name="recipient"
          value={bouquet.recipient}
          onChange={(e) => onRecipient(e.target.value)}
          maxLength={LIMITS.MAX_RECIPIENT}
          placeholder="My Love"
          className="w-full rounded-lg border border-charcoal/12 bg-paper px-3 py-2 text-sm outline-none focus-visible:border-burgundy"
        />
      </section>

      <section>
        <label htmlFor="sender-input" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">
          Sender
        </label>
        <input
          id="sender-input"
          name="sender"
          value={bouquet.sender}
          onChange={(e) => onSender(e.target.value)}
          maxLength={LIMITS.MAX_SENDER}
          placeholder="Your name"
          className="w-full rounded-lg border border-charcoal/12 bg-paper px-3 py-2 text-sm outline-none focus-visible:border-burgundy"
        />
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="message-input" className="text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">
            Message
          </label>
          <span className="text-xs text-charcoal-soft/50">
            {bouquet.message.length}/{LIMITS.MAX_MESSAGE}
          </span>
        </div>
        <textarea
          id="message-input"
          name="message"
          value={bouquet.message}
          onChange={(e) => onMessage(e.target.value)}
          maxLength={LIMITS.MAX_MESSAGE}
          rows={4}
          placeholder="Some flowers fade, but what I feel for you never will."
          className="w-full resize-none rounded-lg border border-charcoal/12 bg-paper px-3 py-2 text-sm outline-none focus-visible:border-burgundy"
        />
        {bouquet.message.length >= LIMITS.MAX_MESSAGE && (
          <p className="mt-1 text-xs text-burgundy/70">You&apos;ve reached the {LIMITS.MAX_MESSAGE}-character limit.</p>
        )}
      </section>
    </>
  );
}

function StyleFields({
  bouquet,
  onReveal,
  onBackground,
  onMono,
  onCardPaper,
}: Pick<PropertiesPanelProps, "bouquet" | "onReveal" | "onBackground" | "onMono" | "onCardPaper">) {
  return (
    <>
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">Bouquet Palette</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={!bouquet.mono}
            onClick={() => onMono(false)}
            className={cn(
              "rounded-lg border px-3 py-2 text-left transition",
              !bouquet.mono ? "border-burgundy bg-burgundy/5" : "border-charcoal/12 hover:border-charcoal/25"
            )}
          >
            <div className="text-sm font-medium">Color</div>
            <div className="text-xs text-charcoal-soft/60">Fully printed blooms</div>
          </button>
          <button
            type="button"
            aria-pressed={bouquet.mono}
            onClick={() => onMono(true)}
            className={cn(
              "rounded-lg border px-3 py-2 text-left transition",
              bouquet.mono ? "border-burgundy bg-burgundy/5" : "border-charcoal/12 hover:border-charcoal/25"
            )}
          >
            <div className="text-sm font-medium">Monochrome</div>
            <div className="text-xs text-charcoal-soft/60">Ink &amp; paper, quiet and graphic</div>
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">
          Note Card Paper
        </h3>
        <div className="flex flex-wrap gap-2">
          {CARD_PAPERS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-label={p.name}
              aria-pressed={bouquet.cardPaper === p.id}
              onClick={() => onCardPaper(p.id)}
              title={`${p.name} — ${p.note}`}
              className={cn(
                "h-9 w-9 rounded-md ring-1 ring-inset ring-black/10 transition",
                bouquet.cardPaper === p.id && "ring-2 ring-burgundy ring-offset-2"
              )}
              style={{ background: p.surface }}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">Reveal Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {REVEALS.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={bouquet.revealStyle === r.id}
              onClick={() => onReveal(r.id)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left transition",
                bouquet.revealStyle === r.id
                  ? "border-burgundy bg-burgundy/5"
                  : "border-charcoal/12 hover:border-charcoal/25"
              )}
            >
              <div className="text-sm font-medium">{r.label}</div>
              <div className="text-xs text-charcoal-soft/60">{r.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">Background</h3>
        <div className="flex flex-wrap gap-2">
          {BACKGROUNDS.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-label={b.name}
              aria-pressed={bouquet.background === b.id}
              onClick={() => onBackground(b.id)}
              title={b.name}
              className={cn(
                "h-8 w-8 rounded-full ring-1 ring-inset ring-black/10 transition",
                bouquet.background === b.id && "ring-2 ring-burgundy ring-offset-2"
              )}
              style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export function PropertiesPanel({
  bouquet,
  onRecipient,
  onSender,
  onMessage,
  onReveal,
  onBackground,
  onMono,
  onCardPaper,
  section = "all",
}: PropertiesPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      {(section === "all" || section === "details") && (
        <DetailsFields bouquet={bouquet} onRecipient={onRecipient} onSender={onSender} onMessage={onMessage} />
      )}
      {(section === "all" || section === "style") && (
        <StyleFields bouquet={bouquet} onReveal={onReveal} onBackground={onBackground} onMono={onMono} onCardPaper={onCardPaper} />
      )}
    </div>
  );
}
