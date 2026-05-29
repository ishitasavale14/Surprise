import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Music, ChevronLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { endingConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";

function BokehBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-primary/30 blur-[100px] mix-blend-multiply" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/3 right-1/4 w-[60vw] h-[60vw] rounded-full bg-accent/30 blur-[100px] mix-blend-multiply" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4], x: [0, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-2/3 left-1/2 w-[50vw] h-[50vw] rounded-full bg-[#E6D7FF]/40 blur-[100px] mix-blend-multiply" 
      />
    </div>
  );
}

function FloatingParticles() {
  const [particles] = useState(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100 + 100,
    size: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 12 + 10,
    type: (Math.random() > 0.5 ? "heart" : "sparkle") as "heart" | "sparkle"
  })));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-primary/50"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: `${p.size}rem` }}
          animate={{
            y: [0, -150, -300],
            x: [0, Math.random() * 60 - 30, Math.random() * 60 - 30],
            opacity: [0, 0.9, 0],
            rotate: [0, Math.random() * 360],
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

function ShootingStars() {
  const [stars, setStars] = useState<{ id: number; top: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prev) => [...prev, { id: Date.now(), top: `${Math.random() * 40 + 10}%` }]);
      setTimeout(() => {
        setStars((prev) => prev.slice(1));
      }, 2500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ x: "-10vw", y: 0, opacity: 0 }}
          animate={{ x: "110vw", y: 200, opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute h-px w-16 bg-white/80 blur-sm shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          style={{ top: star.top, transform: 'rotate(20deg)' }}
        />
      ))}
    </div>
  );
}

