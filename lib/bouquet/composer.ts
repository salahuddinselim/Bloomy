import type { AssetDef, BouquetElement, ElementCategory } from "./types";
import { mulberry32, hashString, clamp, round } from "@/lib/utils";

let counter = 0;
export function genId() {
  counter += 1;
  return `el_${Date.now().toString(36)}_${counter}_${Math.random().toString(36).slice(2, 6)}`;
}

const CENTER_X = 50;
const CENTER_Y = 56;

/** Base z ordering: foliage below flowers below decorations, large flowers below small. */
function baseZ(def: AssetDef) {
  return def.layerHint * 10;
}

/**
 * Places a single new element intelligently relative to existing ones so the
 * silhouette stays balanced instead of just stacking everything in the center.
 */
export function smartPlacement(
  existing: BouquetElement[],
  def: AssetDef
): { x: number; y: number; rotation: number; scale: number; z: number } {
  const sameCategory = existing.filter((e) => e.category === def.category);
  const index = sameCategory.length;
  const rand = mulberry32(hashString(def.id) + index * 977 + existing.length * 31);

  let angle: number;
  let radius: number;

  if (def.category === "foliage") {
    // Foliage spreads wide behind the flowers, biased outward.
    angle = (index / 6) * Math.PI * 2 + rand() * 0.6;
    radius = 18 + rand() * 10;
  } else if (def.category === "decoration") {
    angle = rand() * Math.PI * 2;
    radius = 5 + rand() * 10;
  } else {
    // Flowers: triangular / circular florist composition depending on count.
    const n = index + 1;
    if (n === 1) {
      angle = -Math.PI / 2;
      radius = 0;
    } else if (n <= 3) {
      angle = -Math.PI / 2 + ((index % 3) / 3) * Math.PI * 2;
      radius = 10;
    } else if (n <= 6) {
      angle = ((index % 5) / 5) * Math.PI * 2 - Math.PI / 2;
      radius = 11 + (index % 2) * 4;
    } else {
      angle = ((index % 8) / 8) * Math.PI * 2 + rand() * 0.4;
      radius = 8 + (index % 3) * 6 + rand() * 3;
    }
  }

  const jitterX = (rand() - 0.5) * 4;
  const jitterY = (rand() - 0.5) * 3.5;

  const x = round(clamp(CENTER_X + Math.cos(angle) * radius * 0.9 + jitterX, 18, 82));
  const y = round(clamp(CENTER_Y + Math.sin(angle) * radius * 0.68 + jitterY, 18, 74));

  const rotation = Math.round((rand() - 0.5) * 34 + def.defaultRotation);
  const scale = round(def.defaultScale * (0.88 + rand() * 0.26), 2);
  const z = baseZ(def) + Math.round(rand() * 4);

  return { x, y, rotation, scale, z };
}

export function createElement(def: AssetDef, existing: BouquetElement[]): BouquetElement {
  const placement = smartPlacement(existing, def);
  return {
    id: genId(),
    type: def.id,
    category: def.category,
    ...placement,
  };
}

/**
 * "Arrange for me" — rebuilds positions for a whole set of elements from
 * scratch so the bouquet reads as one balanced, professionally arranged piece.
 */
export function autoArrange(
  items: { def: AssetDef }[]
): BouquetElement[] {
  const byCategory: Record<ElementCategory, AssetDef[]> = {
    foliage: [],
    flower: [],
    decoration: [],
  };
  for (const { def } of items) byCategory[def.category].push(def);

  const result: BouquetElement[] = [];
  const ordered = [...byCategory.foliage, ...byCategory.flower, ...byCategory.decoration];
  for (const def of ordered) {
    const el = createElement(def, result);
    result.push(el);
  }
  return result;
}
