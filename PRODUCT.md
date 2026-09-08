# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two roles on the same product:

- **The sender** — anyone who wants to send someone a beautiful, personal digital gift for an occasion (birthday, anniversary, Valentine's Day, congratulations, thank-you, friendship, Mother's/Father's Day, graduation, wedding, apology, get-well, "just because," and more). Not narrowly a couples/romance app — occasion-based gifting in general, romance included as one case among many.
- **The recipient** — opens a shared link with no product knowledge or account, on whatever device and messaging app the sender used (WhatsApp, Messenger, Telegram, email). Most opens happen on a phone.

## Product Purpose

Bloomly lets someone design a realistic digital flower bouquet, write a personal message, and send it as a link. The recipient experiences an emotional, animated reveal and can create their own bouquet to send onward. Success is a sender who feels the result is genuinely beautiful enough to send, and a recipient whose reveal feels like a real gift moment, not a web form.

## Positioning

No account, no login, no database, no backend storage — the entire bouquet (flowers, wrapping, message, recipient/sender names, reveal style) is serialized and compressed into the URL itself. The link *is* the storage. Neighboring "digital gift" products that require sign-up or store data server-side cannot truthfully claim this: nothing to forget a password for, nothing that can be "lost" except the link itself, and no account data collected to send a gift.

## Operating Context

- Sender flow: landing page → `/create` editor (flower/foliage/wrapper/ribbon picker, drag/rotate/scale, "Arrange for me" auto-composition, presets, occasion shortcuts, message/recipient/sender fields, reveal-style choice) → generate link → `/s/[token]` share page (copy link, QR, Web Share, WhatsApp/Telegram/Messenger, PNG export).
- Recipient flow: opens `/b/[token]` cold, no prior context — invitation screen → tap to open → animated reveal → bouquet + message + sender → CTA to create their own.
- Links travel through messaging apps and email, so they must survive copy/paste, redirects, and link-preview crawlers without a server.
- Editor is used on both desktop (3-pane layout) and mobile (bottom-sheet navigation); the reveal page is disproportionately opened on mobile since that's where shared links get tapped.

## Capabilities and Constraints

- 100% client-side: no auth, no user accounts, no database, no required backend API. Any new feature must be assessed against "can this run entirely in the browser?" before being built.
- Bouquet state has hard limits to keep the share URL a reasonable size: 40 flowers, 30 foliage, 20 decorations, 500-char message, 100-char recipient/sender names.
- Flower/foliage/wrapper/ribbon/decoration visuals are original hand-built layered SVG illustrations (gradients, seeded organic variation) rather than photography — no photo asset pipeline exists.
- URL-supplied data is untrusted: decoding validates and clamps every field (asset ids, numeric ranges, text length) rather than trusting it, and fails gracefully to an "invalid link" state rather than crashing.
- Optional localStorage may support in-progress creator drafts, but a shared bouquet link must work standalone — no cookies, no storage dependency for the recipient.
- Ad slots (AdSense, via `components/ads/AdSlot`) are live at creator-bottom (`/create` step 6, after the "Create My Bouquet" button), share-bottom (`/s/[data]`), landing-mid (homepage, between "A gift, not a message" and "Start from a preset"), reveal-bottom (recipient reveal), and extend-link-modal (the short-link extend dialog) — placed after the page's primary moment/CTA, never interrupting a task in progress. In development, `AdSlot` renders a dashed placeholder instead of calling AdSense.

## Brand Commitments

"Bloomly" is a placeholder working name, not a locked identity — treat naming, wordmark, and logo as open for deeper brand work rather than binding constraints. What *is* established and should be preserved unless explicitly revisited: elegant/botanical/premium tone (not a generic SaaS dashboard, not cartoon/emoji flowers), a serif display face paired with a clean sans body, and a restrained palette (warm ivory ground, deep burgundy primary, sage/dusty-rose secondary accents) used sparingly rather than an all-pink product.

## Evidence on Hand

None. No real testimonials, case studies, press, or user research exist yet — future design work must not fabricate any of these.

## Product Principles

1. Emotional experience over feature count — the recipient's reveal moment matters more than how many customization options the editor has.
2. Zero-friction sharing — nothing (account, install, payment) may stand between "I made this" and "they received it."
3. The link is the only durable state — every feature must degrade gracefully to "still works from a cold, storage-less open."
4. Premium and botanical, never cartoon or generic-SaaS — visual quality is a product requirement, not a polish pass.
5. Untrusted by default — anything arriving through a URL is validated and clamped, never trusted outright.

## Accessibility & Inclusion

No formal compliance target (e.g. WCAG certification) is required. Hold to solid baseline practice: keyboard navigation and visible focus states, ARIA labels on all flower/foliage/decoration graphics (they're decorative SVG, not photos, so labels can't rely on alt text alone), sufficient contrast, and respecting `prefers-reduced-motion` for the reveal and editor animations.
