"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

function generatePetals(): Petal[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 6,
    size: 8 + Math.random() * 12,
    rotation: Math.random() * 360,
  }));
}

export function FloatingPetals() {
  // Petals are random per mount, so they must never be computed during the
  // render React uses to hydrate: a server-random and a client-random array
  // always disagree, which React reports as a hydration mismatch on every
  // page load. Starting empty (matching on server and first client render)
  // and filling in from an effect after mount keeps hydration clean; the
  // petals fade in a beat later, invisible for a decorative background layer.
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(generatePetals());
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: petal.left,
            top: "-20px",
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, Math.sin(petal.id) * 50],
            rotate: [petal.rotation, petal.rotation + 360],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 20 20"
            fill="none"
            className="opacity-30"
          >
            <ellipse
              cx="10"
              cy="10"
              rx="6"
              ry="9"
              fill="#c98a92"
              transform={`rotate(${petal.rotation} 10 10)`}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
