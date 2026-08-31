"use client";

import { Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2, Undo2 } from "lucide-react";
import { bouquetReducer } from "@/lib/bouquet/reducer";
import { createEmptyBouquet, type Bouquet } from "@/lib/bouquet/types";
import { elementsFromIds, elementsFromPreset, DEFAULT_BOUQUET_FLOWER_IDS } from "@/lib/bouquet/build";
import { getPreset } from "@/data/presets";
import { OCCASIONS } from "@/data/occasions";
import { encodeBouquet } from "@/lib/bouquet/encoder";
import { BouquetCanvas } from "@/components/bouquet/BouquetCanvas";
import { FloatingControls } from "@/components/editor/FloatingControls";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { EditorPanelContent, EDITOR_TABS, type EditorTab } from "@/components/editor/EditorPanelContent";
import { AdSlot } from "@/components/ads/AdSlot";
import { cn } from "@/lib/utils";

type MobileTab = EditorTab | "details" | "style";

const MOBILE_NAV_TABS: { id: MobileTab; label: string }[] = [
  { id: "presets", label: "Presets" },
  { id: "flowers", label: "Flowers" },
  { id: "foliage", label: "Foliage" },
  { id: "wrapper", label: "Wrapper" },
  { id: "ribbon", label: "Ribbon" },
  { id: "decor", label: "Decor" },
  { id: "details", label: "Details" },
  { id: "style", label: "Style" },
];

function buildInitialBouquet(presetId?: string | null, occasionId?: string | null, quote?: string | null) {
  const base = createEmptyBouquet();
  const occasion = occasionId ? OCCASIONS.find((o) => o.id === occasionId) : null;
  const preset = getPreset(presetId ?? occasion?.presetId ?? "");

  if (preset) {
    return {
      ...base,
      elements: elementsFromPreset(preset),
      wrapper: preset.wrapper,
      ribbon: preset.ribbon,
      message: occasion?.suggestedMessage ?? quote ?? "",
    };
  }
  return {
    ...base,
    elements: elementsFromIds(DEFAULT_BOUQUET_FLOWER_IDS),
    message: quote ?? "",
  };
}

const MAX_HISTORY = 10;

function CreatePageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [bouquet, dispatch] = useReducer(
    bouquetReducer,
    null,
    () => buildInitialBouquet(params.get("preset"), params.get("occasion"), params.get("quote"))
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [desktopTab, setDesktopTab] = useState<EditorTab>("flowers");

  // Undo support: a bounded stack of prior snapshots, pushed only before
  // actions that can wipe or bulk-replace work (preset apply, auto-arrange,
  // delete) — not every micro-edit, which would make the stack meaningless.
  const historyRef = useRef<Bouquet[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushHistory = useCallback((snapshot: Bouquet) => {
    historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), snapshot];
    setCanUndo(true);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  function undo() {
    const prev = historyRef.current.pop();
    setCanUndo(historyRef.current.length > 0);
    if (!prev) return;
    dispatch({ type: "LOAD_BOUQUET", bouquet: prev });
    setToast(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }

  const counts = useMemo(
    () => ({
      flower: bouquet.elements.filter((e) => e.category === "flower").length,
      foliage: bouquet.elements.filter((e) => e.category === "foliage").length,
      decoration: bouquet.elements.filter((e) => e.category === "decoration").length,
    }),
    [bouquet.elements]
  );

  const selected = bouquet.elements.find((e) => e.id === selectedId) ?? null;

  function applyPreset(id: string) {
    const preset = getPreset(id);
    if (!preset) return;
    pushHistory(bouquet);
    dispatch({
      type: "APPLY_PRESET",
      elements: elementsFromPreset(preset),
      wrapper: preset.wrapper,
      ribbon: preset.ribbon,
    });
    setSelectedId(null);
    showToast(`Switched to "${preset.name}"`);
  }

  function arrangeForMe() {
    if (bouquet.elements.length === 0) return;
    pushHistory(bouquet);
    dispatch({ type: "ARRANGE_FOR_ME" });
    showToast("Rearranged your bouquet");
  }

  function deleteSelected() {
    if (!selected) return;
    pushHistory(bouquet);
    dispatch({ type: "REMOVE_ELEMENT", id: selected.id });
    setSelectedId(null);
    showToast("Removed from bouquet");
  }

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 350));
    const result = encodeBouquet(bouquet);
    setGenerating(false);
    if (!result.ok || !result.data) {
      setError(
        result.error === "too_large"
          ? "Your bouquet is too detailed to fit into a share link. Please remove a few elements."
          : "Something went wrong creating your link. Please try again."
      );
      return;
    }
    router.push(`/s/${result.data}`);
  }

  const panelProps = {
    bouquet,
    counts,
    onAdd: (id: string) => dispatch({ type: "ADD_ELEMENT", assetId: id }),
    onSetWrapper: (id: string) => dispatch({ type: "SET_WRAPPER", wrapper: id }),
    onSetRibbon: (id: string) => dispatch({ type: "SET_RIBBON", ribbon: id }),
    onApplyPreset: applyPreset,
  };

  const propertiesHandlers = {
    onRecipient: (v: string) => dispatch({ type: "SET_RECIPIENT", recipient: v }),
    onSender: (v: string) => dispatch({ type: "SET_SENDER", sender: v }),
    onMessage: (v: string) => dispatch({ type: "SET_MESSAGE", message: v }),
    onReveal: (v: Bouquet["revealStyle"]) => dispatch({ type: "SET_REVEAL_STYLE", revealStyle: v }),
    onBackground: (v: string) => dispatch({ type: "SET_BACKGROUND", background: v }),
    onMono: (v: boolean) => dispatch({ type: "SET_MONO", mono: v }),
    onCardPaper: (v: Bouquet["cardPaper"]) => dispatch({ type: "SET_CARD_PAPER", cardPaper: v }),
  };

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <header className="flex items-center justify-between border-b border-charcoal/8 bg-paper/80 px-4 py-3 backdrop-blur sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-charcoal">
          <ArrowLeft size={16} className="text-charcoal-soft" />
          Bloomly
        </Link>
        <div className="flex items-center gap-2">
          {canUndo && (
            <button
              type="button"
              onClick={undo}
              className="flex items-center gap-1.5 rounded-full border border-charcoal/15 px-3.5 py-1.5 text-xs font-medium text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy"
            >
              <Undo2 size={14} /> Undo
            </button>
          )}
          <button
            type="button"
            onClick={arrangeForMe}
            className="hidden items-center gap-1.5 rounded-full border border-charcoal/15 px-3.5 py-1.5 text-xs font-medium text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy sm:flex"
          >
            <Sparkles size={14} /> Arrange for me
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 rounded-full bg-burgundy px-4 py-2 text-xs font-medium text-ivory shadow-sm transition hover:bg-burgundy-dark disabled:opacity-60"
          >
            {generating && <Loader2 size={14} className="animate-spin" />}
            Generate Share Link
          </button>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mx-4 mt-3 rounded-lg bg-burgundy/10 px-4 py-2 text-sm text-burgundy sm:mx-6"
        >
          {error}
        </div>
      )}

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
        {/* Desktop left: asset library */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-6 rounded-2xl border border-charcoal/8 bg-white/60 p-4">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {EDITOR_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDesktopTab(t.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs transition",
                    desktopTab === t.id
                      ? "bg-burgundy text-ivory"
                      : "bg-charcoal/5 text-charcoal-soft hover:bg-charcoal/10"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="max-h-[65vh] overflow-y-auto pr-1">
              <EditorPanelContent tab={desktopTab} {...panelProps} />
            </div>
          </div>
        </aside>

        {/* Center: canvas */}
        <div className="flex flex-1 flex-col items-center gap-4">
          <p className="text-center text-xs text-charcoal-soft/60">
            Tap a flower to edit it &middot; drag or arrow keys to move it &middot; try &ldquo;Arrange for
            me&rdquo;
          </p>
          <div className="w-full max-w-md md:max-w-lg">
            <BouquetCanvas
              bouquet={bouquet}
              interactive
              selectedId={selectedId}
              onSelect={setSelectedId}
              onMove={(id, x, y) => dispatch({ type: "MOVE_ELEMENT", id, x, y })}
            />
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="fixed bottom-20 left-1/2 z-20 -translate-x-1/2 md:static md:translate-x-0"
              >
                <FloatingControls
                  element={selected}
                  onRotate={(d) => dispatch({ type: "ROTATE_ELEMENT", id: selected.id, rotation: selected.rotation + d })}
                  onScale={(d) => dispatch({ type: "SCALE_ELEMENT", id: selected.id, scale: selected.scale + d })}
                  onDuplicate={() => dispatch({ type: "DUPLICATE_ELEMENT", id: selected.id })}
                  onDelete={deleteSelected}
                  onBringForward={() => dispatch({ type: "BRING_FORWARD", id: selected.id })}
                  onSendBackward={() => dispatch({ type: "SEND_BACKWARD", id: selected.id })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={arrangeForMe}
            className="flex items-center gap-1.5 rounded-full border border-charcoal/15 px-3.5 py-1.5 text-xs font-medium text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy sm:hidden"
          >
            <Sparkles size={14} /> Arrange for me
          </button>

          <AdSlot position="creator-bottom" className="mt-2" />
        </div>

        {/* Desktop right: properties */}
        <aside className="hidden w-72 shrink-0 md:block">
          <div className="sticky top-6 rounded-2xl border border-charcoal/8 bg-white/60 p-4">
            <PropertiesPanel bouquet={bouquet} {...propertiesHandlers} />
          </div>
        </aside>
      </div>

      {/* Mobile bottom nav: more tabs than fit on a narrow phone, so this
          scrolls horizontally. justify-around fights overflow-x-auto (it
          only distributes items that already fit), so this uses a plain
          flex row with snap points and an edge fade so "more tabs" reads as
          scrollable instead of just cut off. */}
      <nav
        className="no-scrollbar fixed inset-x-0 bottom-0 z-20 flex gap-1 overflow-x-auto border-t border-charcoal/10 bg-paper/95 px-2 py-2 backdrop-blur [mask-image:linear-gradient(to_right,black,black_calc(100%-20px),transparent)] snap-x snap-mandatory md:hidden"
      >
        {MOBILE_NAV_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMobileTab(t.id)}
            className="shrink-0 snap-start rounded-full px-3 py-1.5 text-xs font-medium text-charcoal-soft transition hover:bg-charcoal/5"
          >
            {t.label}
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {mobileTab && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-30 max-h-[70vh] overflow-y-auto rounded-t-3xl bg-paper p-5 shadow-2xl md:hidden"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-charcoal/15" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg">
                {MOBILE_NAV_TABS.find((t) => t.id === mobileTab)?.label}
              </h2>
              <button type="button" onClick={() => setMobileTab(null)} className="text-sm text-charcoal-soft">
                Done
              </button>
            </div>
            {mobileTab === "details" ? (
              <div className="flex flex-col gap-6">
                <PropertiesPanel
                bouquet={bouquet}
                section="details"
                onRecipient={propertiesHandlers.onRecipient}
                onSender={propertiesHandlers.onSender}
                onMessage={propertiesHandlers.onMessage}
                onReveal={propertiesHandlers.onReveal}
                onBackground={propertiesHandlers.onBackground}
                onMono={propertiesHandlers.onMono}
                onCardPaper={propertiesHandlers.onCardPaper}
              />
            </div>
          ) : mobileTab === "style" ? (
              <PropertiesPanel
                bouquet={bouquet}
                section="style"
                onRecipient={propertiesHandlers.onRecipient}
                onSender={propertiesHandlers.onSender}
                onMessage={propertiesHandlers.onMessage}
                onReveal={propertiesHandlers.onReveal}
                onBackground={propertiesHandlers.onBackground}
                onMono={propertiesHandlers.onMono}
                onCardPaper={propertiesHandlers.onCardPaper}
              />
            ) : (
              <EditorPanelContent tab={mobileTab as EditorTab} {...panelProps} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 md:bottom-6"
          >
            <div className="flex items-center gap-3 rounded-full bg-charcoal px-4 py-2.5 text-sm text-ivory shadow-lg">
              <span>{toast}</span>
              <button
                type="button"
                onClick={undo}
                className="flex items-center gap-1 font-medium text-dusty-rose hover:text-ivory"
              >
                <Undo2 size={14} /> Undo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16 md:hidden" />
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <CreatePageInner />
    </Suspense>
  );
}
