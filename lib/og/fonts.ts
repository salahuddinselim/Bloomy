const FONT_CDN =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Cormorant+Garamond:ital,wght@1,500&display=swap";
// Satori only parses TTF/OTF — ask for the truetype variant via a legacy UA.
const CDN_UA = "Mozilla/5.0 (compatible; Yahoo! Slurp; http://www.yahoo.com/help/site/slurp)";

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
}

let fontPromise: Promise<OgFont[]> | null = null;

/** Loads the display + script fonts once per isolate; falls back to the built-in font if offline. */
export function loadOgFonts(): Promise<OgFont[]> {
  if (!fontPromise) {
    fontPromise = (async () => {
      try {
        const cssRes = await fetch(FONT_CDN, { headers: { "User-Agent": CDN_UA }, cache: "no-store" });
        if (!cssRes.ok) return [];
        const css = await cssRes.text();
        const fonts: OgFont[] = [];
        for (const block of css.split("@font-face").slice(1)) {
          const family = /font-family:\s*'([^']+)'/.exec(block)?.[1];
          const style = /font-style:\s*(\w+)/.exec(block)?.[1] ?? "normal";
          const weight = Number.parseInt(/font-weight:\s*(\d+)/.exec(block)?.[1] ?? "400", 10) as OgFont["weight"];
          const url = /url\((https:\/\/fonts\.gstatic\.com[^)]+\.(?:ttf|otf))\)/.exec(block)?.[1];
          if (!family || !url) continue;
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) continue;
          fonts.push({
            name: family === "Playfair Display" ? "PlayfairDisplay" : "CormorantGaramond",
            data: await res.arrayBuffer(),
            weight,
            style: style === "italic" ? "italic" : "normal",
          });
        }
        return fonts;
      } catch {
        return [];
      }
    })();
  }
  return fontPromise;
}