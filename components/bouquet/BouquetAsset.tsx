import { FLOWERS } from "@/data/flowers";
import { FOLIAGE } from "@/data/foliage";
import { DECORATIONS } from "@/data/decorations";
import { FlowerBloom, FoliageGraphic, DecorationGraphic } from "./shapes";
import type { ElementCategory } from "@/lib/bouquet/types";
import type { CSSProperties } from "react";

const ALL = [...FLOWERS, ...FOLIAGE, ...DECORATIONS];

export function getAssetDef(type: string) {
  return ALL.find((a) => a.id === type);
}

export function BouquetAsset({
  type,
  category,
  className,
  style,
}: {
  type: string;
  category: ElementCategory;
  className?: string;
  style?: CSSProperties;
}) {
  const def = getAssetDef(type);
  if (!def) return null;

  if (category === "flower") {
    return (
      <FlowerBloom shape={def.shape} colors={def.colors} seed={def.id} className={className} style={style} />
    );
  }
  if (category === "foliage") {
    return <FoliageGraphic shape={def.shape} colors={def.colors} className={className} style={style} />;
  }
  return <DecorationGraphic shape={def.shape} colors={def.colors} className={className} style={style} />;
}
