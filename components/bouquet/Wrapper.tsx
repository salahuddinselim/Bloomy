import { getWrapper } from "@/data/wrappers";
import { getRibbon } from "@/data/ribbons";
import { toMono } from "@/lib/bouquet/mono";
import type { RibbonDef } from "@/lib/bouquet/types";
import type { CSSProperties } from "react";

/** Lightens/darkens a hex color by mixing toward white/black. Used to fake shading on shapes without extra data fields. */
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

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** A soft radial highlight for a "sheen", tuned to a base colour's lightness. */
function sheenColor(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 160 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)";
}

/**
 * A 3D-look ribbon: a wrapped band with vertical folds, a looped bow with
 * visible depth, and hanging tails. Finish selects material sheen — silk and
 * satin catch a glossy highlight, velvet soaks it up and adds a nap sheen,
 * double stacks two tones, thin draws a slim corsage knot.
 */
export function RibbonBand({ ribbon, idPrefix = "rb" }: { ribbon: RibbonDef; idPrefix?: string }) {
  const c = ribbon.color;
  // Unique gradient ids so multiple bouquets on a page never collide.
  const gid = `${idPrefix}-r${ribbon.id}`;
  const deep = shade(c, -0.4);
  const mid = shade(c, -0.15);
  const light = shade(c, 0.42);
  const highlightTop = shade(c, 0.55);
  const glossOn = ribbon.finish === "silk" || ribbon.finish === "satin" || ribbon.finish === "double";

  if (ribbon.finish === "thin") {
    return (
      <g>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={highlightTop} />
            <stop offset="50%" stopColor={c} />
            <stop offset="100%" stopColor={deep} />
          </linearGradient>
        </defs>
        {/* slim band with a subtle twist + knot */}
        <path d="M120,196 C160,205 240,205 280,196 L279,207 C230,216 170,216 121,207 Z" fill={`url(#${gid})`} />
        <path d="M182,199 L178,216 L190,212 L200,217 L210,212 L222,216 L218,199 Z" fill={c} />
        <circle cx="200" cy="200" r="4.2" fill={mid} />
        <circle cx="198.6" cy="198.6" r="1.3" fill={highlightTop} opacity={0.9} />
        {/* short tails */}
        <path d="M195,219 L186,240 L194,236 L200,243 L206,236 L214,240 L205,219" fill={mid} opacity={0.95} />
      </g>
    );
  }

  if (ribbon.finish === "velvet") {
    const nap = shade(c, 0.18);
    return (
      <g>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={shade(c, 0.12)} />
            <stop offset="100%" stopColor={deep} />
          </linearGradient>
        </defs>
        {/* wide soft band */}
        <path d="M105,186 C160,205 240,205 295,186 L289,222 C230,239 170,239 111,222 Z" fill={`url(#${gid})`} />
        {/* velvet nap sheen */}
        {[190, 198, 206, 214].map((y) => (
          <path key={y} d={`M112,${y} C160,${y + 12} 240,${y + 12} 288,${y}`} stroke={nap} strokeWidth={1.1} opacity={0.3} fill="none" />
        ))}
        {/* bow with soft depth */}
        <ellipse cx="200" cy="199" rx="4" ry="4" fill="#fff" opacity={0.06} />
        <path d="M172,196 C162,212 168,234 186,244 C196,249 206,246 200,236 C206,244 218,244 228,238 C242,228 242,206 228,194 C210,181 180,181 172,196 Z" fill={mid} opacity={0.85} />
        <path d="M176,198 C168,212 174,230 190,239 C180,228 182,208 188,196 Z" fill={light} opacity={0.4} />
        <path d="M224,198 C232,212 226,230 210,239 C220,228 218,208 212,196 Z" fill={deep} opacity={0.5} />
        <ellipse cx="200" cy="200" rx="13" ry="9" fill={shade(c, -0.18)} />
        <ellipse cx="198" cy="197.5" rx="5" ry="3" fill={highlightTop} opacity={0.35} />
        {/* tails */}
        <path d="M180,214 L164,250 L184,242 L200,254 L216,242 L236,250 L220,214" fill={mid} />
        <path d="M184,216 L172,246 L188,240 L200,248 L212,240 L228,246 L216,216" fill={deep} opacity={0.45} />
      </g>
    );
  }

  if (ribbon.finish === "double") {
    const c2 = shade(c, 0.38);
    const gid2 = `${gid}-2`;
    return (
      <g>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={highlightTop} />
            <stop offset="100%" stopColor={deep} />
          </linearGradient>
          <linearGradient id={gid2} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={shade(c2, 0.4)} />
            <stop offset="100%" stopColor={shade(c2, -0.25)} />
          </linearGradient>
        </defs>
        <path d="M108,183 C160,199 240,199 292,183 L286,207 C230,221 170,221 114,207 Z" fill={`url(#${gid})`} opacity={0.92} />
        <path d="M115,204 C162,215 238,215 285,204 L281,223 C228,235 172,235 119,223 Z" fill={`url(#${gid2})`} />
        <path d="M174,199 C162,216 170,238 190,250 C180,238 182,218 190,206 Z" fill={c} />
        <path d="M226,199 C238,216 230,238 210,250 C220,238 218,218 210,206 Z" fill={c} />
        <path d="M176,208 L166,248 L184,240 L200,252 L216,240 L234,248 L224,208" fill={`url(#${gid})`} />
        <path d="M186,210 L178,244 L192,238 L200,248 L208,238 L222,244 L214,210" fill={`url(#${gid2})`} />
        <ellipse cx="200" cy="205" rx="12" ry="8" fill={c} />
        <ellipse cx="200" cy="205" rx="7" ry="4.5" fill={c2} />
        <ellipse cx="197" cy="202.5" rx="2.5" ry="1.4" fill={highlightTop} opacity={0.8} />
      </g>
    );
  }

  // silk & satin
  const gloss = glossOn ? 0.4 : 0;
  return (
    <g>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={highlightTop} />
          <stop offset="45%" stopColor={c} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>
      {/* wrapped band with a shiny crease */}
      <path d="M110,190 C160,206 240,206 290,190 L286,216 C230,231 170,231 114,216 Z" fill={`url(#${gid})`} />
      <path d="M130,192 C160,208 180,214 200,214 C220,214 240,208 270,192 L272,204 C240,220 160,220 128,204 Z" fill={sheenColor(c)} opacity={gloss * 0.7} />
      {/* bow with loop depth on both sides + knot */}
      <path d="M172,196 C158,210 164,234 184,246 C172,236 174,216 182,204 C186,200 190,198 194,198 Z" fill={mid} />
      <path d="M228,196 C242,210 236,234 216,246 C228,236 226,216 218,204 C214,200 210,198 206,198 Z" fill={mid} />
      <path d="M176,200 C166,214 172,232 188,242 C176,232 178,214 186,204 Z" fill={light} opacity={0.55} />
      <path d="M224,200 C234,214 228,232 212,242 C224,232 222,214 214,204 Z" fill={deep} opacity={0.45} />
      <ellipse cx="200" cy="200" rx="10.5" ry="7.5" fill={c} />
      <ellipse cx="198" cy="197.5" rx="3.6" ry="1.9" fill={highlightTop} opacity={gloss + 0.5} />
      {/* tails */}
      <path d="M180,215 L168,252 L186,244 L200,256 L214,244 L232,252 L220,215" fill={`url(#${gid})`} />
      <path d="M184,217 L174,246 L188,240 L200,250 L212,240 L226,246 L216,217" fill={sheenColor(c)} opacity={gloss * 0.6} />
    </g>
  );
}

