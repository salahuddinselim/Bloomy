"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Download, Film, QrCode, Share2, Clock, Sparkles } from "lucide-react";
import QRCode from "qrcode";
import { toPng, toCanvas } from "html-to-image";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { AdSlot } from "@/components/ads/AdSlot";

/**
 * Locks page scroll while `active`. A modal's backdrop is `fixed`, which
 * only covers the current viewport, not the full (taller, scrollable) page
 * — without this, scrolling while a modal is open reveals un-dimmed content
 * below the fold. Locks both <html> and <body>: this app's root <html>
 * carries `h-full`, which can make it (not <body>) the actual scrolling box
 * depending on page height, so locking only one is unreliable.
 */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const prevBody = document.body.style.overflow;
    const prevHtml = html.style.overflow;
    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
    };
  }, [active]);
}

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        let ok = false;
        try {
          await navigator.clipboard.writeText(url);
          ok = true;
        } catch {
          // Clipboard API unavailable or denied — the URL input above is
          // selectable as a fallback (long-press -> Copy still works).
        }
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } else if (typeof window !== "undefined") {
          const input = document.getElementById("share-url") as HTMLInputElement | null;
          if (input) {
            input.focus();
            input.select();
          }
          try {
            ok = document.execCommand("copy");
          } catch {
            ok = false;
          }
          if (ok) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }
        }
      }}
      className="flex items-center gap-2 rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}

export function WebShareButton({ url, title }: { url: string; title: string }) {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    // Detected only after mount to avoid an SSR/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(typeof navigator !== "undefined" && Boolean(navigator.share));
  }, []);
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={() => navigator.share?.({ title, url }).catch(() => {})}
      className="flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2.5 text-sm text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy"
    >
      <Share2 size={16} /> Share
    </button>
  );
}

export function SocialShareRow({ url, message }: { url: string; message: string }) {
  const text = encodeURIComponent(message ? `${message} ` : "Someone made you a bouquet 🌸 ");
  const encodedUrl = encodeURIComponent(url);
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${text}${encodedUrl}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${text}` },
    { label: "Messenger", href: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=0&redirect_uri=${encodedUrl}` },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-charcoal/15 px-4 py-2 text-xs font-medium text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

