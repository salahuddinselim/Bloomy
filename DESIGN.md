---
name: Bloomly
description: A digital flower studio for sending realistic, database-free bouquets through a link
colors:
  oxblood: "#6b1f2a"
  oxblood-deep: "#4a1420"
  sage-leaf: "#8a9a7e"
  sage-leaf-deep: "#5f6f52"
  dusty-petal: "#c98a92"
  warm-ivory: "#faf6ef"
  warm-ivory-deep: "#f2ead9"
  paper: "#fffdf9"
  charcoal: "#2a2521"
  charcoal-soft: "#524a43"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.875rem, 4vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "normal"
  script:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(1.125rem, 2vw, 1.5rem)"
    fontWeight: 500
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  pill: "9999px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.warm-ivory}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.oxblood-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-soft}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
---

# Design System: Bloomly

## Overview

**Creative North Star: "The Pressed Flower Keepsake"**

Bloomly should feel like something kept between the pages of a book, not like a SaaS dashboard with flower emoji glued on. The chrome around the bouquet is deliberately quiet: warm paper tones, a single deep accent color used with real restraint, hairline borders instead of drop-shadowed cards. The illustrated bouquet itself carries all the color and detail; everything else — buttons, panels, type — steps back so the gift stays the visual hero of every screen it appears on.

This is an emotional-gift product, not a florist inventory tool. Density and cleverness lose to warmth and unhurriedness at every decision point. The one confirmed rejection: no cartoon or emoji flowers, no generic dashboard patterns (heavy card grids, loud gradients, bright multi-color UI chrome).

**Key Characteristics:**
- A warm ivory paper world with one deep accent color, spent sparingly
- Flat, bordered surfaces at rest; shadow reserved for things meant to feel physically lifted
- Serif display and script type carry emotion; sans-serif carries function
- Soft pill shapes for every actionable control; soft rounded rectangles for containers
- The bouquet illustration is the only place saturated color is allowed to live freely

## Colors

A warm, paper-toned neutral field with a single deep accent — restraint is the point, not a limitation.

