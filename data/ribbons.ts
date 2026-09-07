import type { RibbonDef } from "@/lib/bouquet/types";

export const RIBBONS: RibbonDef[] = [
  { id: "silk_burgundy", name: "Silk Burgundy", color: "#6b1f2a", finish: "silk" },
  { id: "satin_red", name: "Satin Red", color: "#a3202f", finish: "satin" },
  { id: "satin_pink", name: "Satin Pink", color: "#dd9fb0", finish: "satin" },
  { id: "velvet_cream", name: "Velvet Cream", color: "#e9dcbf", finish: "velvet" },
  { id: "silk_white", name: "Silk White", color: "#f7f4ec", finish: "silk" },
  { id: "thin_black", name: "Thin Black", color: "#221f1c", finish: "thin" },
  { id: "double_gold", name: "Double Gold", color: "#b08d57", finish: "double" },
  { id: "silk_lavender", name: "Silk Lavender", color: "#a08cc0", finish: "silk" },
  { id: "satin_ivory", name: "Satin Ivory", color: "#f2ead8", finish: "satin" },
  { id: "thin_sage", name: "Thin Sage", color: "#7c8f6a", finish: "thin" },
  { id: "velvet_navy", name: "Velvet Navy", color: "#22304a", finish: "velvet" },
  { id: "silk_gold", name: "Silk Gold", color: "#c9a04a", finish: "silk" },
  // --- Extra ribbon options (finish drives the 3D render; IDs stable) ---
  { id: "silk_rose", name: "Silk Rose", color: "#d96a78", finish: "silk" },
  { id: "satin_champagne", name: "Satin Champagne", color: "#e3cfae", finish: "satin" },
  { id: "satin_blush", name: "Satin Blush", color: "#f4cdd2", finish: "satin" },
  { id: "silk_peach", name: "Silk Peach", color: "#f0b184", finish: "silk" },
  { id: "velvet_emerald", name: "Velvet Emerald", color: "#1f5a3c", finish: "velvet" },
  { id: "velvet_terracotta", name: "Velvet Terracotta", color: "#b25a3a", finish: "velvet" },
  { id: "thin_cream", name: "Thin Cream", color: "#efe5cf", finish: "thin" },
  { id: "double_burgundy", name: "Double Burgundy", color: "#6b1f2a", finish: "double" },
  { id: "satin_sky", name: "Satin Sky", color: "#9fc2dd", finish: "satin" },
  { id: "silk_charcoal", name: "Silk Charcoal", color: "#3a3632", finish: "silk" },
  { id: "thin_gold", name: "Thin Gold", color: "#c9a04a", finish: "thin" },
  { id: "velvet_plum", name: "Velvet Plum", color: "#6a3a6a", finish: "velvet" },
];

const RIBBON_CHOICE_IDS = [
  "silk_white",
  "satin_blush",
  "satin_champagne",
  "thin_sage",
  "silk_burgundy",
  "satin_red",
];

export const RIBBON_CHOICES = RIBBON_CHOICE_IDS
  .map((id) => RIBBONS.find((r) => r.id === id))
  .filter((r): r is RibbonDef => Boolean(r));

export function getRibbon(id: string) {
  return RIBBONS.find((r) => r.id === id) ?? RIBBONS[0];
}
