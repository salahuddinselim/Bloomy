import type { Bouquet, BouquetElement, CardPaper, RevealStyle } from "./types";
import { LIMITS } from "./types";
import { clamp } from "@/lib/utils";
import { getAssetDef } from "@/components/bouquet/BouquetAsset";
import { createElement, autoArrange, genId } from "./composer";

export type BouquetAction =
  | { type: "ADD_ELEMENT"; assetId: string }
  | { type: "REMOVE_ELEMENT"; id: string }
  | { type: "MOVE_ELEMENT"; id: string; x: number; y: number }
  | { type: "ROTATE_ELEMENT"; id: string; rotation: number }
  | { type: "SCALE_ELEMENT"; id: string; scale: number }
  | { type: "DUPLICATE_ELEMENT"; id: string }
  | { type: "BRING_FORWARD"; id: string }
  | { type: "SEND_BACKWARD"; id: string }
  | { type: "SET_WRAPPER"; wrapper: string }
  | { type: "SET_RIBBON"; ribbon: string }
  | { type: "SET_BACKGROUND"; background: string }
  | { type: "SET_MESSAGE"; message: string }
  | { type: "SET_RECIPIENT"; recipient: string }
  | { type: "SET_SENDER"; sender: string }
  | { type: "SET_REVEAL_STYLE"; revealStyle: RevealStyle }
  | { type: "SET_MONO"; mono: boolean }
  | { type: "SET_CARD_PAPER"; cardPaper: CardPaper }
  | { type: "ARRANGE_FOR_ME" }
  | { type: "APPLY_PRESET"; elements: BouquetElement[]; wrapper: string; ribbon: string }
  | { type: "RESET_BOUQUET"; bouquet: Bouquet }
  | { type: "LOAD_BOUQUET"; bouquet: Bouquet };

function countInCategory(elements: BouquetElement[], category: string) {
  return elements.filter((e) => e.category === category).length;
}

export function bouquetReducer(state: Bouquet, action: BouquetAction): Bouquet {
  switch (action.type) {
    case "ADD_ELEMENT": {
      const def = getAssetDef(action.assetId);
      if (!def) return state;
      const limit =
        def.category === "flower"
          ? LIMITS.MAX_FLOWERS
          : def.category === "foliage"
          ? LIMITS.MAX_FOLIAGE
          : LIMITS.MAX_DECORATIONS;
      if (countInCategory(state.elements, def.category) >= limit) return state;
      const el = createElement(def, state.elements);
      return { ...state, elements: [...state.elements, el] };
    }
    case "REMOVE_ELEMENT":
      return { ...state, elements: state.elements.filter((e) => e.id !== action.id) };
    case "MOVE_ELEMENT":
      return {
        ...state,
        elements: state.elements.map((e) =>
          e.id === action.id
            ? { ...e, x: clamp(action.x, 2, 98), y: clamp(action.y, 2, 96) }
            : e
        ),
      };
    case "ROTATE_ELEMENT":
      return {
        ...state,
        elements: state.elements.map((e) =>
          e.id === action.id ? { ...e, rotation: ((action.rotation % 360) + 360) % 360 } : e
        ),
      };
    case "SCALE_ELEMENT":
      return {
        ...state,
        elements: state.elements.map((e) =>
          e.id === action.id ? { ...e, scale: clamp(action.scale, 0.4, 2) } : e
        ),
      };
    case "DUPLICATE_ELEMENT": {
      const original = state.elements.find((e) => e.id === action.id);
      if (!original) return state;
      const limit =
        original.category === "flower"
          ? LIMITS.MAX_FLOWERS
          : original.category === "foliage"
          ? LIMITS.MAX_FOLIAGE
          : LIMITS.MAX_DECORATIONS;
      if (countInCategory(state.elements, original.category) >= limit) return state;
      const copy: BouquetElement = {
        ...original,
        id: genId(),
        x: clamp(original.x + 5, 2, 98),
        y: clamp(original.y + 4, 2, 96),
      };
      return { ...state, elements: [...state.elements, copy] };
    }
    case "BRING_FORWARD":
      return {
        ...state,
        elements: state.elements.map((e) =>
          e.id === action.id ? { ...e, z: e.z + 5 } : e
        ),
      };
    case "SEND_BACKWARD":
      return {
        ...state,
        elements: state.elements.map((e) =>
          e.id === action.id ? { ...e, z: Math.max(0, e.z - 5) } : e
        ),
      };
    case "SET_WRAPPER":
      return { ...state, wrapper: action.wrapper };
    case "SET_RIBBON":
      return { ...state, ribbon: action.ribbon };
    case "SET_BACKGROUND":
      return { ...state, background: action.background };
    case "SET_MESSAGE":
      return { ...state, message: action.message.slice(0, LIMITS.MAX_MESSAGE) };
    case "SET_RECIPIENT":
      return { ...state, recipient: action.recipient.slice(0, LIMITS.MAX_RECIPIENT) };
    case "SET_SENDER":
      return { ...state, sender: action.sender.slice(0, LIMITS.MAX_SENDER) };
    case "SET_REVEAL_STYLE":
      return { ...state, revealStyle: action.revealStyle };
    case "SET_MONO":
      return { ...state, mono: action.mono };
    case "SET_CARD_PAPER":
      return { ...state, cardPaper: action.cardPaper };
    case "ARRANGE_FOR_ME": {
      const items = state.elements
        .map((e) => ({ def: getAssetDef(e.type) }))
        .filter((i): i is { def: NonNullable<typeof i.def> } => Boolean(i.def));
      return { ...state, elements: autoArrange(items) };
    }
    case "APPLY_PRESET":
      return { ...state, elements: action.elements, wrapper: action.wrapper, ribbon: action.ribbon };
    case "RESET_BOUQUET":
    case "LOAD_BOUQUET":
      return action.bouquet;
    default:
      return state;
  }
}
