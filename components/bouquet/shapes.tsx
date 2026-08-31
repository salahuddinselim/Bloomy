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

function Rose({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  return (
    <g>
      {ring(7, 30, 22, c1, 8, 0.9)}
      {ring(6, 21, 18, c2, 38, 1)}
      {ring(5, 13, 13, c1, 15, 1.1)}
      {ring(4, 6, 8, c2, 40, 1.2)}
      <circle cx={50} cy={50} r={2.6} fill={c2} />
    </g>
  );
}

function Tulip({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  return (
    <g>
      <path
        d="M50,50 C30,46 26,20 38,4 C42,14 46,20 50,22 C54,20 58,14 62,4 C74,20 70,46 50,50 Z"
        fill={c1}
      />
      <path
        d="M50,50 C38,44 36,24 44,8 C46,20 48,28 50,32 C52,28 54,20 56,8 C64,24 62,44 50,50 Z"
        fill={c2}
        opacity={0.85}
      />
    </g>
  );
}

function Lily({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? c2;
  return (
    <g>
      {ring(6, 34, 12, c1, 0, 0.7)}
      {ring(6, 26, 9, c2, 30, 0.6, 0.9)}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 60} 50 50)`}>
          <line x1={50} y1={50} x2={50} y2={26} stroke={center} strokeWidth={0.6} />
          <ellipse cx={50} cy={25} rx={1.4} ry={2.2} fill={center} />
        </g>
      ))}
      <circle cx={50} cy={50} r={2.2} fill={center} />
    </g>
  );
}

function Daisy({ colors, seed = "daisy" }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? "#e8b93a";
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
      {ring(14, 26, 7, c1, 0, 0.55)}
      {ring(14, 22, 5.5, c2, 12.8, 0.5, 0.7)}
      <circle cx={50} cy={50} r={7} fill={center} />
      {dots.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={0.6} fill="#000" opacity={0.28} />
      ))}
    </g>
  );
}

function Sunflower({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? "#5c3b1e";
  return (
    <g>
      {ring(18, 32, 8, c1, 0, 0.5)}
      {ring(18, 26, 6.5, c2, 10, 0.5, 0.8)}
      <circle cx={50} cy={50} r={11} fill={center} />
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

function Peony({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  return (
    <g>
      {ring(8, 33, 20, c1, 5, 0.85)}
      {ring(8, 26, 17, c2, 27, 0.9, 0.9)}
      {ring(7, 19, 14, c1, 12, 1)}
      {ring(6, 12, 10, c2, 35, 1.1)}
      {ring(5, 6, 6, c1, 20, 1.2)}
    </g>
  );
}

function Carnation({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  return (
    <g>
      {ring(20, 27, 8, c1, 0, 0.4, 0.9)}
      {ring(20, 22, 7, c2, 9, 0.4, 0.85)}
      {ring(16, 16, 6, c1, 4, 0.4)}
      {ring(12, 9, 5, c2, 15, 0.4)}
    </g>
  );
}

function Hydrangea({ colors, seed = "hydrangea" }: ShapeProps) {
  const rand = mulberry32(hashString(seed));
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const florets = Array.from({ length: 16 }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const r = 8 + rand() * 26;
    const cx = round(50 + Math.cos(angle) * r);
    const cy = round(50 + Math.sin(angle) * r);
    const rot = rand() * 90;
    const fill = i % 2 === 0 ? c1 : c2;
    return (
      <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot}) scale(0.22)`}>
        {ring(4, 30, 26, fill, 0, 1)}
        <circle r={4} fill="#fff7e6" opacity={0.7} />
      </g>
    );
  });
  return <g>{florets}</g>;
}

function Orchid({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? c2;
  const petal = (length: number, width: number, fill: string, angle: number) => (
    <path d={petalPath(length, width)} fill={fill} transform={`rotate(${angle} 50 50)`} />
  );
  return (
    <g>
      {petal(30, 16, c1, 0)}
      {petal(26, 15, c1, 130)}
      {petal(26, 15, c1, 230)}
      {petal(20, 13, c2, 60)}
      {petal(20, 13, c2, 300)}
      <path
        d="M50,50 C42,58 42,70 50,76 C58,70 58,58 50,50 Z"
        fill={center}
      />
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={46 + (i % 3) * 4} cy={62 + Math.floor(i / 3) * 6} r={0.8} fill={c1} opacity={0.6} />
      ))}
    </g>
  );
}

function BabysBreath({ colors, seed = "bb" }: ShapeProps) {
  const rand = mulberry32(hashString(seed));
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const sprigs = Array.from({ length: 7 }, (_, i) => {
    const angle = (i / 7) * Math.PI * 2 + rand();
    const r = 14 + rand() * 20;
    const cx = round(50 + Math.cos(angle) * r);
    const cy = round(50 + Math.sin(angle) * r);
    return (
      <g key={i}>
        <line x1={50} y1={50} x2={cx} y2={cy} stroke={c2} strokeWidth={0.4} opacity={0.5} />
        <g transform={`translate(${cx} ${cy}) scale(0.12)`}>{ring(5, 30, 26, c1, 0, 1)}</g>
      </g>
    );
  });
  return <g>{sprigs}</g>;
}

function Lavender({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const buds = Array.from({ length: 12 }, (_, i) => {
    const y = 12 + i * 6.5;
    const side = i % 2 === 0 ? -1 : 1;
    return (
      <ellipse
        key={i}
        cx={50 + side * 3.4}
        cy={y}
        rx={3.4}
        ry={4.4}
        fill={i % 3 === 0 ? c2 : c1}
        transform={`rotate(${side * 18} ${50 + side * 3.4} ${y})`}
      />
    );
  });
  return <g>{buds}</g>;
}

function Daffodil({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? c2;
  return (
    <g>
      {ring(6, 28, 15, c1, 0, 0.6)}
      {ring(6, 22, 12, c2, 30, 0.55, 0.85)}
      <ellipse cx={50} cy={50} rx={11} ry={13} fill={center} />
      <ellipse cx={50} cy={47} rx={8} ry={9.5} fill={c2} opacity={0.6} />
    </g>
  );
}

function Blossom({ colors }: ShapeProps) {
  const c1 = colors.primary;
  const c2 = colors.secondary ?? colors.primary;
  const center = colors.center ?? c2;
  return (
    <g>
      {ring(5, 20, 17, c1, 0, 0.75)}
      {ring(5, 15, 13, c2, 36, 0.7, 0.8)}
      <circle cx={50} cy={50} r={3.5} fill={center} />
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
