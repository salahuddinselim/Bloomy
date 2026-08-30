import { getAssetDef } from "@/components/bouquet/BouquetAsset";
import { autoArrange } from "./composer";
import type { BouquetElement } from "./types";
import type { BouquetPreset } from "@/data/presets";

export function elementsFromIds(ids: string[]): BouquetElement[] {
  const items = ids
    .map((id) => ({ def: getAssetDef(id) }))
    .filter((i): i is { def: NonNullable<typeof i.def> } => Boolean(i.def));
  return autoArrange(items);
}

export function elementsFromPreset(preset: BouquetPreset): BouquetElement[] {
  return elementsFromIds([...preset.foliage, ...preset.flowers]);
}

export const DEFAULT_BOUQUET_FLOWER_IDS = [
  "eucalyptus",
  "eucalyptus",
  "rose_pink",
  "rose_pink",
  "rose_pink",
  "babys_breath",
  "babys_breath",
];