export default function Ending() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [wishMade, setWishMade] = useState(false);
  const [selectedStar, setSelectedStar] = useState<typeof endingConfig.constellationMessages[0] | null>(null);

  const starPositions = [
    { left: "10%", top: "40%" },
    { left: "30%", top: "10%" },
    { left: "50%", top: "50%" },
    { left: "70%", top: "20%" },
    { left: "90%", top: "60%" }
  ];

  const handleWish = () => {
    setWishMade(true);
    for (let i = 0; i < 30; i++) {
      const star = document.createElement("div");
      star.className = "wish-star";
      const x = window.innerWidth / 2 + (Math.random() * 200 - 100);
      const y = window.innerHeight / 2 + (Math.random() * 200 - 100);
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.setProperty("--tx", `${Math.random() * 300 - 150}px`);
      star.style.setProperty("--ty", `${-100 - Math.random() * 300}px`);
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 2100);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative selection:bg-primary selection:text-white">
      <BokehBackground />
      <FloatingParticles />
      <ShootingStars />

      <button 
        onClick={() => setLocation("/days")}
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

      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4">
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="font-script text-4xl md:text-6xl text-primary mb-6"
        >
          {endingConfig.introLines[0]}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="font-script text-4xl md:text-6xl text-primary"
        >
          {endingConfig.introLines[1]}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-16 glass-card rounded-3xl w-64 h-80 flex items-center justify-center border-2 border-primary/30 relative overflow-hidden"
        >
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-primary/10"
          />
          <span className="font-serif italic text-muted-foreground z-10">[ Add Final Photo ]</span>
        </motion.div>
      </section>

      <section className="relative z-10 py-32 px-4 max-w-5xl mx-auto w-full">
        <h2 className="font-script text-3xl text-center text-muted-foreground mb-16">Click the stars… ✨</h2>
        
        <div className="relative h-[300px] md:h-[400px] w-full max-w-3xl mx-auto">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points="10,40 30,10 50,50 70,20 90,60"
              fill="none"
              stroke="rgba(255,182,193,0.3)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
          </svg>

          {endingConfig.constellationMessages.map((msg, index) => (
            <motion.div
              key={msg.id}
              className="absolute flex flex-col items-center justify-center cursor-pointer group"
              style={{ left: starPositions[index].left, top: starPositions[index].top, transform: 'translate(-50%, -50%)' }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.3 }}
              onClick={() => setSelectedStar(msg)}
            >
              <Sparkles className="w-8 h-8 text-primary group-hover:scale-125 transition-transform drop-shadow-[0_0_10px_rgba(255,182,193,0.8)]" />
              <span className="font-serif text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-full whitespace-nowrap">
                {msg.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-32 px-4 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="font-script text-4xl md:text-6xl text-primary max-w-3xl mx-auto drop-shadow-[0_0_15px_rgba(255,182,193,0.4)]"
        >
          "{endingConfig.bigQuote}"
        </motion.p>
      </section>

      <section className="relative z-10 py-32 px-4 flex flex-col items-center text-center">
        <h2 className="font-script text-5xl text-primary mb-12">Make A Birthday Wish ❤️</h2>
        <div className="relative">
          <button
            onClick={handleWish}
            disabled={wishMade}
            className="relative bg-primary/20 hover:bg-primary/40 border-2 border-primary/50 text-primary font-script text-3xl px-12 py-6 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,182,193,0.3)] z-10"
          >
            {wishMade ? "Wish Made ✨" : "Make Wish"}
          </button>
          {!wishMade && (
            <div className="absolute inset-0 border border-primary/30 rounded-full animate-ping opacity-40 z-0 pointer-events-none" />
          )}
        </div>

        <AnimatePresence>
          {wishMade && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-card rounded-3xl max-w-lg mt-12 p-8"
            >
              <p className="font-serif italic text-lg text-foreground/80">
                {endingConfig.wishMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 py-32 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`rain-${i}`}
            className="absolute text-primary/30"
            style={{ left: `${Math.random() * 100}%`, top: `-20%` }}
            animate={{ y: ["0vh", "120vh"], opacity: [0, 0.4, 0] }}
            transition={{ duration: Math.random() * 4 + 4, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
          >
            <Heart className="w-5 h-5 fill-current" />
          </motion.div>
        ))}

        <p className="font-script text-3xl text-muted-foreground mb-16">The Last Words</p>
        
        <div className="space-y-8 mb-24 z-10">
          {endingConfig.finalLines.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: idx * 0.6 }}
              className="font-serif italic text-2xl md:text-3xl text-foreground/80"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 1 }}
          className="z-10 text-center"
        >
          <h1 className="font-script text-6xl md:text-8xl text-primary animate-pulse drop-shadow-[0_0_30px_rgba(255,182,193,0.6)] mb-8">
            Happy Birthday, {config.boyfriendName}
          </h1>
          <p className="font-serif italic text-xl text-muted-foreground mb-4">
            Forever yours,
          </p>
          <div className="inline-block relative">
            <span className="font-script text-4xl text-primary relative z-10">
              {config.yourName}
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 2.5 }}
              className="absolute bottom-0 left-0 h-[2px] bg-primary/50 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 py-32 px-4 flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-2xl">
          <button onClick={() => setLocation("/")} className="px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-serif transition-colors shadow-lg">
            Replay Our Story
          </button>
          <button onClick={() => setLocation("/letter")} className="px-8 py-4 rounded-full glass-card text-foreground font-serif hover:bg-white/40 transition-colors">
            Read The Letter Again
          </button>
          <button onClick={() => setLocation("/games")} className="px-8 py-4 rounded-full glass-card text-foreground font-serif hover:bg-white/40 transition-colors">
            Play The Games
          </button>
        </div>

        <p className="font-script text-2xl text-primary/60 mt-12">
          Made with love, always — {config.yourName}
        </p>
      </section>

      <AnimatePresence>
        {selectedStar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-white/40 backdrop-blur-xl"
            onClick={() => setSelectedStar(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full rounded-3xl p-10 text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedStar(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
              <h3 className="font-script text-3xl text-primary mb-4">{selectedStar.label}</h3>
              <p className="font-serif italic text-lg text-foreground/90 leading-relaxed mb-6">
                "{selectedStar.message}"
              </p>
              <div className="flex justify-center gap-2 text-primary/40">
                <Heart className="w-4 h-4 fill-current" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes wish-star {
          0% { opacity: 1; transform: scale(1) translate(0, 0); }
          100% { opacity: 0; transform: scale(0) translate(var(--tx), var(--ty)); }
        }
        .wish-star {
          animation: wish-star 2s ease-out forwards;
          position: fixed;
          width: 8px; height: 8px;
          border-radius: 50%;
          pointer-events: none;
          background: rgba(255,182,193,0.9);
          box-shadow: 0 0 10px rgba(255,182,193,0.8);
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}
