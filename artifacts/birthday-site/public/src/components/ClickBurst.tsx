import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function ClickBurst() {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newBurst = { id: Date.now(), x: e.clientX, y: e.clientY };
      setBursts((prev) => [...prev, newBurst]);
      setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== newBurst.id)), 1000);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            className="absolute flex items-center justify-center"
            style={{ left: b.x, top: b.y }}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2, y: -50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Heart className="text-primary h-6 w-6" fill="currentColor" />
            <Sparkles className="text-primary/40 absolute h-8 w-8" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}