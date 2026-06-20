import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { scrapbookConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

type Memory = typeof scrapbookConfig.memories[0];

function ScrapbookCard({ memory, index, onClick }: { memory: Memory; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: memory.rotate }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
      onClick={onClick}
      className="relative cursor-pointer"
      style={{ transform: `rotate(${memory.rotate}deg)` }}
    >
      {/* Tape */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 z-20 rounded-sm"
        style={{
          background: "rgba(255, 240, 180, 0.65)",
          border: "1px solid rgba(200, 180, 100, 0.25)",
          transform: `translateX(-50%) rotate(${memory.tapeRotate}deg)`,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Card */}
      <div className="polaroid transition-all duration-500 hover:shadow-[0_20px_60px_rgba(220,130,160,0.3)]">
        {/* Photo area */}
        <div
          className="relative overflow-hidden rounded-sm flex items-center justify-center"
          style={{ aspectRatio: "1", background: "linear-gradient(135deg, #ffe4ef, #f0e0ff, #ffe8d6)" }}
        >
          <span className="text-6xl">{memory.emoji}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        </div>

        {/* Caption area */}
        <div className="pt-4 pb-2 space-y-1">
          <p className="font-handwriting text-lg text-foreground/90 leading-snug">{memory.caption}</p>
          <p className="font-serif text-xs text-muted-foreground">{memory.date}</p>
        </div>
      </div>
    </motion.div>
  );
}

function MemoryModal({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: "rgba(20,5,15,0.8)", backdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30, rotate: memory.rotate }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative max-w-sm w-full"
      >
        {/* Tape */}
        <div
          className="absolute -top-3 left-1/2 z-20 w-16 h-5 rounded-sm"
          style={{
            background: "rgba(255, 240, 180, 0.7)",
            border: "1px solid rgba(200, 180, 100, 0.3)",
            transform: `translateX(-50%) rotate(${memory.tapeRotate}deg)`,
          }}
        />

        <div className="polaroid">
          <div
            className="relative overflow-hidden rounded-sm flex items-center justify-center"
            style={{ aspectRatio: "1", background: "linear-gradient(135deg, #ffe4ef, #f0e0ff, #ffe8d6)" }}
          >
            <span className="text-8xl">{memory.emoji}</span>
          </div>
          <div className="pt-5 pb-3 space-y-3">
            <p className="font-handwriting text-xl text-foreground/90">{memory.caption}</p>
            <p className="font-serif text-sm text-muted-foreground">{memory.date}</p>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <p className="font-serif italic text-base text-foreground/80 leading-relaxed">{memory.memory}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Scrapbook() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [selected, setSelected] = useState<Memory | null>(null);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative">
      <BokehBackground />
      <FloatingParticles heartsOnly />

      {/* Nav */}
      <button
        onClick={() => setLocation("/days")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform"
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
      <button
        onClick={togglePlay}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Heart className="w-5 h-5 text-primary" fill={isPlaying ? "currentColor" : "none"} />
      </button>

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4 }}
        >
          <p className="font-serif italic text-muted-foreground text-lg mb-3">
            little pieces of us
          </p>
          <h1 className="font-script text-7xl md:text-8xl text-primary text-glow mb-4">
            {scrapbookConfig.heading}
          </h1>
          <p className="font-serif italic text-xl text-muted-foreground max-w-xl mx-auto">
            {scrapbookConfig.subheading}
          </p>
        </motion.div>
      </section>

      {/* Scrapbook grid */}
      <section className="relative z-10 py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16 items-start">
          {scrapbookConfig.memories.map((memory, i) => (
            <ScrapbookCard
              key={memory.id}
              memory={memory}
              index={i}
              onClick={() => setSelected(memory)}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-serif italic text-xs text-muted-foreground/50 mt-12 tracking-wider"
        >
          ✦ click any memory to read its story ✦
        </motion.p>
      </section>

      {/* Closing quote */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 py-16 px-4 text-center"
      >
        <div className="glass-card-strong rounded-[2.5rem] max-w-xl mx-auto p-12">
          <Heart className="w-10 h-10 text-primary/40 mx-auto mb-6 animate-heartbeat" fill="currentColor" />
          <p className="font-script text-4xl text-primary text-glow mb-4">
            Every page is my favorite.
          </p>
          <p className="font-serif italic text-muted-foreground">
            Because every page has you in it. ❤️
          </p>
        </div>
      </motion.section>

      {/* CTA */}
      <section className="relative z-10 pb-24 px-4 text-center">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setLocation("/ending")}
          className="btn-shimmer px-10 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide glow-primary flex items-center gap-3 mx-auto"
        >
          <Heart className="w-5 h-5" fill="currentColor" />
          Continue to the Ending
        </motion.button>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && <MemoryModal memory={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
