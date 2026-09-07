import type { Bouquet, BouquetElement } from "@/lib/bouquet/types";
import { getBackground } from "@/data/backgrounds";
import { getCardPaper } from "@/data/cardPaper";
import { WrapperGraphic } from "@/components/bouquet/Wrapper";
import { BouquetAsset } from "@/components/bouquet/BouquetAsset";
import { clipText } from "@/lib/utils";

/*
 * Social preview card for ImageResponse (satori). The flower/wrapper SVGs are
 * the EXACT same components the canvas uses, injected as SVG elements, so the
 * preview matches what the recipient will open. No react-dom/server anywhere —
 * Next 16 forbids it inside route handlers / opengraph-image files.
 *
 * Sizing note: the browser canvas sizes each asset with className="h-full w-full";
 * satori ignores className, so the same components receive an inline style
 * ({ width: "100%", height: "100%" }) which is threaded through to the <svg>.
 */

export const CARD_W = 1200;
export const CARD_H = 630;

/* Flowers must sit between the eyebrow (~80) and the caption plate (~458). */
const TOP_LIM = 140;
const BOT_LIM = 455;

/* Multiplier on top of the canvas's box basis (34 * scale * [2.5 | 3.1]). */
const SIZE_FACTOR = 2.6;

type Line = { left: number; top: number; size: number };

/**
 * Lay the bouquet's flowers out so its bounding box fits between TOP_LIM and
 * BOT_LIM regardless of how tall/wide the bouquet is, keeping the arrangement
 * horizontally centred on the stage the way the editor arranges it.
 */
function fitLayout(elements: BouquetElement[]): Map<string, Line> {
  const sizes = new Map<string, number>();
  for (const el of elements) {
    const basis = el.category === "foliage" ? 3.1 : 2.5;
    sizes.set(el.id, 34 * el.scale * basis * SIZE_FACTOR);
  }
  if (elements.length === 0) return new Map();

  /* Largest A that leaves a 2px slack above and below the whole arrangement. */
  let a = 0;
  for (let candidate = 20; candidate >= 0.05; candidate -= 0.05) {
    let topMin = Infinity;
    let botMax = -Infinity;
    for (const el of elements) {
      const half = (sizes.get(el.id) ?? 0) / 2;
      topMin = Math.min(topMin, candidate * el.y - half);
      botMax = Math.max(botMax, candidate * el.y + half);
    }
    if (TOP_LIM - topMin <= BOT_LIM - botMax) {
      a = candidate;
      break;
    }
  }
  if (a === 0) a = 0.5;

  let topMin = Infinity;
  let botMax = -Infinity;
  for (const el of elements) {
    const half = (sizes.get(el.id) ?? 0) / 2;
    topMin = Math.min(topMin, a * el.y - half);
    botMax = Math.max(botMax, a * el.y + half);
  }
  const b = (TOP_LIM - topMin + (BOT_LIM - botMax)) / 2;

  const out = new Map<string, Line>();
  for (const el of elements) {
    const size = sizes.get(el.id) ?? 0;
    out.set(el.id, {
      left: (el.x / 100) * CARD_W - size / 2,
      top: a * el.y + b - size / 2,
      size,
    });
  }
  return out;
}

export function BouquetCard({
  bouquet,
  imageMap,
}: {
  bouquet: Bouquet;
  /** Pre-computed raster data URIs (sharp) keyed by def.image path. */
  imageMap?: Record<string, string>;
}) {
  const bg = getBackground(bouquet.background);
  const paper = getCardPaper(bouquet.cardPaper);
  const sorted = [...bouquet.elements].sort((x, y) => x.z - y.z);
  const layout = fitLayout(sorted);
  const heading = bouquet.recipient ? `For ${bouquet.recipient}` : "A bouquet for you";
  const message = bouquet.message
    ? clipText(bouquet.message, 110)
    : "I wanted to send you something soft and beautiful.";
  const footer = "BloomStory — digital bouquets never made of pollen";

  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: `linear-gradient(165deg, ${bg.from}, ${bg.to})`,
        overflow: "hidden",
        fontFamily: "PlayfairDisplay",
      }}
    >
      <div style={{ marginTop: 34, fontSize: 22, letterSpacing: 8, color: "rgba(38,32,27,0.55)" }}>
        A DIGITAL BOUQUET
      </div>

      {sorted.map((el) => {
        const line = layout.get(el.id);
        if (!line) return null;
        return (
          <div
            key={el.id}
            style={{
              position: "absolute",
              display: "flex",
              left: line.left,
              top: line.top,
              width: line.size,
              height: line.size,
              transform: `rotate(${el.rotation}deg)`,
            }}
          >
            <BouquetAsset
              type={el.type}
              category={el.category}
              style={{ width: "100%", height: "100%" }}
              mono={bouquet.mono}
              imageMap={imageMap}
            />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          display: "flex",
          left: (CARD_W - 640) / 2,
          top: CARD_H - 462,
          width: 640,
          height: 480,
        }}
      >
        <WrapperGraphic wrapperId={bouquet.wrapper} ribbonId={bouquet.ribbon} style={{ width: "100%", height: "100%" }} mono={bouquet.mono} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          bottom: 42,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 28,
          padding: "22px 48px 26px",
          background: paper.surface,
          boxShadow: "0 18px 48px rgba(40,25,20,0.18)",
        }}
      >
        <div
          style={{ display: "flex", fontSize: 26, fontFamily: "PlayfairDisplay", fontWeight: 700, color: paper.ink }}
        >
          {heading}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 8,
            marginBottom: 10,
            fontSize: 26,
            fontFamily: "CormorantGaramond",
            fontStyle: "italic",
            fontWeight: 500,
            color: paper.inkSoft,
            textAlign: "center",
          }}
        >
          “{message}”
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 16,
            letterSpacing: 3,
            color: paper.inkSoft,
            fontFamily: "PlayfairDisplay",
          }}
        >
          {bouquet.sender ? `${bouquet.sender} · ` : ""}
          {footer}
        </div>
      </div>
    </div>
  );
}