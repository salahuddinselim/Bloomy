import { FLOWERS, LEGACY_FLOWERS } from "@/data/flowers";
import { FOLIAGE, LEGACY_FOLIAGE } from "@/data/foliage";
import { DECORATIONS } from "@/data/decorations";
import { FlowerBloom, FoliageGraphic, DecorationGraphic } from "./shapes";
import { monoColors } from "@/lib/bouquet/mono";
import type { ElementCategory } from "@/lib/bouquet/types";
import type { CSSProperties } from "react";

const ALL = [
  ...FLOWERS,
  ...FOLIAGE,
  ...DECORATIONS,
  ...LEGACY_FLOWERS,
  ...LEGACY_FOLIAGE,
];

export function getAssetDef(type: string) {
  return ALL.find((a) => a.id === type);
}

/**
 * One asset, three rendering situations:
 *  - Raster defs (digibouquet-style cutouts) render as <img>. In the DOM the
 *    static path is used directly; in the satori cog card `imageMap` supplies
 *    pre-computed data URIs (sharp output, mono handled server-side).
 *  - Mono in the DOM is a CSS grayscale filter, which html-to-image also
 *    captures for PNG/GIF exports.
 *  - Vector defs (decorations, unknowns) fall back to the SVG shape artwork.
 */
export function BouquetAsset({
  type,
  category,
  className,
  style,
  mono = false,
  imageMap,
}: {
  type: string;
  category: ElementCategory;
  className?: string;
  style?: CSSProperties;
  mono?: boolean;
  imageMap?: Record<string, string>;
}) {
  const def = getAssetDef(type);
  if (!def) return null;
  const colors = mono ? monoColors(def.colors) : def.colors;

  if (def.image) {
    if (imageMap && imageMap[def.image]) {
      return <img src={imageMap[def.image]} alt="" style={style} />;
    }
    return (
      <img
        src={def.image}
        alt=""
        draggable={false}
        className={className}
        style={{
          objectFit: "contain",
          userSelect: "none",
          ...style,
          ...(mono ? { filter: "grayscale(1)" } : {}),
        }}
      />
    );
  }

  if (category === "flower") {
    return (
      <FlowerBloom shape={def.shape} colors={colors} seed={def.id} className={className} style={style} />
    );
  }
  if (category === "foliage") {
    return <FoliageGraphic shape={def.shape} colors={colors} className={className} style={style} />;
  }
  return <DecorationGraphic shape={def.shape} colors={colors} className={className} style={style} />;
}