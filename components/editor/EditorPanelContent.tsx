"use client";
import { FLOWERS } from "@/data/flowers";
import { FOLIAGE } from "@/data/foliage";
import { PRESETS } from "@/data/presets";
import { AssetGrid } from "./AssetGrid";
import { WrapperPicker, RibbonPicker } from "./WrapperRibbonPicker";
import type { Bouquet } from "@/lib/bouquet/types";
import { LIMITS } from "@/lib/bouquet/types";

export type EditorTab = "presets" | "flowers" | "foliage" | "style";

export const EDITOR_TABS: { id: EditorTab; label: string }[] = [
  { id: "presets", label: "Looks" },
  { id: "flowers", label: "Flowers" },
  { id: "foliage", label: "Greenery" },
  { id: "style", label: "Wrap" },
];

interface EditorPanelContentProps {
  tab: EditorTab;
  bouquet: Bouquet;
  counts: { flower: number; foliage: number; decoration: number };
  onAdd: (id: string) => void;
  onSetWrapper: (id: string) => void;
  onSetRibbon: (id: string) => void;
  onApplyPreset: (id: string) => void;
}

export function EditorPanelContent({
  tab,
  bouquet,
  counts,
  onAdd,
  onSetWrapper,
  onSetRibbon,
  onApplyPreset,
}: EditorPanelContentProps) {
  if (tab === "presets") {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onApplyPreset(p.id)}
            className="rounded-xl border border-charcoal/10 bg-paper p-3 text-left transition hover:-translate-y-0.5 hover:border-burgundy/30 hover:shadow-md"
          >
            <div className="font-display text-sm text-charcoal">{p.name}</div>
            <div className="mt-1 text-xs leading-snug text-charcoal-muted">{p.description}</div>
          </button>
        ))}
      </div>
    );
  }

  if (tab === "flowers") {
    return (
      <div>
        <AssetGrid items={FLOWERS} onAdd={onAdd} disabled={() => counts.flower >= LIMITS.MAX_FLOWERS} />
        {counts.flower >= LIMITS.MAX_FLOWERS && (
          <p className="mt-2 text-xs text-burgundy/80">Maximum flowers reached.</p>
        )}
      </div>
    );
  }

  if (tab === "foliage") {
    return (
      <div>
        <AssetGrid items={FOLIAGE} onAdd={onAdd} disabled={() => counts.foliage >= LIMITS.MAX_FOLIAGE} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase text-charcoal-muted">Paper</h3>
        <WrapperPicker value={bouquet.wrapper} onChange={onSetWrapper} />
      </section>
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase text-charcoal-muted">Ribbon</h3>
        <RibbonPicker value={bouquet.ribbon} onChange={onSetRibbon} />
      </section>
    </div>
  );
}
