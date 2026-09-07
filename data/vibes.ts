export interface Vibe {
  id: string;
  emoji: string;
  label: string;
  description: string;
  palette: string[];
  suggestedWrappers: string[];
  suggestedRibbons: string[];
  bgGradient: string;
}

export const VIBES: Vibe[] = [
  {
    id: "soft_sweet",
    emoji: "\u{1F338}",
    label: "Soft & Sweet",
    description: "Gentle, tender, and full of warmth",
    palette: ["#f8c8d8", "#f4a9c0", "#e8b4c8", "#fce4ec"],
    suggestedWrappers: ["blush_paper", "cream_paper"],
    suggestedRibbons: ["silk_burgundy", "satin_pink"],
    bgGradient: "from-pink-50 to-rose-50",
  },
  {
    id: "romantic",
    emoji: "\u{1F495}",
    label: "Romantic",
    description: "Deep, passionate, and timeless",
    palette: ["#b82e3c", "#8c1f2e", "#d4748a", "#f4a9c0"],
    suggestedWrappers: ["cream_paper", "luxury_black"],
    suggestedRibbons: ["silk_burgundy", "velvet_burgundy"],
    bgGradient: "from-rose-100 to-red-50",
  },
  {
    id: "happy_bright",
    emoji: "\u{1F33B}",
    label: "Happy & Bright",
    description: "Cheerful, vibrant, and full of life",
    palette: ["#f4c542", "#f4a942", "#e87461", "#f472b6"],
    suggestedWrappers: ["cream_paper", "kraft"],
    suggestedRibbons: ["satin_gold", "thin_natural"],
    bgGradient: "from-yellow-50 to-orange-50",
  },
  {
    id: "calm_elegant",
    emoji: "\u{1F33F}",
    label: "Calm & Elegant",
    description: "Refined, peaceful, and understated",
    palette: ["#8a9a7e", "#5f6f52", "#c9d4c0", "#e8e0d4"],
    suggestedWrappers: ["white_paper", "cream_paper"],
    suggestedRibbons: ["satin_sage", "thin_natural"],
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    id: "dreamy",
    emoji: "\u{1F319}",
    label: "Dreamy",
    description: "Ethereal, whimsical, and enchanting",
    palette: ["#c4a8d4", "#9b8bb8", "#e0d4f0", "#d4c8e8"],
    suggestedWrappers: ["blush_paper", "transparent_wrap"],
    suggestedRibbons: ["silk_lavender", "satin_pink"],
    bgGradient: "from-purple-50 to-violet-50",
  },
  {
    id: "dark_mysterious",
    emoji: "\u{1F576}\uFE0F",
    label: "Dark & Mysterious",
    description: "Moody, dramatic, and captivating",
    palette: ["#4a1420", "#2d1b2e", "#6b1f2a", "#8c1f2e"],
    suggestedWrappers: ["luxury_black", "dark_paper"],
    suggestedRibbons: ["velvet_burgundy", "silk_black"],
    bgGradient: "from-gray-900 to-gray-800",
  },
  {
    id: "cute_playful",
    emoji: "\u{1F380}",
    label: "Cute & Playful",
    description: "Fun, lighthearted, and joyful",
    palette: ["#f9a8d4", "#f472b6", "#fbbf24", "#a78bfa"],
    suggestedWrappers: ["blush_paper", "pastel_wrap"],
    suggestedRibbons: ["satin_pink", "bow_pink"],
    bgGradient: "from-pink-50 to-amber-50",
  },
];

export function getVibe(id: string): Vibe | undefined {
  return VIBES.find((v) => v.id === id);
}
