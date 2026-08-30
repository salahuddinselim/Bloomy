import type { AssetDef } from "@/lib/bouquet/types";

export const FLOWERS: AssetDef[] = [
  // Roses
  { id: "rose_red", name: "Red Rose", category: "flower", shape: "rose", colors: { primary: "#8c1f2e", secondary: "#6b1220" }, defaultScale: 1, defaultRotation: 0, tags: ["romantic", "classic"], layerHint: 2 },
  { id: "rose_white", name: "White Rose", category: "flower", shape: "rose", colors: { primary: "#faf7f0", secondary: "#e8e1d2" }, defaultScale: 1, defaultRotation: 0, tags: ["elegant", "wedding"], layerHint: 2 },
  { id: "rose_pink", name: "Pink Rose", category: "flower", shape: "rose", colors: { primary: "#e8a3b3", secondary: "#d17f95" }, defaultScale: 1, defaultRotation: 0, tags: ["soft", "romantic"], layerHint: 2 },
  { id: "rose_peach", name: "Peach Rose", category: "flower", shape: "rose", colors: { primary: "#f0b48c", secondary: "#e0946a" }, defaultScale: 1, defaultRotation: 0, tags: ["warm", "spring"], layerHint: 2 },
  { id: "rose_champagne", name: "Champagne Rose", category: "flower", shape: "rose", colors: { primary: "#eddcbd", secondary: "#dcc49a" }, defaultScale: 1, defaultRotation: 0, tags: ["elegant", "neutral"], layerHint: 2 },
  { id: "rose_burgundy", name: "Burgundy Rose", category: "flower", shape: "rose", colors: { primary: "#5c1524", secondary: "#3d0e18" }, defaultScale: 1, defaultRotation: 0, tags: ["deep", "dramatic"], layerHint: 2 },

  // Tulips
  { id: "tulip_pink", name: "Pink Tulip", category: "flower", shape: "tulip", colors: { primary: "#e69cb4", secondary: "#c9738f" }, defaultScale: 0.9, defaultRotation: 0, tags: ["spring"], layerHint: 3 },
  { id: "tulip_white", name: "White Tulip", category: "flower", shape: "tulip", colors: { primary: "#f8f5ec", secondary: "#e3ddc9" }, defaultScale: 0.9, defaultRotation: 0, tags: ["spring", "elegant"], layerHint: 3 },
  { id: "tulip_yellow", name: "Yellow Tulip", category: "flower", shape: "tulip", colors: { primary: "#f2cf5b", secondary: "#dcae2f" }, defaultScale: 0.9, defaultRotation: 0, tags: ["sunny", "spring"], layerHint: 3 },
  { id: "tulip_purple", name: "Purple Tulip", category: "flower", shape: "tulip", colors: { primary: "#8a6bab", secondary: "#6b4c8c" }, defaultScale: 0.9, defaultRotation: 0, tags: ["spring", "regal"], layerHint: 3 },
  { id: "tulip_red", name: "Red Tulip", category: "flower", shape: "tulip", colors: { primary: "#b23a3a", secondary: "#8f2626" }, defaultScale: 0.9, defaultRotation: 0, tags: ["bold", "spring"], layerHint: 3 },

  // Lilies
  { id: "lily_white", name: "White Lily", category: "flower", shape: "lily", colors: { primary: "#fbf9f2", secondary: "#e9e2cd", center: "#c9a24a" }, defaultScale: 1.1, defaultRotation: 0, tags: ["elegant", "fragrant"], layerHint: 2 },
  { id: "lily_pink", name: "Pink Lily", category: "flower", shape: "lily", colors: { primary: "#e8a9c0", secondary: "#d383a2", center: "#a3436b" }, defaultScale: 1.1, defaultRotation: 0, tags: ["romantic"], layerHint: 2 },
  { id: "lily_stargazer", name: "Stargazer Lily", category: "flower", shape: "lily", colors: { primary: "#d94f7c", secondary: "#b5305c", center: "#f2d9a8" }, defaultScale: 1.15, defaultRotation: 0, tags: ["dramatic", "fragrant"], layerHint: 2 },

  // Other
  { id: "sunflower", name: "Sunflower", category: "flower", shape: "sunflower", colors: { primary: "#f3b83b", secondary: "#dd9a1f", center: "#5c3b1e" }, defaultScale: 1.1, defaultRotation: 0, tags: ["sunny", "happy"], layerHint: 2 },
  { id: "peony", name: "Peony", category: "flower", shape: "peony", colors: { primary: "#eab8c4", secondary: "#d98fa1" }, defaultScale: 1.15, defaultRotation: 0, tags: ["lush", "romantic"], layerHint: 2 },
  { id: "daisy", name: "Daisy", category: "flower", shape: "daisy", colors: { primary: "#fbfbf6", secondary: "#e9e6d8", center: "#e8b93a" }, defaultScale: 0.75, defaultRotation: 0, tags: ["cheerful", "simple"], layerHint: 4 },
  { id: "carnation", name: "Carnation", category: "flower", shape: "carnation", colors: { primary: "#e28fa0", secondary: "#c76a80" }, defaultScale: 0.85, defaultRotation: 0, tags: ["ruffled", "classic"], layerHint: 3 },
  { id: "hydrangea", name: "Hydrangea", category: "flower", shape: "hydrangea", colors: { primary: "#9cb4d9", secondary: "#7a97c2" }, defaultScale: 1.15, defaultRotation: 0, tags: ["full", "voluminous"], layerHint: 2 },
  { id: "orchid", name: "Orchid", category: "flower", shape: "orchid", colors: { primary: "#c58bd1", secondary: "#a35bb5", center: "#7a2d8c" }, defaultScale: 0.95, defaultRotation: 0, tags: ["exotic", "elegant"], layerHint: 3 },
  { id: "babys_breath", name: "Baby's Breath", category: "flower", shape: "babys_breath", colors: { primary: "#fbfbf6", secondary: "#e9e6d8" }, defaultScale: 0.8, defaultRotation: 0, tags: ["filler", "delicate"], layerHint: 5 },
  { id: "lavender", name: "Lavender", category: "flower", shape: "lavender", colors: { primary: "#8571b0", secondary: "#6a5490" }, defaultScale: 0.85, defaultRotation: 0, tags: ["fragrant", "filler"], layerHint: 4 },
  { id: "daffodil", name: "Daffodil", category: "flower", shape: "daffodil", colors: { primary: "#f7e07a", secondary: "#e8c94a", center: "#e8912f" }, defaultScale: 0.9, defaultRotation: 0, tags: ["spring", "cheerful"], layerHint: 3 },
  { id: "cherry_blossom", name: "Cherry Blossom", category: "flower", shape: "blossom", colors: { primary: "#f4c8d4", secondary: "#e8a7bb", center: "#c76a80" }, defaultScale: 0.7, defaultRotation: 0, tags: ["delicate", "spring"], layerHint: 4 },
];

