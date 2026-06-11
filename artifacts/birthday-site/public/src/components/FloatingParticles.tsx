import { useMemo } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  type: "heart" | "sparkle" | "star" | "petal";
  opacity: number;
  drift: number;
}

interface FloatingParticlesProps {
  heartsOnly?: boolean;
  count?: number;
}

const SHAPES = {
  heart: ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  sparkle: ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.4L19 9l-5.2 3.8L15.6 18 12 14.8 8.4 18l1.8-5.2L5 9l5.2-1.6z"/>
    </svg>
  ),
  star: ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  petal: ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="12" rx="4" ry="8" transform="rotate(45 12 12)"/>
    </svg>
  ),
};

export default function FloatingParticles({ heartsOnly = false, count = 35 }: FloatingParticlesProps) {
  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 120,
      size: Math.random() * 14 + 8,
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 14,
      type: heartsOnly
        ? "heart"
        : (["heart", "heart", "sparkle", "star", "petal"][Math.floor(Math.random() * 5)] as Particle["type"]),
      opacity: Math.random() * 0.35 + 0.1,
      drift: Math.random() * 60 - 30,
    })),
  [count, heartsOnly]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => {
        const Shape = SHAPES[p.type];
        return (
          <motion.div
            key={p.id}
            className="absolute text-primary"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -180, -320],
              x: [0, p.drift * 0.5, p.drift],
              opacity: [0, p.opacity, 0],
              rotate: [0, Math.random() > 0.5 ? 120 : -120],
              scale: [0.6, 1, 0.4],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          >
            <Shape size={p.size} />
          </motion.div>
        );
      })}
    </div>
  );
}
