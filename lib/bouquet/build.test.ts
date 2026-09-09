import { describe, it, expect } from "vitest";
import {
  expandThemeFlowers,
  expandThemeFoliage,
  elementsFromIds,
} from "@/lib/bouquet/build";

describe("signature theme → full dome expansion", () => {
  it("foliage ring grows a single greenery type into a full bush", () => {
    expect(expandThemeFoliage(["eucalyptus"])).toEqual([
      "eucalyptus",
      "eucalyptus",
      "eucalyptus",
      "eucalyptus",
    ]);
  });

  it("foliage ring cycles mixed greenery, keeping fillers in the ring", () => {
    expect(expandThemeFoliage(["eucalyptus", "babys_breath"])).toEqual([
      "eucalyptus",
      "babys_breath",
      "eucalyptus",
      "babys_breath",
    ]);
  });

  it("expands a theme palette to a full fern-dome (14 stems)", () => {
    const flowers = expandThemeFlowers(["rose", "peony", "ranunculus", "tulip", "carnation"]);
    expect(flowers).toHaveLength(14);
    // the lead bloom owns the crown — more stems than any other type
    expect(flowers.filter((f) => f === "rose").length).toBeGreaterThan(
      flowers.filter((f) => f === "peony").length
    );
    expect(new Set(flowers)).toEqual(new Set(["rose", "peony", "ranunculus", "tulip", "carnation"]));
  });

  it("is deterministic and handles short palettes", () => {
    const a = expandThemeFlowers(["sunflower", "dahlia", "zinnia", "rose", "ranunculus"]);
    const b = expandThemeFlowers(["sunflower", "dahlia", "zinnia", "rose", "ranunculus"]);
    expect(a).toEqual(b);
  });

  it("a themed bouquet arranges into the same dense hand-tied dome as the homepage hero", () => {
    const layout = elementsFromIds(
      expandThemeFoliage(["eucalyptus"]).concat(
        expandThemeFlowers(["rose", "peony", "ranunculus", "tulip", "carnation"])
      )
    );
    expect(layout).toHaveLength(18);
    const flowers = layout.filter((e) => e.category === "flower");
    const foliage = layout.filter((e) => e.category === "foliage");
    expect(flowers.length).toBe(14);
    expect(foliage.length).toBe(4);
    // dense flat dome: a packed crown near the apex and a skirt hanging below the rim
    const apex = flowers.reduce((a, b) => (a.y < b.y ? a : b));
    expect(flowers.filter((f) => f.y < apex.y + 3).length).toBeGreaterThanOrEqual(3);
    expect(flowers.some((f) => f.y >= 60)).toBe(true);
    for (const el of layout) {
      expect(el.x).toBeGreaterThanOrEqual(10);
      expect(el.x).toBeLessThanOrEqual(90);
      expect(el.y).toBeGreaterThanOrEqual(40);
      expect(el.y).toBeLessThanOrEqual(80);
    }
  });
});