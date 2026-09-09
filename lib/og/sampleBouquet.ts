import type { Bouquet } from "@/lib/bouquet/types";
import { elementsFromIds } from "@/lib/bouquet/build";
import { DEFAULT_BOUQUET_FLOWER_IDS } from "@/lib/bouquet/build";

/**
 * The bouquet shown on the site-wide social card (`/og`) and as the fallback
 * for unreadable tokens. Classic romance: burgundy roses, peony, baby's breath
 * and eucalyptus — the same full hand-tied dome the builder starts with, so
 * the fallback matches what a real linked bouquet looks like.
 */
export function sampleBouquet(): Bouquet {
  return {
    version: 1,
    recipient: "a very special person",
    sender: "a secret admirer",
    message: "Some flowers fade, but what I feel for you never will.",
    elements: elementsFromIds(DEFAULT_BOUQUET_FLOWER_IDS),
    wrapper: "cream_paper",
    ribbon: "silk_burgundy",
    background: "warm_ivory",
    revealStyle: "gift_box",
    mono: false,
    cardPaper: "paper",
  };
}