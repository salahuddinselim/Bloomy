import type { CSSProperties } from "react";
import { BouquetCanvas } from "@/components/bouquet/BouquetCanvas";
import { BouquetAsset, getAssetDef } from "@/components/bouquet/BouquetAsset";
import type { Bouquet } from "@/lib/bouquet/types";

interface OrbitFlower {
  id: string;
  /** Distance of the orbit path from the bouquet (the "sun") in px. */
  radius: number;
  /** Seconds for one full revolution. */
  dur: number;
  /** Negative seconds — starts the flower mid-orbit so they don't line up. */
  delay: number;
  size: string;
}

const ORBIT_FLOWERS: OrbitFlower[] = [
  { id: "babys_breath", radius: 150, dur: 17, delay: -3, size: "h-9 w-9" },
  { id: "rose", radius: 185, dur: 21, delay: -12, size: "h-12 w-12" },
  { id: "tulip", radius: 210, dur: 14, delay: -7, size: "h-10 w-10" },
  { id: "daisy", radius: 225, dur: 26, delay: -2, size: "h-9 w-9" },
  { id: "peony", radius: 240, dur: 19, delay: -16, size: "h-11 w-11" },
];

/**
 * The hero sculpture: a bouquet at the center, flowers drifting around it on
 * tilted, elliptical orbits like planets around the sun. Pure CSS animation on
 * a single 3D plane — cheap, smooth, and auto-disabled for reduced motion.
 */
export function SolarSystem({ bouquet }: { bouquet: Bouquet }) {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Orbital field (desktop only — too cramped on small screens) */}
      <div aria-hidden="true" className="absolute inset-[-18%] hidden lg:block">
        <div className="solar-plane absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy/10 blur-3xl" />
          {ORBIT_FLOWERS.map((flower) => {
            const def = getAssetDef(flower.id);
            if (!def) return null;
            const vars = {
              "--orbit-radius": `${flower.radius}px`,
              "--orbit-dur": `${flower.dur}s`,
            } as CSSProperties;
            const delay = { animationDelay: `${flower.delay}s` } as CSSProperties;
            const ring = { width: flower.radius * 2, height: flower.radius * 2 } as CSSProperties;
            return (
              <div key={flower.id}>
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-burgundy/20"
                  style={ring}
                />
                <div className="solar-orbit" style={{ ...vars, ...delay }}>
                  <div className="solar-position">
                    <div className="solar-revolve" style={delay}>
                      <div className="solar-billboard">
                        <BouquetAsset
                          type={flower.id}
                          category={def.category}
                          className={`${flower.size} drop-shadow-xl`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The bouquet itself — the sun the flowers circle */}
      <div className="relative rounded-[2rem] border border-charcoal/8 bg-paper p-5 shadow-[0_24px_60px_-24px_rgba(42,37,33,0.35)]">
        <div className="overflow-hidden rounded-[1.5rem] bg-[linear-gradient(165deg,#f5edde,#efe4cd)]">
          <BouquetCanvas bouquet={bouquet} />
        </div>
        <div className="mt-5 flex items-center justify-between px-1">
          <div>
            <p className="font-display text-sm text-charcoal">&ldquo;For no reason at all.&rdquo;</p>
            <p className="mt-1 text-xs text-charcoal-soft/60">burgundy roses · peony · ranunculus</p>
          </div>
          <span className="rounded-full border border-charcoal/12 px-3 py-1 text-xs uppercase tracking-widest text-charcoal-soft/70">
            warm ivory
          </span>
        </div>
      </div>
    </div>
  );
}