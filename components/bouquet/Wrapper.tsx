import { getWrapper } from "@/data/wrappers";
import { getRibbon } from "@/data/ribbons";
import { toMono } from "@/lib/bouquet/mono";
import type { RibbonDef } from "@/lib/bouquet/types";
import type { CSSProperties } from "react";

/** Lightens/darkens a hex color by shifting HSL lightness. Used to fake a second ribbon tone without a second data field. */
function shade(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const mix = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  r = Math.round(r + (mix - r) * t);
  g = Math.round(g + (mix - g) * t);
  b = Math.round(b + (mix - b) * t);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function RibbonBand({ ribbon }: { ribbon: RibbonDef }) {
  const c = ribbon.color;

  if (ribbon.finish === "thin") {
    return (
      <g>
        <path d="M120,195 C160,203 240,203 280,195 L278,206 C230,214 170,214 122,206 Z" fill={c} />
        <path d="M185,200 L172,236 L188,229 L200,240 L212,229 L228,236 L215,200" fill={c} opacity={0.9} />
        <circle cx="200" cy="200" r="4" fill={shade(c, -0.25)} />
      </g>
    );
  }

  if (ribbon.finish === "velvet") {
    return (
      <g>
        <path d="M105,185 C160,203 240,203 295,185 L288,222 C230,238 170,238 112,222 Z" fill={c} />
        {[192, 199, 206, 213].map((y) => (
          <path key={y} d={`M112,${y} C160,${y + 12} 240,${y + 12} 288,${y}`} stroke={shade(c, -0.3)} strokeWidth={0.8} opacity={0.35} fill="none" />
        ))}
        <path d="M178,196 L160,244 L182,235 L200,248 L218,235 L240,244 L222,196" fill={shade(c, -0.12)} />
        <ellipse cx="200" cy="200" rx="12" ry="8.5" fill={shade(c, -0.15)} />
      </g>
    );
  }

  if (ribbon.finish === "double") {
    const c2 = shade(c, 0.35);
    return (
      <g>
        <path d="M108,182 C160,198 240,198 292,182 L286,206 C230,220 170,220 114,206 Z" fill={c} opacity={0.85} />
        <path d="M115,203 C162,214 238,214 285,203 L281,222 C228,234 172,234 119,222 Z" fill={c2} />
        <path d="M178,208 L162,246 L184,238 L200,250 L216,238 L238,246 L222,208" fill={c} />
        <path d="M188,210 L178,240 L192,235 L200,244 L208,235 L222,240 L212,210" fill={c2} />
        <ellipse cx="200" cy="205" rx="11" ry="7.5" fill={c} />
        <ellipse cx="200" cy="205" rx="6" ry="4" fill={c2} />
      </g>
    );
  }

  if (ribbon.finish === "satin") {
    return (
      <g>
        <path d="M110,190 C160,205 240,205 290,190 L285,215 C230,230 170,230 115,215 Z" fill={c} />
        <path d="M130,193 L160,213 L150,217 L120,197 Z" fill="#ffffff" opacity={0.25} />
        <path d="M180,195 L165,240 L185,232 L200,245 L215,232 L235,240 L220,195" fill={c} opacity={0.92} />
        <ellipse cx="200" cy="200" rx="10" ry="7" fill={c} />
        <ellipse cx="197" cy="197" rx="3" ry="1.6" fill="#ffffff" opacity={0.5} />
      </g>
    );
  }

  // silk (default)
  return (
    <g>
      <path d="M110,190 C160,205 240,205 290,190 L285,215 C230,230 170,230 115,215 Z" fill={c} />
      <path d="M180,195 L165,240 L185,232 L200,245 L215,232 L235,240 L220,195" fill={c} opacity={0.92} />
      <ellipse cx="200" cy="200" rx="10" ry="7" fill={c} opacity={0.85} />
    </g>
  );
}

export function WrapperGraphic({
  wrapperId,
  ribbonId,
  width,
  height,
  style,
  mono = false,
}: {
  wrapperId: string;
  ribbonId: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
  mono?: boolean;
}) {
  const wrapper = getWrapper(wrapperId);
  const ribbon = getRibbon(ribbonId);
  const sheer = wrapper.texture === "sheer";
  // Keyed by wrapper so every wrapper gets its own gradient id — the fixed
  // `wrap-shade` id was duplicated once per canvas on the page (invalid HTML
  // and fragile once more than one bouquet renders at a time).
  const gradientId = `wrap-shade-${wrapperId}`;
  const paper = mono ? toMono(wrapper.colors.base) : wrapper.colors.base;
  const shadow = mono ? toMono(wrapper.colors.shadow) : wrapper.colors.shadow;
  const highlight = mono ? toMono(wrapper.colors.highlight) : wrapper.colors.highlight;
  const drawRibbon: RibbonDef = mono ? { ...ribbon, color: toMono(ribbon.color) } : ribbon;

  return (
    <svg
      viewBox="0 0 400 300"
      width={width}
      height={height}
      style={style}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={highlight} />
          <stop offset="55%" stopColor={paper} />
          <stop offset="100%" stopColor={shadow} />
        </linearGradient>
      </defs>
      <path
        d="M120,300 L60,150 C55,120 90,95 200,90 C310,95 345,120 340,150 L280,300 Z"
        fill={`url(#${gradientId})`}
        opacity={sheer ? 0.55 : 1}
      />
      {/* fold lines */}
      <path d="M150,300 L120,150" stroke={shadow} strokeWidth={1.5} opacity={0.5} fill="none" />
      <path d="M200,300 L200,110" stroke={shadow} strokeWidth={1.5} opacity={0.4} fill="none" />
      <path d="M250,300 L280,150" stroke={shadow} strokeWidth={1.5} opacity={0.5} fill="none" />
      {RibbonBand({ ribbon: drawRibbon })}
    </svg>
  );
}
