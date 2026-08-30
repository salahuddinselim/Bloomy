"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, QrCode, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";

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

  async function openModal() {
    const dataUrl = await QRCode.toDataURL(url, {
      margin: 1,
      width: 480,
      color: { dark: "#2a2521", light: "#faf6ef" },
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
      {open && (
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
                  download="bloomly-qr.png"
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
        </div>
      )}
    </>
  );
}

export function DownloadImageButton({
  targetRef,
  fileName = "bloomly-bouquet.png",
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
