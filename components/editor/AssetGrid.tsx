"use client";

import type { AssetDef } from "@/lib/bouquet/types";
import { BouquetAsset } from "@/components/bouquet/BouquetAsset";
import { FLOWER_MEANINGS } from "@/data/flowers";
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
            <BouquetAsset type={item.id} category={item.category} className="h-10 w-10" />
            <span className="line-clamp-2 text-center text-xs leading-snug text-charcoal-soft">
              {item.name}
            </span>
            {item.category === "flower" && FLOWER_MEANINGS[item.id] && (
              <span className="line-clamp-1 text-center font-script text-[11px] italic leading-none text-dusty-rose">
                {FLOWER_MEANINGS[item.id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
