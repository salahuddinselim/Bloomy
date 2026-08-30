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
];

export function getFoliage(id: string) {
  return FOLIAGE.find((f) => f.id === id);
}

/** Legacy foliage ids keep resolving so old links still render. */
export const LEGACY_FOLIAGE: AssetDef[] = [
  ...twin("olive_branch", "eucalyptus"),
  ...twin("ruscus", "eucalyptus"),
  ...twin("ivy", "fern"),
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