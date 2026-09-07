"use client";

import { Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Undo2, Redo2, X } from "lucide-react";
import { wizardReducer } from "@/data/wizardReducer";
import { INITIAL_WIZARD_STATE } from "@/data/wizard";
import { bouquetReducer } from "@/lib/bouquet/reducer";
import { createEmptyBouquet, LIMITS, type Bouquet } from "@/lib/bouquet/types";
import { elementsFromIds, elementsFromPreset, DEFAULT_BOUQUET_FLOWER_IDS } from "@/lib/bouquet/build";
import { encodeBouquet } from "@/lib/bouquet/encoder";
import { resolveSignatureTheme } from "@/data/signatureThemes";
import { getPreset } from "@/data/presets";
import { getOccasion } from "@/data/occasions";
import { BouquetCanvas } from "@/components/bouquet/BouquetCanvas";
import { FloatingControls } from "@/components/editor/FloatingControls";
import { EditorPanelContent, EDITOR_TABS, type EditorTab } from "@/components/editor/EditorPanelContent";
import { ProgressBar } from "@/components/wizard/ProgressBar";
import { EmotionSelector } from "@/components/wizard/EmotionSelector";
import { RecipientSelector } from "@/components/wizard/RecipientSelector";
import { VibeSelector } from "@/components/wizard/VibeSelector";
import { MessageEditor } from "@/components/wizard/MessageEditor";
import { PresentationSelector } from "@/components/wizard/PresentationSelector";
import { FloatingPetals } from "@/components/wizard/FloatingPetals";
import { cn } from "@/lib/utils";

function getRevealForPresentation(presentationId: string | null): Bouquet["revealStyle"] {
  const map: Record<string, Bouquet["revealStyle"]> = {
    rainy_evening: "curtain",
    under_the_moon: "envelope",
    fairy_lights: "gift_box",
    spring_garden: "minimal",
    candlelight: "gift_box",
    dreamy_clouds: "curtain",
  };
  return map[presentationId ?? ""] ?? "gift_box";
}

function CreatePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetParam = searchParams.get("preset");
  const occasionParam = searchParams.get("occasion");
  const quoteParam = searchParams.get("quote");
  // A gallery preset link or a homepage occasion link (which carries its own
  // preset + a suggested message, see data/occasions.ts) both seed the
  // bouquet the same way; an explicit ?preset= wins if somehow both are set.
  const occasion = occasionParam ? getOccasion(occasionParam) : null;
  const seededPresetId = presetParam ?? occasion?.presetId ?? null;
  // A /quotes card's chosen line is a more deliberate, explicit pick than an
  // occasion's generic suggested message, so it wins if both are somehow set.
  // Untrusted (URL-controlled) input, so it's clamped the same way the
  // message field itself is everywhere else.
  const seededMessage = quoteParam ? quoteParam.slice(0, LIMITS.MAX_MESSAGE) : (occasion?.suggestedMessage ?? null);

  const [wizard, wizardDispatch] = useReducer(wizardReducer, null, () =>
    seededMessage ? { ...INITIAL_WIZARD_STATE, message: seededMessage } : INITIAL_WIZARD_STATE
  );

  const [bouquet, bouquetDispatch] = useReducer(
    bouquetReducer,
    null,
    () => {
      const preset = seededPresetId ? getPreset(seededPresetId) : null;
      if (preset) {
        return {
          ...createEmptyBouquet(),
          elements: elementsFromPreset(preset),
          wrapper: preset.wrapper,
          ribbon: preset.ribbon,
        };
      }
      return {
        ...createEmptyBouquet(),
        elements: elementsFromIds(DEFAULT_BOUQUET_FLOWER_IDS),
      };
    }
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [desktopTab, setDesktopTab] = useState<EditorTab>("presets");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const historyRef = useRef<Bouquet[]>([]);
  const redoRef = useRef<Bouquet[]>([]);
  const appliedThemeIdRef = useRef<string | null>(null);
  const seededMessageThemeRef = useRef<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const MAX_HISTORY = 10;

  const pushHistory = useCallback((snapshot: Bouquet) => {
    historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), snapshot];
    redoRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
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
    redoRef.current = [...redoRef.current.slice(-(MAX_HISTORY - 1)), bouquet];
    setCanRedo(true);
    bouquetDispatch({ type: "LOAD_BOUQUET", bouquet: prev });
    setToast(null);
  }

  function redo() {
    const next = redoRef.current.pop();
    setCanRedo(redoRef.current.length > 0);
    if (!next) return;
    historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), bouquet];
    setCanUndo(true);
    bouquetDispatch({ type: "LOAD_BOUQUET", bouquet: next });
    setToast(null);
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

  function deleteSelected() {
    if (!selected) return;
    pushHistory(bouquet);
    bouquetDispatch({ type: "REMOVE_ELEMENT", id: selected.id });
    setSelectedId(null);
    showToast("Removed from bouquet");
  }

  function arrangeForMe() {
    if (bouquet.elements.length === 0) return;
    pushHistory(bouquet);
    bouquetDispatch({ type: "ARRANGE_FOR_ME" });
    showToast("Rearranged your bouquet");
  }

  const step = wizard.step;

  const signature = useMemo(
    () =>
      resolveSignatureTheme({
        emotion: wizard.emotion,
        recipientType: wizard.recipientType,
        vibe: wizard.vibe,
        recipientName: wizard.recipientName,
      }),
    [wizard.emotion, wizard.recipientType, wizard.vibe, wizard.recipientName]
  );

  function applySignatureTheme(notify = false) {
    if (bouquet.elements.length === 0) return;
    pushHistory(bouquet);
    bouquetDispatch({
      type: "APPLY_THEME",
      flowers: signature.flowers,
      foliage: signature.foliage,
      wrapper: signature.wrapper,
      ribbon: signature.ribbon,
      background: signature.background,
      cardPaper: signature.cardPaper,
    });
    appliedThemeIdRef.current = signature.id;
    if (notify) showToast("Applied your signature theme");
  }

  useEffect(() => {
    if (step === 5 && seededMessageThemeRef.current !== signature.id && !wizard.message && !wizard.messageTitle) {
      seededMessageThemeRef.current = signature.id;
      wizardDispatch({ type: "SET_MESSAGE", message: signature.message });
      wizardDispatch({ type: "SET_MESSAGE_TITLE", messageTitle: signature.messageTitle });
    }
    if (step === 6 && !wizard.presentationTheme) {
      wizardDispatch({ type: "SET_PRESENTATION", presentationTheme: signature.presentation });
    }
  }, [step, signature, wizard.message, wizard.messageTitle, wizard.presentationTheme]);

  function canContinue(): boolean {
    switch (step) {
      case 1: return wizard.emotion !== null;
      case 2: return wizard.recipientType !== null;
      case 3: return wizard.vibe !== null;
      case 4: return bouquet.elements.length > 0;
      case 5: return true;
      case 6: return wizard.presentationTheme !== null;
      default: return false;
    }
  }

  function goNext() {
    if (!canContinue()) return;
    if (step < 6) {
      const next = step + 1;
      // A bouquet seeded from a gallery preset (?preset=) or a homepage
      // occasion link (?occasion=, which implies its own preset) shouldn't
      // be silently replaced by the emotion/recipient/vibe signature theme
      // the moment the wizard reaches the bouquet step.
      if (next === 4 && !seededPresetId && appliedThemeIdRef.current !== signature.id) {
        applySignatureTheme(false);
      }
      wizardDispatch({ type: "SET_STEP", step: next });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goBack() {
    if (step > 1) {
      wizardDispatch({ type: "SET_STEP", step: step - 1 });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleFinish() {
    setError(null);
    setGenerating(true);

    const finalBouquet: Bouquet = {
      ...bouquet,
      recipient: wizard.recipientName,
      sender: wizard.senderName,
      message: wizard.message,
      title: wizard.messageTitle || undefined,
      wrapper: bouquet.wrapper,
      ribbon: bouquet.ribbon,
      background: bouquet.background,
      cardPaper: bouquet.cardPaper,
      revealStyle: getRevealForPresentation(wizard.presentationTheme),
      presentation: wizard.presentationTheme ?? signature.presentation,
      signatureTheme: signature.id,
    };

    await new Promise((r) => setTimeout(r, 350));
    const result = encodeBouquet(finalBouquet);
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
    onAdd: (id: string) => {
      pushHistory(bouquet);
      bouquetDispatch({ type: "ADD_ELEMENT", assetId: id });
    },
    onSetWrapper: (id: string) => bouquetDispatch({ type: "SET_WRAPPER", wrapper: id }),
    onSetRibbon: (id: string) => bouquetDispatch({ type: "SET_RIBBON", ribbon: id }),
    onApplyPreset: (id: string) => {
      const preset = getPreset(id);
      if (!preset) return;
      pushHistory(bouquet);
      bouquetDispatch({
        type: "APPLY_PRESET",
        elements: elementsFromPreset(preset),
        wrapper: preset.wrapper,
        ribbon: preset.ribbon,
      });
      showToast(`Applied ${preset.name}`);
    },
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex min-h-screen flex-col bg-ivory">
      <FloatingPetals />

      <header className="relative z-10 flex items-center justify-between border-b border-charcoal/8 bg-paper/80 px-4 py-3 backdrop-blur sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-charcoal">
          <ArrowLeft size={16} className="text-charcoal-soft" />
          BloomStory
        </Link>
        <div className="flex items-center gap-2">
          {step === 4 && canUndo && (
            <button
              type="button"
              onClick={undo}
              className="relative flex items-center gap-1.5 rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-medium text-charcoal-soft transition before:absolute before:-inset-2 before:content-[''] hover:border-burgundy/40 hover:text-burgundy"
            >
              <Undo2 size={14} /> Undo
            </button>
          )}
          {step === 4 && canRedo && (
            <button
              type="button"
              onClick={redo}
              className="relative flex items-center gap-1.5 rounded-full border border-charcoal/15 px-3.5 py-1.5 text-xs font-medium text-charcoal-soft transition before:absolute before:-inset-2 before:content-[''] hover:border-burgundy/40 hover:text-burgundy"
            >
              <Redo2 size={14} /> Redo
            </button>
          )}
          {step === 4 && (
            <button
              type="button"
              onClick={arrangeForMe}
              className="relative hidden items-center gap-1.5 rounded-full border border-charcoal/15 px-3.5 py-1.5 text-xs font-medium text-charcoal-soft transition before:absolute before:-inset-2 before:content-[''] hover:border-burgundy/40 hover:text-burgundy sm:flex"
            >
              <Sparkles size={14} /> Arrange for me
            </button>
          )}
        </div>
      </header>

      <div className="relative z-10">
        <ProgressBar currentStep={step} onStepClick={(s) => wizardDispatch({ type: "SET_STEP", step: s })} />
      </div>

      {error && (
        <div role="alert" className="relative z-10 mx-auto w-full max-w-2xl px-4">
          <div className="flex items-center justify-between gap-3 rounded-lg bg-burgundy/10 px-4 py-2 text-sm text-burgundy">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition hover:bg-burgundy/15"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="emotion"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <EmotionSelector
                selected={wizard.emotion}
                onSelect={(id) => wizardDispatch({ type: "SET_EMOTION", emotion: id })}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="recipient"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <RecipientSelector
                recipientType={wizard.recipientType}
                recipientName={wizard.recipientName}
                senderName={wizard.senderName}
                onSelectType={(id) => wizardDispatch({ type: "SET_RECIPIENT_TYPE", recipientType: id })}
                onChangeName={(name) => wizardDispatch({ type: "SET_RECIPIENT_NAME", recipientName: name })}
                onChangeSender={(name) => wizardDispatch({ type: "SET_SENDER_NAME", senderName: name })}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="vibe"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <VibeSelector
                selected={wizard.vibe}
                onSelect={(id) => wizardDispatch({ type: "SET_VIBE", vibe: id })}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="bouquet"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 px-4 py-6"
            >
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-script text-lg italic text-dusty-rose"
                >
                  Hand-tie the bouquet
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-2 font-display text-3xl text-charcoal sm:text-4xl"
                >
                  Choose the flowers and wrap
                </motion.h2>
                <p className="mt-2 text-sm text-charcoal-muted">
                  {signature.name}: {signature.tagline}
                </p>
              </div>

              <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="flex flex-1 flex-col items-center gap-4">
                  <div className="w-full max-w-sm md:max-w-md">
                    <BouquetCanvas
                      bouquet={bouquet}
                      interactive
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                      onMove={(id, x, y) => bouquetDispatch({ type: "MOVE_ELEMENT", id, x, y })}
                      onMoveStart={() => pushHistory(bouquet)}
                      cardRecipient={wizard.recipientName}
                      cardMessage={wizard.message}
                      cardSender={wizard.senderName}
                    />
                  </div>

                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        // Used to be `fixed bottom-24` on mobile so the panel
                        // stayed thumb-reachable regardless of scroll — but
                        // that was sized for the old single-row, 5-button
                        // pill. Restoring bring-forward/send-backward/
                        // duplicate made it wrap to two rows, and the extra
                        // height now overlaps the preset list right below
                        // the canvas. Flowing in place (like desktop always
                        // did) keeps it directly under the canvas instead,
                        // where a just-selected flower is already in view.
                        className="static flex w-full justify-center"
                      >
                        <FloatingControls
                          element={selected}
                          onRotate={(d) => {
                            pushHistory(bouquet);
                            bouquetDispatch({ type: "ROTATE_ELEMENT", id: selected.id, rotation: selected.rotation + d });
                          }}
                          onScale={(d) => {
                            pushHistory(bouquet);
                            bouquetDispatch({ type: "SCALE_ELEMENT", id: selected.id, scale: selected.scale + d });
                          }}
                          onDuplicate={() => {
                            pushHistory(bouquet);
                            bouquetDispatch({ type: "DUPLICATE_ELEMENT", id: selected.id });
                          }}
                          onBringForward={() => {
                            pushHistory(bouquet);
                            bouquetDispatch({ type: "BRING_FORWARD", id: selected.id });
                          }}
                          onSendBackward={() => {
                            pushHistory(bouquet);
                            bouquetDispatch({ type: "SEND_BACKWARD", id: selected.id });
                          }}
                          onDelete={deleteSelected}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={arrangeForMe}
                    className="relative flex items-center gap-1.5 rounded-full border border-charcoal/15 px-3.5 py-1.5 text-xs font-medium text-charcoal-soft transition before:absolute before:-inset-2 before:content-[''] hover:border-burgundy/40 hover:text-burgundy sm:hidden"
                  >
                    <Sparkles size={14} /> Arrange for me
                  </button>

                  <p className="text-center text-xs text-charcoal-muted">
                    Your bouquet: {counts.flower} flowers, {counts.foliage} foliage
                  </p>

                  <div className="w-full max-w-md rounded-xl border border-charcoal/8 bg-white/70 p-3 md:hidden">
                    <div className="mb-3 grid grid-cols-4 gap-1">
                      {EDITOR_TABS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setDesktopTab(t.id)}
                          className={cn(
                            "rounded-lg px-2 py-3.5 text-xs transition",
                            desktopTab === t.id
                              ? "bg-burgundy text-ivory"
                              : "bg-charcoal/5 text-charcoal-soft hover:bg-charcoal/10"
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <EditorPanelContent tab={desktopTab} {...panelProps} />
                  </div>
                </div>

                <aside className="hidden md:block">
                  <div className="sticky top-6 rounded-xl border border-charcoal/8 bg-white/70 p-4">
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      {EDITOR_TABS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setDesktopTab(t.id)}
                          className={cn(
                            "rounded-lg px-3 py-3.5 text-xs transition",
                            desktopTab === t.id
                              ? "bg-burgundy text-ivory"
                              : "bg-charcoal/5 text-charcoal-soft hover:bg-charcoal/10"
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <div className="max-h-[55vh] overflow-y-auto pr-1">
                      <EditorPanelContent tab={desktopTab} {...panelProps} />
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="message"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <MessageEditor
                recipientName={wizard.recipientName}
                senderName={wizard.senderName}
                message={wizard.message}
                signature={signature}
                onChangeMessage={(msg) => wizardDispatch({ type: "SET_MESSAGE", message: msg })}
              />
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <PresentationSelector
                selected={wizard.presentationTheme}
                onSelect={(id) => wizardDispatch({ type: "SET_PRESENTATION", presentationTheme: id })}
              />

              <div className="flex flex-col items-center gap-6 px-4 pb-12 pt-4">
                <div className="w-full max-w-sm">
                  <BouquetCanvas
                    bouquet={bouquet}
                    envelope={{
                      recipient: wizard.recipientName,
                      title: wizard.messageTitle,
                      message: wizard.message,
                      sender: wizard.senderName,
                      emotion: signature.emotion,
                    }}
                  />
                </div>

                <div className="w-full max-w-md rounded-2xl border border-charcoal/8 bg-paper p-6 text-center shadow-[0_18px_48px_rgba(40,25,20,0.08)]">
                  <p className="mb-2 text-xs uppercase tracking-widest text-charcoal-muted">
                    {signature.emoji} {signature.name}
                  </p>
                  {wizard.recipientName && (
                    <p className="font-script text-xl italic text-burgundy">
                      For {wizard.recipientName}
                    </p>
                  )}
                  {wizard.message && (
                    <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
                      &ldquo;{wizard.message}&rdquo;
                    </p>
                  )}
                  {wizard.senderName && (
                    <p className="mt-3 text-sm text-charcoal-muted">&mdash; {wizard.senderName}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={generating || !wizard.presentationTheme}
                  className="flex items-center gap-2 rounded-full bg-burgundy px-8 py-4 text-sm font-medium text-ivory shadow-sm transition hover:bg-burgundy-dark disabled:opacity-60"
                >
                  {generating && <Loader2 size={16} className="animate-spin" />}
                  Create My Bouquet ✨
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step < 6 && (
        <div className="relative z-10 border-t border-charcoal/8 bg-paper/80 px-4 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className={cn(
                "flex items-center gap-2 rounded-full border border-charcoal/15 px-5 py-3 text-sm font-medium text-charcoal-soft transition",
                step === 1
                  ? "cursor-not-allowed opacity-30"
                  : "hover:border-burgundy/40 hover:text-burgundy"
              )}
            >
              <ArrowLeft size={16} /> Back
            </button>

            <p className="text-xs text-charcoal-muted">
              Step {step} of 6
            </p>

            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue()}
              className={cn(
                "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition",
                canContinue()
                  ? "bg-burgundy text-ivory hover:bg-burgundy-dark"
                  : "cursor-not-allowed bg-charcoal/10 text-charcoal-muted"
              )}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-0 bottom-36 z-40 flex justify-center px-4 md:bottom-6"
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
    </MotionConfig>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <CreatePageInner />
    </Suspense>
  );
}
