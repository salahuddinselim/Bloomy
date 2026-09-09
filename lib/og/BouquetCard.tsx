import type { Bouquet, BouquetElement } from "@/lib/bouquet/types";
import { getAssetDef } from "@/components/bouquet/BouquetAsset";
import { getBackground } from "@/data/backgrounds";
import { getCardPaper } from "@/data/cardPaper";
import { WrapperGraphic } from "@/components/bouquet/Wrapper";
import { BouquetAsset } from "@/components/bouquet/BouquetAsset";
import { clipText } from "@/lib/utils";
import { GATHER_Y } from "@/lib/bouquet/composer";

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

/* Multiplier on top of the canvas's box basis (34 * scale * [2.5 | 3.1]).
   Flowers read large and prominent on the wide card; greenery — already a
   much bigger basis box — gets less so its branch tips stay below the
   eyebrow. */
const SIZE_FACTOR = 2.6;
const FOLIAGE_FACTOR = 1.9;

/* The card replays the SAME composition the editor renders: the wrapped-cone
   artwork is the identical component, so the cone mouth here sits where the
   editor's gather point (GATHER_Y) does. The card wrapper box is 640x480 at
   top 168 (scale 1.6), so the fold lip (viewBox y≈110) lands at card y≈344
   and the opening's center — where stems disappear — is at y≈306. */
const MOUTH_Y = 306;
/* Vertical card px per canvas-%-point beyond the mouth line. Horizontally a
   canvas % is 12px (CARD_W/100); vertically the card is short, so roughly
   half keeps an element's head on the same visual line as in the editor. */
const Y_PX = 6.8;

type Line = { left: number; top: number; size: number; origin: string };

/**
 * Replay the editor's hand-tied dome onto the wide card: every bloom head is
 * anchored on the cone mouth line exactly like the canvas anchors it on the
 * gather, so the bouquet reads as one dome emerging from the wrap instead of
 * a band of flowers floating above it.
 */
function fitLayout(elements: BouquetElement[]): Map<string, Line> {
  const out = new Map<string, Line>();
  for (const el of elements) {
    const def = getAssetDef(el.type);
    const anchorY = def?.anchorY ?? 0.5;
    const factor = el.category === "foliage" ? FOLIAGE_FACTOR : SIZE_FACTOR;
    const size = 34 * el.scale * (el.category === "foliage" ? 3.1 : 2.5) * factor;
    out.set(el.id, {
      left: (el.x / 100) * CARD_W - size / 2,
      top: MOUTH_Y + (el.y - GATHER_Y) * Y_PX - anchorY * size,
      size,
      origin: `50% ${(anchorY * 100).toFixed(1)}%`,
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
              transformOrigin: line.origin,
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