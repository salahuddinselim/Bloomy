export interface Occasion {
  id: string;
  label: string;
  presetId: string;
  suggestedMessage: string;
}

export const OCCASIONS: Occasion[] = [
  { id: "love", label: "Love", presetId: "classic_romance", suggestedMessage: "Some flowers fade, but what I feel for you never will." },
  { id: "birthday", label: "Birthday", presetId: "golden_sunshine", suggestedMessage: "Wishing you a day as bright and lovely as you are." },
  { id: "anniversary", label: "Anniversary", presetId: "elegant_white", suggestedMessage: "Here's to us, and to every year still to come." },
  { id: "valentines", label: "Valentine's Day", presetId: "classic_romance", suggestedMessage: "You make every day feel like Valentine's Day." },
  { id: "congratulations", label: "Congratulations", presetId: "golden_sunshine", suggestedMessage: "So proud of everything you've accomplished." },
  { id: "thank_you", label: "Thank You", presetId: "spring_morning", suggestedMessage: "Thank you for being so wonderfully you." },
  { id: "friendship", label: "Friendship", presetId: "pastel_dream", suggestedMessage: "Grateful for a friend as lovely as you." },
  { id: "mothers_day", label: "Mother's Day", presetId: "soft_love", suggestedMessage: "For the woman who gave me the world." },
  { id: "just_because", label: "Just Because", presetId: "spring_morning", suggestedMessage: "No reason needed — just thinking of you." },
  { id: "apology", label: "Apology", presetId: "elegant_white", suggestedMessage: "I'm sorry, truly. Let's make it right." },
  { id: "get_well", label: "Get Well Soon", presetId: "pastel_dream", suggestedMessage: "Sending gentle thoughts for a speedy recovery." },
];

export function getOccasion(id: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.id === id);
}
