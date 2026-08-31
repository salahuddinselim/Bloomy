import type { WrapperDef } from "@/lib/bouquet/types";

export const WRAPPERS: WrapperDef[] = [
  { id: "cream_paper", name: "Cream Paper", colors: { base: "#f3ead9", shadow: "#dccbaa", highlight: "#fffaf0" }, texture: "smooth" },
  { id: "kraft_paper", name: "Kraft Paper", colors: { base: "#c9a877", shadow: "#a5824f", highlight: "#e0c396" }, texture: "kraft" },
  { id: "white_paper", name: "White Paper", colors: { base: "#faf8f3", shadow: "#e2ddd0", highlight: "#ffffff" }, texture: "smooth" },
  { id: "soft_pink_paper", name: "Soft Pink Paper", colors: { base: "#f0d3d9", shadow: "#dbb0b9", highlight: "#fbeef1" }, texture: "smooth" },
  { id: "burgundy_paper", name: "Burgundy Paper", colors: { base: "#5c1f2c", shadow: "#3d1119", highlight: "#7a2c3c" }, texture: "textured" },
  { id: "matte_black_paper", name: "Matte Black", colors: { base: "#2b2622", shadow: "#161311", highlight: "#433c35" }, texture: "textured" },
  { id: "transparent_wrap", name: "Transparent Wrap", colors: { base: "#f5f3ee", shadow: "#e6e2d6", highlight: "#ffffff" }, texture: "sheer" },
  { id: "vintage_paper", name: "Vintage Print", colors: { base: "#ddd3bd", shadow: "#bfb090", highlight: "#efe8d6" }, texture: "vintage" },
  { id: "sage_paper", name: "Sage Paper", colors: { base: "#dbe3d2", shadow: "#b9c4ac", highlight: "#eef2e6" }, texture: "smooth" },
  { id: "navy_paper", name: "Navy Paper", colors: { base: "#26344a", shadow: "#141d2c", highlight: "#3c4f6b" }, texture: "textured" },
  { id: "linen_natural", name: "Natural Linen", colors: { base: "#e8ddc7", shadow: "#c9b998", highlight: "#f5eeda" }, texture: "kraft" },
  { id: "gold_foil_wrap", name: "Gold Foil", colors: { base: "#d9b872", shadow: "#b3924f", highlight: "#f0dca0" }, texture: "smooth" },
];

export function getWrapper(id: string) {
  return WRAPPERS.find((w) => w.id === id) ?? WRAPPERS[0];
}
