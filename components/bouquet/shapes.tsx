import type { CSSProperties } from "react";
import { mulberry32, hashString, round } from "@/lib/utils";

export interface ShapeColors {
  primary: string;
  secondary?: string;
  center?: string;
}

interface ShapeProps {
  colors: ShapeColors;
  seed?: string;
}

function petalPath(length: number, width: number, curve = 1) {
  const hw = width / 2;
  const tipY = 50 - length;
  return `M50,50 C${50 - hw},${50 - length * 0.55 * curve} ${50 - hw * 0.6},${
    tipY + length * 0.12
  } 50,${tipY} C${50 + hw * 0.6},${tipY + length * 0.12} ${50 + hw},${
    50 - length * 0.55 * curve
  } 50,50 Z`;
}

function ring(
  count: number,
  length: number,
  width: number,
  fill: string,
  startAngle = 0,
  curve = 1,
  opacity = 1
) {
  const d = petalPath(length, width, curve);
  return Array.from({ length: count }, (_, i) => (
    <path
      key={`${startAngle}-${i}`}
      d={d}
      fill={fill}
      opacity={opacity}
      transform={`rotate(${startAngle + (360 / count) * i} 50 50)`}
    />
  ));
}

function Rose({ colors, seed = "rose" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  return (
    <g>
      <defs>
        {volumeGradient(g1, c1)}
      </defs>
      {ring(8, 30, 22, shade(c1, -0.1), 4, 0.9, 0.9)}
      {ring(7, 21, 18, c2, 38, 1)}
      {ring(5, 13, 13, c1, 15, 1.1)}
      {ring(4, 6, 8, shade(c2, 0.12), 40, 1.2)}
      <circle cx={50} cy={50} r={3} fill={`url(#${g1})`} />
      <circle cx={47.5} cy={47} r={1.4} fill="#fff" opacity={0.55} />
    </g>
  );
}

function Tulip({ colors, seed = "tulip" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  return (
    <g>
      <defs>
        {volumeGradient(g1, c2)}
        <linearGradient id={g2} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(c1, 0.25)} />
          <stop offset="100%" stopColor={c1} />
        </linearGradient>
      </defs>
      <path
        d="M50,56 C28,50 22,20 38,2 C42,13 46,20 50,23 C54,20 58,13 62,2 C78,20 72,50 50,56 Z"
        fill={`url(#${g1})`}
      />
      <path
        d="M50,56 C38,42 34,26 44,9 C46,20 48,28 50,32 C52,28 54,20 56,9 C66,26 62,42 50,56 Z"
        fill={`url(#${g2})`}
        opacity={0.95}
      />
      <path d="M46,20 C47,26 48,30 50,33 L50,20 Z" fill="#fff" opacity={0.4} />
    </g>
  );
}

function Lily({ colors, seed = "lily" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? c2;
  const g1 = gin(seed, "a");
  return (
    <g>
      <defs>{volumeGradient(g1, c1)}</defs>
      {ring(6, 34, 12, `url(#${g1})`, 0, 0.7)}
      {ring(6, 26, 9, shade(c2, 0.1), 30, 0.6, 0.9)}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 60} 50 50)`}>
          <line x1={50} y1={50} x2={50} y2={26} stroke={shade(center, 0.1)} strokeWidth={0.6} />
          <ellipse cx={50} cy={25} rx={1.4} ry={2.2} fill={center} />
        </g>
      ))}
      <circle cx={50} cy={50} r={2.4} fill={center} />
      <circle cx={48.5} cy={48.5} r={0.9} fill="#fff" opacity={0.6} />
    </g>
  );
}

function Daisy({ colors, seed = "daisy" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? "#e8b93a";
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  // Deterministic speckle (replaces a shared SVG <pattern>, which clashed on
  // repeated ids across the document), confined to the center disc.
  const rand = mulberry32(hashString(`daisy-dots-${seed}`));
  const dots = Array.from({ length: 14 }, () => {
    const t = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 6.2;
    return { x: round(50 + Math.cos(t) * r), y: round(50 + Math.sin(t) * r) };
  });
  return (
    <g>
      <defs>
        <radialGradient id={g1} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0%" stopColor={shade(c1, 0.25)} />
          <stop offset="100%" stopColor={shade(c1, -0.12)} />
        </radialGradient>
        <radialGradient id={g2} cx="0.5" cy="0.45" r="0.7">
          <stop offset="0%" stopColor={shade(center, 0.3)} />
          <stop offset="100%" stopColor={shade(center, -0.2)} />
        </radialGradient>
      </defs>
      {ring(14, 26, 7, `url(#${g1})`, 0, 0.55)}
      {ring(14, 22, 5.5, shade(c2, 0.05), 12.8, 0.5, 0.7)}
      <circle cx={50} cy={50} r={7} fill={`url(#${g2})`} />
      <circle cx={47} cy={46} r={2} fill="#fff" opacity={0.5} />
      {dots.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={0.6} fill="#000" opacity={0.28} />
      ))}
    </g>
  );
}