export function QrCodeButton({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  useScrollLock(open);

  async function openModal() {
    const dataUrl = await QRCode.toDataURL(url, {
      margin: 1,
      width: 480,
      color: { dark: "#2a2521", light: "#faf6ef" },
      // Bouquet links can run long (the whole bouquet is encoded in the
      // URL), which already pushes the QR to a dense, hard-to-scan grid.
      // High error correction gives real phone cameras more room to resolve
      // it despite that density, print smudges, or an off-angle scan.
      errorCorrectionLevel: "H",
    });
    setSrc(dataUrl);
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2.5 text-sm text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy"
      >
        <QrCode size={16} /> Show QR
      </button>
      {open &&
        createPortal(
          // Portaled to <body>: the bouquet canvas draws several of its own
          // layers at z-50 (see BouquetCanvas's front WrapperGraphic), each
          // in its own stacking context via `position` + `filter`. A modal
          // nested in the normal tree can lose to those regardless of its
          // own z-index once ancestor stacking contexts are involved, which
          // showed up as flower art and card text bleeding on top of the QR.
          // Rendering outside the whole component tree sidesteps that.
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-6"
            role="dialog"
            aria-modal="true"
            aria-label="QR code"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-xs rounded-2xl bg-paper p-6 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {src && (
                // eslint-disable-next-line @next/next/no-img-element -- data: URI generated client-side, not an optimizable network image
                <img src={src} alt="QR code linking to this bouquet" className="mx-auto rounded-lg" />
              )}
              <p className="mt-4 text-sm text-charcoal-soft">Scan to open this bouquet</p>
              <div className="mt-4 flex justify-center gap-2">
                {src && (
                  <a
                    href={src}
                    download="bloomstory-qr.png"
                    className="rounded-full border border-charcoal/15 px-4 py-2 text-xs font-medium text-charcoal-soft hover:border-burgundy/40 hover:text-burgundy"
                  >
                    Download QR
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-charcoal px-4 py-2 text-xs font-medium text-ivory"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

const AD_VIEW_SECONDS = 20;

/**
 * Lets the sender extend a short link's life by watching an ad. This is a
 * timed gate, not a real rewarded-ads integration — there's no way to
 * cryptographically confirm an ad was actually watched from a static
 * AdSense placement, so the "reward" is honestly just "the ad stayed on
 * screen for 20 seconds." Only the short link's lifespan changes here; the
 * long-form `/b/` link this points to never expires regardless.
 */
export function ExtendLinkButton({
  code,
  expiresAt,
  onExtended,
}: {
  code: string;
  expiresAt: string;
  onExtended: (newExpiresAt: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AD_VIEW_SECONDS);
  const [status, setStatus] = useState<"watching" | "ready" | "extending" | "done" | "error">("watching");

  useScrollLock(open);

  useEffect(() => {
    if (!open || status !== "watching") return;
    if (secondsLeft <= 0) {
      setStatus("ready");
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [open, status, secondsLeft]);

  function openModal() {
    setSecondsLeft(AD_VIEW_SECONDS);
    setStatus("watching");
    setOpen(true);
  }

  async function handleExtend() {
    setStatus("extending");
    try {
      const res = await fetch(`/api/links/${code}/extend`, { method: "POST" });
      if (!res.ok) throw new Error("extend failed");
      const data: { expiresAt: string } = await res.json();
      onExtended(data.expiresAt);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const daysLeft = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2.5 text-sm text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy"
      >
        <Clock size={16} /> Extend link ({daysLeft}d left)
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Extend your bouquet's short link"
            onClick={() => status !== "extending" && setOpen(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-paper p-6 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {status === "done" ? (
                <>
                  <Sparkles className="mx-auto mb-3 text-burgundy" size={28} />
                  <p className="font-display text-lg text-charcoal">Link extended</p>
                  <p className="mt-1 text-sm text-charcoal-soft">Thanks for keeping it going a little longer.</p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-5 rounded-full bg-charcoal px-5 py-2 text-sm font-medium text-ivory"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <p className="font-display text-lg text-charcoal">Extend your short link</p>
                  <p className="mt-1 text-sm text-charcoal-soft">
                    Watching a short ad adds 30 days to how long the short link stays valid. Your full bouquet link
                    never expires either way.
                  </p>
                  <div className="mt-4">
                    <AdSlot position="extend-link-modal" size="square" className="mx-auto" />
                  </div>
                  {status === "error" && (
                    <p className="mt-3 text-xs text-burgundy" role="alert">
                      Something went wrong extending the link. Please try again.
                    </p>
                  )}
                  <div className="mt-5 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      disabled={status === "extending"}
                      className="rounded-full border border-charcoal/15 px-4 py-2 text-xs font-medium text-charcoal-soft disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleExtend}
                      disabled={status === "watching" || status === "extending"}
                      className="rounded-full bg-burgundy px-5 py-2 text-xs font-medium text-ivory transition hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {status === "watching"
                        ? `Extend in ${secondsLeft}s…`
                        : status === "extending"
                        ? "Extending…"
                        : "Extend +30 days"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export function DownloadImageButton({
  targetRef,
  fileName = "bloomstory-bouquet.png",
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  fileName?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!targetRef.current) return;
        setBusy(true);
        try {
          const dataUrl = await toPng(targetRef.current, { pixelRatio: 2 });
          const link = document.createElement("a");
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        } finally {
          setBusy(false);
        }
      }}
      className="flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2.5 text-sm text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy disabled:opacity-60"
    >
      <Download size={16} /> {busy ? "Preparing…" : "Download Image"}
    </button>
  );
}

export function useShareCardRef() {
  return useRef<HTMLDivElement>(null);
}

/*
 * Animated GIF export. Captures the share card once, then re-draws a slow,
 * seamless "breathing bouquet" loop (gentle bloom, soft sway) into frames and
 * encodes it with gifenc. Geometry-only transforms, so a single shared palette
 * keeps the file small and the loop stable.
 */
export function GifExportButton({
  targetRef,
  fileName = "bloomstory-bouquet.gif",
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  fileName?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    if (!targetRef.current) return;
    setBusy(true);
    try {
      const source = await toCanvas(targetRef.current, { pixelRatio: 1.5 });
      const w = source.width;
      const h = source.height;
      if (w <= 0 || h <= 0) return;

      const ctx = source.getContext("2d");
      const srcData = ctx?.getImageData(0, 0, w, h).data;
      if (!srcData) return;

      const palette = quantize(srcData, 256);
      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = w;
      frameCanvas.height = h;
      const fctx = frameCanvas.getContext("2d");
      if (!fctx) return;

      const gif = GIFEncoder();
      const FRAMES = 30; // ~1.8s loop at 60ms
      for (let i = 0; i < FRAMES; i++) {
        const p = (i / FRAMES) * Math.PI * 2;
        const breathe = 1 + 0.035 * Math.sin(p);
        const sway = 0.009 * Math.sin(p + Math.PI / 3);
        const driftX = w * 0.006 * Math.sin(p - Math.PI / 2);
        const driftY = h * 0.004 * Math.cos(p - Math.PI / 3);
        fctx.clearRect(0, 0, w, h);
        fctx.save();
        fctx.translate(w / 2 + driftX, h / 2 + driftY);
        fctx.rotate(sway);
        fctx.scale(breathe, breathe);
        fctx.drawImage(source, -w / 2, -h / 2);
        fctx.restore();
        const frameData = fctx.getImageData(0, 0, w, h).data;
        const index = applyPalette(frameData, palette);
        gif.writeFrame(index, w, h, { palette, delay: 60 });
      }
      gif.finish();

      const blob = new Blob([gif.bytes()], { type: "image/gif" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = fileName;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={handleExport}
      className="flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2.5 text-sm text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy disabled:opacity-60"
    >
      <Film size={16} /> {busy ? "Brewing…" : "Export GIF"}
    </button>
  );
}
