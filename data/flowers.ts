import type { AssetDef } from "@/lib/bouquet/types";

/*
 * The flower set mirrors digibouquet.org — twelve painterly, photo-realistic
 * bloom illustrations (webp cutouts, transparent backgrounds) so the bouquet
 * reads like pressed, hand-picked stems rather than a flat icon set.
 * Each bloom carries its language-of-flowers meaning, surfaced in the editor
 * and on the landing page.
 */

export const FLOWERS: AssetDef[] = [
  BL_("rose", "Rose", "/flora/bloom-rose.webp", "#b82e3c", "#8c1f2e", 1.05, ["romantic", "classic"], 2),
  BL_("peony", "Peony", "/flora/bloom-peony.webp", "#d97b86", "#c25a6b", 1.15, ["lush", "romantic"], 2),
  BL_("dahlia", "Dahlia", "/flora/bloom-dahlia.webp", "#c74a2e", "#a83a24", 1.05, ["bold", "dramatic"], 2),
  BL_("anemone", "Anemone", "/flora/bloom-anemone.webp", "#6c5b9e", "#5a4a8c", 0.95, ["spring", "elegant"], 3),
  BL_("ranunculus", "Ranunculus", "/flora/bloom-ranunculus.webp", "#f4b37a", "#e28f57", 1.05, ["charming", "spring"], 2),
  BL_("orchid", "Orchid", "/flora/bloom-orchid.webp", "#c58bd1", "#a35bb5", 0.95, ["exotic", "elegant"], 3),
  BL_("carnation", "Carnation", "/flora/bloom-carnation.webp", "#e79a92", "#d1726e", 0.9, ["classic", "romantic"], 3),
  BL_("zinnia", "Zinnia", "/flora/bloom-zinnia.webp", "#d03a2e", "#b02d24", 1.0, ["cheerful", "bold"], 2),
  BL_("daisy", "Daisy", "/flora/bloom-daisy.webp", "#f4f1e6", "#e2dccc", 0.85, ["cheerful", "simple"], 4),
  BL_("sunflower", "Sunflower", "/flora/bloom-sunflower.webp", "#eec33e", "#d9a92f", 1.15, ["sunny", "happy"], 2),
  BL_("tulip", "Tulip", "/flora/bloom-tulip.webp", "#e96d63", "#d14f4a", 0.95, ["spring", "romantic"], 3),
  BL_("lily", "Lily", "/flora/bloom-lily.webp", "#d9d3b0", "#c4bd94", 1.05, ["elegant", "classic"], 2),
  // These four don't have a raster cutout yet, so they fall back to the
  // app's procedural SVG shapes (components/bouquet/shapes.tsx).
  V_("hydrangea", "Hydrangea", "hydrangea", "#8fa8d1", "#b98fc9", 1.1, ["lush", "garden"], 2),
  V_("lavender", "Lavender", "lavender", "#8a7cc4", "#6a5aa8", 0.9, ["calm", "fragrant"], 3),
  V_("daffodil", "Daffodil", "daffodil", "#f6cd4b", "#e2a52e", 0.95, ["spring", "cheerful"], 3),
  V_("blossom", "Cherry Blossom", "blossom", "#f7c9d3", "#f2a9b9", 0.85, ["spring", "delicate"], 4),
];

function BL_(
  id: string,
  name: string,
  image: string,
  primary: string,
  secondary: string,
  defaultScale: number,
  tags: string[],
  layerHint: AssetDef["layerHint"]
): AssetDef {
  return { id, name, category: "flower", shape: id as AssetDef["shape"], image, colors: { primary, secondary }, defaultScale, defaultRotation: 0, tags, layerHint };
}

/** Same as BL_ but without a raster image, so it renders as an SVG shape. */
function V_(
  id: string,
  name: string,
  shape: AssetDef["shape"],
  primary: string,
  secondary: string,
  defaultScale: number,
  tags: string[],
  layerHint: AssetDef["layerHint"]
): AssetDef {
  return { id, name, category: "flower", shape, colors: { primary, secondary }, defaultScale, defaultRotation: 0, tags, layerHint };
}

export const FLOWER_CATEGORIES = [{ id: "all", label: "All Flowers" }];

export function getFlower(id: string) {
  return FLOWERS.find((f) => f.id === id);
}

/**
 * Legacy bloom ids (from the earlier procedural catalog) still resolve so old
 * share links keep rendering. Each maps to the closest digibouquet bloom.
 */
export const LEGACY_FLOWERS: AssetDef[] = [
  ...roseVariant("rose_pink"),
  ...roseVariant("rose_white"),
  ...roseVariant("rose_peach"),
  ...roseVariant("rose_champagne"),
  ...roseVariant("rose_burgundy"),
  ...twin("tulip_pink", "tulip"),
  ...twin("tulip_white", "tulip"),
  ...twin("tulip_yellow", "tulip"),
  ...twin("tulip_purple", "tulip"),
  ...twin("tulip_red", "tulip"),
  ...twin("lily_white", "lily"),
  ...twin("lily_pink", "lily"),
  ...twin("lily_stargazer", "lily"),
];

function roseVariant(id: string): AssetDef[] {
  return [twin(id, "rose")[0]];
}

/** A legacy id wearing a canonical bloom's image, defaults and meaning slot. */
function twin(legacyId: string, canonicalId: string): AssetDef[] {
  const canonical = FLOWERS.find((f) => f.id === canonicalId);
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

/** The language of flowers — what each stem quietly says (from digibouquet). */
export const FLOWER_MEANINGS: Record<string, string> = {
  rose: "deep love & passion",
  peony: "prosperity & romance",
  dahlia: "elegance & dignity",
  anemone: "anticipation & sincerity",
  ranunculus: "charm & radiance",
  orchid: "rare beauty & strength",
  carnation: "love & admiration",
  zinnia: "lasting affection",
  daisy: "innocence & joy",
  sunflower: "loyalty & warmth",
  tulip: "perfect love",
  lily: "purity & devotion",
  // legacy ids keep their meanings for old links
  rose_red: "deep love & passion",
  rose_pink: "sweet admiration",
  rose_white: "pure hearts and new beginnings",
  rose_peach: "warm thanks and sincerity",
  rose_champagne: "thoughtful, understated affection",
  rose_burgundy: "quiet passion",
  tulip_pink: "caring, wonderful wishes",
  tulip_white: "peaceful forgiveness",
  tulip_yellow: "cheerful sunshine and hope",
  tulip_purple: "regal admiration",
  tulip_red: "a heart declared",
  lily_white: "purity and grace",
  lily_pink: "fascination, prosperity",
  lily_stargazer: "ambition, made beautiful",
  hydrangea: "sincere gratitude and grace",
  lavender: "calm, serenity, devotion",
  daffodil: "rebirth and fresh starts",
  blossom: "gentle, fleeting beauty",
  cherry_blossom: "gentle, fleeting beauty",
};