function Sunflower({ colors, seed = "sunflower" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? "#5c3b1e";
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  return (
    <g>
      <defs>
        <radialGradient id={g1} cx="0.5" cy="0.35" r="0.72">
          <stop offset="0%" stopColor={shade(c1, 0.3)} />
          <stop offset="100%" stopColor={shade(c1, -0.1)} />
        </radialGradient>
        <radialGradient id={g2} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor={shade(center, 0.25)} />
          <stop offset="100%" stopColor={shade(center, -0.25)} />
        </radialGradient>
      </defs>
      {ring(18, 32, 8, `url(#${g1})`, 0, 0.5)}
      {ring(18, 26, 6.5, shade(c2, 0.1), 10, 0.5, 0.8)}
      <circle cx={50} cy={50} r={11} fill={`url(#${g2})`} />
      <circle cx={46} cy={45} r={3} fill={shade(center, 0.35)} opacity={0.7} />
      {Array.from({ length: 10 }, (_, i) => (
        <circle
          key={i}
          cx={round(50 + Math.cos((i / 10) * Math.PI * 2) * 6)}
          cy={round(50 + Math.sin((i / 10) * Math.PI * 2) * 6)}
          r={0.9}
          fill="#3d2712"
          opacity={0.6}
        />
      ))}
    </g>
  );
}

function Peony({ colors, seed = "peony" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  return (
    <g>
      <defs>
        {volumeGradient(g1, c1)}
        {volumeGradient(g2, c2)}
      </defs>
      {ring(8, 33, 20, `url(#${g1})`, 5, 0.85)}
      {ring(8, 26, 17, `url(#${g2})`, 27, 0.9, 0.92)}
      {ring(7, 19, 14, c1, 12, 1, 0.95)}
      {ring(6, 12, 10, shade(c2, 0.1), 35, 1.1)}
      {ring(5, 6, 6, shade(c1, 0.15), 20, 1.2)}
      <circle cx={48.5} cy={46} r={1.5} fill="#fff" opacity={0.5} />
    </g>
  );
}

function Carnation({ colors, seed = "carnation" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  return (
    <g>
      <defs>{volumeGradient(g1, c1)}</defs>
      {ring(20, 27, 8, `url(#${g1})`, 0, 0.4, 0.95)}
      {ring(20, 22, 7, shade(c2, 0.08), 9, 0.4, 0.88)}
      {ring(16, 16, 6, c1, 4, 0.4)}
      {ring(12, 9, 5, shade(c2, 0.15), 15, 0.4)}
    </g>
  );
}

function Hydrangea({ colors, seed = "hydrangea" }: ShapeProps) {
  const rand = mulberry32(hashString(seed));
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  const florets = Array.from({ length: 20 }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const r = 8 + rand() * 25;
    const cx = round(50 + Math.cos(angle) * r);
    const cy = round(50 + Math.sin(angle) * r);
    const rot = rand() * 90;
    const useA = i % 2 === 0;
    const fillGrad = useA ? g1 : g2;
    return (
      <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot}) scale(0.24)`}>
        {ring(4, 30, 26, `url(#${fillGrad})`, 0, 1)}
        <circle r={4} fill={useA ? shade(c1, 0.3) : shade(c2, 0.3)} />
        <circle r={2} fill="#fff" opacity={0.7} />
      </g>
    );
  });
  return (
    <g>
      <defs>
        {volumeGradient(g1, c1)}
        {volumeGradient(g2, c2)}
      </defs>
      <circle cx={50} cy={50} r={28} fill={alpha(c1, 0.25)} />
      {florets}
    </g>
  );
}

function Orchid({ colors, seed = "orchid" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? c2;
  const g1 = gin(seed, "a");
  const petal = (length: number, width: number, fill: string, angle: number) => (
    <path d={petalPath(length, width)} fill={fill} transform={`rotate(${angle} 50 50)`} />
  );
  return (
    <g>
      <defs>{volumeGradient(g1, c1)}</defs>
      {petal(30, 16, `url(#${g1})`, 0)}
      {petal(26, 15, shade(c1, -0.05), 130)}
      {petal(26, 15, shade(c1, -0.05), 230)}
      {petal(20, 13, shade(c2, 0.1), 60)}
      {petal(20, 13, shade(c2, 0.1), 300)}
      <path
        d="M50,50 C42,58 42,70 50,76 C58,70 58,58 50,50 Z"
        fill={shade(center, -0.05)}
      />
      <path d="M50,50 C46,56 48,66 50,70 L54,58 Z" fill={shade(center, 0.3)} opacity={0.7} />
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={46 + (i % 3) * 4} cy={62 + Math.floor(i / 3) * 6} r={0.8} fill={shade(c1, 0.2)} opacity={0.7} />
      ))}
    </g>
  );
}

