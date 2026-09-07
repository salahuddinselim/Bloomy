export interface RecipientType {
  id: string;
  emoji: string;
  label: string;
  description: string;
}

export const RECIPIENT_TYPES: RecipientType[] = [
  {
    id: "partner",
    emoji: "\u{1F491}",
    label: "Partner",
    description: "Your significant other",
  },
  {
    id: "best_friend",
    emoji: "\u{1F91D}",
    label: "Best Friend",
    description: "Your ride-or-die",
  },
  {
    id: "family",
    emoji: "\u{1F3E0}",
    label: "Family",
    description: "Mom, Dad, sibling, or someone who feels like home",
  },
  {
    id: "classmate",
    emoji: "\u{1F393}",
    label: "Classmate",
    description: "Someone from school or university",
  },
  {
    id: "colleague",
    emoji: "\u{1F4BC}",
    label: "Colleague",
    description: "A work friend or mentor",
  },
  {
    id: "someone_special",
    emoji: "\u2B50",
    label: "Someone Special",
    description: "Someone who deserves something beautiful",
  },
];

export function getRecipientType(id: string): RecipientType | undefined {
  return RECIPIENT_TYPES.find((r) => r.id === id);
}
