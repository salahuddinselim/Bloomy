"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BouquetAsset } from "@/components/bouquet/BouquetAsset";
import { FLOWER_MEANINGS } from "@/data/flowers";
import type { ElementCategory } from "@/lib/bouquet/types";

export interface CarouselFlower {
  id: string;
  name: string;
  category: ElementCategory;
}

function FlipCard({ flower }: { flower: CarouselFlower }) {
  const [flipped, setFlipped] = useState(false);
  const meaning = FLOWER_MEANINGS[flower.id] ?? "a quiet smile";

  return (
    <div className="shrink-0 snap-start" style={{ perspective: 1200 }}>
      <button
        type="button"
        aria-pressed={flipped}
        aria-label={`${flower.name} — ${meaning}. Tap to flip.`}
        onClick={() => setFlipped((v) => !v)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        className="relative block h-72 w-[min(72vw,19rem)] transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front — the flower itself */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-charcoal/8 bg-ivory-deep/30 p-5 [backface-visibility:hidden]">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-paper shadow-inner">
            <BouquetAsset type={flower.id} category={flower.category} className="h-28 w-28" />
          </div>
          <p className="font-display text-lg text-charcoal">{flower.name}</p>
          <p className="text-center text-xs uppercase tracking-widest text-charcoal-muted">tap to flip</p>
        </div>

        {/* Back — the hidden meaning */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#5c2a12]/10 bg-[linear-gradient(150deg,#fff4e2,#f7e2c4)] p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="font-script text-2xl italic leading-snug text-burgundy">&ldquo;{meaning}&rdquo;</p>
          <p className="font-display text-base text-charcoal">{flower.name}</p>
          <p className="text-xs uppercase tracking-widest text-charcoal-muted">in the language of flowers</p>
        </div>
      </button>
    </div>
  );
}

interface FlowerCarouselProps {
  flowers: CarouselFlower[];
}

export function FlowerCarousel({ flowers }: FlowerCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const width = card ? card.offsetWidth + 20 : 320;
    track.scrollBy({ left: dir * width, behavior: "smooth" });
  }

  return (
    <div className="relative mt-10">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {flowers.map((f) => (
          <div key={f.id} data-card>
            <FlipCard flower={f} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Previous flowers"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-charcoal/12 bg-paper text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="px-2 text-xs text-charcoal-muted">Hover or tap a card to read its meaning</p>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Next flowers"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-charcoal/12 bg-paper text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}