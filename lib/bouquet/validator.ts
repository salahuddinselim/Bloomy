import { LIMITS, type Bouquet, type BouquetElement, type CardPaper, type FlowerStoryEntry, type RevealStyle } from "./types";
import { getWrapper } from "@/data/wrappers";
import { getRibbon } from "@/data/ribbons";
import { getPresentation } from "@/data/presentations";
import { getAssetDef } from "@/components/bouquet/BouquetAsset";

const REVEAL_STYLES: RevealStyle[] = ["gift_box", "envelope", "curtain", "minimal"];
const CARD_PAPERS: CardPaper[] = ["paper", "parchment", "ivory", "blush", "kraft", "sage", "champagne", "slate"];
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001F\\u007F]", "g");

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

/** Strips control characters / HTML tags from freeform user text. */
function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(CONTROL_CHARS, "")
    .replace(/<[^>]*>/g, "")
    .slice(0, maxLength)
    .trim();
}

function sanitizeElement(raw: unknown): BouquetElement | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const type = typeof r.type === "string" ? r.type : null;
  if (!type) return null;

  const def = getAssetDef(type);
  if (!def) return null;

  // The element's category is derived from the canonical asset definition, not
  // the (possibly stale) value stored in the URL. This lets old share links —
  // e.g. a baby's breath that was once a "flower" — migrate cleanly.
  const category = def.category;

  const x = isFiniteNumber(r.x) ? Math.min(100, Math.max(0, r.x)) : null;
  const y = isFiniteNumber(r.y) ? Math.min(100, Math.max(0, r.y)) : null;
  if (x === null || y === null) return null;

  const scale = isFiniteNumber(r.scale) ? Math.min(2.2, Math.max(0.3, r.scale)) : def.defaultScale;
  const rotation = isFiniteNumber(r.rotation) ? ((r.rotation % 360) + 360) % 360 : 0;
  const z = isFiniteNumber(r.z) ? Math.min(999, Math.max(0, Math.round(r.z))) : 0;
  const id = typeof r.id === "string" && r.id.length <= 64 ? r.id : `el_${Math.random().toString(36).slice(2, 10)}`;

  return { id, type, category, x, y, scale, rotation, z };
}

export interface ValidationResult {
  valid: boolean;
  bouquet?: Bouquet;
  error?: string;
}

/**
 * Validates and clamps an arbitrary decoded payload into a safe Bouquet.
 * Never trusts URL-supplied data: unknown fields are dropped, sizes are
 * capped, and unknown asset ids are filtered out rather than rendered.
 */
export function validateBouquet(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== "object") {
    return { valid: false, error: "malformed" };
  }
  const r = raw as Record<string, unknown>;

  if (r.version !== 1) {
    return { valid: false, error: "unsupported_version" };
  }

  const elementsRaw = Array.isArray(r.elements) ? r.elements : [];
  const elements = elementsRaw
    .slice(0, LIMITS.MAX_FLOWERS + LIMITS.MAX_FOLIAGE + LIMITS.MAX_DECORATIONS)
    .map(sanitizeElement)
    .filter((e): e is BouquetElement => e !== null);

  const flowerCount = elements.filter((e) => e.category === "flower").length;
  const foliageCount = elements.filter((e) => e.category === "foliage").length;
  const decorationCount = elements.filter((e) => e.category === "decoration").length;
  if (flowerCount > LIMITS.MAX_FLOWERS || foliageCount > LIMITS.MAX_FOLIAGE || decorationCount > LIMITS.MAX_DECORATIONS) {
    return { valid: false, error: "too_many_elements" };
  }

  const wrapperId = typeof r.wrapper === "string" ? r.wrapper : "";
  const ribbonId = typeof r.ribbon === "string" ? r.ribbon : "";
  const wrapper = getWrapper(wrapperId).id;
  const ribbon = getRibbon(ribbonId).id;

  const revealStyle = REVEAL_STYLES.includes(r.revealStyle as RevealStyle)
    ? (r.revealStyle as RevealStyle)
    : "gift_box";

  const cardPaper = CARD_PAPERS.includes(r.cardPaper as CardPaper)
    ? (r.cardPaper as CardPaper)
    : "paper";

  const presentation = typeof r.presentation === "string" && getPresentation(r.presentation)
    ? r.presentation
    : undefined;

  const story = Array.isArray(r.story)
    ? r.story
        .slice(0, LIMITS.MAX_STORY_ENTRIES)
        .map((raw): FlowerStoryEntry | null => {
          if (!raw || typeof raw !== "object") return null;
          const s = raw as Record<string, unknown>;
          const flowerId = typeof s.flowerId === "string" ? s.flowerId : "";
          if (!getAssetDef(flowerId) || getAssetDef(flowerId)?.category !== "flower") return null;
          const count = typeof s.count === "number" && Number.isFinite(s.count)
            ? Math.min(LIMITS.MAX_STORY_COUNT, Math.max(1, Math.round(s.count)))
            : 1;
          const personalNote = sanitizeText(s.personalNote, LIMITS.MAX_STORY_NOTE);
          return { flowerId, count, personalNote };
        })
        .filter((e): e is FlowerStoryEntry => e !== null)
    : undefined;

  const bouquet: Bouquet = {
    version: 1,
    recipient: sanitizeText(r.recipient, LIMITS.MAX_RECIPIENT),
    sender: sanitizeText(r.sender, LIMITS.MAX_SENDER),
    message: sanitizeText(r.message, LIMITS.MAX_MESSAGE),
    elements,
    wrapper,
    ribbon,
    background: typeof r.background === "string" ? r.background.slice(0, 40) : "warm_ivory",
    revealStyle,
    mono: r.mono === true,
    cardPaper,
    ...(presentation ? { presentation } : {}),
    ...(story && story.length > 0 ? { story } : {}),
    ...(typeof r.title === "string"
      ? { title: sanitizeText(r.title, LIMITS.MAX_TITLE) }
      : {}),
    ...(typeof r.signatureTheme === "string"
      ? { signatureTheme: sanitizeText(r.signatureTheme, 64) }
      : {}),
  };

  return { valid: true, bouquet };
}
