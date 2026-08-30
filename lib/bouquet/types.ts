export type ElementCategory = "flower" | "foliage" | "decoration";

export type FlowerShape =
  | "rose"
  | "tulip"
  | "lily"
  | "daisy"
  | "sunflower"
  | "peony"
  | "carnation"
  | "hydrangea"
  | "orchid"
  | "babys_breath"
  | "lavender"
  | "daffodil"
  | "blossom"
  | "dahlia"
  | "anemone"
  | "zinnia"
  | "ranunculus";

export type FoliageShape = "eucalyptus" | "fern" | "olive" | "ruscus" | "ivy" | "leaf" | "babys_breath";

export type DecorationShape = "pearl_pin" | "wax_seal" | "twine" | "berry_sprig";

export interface AssetDef {
  id: string;
  name: string;
  category: ElementCategory;
  shape: FlowerShape | FoliageShape | DecorationShape;
  /** Raster artwork (a transparent webp cutout) used instead of the vector shape. */
  image?: string;
  colors: {
    primary: string;
    secondary?: string;
    center?: string;
  };
  defaultScale: number;
  defaultRotation: number;
  tags: string[];
  layerHint: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface WrapperDef {
  id: string;
  name: string;
  colors: { base: string; shadow: string; highlight: string };
  texture: "smooth" | "kraft" | "vintage" | "textured" | "sheer";
}

export interface RibbonDef {
  id: string;
  name: string;
  color: string;
  finish: "satin" | "velvet" | "silk" | "thin" | "double";
}

export interface BouquetElement {
  id: string;
  type: string;
  category: ElementCategory;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  z: number;
}

export type RevealStyle = "gift_box" | "envelope" | "curtain" | "minimal";

/** The paper stock the note card is printed on. */
export type CardPaper = "paper" | "parchment" | "ivory" | "blush";

export interface Bouquet {
  version: 1;
  recipient: string;
  sender: string;
  message: string;
  elements: BouquetElement[];
  wrapper: string;
  ribbon: string;
  background: string;
  revealStyle: RevealStyle;
  mono: boolean;
  cardPaper: CardPaper;
}

export const LIMITS = {
  MAX_FLOWERS: 40,
  MAX_FOLIAGE: 30,
  MAX_DECORATIONS: 20,
  MAX_MESSAGE: 500,
  MAX_RECIPIENT: 100,
  MAX_SENDER: 100,
  MAX_URL_LENGTH: 6000,
} as const;

export function createEmptyBouquet(): Bouquet {
  return {
    version: 1,
    recipient: "",
    sender: "",
    message: "",
    elements: [],
    wrapper: "cream_paper",
    ribbon: "silk_burgundy",
    background: "warm_ivory",
    revealStyle: "gift_box",
    mono: false,
    cardPaper: "paper",
  };
}
