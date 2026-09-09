export interface BouquetPreset {
  id: string;
  name: string;
  description: string;
  flowers: string[];
  foliage: string[];
  wrapper: string;
  ribbon: string;
}

export const PRESETS: BouquetPreset[] = [
  {
    id: "classic_romance",
    name: "Classic Romance",
    description: "Red roses, blushing peonies and soft eucalyptus wrapped in burgundy silk.",
    flowers: ["rose", "rose", "rose", "rose", "rose", "peony", "peony", "carnation", "ranunculus", "ranunculus"],
    foliage: ["eucalyptus", "eucalyptus", "babys_breath"],
    wrapper: "cream_paper",
    ribbon: "silk_burgundy",
  },
  {
    id: "spring_morning",
    name: "Spring Morning",
    description: "Tulips, daisies and ranunculus with fresh fern in cream paper.",
    flowers: ["tulip", "tulip", "tulip", "daisy", "daisy", "daisy", "ranunculus", "ranunculus", "anemone"],
    foliage: ["fern", "fern", "babys_breath"],
    wrapper: "cream_paper",
    ribbon: "satin_pink",
  },
  {
    id: "golden_sunshine",
    name: "Golden Sunshine",
    description: "Sunflowers and zinnias in rustic kraft paper.",
    flowers: ["sunflower", "sunflower", "sunflower", "zinnia", "zinnia", "zinnia", "daisy", "daisy", "dahlia"],
    foliage: ["eucalyptus", "fern"],
    wrapper: "kraft_paper",
    ribbon: "double_gold",
  },
  {
    id: "soft_love",
    name: "Soft Love",
    description: "Pink roses and peonies with baby's breath in blush ribbon.",
    flowers: ["rose", "rose", "rose", "rose", "peony", "peony", "ranunculus", "ranunculus", "anemone"],
    foliage: ["eucalyptus", "babys_breath", "babys_breath"],
    wrapper: "soft_pink_paper",
    ribbon: "satin_pink",
  },
  {
    id: "elegant_white",
    name: "Elegant White",
    description: "Lilies, orchids and daisies with eucalyptus, cream wrapper.",
    flowers: ["lily", "lily", "lily", "orchid", "orchid", "daisy", "daisy", "ranunculus", "peony"],
    foliage: ["eucalyptus", "eucalyptus", "babys_breath"],
    wrapper: "white_paper",
    ribbon: "silk_white",
  },
  {
    id: "pastel_dream",
    name: "Pastel Dream",
    description: "Ranunculus, anemones and dahlias in a soft palette.",
    flowers: ["ranunculus", "ranunculus", "anemone", "anemone", "dahlia", "dahlia", "peony", "peony", "carnation"],
    foliage: ["eucalyptus", "babys_breath", "babys_breath"],
    wrapper: "soft_pink_paper",
    ribbon: "silk_lavender",
  },
];

export function getPreset(id: string) {
  return PRESETS.find((p) => p.id === id);
}