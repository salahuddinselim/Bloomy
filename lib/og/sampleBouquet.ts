import type { Bouquet, BouquetElement } from "@/lib/bouquet/types";

/**
 * The bouquet shown on the site-wide social card (`/og`) and as the fallback
 * for unreadable tokens. Classic romance: burgundy roses, peony, baby's breath
 * and eucalyptus.
 */
export function sampleBouquet(): Bouquet {
  const el = (
    id: string,
    type: string,
    category: BouquetElement["category"],
    x: number,
    y: number,
    scale: number,
    rotation: number,
    z: number
  ): BouquetElement => ({ id, type, category, x, y, scale, rotation, z });

  const foliage: BouquetElement[] = [
    el("f1", "eucalyptus", "foliage", 38, 56, 1.3, -28, 1),
    el("f2", "eucalyptus", "foliage", 62, 52, 1.25, 24, 2),
    el("f3", "babys_breath", "foliage", 50, 42, 1.1, 0, 3),
  ];
  const blooms: BouquetElement[] = [
    el("c1", "carnation", "flower", 30, 44, 0.9, -10, 4),
    el("r1", "rose", "flower", 50, 58, 1.05, 0, 5),
    el("p1", "peony", "flower", 68, 46, 1.1, 10, 6),
    el("r2", "rose", "flower", 50, 40, 0.95, -5, 7),
  ];

  return {
    version: 1,
    recipient: "a very special person",
    sender: "a secret admirer",
    message: "Some flowers fade, but what I feel for you never will.",
    elements: [...foliage, ...blooms],
    wrapper: "cream_paper",
    ribbon: "silk_burgundy",
    background: "warm_ivory",
    revealStyle: "gift_box",
    mono: false,
    cardPaper: "paper",
  };
}