function BabysBreath({ colors, seed = "bb" }: ShapeProps) {
  const rand = mulberry32(hashString(seed));
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  const sprigs = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 + rand();
    const r = 14 + rand() * 18;
    const cx = round(50 + Math.cos(angle) * r);
    const cy = round(50 + Math.sin(angle) * r);
    return (
      <g key={i}>
        <line x1={50} y1={50} x2={cx} y2={cy} stroke={c2} strokeWidth={0.4} opacity={0.5} />
        <g transform={`translate(${cx} ${cy}) scale(0.12)`}>
          <defs><radialGradient id={g1} cx="0.5" cy="0.4" r="0.7"><stop offset="0%" stopColor={shade(c1, 0.4)} /><stop offset="100%" stopColor={c1} /></radialGradient></defs>
          {ring(5, 30, 26, `url(#${g1})`, 0, 1)}
          <circle r={0.8} fill="#fff" opacity={0.8} />
        </g>
      </g>
    );
  });
  return <g>{sprigs}</g>;
}

function Lavender({ colors, seed = "lavender" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  const buds = Array.from({ length: 12 }, (_, i) => {
    const y = 12 + i * 6.5;
    const side = i % 2 === 0 ? -1 : 1;
    return (
      <g key={i}>
        <ellipse
          cx={50 + side * 3.4}
          cy={y}
          rx={3.4}
          ry={4.6}
          fill={i % 3 === 0 ? shade(c2, -0.1) : c1}
          transform={`rotate(${side * 18} ${50 + side * 3.4} ${y})`}
        />
        <ellipse
          cx={50 + side * 2.6}
          cy={y - 1.5}
          rx={1.2}
          ry={2}
          fill="#fff"
          opacity={0.45}
          transform={`rotate(${side * 18} ${50 + side * 3.4} ${y})`}
        />
      </g>
    );
  });
  return (
    <g>
      <defs><linearGradient id={g1} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={shade(c2, 0.2)} /><stop offset="100%" stopColor={shade(c2, -0.15)} /></linearGradient></defs>
      <line x1={50} y1={14} x2={50} y2={86} stroke={shade(c2, -0.25)} strokeWidth={0.8} opacity={0.6} />
      {buds}
    </g>
  );
}

function Daffodil({ colors, seed = "daffodil" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? c2;
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  return (
    <g>
      <defs>
        <radialGradient id={g1} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0%" stopColor={shade(c1, 0.25)} />
          <stop offset="100%" stopColor={shade(c1, -0.08)} />
        </radialGradient>
        {volumeGradient(g2, center)}
      </defs>
      {ring(6, 28, 15, `url(#${g1})`, 0, 0.6)}
      {ring(6, 22, 12, shade(c2, 0.05), 30, 0.55, 0.85)}
      <ellipse cx={50} cy={50} rx={11} ry={13} fill={`url(#${g2})`} />
      <ellipse cx={50} cy={47} rx={8} ry={9.5} fill={shade(center, 0.2)} opacity={0.5} />
      <ellipse cx={47.5} cy={45} rx={2.5} ry={3} fill="#fff" opacity={0.4} />
    </g>
  );
}

function Blossom({ colors, seed = "blossom" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? c2;
  const g1 = gin(seed, "a");
  return (
    <g>
      <defs>
        <radialGradient id={g1} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0%" stopColor={shade(c1, 0.3)} />
          <stop offset="100%" stopColor={shade(c1, -0.1)} />
        </radialGradient>
      </defs>
      {ring(5, 20, 17, `url(#${g1})`, 0, 0.75)}
      {ring(5, 15, 13, shade(c2, 0.05), 36, 0.7, 0.85)}
      <circle cx={50} cy={50} r={3.5} fill={shade(center, 0.05)} />
      <circle cx={48} cy={47} r={1.2} fill="#fff" opacity={0.8} />
      {Array.from({ length: 5 }, (_, i) => (
        <circle
          key={i}
          cx={round(50 + Math.cos((i / 5) * Math.PI * 2) * 3)}
          cy={round(50 + Math.sin((i / 5) * Math.PI * 2) * 3)}
          r={0.5}
          fill="#fff"
        />
      ))}
    </g>
  );
}

/* ---------- New flower shapes (3D-procedural, no raster needed) ---------- */

function Poppy({ colors, seed = "poppy" }: ShapeProps) {
  const c1 = colors.primary;
  const center = colors.center ?? "#2c1a12";
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  return (
    <g>
      <defs>
        <radialGradient id={g1} cx="0.5" cy="0.4" r="0.72">
          <stop offset="0%" stopColor={shade(c1, 0.3)} />
          <stop offset="100%" stopColor={shade(c1, -0.2)} />
        </radialGradient>
        <radialGradient id={g2} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor={shade(center, 0.3)} />
          <stop offset="100%" stopColor={shade(center, -0.2)} />
        </radialGradient>
      </defs>
      {ring(8, 30, 24, `url(#${g1})`, 0, 0.8, 0.9)}
      {ring(8, 26, 19, shade(c1, -0.05), 22, 0.85, 0.9)}
      <circle cx={50} cy={50} r={10} fill={`url(#${g2})`} />
      <circle cx={48} cy={47} r={2} fill="#fff" opacity={0.5} />
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={round(50 + Math.cos((i / 6) * Math.PI * 2) * 5.5)} cy={round(50 + Math.sin((i / 6) * Math.PI * 2) * 5.5)} r={1.1} fill="#fff" opacity={0.8} />
      ))}
    </g>
  );
}

