import type { AssetDef } from "@/lib/bouquet/types";

/*
 * Greenery mirrors digibouquet.org: three foliage base options rendered as
 * full bush cutouts (webp, transparent backgrounds) instead of procedural
 * stems, so the arrangement reads like a hand-tied bunch.
 */

export const FOLIAGE: AssetDef[] = [
  { id: "eucalyptus", name: "Eucalyptus", category: "foliage", shape: "eucalyptus", image: "/flora/green-2.webp", colors: { primary: "#93a992", secondary: "#748a72" }, defaultScale: 1.3, defaultRotation: 0, tags: ["silvery", "textural"], layerHint: 1 },
  { id: "fern", name: "Fern", category: "foliage", shape: "fern", image: "/flora/green-1.webp", colors: { primary: "#5c7a52", secondary: "#496341" }, defaultScale: 1.3, defaultRotation: 0, tags: ["wild", "green"], layerHint: 1 },
  { id: "babys_breath", name: "Baby's Breath", category: "foliage", shape: "babys_breath", image: "/flora/green-3.webp", colors: { primary: "#f2f0e8", secondary: "#e4e0d2" }, defaultScale: 1.15, defaultRotation: 0, tags: ["filler", "delicate"], layerHint: 1 },
  // No raster cutout yet — these render with the app's procedural SVG shapes.
  { id: "olive", name: "Olive Branch", category: "foliage", shape: "olive", colors: { primary: "#8a9a6b", secondary: "#6f7f52" }, defaultScale: 1.2, defaultRotation: 0, tags: ["silvery", "textural"], layerHint: 1 },
  { id: "ruscus", name: "Ruscus", category: "foliage", shape: "ruscus", colors: { primary: "#3f6b45", secondary: "#2f5236" }, defaultScale: 1.25, defaultRotation: 0, tags: ["wild", "green"], layerHint: 1 },
  { id: "ivy", name: "Ivy", category: "foliage", shape: "ivy", colors: { primary: "#4c7a4a" }, defaultScale: 1.15, defaultRotation: 0, tags: ["wild", "green"], layerHint: 1 },
  { id: "leaf", name: "Simple Leaf", category: "foliage", shape: "leaf", colors: { primary: "#5f8a5a", secondary: "#4a7346" }, defaultScale: 1.1, defaultRotation: 0, tags: ["filler", "green"], layerHint: 1 },
];

export function getFoliage(id: string) {
  return FOLIAGE.find((f) => f.id === id);
}

/** Legacy foliage ids keep resolving so old links still render. */
export const LEGACY_FOLIAGE: AssetDef[] = [
  ...twin("olive_branch", "eucalyptus"),
  ...twin("green_leaves", "fern"),
];

function twin(legacyId: string, canonicalId: string): AssetDef[] {
  const canonical = FOLIAGE.find((f) => f.id === canonicalId);
  if (!canonical) return [];
  return [{
    ...canonical,
    id: legacyId,
    name: legacyId
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  }];
}