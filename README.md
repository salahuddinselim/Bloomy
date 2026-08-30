# Bloomly

**Create a beautiful digital bouquet, write a personal message, and send it to
someone special.** Free, no account, no database — the link **is** the bouquet.
Every flower, wrapper, ribbon and word lives in the URL itself, so nothing is
ever stored.

Opens as a soft, animated reveal in the recipient's browser, and every share
gets a real 1200×630 social card drawn from the **exact same SVG art** the
sender arranged — so WhatsApp, Telegram and iMessage show the bouquet before
anyone even clicks.

Inspired by the warm, editorial feel of [digibouquet.org](https://digibouquet.org/).

## How it works

1. **Create** — pick a wrapper, ribbon and background, then compose a bouquet
   from a dozen painterly, photo-real blooms plus greenery and decorations.
   Drag each stem into place, rotate and scale it over a live canvas, and
   finish with a recipient, sender and message. Style it further with a
   **color or monochrome** palette and choose the **note card paper** (paper,
   parchment, ivory, blush).
2. **Share** — the whole layout is serialized (lz-string, URL-safe) into a
   compact token and handed over as a plain link, a QR code, a **keepsake PNG,
   or an animated looping GIF**, plus one-tap native share. No accounts, no
   sync, no server round-trips to edit.
3. **Reveal** — `/b/<token>` plays an animated entrance of the bouquet and the
   note. The per-bouquet social preview is generated server-side with
   `next/og` from the shared SVG components, so the thumbnail is never a
   generic screenshot.

## Visual presentation

The design language is **"The Pressed Flower Keepsake"** — Bloomly feels like
something kept between the pages of a book, not a SaaS dashboard with flower
emoji.

> Warm paper tones, a single deep accent color spent sparingly, hairline
> borders instead of drop-shadowed cards. The illustrated bouquet carries all
> the color and detail; the chrome around it steps back so the gift stays the
> visual hero of every screen.

### Palette

A warm, paper-toned neutral field with one restrained accent:

| Role | Color | Hex | Where it lives |
| --- | --- | --- | --- |
| Accent | **Oxblood** | `#6b1f2a` | Primary CTAs, active states, the ribbon motif. The only saturated UI color. |
| Accent hover | **Oxblood Deep** | `#4a1420` | Press/hover of primary actions. |
| Neutral | **Warm Ivory** | `#faf6ef` | Page background. |
| Neutral | **Warm Ivory Deep** | `#f2ead9` | Alternating sections, subtle fills. |
| Neutral | **Paper** | `#fffdf9` | Card and panel surfaces. |
| Text | **Charcoal / Soft** | `#2a2521` / `#524a43` | Headlines / secondary copy. |
| Botanical only | **Sage Leaf** | `#8a9a7e` | Foliage accents, never UI chrome. |

**The One Accent Rule** — oxblood appears only on primary actions and active
states. **The Hairline-Not-Card Rule** — containers are edged with `charcoal`
at 8–25% opacity, not heavy borders or fills. The bouquet illustration is the
only place saturated color is allowed to live freely.

### Typography

- **Playfair Display** (with Georgia fallback) — display type, headlines,
  names, "A DIGITAL BOUQUET".
- **Cormorant Garamond**, italic — the personal, handwritten-feel accent at
  the heart of the message.
- **Inter** — labels, UI chrome, body copy. Serif carries emotion; sans-serif
  carries function.

### The bouquet art

Every flower is a **painterly, photo-real raster cutout** — twelve digibouquet-style
blooms (rose, peony, dahlia, anemone, ranunculus, orchid, carnation, zinnia, daisy,
sunflower, tulip, lily) plus three greenery bases (eucalyptus, fern, baby's breath) as
transparent webp art. Each bloom carries its language-of-flowers meaning. In the DOM they
render as `<img>` with a CSS grayscale filter for monochrome mode; in the social card the
same cutouts are downscaled to PNG data URIs with `sharp` (grayscaled server-side for mono
bouquets) so satori embeds the *real* art.

Arranged over five background canvases, eight wrappers (cream, kraft, white, blush,
burgundy, matte black, transparent, vintage) and eight ribbons (silk burgundy, satin red,
satin pink, velvet cream, silk white, thin black, double gold, silk lavender).

The same components render in three places:

1. **The editor canvas** — living preview while arranging (`className` sizing).
2. **The reveal page** — animated entrance for the recipient.
3. **The 1200×630 social card** — `next/og`/satori accepts `style` sizing, so
   the shared components receive `style={{ width: "100%", height: "100%" }}`
   and are re-laid-out with an adaptive fit (fitLayout) that keeps the bouquet
   between the eyebrow and the message plate at any scale.
   *Note: vector decorations are layered as function components under the
   `<svg>` subtree (plain render functions emitting raw host elements) so
   satori doesn't drop them; raster assets use `imageMap` data URIs.*

### The social card

1200×630. A soft 165° gradient background, a letter-spaced
`A DIGITAL BOUQUET` eyebrow, the bouquet **contained in its paper cone with
its ribbon** (matching the sender's wrapper/ribbon choice), and a cream caption
plate floating at the bottom holding *"For {recipient}"*, the italic message,
and *sender · bloomly*.

## Featured routes

| Route | Purpose |
| --- | --- |
| `/` | Landing + occasion picker + card-message teaser |
| `/create` | Bouquet editor (drag / rotate / scale canvas, palette + card paper) |
| `/quotes` | Card message library — 6 categories, each drops into `/create` via `?quote=` |
| `/s/<token>` | Post-create share page — copy link, QR, PNG, **GIF**, native share, socials |
| `/b/<token>` | Recipient's reveal page |
| `/b/<token>/opengraph-image` | Per-bouquet social card |
| `/opengraph-image` | Site-level social card |
| `/privacy`, `/terms` | Legal pages |

## Tech

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**, Tailwind CSS
- **`lz-string`** — token compression (pure-JS, decode server-side with
  `%2B`-corruption recovery)
- **`next/og` / satori** — real-time social previews from shared SVG art
- **`html-to-image`** — PNG export of the bouquet card
- **`gifenc`** — animated GIF export (shared palette, geometric-only loop)
- **`qrcode`** — share QRs
- **`sharp`** — raster flower artwork → PNG data URIs for the satori social card

## Developing

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> Windows note: run the dev server as `npm.cmd run dev` if plain `npm` fails
> to resolve.

## Checking

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deploy

Any Node host works — the app is fully static-capable. Set
`NEXT_PUBLIC_SITE_URL` to your production origin so open graph URLs resolve
correctly; Vercel sets this automatically via `VERCEL_URL`.