import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Music, ChevronLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { specialConfig, config } from "@/config";

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

export default function Special() {
  const [, setLocation] = useLocation();
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<typeof specialConfig.qualities[0] | null>(null);
  const [complimentIndex, setComplimentIndex] = useState(-1);
  const [complimentPos, setComplimentPos] = useState({ top: "20%", left: "5%" });

  useEffect(() => {
    const interval = setInterval(() => {
      setComplimentIndex((prev) => {
        const next = (prev + 1) % specialConfig.floatingCompliments.length;
        setComplimentPos({
          top: `${Math.floor(Math.random() * 20 + 10)}%`,
          left: Math.random() > 0.5 ? `${Math.floor(Math.random() * 6 + 2)}%` : `${Math.floor(Math.random() * 6 + 80)}%`
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative selection:bg-primary selection:text-white">
      <BokehBackground />
      <FloatingParticles />

      <button 
        onClick={() => setLocation("/gallery")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={() => setMusicPlaying(!musicPlaying)}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        {musicPlaying ? <Music className="w-5 h-5 opacity-50" /> : <Music className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {complimentIndex >= 0 && (
          <motion.div
            key={complimentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="fixed z-40 font-script text-2xl md:text-3xl text-primary/60 pointer-events-none drop-shadow-sm"
            style={{ top: complimentPos.top, left: complimentPos.left }}
          >
            {specialConfig.floatingCompliments[complimentIndex]}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="font-script text-6xl md:text-8xl text-primary drop-shadow-[0_0_20px_rgba(255,182,193,0.4)] max-w-4xl"
        >
          {specialConfig.heading}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-8 flex flex-col gap-2"
        >
          <p className="font-serif italic text-xl md:text-2xl text-muted-foreground">
            {specialConfig.subheading1}
          </p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="font-serif italic text-xl md:text-2xl text-muted-foreground"
          >
            {specialConfig.subheading2}
          </motion.p>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ delay: 2.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-serif italic text-sm text-primary/50 mt-24 tracking-wider"
        >
          ✦ scroll ✦
        </motion.p>
      </section>

      <section className="relative z-10 py-24 px-4 max-w-5xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-4xl md:text-5xl text-center text-foreground mb-16"
        >
          What I love most about you
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialConfig.qualities.map((quality, index) => (
            <motion.div
              key={quality.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.03, rotate: 0, boxShadow: "0 0 25px rgba(255,182,193,0.3)" }}
              onClick={() => setSelectedQuality(quality)}
              className="glass-card rounded-3xl p-8 cursor-pointer relative transition-all"
              style={{ rotate: `${quality.rotate}deg` }}
            >
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-6 mx-auto">
                {quality.emoji}
              </div>
              <h3 className="font-script text-3xl text-primary text-center mb-4">{quality.title}</h3>
              <p className="font-serif text-base text-muted-foreground leading-relaxed text-center">
                {quality.description}
              </p>
              <p className="absolute bottom-4 right-6 font-serif italic text-xs text-primary/50">
                tap to read more ✦
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
          {specialConfig.midQuote}
        </motion.p>
      </section>

      <section className="relative z-10 py-24 px-4 max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-4xl text-center text-foreground mb-12"
        >
          The Little Things ✦
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4">
          {specialConfig.littleThings.map((thing, index) => (
            <motion.div
              key={thing.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl px-6 py-4 font-serif text-base text-foreground/80 flex items-center gap-3"
            >
              <span className="text-primary">✦</span>
              {thing.text}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-32 flex flex-col items-center justify-center text-center px-4">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-serif italic text-2xl text-muted-foreground mb-4"
        >
          {specialConfig.endingLine1}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-4xl md:text-5xl text-primary mb-12 drop-shadow-[0_0_15px_rgba(255,182,193,0.5)] animate-pulse"
        >
          {specialConfig.endingLine2}
        </motion.p>
        
        <button
          onClick={() => setLocation("/days")}
          className="px-8 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all shadow-[0_0_15px_rgba(255,182,193,0.4)]"
        >
          {specialConfig.ctaLabel}
        </button>

        <p className="font-script text-2xl text-foreground/60 mt-16">
          Made with love by {config.yourName}
        </p>
      </section>

      <AnimatePresence>
        {selectedQuality && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-white/40 backdrop-blur-xl"
            onClick={() => setSelectedQuality(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full rounded-3xl p-10 text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedQuality(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-6xl mb-6">{selectedQuality.emoji}</div>
              <h3 className="font-script text-4xl text-primary mb-6">{selectedQuality.title}</h3>
              <p className="font-serif italic text-lg text-foreground/90 leading-relaxed mb-8">
                "{selectedQuality.expandedMessage}"
              </p>
              <div className="flex justify-center gap-2 text-primary/40">
                <Heart className="w-4 h-4 fill-current" />
                <Heart className="w-4 h-4 fill-current" />
                <Heart className="w-4 h-4 fill-current" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
