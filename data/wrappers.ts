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
  // --- Extra realistic wrapper options (still share-link safe, IDs stable) ---
  { id: "ivory_folded", name: "Folded Ivory", colors: { base: "#f2e9d8", shadow: "#d3c2a1", highlight: "#fffbf2" }, texture: "smooth" },
  { id: "buttercream", name: "Buttercream", colors: { base: "#f6e6c8", shadow: "#e0c594", highlight: "#fff7e4" }, texture: "smooth" },
  { id: "dusty_rose_wrap", name: "Dusty Rose Wrap", colors: { base: "#e5c2c8", shadow: "#c89aa3", highlight: "#f9e9ec" }, texture: "smooth" },
  { id: "lavender_wrap", name: "Lavender Wrap", colors: { base: "#dccfe6", shadow: "#b9a3ca", highlight: "#f1ebf7" }, texture: "smooth" },
  { id: "celadon_wrap", name: "Celadon Wrap", colors: { base: "#d6e4d8", shadow: "#aec7b1", highlight: "#f0f7f0" }, texture: "smooth" },
  { id: "champagne_satin", name: "Champagne Satin", colors: { base: "#e9dcc3", shadow: "#cbb591", highlight: "#faf2e1" }, texture: "smooth" },
  { id: "pearl_wrap", name: "Pearl Wraps", colors: { base: "#f2f0ea", shadow: "#d5d0c3", highlight: "#ffffff" }, texture: "smooth" },
  { id: "kraft_brown", name: "Brown Kraft", colors: { base: "#c59b6b", shadow: "#9c7446", highlight: "#dbb78c" }, texture: "kraft" },
  { id: "linen_oats", name: "Linen Oats", colors: { base: "#e5dbc2", shadow: "#c4b492", highlight: "#f7efe0" }, texture: "kraft" },
  { id: "brown_wax", name: "Waxed Brown", colors: { base: "#c8a87a", shadow: "#a17e53", highlight: "#e2c69c" }, texture: "textured" },
  { id: "charcoal_fold", name: "Charcoal Fold", colors: { base: "#3a352f", shadow: "#1d1a16", highlight: "#564e45" }, texture: "textured" },
  { id: "burgundy_velvet", name: "Velvet Burgundy", colors: { base: "#661f2c", shadow: "#3f1119", highlight: "#833140" }, texture: "textured" },
  { id: "forest_paper", name: "Forest Paper", colors: { base: "#2f4137", shadow: "#1a2820", highlight: "#465f51" }, texture: "textured" },
  { id: "newsprint", name: "Newsprint", colors: { base: "#e9e4d5", shadow: "#c9c2af", highlight: "#f9f5ea" }, texture: "vintage" },
  { id: "green_foil", name: "Green Foil", colors: { base: "#a8c9a0", shadow: "#7fa476", highlight: "#d2e6cb" }, texture: "smooth" },
];

const WRAPPER_CHOICE_IDS = [
  "white_paper",
  "soft_pink_paper",
  "buttercream",
  "sage_paper",
  "matte_black_paper",
  "kraft_paper",
];

export const WRAPPER_CHOICES = WRAPPER_CHOICE_IDS
  .map((id) => WRAPPERS.find((w) => w.id === id))
  .filter((w): w is WrapperDef => Boolean(w));

export function getWrapper(id: string) {
  return WRAPPERS.find((w) => w.id === id) ?? WRAPPERS[0];
}
