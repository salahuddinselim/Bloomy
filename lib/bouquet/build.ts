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

// A full, hand-tied dome: greenery out back, a big romantic head in front,
// filler in the shoulders and a few taller stems at the mouth rim — ~18
// stems like a florist's "full hand-tied" bunch. Matches digibouquet's lush
// photographed mass: wide, low, solid, flat-crowned.
export const DEFAULT_BOUQUET_FLOWER_IDS = [
  "eucalyptus",
  "eucalyptus",
  "babys_breath",
  "babys_breath",
  "rose",
  "rose",
  "rose",
  "rose",
  "rose",
  "rose",
  "peony",
  "peony",
  "carnation",
  "tulip",
  "ranunculus",
  "ranunculus",
  "daisy",
  "daisy",
];