function Cosmos({ colors, seed = "cosmos" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? "#f2e37c";
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  return (
    <g>
      <defs>
        <radialGradient id={g1} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0%" stopColor={shade(c1, 0.25)} />
          <stop offset="100%" stopColor={shade(c1, -0.08)} />
        </radialGradient>
        <radialGradient id={g2} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor={shade(center, 0.3)} />
          <stop offset="100%" stopColor={shade(center, -0.15)} />
        </radialGradient>
      </defs>
      {ring(8, 30, 12, `url(#${g1})`, 0, 0.5)}
      {ring(8, 24, 9, shade(c2, 0.08), 22.5, 0.5, 0.8)}
      <circle cx={50} cy={50} r={7.5} fill={`url(#${g2})`} />
      <circle cx={47.5} cy={47} r={2} fill="#fff" opacity={0.5} />
    </g>
  );
}

function Chrysanthemum({ colors, seed = "chrysanthemum" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  return (
    <g>
      <defs>{volumeGradient(g1, c1)}</defs>
      {ring(24, 30, 6, `url(#${g1})`, 0, 0.3, 0.95)}
      {ring(22, 23, 5, shade(c2, 0.05), 7, 0.3, 0.9)}
      {ring(16, 14, 4, c1, 12, 0.3)}
      {ring(10, 7, 3, shade(c2, 0.15), 20, 0.3)}
      <circle cx={50} cy={50} r={3} fill={shade(c2, 0.25)} />
    </g>
  );
}

function Iris({ colors, seed = "iris" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? "#f6e37c";
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  const sepal = (fill: string, angle: number, w = 15, len = 32, curve = 0.6) => (
    <path d={petalPath(len, w, curve)} fill={fill} transform={`rotate(${angle} 50 50)`} />
  );
  return (
    <g>
      <defs>
        <radialGradient id={g1} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor={shade(c1, 0.25)} />
          <stop offset="100%" stopColor={shade(c1, -0.15)} />
        </radialGradient>
        {volumeGradient(g2, center)}
      </defs>
      {sepal(`url(#${g1})`, 30, 16, 32, 0.7)}
      {sepal(`url(#${g1})`, 150, 16, 32, 0.7)}
      {sepal(shade(c2, 0.05), 90, 14, 24, 0.8)}
      {sepal(shade(c2, 0.05), 75, 13, 20, 0.9)}
      {sepal(shade(c2, 0.05), 105, 13, 20, 0.9)}
      <path d="M50,50 C44,58 50,66 50,74 C50,66 56,58 50,50 Z" fill={`url(#${g2})`} />
      <path d="M47,54 L50,70 L53,54 L50,48 Z" fill={shade(center, 0.3)} opacity={0.75} />
      <line x1={47} y1={56} x2={53} y2={56} stroke={shade(center, -0.4)} strokeWidth={1} opacity={0.5} />
    </g>
  );
}

function Gerbera({ colors, seed = "gerbera" }: ShapeProps) {
  const c1 = colors.primary;
  const center = colors.center ?? "#3d2415";
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  return (
    <g>
      <defs>
        <radialGradient id={g1} cx="0.5" cy="0.32" r="0.8">
          <stop offset="0%" stopColor={shade(c1, 0.3)} />
          <stop offset="65%" stopColor={c1} />
          <stop offset="100%" stopColor={shade(c1, -0.22)} />
        </radialGradient>
        <radialGradient id={g2} cx="0.5" cy="0.4" r="0.75">
          <stop offset="0%" stopColor={shade(center, 0.5)} />
          <stop offset="55%" stopColor={shade(center, 0.05)} />
          <stop offset="100%" stopColor={shade(center, -0.3)} />
        </radialGradient>
      </defs>
      {/* a fuller, broader-petalled daisy reads as a real gerbera; the old
          thin spiky ring + flat dot-speckled disc read as a printed sticker */}
      {ring(13, 32, 15, shade(c1, -0.14), 13.8, 0.55, 0.95)}
      {ring(13, 36, 18, `url(#${g1})`, 0, 0.48)}
      {Array.from({ length: 13 }, (_, i) => (
        <line
          key={i}
          x1={50}
          y1={50}
          x2={50}
          y2={17}
          stroke={shade(c1, -0.3)}
          strokeWidth={0.4}
          opacity={0.3}
          transform={`rotate(${(360 / 13) * i} 50 50)`}
        />
      ))}
      <circle cx={50} cy={50} r={11} fill={`url(#${g2})`} />
      {Array.from({ length: 24 }, (_, i) => {
        const outer = i < 14;
        const count = outer ? 14 : 10;
        const idx = outer ? i : i - 14;
        const r = outer ? 8 : 4.2;
        const a = (idx / count) * Math.PI * 2 + (outer ? 0 : 0.3);
        return (
          <circle
            key={i}
            cx={round(50 + Math.cos(a) * r)}
            cy={round(50 + Math.sin(a) * r)}
            r={0.85}
            fill={shade(center, outer ? -0.1 : 0.3)}
            opacity={0.85}
          />
        );
      })}
      <circle cx={47} cy={45.5} r={2} fill="#fff" opacity={0.35} />
    </g>
  );
}

function Camellia({ colors, seed = "camellia" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  return (
    <g>
      <defs>
        {volumeGradient(g1, c1)}
        {volumeGradient(g2, shade(c2, 0.05))}
      </defs>
      {/* one more layered ring + soft golden stamens (a real camellia's
          signature) gives this the roundness the flatter old version lacked */}
      {ring(9, 34, 19, shade(c1, -0.15), 10, 0.95, 0.85)}
      {ring(8, 27, 18, `url(#${g1})`, 32, 1)}
      {ring(7, 19, 15, `url(#${g2})`, 8, 1.05, 0.95)}
      {ring(5, 11, 10, shade(c1, 0.1), 30, 1.1)}
      <circle cx={50} cy={49} r={3.2} fill={shade(c2, 0.3)} />
      {Array.from({ length: 8 }, (_, i) => (
        <circle
          key={i}
          cx={round(50 + Math.cos((i / 8) * Math.PI * 2) * 2.4)}
          cy={round(49 + Math.sin((i / 8) * Math.PI * 2) * 2.4)}
          r={0.5}
          fill="#e8b93a"
          opacity={0.85}
        />
      ))}
      <circle cx={47.5} cy={45.5} r={1.6} fill="#fff" opacity={0.55} />
    </g>
  );
}

/** A tiny 4-petaled star floret, the building block of a lilac panicle. */
function lilacFloret(cx: number, cy: number, r: number, fill: string) {
  return (
    <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
      {[0, 90, 180, 270].map((a) => (
        <ellipse key={a} rx={r * 0.5} ry={r} fill={fill} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.32} fill={shade(fill, 0.4)} />
    </g>
  );
}

function Lilac({ colors, seed = "lilac" }: ShapeProps) {
  const rand = mulberry32(hashString(seed));
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  const g2 = gin(seed, "b");
  // A real lilac bloom is a dense pyramidal panicle of dozens of tiny
  // 4-petaled florets, not a sparse vertical string of plain dots — that
  // read as beads on a thread rather than a flower.
  const rows = 9;
  const florets = [];
  for (let row = 0; row < rows; row++) {
    const t = row / (rows - 1);
    const y = round(14 + t * 62);
    const width = 3 + t * 15;
    const count = Math.round(3 + t * 6);
    for (let i = 0; i < count; i++) {
      const spread = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
      const x = round(50 + spread * width + (rand() - 0.5) * 2.5);
      const yy = round(y + (rand() - 0.5) * 3);
      const r = round(2 + rand() * 1.1, 2);
      const fill = rand() > 0.5 ? `url(#${g1})` : `url(#${g2})`;
      florets.push(lilacFloret(x, yy, r, fill));
    }
  }
  return (
    <g>
      <defs>
        <radialGradient id={g1} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0%" stopColor={shade(c1, 0.4)} />
          <stop offset="100%" stopColor={c1} />
        </radialGradient>
        <radialGradient id={g2} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0%" stopColor={shade(c2, 0.4)} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>
      </defs>
      <line x1={50} y1={10} x2={50} y2={82} stroke={shade(c2, -0.3)} strokeWidth={1} opacity={0.4} />
      {florets}
    </g>
  );
}

function Gladiolus({ colors, seed = "gladiolus" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const g1 = gin(seed, "a");
  // The previous teardrop-path version blended into one dark, leaf-shaped
  // blob whenever primary/secondary were close in hue (as gladiolus's red
  // tones are) — no petal ever separated visually from its neighbor. Six
  // individually-rotated tepals (three broad outer, three narrower inner,
  // reusing the same petalPath() as iris/orchid) plus a strongly lightened
  // throat mark forces the contrast a real trumpet-flower reads by, no
  // matter how close the two base colors are.
  const blooms = Array.from({ length: 5 }, (_, i) => {
    const y = 14 + i * 16;
    const side = i % 2 === 0 ? -1 : 1;
    const bloomScale = round(0.5 - i * 0.045, 2);
    return (
      <g key={i} transform={`translate(${50 + side * 4} ${y}) rotate(${side * 28}) scale(${bloomScale})`}>
        {[-55, 0, 55].map((a) => (
          <path key={`o${a}`} d={petalPath(34, 20, 0.75)} fill={shade(c1, -0.12)} transform={`rotate(${a} 50 50)`} />
        ))}
        {[-28, 28, 90].map((a) => (
          <path key={`i${a}`} d={petalPath(27, 15, 0.85)} fill={`url(#${g1})`} transform={`rotate(${a} 50 50)`} />
        ))}
        <path d="M50,50 L46,29 L50,18 L54,29 Z" fill={shade(c2, 0.45)} opacity={0.85} />
        {Array.from({ length: 3 }, (_, k) => (
          <circle key={k} cx={49 + (k % 2)} cy={38 - k * 6} r={1.1} fill={shade(c2, -0.2)} opacity={0.65} />
        ))}
      </g>
    );
  });
  return (
    <g>
      <defs>
        <radialGradient id={g1} cx="0.5" cy="0.3" r="0.8">
          <stop offset="0%" stopColor={shade(c1, 0.4)} />
          <stop offset="100%" stopColor={c1} />
        </radialGradient>
      </defs>
      <line x1={50} y1={8} x2={50} y2={90} stroke={shade(c2, -0.25)} strokeWidth={1.1} opacity={0.6} />
      {blooms}
    </g>
  );
}

/* ---------- 3D shading helpers ---------- */

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

function alpha(hex: string, a: number) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/**
 * A radial gradient that gives a bloom volume: a light centre cup that falls
 * to the base hue and then into a darker rim, so petals read as curved.
 */
function volumeGradient(id: string, base: string) {
  return (
    <radialGradient id={id} cx="0.5" cy="0.42" r="0.68">
      <stop offset="0%" stopColor={shade(base, 0.35)} />
      <stop offset="55%" stopColor={base} />
      <stop offset="100%" stopColor={shade(base, -0.28)} />
    </radialGradient>
  );
}

/** Each flower uses this to guarantee unique gradient ids when repeated on a page. */
function gin(seed = "f", key: string) {
  return `gr-${seed}-${key}`;
}

const SHAPES: Record<string, (p: ShapeProps) => React.JSX.Element> = {
  rose: Rose,
  tulip: Tulip,
  lily: Lily,
  daisy: Daisy,
  sunflower: Sunflower,
  peony: Peony,
  carnation: Carnation,
  hydrangea: Hydrangea,
  orchid: Orchid,
  babys_breath: BabysBreath,
  lavender: Lavender,
  daffodil: Daffodil,
  blossom: Blossom,
  poppy: Poppy,
  cosmos: Cosmos,
  chrysanthemum: Chrysanthemum,
  iris: Iris,
  gerbera: Gerbera,
  camellia: Camellia,
  lilac: Lilac,
  gladiolus: Gladiolus,
};

export function FlowerBloom({
  shape,
  colors,
  seed,
  className,
  style,
}: {
  shape: string;
  colors: ShapeColors;
  seed?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const shapeFn = SHAPES[shape] ?? Rose;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <g style={{ filter: "drop-shadow(0 1px 1px rgba(40,25,20,0.18))" }}>
        {shapeFn({ colors, seed })}
      </g>
    </svg>
  );
}

/* ---------- Foliage ---------- */

function leafPath(length: number, width: number) {
  const hw = width / 2;
  return `M50,90 C${50 - hw},${90 - length * 0.5} ${50 - hw * 0.5},${90 - length} 50,${
    90 - length
  } C${50 + hw * 0.5},${90 - length} ${50 + hw},${90 - length * 0.5} 50,90 Z`;
}

function Eucalyptus({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const leaves = Array.from({ length: 8 }, (_, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    const y = 85 - i * 9;
    return (
      <ellipse
        key={i}
        cx={50 + side * (6 + i * 0.6)}
        cy={y}
        rx={6}
        ry={4.2}
        fill={i % 2 === 0 ? c1 : c2}
        transform={`rotate(${side * 35} ${50 + side * (6 + i * 0.6)} ${y})`}
        opacity={0.95}
      />
    );
  });
  return <g>{leaves}</g>;
}

function Fern({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const fronds = Array.from({ length: 10 }, (_, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    const y = 92 - i * 8;
    const len = 16 - i * 0.6;
    return (
      <path
        key={i}
        d={`M50,${y} q${side * len},-2 ${side * len * 1.4},${-len * 0.5}`}
        stroke={c1}
        strokeWidth={1.1}
        fill="none"
        strokeLinecap="round"
      />
    );
  });
  return <g>{fronds}</g>;
}

function Olive({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const leaves = Array.from({ length: 10 }, (_, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    const y = 92 - i * 7.5;
    return (
      <path
        key={i}
        d={leafPath(9, 4)}
        fill={i % 2 === 0 ? c1 : c2}
        transform={`translate(${side * 5} ${y - 90}) rotate(${side * 50} 50 90)`}
      />
    );
  });
  return <g>{leaves}</g>;
}

function Ruscus({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const leaves = Array.from({ length: 7 }, (_, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    const y = 90 - i * 10;
    return (
      <path
        key={i}
        d={leafPath(15, 9)}
        fill={i % 2 === 0 ? c1 : c2}
        transform={`translate(${side * 8} ${y - 90}) rotate(${side * 30} 50 90)`}
      />
    );
  });
  return <g>{leaves}</g>;
}

function Ivy({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const leaves = Array.from({ length: 6 }, (_, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    const y = 85 - i * 12;
    return (
      <path
        key={i}
        d="M50,90 C44,84 44,76 50,72 C56,76 56,84 50,90 Z"
        fill={c1}
        transform={`translate(${side * 10} ${y - 90})`}
      />
    );
  });
  return <g>{leaves}</g>;
}

function SimpleLeaf({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  return (
    <g>
      <path d={leafPath(28, 16)} fill={c1} transform="translate(-9 -20)" />
      <path d={leafPath(28, 16)} fill={c2} opacity={0.9} transform="translate(9 -20)" />
    </g>
  );
}

const FOLIAGE_SHAPES: Record<string, (p: ShapeProps) => React.JSX.Element> = {
  eucalyptus: Eucalyptus,
  fern: Fern,
  olive: Olive,
  ruscus: Ruscus,
  ivy: Ivy,
  leaf: SimpleLeaf,
};

export function FoliageGraphic({
  shape,
  colors,
  className,
  style,
}: {
  shape: string;
  colors: ShapeColors;
  className?: string;
  style?: CSSProperties;
}) {
  const foliageFn = FOLIAGE_SHAPES[shape] ?? SimpleLeaf;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <g style={{ filter: "drop-shadow(0 1px 1px rgba(40,25,20,0.15))" }}>
        {foliageFn({ colors })}
      </g>
    </svg>
  );
}

/* ---------- Decorations ---------- */

function PearlPin({ colors }: ShapeProps) {
  return (
    <g>
      <line x1={50} y1={50} x2={50} y2={90} stroke="#c9c0aa" strokeWidth={1} />
      <circle cx={50} cy={45} r={9} fill={colors.primary} />
      <circle cx={47} cy={42} r={2.5} fill="#fff" opacity={0.7} />
    </g>
  );
}

function WaxSeal({ colors }: ShapeProps) {
  return (
    <g>
      <circle cx={50} cy={50} r={18} fill={colors.primary} />
      <circle cx={50} cy={50} r={13} fill={colors.secondary ?? colors.primary} opacity={0.6} />
      <path d="M42,50 a8,8 0 1,1 16,0 a8,8 0 1,1 -16,0" fill="none" stroke="#fff" strokeWidth={1} opacity={0.5} />
    </g>
  );
}

function Twine({ colors }: ShapeProps) {
  return (
    <g>
      <path d="M15,50 Q50,30 85,50 Q50,70 15,50" stroke={colors.primary} strokeWidth={2.4} fill="none" />
      <path d="M15,50 Q50,30 85,50 Q50,70 15,50" stroke={colors.secondary ?? colors.primary} strokeWidth={1} fill="none" strokeDasharray="2 3" />
    </g>
  );
}

function BerrySprig({ colors }: ShapeProps) {
  const berries = Array.from({ length: 5 }, (_, i) => (
    <circle key={i} cx={44 + (i % 3) * 6} cy={40 + Math.floor(i / 3) * 10} r={3.2} fill={colors.primary} />
  ));
  return (
    <g>
      <path d="M50,90 C49,70 51,50 50,30" stroke={colors.secondary ?? "#4a6640"} strokeWidth={1} fill="none" />
      {berries}
    </g>
  );
}

function Bow({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  return (
    <g>
      <path d="M50,52 C50,40 34,28 20,34 C10,38 10,54 22,58 C34,62 46,58 50,52 Z" fill={c1} />
      <path d="M50,52 C50,40 66,28 80,34 C90,38 90,54 78,58 C66,62 54,58 50,52 Z" fill={c1} />
      <path d="M50,52 C46,44 44,34 36,26 L44,26 C48,34 50,42 50,52 Z" fill={c2} opacity={0.85} />
      <path d="M50,52 C54,44 56,34 64,26 L56,26 C52,34 50,42 50,52 Z" fill={c2} opacity={0.85} />
      <ellipse cx={50} cy={53} rx={6} ry={5} fill={c2} />
      <path d="M46,58 L40,74 L48,70 Z" fill={c1} />
      <path d="M54,58 L60,74 L52,70 Z" fill={c1} />
    </g>
  );
}

function GoldCharm({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const points = Array.from({ length: 5 }, (_, i) => {
    const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    return `${50 + Math.cos(outerAngle) * 16},${50 + Math.sin(outerAngle) * 16} ${
      50 + Math.cos(innerAngle) * 6.5
    },${50 + Math.sin(innerAngle) * 6.5}`;
  }).join(" ");
  return (
    <g>
      <circle cx={50} cy={30} r={2} fill="none" stroke={c2} strokeWidth={1.2} />
      <line x1={50} y1={32} x2={50} y2={38} stroke={c2} strokeWidth={1} />
      <polygon points={points} fill={c1} />
      <circle cx={47} cy={46} r={1.6} fill="#fff" opacity={0.6} />
    </g>
  );
}

function Butterfly({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  return (
    <g>
      <path d="M50,50 C48,34 30,26 22,34 C16,40 24,54 50,50 Z" fill={c1} />
      <path d="M50,50 C52,34 70,26 78,34 C84,40 76,54 50,50 Z" fill={c1} />
      <path d="M50,50 C48,60 34,64 28,60 C24,56 30,48 50,50 Z" fill={c2} opacity={0.85} />
      <path d="M50,50 C52,60 66,64 72,60 C76,56 70,48 50,50 Z" fill={c2} opacity={0.85} />
      <ellipse cx={50} cy={50} rx={2} ry={9} fill="#332e2a" />
    </g>
  );
}

function DriedLavender({ colors, seed = "dried-lavender" }: ShapeProps) {
  const rand = mulberry32(hashString(seed));
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const buds = Array.from({ length: 9 }, (_, i) => {
    const y = 30 + i * 5.5;
    const side = i % 2 === 0 ? -1 : 1;
    const wobble = (rand() - 0.5) * 2;
    return (
      <ellipse
        key={i}
        cx={50 + side * 2.6 + wobble}
        cy={y}
        rx={2.4}
        ry={3.2}
        fill={i % 3 === 0 ? c2 : c1}
        opacity={0.9}
      />
    );
  });
  return (
    <g>
      <line x1={50} y1={30} x2={50} y2={82} stroke={c2} strokeWidth={0.8} opacity={0.6} />
      {buds}
    </g>
  );
}

const DECORATION_SHAPES: Record<string, (p: ShapeProps) => React.JSX.Element> = {
  pearl_pin: PearlPin,
  wax_seal: WaxSeal,
  twine: Twine,
  berry_sprig: BerrySprig,
  bow: Bow,
  gold_charm: GoldCharm,
  butterfly: Butterfly,
  dried_lavender: DriedLavender,
};

export function DecorationGraphic({
  shape,
  colors,
  className,
  style,
}: {
  shape: string;
  colors: ShapeColors;
  className?: string;
  style?: CSSProperties;
}) {
  const decorationFn = DECORATION_SHAPES[shape] ?? PearlPin;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      {decorationFn({ colors })}
    </svg>
  );
}
