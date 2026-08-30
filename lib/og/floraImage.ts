import path from "node:path";
import sharp from "sharp";

/*
 * Satori can't fetch network images and only embeds raster reliably as
 * data URIs. These helpers read the digibouquet-style webp cutouts from
 * /public, downscale them with sharp and return base64 PNG data URIs —
 * grayscaled on demand for monochrome bouquets. Results are memoized per
 * process so an OG request only pays the rendering cost once.
 */

const cache = new Map<string, string>();

export async function floraDataUri(
  assetPath: string,
  { mono, side = 320 }: { mono: boolean; side?: number }
): Promise<string> {
  const key = `${assetPath}|${mono}|${side}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const abs = path.join(process.cwd(), "public", assetPath.replace(/^\//, ""));
  let img = sharp(abs).rotate().resize(side, side);
  if (mono) img = img.grayscale();
  const { data } = await img.png().toBuffer({ resolveWithObject: true });

  const uri = `data:image/png;base64,${data.toString("base64")}`;
  cache.set(key, uri);
  return uri;
}

/** Uniquely memoized data URIs for every raster asset a bouquet uses. */
export async function buildFloraMap(
  elements: { type: string; category: string }[],
  getDef: (type: string) => { image?: string } | undefined,
  mono: boolean
): Promise<Record<string, string>> {
  const paths = new Set<string>();
  for (const el of elements) {
    const img = getDef(el.type)?.image;
    if (img) paths.add(img);
  }
  const out: Record<string, string> = {};
  for (const p of paths) {
    out[p] = await floraDataUri(p, { mono });
  }
  return out;
}