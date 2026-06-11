import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ChevronLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { endingConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

function ShootingStars() {
  const [stars, setStars] = useState<{ id: number; top: string; duration: number }[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setStars(prev => [...prev, { id, top: `${Math.random() * 50 + 5}%`, duration: 2 + Math.random() }]);
      setTimeout(() => setStars(prev => prev.filter(s => s.id !== id)), 3000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map(star => (
        <motion.div key={star.id}
          initial={{ x: "-5vw", y: 0, opacity: 0 }}
          animate={{ x: "110vw", y: 120, opacity: [0, 1, 1, 0] }}
          transition={{ duration: star.duration, ease: "easeOut" }}
          className="absolute h-px w-20 rounded-full"
          style={{
            top: star.top,
            rotate: "15deg",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(220,130,160,0.6))",
            boxShadow: "0 0 8px rgba(255,255,255,0.6)",
          }}
        />
      ))}
    </div>
  );
}

const STAR_POSITIONS = [
  { left: "12%", top: "38%" },
  { left: "32%", top: "12%" },
  { left: "52%", top: "52%" },
  { left: "72%", top: "22%" },
  { left: "88%", top: "58%" },
];

export default function Ending() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [wishMade, setWishMade] = useState(false);
  const [selectedStar, setSelectedStar] = useState<typeof endingConfig.constellationMessages[0] | null>(null);

  const handleWish = () => {
    setWishMade(true);
    for (let i = 0; i < 36; i++) {
      const star = document.createElement("div");
      star.className = "wish-star";
      star.style.left = `${window.innerWidth / 2 + (Math.random() * 240 - 120)}px`;
      star.style.top  = `${window.innerHeight / 2 + (Math.random() * 240 - 120)}px`;
      star.style.setProperty("--tx", `${Math.random() * 300 - 150}px`);
      star.style.setProperty("--ty", `${-120 - Math.random() * 300}px`);
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 2200);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden relative"
      style={{ background: "linear-gradient(180deg, #1a0a12 0%, #0d0510 40%, #0a0316 100%)" }}>
      <BokehBackground />
      <FloatingParticles count={20} />
      <ShootingStars />

      {/* Twinkling stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} className="fixed rounded-full bg-white animate-twinkle pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            opacity: Math.random() * 0.6 + 0.1,
          }}
        />
      ))}

      <button onClick={() => setLocation("/days")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform">
        <ChevronLeft className="w-6 h-6 text-white/70" />
      </button>
      <button onClick={togglePlay}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform">
        <Heart className="w-5 h-5 text-pink-300" fill={isPlaying ? "currentColor" : "none"} />
      </button>

      {/* Intro */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4">
        {endingConfig.introLines.map((line, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 + i * 0.8 }}
            className="font-script text-5xl md:text-7xl text-pink-200 mb-4"
            style={{ textShadow: "0 0 40px rgba(255,182,193,0.5)" }}>
            {line}
          </motion.p>
        ))}

        {/* Final photo frame */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.4, duration: 1.2 }}
          className="mt-16 relative"
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-3xl animate-pulse"
            style={{ boxShadow: "0 0 60px rgba(255,182,193,0.25), 0 0 120px rgba(220,100,140,0.1)" }} />
          <div className="relative polaroid w-64 md:w-80"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div className="aspect-[4/3] rounded-sm bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-pink-900/30 flex flex-col items-center justify-center gap-3">
              <Heart className="w-12 h-12 text-pink-300/50 animate-heartbeat" fill="currentColor" />
              <span className="font-serif italic text-pink-200/40 text-sm">[ Your favourite photo ]</span>
            </div>
            <p className="font-handwriting text-center text-pink-200/60 text-base pt-3 pb-1">Us, always ❤️</p>
          </div>
        </motion.div>
      </section>

      {/* Constellation */}
      <section className="relative z-10 py-32 px-4 max-w-5xl mx-auto w-full">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-script text-4xl md:text-5xl text-pink-200/80 text-center mb-16"
          style={{ textShadow: "0 0 30px rgba(255,182,193,0.3)" }}>
          Click the stars… ✨
        </motion.h2>

        <div className="relative h-[300px] md:h-[420px] w-full max-w-3xl mx-auto">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.polyline points="12,38 32,12 52,52 72,22 88,58"
              fill="none" stroke="rgba(255,182,193,0.2)" strokeWidth="0.4" strokeDasharray="2 3"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }} />
          </svg>

          {endingConfig.constellationMessages.map((msg, i) => (
            <motion.button key={msg.id}
              className="absolute group flex flex-col items-center"
              style={{ left: STAR_POSITIONS[i].left, top: STAR_POSITIONS[i].top, transform: "translate(-50%,-50%)" }}
              initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.3, type: "spring" }}
              onClick={() => setSelectedStar(msg)}
            >
              <motion.div whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }}>
                <Sparkles className="w-8 h-8 text-pink-300 drop-shadow-[0_0_12px_rgba(255,182,193,0.9)]" />
              </motion.div>
              <span className="font-serif text-xs text-pink-200/50 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {msg.label}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Big quote */}
      <section className="relative z-10 py-32 px-4 text-center">
        <motion.p initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.8 }}
          className="font-script text-4xl md:text-6xl text-pink-200 max-w-3xl mx-auto leading-relaxed"
          style={{ textShadow: "0 0 40px rgba(255,182,193,0.3)" }}>
          "{endingConfig.bigQuote}"
        </motion.p>
      </section>

      {/* Make a wish */}
      <section className="relative z-10 py-32 px-4 flex flex-col items-center text-center">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-script text-6xl text-pink-200 mb-4"
          style={{ textShadow: "0 0 30px rgba(255,182,193,0.5)" }}>
          Make A Birthday Wish ❤️
        </motion.h2>
        <p className="font-serif italic text-pink-200/50 mb-14 text-lg">Close your eyes. The stars are listening.</p>

        <div className="relative">
          <motion.button onClick={handleWish} disabled={wishMade}
            whileHover={!wishMade ? { scale: 1.05 } : {}} whileTap={{ scale: 0.97 }}
            className="btn-shimmer relative font-script text-3xl px-14 py-7 rounded-full transition-all z-10 flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "rgba(255,182,193,0.15)",
              border: "2px solid rgba(255,182,193,0.4)",
              color: "rgb(255,182,193)",
              boxShadow: "0 0 40px rgba(255,182,193,0.25), inset 0 0 20px rgba(255,182,193,0.05)",
            }}>
            <Sparkles className="w-6 h-6" />
            {wishMade ? "Wish Made ✨" : "Make Wish"}
            <Sparkles className="w-6 h-6" />
          </motion.button>
          {!wishMade && <div className="absolute inset-0 rounded-full border border-pink-300/20 animate-ping opacity-30 pointer-events-none" />}
        </div>

        <AnimatePresence>
          {wishMade && (
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="mt-14 max-w-lg p-10 rounded-3xl text-center"
              style={{ background: "rgba(255,182,193,0.08)", border: "1px solid rgba(255,182,193,0.2)", backdropFilter: "blur(20px)" }}>
              <Heart className="w-10 h-10 text-pink-300/50 mx-auto mb-6 animate-heartbeat" fill="currentColor" />
              <p className="font-serif italic text-xl text-pink-100/80 leading-relaxed">{endingConfig.wishMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Heart rain finale */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 py-32 overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => (
          <motion.div key={i} className="absolute text-pink-400/20"
            style={{ left: `${Math.random() * 100}%`, top: "-10%" }}
            animate={{ y: ["0", "120vh"], opacity: [0, 0.5, 0] }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 6, ease: "linear" }}>
            <Heart className="fill-current" style={{ width: `${Math.random() * 12 + 8}px`, height: `${Math.random() * 12 + 8}px` }} />
          </motion.div>
        ))}

        <p className="font-script text-3xl text-pink-200/50 mb-16 z-10">The Last Words</p>
        <div className="space-y-8 mb-24 z-10">
          {endingConfig.finalLines.map((line, idx) => (
            <motion.p key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, delay: idx * 0.6 }}
              className="font-serif italic text-2xl md:text-3xl text-pink-100/70 leading-relaxed">{line}</motion.p>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.5, delay: 1 }} className="z-10 text-center">
          <h1 className="font-script text-6xl md:text-8xl text-pink-200 mb-6 animate-heartbeat"
            style={{ textShadow: "0 0 50px rgba(255,182,193,0.6), 0 0 100px rgba(220,100,140,0.2)" }}>
            Happy Birthday, {config.boyfriendName}
          </h1>
          <p className="font-serif italic text-xl text-pink-200/50 mb-4">Forever yours,</p>
          <div className="inline-block relative">
            <span className="font-script text-4xl text-pink-200/80">{config.yourName}</span>
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 2.5 }}
              className="absolute bottom-0 left-0 h-px bg-pink-300/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Final CTAs */}
      <section className="relative z-10 py-24 px-4 flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col md:flex-row gap-4">
          <motion.button onClick={() => setLocation("/")} whileHover={{ scale: 1.04 }}
            className="btn-shimmer px-10 py-4 rounded-full font-serif text-lg text-white transition-all flex items-center gap-3"
            style={{ background: "rgba(220,100,140,0.6)", boxShadow: "0 0 30px rgba(220,100,140,0.3)" }}>
            <Heart className="w-5 h-5" fill="currentColor" /> Replay Our Story
          </motion.button>
          <button onClick={() => setLocation("/letter")}
            className="px-8 py-4 rounded-full font-serif text-pink-200/70 hover:text-pink-200 transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}>
            Read The Letter Again
          </button>
          <button onClick={() => setLocation("/games")}
            className="px-8 py-4 rounded-full font-serif text-pink-200/70 hover:text-pink-200 transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}>
            Play The Games 🎮
          </button>
        </div>
        <p className="font-script text-2xl text-pink-200/30 mt-14">Made with love, always — {config.yourName}</p>
      </section>

      {/* Star modal */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            style={{ background: "rgba(10,3,22,0.85)", backdropFilter: "blur(20px)" }}
            onClick={() => setSelectedStar(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-md w-full rounded-3xl p-10 text-center relative"
              style={{ background: "rgba(255,182,193,0.08)", border: "1px solid rgba(255,182,193,0.25)", backdropFilter: "blur(24px)" }}
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedStar(null)}
                className="absolute top-4 right-4 text-pink-200/40 hover:text-pink-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <Sparkles className="w-12 h-12 text-pink-300 mx-auto mb-6 drop-shadow-[0_0_12px_rgba(255,182,193,0.8)]" />
              <h3 className="font-script text-4xl text-pink-200 mb-4"
                style={{ textShadow: "0 0 20px rgba(255,182,193,0.4)" }}>{selectedStar.label}</h3>
              <p className="font-serif italic text-lg text-pink-100/80 leading-relaxed mb-6">"{selectedStar.message}"</p>
              <Heart className="w-5 h-5 text-pink-300/40 mx-auto" fill="currentColor" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
