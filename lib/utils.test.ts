import { describe, expect, it } from "vitest";
import { clamp, clipText, round } from "./utils";

describe("clamp", () => {
  it("keeps values inside the range unchanged", () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it("clamps below the minimum", () => {
    expect(clamp(-10, 0, 100)).toBe(0);
  });

  it("clamps above the maximum", () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });
});

describe("round", () => {
  it("rounds server/client V8 ULP differences to the same value", () => {
    expect(round(1.00040001, 3)).toBe(1);
    expect(round(1.00060001, 3)).toBe(1.001);
  });
});

describe("clipText", () => {
  it("returns the original string when under the limit", () => {
    expect(clipText("hello", 10)).toBe("hello");
  });

  it("clips at the last word boundary before max", () => {
    expect(clipText("a bouquet of roses and peonies", 12)).toBe("a bouquet…");
  });
});
