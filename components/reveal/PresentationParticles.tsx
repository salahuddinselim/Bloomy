"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getPresentation, type PresentationTheme } from "@/data/presentations";

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

function generateParticles(type: PresentationTheme["particleType"], count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    delay: Math.random() * 5,
    duration: type === "rain" ? 1.5 + Math.random() * 1 : 6 + Math.random() * 6,
    size: type === "sparkles" ? 4 + Math.random() * 6 : 8 + Math.random() * 12,
    rotation: Math.random() * 360,
  }));
}

function PetalParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, Math.sin(particle.id) * 40],
        rotate: [particle.rotation, particle.rotation + 360],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <svg width={particle.size} height={particle.size} viewBox="0 0 20 20">
        <ellipse cx="10" cy="10" rx="5" ry="8" fill="#f8c8d8" opacity="0.7" />
      </svg>
    </motion.div>
  );
}

function SparkleParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
      animate={{
        y: ["0vh", "100vh"],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 0.8, 0.5],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div
        className="rounded-full bg-yellow-300"
        style={{ width: particle.size, height: particle.size, opacity: 0.8 }}
      />
    </motion.div>
  );
}

function RainParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${particle.x}%`, top: "-5%" }}
      animate={{
        y: ["0vh", "110vh"],
        opacity: [0, 0.5, 0.5, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="h-4 w-px bg-gradient-to-b from-transparent via-blue-300/40 to-transparent" />
    </motion.div>
  );
}

function FireflyParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${particle.x}%`, top: `${particle.y + 30}%` }}
      animate={{
        x: [0, Math.sin(particle.id * 2) * 30, Math.cos(particle.id) * 20, 0],
        y: [0, Math.cos(particle.id) * 20, Math.sin(particle.id * 2) * 30, 0],
        opacity: [0, 0.8, 0.4, 0.9, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_2px_rgba(250,204,21,0.6)]" />
    </motion.div>
  );
}

function SakuraParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, Math.sin(particle.id) * 60],
        rotate: [particle.rotation, particle.rotation + 720],
        opacity: [0, 0.7, 0.7, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width={particle.size} height={particle.size} viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="4" fill="#f9a8d4" opacity="0.7" />
        <circle cx="7" cy="8" r="3" fill="#f472b6" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

function SnowParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${particle.x}%`, top: "-5%" }}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, Math.sin(particle.id) * 30],
        rotate: [0, 360],
        opacity: [0, 0.8, 0.8, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="rounded-full bg-white/80" style={{ width: particle.size, height: particle.size }} />
    </motion.div>
  );
}

const PARTICLE_COMPONENTS: Record<string, React.ComponentType<{ particle: Particle }>> = {
  petals: PetalParticle,
  sparkles: SparkleParticle,
  rain: RainParticle,
  fireflies: FireflyParticle,
  sakura: SakuraParticle,
  snow: SnowParticle,
};

export function PresentationParticles({ themeId }: { themeId: string }) {
  const theme = getPresentation(themeId);
  const [particles] = useState<Particle[]>(() => {
    if (!theme) return [];
    const count = theme.particleType === "rain" ? 40 : theme.particleType === "fireflies" ? 15 : 20;
    return generateParticles(theme.particleType, count);
  });

  if (!theme) return null;

  const ParticleComponent = PARTICLE_COMPONENTS[theme.particleType] ?? PetalParticle;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 10 }}>
      {particles.map((p) => (
        <ParticleComponent key={p.id} particle={p} />
      ))}
    </div>
  );
}
