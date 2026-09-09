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

// A signature theme's flowers/foliage are short *palette* lists (5-6 blooms,
// 1-2 greenery) — the recipe, not the arrangement. The builder hands those to
// the composer, so without expansion a themed bouquet would be a 6-stem puff
// instead of the full hand-tied dome people see on the homepage. These
// expanders grow a palette into a florist's dozen-plus, leading flower forward.

/** Greenery ring around the mouth — the same bush base the default uses. */
export function expandThemeFoliage(ids: string[], target = 4): string[] {
  if (ids.length === 0) return [];
  const out: string[] = [];
  for (let i = 0; i < target; i++) out.push(ids[i % ids.length]);
  return out;
}

/**
 * A hand-tied dome of ~14 flower stems from a theme palette: the lead bloom
 * anchors the crown and mouth (3), seconds pair up, the tail rounds the dome.
 */
export function expandThemeFlowers(ids: string[], target = 14): string[] {
  if (ids.length === 0) return [];
  const weights = [3, 2, 2, 2, 1, 1, 1];
  const out: string[] = [];
  let i = 0;
  while (out.length < target) {
    const id = ids[i % ids.length];
    const weight = weights[i % weights.length];
    for (let k = 0; k < weight && out.length < target; k++) out.push(id);
    i++;
  }
  return out;
}