export const FLOWER_CATEGORIES = [
  { id: "roses", label: "Roses", match: (id: string) => id.startsWith("rose_") },
  { id: "tulips", label: "Tulips", match: (id: string) => id.startsWith("tulip_") },
  { id: "lilies", label: "Lilies", match: (id: string) => id.startsWith("lily_") },
  {
    id: "other",
    label: "More Flowers",
    match: (id: string) =>
      !id.startsWith("rose_") && !id.startsWith("tulip_") && !id.startsWith("lily_"),
  },
];

export function getFlower(id: string) {
  return FLOWERS.find((f) => f.id === id);
}

/** The language of flowers — what each stem quietly says. */
export const FLOWER_MEANINGS: Record<string, string> = {
  rose_red: "true love, deep devotion",
  rose_white: "pure hearts and new beginnings",
  rose_pink: "sweet admiration",
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
  sunflower: "steadfast loyalty and joy",
  peony: "a happy life, good fortune",
  daisy: "innocence and loyalty",
  carnation: "devotion, fascination",
  hydrangea: "sincere gratitude and grace",
  orchid: "rare, refined beauty",
  babys_breath: "everlasting, enduring care",
  lavender: "calm, serenity, devotion",
  daffodil: "rebirth and fresh starts",
  cherry_blossom: "gentle, fleeting beauty",
};
