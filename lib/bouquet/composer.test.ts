import { describe, it, expect } from "vitest";
import { elementsFromIds } from "@/lib/bouquet/build";
import { getAssetDef } from "@/components/bouquet/BouquetAsset";

describe("bouquet dome composer", () => {
  const layout = elementsFromIds([
    "eucalyptus",
    "eucalyptus",
    "babys_breath",
    "babys_breath",
    "rose",
    "rose",
    "rose",
    "rose",
    "rose",
    "peony",
    "peony",
    "carnation",
    "tulip",
    "ranunculus",
  ]);

  it("default bouquet produces 14 stems", () => {
    expect(layout).toHaveLength(14);
  });

  it("keeps every bloom head inside the canvas and above the cone lip", () => {
    for (const el of layout) {
      expect(el.x).toBeGreaterThanOrEqual(10);
      expect(el.x).toBeLessThanOrEqual(90);
      expect(el.y).toBeGreaterThanOrEqual(42);
      expect(el.y).toBeLessThanOrEqual(58);
    }
  });

  it("forms a dome: apex on top, every rim bloom lower than the apex", () => {
    const flowers = layout.filter((e) => e.category === "flower");
    const apex = flowers.reduce((a, b) => (a.y < b.y ? a : b));
    expect(apex.x).toBeGreaterThanOrEqual(45);
    expect(apex.x).toBeLessThanOrEqual(55);
    const rim = flowers.filter((e) => Math.abs(e.x - 50) > 24);
    for (const r of rim) expect(r.y).toBeGreaterThanOrEqual(apex.y + 4);
    expect(flowers.some((e) => e.y < 46)).toBe(true);
  });

  it("hero bloom is front-most within its band", () => {
    const flowers = layout.filter((e) => e.category === "flower");
    const apex = flowers.reduce((a, b) => (a.y < b.y ? a : b));
    const apexZ = (apex.z - (getAssetDef(apex.type)?.layerHint ?? 0) * 10);
    for (const f of flowers) {
      const z = f.z - (getAssetDef(f.type)?.layerHint ?? 0) * 10;
      expect(apexZ).toBeGreaterThanOrEqual(z);
    }
  });

  it("greenery stays behind every flower", () => {
    for (const fol of layout.filter((e) => e.category === "foliage"))
      for (const fl of layout.filter((e) => e.category === "flower")) expect(fol.z).toBeLessThan(fl.z);
  });
});