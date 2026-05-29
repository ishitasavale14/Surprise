import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Music, ChevronLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { daysConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";

function BokehBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[100px] mix-blend-multiply" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/3 right-1/4 w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[100px] mix-blend-multiply" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], x: [0, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-2/3 left-1/2 w-[30vw] h-[30vw] rounded-full bg-[#E6D7FF]/30 blur-[100px] mix-blend-multiply" 
      />
    </div>
  );
}

function FloatingParticles() {
  const [particles] = useState(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100 + 100,
    size: Math.random() * 1.2 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 15,
    type: (Math.random() > 0.5 ? "heart" : "sparkle") as "heart" | "sparkle"
  })));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-primary/40"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: `${p.size}rem` }}
          animate={{
            y: [0, -150, -300],
            x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25],
            opacity: [0, 0.8, 0],
            rotate: [0, Math.random() * 180],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        >
          {p.type === "heart" ? <Heart fill="currentColor" /> : <Sparkles />}
        </motion.div>
      ))}
    </div>
  );
}

export default function Days() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [selectedMemory, setSelectedMemory] = useState<typeof daysConfig.memories[0] | null>(null);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative selection:bg-primary selection:text-white">
      <BokehBackground />
      <FloatingParticles />

      <button 
        onClick={() => setLocation("/special")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={togglePlay}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        {isPlaying ? <Music className="w-5 h-5 opacity-50" /> : <Music className="w-5 h-5" />}
      </button>

      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="font-script text-6xl md:text-8xl text-primary drop-shadow-[0_0_20px_rgba(255,182,193,0.4)]"
        >
          {daysConfig.heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-serif italic text-xl md:text-2xl text-muted-foreground mt-6 max-w-2xl"
        >
          {daysConfig.subheading}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-20 glass-card max-w-2xl w-full rounded-3xl p-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-16 h-16 bg-white/40 -rotate-45 transform origin-top-left -translate-x-8 -translate-y-8" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/40 rotate-45 transform origin-top-right translate-x-8 -translate-y-8" />
          <div className="text-5xl mb-6">{daysConfig.featuredMemory.emoji}</div>
          <h2 className="font-script text-4xl text-primary mb-4">{daysConfig.featuredMemory.title}</h2>
          <p className="font-serif italic text-lg text-foreground/80 leading-relaxed mb-6">
            "{daysConfig.featuredMemory.text}"
          </p>
          <p className="font-serif text-xs text-muted-foreground">✦ Our most treasured memory ✦</p>
        </motion.div>
      </section>

      <section className="relative z-10 py-24 px-4 max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-4xl md:text-5xl text-center text-foreground mb-16"
        >
          Month by Month ✦
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {daysConfig.memories.map((month, index) => (
            <motion.div
              key={month.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(255,182,193,0.3)" }}
              onClick={() => setSelectedMemory(month)}
              className="glass-card rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
            >
              <span className="text-3xl mb-2 block">{month.emoji}</span>
              <h3 className="font-script text-xl text-primary">{month.month}</h3>
              <p className="font-serif text-sm text-foreground/70 italic line-clamp-2">
                {month.note}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-32 px-4 text-center">
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="font-script text-4xl md:text-5xl text-primary max-w-3xl mx-auto drop-shadow-sm"
        >
          {daysConfig.midQuote}
        </motion.p>
      </section>

      <section className="relative z-10 py-24 px-4 max-w-5xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-3xl md:text-4xl text-center text-foreground mb-12"
        >
          The Pages We Haven't Written Yet ✨
        </motion.h2>

        <div className="flex flex-col sm:flex-row gap-4">
          {daysConfig.futureGoals.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex-1 glass rounded-2xl p-6 opacity-60 border border-dashed border-primary/30 text-center flex flex-col items-center justify-center gap-3"
            >
              <span className="text-primary text-sm">✦</span>
              <p className="font-serif italic text-muted-foreground">{goal}...</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-32 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-12">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-script text-4xl md:text-5xl text-primary mb-4"
          >
            {daysConfig.endingLine1}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="font-script text-4xl md:text-5xl text-primary drop-shadow-[0_0_15px_rgba(255,182,193,0.5)]"
          >
            {daysConfig.endingLine2}
          </motion.p>
        </div>
        
        <button
          onClick={() => setLocation("/ending")}
          className="px-8 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all shadow-[0_0_15px_rgba(255,182,193,0.4)]"
        >
          {daysConfig.ctaLabel}
        </button>

        <p className="font-script text-2xl text-foreground/60 mt-16">
          Made with love by {config.yourName}
        </p>
      </section>

      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-white/40 backdrop-blur-xl"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full rounded-3xl p-10 text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-6xl mb-6">{selectedMemory.emoji}</div>
              <h3 className="font-script text-4xl text-primary mb-2">{selectedMemory.month}</h3>
              <p className="font-serif text-sm text-muted-foreground mb-8">
                {selectedMemory.note}
              </p>
              <p className="font-serif italic text-lg text-foreground/90 leading-relaxed mb-6">
                "{selectedMemory.hiddenMemory}"
              </p>
              <div className="flex justify-center gap-2 text-primary/40">
                <Heart className="w-4 h-4 fill-current" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
