import type { AssetDef, BouquetElement, ElementCategory } from "./types";
import { mulberry32, hashString, clamp, round } from "@/lib/utils";

let counter = 0;
export function genId() {
  counter += 1;
  return `el_${Date.now().toString(36)}_${counter}_${Math.random().toString(36).slice(2, 6)}`;
}

const CENTER_X = 50;
// WrapperGraphic renders its 400x300 (4:3) artwork into the canvas's 4:5 box
// with `preserveAspectRatio="xMidYMax meet"` — scaled to fit width, anchored
// to the bottom — so the wrap only occupies roughly the bottom 60% of the
// canvas and its opening sits around 63-68% down, not near the vertical
// center. Every florist spot's angle already biases upward (a bouquet fans
// UP from one gathering point), so centering that fan at the wrap's opening
// — rather than the canvas's midpoint — is what makes the blooms actually
// sit in the wrap instead of floating above it with a visible gap.
const CENTER_Y = 63;

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
    angle = -Math.PI / 2.6 + (index / 5) * Math.PI * 1.25 + rand() * 0.45;
    radius = 20 + rand() * 13;
  } else if (def.category === "decoration") {
    angle = rand() * Math.PI * 2;
    radius = 5 + rand() * 10;
  } else {
    // Radii are deliberately roomier than a naive fan: real hand-tied
    // bouquets do have petals touching and overlapping, but the previous,
    // tighter spacing packed enough blooms within one flower-head's own
    // radius that a 4-5 flower default bouquet read as a single overlapping
    // blob rather than a fanned cluster with each stem legible.
    const floristSpots = [
      { angle: -Math.PI / 2, radius: 0 },
      { angle: -2.72, radius: 14 },
      { angle: -0.42, radius: 15 },
      { angle: -1.65, radius: 17 },
      { angle: -1.03, radius: 19 },
      { angle: -3.08, radius: 21 },
      { angle: -0.04, radius: 22 },
      { angle: -2.18, radius: 22 },
      { angle: -0.9, radius: 24 },
      { angle: -2.75, radius: 27 },
      { angle: -0.34, radius: 27 },
      { angle: -1.42, radius: 27 },
    ];
    const spot = floristSpots[index % floristSpots.length];
    angle = spot.angle + (rand() - 0.5) * 0.22;
    radius = spot.radius + rand() * 2.5;
  }

  const jitterX = (rand() - 0.5) * 3.5;
  const jitterY = (rand() - 0.5) * 3;

  const x = round(clamp(CENTER_X + Math.cos(angle) * radius * 1.02 + jitterX, 13, 87));
  const y = round(clamp(CENTER_Y + Math.sin(angle) * radius * 0.78 + jitterY, 17, 70));

  // A real hand-tied bouquet fans outward from one gathering point: each
  // stem's lean tracks where it sits, not an independent random spin. Fully
  // independent rotation (the old behavior) is what read as "messy" — blooms
  // pointing in unrelated directions regardless of position. Tying lean to
  // horizontal offset from center (capped, so outer blooms don't over-rotate)
  // and cutting the leftover randomness down to a small natural wobble fixes
  // that while still keeping every bouquet visually unique.
  const dx = x - CENTER_X;
  const lean = clamp(dx * 0.55, -18, 18);
  const rotation = Math.round(def.defaultRotation + lean + (rand() - 0.5) * 10);
  const scaleBase = def.category === "foliage" ? 1.02 : 0.94;
  const scale = round(def.defaultScale * (scaleBase + rand() * 0.22), 2);
  // Blooms closer to the hand-tie center read as the focal point of a real
  // bouquet and should sit in front; outer ones recede. Deterministic (not
  // randomized) so the "hero" bloom doesn't randomly end up hidden behind a
  // peripheral one — offset stays within this category's 0-9 z band.
  const z = baseZ(def) + clamp(Math.round(9 - radius / 3), 0, 9);

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
