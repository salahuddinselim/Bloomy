"use client";

import { WRAPPERS } from "@/data/wrappers";
import { RIBBONS } from "@/data/ribbons";
import { RibbonBand } from "@/components/bouquet/Wrapper";
import { cn } from "@/lib/utils";

export function WrapperPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {WRAPPERS.map((w) => (
        <button
          key={w.id}
          type="button"
          onClick={() => onChange(w.id)}
          aria-label={w.name}
          aria-pressed={value === w.id}
          title={w.name}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl border p-2 transition",
            value === w.id ? "border-burgundy shadow-sm" : "border-charcoal/8 hover:border-charcoal/25"
          )}
        >
          <span
            className="h-9 w-9 rounded-full ring-1 ring-inset ring-black/10"
            style={{ background: `linear-gradient(135deg, ${w.colors.highlight}, ${w.colors.base}, ${w.colors.shadow})` }}
          />
          <span className="line-clamp-2 text-center text-xs leading-snug text-charcoal-soft">{w.name}</span>
        </button>
      ))}
    </div>
  );
}

export function RibbonPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {RIBBONS.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onChange(r.id)}
          aria-label={r.name}
          aria-pressed={value === r.id}
          title={r.name}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl border p-2 transition",
            value === r.id ? "border-burgundy shadow-sm" : "border-charcoal/8 hover:border-charcoal/25"
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
