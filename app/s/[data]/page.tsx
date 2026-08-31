"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { decodeBouquet } from "@/lib/bouquet/encoder";
import { BouquetCanvas } from "@/components/bouquet/BouquetCanvas";
import {
  CopyLinkButton,
  WebShareButton,
  SocialShareRow,
  QrCodeButton,
  DownloadImageButton,
  GifExportButton,
  useShareCardRef,
} from "@/components/sharing/ShareActions";
import { getCardPaper } from "@/data/cardPaper";
import { AdSlot } from "@/components/ads/AdSlot";

export default function SharePage({ params }: { params: Promise<{ data: string }> }) {
  const { data } = use(params);
  // Canonical token: strip Next.js's '+' -> '%2B' re-encoding once so the URL
  // users copy, share and scan always uses the clean form.
  const token = useMemo(() => {
    try {
      return decodeURIComponent(data);
    } catch {
      return data;
    }
  }, [data]);
  const result = useMemo(() => decodeBouquet(token), [token]);
  const cardRef = useShareCardRef();
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    // Deferred to after mount so the server-rendered relative path never
    // mismatches the client's absolute one (hydration-safe).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrigin(window.location.origin);
  }, []);
  const url = `${origin}/b/${token}`;

  if (!result.ok || !result.bouquet) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-2xl text-charcoal">This bouquet couldn&apos;t be created.</h1>
        <Link href="/create" className="rounded-full bg-burgundy px-5 py-2.5 text-sm text-ivory">
          Try again
        </Link>
      </main>
    );
  }

  const { bouquet } = result;
  const slug = (
    (bouquet.recipient || "someone")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "someone"
  );
  const downloadName = `bloomly-${slug}-${new Date().toISOString().slice(0, 10)}.png`;
  const gifName = `bloomly-${slug}-${new Date().toISOString().slice(0, 10)}.gif`;
  const paper = getCardPaper(bouquet.cardPaper);

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 px-6 py-14">
      <Link href="/" className="font-script text-2xl italic text-charcoal">
        Bloomly
      </Link>
      <div className="flex items-center gap-2 text-burgundy">
        <PartyPopper size={20} />
        <p className="font-display text-xl">Your bouquet is ready.</p>
      </div>

      <div ref={cardRef} className="w-full max-w-sm rounded-2xl bg-paper p-4 shadow-lg">
        <BouquetCanvas bouquet={bouquet} />
        {(bouquet.recipient || bouquet.message) && (
          <div className="mt-4 text-center" style={{ background: paper.surface }}>
            {bouquet.recipient && (
              <p className="font-script text-lg italic" style={{ color: paper.ink }}>
                For {bouquet.recipient}
              </p>
            )}
            {bouquet.message && (
              <p className="mt-2 text-sm" style={{ color: paper.inkSoft }}>
                &ldquo;{bouquet.message}&rdquo;
              </p>
            )}
            {bouquet.sender && (
              <p className="mt-2 text-xs" style={{ color: paper.inkSoft }}>
                — {bouquet.sender}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-sm rounded-xl border border-charcoal/10 bg-white/60 px-4 py-3 text-center">
        <label htmlFor="share-url" className="mb-1 block text-xs uppercase tracking-widest text-charcoal-soft/60">
          Your bouquet link
        </label>
        <input
          id="share-url"
          name="share-url"
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full truncate bg-transparent text-center text-xs text-charcoal-soft outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href={`/b/${token}`}
          className="rounded-full border border-burgundy/30 bg-burgundy/5 px-4 py-2.5 text-sm font-medium text-burgundy transition hover:bg-burgundy/10"
        >
          Open bouquet
        </Link>
        <CopyLinkButton url={url} />
        <WebShareButton url={url} title="A bouquet for you" />
        <QrCodeButton url={url} />
        <DownloadImageButton targetRef={cardRef} fileName={downloadName} />
        <GifExportButton targetRef={cardRef} fileName={gifName} />
      </div>

      <SocialShareRow url={url} message={bouquet.message} />

      <AdSlot position="share-bottom" className="mt-4" />

      <div className="flex flex-col items-center gap-2 pt-6 text-center">
        <p className="text-sm text-charcoal-soft/70">Your bouquet lives inside this link — nothing is stored on a server.</p>
        <Link href="/create" className="text-sm font-medium text-burgundy hover:underline">
          Create another bouquet
        </Link>
      </div>
    </main>
  );
}
