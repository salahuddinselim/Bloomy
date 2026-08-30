export interface BackgroundDef {
  id: string;
  name: string;
  from: string;
  to: string;
}

export const BACKGROUNDS: BackgroundDef[] = [
  { id: "warm_ivory", name: "Warm Ivory", from: "#faf6ef", to: "#efe4cf" },
  { id: "soft_blush", name: "Soft Blush", from: "#f7e9e6", to: "#eecdc7" },
  { id: "sage_mist", name: "Sage Mist", from: "#eef1e6", to: "#d7dfc6" },
  { id: "charcoal_dusk", name: "Charcoal Dusk", from: "#332e2a", to: "#1c1815" },
  { id: "cream_linen", name: "Cream Linen", from: "#f4ede0", to: "#e2d3b6" },
];

export function getBackground(id: string) {
  return BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
}
