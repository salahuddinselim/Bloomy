import type { CardPaper } from "@/lib/bouquet/types";

export interface CardPaperDef {
  id: CardPaper;
  name: string;
  surface: string;
  ink: string;
  inkSoft: string;
  note: string;
}

/*
 * The paper stock the written note sits on, both on the reveal page and on the
 * social card. Each defines the note's background (surface), the ink colors for
 * its text, and a one-line description for the editor picker.
 */
export const CARD_PAPERS: CardPaperDef[] = [
  { id: "paper", name: "Paper", surface: "#faf6ef", ink: "#332e2a", inkSoft: "rgba(60,50,40,0.85)", note: "The classic keepsake" },
  { id: "parchment", name: "Parchment", surface: "#f2e8d2", ink: "#4a3d2c", inkSoft: "rgba(74,61,44,0.82)", note: "Aged and lettered" },
  { id: "ivory", name: "Ivory", surface: "#f5f1e8", ink: "#3a352e", inkSoft: "rgba(58,53,46,0.82)", note: "Cool, gallery-white" },
  { id: "blush", name: "Blush", surface: "#fbeeea", ink: "#5b3a3a", inkSoft: "rgba(91,58,58,0.8)", note: "A soft rose tint" },
];

export function getCardPaper(id: string): CardPaperDef {
  return CARD_PAPERS.find((c) => c.id === id) ?? CARD_PAPERS[0];
}