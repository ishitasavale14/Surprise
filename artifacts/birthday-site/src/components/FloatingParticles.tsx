import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

interface FloatingParticlesProps {
  heartsOnly?: boolean;
}

export default function FloatingParticles({ heartsOnly = false }: FloatingParticlesProps) {
  const [particles] = useState(() =>
    Array.from({ length: heartsOnly ? 20 : 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      type: heartsOnly ? "heart" : ((Math.random() > 0.5 ? "heart" : "sparkle") as "heart" | "sparkle"),
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={heartsOnly ? "absolute text-primary/30" : "absolute text-primary/40"}
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: `${p.size}rem` }}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25],
            opacity: [0, heartsOnly ? 0.6 : 0.8, 0],
            rotate: [0, Math.random() * 180],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        >
          {p.type === "heart" ? <Heart fill="currentColor" /> : <Sparkles />}
        </motion.div>
      ))}
    </div>
  );
}