import type { AssetDef } from "@/lib/bouquet/types";

export const DECORATIONS: AssetDef[] = [
  { id: "pearl_pin", name: "Pearl Pin", category: "decoration", shape: "pearl_pin", colors: { primary: "#f5f0e6", secondary: "#d9cba8" }, defaultScale: 0.5, defaultRotation: 0, tags: ["accent"], layerHint: 6 },
  { id: "wax_seal", name: "Wax Seal", category: "decoration", shape: "wax_seal", colors: { primary: "#8c1f2e", secondary: "#5c1220" }, defaultScale: 0.5, defaultRotation: 0, tags: ["accent"], layerHint: 6 },
  { id: "twine", name: "Twine", category: "decoration", shape: "twine", colors: { primary: "#b89a6b", secondary: "#8f7650" }, defaultScale: 0.7, defaultRotation: 0, tags: ["rustic"], layerHint: 6 },
  { id: "berry_sprig", name: "Berry Sprig", category: "decoration", shape: "berry_sprig", colors: { primary: "#8c1f2e", secondary: "#4a6640" }, defaultScale: 0.7, defaultRotation: 0, tags: ["winter"], layerHint: 5 },
  { id: "bow", name: "Bow", category: "decoration", shape: "bow", colors: { primary: "#a3202f", secondary: "#6b1f2a" }, defaultScale: 0.55, defaultRotation: 0, tags: ["accent"], layerHint: 6 },
  { id: "gold_charm", name: "Gold Charm", category: "decoration", shape: "gold_charm", colors: { primary: "#c9a04a", secondary: "#8f7024" }, defaultScale: 0.45, defaultRotation: 0, tags: ["accent"], layerHint: 6 },
  { id: "butterfly", name: "Butterfly", category: "decoration", shape: "butterfly", colors: { primary: "#c58bd1", secondary: "#8c5b9e" }, defaultScale: 0.55, defaultRotation: 0, tags: ["whimsical"], layerHint: 6 },
  { id: "dried_lavender", name: "Dried Lavender", category: "decoration", shape: "dried_lavender", colors: { primary: "#8a7cc4", secondary: "#6a5aa8" }, defaultScale: 0.65, defaultRotation: 0, tags: ["rustic"], layerHint: 5 },
];

export function getDecoration(id: string) {
  return DECORATIONS.find((d) => d.id === id);
}
