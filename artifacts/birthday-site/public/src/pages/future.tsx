import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, Check, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { futureConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";
import CountdownTimer from "@/components/CountdownTimer";

export default function Future() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [wishMade, setWishMade] = useState(false);
  const [guestbookMsg, setGuestbookMsg] = useState("");
  const [savedMessages, setSavedMessages] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const [timeDiff, setTimeDiff] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const start = new Date(futureConfig.relationshipStartDate).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      let diff = Math.max(0, now - start) / 1000;
      const years   = Math.floor(diff / (365 * 24 * 3600)); diff -= years * 365 * 24 * 3600;
      const months  = Math.floor(diff / (30 * 24 * 3600));  diff -= months * 30 * 24 * 3600;
      const days    = Math.floor(diff / (24 * 3600));        diff -= days * 24 * 3600;
      const hours   = Math.floor(diff / 3600);               diff -= hours * 3600;
      const minutes = Math.floor(diff / 60);                 diff -= minutes * 60;
      const seconds = Math.floor(diff);
      setTimeDiff({ years, months, days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWish = () => {
    setWishMade(true);
    for (let i = 0; i < 24; i++) {
      const star = document.createElement("div");
      star.className = "wish-star";
      star.style.left = `${window.innerWidth / 2 + (Math.random() * 200 - 100)}px`;
      star.style.top  = `${window.innerHeight / 2 + (Math.random() * 200 - 100)}px`;
      star.style.setProperty("--tx", `${Math.random() * 200 - 100}px`);
      star.style.setProperty("--ty", `${-100 - Math.random() * 200}px`);
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 2100);
    }
  };

  const handleSaveMsg = () => {
    if (!guestbookMsg.trim()) return;
    setSavedMessages(prev => [...prev, guestbookMsg.trim()]);
    setGuestbookMsg("");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleCheck = (idx: number) =>
    setCheckedItems(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);

  const timerLabels = [
    { label: "Years",   val: timeDiff.years   },
    { label: "Months",  val: timeDiff.months  },
    { label: "Days",    val: timeDiff.days    },
    { label: "Hours",   val: timeDiff.hours   },
    { label: "Minutes", val: timeDiff.minutes },
    { label: "Seconds", val: timeDiff.seconds },
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative">
      <BokehBackground />
      <FloatingParticles />

      <button onClick={() => setLocation("/reasons")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform">
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
      <button onClick={togglePlay}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform">
        <Heart className="w-5 h-5 text-primary" fill={isPlaying ? "currentColor" : "none"} />
      </button>

      {/* Hero */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.4 }}>
          <p className="font-serif italic text-muted-foreground text-lg mb-4">everything that's yet to come…</p>
          <h1 className="font-script text-6xl md:text-8xl text-primary text-glow mb-6">{futureConfig.heading}</h1>
          <p className="font-serif italic text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto">{futureConfig.subheading1}</p>
          <p className="font-serif italic text-xl md:text-2xl text-muted-foreground mt-2">{futureConfig.subheading2}</p>
        </motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 font-serif italic text-sm text-primary/50 tracking-wider">
          ✦ scroll to explore our future ✦
        </motion.div>
      </section>

      {/* Live love counter */}
      <section className="relative z-10 py-24 px-4 flex flex-col items-center text-center">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-serif italic text-xl text-muted-foreground mb-4">{futureConfig.counterLabel}</motion.p>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }} className="font-script text-3xl text-primary/60 mb-12">…and every second is a gift</motion.p>

        <div className="flex flex-wrap justify-center gap-3 md:gap-5 max-w-4xl mx-auto">
          {timerLabels.map((item, idx) => (
            <motion.div key={item.label}
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
              className="glass-card-strong rounded-2xl p-5 text-center min-w-[90px] md:min-w-[110px]"
            >
              <motion.div animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity }}
                className="font-serif font-semibold text-4xl md:text-5xl text-primary mb-2 text-glow">{item.val}</motion.div>
              <div className="text-xs uppercase tracking-widest font-sans text-muted-foreground">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Birthday Countdown */}
      <CountdownTimer />

      {/* Promises */}
      <section className="relative z-10 max-w-5xl mx-auto py-24 px-4">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-script text-5xl md:text-6xl text-center text-primary text-glow mb-16">
          Promises I'm Making You
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {futureConfig.promises.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="glass-card rounded-3xl p-6 flex items-center gap-4 transition-all hover:glow-primary-sm"
            >
              <div className="bg-primary/10 rounded-full p-4 text-2xl flex-shrink-0">{p.emoji}</div>
              <p className="font-serif text-base text-foreground/80 leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dream / Bucket list */}
      <section className="relative z-10 max-w-3xl mx-auto py-24 px-4">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-script text-5xl text-center text-primary text-glow mb-4">Our Dream List ✨</motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }} className="font-serif italic text-center text-muted-foreground mb-12">
          Tap an item to check it off 🩷
        </motion.p>

        <div className="glass-card-strong rounded-3xl p-8 space-y-5">
          {futureConfig.bucketList.map((item, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
              onClick={() => toggleCheck(idx)}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <motion.div whileTap={{ scale: 0.85 }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${checkedItems.includes(idx) ? "bg-primary border-primary" : "border-primary/40 group-hover:border-primary/70"}`}>
                {checkedItems.includes(idx) && <Check className="w-3.5 h-3.5 text-white" />}
              </motion.div>
              <span className={`font-serif text-lg transition-all duration-300 ${checkedItems.includes(idx) ? "line-through text-muted-foreground" : "text-foreground/80 group-hover:text-primary"}`}>
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Make a wish */}
      <section className="relative z-10 py-32 px-4 flex flex-col items-center text-center">
        <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="font-script text-6xl text-primary text-glow mb-4">Make A Wish ❤️</motion.h2>
        <p className="font-serif italic text-muted-foreground mb-12 text-lg">Close your eyes. Think of something beautiful.</p>

        <div className="relative">
          <motion.button onClick={handleWish} disabled={wishMade} whileHover={!wishMade ? { scale: 1.05 } : {}} whileTap={{ scale: 0.97 }}
            className="btn-shimmer relative bg-primary/20 hover:bg-primary/40 border-2 border-primary/50 text-primary font-script text-3xl px-14 py-7 rounded-full transition-all disabled:opacity-60 disabled:cursor-not-allowed glow-primary z-10 flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            {wishMade ? "Wish Made ✨" : "Make Wish"}
            <Sparkles className="w-6 h-6" />
          </motion.button>
          {!wishMade && <div className="absolute inset-0 border border-primary/30 rounded-full animate-ping opacity-30 pointer-events-none" />}
        </div>

        <AnimatePresence>
          {wishMade && (
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="glass-card-strong rounded-3xl max-w-lg mt-12 p-10 text-center">
              <Heart className="w-10 h-10 text-primary/50 mx-auto mb-4 animate-heartbeat" fill="currentColor" />
              <p className="font-serif italic text-xl text-foreground/80 leading-relaxed">{futureConfig.makeAWishMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Guestbook */}
      <section className="relative z-10 py-24 px-4 max-w-2xl mx-auto text-center">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-script text-5xl text-primary text-glow mb-4">Write Something Back 💌</motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }} className="font-serif italic text-muted-foreground mb-8">
          Leave your feelings here — just for us.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card-strong rounded-3xl p-8 relative">
          <textarea value={guestbookMsg} onChange={e => setGuestbookMsg(e.target.value)}
            placeholder={futureConfig.guestbookPlaceholder}
            className="w-full bg-transparent border-none outline-none resize-none font-serif text-lg text-foreground placeholder:text-muted-foreground/50 min-h-[140px] leading-relaxed"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="font-serif text-xs text-muted-foreground/40">{guestbookMsg.length} characters</span>
            <motion.button onClick={handleSaveMsg} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="btn-shimmer px-8 py-3 rounded-full bg-primary/80 hover:bg-primary text-white font-serif transition-colors glow-primary-sm">
              Save Message 💕
            </motion.button>
          </div>

          <AnimatePresence>
            {showToast && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-5 py-2 rounded-full text-sm font-serif text-primary border border-primary/20 whitespace-nowrap">
                Saved with love 🌸
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {savedMessages.length > 0 && (
          <div className="mt-8 space-y-4">
            {savedMessages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6 text-left">
                <p className="font-serif italic text-foreground/80 whitespace-pre-wrap leading-relaxed">"{msg}"</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Emotional finale */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div key={i} className="absolute text-primary/20"
            style={{ left: `${Math.random() * 100}%` }}
            animate={{ y: ["-10vh", "110vh"], opacity: [0, 0.5, 0] }}
            transition={{ duration: Math.random() * 6 + 6, delay: Math.random() * 4, repeat: Infinity, ease: "linear" }}>
            <Heart className="w-4 h-4 fill-current" />
          </motion.div>
        ))}

        <div className="space-y-10 z-10 mb-20">
          {futureConfig.finalLines.map((line, idx) => (
            <motion.p key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, delay: idx * 0.5 }}
              className="font-script text-5xl md:text-7xl text-primary text-glow">{line}</motion.p>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.5 }} className="z-10">
          <h2 className="font-script text-6xl md:text-8xl text-primary text-glow animate-heartbeat mb-6">
            Happy Birthday, {config.boyfriendName}
          </h2>
          <p className="font-serif italic text-xl text-muted-foreground mb-4">With all my love, forever and always —</p>
          <div className="inline-block relative">
            <span className="font-script text-4xl text-primary">{config.yourName}</span>
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="absolute bottom-0 left-0 h-px bg-primary/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* CTAs */}
      <section className="relative z-10 py-24 px-4 flex flex-col items-center gap-4">
        <motion.button onClick={() => setLocation("/")} whileHover={{ scale: 1.04 }}
          className="btn-shimmer px-10 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg glow-primary transition-all flex items-center gap-3">
          <Heart className="w-5 h-5" fill="currentColor" /> Replay Our Story
        </motion.button>
        <button onClick={() => setLocation("/games")}
          className="px-8 py-3 rounded-full glass-card text-foreground/70 font-serif hover:text-primary transition-colors">
          Hidden Surprises 🎮
        </button>
        <p className="font-script text-2xl text-foreground/50 mt-10">Made with love by {config.yourName}</p>
      </section>
    </div>
  );
}
