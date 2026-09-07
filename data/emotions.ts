export interface Emotion {
  id: string;
  emoji: string;
  label: string;
  description: string;
  suggestedFlowers: string[];
  gradient: string;
}

export const EMOTIONS: Emotion[] = [
  {
    id: "love",
    emoji: "\u{1F497}",
    label: "I Love You",
    description: "Deep affection and devotion",
    suggestedFlowers: ["rose", "peony", "ranunculus", "tulip"],
    gradient: "from-pink-100 to-rose-50",
  },
  {
    id: "miss_you",
    emoji: "\u{1F97A}",
    label: "I Miss You",
    description: "Longing and remembrance",
    suggestedFlowers: ["rose", "lavender", "lily", "orchid"],
    gradient: "from-purple-100 to-violet-50",
  },
  {
    id: "thank_you",
    emoji: "\u{1FAC0}",
    label: "Thank You",
    description: "Gratitude and appreciation",
    suggestedFlowers: ["sunflower", "daisy", "tulip", "carnation"],
    gradient: "from-amber-100 to-orange-50",
  },
  {
    id: "proud",
    emoji: "\u{1F33B}",
    label: "I'm Proud of You",
    description: "Celebrating achievements",
    suggestedFlowers: ["sunflower", "dahlia", "zinnia", "rose"],
    gradient: "from-yellow-100 to-amber-50",
  },
  {
    id: "birthday",
    emoji: "\u{1F382}",
    label: "Happy Birthday",
    description: "Celebrating another year of you",
    suggestedFlowers: ["rose", "peony", "dahlia", "ranunculus"],
    gradient: "from-pink-100 to-purple-50",
  },
  {
    id: "sorry",
    emoji: "\u{1F327}\uFE0F",
    label: "I'm Sorry",
    description: "An apology from the heart",
    suggestedFlowers: ["white_rose", "lily", "peony", "orchid"],
    gradient: "from-slate-100 to-gray-50",
  },
  {
    id: "just_because",
    emoji: "\u2728",
    label: "Just Because",
    description: "No reason needed",
    suggestedFlowers: ["ranunculus", "anemone", "daisy", "tulip"],
    gradient: "from-indigo-100 to-blue-50",
  },
  {
    id: "get_well",
    emoji: "\u{1F33C}",
    label: "Get Well Soon",
    description: "Wishing for recovery",
    suggestedFlowers: ["daisy", "sunflower", "tulip", "lily"],
    gradient: "from-green-100 to-emerald-50",
  },
];

export function getEmotion(id: string): Emotion | undefined {
  return EMOTIONS.find((e) => e.id === id);
}
