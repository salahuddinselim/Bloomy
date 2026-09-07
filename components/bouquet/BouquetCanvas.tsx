"use client";

import { useCallback, useId, useRef, useState } from "react";
import { clamp } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Bouquet, BouquetElement } from "@/lib/bouquet/types";
import { BouquetAsset, getAssetDef } from "./BouquetAsset";
import { WrapperGraphic } from "./Wrapper";
import { getBackground } from "@/data/backgrounds";
import { cn } from "@/lib/utils";
import { BouquetCard } from "./BouquetCard";
import { BouquetEnvelope } from "./BouquetEnvelope";

const STEM_BASE_X = 50;
const STEM_BASE_Y = 80;

export interface BouquetEnvelopeContent {
  recipient: string;
  title: string;
  message: string;
  sender: string;
  emotion?: string;
  onOpen?: () => void;
}

interface BouquetCanvasProps {
  bouquet: Bouquet;
  interactive?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onMove?: (id: string, x: number, y: number) => void;
  /** Fired once at the start of a drag gesture (not per pixel moved), so a
   *  caller can snapshot pre-drag state for undo without flooding the
   *  history stack on every pointermove. */
  onMoveStart?: () => void;
  className?: string;
  /** Live card content overrides used while composing (before the bouquet is
   *  finalized in the wizard's last step). Falls back to the bouquet's own
   *  persisted recipient/message/sender when omitted. */
  cardRecipient?: string;
  cardMessage?: string;
  cardSender?: string;
  /** When set, the story is delivered as an envelope tucked into the bouquet
   *  (replaces the printed on-bouquet card). */
  envelope?: BouquetEnvelopeContent;
}

