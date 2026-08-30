"use client";

import { RotateCw, ZoomIn, ZoomOut, Copy, Trash2, ArrowUpToLine, ArrowDownToLine } from "lucide-react";
import type { BouquetElement } from "@/lib/bouquet/types";
import { getAssetDef } from "@/components/bouquet/BouquetAsset";

interface FloatingControlsProps {
  element: BouquetElement;
  onRotate: (delta: number) => void;
  onScale: (delta: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
}

const buttonClass =
  "flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-ivory transition hover:bg-burgundy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory";

export function FloatingControls({
  element,
  onRotate,
  onScale,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
}: FloatingControlsProps) {
  const def = getAssetDef(element.type);
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 shadow-lg ring-1 ring-charcoal/10">
      <span className="hidden pr-1 text-xs font-medium text-charcoal-soft sm:inline">
        {def?.name ?? "Element"}
      </span>
      <div className="flex items-center gap-1">
        <button type="button" className={buttonClass} aria-label="Rotate" onClick={() => onRotate(15)}>
          <RotateCw size={16} />
        </button>
        <button type="button" className={buttonClass} aria-label="Increase size" onClick={() => onScale(0.1)}>
          <ZoomIn size={16} />
        </button>
        <button type="button" className={buttonClass} aria-label="Decrease size" onClick={() => onScale(-0.1)}>
          <ZoomOut size={16} />
        </button>
        <button type="button" className={buttonClass} aria-label="Bring forward" onClick={onBringForward}>
          <ArrowUpToLine size={16} />
        </button>
        <button type="button" className={buttonClass} aria-label="Send backward" onClick={onSendBackward}>
          <ArrowDownToLine size={16} />
        </button>
        <button type="button" className={buttonClass} aria-label="Duplicate" onClick={onDuplicate}>
          <Copy size={16} />
        </button>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy text-ivory transition hover:bg-burgundy-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
          aria-label="Delete"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
