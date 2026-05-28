import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Music, Pause, Play, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { config } from "@/config";

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number; type: "heart" | "sparkle" }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      type: (Math.random() > 0.5 ? "heart" : "sparkle") as "heart" | "sparkle",
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-primary/40"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: `${p.size}rem` }}
          animate={{
            y: [0, -100, -200],
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

function ClickBurst() {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newBurst = { id: Date.now(), x: e.clientX, y: e.clientY };
      setBursts((prev) => [...prev, newBurst]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
      }, 1000);
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
            <Sparkles className="text-accent absolute h-8 w-8 animate-spin-slow" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient text-foreground overflow-x-hidden selection:bg-primary selection:text-white">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl"
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mb-8"
            >
              <Heart className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(255,182,193,0.8)]" fill="currentColor" />
            </motion.div>
            <p className="font-script text-3xl md:text-4xl text-foreground/80 tracking-wider">
              Loading your love story...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <ClickBurst />
      <FloatingParticles />

      {/* Audio Player UI */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed top-6 right-6 z-40 p-4 rounded-full glass-card hover:scale-105 transition-transform duration-300 group"
        aria-label="Toggle Music"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
        ) : (
          <Play className="w-5 h-5 text-primary group-hover:text-primary-foreground ml-1" />
        )}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-50" />
      </motion.button>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 z-10">
        <div className="absolute inset-0 pointer-events-none radial-gradient-mask" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="font-script text-6xl md:text-8xl lg:text-9xl text-foreground mb-6 drop-shadow-sm leading-tight">
            Happy Birthday,<br/>
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {config.boyfriendName}
            </span> ❤️
          </h1>
          <p className="font-serif text-xl md:text-3xl text-foreground/80 italic tracking-wide">
            A little universe made only for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce"
        >
          <span className="text-sm font-serif italic text-muted-foreground">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Scrapbook / Glassmorphism Cards */}
      <section className="relative py-32 px-4 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -5 }}
            whileInView={{ opacity: 1, x: 0, rotate: -2 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2 }}
            className="glass-card p-6 md:p-8 rounded-[2rem] transform hover:rotate-0 hover:scale-[1.02] transition-all duration-500 relative"
          >
            <div className="absolute -top-4 -left-4 w-12 h-12 text-primary opacity-60">
              <Sparkles className="w-full h-full" />
            </div>
            <div className="aspect-[4/5] bg-muted/30 rounded-2xl overflow-hidden relative group">
              {/* Placeholder for real photo */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-serif italic">
                [Add your favorite photo here]
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-overlay" />
            </div>
            <div className="mt-6 text-center">
              <p className="font-script text-3xl text-primary">{config.specialDate}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="glass-card p-8 md:p-12 rounded-[2rem] text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10" />
              <Heart className="w-12 h-12 text-primary/30 absolute top-4 right-4 animate-pulse" fill="currentColor" />
              
              <h2 className="font-serif text-2xl md:text-4xl text-foreground/90 leading-relaxed mb-6 italic">
                "{config.customQuote}"
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 relative z-10">
                <button 
                  onClick={() => setLocation("/our-story")}
                  className="px-8 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all hover:shadow-[0_0_20px_rgba(255,182,193,0.6)] backdrop-blur-md overflow-hidden relative group"
                >
                  <span className="relative z-10">Enter Our Story</span>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
                <button className="px-8 py-4 rounded-full glass hover:bg-white/40 text-foreground font-serif text-lg tracking-wide transition-all border border-white/50">
                  Open Your Surprise
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center relative z-10">
        <p className="font-script text-3xl text-foreground/70">
          Made with love by {config.yourName}
        </p>
      </footer>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        .radial-gradient-mask {
          background: radial-gradient(circle at center, transparent 0%, var(--color-background) 100%);
        }
      `}</style>
    </div>
  );
}