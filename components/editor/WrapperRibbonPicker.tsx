"use client";

import { WRAPPERS, WRAPPER_CHOICES } from "@/data/wrappers";
import { RIBBONS, RIBBON_CHOICES } from "@/data/ribbons";
import { RibbonBand } from "@/components/bouquet/Wrapper";
import { cn } from "@/lib/utils";
import type { RibbonDef, WrapperDef } from "@/lib/bouquet/types";

function presentWrapper(value: WrapperDef | undefined): value is WrapperDef {
  return Boolean(value);
}

function presentRibbon(value: RibbonDef | undefined): value is RibbonDef {
  return Boolean(value);
}

export function WrapperPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const choices = WRAPPER_CHOICES.some((w) => w.id === value)
    ? WRAPPER_CHOICES
    : [WRAPPERS.find((w) => w.id === value), ...WRAPPER_CHOICES].filter(presentWrapper);

  return (
    <div className="grid grid-cols-2 gap-2">
      {choices.map((w) => (
        <button
          key={w.id}
          type="button"
          onClick={() => onChange(w.id)}
          aria-label={w.name}
          aria-pressed={value === w.id}
          title={w.name}
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-paper p-2 text-left transition",
            value === w.id ? "border-burgundy bg-burgundy/5 shadow-sm" : "border-charcoal/8 hover:border-charcoal/25"
          )}
        >
          <span
            className="h-8 w-8 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
            style={{ background: `linear-gradient(135deg, ${w.colors.highlight}, ${w.colors.base}, ${w.colors.shadow})` }}
          />
          <span className="line-clamp-2 text-xs leading-snug text-charcoal-soft">{w.name}</span>
        </button>
      ))}
    </div>
  );
}

export function RibbonPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const choices = RIBBON_CHOICES.some((r) => r.id === value)
    ? RIBBON_CHOICES
    : [RIBBONS.find((r) => r.id === value), ...RIBBON_CHOICES].filter(presentRibbon);

  return (
    <div className="grid grid-cols-2 gap-2">
      {choices.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onChange(r.id)}
          aria-label={r.name}
          aria-pressed={value === r.id}
          title={r.name}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg border bg-paper p-2 transition",
            value === r.id ? "border-burgundy bg-burgundy/5 shadow-sm" : "border-charcoal/8 hover:border-charcoal/25"
          )}
        >
          <svg viewBox="90 175 220 85" className="h-9 w-16" aria-hidden="true">
            <RibbonBand ribbon={r} />
          </svg>
          <span className="line-clamp-2 text-center text-xs leading-snug text-charcoal-soft">{r.name}</span>
        </button>
      ))}
    </div>
  );
}
