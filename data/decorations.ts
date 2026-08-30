import type { AssetDef } from "@/lib/bouquet/types";

export const DECORATIONS: AssetDef[] = [
  { id: "pearl_pin", name: "Pearl Pin", category: "decoration", shape: "pearl_pin", colors: { primary: "#f5f0e6", secondary: "#d9cba8" }, defaultScale: 0.5, defaultRotation: 0, tags: ["accent"], layerHint: 6 },
  { id: "wax_seal", name: "Wax Seal", category: "decoration", shape: "wax_seal", colors: { primary: "#8c1f2e", secondary: "#5c1220" }, defaultScale: 0.5, defaultRotation: 0, tags: ["accent"], layerHint: 6 },
  { id: "twine", name: "Twine", category: "decoration", shape: "twine", colors: { primary: "#b89a6b", secondary: "#8f7650" }, defaultScale: 0.7, defaultRotation: 0, tags: ["rustic"], layerHint: 6 },
  { id: "berry_sprig", name: "Berry Sprig", category: "decoration", shape: "berry_sprig", colors: { primary: "#8c1f2e", secondary: "#4a6640" }, defaultScale: 0.7, defaultRotation: 0, tags: ["winter"], layerHint: 5 },
];

export function getDecoration(id: string) {
  return DECORATIONS.find((d) => d.id === id);
}