/** Rippled top edge shared by all wrappers so the cut reads as crumpled paper. */
function crumpledTop(showSheer: boolean) {
  return (
    <path
      d="M40,140 Q52,132 66,136 Q80,127 96,132 Q112,124 128,130 Q146,121 164,127 Q184,119 204,126 Q224,119 244,126 Q262,121 278,128 Q294,124 308,130 Q322,127 336,132 Q352,138 362,148"
      fill="none"
      stroke="rgba(0,0,0,0.14)"
      strokeWidth={1.4}
      opacity={showSheer ? 0.25 : 0.6}
      strokeLinecap="round"
    />
  );
}

/**
 * A `WrapperGraphic` reads as physical gift wrap: a slanted cone with folded
 * side panels, a crumpled top cuff where the stems press through, vertical
 * creases that catch highlight on one side and shadow on the other, and an
 * inner darkness where the foliage disappears inside. Texture options add
 * fibers (kraft), print (vintage), or a translucent quality (sheer).
 */
export function WrapperGraphic({
  wrapperId,
  ribbonId,
  width,
  height,
  style,
  mono = false,
  layer = "all",
  idPrefix,
}: {
  wrapperId: string;
  ribbonId: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
  mono?: boolean;
  layer?: "all" | "back" | "front";
  idPrefix?: string;
}) {
  const wrapper = getWrapper(wrapperId);
  const ribbon = getRibbon(ribbonId);
  const sheer = wrapper.texture === "sheer";
  const base = mono ? toMono(wrapper.colors.base) : wrapper.colors.base;
  const shadow = mono ? toMono(wrapper.colors.shadow) : wrapper.colors.shadow;
  const highlight = mono ? toMono(wrapper.colors.highlight) : wrapper.colors.highlight;
  const paperDeep = shade(base, -0.22);
  const paperLight = shade(base, 0.12);
  const drawRibbon: RibbonDef = mono ? { ...ribbon, color: toMono(ribbon.color) } : ribbon;
  const uid = (idPrefix ?? wrapperId).replace(/[^a-zA-Z0-9_-]/g, "");

  // Unique ids per wrapper+canvas usage.
  const grad = `wrap-${uid}-${wrapperId}`;
  const gradMid = `${grad}-mid`;
  const cuff = `${grad}-cuff`;
  const topLight = `${grad}-tophi`;
  const inner = `${grad}-inner`;

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
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor={paperLight} />
          <stop offset="18%" stopColor={highlight} />
          <stop offset="50%" stopColor={base} />
          <stop offset="82%" stopColor={shadow} />
          <stop offset="100%" stopColor={paperDeep} />
        </linearGradient>
        <linearGradient id={gradMid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={paperLight} />
          <stop offset="30%" stopColor={base} />
          <stop offset="70%" stopColor={shadow} />
          <stop offset="100%" stopColor={paperDeep} />
        </linearGradient>
        <linearGradient id={cuff} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={paperDeep} />
          <stop offset="100%" stopColor={base} />
        </linearGradient>
        <linearGradient id={topLight} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={inner} cx="0.5" cy="0.15" r="0.9">
          <stop offset="0%" stopColor={paperDeep} />
          <stop offset="100%" stopColor={paperDeep} stopOpacity="0" />
        </radialGradient>
      </defs>

      {layer !== "front" && (
        <g>
          {/* ---- shadow cast behind the whole wrap ---- */}
          <ellipse cx="200" cy="300" rx="150" ry="14" fill="#000" opacity={sheer ? 0.08 : 0.16} />

          {/* ---- wide florist sheets visible behind the flowers ---- */}
          <path
            d="M42,260 L30,94 Q80,112 138,150 L126,300 Z"
            fill={`url(#${gradMid})`}
            opacity={sheer ? 0.36 : 0.92}
          />
          <path
            d="M358,260 L370,96 Q316,112 262,150 L274,300 Z"
            fill={`url(#${gradMid})`}
            opacity={sheer ? 0.36 : 0.92}
          />
          <path
            d="M108,300 L86,142 Q96,126 118,124 L140,300 Z"
            fill={`url(#${gradMid})`}
            opacity={sheer ? 0.45 : 0.95}
          />
          <path
            d="M292,300 L314,142 Q304,126 282,124 L260,300 Z"
            fill={`url(#${gradMid})`}
            opacity={sheer ? 0.45 : 0.95}
          />

          {/* ---- inner shade where stems disappear into paper ---- */}
          <path
            d="M70,150 Q128,112 200,108 Q276,112 330,150 Q252,132 200,134 Q126,132 70,150 Z"
            fill={`url(#${cuff})`}
            opacity={sheer ? 0.22 : 0.42}
          />
          <ellipse cx="200" cy="142" rx="76" ry="19" fill={`url(#${inner})`} opacity={sheer ? 0.22 : 0.48} />
        </g>
      )}

      {layer !== "back" && (
        <g>
          {/* ---- front cone with folded overlapping paper ---- */}
          <path
            d="M114,300 L64,170 Q58,146 80,134 Q124,112 200,110 Q282,112 326,134 Q342,148 336,170 L286,300 Q200,313 114,300 Z"
            fill={`url(#${grad})`}
            opacity={sheer ? 0.58 : 1}
          />
          <path
            d="M72,170 Q112,138 184,132 L158,300 L114,300 Z"
            fill={highlight}
            opacity={sheer ? 0.18 : 0.32}
          />
          <path
            d="M328,170 Q286,138 216,132 L242,300 L286,300 Z"
            fill={paperDeep}
            opacity={sheer ? 0.16 : 0.26}
          />
          <path
            d="M146,300 L186,134 Q200,126 214,134 L254,300 Q200,309 146,300 Z"
            fill={`url(#${gradMid})`}
            opacity={sheer ? 0.4 : 0.78}
          />

          {/* ---- crisp folded lip like thick bouquet paper ---- */}
          <path
            d="M54,154 Q120,112 200,110 Q288,112 346,154 Q286,140 228,142 Q200,144 172,142 Q112,140 54,154 Z"
            fill={highlight}
            opacity={sheer ? 0.2 : 0.42}
          />
          <path d="M56,154 Q124,116 200,112 Q282,116 344,154" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={1.2} opacity={sheer ? 0.22 : 0.5} />

          {/* ---- vertical creases: shadow on one side, light on the other ---- */}
          <path d="M150,300 L134,132" stroke={paperDeep} strokeWidth={1.6} opacity={sheer ? 0.22 : 0.42} fill="none" />
          <path d="M200,300 L200,118" stroke={paperDeep} strokeWidth={1.2} opacity={sheer ? 0.16 : 0.28} fill="none" />
          <path d="M250,300 L266,132" stroke={paperDeep} strokeWidth={1.6} opacity={sheer ? 0.22 : 0.42} fill="none" />
          <path d="M151,300 L135,132" stroke={highlight} strokeWidth={0.8} opacity={sheer ? 0.16 : 0.45} fill="none" />
          <path d="M251,300 L267,132" stroke={highlight} strokeWidth={0.8} opacity={sheer ? 0.16 : 0.45} fill="none" />

          {/* ---- texture overlays ---- */}
          {wrapper.texture === "kraft" && (
            <path
              d="M68,166 Q126,122 200,116 Q280,122 332,166 L286,300 Q200,313 114,300 Z"
              fill="none"
              stroke={paperDeep}
              strokeWidth={0.5}
              opacity={0.35}
              strokeDasharray="2 7"
            />
          )}
          {wrapper.texture === "vintage" && (
            <g opacity={sheer ? 0.2 : 0.4}>
              <path d="M96,172 L110,254" stroke={shadow} strokeWidth={0.5} opacity={0.5} fill="none" />
              <path d="M124,150 L140,258" stroke={shadow} strokeWidth={0.5} opacity={0.5} fill="none" />
              <path d="M152,140 L170,260" stroke={shadow} strokeWidth={0.5} opacity={0.5} fill="none" />
              <path d="M252,140 L236,260" stroke={shadow} strokeWidth={0.5} opacity={0.5} fill="none" />
              <path d="M280,150 L268,258" stroke={shadow} strokeWidth={0.5} opacity={0.5} fill="none" />
              <path d="M306,172 L296,254" stroke={shadow} strokeWidth={0.5} opacity={0.5} fill="none" />
            </g>
          )}
          {wrapper.texture === "textured" && (
            <g opacity={0.18}>
              {[90, 130, 170, 210, 250, 290, 320].map((cx, i) => (
                <circle key={i} cx={cx} cy={160 + i * 17} r={3} fill="#fff" />
              ))}
            </g>
          )}

          {/* ---- glossy sheen on the paper face ---- */}
          <path
            d="M114,300 L64,170 Q58,146 80,134 Q124,112 200,110 Q154,142 154,300 Z"
            fill={`url(#${topLight})`}
            opacity={sheer ? 0.1 : 0.25}
          />

          {/* ---- crumpled top edge ---- */}
          {crumpledTop(sheer)}

          {/* ---- ribbon across the waist ---- */}
          {RibbonBand({ ribbon: drawRibbon, idPrefix: grad })}
        </g>
      )}
    </svg>
  );
}
