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
    flowers: ["rose", "rose", "rose", "peony", "peony"],
    foliage: ["eucalyptus", "eucalyptus"],
    wrapper: "cream_paper",
    ribbon: "silk_burgundy",
  },
  {
    id: "spring_morning",
    name: "Spring Morning",
    description: "Tulips, daisies and ranunculus with fresh fern in cream paper.",
    flowers: ["tulip", "tulip", "daisy", "daisy", "ranunculus"],
    foliage: ["fern", "eucalyptus"],
    wrapper: "cream_paper",
    ribbon: "satin_pink",
  },
  {
    id: "golden_sunshine",
    name: "Golden Sunshine",
    description: "Sunflowers and zinnias in rustic kraft paper.",
    flowers: ["sunflower", "sunflower", "zinnia", "zinnia", "daisy"],
    foliage: ["eucalyptus", "fern"],
    wrapper: "kraft_paper",
    ribbon: "double_gold",
  },
  {
    id: "soft_love",
    name: "Soft Love",
    description: "Pink roses and peonies with baby's breath in blush ribbon.",
    flowers: ["rose", "rose", "peony", "ranunculus", "ranunculus"],
    foliage: ["eucalyptus", "babys_breath"],
    wrapper: "soft_pink_paper",
    ribbon: "satin_pink",
  },
  {
    id: "elegant_white",
    name: "Elegant White",
    description: "Lilies, orchids and daisies with eucalyptus, cream wrapper.",
    flowers: ["lily", "lily", "orchid", "daisy", "daisy"],
    foliage: ["eucalyptus", "fern"],
    wrapper: "white_paper",
    ribbon: "silk_white",
  },
  {
    id: "pastel_dream",
    name: "Pastel Dream",
    description: "Ranunculus, anemones and dahlias in a soft palette.",
    flowers: ["ranunculus", "ranunculus", "anemone", "dahlia", "peony"],
    foliage: ["eucalyptus", "babys_breath"],
    wrapper: "soft_pink_paper",
    ribbon: "silk_lavender",
  },
];

export function getPreset(id: string) {
  return PRESETS.find((p) => p.id === id);
}