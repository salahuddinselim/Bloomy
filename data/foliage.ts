import type { AssetDef } from "@/lib/bouquet/types";

export const FOLIAGE: AssetDef[] = [
  { id: "eucalyptus", name: "Eucalyptus", category: "foliage", shape: "eucalyptus", colors: { primary: "#93a992", secondary: "#748a72" }, defaultScale: 1.1, defaultRotation: 0, tags: ["silvery", "textural"], layerHint: 1 },
  { id: "fern", name: "Fern", category: "foliage", shape: "fern", colors: { primary: "#5c7a52", secondary: "#496341" }, defaultScale: 1, defaultRotation: 0, tags: ["wild", "green"], layerHint: 1 },
  { id: "olive_branch", name: "Olive Branch", category: "foliage", shape: "olive", colors: { primary: "#8a9a6e", secondary: "#6d7f55" }, defaultScale: 1, defaultRotation: 0, tags: ["mediterranean"], layerHint: 1 },
  { id: "ruscus", name: "Ruscus", category: "foliage", shape: "ruscus", colors: { primary: "#3f5d3a", secondary: "#2e4629" }, defaultScale: 1, defaultRotation: 0, tags: ["deep green"], layerHint: 1 },
  { id: "ivy", name: "Ivy", category: "foliage", shape: "ivy", colors: { primary: "#4c6b46", secondary: "#3a5535" }, defaultScale: 0.9, defaultRotation: 0, tags: ["trailing"], layerHint: 1 },
  { id: "green_leaves", name: "Green Leaves", category: "foliage", shape: "leaf", colors: { primary: "#5f7f52", secondary: "#4a6640" }, defaultScale: 0.9, defaultRotation: 0, tags: ["simple"], layerHint: 1 },
];

export function getFoliage(id: string) {
  return FOLIAGE.find((f) => f.id === id);
}