export function BouquetCanvas({
  bouquet,
  interactive = false,
  selectedId,
  onSelect,
  onMove,
  onMoveStart,
  className,
  cardRecipient,
  cardMessage,
  cardSender,
  envelope,
}: BouquetCanvasProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapperUid = useId().replaceAll(":", "");
  const bg = getBackground(bouquet.background);
  // Announces keyboard moves for screen-reader users, since same-species
  // elements (e.g. three roses) share an accessible name and a visual-only
  // position change would otherwise be silent to them.
  const [announcement, setAnnouncement] = useState("");

  const elements = [...bouquet.elements].sort((a, b) => a.z - b.z);

  // Guards pointer gestures: tracks real movement so a drag doesn't produce a
  // stray `click`, and cleans up capture + window listeners on ANY end of the
  // gesture (including pointercancel, which browsers fire on scrolled-away
  // touches). Without this an interrupted touch leaked global listeners that
  // moved the wrong flower on the next tap.
  const dragState = useRef({ started: false, suppressClick: false });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, el: BouquetElement) => {
      if (!interactive || !onMove) {
        onSelect?.(el.id);
        return;
      }
      onSelect?.(el.id);
      const stage = stageRef.current;
      if (!stage) return;
      const target = e.currentTarget as HTMLElement;
      const state = dragState.current;
      state.started = false;
      state.suppressClick = false;
      const startX = e.clientX;
      const startY = e.clientY;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        // pointer already released / unsupported — still fall back to window listeners
      }

      const move = (ev: PointerEvent) => {
        if (!state.started) {
          if (Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) < 5) return;
          state.started = true;
          onMoveStart?.();
        }
        const rect = stage.getBoundingClientRect();
        const x = ((ev.clientX - rect.left) / rect.width) * 100;
        const y = ((ev.clientY - rect.top) / rect.height) * 100;
        onMove(el.id, x, y);
      };
      const end = () => {
        if (target.hasPointerCapture(e.pointerId)) {
          try {
            target.releasePointerCapture(e.pointerId);
          } catch {
            // already released
          }
        }
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        if (state.started) state.suppressClick = true;
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
    },
    [interactive, onMove, onMoveStart, onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, el: BouquetElement) => {
      if (!interactive || !onMove) return;
      const step = e.shiftKey ? 5 : 1.5;
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "ArrowUp") dy = -step;
      else if (e.key === "ArrowDown") dy = step;
      else return;
      e.preventDefault();
      const nextX = clamp(el.x + dx, 0, 100);
      const nextY = clamp(el.y + dy, 0, 100);
      onMove(el.id, nextX, nextY);
      const def = getAssetDef(el.type);
      setAnnouncement(`${def ? def.name : "Element"} moved to ${Math.round(nextX)} percent from left, ${Math.round(nextY)} percent from top`);
    },
    [interactive, onMove]
  );

  return (
    <div
      ref={stageRef}
      className={cn(
        // `isolate` gives this canvas its own stacking context so the large,
        // per-element z-indexes below (el.z + 10, and 50 on the front wrap
        // layer) only ever order elements against each other. Without it
        // those values compete in the PAGE's stacking context too, and a
        // bouquet with enough elements can end up painting on top of page
        // chrome like modals — that's how a flower ended up rendered over
        // the share page's QR-code dialog.
        "relative isolate aspect-[4/5] w-full overflow-hidden rounded-2xl bg-grain shadow-[inset_0_0_60px_rgba(0,0,0,0.06)]",
        className
      )}
      style={{ background: `linear-gradient(160deg, ${bg.from}, ${bg.to})` }}
      onClick={() => {
        if (dragState.current.suppressClick) {
          dragState.current.suppressClick = false;
          return;
        }
        onSelect?.(null);
      }}
      role="group"
      aria-label="Bouquet composition"
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={{ filter: "drop-shadow(0 20px 30px rgba(30,20,10,0.18))" }}>
        <WrapperGraphic wrapperId={bouquet.wrapper} ribbonId={bouquet.ribbon} mono={bouquet.mono} layer="back" idPrefix={`${wrapperUid}-back`} />
      </div>

{/* The story travels inside the envelope tucked into the wrap when one
          is composed (reveal / final preview); otherwise the printed card. */}
      {envelope ? (
        <BouquetEnvelope {...envelope} />
      ) : (
        <BouquetCard
          recipient={cardRecipient ?? bouquet.recipient}
          message={cardMessage ?? bouquet.message}
          sender={cardSender ?? bouquet.sender}
          style={{ top: "74%" }}
        />
      )}

      {elements.map((el, i) => {
        // One bouquet element = one group: its stem and its bloom are derived
        // from this single `el` in this single pass, and share this one
        // z-index, so they can never be positioned or stacked independently.
        const def = getAssetDef(el.type);
        const isSelected = selectedId === el.id;
        // Same-species elements (three roses, say) would otherwise share one
        // identical accessible name, leaving screen-reader users unable to
        // tell them apart or know which one is focused.
        const elementLabel = `${def ? def.name : "Bouquet element"}, ${i + 1} of ${elements.length}`;
        const sizePx = 34 * el.scale * (def?.category === "foliage" ? 3.1 : 2.5);
        // Raster cutouts already carry their own stems and leaves, so a
        // synthetic stem is only drawn for the procedural vector shapes.
        const hasStem = el.category !== "decoration" && !def?.image;

        return (
          <div
            key={el.id}
            className="pointer-events-none absolute inset-0"
            style={{ zIndex: el.z + 10 }}
          >
            {hasStem && (
              <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                <line
                  x1={`${STEM_BASE_X}%`}
                  y1={`${STEM_BASE_Y}%`}
                  x2={`${el.x}%`}
                  y2={`${el.y}%`}
                  stroke="#5f6f52"
                  strokeWidth={1.5}
                  strokeOpacity={0.55}
                  strokeLinecap="round"
                />
              </svg>
            )}
            {/*
              Plain (non-motion) button: it owns centering + rotation via a
              literal CSS transform string. Framer Motion silently takes over
              the `transform` property on any element whose animate/initial
              props touch a transform value (like `scale` below) — mixing
              that with a manual translate(-50%, -50%) here would drop the
              centering and offset every element from its own stem. The
              entrance animation instead lives on the inner motion.div,
              which owns nothing but its own scale/opacity.

              Interactive -> focusable button (arrow keys move the element).
              Read-only (/s, /b) -> a plain decorative div so a bouquet full
              of flowers never becomes a field of invisible tab stops.
            */}
            {interactive ? (
              <button
                type="button"
                aria-label={elementLabel}
                aria-pressed={isSelected}
                className={cn(
                  "pointer-events-auto absolute flex cursor-grab items-center justify-center rounded-full active:cursor-grabbing",
                  isSelected && "outline outline-2 outline-offset-4 outline-burgundy/70"
                )}
                style={{
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  width: sizePx,
                  height: sizePx,
                  transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`,
                  touchAction: "none",
                }}
                onPointerDown={(e) => handlePointerDown(e, el)}
                onKeyDown={(e) => handleKeyDown(e, el)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (dragState.current.suppressClick) {
                    dragState.current.suppressClick = false;
                    return;
                  }
                  onSelect?.(el.id);
                }}
              >
                <motion.div
                  className="h-full w-full"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <BouquetAsset type={el.type} category={el.category} className="h-full w-full" mono={bouquet.mono} />
                </motion.div>
              </button>
            ) : (
              <div
                role="img"
                aria-label={elementLabel}
                className="pointer-events-auto absolute flex items-center justify-center rounded-full"
                style={{
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  width: sizePx,
                  height: sizePx,
                  transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`,
                }}
              >
                <motion.div
                  className="h-full w-full"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <BouquetAsset type={el.type} category={el.category} className="h-full w-full" mono={bouquet.mono} />
                </motion.div>
              </div>
            )}
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-0 z-50" style={{ filter: "drop-shadow(0 16px 22px rgba(30,20,10,0.16))" }}>
        <WrapperGraphic wrapperId={bouquet.wrapper} ribbonId={bouquet.ribbon} mono={bouquet.mono} layer="front" idPrefix={`${wrapperUid}-front`} />
      </div>

      {elements.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
          <p className="font-display text-lg text-charcoal-muted">Start building your bouquet</p>
          <p className="text-sm text-charcoal-muted">Add your first flower from the left</p>
        </div>
      )}

      {interactive && (
        <div role="status" aria-live="polite" className="sr-only">
          {announcement}
        </div>
      )}
    </div>
  );
}
