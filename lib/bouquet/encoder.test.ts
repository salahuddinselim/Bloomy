import { describe, expect, it } from "vitest";
import { encodeBouquet, decodeBouquet } from "./encoder";
import { createEmptyBouquet, LIMITS, type Bouquet, type BouquetElement } from "./types";
import { REALISTIC_FLOWERS } from "@/data/flowers";
import { REALISTIC_FOLIAGE } from "@/data/foliage";

function makeElement(type: string, category: BouquetElement["category"], i: number): BouquetElement {
  return {
    id: `el_${type}_${i}_${Math.random().toString(36).slice(2, 10)}`,
    type,
    category,
    // Precision an unrounded pointer-drag actually produces.
    x: 12.345678912345 + i,
    y: 87.654321987654 - i,
    scale: 1.1234567,
    rotation: 44.987654321,
    z: i,
  };
}

function makeBouquet(flowerCount: number, foliageCount: number, message: string): Bouquet {
  const flowerTypes = REALISTIC_FLOWERS.map((f) => f.id);
  const foliageTypes = REALISTIC_FOLIAGE.map((f) => f.id);
  const elements: BouquetElement[] = [
    ...Array.from({ length: flowerCount }, (_, i) => makeElement(flowerTypes[i % flowerTypes.length], "flower", i)),
    ...Array.from({ length: foliageCount }, (_, i) => makeElement(foliageTypes[i % foliageTypes.length], "foliage", i)),
  ];
  return {
    ...createEmptyBouquet(),
    elements,
    recipient: "Emma",
    sender: "James",
    message,
  };
}

describe("encodeBouquet size", () => {
  it("shortens a small bouquet's token vs. naive JSON+compress of the raw shape", () => {
    const bouquet = makeBouquet(3, 0, "");
    const tightened = encodeBouquet(bouquet);
    expect(tightened.ok).toBe(true);

    // What the previous implementation produced: full elements (id, category,
    // full-precision numbers) compressed the same way.
    const naiveJson = JSON.stringify(bouquet);
    const { compressToEncodedURIComponent } = require("lz-string");
    const naive = compressToEncodedURIComponent(naiveJson) as string;

    expect(tightened.data!.length).toBeLessThan(naive.length);
  });

  it("shortens a near-max-size bouquet substantially", () => {
    const bouquet = makeBouquet(LIMITS.MAX_FLOWERS, LIMITS.MAX_FOLIAGE, "x".repeat(LIMITS.MAX_MESSAGE));
    const tightened = encodeBouquet(bouquet);
    expect(tightened.ok).toBe(true);

    const naiveJson = JSON.stringify(bouquet);
    const { compressToEncodedURIComponent } = require("lz-string");
    const naive = compressToEncodedURIComponent(naiveJson) as string;

    expect(tightened.data!.length).toBeLessThan(naive.length);
    expect(tightened.data!.length).toBeLessThanOrEqual(LIMITS.MAX_URL_LENGTH);
  });
});

describe("encodeBouquet / decodeBouquet round-trip", () => {
  it("round-trips a small bouquet with no message", () => {
    const bouquet = makeBouquet(3, 0, "");
    const encoded = encodeBouquet(bouquet);
    expect(encoded.ok).toBe(true);

    const decoded = decodeBouquet(encoded.data!);
    expect(decoded.ok).toBe(true);
    expect(decoded.bouquet!.elements).toHaveLength(3);
    expect(decoded.bouquet!.recipient).toBe("Emma");
    expect(decoded.bouquet!.sender).toBe("James");
    // Category is re-derived from the canonical asset def, not carried on
    // the wire — confirm it still comes back correct despite being dropped.
    for (const el of decoded.bouquet!.elements) {
      expect(el.category).toBe("flower");
      expect(typeof el.id).toBe("string");
      expect(el.id.length).toBeGreaterThan(0);
    }
  });

  it("round-trips a near-max-size bouquet and preserves visual precision", () => {
    const bouquet = makeBouquet(LIMITS.MAX_FLOWERS, LIMITS.MAX_FOLIAGE, "A heartfelt message.".repeat(10).slice(0, LIMITS.MAX_MESSAGE));
    const encoded = encodeBouquet(bouquet);
    expect(encoded.ok).toBe(true);

    const decoded = decodeBouquet(encoded.data!);
    expect(decoded.ok).toBe(true);
    expect(decoded.bouquet!.elements).toHaveLength(LIMITS.MAX_FLOWERS + LIMITS.MAX_FOLIAGE);
    expect(decoded.bouquet!.message.length).toBeLessThanOrEqual(LIMITS.MAX_MESSAGE);

    const firstEl = decoded.bouquet!.elements[0];
    // Position survives to within the rounding precision (2dp / whole degrees).
    expect(Math.abs(firstEl.x - bouquet.elements[0].x)).toBeLessThan(0.01);
    expect(Math.abs(firstEl.y - bouquet.elements[0].y)).toBeLessThan(0.01);
    expect(Math.abs(firstEl.rotation - bouquet.elements[0].rotation)).toBeLessThan(1);
  });

  it("still decodes an old-format link that carries id/category/full-precision numbers", () => {
    // Simulates a link generated before this change.
    const { compressToEncodedURIComponent } = require("lz-string");
    const oldShapeBouquet = makeBouquet(2, 1, "hi");
    const oldToken = compressToEncodedURIComponent(JSON.stringify(oldShapeBouquet)) as string;

    const decoded = decodeBouquet(oldToken);
    expect(decoded.ok).toBe(true);
    expect(decoded.bouquet!.elements).toHaveLength(3);
  });
});
