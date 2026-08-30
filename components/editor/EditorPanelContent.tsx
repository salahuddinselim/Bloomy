"use client";

import { useState } from "react";
import { FLOWERS, FLOWER_CATEGORIES } from "@/data/flowers";
import { FOLIAGE } from "@/data/foliage";
import { DECORATIONS } from "@/data/decorations";
import { PRESETS } from "@/data/presets";
import { AssetGrid } from "./AssetGrid";
import { WrapperPicker, RibbonPicker } from "./WrapperRibbonPicker";
import type { Bouquet } from "@/lib/bouquet/types";
import { LIMITS } from "@/lib/bouquet/types";
import { cn } from "@/lib/utils";

export type EditorTab = "flowers" | "foliage" | "wrapper" | "ribbon" | "decor" | "presets";

export const EDITOR_TABS: { id: EditorTab; label: string }[] = [
  { id: "presets", label: "Presets" },
  { id: "flowers", label: "Flowers" },
  { id: "foliage", label: "Foliage" },
  { id: "wrapper", label: "Wrapper" },
  { id: "ribbon", label: "Ribbon" },
  { id: "decor", label: "Decor" },
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
  const [flowerCategory, setFlowerCategory] = useState("all");

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
            <div className="mt-1 text-xs leading-snug text-charcoal-soft/60">{p.description}</div>
          </button>
        ))}
      </div>
    );
  }

  if (tab === "flowers") {
    const active = FLOWER_CATEGORIES.find((c) => c.id === flowerCategory);
    const items = active ? FLOWERS.filter((f) => f.tags.includes(active.id) || active.id === "all") : FLOWERS;
    return (
      <div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {FLOWER_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFlowerCategory(c.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition",
                flowerCategory === c.id
                  ? "bg-charcoal text-ivory"
                  : "bg-charcoal/5 text-charcoal-soft hover:bg-charcoal/10"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <AssetGrid items={items} onAdd={onAdd} disabled={() => counts.flower >= LIMITS.MAX_FLOWERS} />
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

  if (tab === "decor") {
    return (
      <div>
        <AssetGrid items={DECORATIONS} onAdd={onAdd} disabled={() => counts.decoration >= LIMITS.MAX_DECORATIONS} />
      </div>
    );
  }

  if (tab === "wrapper") {
    return <WrapperPicker value={bouquet.wrapper} onChange={onSetWrapper} />;
  }

  return <RibbonPicker value={bouquet.ribbon} onChange={onSetRibbon} />;
}
