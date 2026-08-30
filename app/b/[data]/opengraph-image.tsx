import { ImageResponse } from "next/og";
import { BouquetCard, CARD_W, CARD_H } from "@/lib/og/BouquetCard";
import { loadOgFonts } from "@/lib/og/fonts";
import { decodeBouquet } from "@/lib/bouquet/encoder";
import { sampleBouquet } from "@/lib/og/sampleBouquet";
import { buildFloraMap } from "@/lib/og/floraImage";
import { getAssetDef } from "@/components/bouquet/BouquetAsset";

export const size = { width: CARD_W, height: CARD_H };
export const contentType = "image/png";

function decodeToken(data: string) {
  try {
    return decodeURIComponent(data);
  } catch {
    return data;
  }
}

/** Per-bouquet social card: whatever the link carries, the preview shows it. */
export default async function Image({ params }: { params: Promise<{ data: string }> }) {
  const { data } = await params;
  const result = decodeBouquet(decodeToken(data));
  const bouquet = result.ok && result.bouquet ? result.bouquet : sampleBouquet();
  const imageMap = await buildFloraMap(bouquet.elements, getAssetDef, bouquet.mono);
  const fonts = await loadOgFonts();
  return new ImageResponse(<BouquetCard bouquet={bouquet} imageMap={imageMap} />, {
    width: CARD_W,
    height: CARD_H,
    fonts: fonts.length > 0 ? fonts : undefined,
  });
}