### Primary
- **Oxblood** (#6b1f2a): The one accent. Primary CTAs ("Create a Bouquet", "Generate Share Link"), selected states (active reveal-style card, active tab, active swatch ring), and the ribbon/wrap motif that ties the editor chrome back to the product itself. Darkens to **Oxblood Deep** (#4a1420) on hover/press.

### Secondary
- **Sage Leaf** (#8a9a7e) / **Sage Leaf Deep** (#5f6f52): Botanical accents only — reserved for foliage-adjacent moments, never used as UI chrome color.
- **Dusty Petal** (#c98a92): A soft secondary accent used sparingly (e.g. blush background option, occasional highlight), never as a competing CTA color to Oxblood.

### Neutral
- **Warm Ivory** family — one warm-neutral scale at three depths, not three unrelated colors: **Warm Ivory** (#faf6ef, page background), **Warm Ivory Deep** (#f2ead9, alternating section backgrounds and subtle fills), **Paper** (#fffdf9, card and panel surfaces sitting just above the page).
- **Charcoal** (#2a2521): Primary text color.
- **Charcoal Soft** (#524a43): Secondary text, labels, muted copy.

### Named Rules
**The One Accent Rule.** Oxblood appears only on primary actions and active/selected states. It is never used decoratively or as a section background. If a screen has more than one saturated color competing for attention outside the bouquet illustration itself, that's a violation.

**The Hairline-Not-Card Rule.** Container edges are drawn with `charcoal` at 8–25% opacity (`border-charcoal/8` through `border-charcoal/25` in the current Tailwind implementation), not with heavier borders or colored fills. This is what keeps flat surfaces from reading as gray SaaS cards.

## Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Script/Accent Font:** Cormorant Garamond, italic (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** A confident serif display paired with an even quieter serif-italic for emotional moments, both resting on a completely unadorned sans-serif for every functional UI string. The pairing should never feel decorative for its own sake — every serif appearance is either a headline or a genuinely personal line (a recipient's name, a written message).

### Hierarchy
- **Display** (weight 600–700, `clamp(1.875rem, 4vw, 3.75rem)`, line-height 1.1): Page/section headlines — the landing hero, "Your bouquet is ready.", page titles.
- **Script** (weight 500, italic, `clamp(1.125rem, 2vw, 1.5rem)`): The one place emotion is typographically foregrounded — "For {recipient}", the brand wordmark, quoted messages on the reveal.
- **Body** (weight 400, 1rem–1.125rem, line-height 1.5): All descriptive copy, paragraph text.
- **Label** (weight 400–500, 0.75rem–0.875rem): Form labels, tab chips, captions, helper text — always Inter, never the display face.

### Named Rules
**The Display-For-Emotion Rule.** Playfair Display and Cormorant Garamond are reserved for headlines and genuinely personal content (a name, a message, a moment of reveal). Every button, tab, form label, and piece of UI chrome stays in Inter — mixing the display face into functional UI is the fastest way to make the product feel like a wedding invitation template rather than a tool.

## Layout

Generous, unhurried spacing throughout — landing sections run roughly 96px of vertical padding (`py-16` to `py-24`) on desktop, collapsing gracefully on mobile. Content is centered in a max-width container (typically `max-w-6xl` for marketing sections, `max-w-sm`/`max-w-lg` for the bouquet card itself, since the bouquet's own aspect ratio — not the viewport — should dictate its size).

The editor is the one genuinely dense layout: a three-pane desktop grid (asset library / canvas / properties) that collapses on mobile to a single-column canvas with a bottom tab bar and bottom-sheet panels rather than a shrunk version of the desktop chrome. The recipient reveal page is the opposite of dense: full-screen, centered, single-column, no navigation chrome at all.

## Elevation & Depth

The system is flat by default. Containers are distinguished with a hairline border, not a shadow. Shadow is reserved for elements that are meant to feel physically separate from the page: the bouquet canvas itself, floating selection controls, and modal/sheet overlays.

### Shadow Vocabulary
- **Ambient lift** (`shadow-sm`): Subtle resting elevation on small interactive tiles (asset picker buttons) — barely perceptible, just enough to read as touchable.
- **Card float** (`shadow-lg`): The share-page bouquet card, floating action clusters (the selected-element control pill).
- **Hero presence** (`shadow-xl`): The bouquet canvas on the landing hero and the pulsing "open your gift" invitation button — reserved for the single most important object on a screen.
- **Overlay** (`shadow-2xl`): Modals (QR code dialog) and the mobile bottom sheet.
- **Stage depth** (`shadow-[inset_0_0_60px_rgba(0,0,0,0.06)]`): An inset vignette inside the bouquet canvas itself, giving the illustration a sense of sitting inside a shallow stage rather than pasted flat on the background.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat and bordered at rest. Shadow is a deliberate signal that something is meant to feel lifted off the page — the bouquet, a floating control, a modal — never a default treatment for ordinary panels or cards.

## Shapes

Two families only, applied consistently: **pill** (`rounded-full`) for every actionable control — primary/secondary buttons, tabs, swatches, badges, the floating control cluster — and **soft rectangle** (`rounded-lg` 8px for inputs, `rounded-xl` 12px for asset tiles and small cards, `rounded-2xl` 16px for the bouquet canvas and larger panels, `rounded-3xl` 24px for the mobile bottom sheet) for everything that contains content. No sharp corners appear anywhere in the system.

### Named Rules
**The Soft Pill Rule.** If it's clickable and text-shaped (a button, tab, swatch, badge), it's a pill. If it's a container, it's a soft rectangle scaled to its size. Nothing in between.

## Components

Buttons, cards, and inputs should feel **refined and unhurried** — generous padding, soft shapes, gentle hover transitions. Nothing snappy, nothing aggressive; the interaction pacing should match the emotional, gift-giving context rather than a productivity tool's urgency.

### Buttons
- **Shape:** Full pill (`rounded-full`, 9999px) for every button in the system, no exceptions.
- **Primary:** Oxblood background, warm-ivory text, `px-4 to px-7 py-2 to py-3.5` depending on prominence. Darkens to Oxblood Deep on hover.
- **Secondary / Ghost:** Transparent or white/60% background, `charcoal-soft` text, hairline `border-charcoal/15` border; hover shifts border and text to Oxblood at reduced opacity (`border-burgundy/40`, `text-burgundy`) rather than filling with color.
- **Icon buttons** (floating controls): Solid `charcoal` circle with ivory icon, hover shifts to Oxblood — used only inside the transient floating control cluster, never as a standalone page action.

### Cards / Containers
- **Corner style:** 12–16px radius depending on size (see Shapes).
- **Background:** Paper (#fffdf9) or white at reduced opacity over the ivory page, never a distinct "card gray."
- **Border:** Hairline `charcoal` at 8–12% opacity; this is the primary way containers separate from the page, not shadow.
- **Shadow:** None at rest; `shadow-md`/`shadow-lg` only on hover-lift for interactive cards (presets) or when the card is a genuinely floating object (share card).
- **Internal padding:** 16–24px typical.

### Inputs / Fields
- **Style:** Paper background, hairline `border-charcoal/12`, 8px radius.
- **Focus:** Border shifts to full-opacity Oxblood — no glow, no ring, just a color-shift on the existing hairline.

### Navigation / Tabs
- **Style:** Pill-shaped segmented buttons (category tabs in the editor, occasion chips on the landing page); inactive state is `charcoal` at 5% background with `charcoal-soft` text, active state is solid `charcoal` (editor tabs) or solid Oxblood (primary selection state) with ivory text.
- **Mobile:** A fixed bottom tab bar (text-only, no icons) triggers a bottom sheet rather than navigating away from the canvas.

### The Bouquet Canvas (signature component)
The one component allowed genuine visual richness. A soft-cornered stage (`rounded-2xl`) with a warm gradient background, subtle grain texture, and an inset stage-depth shadow. The wrapped bouquet — paper wrap, ribbon, layered stems, and illustrated blooms — sits centered within it. Every other component in the system exists to frame this one without competing with it.

## Do's and Don'ts

### Do:
- **Do** keep Oxblood to primary actions and active/selected states only (The One Accent Rule).
- **Do** use hairline `charcoal`-opacity borders instead of shadows for ordinary flat containers.
- **Do** reserve Playfair Display / Cormorant Garamond for headlines and genuinely personal content; keep every functional UI string in Inter.
- **Do** make every clickable, text-shaped control a full pill.
- **Do** let the bouquet illustration carry the system's only saturated, varied color.
- **Do** keep the recipient reveal page free of navigation chrome — full-screen and single-column, always.

### Don't:
- **Don't** introduce cartoon or emoji flower imagery anywhere in the product.
- **Don't** tint the overall UI pink/rose — the page chrome stays warm-neutral with a sparse accent, never "all pink."
- **Don't** add drop shadows to ordinary bordered panels; shadow is reserved for objects meant to feel physically lifted.
- **Don't** use sharp square corners on any container or control.
- **Don't** mix the display/script serif faces into buttons, tabs, labels, or any other functional UI text.
