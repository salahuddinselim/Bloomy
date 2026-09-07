export interface PresentationTheme {
  id: string;
  emoji: string;
  label: string;
  description: string;
  bgGradient: string;
  ambientColor: string;
  particleType: "petals" | "sparkles" | "rain" | "fireflies" | "sakura" | "snow";
}

export const PRESENTATIONS: PresentationTheme[] = [
  {
    id: "rainy_evening",
    emoji: "\u{1F327}\uFE0F",
    label: "Rainy Evening",
    description: "Cozy and intimate, with soft rain outside",
    bgGradient: "linear-gradient(180deg, #4a5568 0%, #2d3748 40%, #1a202c 100%)",
    ambientColor: "rgba(100, 140, 180, 0.3)",
    particleType: "rain",
  },
  {
    id: "under_the_moon",
    emoji: "\u{1F319}",
    label: "Under the Moon",
    description: "Romantic moonlit garden",
    bgGradient: "linear-gradient(180deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)",
    ambientColor: "rgba(199, 210, 254, 0.2)",
    particleType: "sparkles",
  },
  {
    id: "fairy_lights",
    emoji: "\u2728",
    label: "Fairy Lights",
    description: "Warm and magical with twinkling lights",
    bgGradient: "linear-gradient(180deg, #1c1917 0%, #292524 40%, #44403c 100%)",
    ambientColor: "rgba(251, 191, 36, 0.25)",
    particleType: "fireflies",
  },
  {
    id: "spring_garden",
    emoji: "\u{1F338}",
    label: "Spring Garden",
    description: "Fresh blossoms in morning light",
    bgGradient: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 40%, #bbf7d0 100%)",
    ambientColor: "rgba(34, 197, 94, 0.15)",
    particleType: "sakura",
  },
  {
    id: "candlelight",
    emoji: "\u{1F56F}\uFE0F",
    label: "Candlelight",
    description: "Warm, golden, and intimate",
    bgGradient: "linear-gradient(180deg, #451a03 0%, #78350f 40%, #92400e 100%)",
    ambientColor: "rgba(251, 191, 36, 0.3)",
    particleType: "sparkles",
  },
  {
    id: "dreamy_clouds",
    emoji: "\u2601\uFE0F",
    label: "Dreamy Clouds",
    description: "Floating among the softest clouds",
    bgGradient: "linear-gradient(180deg, #e0e7ff 0%, #c7d2fe 40%, #ddd6fe 100%)",
    ambientColor: "rgba(167, 139, 250, 0.2)",
    particleType: "petals",
  },
];

export function getPresentation(id: string): PresentationTheme | undefined {
  return PRESENTATIONS.find((p) => p.id === id);
}
