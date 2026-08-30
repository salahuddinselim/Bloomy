import type { Bouquet, BouquetElement } from "@/lib/bouquet/types";

/**
 * The bouquet shown on the site-wide social card (`/og`) and as the fallback
 * for unreadable tokens. Mirrors the "classic romance" preset: red roses,
 * baby's breath and eucalyptus.
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
    el("f1", "eucalyptus", "foliage", 38, 56, 1.15, -28, 1),
    el("f2", "eucalyptus", "foliage", 62, 52, 1.1, 24, 2),
    el("f3", "eucalyptus", "foliage", 50, 40, 1.05, 0, 3),
  ];
  const fillers: BouquetElement[] = [
    el("g1", "babys_breath", "flower", 26, 42, 0.85, 0, 4),
    el("g2", "babys_breath", "flower", 74, 44, 0.85, 0, 5),
    el("g3", "babys_breath", "flower", 50, 30, 0.85, 0, 6),
  ];
  const roses: BouquetElement[] = [
    el("r1", "rose_red", "flower", 50, 62, 1.1, 0, 7),
    el("r2", "rose_red", "flower", 35, 50, 1.0, -12, 8),
    el("r3", "rose_red", "flower", 65, 48, 1.0, 12, 9),
  ];

  return {
    version: 1,
    recipient: "a very special person",
    sender: "a secret admirer",
    message: "Some flowers fade, but what I feel for you never will.",
    elements: [...foliage, ...fillers, ...roses],
    wrapper: "cream_paper",
    ribbon: "silk_burgundy",
    background: "warm_ivory",
    revealStyle: "gift_box",
  };
}