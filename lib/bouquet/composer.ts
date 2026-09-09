import type { AssetDef, BouquetElement, ElementCategory } from "./types";
import { mulberry32, hashString, clamp, round } from "@/lib/utils";

let counter = 0;
export function genId() {
  counter += 1;
  return `el_${Date.now().toString(36)}_${counter}_${Math.random().toString(36).slice(2, 6)}`;
}

/*
 * The bouquet is composed as a hand-tied dome, not a flat fan.
 *
 * WrapperGraphic renders its 400x300 (4:3) artwork into the canvas's 4:5 box
 * with preserveAspectRatio="xMidYMax meet" — scaled to fit width, anchored to
 * the bottom, occupying the canvas's bottom 60% (y 40%..100%). The cone's
 * fold lip (the top edge of the paper face) is at viewBox y≈110 → canvas
 * y≈62%, so the opening the stems pass through is the band right above it:
 * canvas y≈52-62%. Every target below is a y% in canvas coordinates, and
 * every element's x/y is its BLOOM HEAD anchor (cutouts are head+stem
 * portraits — see anchorY in types.ts). Appex heads peak at the gather minus
 * the dome's rise; RIM heads sit just below peak, tucked so their petals
 * peek over the lip and only their stems hide inside the cone.
 *
 * The geometry mirrors digibouquet's finished bouquets: a wide, low, solid
 * round bunch — flat crown, near-vertical sides, greenery ringing the base —
 * instead of a tall pointy fan. Heads are packed tight (small jitter) and run
 * large so the mass reads continuous, the way photographed blooms interlock.
 */
export const GATHER_X = 50;
export const GATHER_Y = 60;
/** Lateral half-span of the dome in canvas width %. */
export const SPAN_X = 30;
/** Rise from the gather to the dome apex in canvas height %. */
export const APEX_H = 9;
/** Canvas height % per canvas width % at 4:5, for angle-free placement math. */
const Y_PER_X = 0.8;
/** Center y% of the flat crown. */
const DOME_TOP = 44;
/** Center y% of the rim blossoms — just above the cone's paper fold lip. */
const RIM_Y = 62;

// Bloom anchors progress center-first so every bouquet builds into the same
// dome silhouette: apex bloom first, then shoulders, then flanks, then rims.
// Values beyond ±1 sit at the mouth rim, slightly tucked into the wrap.
const FLOWER_TS = [
  0, -0.5, 0.5, -0.78, 0.78, -0.25, 0.25, -1, 1, -1.18, 1.18, -0.62, 0.62, -0.9, 0.9, -1.3, 1.3,
];

const FOLIAGE_TS = [-1.2, 0, 1.2];

/** Base z ordering: foliage below flowers below decorations, large flowers below small. */
function baseZ(def: AssetDef) {
  return def.layerHint * 10;
}

function seeded(def: AssetDef, index: number, context: number) {
  return mulberry32(hashString(def.id) + index * 977 + context * 31);
}

/**
 * The y of a mound lateral position t: a flat crown plateau at t≈0 that climbs
 * linearly to the rim at |t|≈1, then hangs past the rim into the skirt. Bloom
 * head centers therefore spread top-to-bottom (crown ≈44, rim ≈62, skirt ≈80)
 * exactly like a photographed bunch instead of pinning every head to one band.
 */
function domeY(t: number) {
  const at = Math.abs(t);
  if (at <= 0.25) return DOME_TOP;
  if (at <= 1.15) return DOME_TOP + ((at - 0.25) / 0.9) * (RIM_Y - DOME_TOP);
  return clamp(RIM_Y + (at - 1.15) * 34, RIM_Y, 80);
}

/** Payload of one placement — same shape smartPlacement has always returned. */
function place(
  def: AssetDef,
  t: number,
  index: number,
  context: number,
  scaleAmplify = 1
): { x: number; y: number; rotation: number; scale: number; z: number } {
  const rand = seeded(def, index, context);
  const x = round(clamp(GATHER_X + t * SPAN_X + (rand() - 0.5) * 1.8, 10, 90));
  const y = round(domeY(t) + (rand() - 0.5) * 1.4);
  // Blooms closer to the apex read as the focal point of a real bouquet and
  // sit in front; rim blooms recede. Stays within this category's 0-9 band.
  const z = baseZ(def) + clamp(Math.round(9 - 9 * Math.min(Math.abs(t), 1)), 0, 9);
  // Center blooms carry the bouquet; rims shrink slightly toward the mouth.
  // Heads run large overall so the whole mass reads solid and interlocked.
  const sizeFactor = 1.22 - 0.08 * Math.min(Math.abs(t), 1.2);
  const scale = round(def.defaultScale * (scaleAmplify * sizeFactor * (0.98 + rand() * 0.08)), 2);
  // A hand-tied bouquet's stems lean inward toward the gather point; rotation
  // leans with the horizontal offset, capped so outer blooms don't over-rotate.
  const lean = clamp((x - GATHER_X) * 0.55, -18, 18);
  const rotation = Math.round(def.defaultRotation + lean + (rand() - 0.5) * 6);
  return { x, y, rotation, scale, z };
}

/**
 * Places a single new element intelligently relative to existing ones so the
 * silhouette grows as one balanced dome instead of stacking everything in the
 * center or spraying heads across the canvas.
 */
export function smartPlacement(
  existing: BouquetElement[],
  def: AssetDef
): { x: number; y: number; rotation: number; scale: number; z: number } {
  const index = existing.filter((e) => e.category === def.category).length;
  const context = existing.length;

  if (def.category === "foliage") {
    // Greenery forms a wide wedge hugging the mouth's rear: a bush each side
    // and one rising behind the apex, so it peeks around the blooms rather
    // than competing with them.
    const t = FOLIAGE_TS[index % FOLIAGE_TS.length];
    const ring = Math.floor(index / FOLIAGE_TS.length);
    const spread = t * (1 + ring * 0.5);
    const t2 = ring % 2 === 1 ? Math.sign(spread) * 1.3 : spread;
    return place(def, t2, index, context, 1.3);
  }

  if (def.category === "decoration") {
    // Small accents cluster at the neck, front and center, over the ribbon.
    const rand = seeded(def, index, context);
    const angle = rand() * Math.PI * 2;
    const radius = 5 + rand() * 8;
    const x = round(clamp(GATHER_X + Math.cos(angle) * radius + (rand() - 0.5) * 3, 20, 80));
    const y = round(clamp(GATHER_Y + Math.sin(angle) * radius * Y_PER_X - 2, 45, 70));
    const rotation = Math.round(def.defaultRotation + (rand() - 0.5) * 14);
    const scale = round(def.defaultScale * (1 + rand() * 0.1), 2);
    return { x, y, rotation, scale, z: baseZ(def) + 9 };
  }

  const t = FLOWER_TS[index % FLOWER_TS.length];
  const ring = Math.floor(index / FLOWER_TS.length);
  const t2 = ring % 2 === 1 ? Math.sign(t) * (Math.abs(t) + 0.45) : t;
  return place(def, t2, index, context);
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
 * scratch so the bouquet reads as one balanced, professionally arranged dome.
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