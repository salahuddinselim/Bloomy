/*
 * Monochrome mode: the bouquet art (flowers, foliage, wrapper, ribbon) renders
 * in warm ink-and-paper grays instead of its native colors. The ramp keeps each
 * shape's contrast — dark blooms still read dark, pale ones stay pale — while
 * the paper chrome around it stays warm, so the whole card reads as one quiet,
 * editorial piece rather than a desaturated photograph.
 */

const INK = { r: 46, g: 41, b: 36 };
const PAPER = { r: 246, g: 242, b: 234 };

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function interp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

/** Maps any hex color to a warm gray at the same perceived lightness. */
export function toMono(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const l = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  const smooth = l * l * (3 - 2 * l);
  const r = interp(INK.r, PAPER.r, smooth);
  const g = interp(INK.g, PAPER.g, smooth);
  const b = interp(INK.b, PAPER.b, smooth);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function monoColors(colors: { primary: string; secondary?: string; center?: string }) {
  const out: { primary: string; secondary?: string; center?: string } = { primary: toMono(colors.primary) };
  if (colors.secondary) out.secondary = toMono(colors.secondary);
  if (colors.center) out.center = toMono(colors.center);
  return out;
}