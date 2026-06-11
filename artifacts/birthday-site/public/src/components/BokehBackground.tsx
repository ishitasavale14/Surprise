import { useMemo } from "react";
import { motion } from "framer-motion";

export default function BokehBackground() {
  const orbs = useMemo(() => [
    { color: "rgba(255,182,193,0.22)", size: "45vw", top: "5%",  left: "10%",  duration: 14, delay: 0 },
    { color: "rgba(230,215,255,0.2)",  size: "55vw", top: "50%", left: "55%",  duration: 18, delay: 3 },
    { color: "rgba(255,209,220,0.18)", size: "35vw", top: "70%", left: "5%",   duration: 12, delay: 6 },
    { color: "rgba(255,240,200,0.15)", size: "30vw", top: "20%", left: "70%",  duration: 16, delay: 2 },
    { color: "rgba(200,230,255,0.15)", size: "25vw", top: "85%", left: "75%",  duration: 20, delay: 8 },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            borderRadius: "50%",
            background: orb.color,
            filter: "blur(80px)",
            mixBlendMode: "multiply",
          }}
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.6, 1, 0.6],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
