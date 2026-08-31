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
  { id: "kraft", name: "Kraft", surface: "#d9c6a5", ink: "#3d2e1c", inkSoft: "rgba(61,46,28,0.82)", note: "Rustic, hand-wrapped" },
  { id: "sage", name: "Sage", surface: "#e7ecdf", ink: "#3a4232", inkSoft: "rgba(58,66,50,0.82)", note: "Quiet and botanical" },
  { id: "champagne", name: "Champagne", surface: "#f3e6c8", ink: "#4d3d1f", inkSoft: "rgba(77,61,31,0.82)", note: "A touch of celebration" },
  { id: "slate", name: "Slate", surface: "#e4e5e8", ink: "#2c2f36", inkSoft: "rgba(44,47,54,0.82)", note: "Cool, modern restraint" },
];

export function getCardPaper(id: string): CardPaperDef {
  return CARD_PAPERS.find((c) => c.id === id) ?? CARD_PAPERS[0];
}