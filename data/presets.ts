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
    description: "Red roses, baby's breath, and eucalyptus wrapped in burgundy silk.",
    flowers: ["rose_red", "rose_red", "rose_red", "babys_breath", "babys_breath"],
    foliage: ["eucalyptus", "eucalyptus"],
    wrapper: "cream_paper",
    ribbon: "silk_burgundy",
  },
  {
    id: "spring_morning",
    name: "Spring Morning",
    description: "Pink tulips and daisies with fresh eucalyptus in cream paper.",
    flowers: ["tulip_pink", "tulip_pink", "daisy", "daisy", "daisy"],
    foliage: ["eucalyptus", "fern"],
    wrapper: "cream_paper",
    ribbon: "satin_pink",
  },
  {
    id: "golden_sunshine",
    name: "Golden Sunshine",
    description: "Sunflowers and white blooms in rustic kraft paper.",
    flowers: ["sunflower", "sunflower", "daisy", "daisy"],
    foliage: ["olive_branch", "fern"],
    wrapper: "kraft_paper",
    ribbon: "double_gold",
  },
  {
    id: "soft_love",
    name: "Soft Love",
    description: "Pink roses and peonies with baby's breath in blush ribbon.",
    flowers: ["rose_pink", "rose_pink", "peony", "babys_breath", "babys_breath"],
    foliage: ["eucalyptus"],
    wrapper: "soft_pink_paper",
    ribbon: "satin_pink",
  },
  {
    id: "elegant_white",
    name: "Elegant White",
    description: "White roses and lilies with eucalyptus, cream wrapper.",
    flowers: ["rose_white", "rose_white", "lily_white", "lily_white"],
    foliage: ["eucalyptus", "ruscus"],
    wrapper: "white_paper",
    ribbon: "silk_white",
  },
  {
    id: "pastel_dream",
    name: "Pastel Dream",
    description: "Peach roses, lavender, and hydrangea in a soft palette.",
    flowers: ["rose_peach", "hydrangea", "lavender", "lavender"],
    foliage: ["eucalyptus"],
    wrapper: "soft_pink_paper",
    ribbon: "silk_lavender",
  },
];

export function getPreset(id: string) {
  return PRESETS.find((p) => p.id === id);
}
