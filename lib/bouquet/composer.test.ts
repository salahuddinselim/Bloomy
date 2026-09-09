import { describe, it, expect } from "vitest";
import { elementsFromIds, DEFAULT_BOUQUET_FLOWER_IDS } from "@/lib/bouquet/build";
import { getAssetDef } from "@/components/bouquet/BouquetAsset";

describe("bouquet dome composer", () => {
  const layout = elementsFromIds(DEFAULT_BOUQUET_FLOWER_IDS);
  const flowers = layout.filter((e) => e.category === "flower");
  const apex = flowers.reduce((a, b) => (a.y < b.y ? a : b));
  const rim = flowers.filter((e) => Math.abs(e.x - 50) > 24);

  it("default bouquet matches the builder's starting list", () => {
    expect(layout).toHaveLength(DEFAULT_BOUQUET_FLOWER_IDS.length);
  });

  it("keeps every bloom head inside the canvas", () => {
    for (const el of layout) {
      expect(el.x).toBeGreaterThanOrEqual(10);
      expect(el.x).toBeLessThanOrEqual(90);
      expect(el.y).toBeGreaterThanOrEqual(40);
      expect(el.y).toBeLessThanOrEqual(80);
    }
  });

  it("forms a wide, low flat-crowned mound: apex on top, rim blooms lower, skirt blooms lower still", () => {
    expect(apex.x).toBeGreaterThanOrEqual(40);
    expect(apex.x).toBeLessThanOrEqual(60);
    expect(apex.y).toBeGreaterThanOrEqual(42);
    expect(apex.y).toBeLessThanOrEqual(47);
    for (const r of rim) expect(r.y).toBeGreaterThanOrEqual(apex.y + 4);
    // at least one bloom hangs into the skirt below the gather
    expect(flowers.some((f) => f.y >= 60)).toBe(true);
  });

  it("packed crown: at least three heads sit within a hand's-width of the apex", () => {
    const nearApex = flowers.filter((e) => e.y < apex.y + 3);
    expect(nearApex.length).toBeGreaterThanOrEqual(3);
  });

  it("hero bloom is front-most within its band", () => {
    const apexZ = apex.z - (getAssetDef(apex.type)?.layerHint ?? 0) * 10;
    for (const f of flowers) {
      const z = f.z - (getAssetDef(f.type)?.layerHint ?? 0) * 10;
      expect(apexZ).toBeGreaterThanOrEqual(z);
    }
  });

  it("greenery stays behind every flower", () => {
    for (const fol of layout.filter((e) => e.category === "foliage"))
      for (const fl of flowers) expect(fol.z).toBeLessThan(fl.z);
  });
});