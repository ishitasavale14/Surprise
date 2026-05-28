import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Music, ChevronLeft, Check, Pause } from "lucide-react";
import { useLocation } from "wouter";
import { futureConfig, config } from "@/config";

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
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number; type: "heart" | "sparkle" }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 100,
      size: Math.random() * 1.2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 15,
      type: (Math.random() > 0.5 ? "heart" : "sparkle") as "heart" | "sparkle"
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

export default function Future() {
  const [, setLocation] = useLocation();
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [guestbookMsg, setGuestbookMsg] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [timeDiff, setTimeDiff] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const start = new Date(futureConfig.relationshipStartDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      let diff = Math.max(0, now - start) / 1000;
      
      const years = Math.floor(diff / (365 * 24 * 60 * 60));
      diff -= years * 365 * 24 * 60 * 60;
      
      const months = Math.floor(diff / (30 * 24 * 60 * 60));
      diff -= months * 30 * 24 * 60 * 60;
      
      const days = Math.floor(diff / (24 * 60 * 60));
      diff -= days * 24 * 60 * 60;
      
      const hours = Math.floor(diff / (60 * 60));
      diff -= hours * 60 * 60;
      
      const minutes = Math.floor(diff / 60);
      diff -= minutes * 60;
      
      const seconds = Math.floor(diff);
      
      setTimeDiff({ years, months, days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWish = () => {
    setWishMade(true);
    for (let i = 0; i < 20; i++) {
      const star = document.createElement("div");
      star.className = "wish-star";
      const x = window.innerWidth / 2 + (Math.random() * 200 - 100);
      const y = window.innerHeight / 2 + (Math.random() * 200 - 100);
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.setProperty("--tx", `${Math.random() * 200 - 100}px`);
      star.style.setProperty("--ty", `${-100 - Math.random() * 200}px`);
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 2100);
    }
  };

  const handleSaveMsg = () => {
    if (!guestbookMsg.trim()) return;
    setSavedMsg(guestbookMsg);
    setGuestbookMsg("");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const timerLabels = [
    { label: "Years", val: timeDiff.years },
    { label: "Months", val: timeDiff.months },
    { label: "Days", val: timeDiff.days },
    { label: "Hours", val: timeDiff.hours },
    { label: "Minutes", val: timeDiff.minutes },
    { label: "Seconds", val: timeDiff.seconds },
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative selection:bg-primary selection:text-white">
      <BokehBackground />
      <FloatingParticles />

      {/* Fixed UI */}
      <button 
        onClick={() => setLocation("/reasons")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={() => setMusicPlaying(!musicPlaying)}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        {musicPlaying ? <Pause className="w-5 h-5" /> : <Music className="w-5 h-5" />}
      </button>

      {/* SECTION 1: HERO INTRO */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4">
        <div className="flex items-center gap-4">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-primary/40">
            <Heart className="w-6 h-6 fill-current" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="font-script text-6xl md:text-8xl text-primary drop-shadow-[0_0_20px_rgba(255,182,193,0.4)]"
          >
            {futureConfig.heading}
          </motion.h1>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="text-primary/40">
            <Heart className="w-6 h-6 fill-current" />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-serif italic text-xl md:text-2xl text-muted-foreground mt-8"
        >
          {futureConfig.subheading1}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="font-serif italic text-xl md:text-2xl text-muted-foreground mt-2"
        >
          {futureConfig.subheading2}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-serif italic text-sm text-primary/50 mt-24 tracking-wider"
        >
          ✦ scroll to explore our future ✦
        </motion.p>
      </section>

      {/* SECTION 2: LIVE RELATIONSHIP COUNTER */}
      <section className="relative z-10 py-24 px-4 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-serif italic text-xl text-muted-foreground mb-12"
        >
          {futureConfig.counterLabel}
        </motion.p>
        
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {timerLabels.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
              className="glass-card rounded-2xl p-6 text-center min-w-[100px] md:min-w-[120px]"
            >
              <motion.div 
                animate={{ opacity: [0.8, 1, 0.8] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="font-serif font-bold text-4xl md:text-5xl text-primary mb-2"
              >
                {item.val}
              </motion.div>
              <div className="text-xs uppercase tracking-widest font-sans text-muted-foreground">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-3xl text-primary/60 mt-12"
        >
          ...and counting
        </motion.p>
      </section>

      {/* SECTION 3: FUTURE PROMISES */}
      <section className="relative z-10 max-w-6xl mx-auto py-24 px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-4xl md:text-5xl text-center text-foreground mb-16"
        >
          Promises I'm Making You
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureConfig.promises.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -4, boxShadow: "0 0 20px rgba(255,182,193,0.3)" }}
              className="glass-card rounded-3xl p-6 flex items-center gap-4 transition-all"
            >
              <div className="bg-primary/10 rounded-full p-4 flex items-center justify-center text-2xl">
                {p.emoji}
              </div>
              <p className="font-serif text-lg text-foreground/80 leading-relaxed">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: BUCKET LIST / DREAM BOARD */}
      <section className="relative z-10 max-w-4xl mx-auto py-24 px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-4xl md:text-5xl text-center text-foreground mb-16"
        >
          Our Dream List ✨
        </motion.h2>

        <div className="flex flex-col gap-6 max-w-xl mx-auto mb-16">
          {futureConfig.bucketList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group flex items-center gap-4 cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-[24px] h-[24px] rounded-full border border-primary/40 flex items-center justify-center transition-colors group-hover:bg-primary/80 group-hover:border-primary/80"
              >
                <Check className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <span className="font-serif text-lg text-foreground/80 group-hover:text-primary transition-colors">
                {item}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl flex-1 aspect-video flex items-center justify-center">
              <span className="font-serif italic text-muted-foreground/60 text-sm">
                [ Add Dream Photo {i} ]
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: MAKE A WISH */}
      <section className="relative z-10 py-32 px-4 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="font-script text-5xl text-primary mb-4"
        >
          Make A Wish ❤️
        </motion.h2>
        <p className="font-serif italic text-muted-foreground mb-12">
          Close your eyes. Think of something beautiful.
        </p>

        <div className="relative">
          <button
            onClick={handleWish}
            disabled={wishMade}
            className="relative bg-primary/20 hover:bg-primary/40 border-2 border-primary/50 text-primary font-script text-3xl px-12 py-6 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,182,193,0.3)] hover:shadow-[0_0_40px_rgba(255,182,193,0.5)] z-10"
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
              transition={{ type: "spring", duration: 0.8, delay: 0.5 }}
              className="glass-card rounded-3xl max-w-lg mt-12 p-8"
            >
              <p className="font-serif italic text-lg text-foreground/80">
                {futureConfig.makeAWishMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* SECTION 6: GUESTBOOK */}
      <section className="relative z-10 py-24 px-4 max-w-2xl mx-auto text-center">
        <h2 className="font-script text-4xl text-foreground mb-8">Write Something Back 💌</h2>
        <div className="glass-card rounded-3xl p-8 relative">
          <textarea
            value={guestbookMsg}
            onChange={(e) => setGuestbookMsg(e.target.value)}
            placeholder={futureConfig.guestbookPlaceholder}
            className="w-full bg-transparent border-none outline-none resize-none font-serif text-lg text-foreground placeholder:text-muted-foreground/60 min-h-[150px]"
          />
          <button
            onClick={handleSaveMsg}
            className="mt-6 px-8 py-3 rounded-full bg-primary/80 hover:bg-primary text-white font-serif transition-colors shadow-lg"
          >
            Save Message 💕
          </button>
          
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow border border-primary/20 text-sm font-serif text-primary"
              >
                Message saved with love 🌸
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {savedMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 mt-8 bg-white/40"
          >
            <p className="font-serif italic text-foreground/80 whitespace-pre-wrap">"{savedMsg}"</p>
          </motion.div>
        )}
      </section>

      {/* SECTION 7: EMOTIONAL FINALE */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 pt-24 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/30"
            style={{ left: `${Math.random() * 100}%` }}
            initial={{ y: "-50vh", opacity: 0 }}
            whileInView={{ y: "100vh", opacity: [0, 0.6, 0] }}
            viewport={{ once: true }}
            transition={{
              duration: Math.random() * 5 + 5,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          >
            <Heart className="w-4 h-4 fill-current" />
          </motion.div>
        ))}

        <div className="space-y-12 mb-24 z-10">
          {futureConfig.finalLines.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: idx * 0.5 }}
              className="font-script text-5xl md:text-7xl text-primary drop-shadow-[0_0_15px_rgba(255,182,193,0.3)]"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="z-10"
        >
          <h2 className="font-script text-6xl md:text-8xl text-primary animate-pulse drop-shadow-[0_0_25px_rgba(255,182,193,0.5)] mb-8">
            Happy Birthday, {config.boyfriendName}
          </h2>
          <p className="font-serif italic text-xl text-muted-foreground mb-4">
            With all my love, forever and always —
          </p>
          <div className="inline-block relative">
            <span className="font-script text-4xl text-primary relative z-10">
              {config.yourName}
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-0 left-0 h-[2px] bg-primary/40 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* SECTION 8: FINAL BUTTONS */}
      <section className="relative z-10 py-32 px-4 flex flex-col items-center justify-center gap-6">
        <button
          onClick={() => setLocation("/")}
          className="px-8 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all shadow-[0_0_15px_rgba(255,182,193,0.4)] hover:shadow-[0_0_20px_rgba(255,182,193,0.6)]"
        >
          Replay Our Story
        </button>
        
        <button
          onClick={() => setLocation("/reasons")}
          className="px-8 py-3 rounded-full glass-card text-foreground font-serif transition-colors hover:bg-white/40"
        >
          Reasons I Love You
        </button>

        <button
          onClick={() => setLocation("/games")}
          className="px-8 py-3 rounded-full glass-card text-foreground font-serif transition-colors hover:bg-white/40 mt-2"
        >
          Hidden Surprises 🎮
        </button>

        <button
          onClick={() => setLocation("/")}
          className="font-serif text-sm text-foreground/50 hover:text-primary transition-colors mt-4"
        >
          ↩ Back to Home
        </button>

        <p className="font-script text-2xl text-foreground/60 mt-16">
          Made with love by {config.yourName}
        </p>
      </section>

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
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}
