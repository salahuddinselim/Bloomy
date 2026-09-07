"use client";

import { motion } from "framer-motion";

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 6,
  size: 8 + Math.random() * 12,
  rotation: Math.random() * 360,
}));

export function FloatingPetals() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      {PETALS.map((petal) => (
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
