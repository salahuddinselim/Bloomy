export interface QuoteCategory {
  id: string;
  label: string;
  heading: string;
  intro: string;
  quotes: string[];
}

/*
 * Card message library for the /quotes page. Written in Bloomly's voice —
 * short lines that fit a 4-inch note card and read as warmth, not platitude.
 */
export const QUOTE_CATEGORIES: QuoteCategory[] = [
  {
    id: "love",
    label: "Love",
    heading: "Love Quotes",
    intro: "For the bouquet that should feel tender, intimate, and easy to send.",
    quotes: [
      "You make ordinary days feel softer.",
      "A little bouquet for the part of my heart that is always thinking of you.",
      "I fell for you slowly, and then all at once.",
      "Wherever I am, my heart is leaning toward you.",
      "Loving you is the easiest thing I do all day.",
      "I keep finding new reasons to choose you.",
      "My favorite place is the one you're in.",
      "You are my favorite thought, every single day.",
      "Some things words can't carry — so here are flowers instead.",
      "This is just a small way of saying I'm glad you exist.",
      "You feel like home, and I never want to leave.",
      "Every petal here spells out what I keep meaning to say.",
    ],
  },
  {
    id: "birthday",
    label: "Birthday",
    heading: "Birthday Quotes",
    intro: "Bright, personal notes that add warmth without sounding like a greeting card.",
    quotes: [
      "Wishing you a day that feels as bright as these flowers.",
      "May this year bring you softer mornings, louder laughter, and more reasons to bloom.",
      "Another year of you — the world's luckiest coincidence.",
      "Here's to a birthday that's as unfinished-ly lovely as you are.",
      "I hope this year is gentle with you, and loud with joy.",
      "You deserve a whole garden of good days.",
      "Happy birthday to the person who makes everyone around them grow.",
      "One more candle, one more reason to celebrate your stubborn kindness.",
      "May you always have people who send you flowers for no reason at all.",
      "You were my favorite thing about this year.",
      "Birthdays are just your annual reminder that you're spectacular.",
      "Grown a little, still as warm as ever. Happy birthday.",
    ],
  },
  {
    id: "thank_you",
    label: "Thank You",
    heading: "Thank You Quotes",
    intro: "Gratitude that feels specific without becoming stiff or formal.",
    quotes: [
      "Thank you for showing up in a way I will not forget.",
      "This bouquet is a small return for a kindness that meant a lot.",
      "You helped when it mattered, and I haven't stopped feeling it.",
      "Thank you — no one else would have done this the way you did.",
      "You turned a hard week into a bearable one. Thank you.",
      "I don't have the words, so the flowers will try.",
      "Your kindness is still warming my heart. Thank you.",
      "Thank you for staying when it would have been easier not to.",
      "I noticed everything you did. This is a small thank-you.",
      "You gave freely, gently, and exactly when it counted.",
      "Some thanks feel too small — this one comes with petals.",
      "Thank you for being steady when I needed steady.",
    ],
  },
  {
    id: "miss_you",
    label: "Miss You",
    heading: "Miss You Quotes",
    intro: "Notes that feel close without making the distance any heavier.",
    quotes: [
      "I miss you in the small moments most.",
      "Here is a little bouquet for the space where I wish you were.",
      "The distance is long, but my thoughts of you are longer.",
      "I keep mentally handing you flowers across the miles.",
      "Missing you is quiet, but it happens all day.",
      "Send this back to me when you miss me too.",
      "I was just somewhere beautiful and wished you were beside me.",
      "The map between us is the only blank I can't fill.",
      "You feel closer today — this bouquet traveled the distance for me.",
      "Half the fun of anything is telling you about it. Hurry back.",
      "I'm counting the days until you're on this side of the miles.",
      "Absence, it turns out, is full of you.",
    ],
  },
  {
    id: "encouragement",
    label: "Encouragement",
    heading: "Encouragement Quotes",
    intro: "Steady, quiet reminders for hard weeks, new starts, and anxious mornings.",
    quotes: [
      "You do not have to bloom all at once.",
      "I hope this bouquet reminds you that small steps still count.",
      "Rest is part of growing — even flowers lean toward the light slowly.",
      "You have weathered everything so far. This too.",
      "Be as patient with yourself as you are with everyone else.",
      "You are not behind. You are exactly where you need to be.",
      "The good days are still growing, I promise.",
      "One flower at a time, you are building something whole.",
      "It's okay to be a work in progress — the garden is too.",
      "Keep going. The bloom is closer than it feels.",
      "You've survived your hardest days with a little grace to spare.",
      "Sunlight, water, time — and you. You are enough.",
    ],
  },
  {
    id: "friendship",
    label: "Friendship",
    heading: "Friendship Quotes",
    intro: "Easy, true, un-overworked notes for the friend who matters.",
    quotes: [
      "Life feels brighter with you in it.",
      "A little bouquet for the friend who makes ordinary days better.",
      "You're the person I laugh the easiest around — here, have proof.",
      "Friends like you are the quiet reason life is good.",
      "This flower is grateful to grow next to you.",
      "For every call, every coffee, every inside joke — thank you.",
      "You bring your own sunshine, but take these blooms anyway.",
      "Some people are easy to love. You're one of them.",
      "A bouquet for the friend who always shows up.",
      "Here's a small decoration for your day, from your favorite person.",
      "You make the unfunny parts of life funny. That's a gift.",
      "Distance, time, noise — nothing has ever dulled this.",
    ],
  },
];

export function getQuoteCategory(id: string) {
  return QUOTE_CATEGORIES.find((c) => c.id === id);
}