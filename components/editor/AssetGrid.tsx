"use client";

import type { AssetDef } from "@/lib/bouquet/types";
import { FlowerBloom, FoliageGraphic, DecorationGraphic } from "@/components/bouquet/shapes";
import { cn } from "@/lib/utils";

export function AssetGrid({
  items,
  onAdd,
  disabled,
}: {
  items: AssetDef[];
  onAdd: (id: string) => void;
  disabled?: (id: string) => boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const isDisabled = disabled?.(item.id) ?? false;
        const Graphic =
          item.category === "flower" ? FlowerBloom : item.category === "foliage" ? FoliageGraphic : DecorationGraphic;
        return (
          <button
            key={item.id}
            type="button"
            disabled={isDisabled}
            onClick={() => onAdd(item.id)}
            aria-label={`Add ${item.name}`}
            title={item.name}
            className={cn(
              "group flex flex-col items-center gap-1 rounded-xl border border-charcoal/8 bg-paper p-2 transition hover:-translate-y-0.5 hover:border-burgundy/30 hover:shadow-md",
              isDisabled && "cursor-not-allowed opacity-40 hover:translate-y-0 hover:shadow-none"
            )}
          >
            <Graphic shape={item.shape} colors={item.colors} className="h-10 w-10" />
            <span className="line-clamp-2 text-center text-xs leading-snug text-charcoal-soft">
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
