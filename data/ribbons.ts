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
];

export function getRibbon(id: string) {
  return RIBBONS.find((r) => r.id === id) ?? RIBBONS[0];
}
