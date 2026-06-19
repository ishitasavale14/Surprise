import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";
import { config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";
import ClickBurst from "@/components/ClickBurst";

const NAV_PAGES = [
  { label: "Our Story",       path: "/our-story",  emoji: "📖" },
  { label: "Love Letter",     path: "/letter",     emoji: "💌" },
  { label: "Reasons I Love You", path: "/reasons", emoji: "💕" },
  { label: "Your Surprise",   path: "/surprise",   emoji: "🎁" },
  { label: "Our Future",      path: "/future",     emoji: "🌟" },
  { label: "Little Games",    path: "/games",      emoji: "🎮" },
  { label: "Our Gallery",     path: "/gallery",    emoji: "📸" },
  { label: "What Makes You Special", path: "/special", emoji: "✨" },
  { label: "365 Days of Us",  path: "/days",       emoji: "☁️" },
  { label: "The Ending",      path: "/ending",     emoji: "🌙" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const { isPlaying, togglePlay } = useMusicContext();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient text-foreground overflow-x-hidden light-leak">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-2xl"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="mb-8"
            >
              <Heart
                className="w-20 h-20 text-primary drop-shadow-[0_0_30px_rgba(220,130,160,0.8)]"
                fill="currentColor"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ClickBurst />
      <BokehBackground />
      <FloatingParticles />

      {/* Music toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.2 }}
        onClick={togglePlay}
        className="fixed top-6 right-6 z-40 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform duration-300 glow-primary-sm"
        aria-label="Toggle Music"
      >
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
        >
          <Heart className="w-5 h-5 text-primary" fill={isPlaying ? "currentColor" : "none"} />
        </motion.div>
        {isPlaying && (
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-40" />
        )}
      </motion.button>

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.8, delay: 3, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Tag line */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 1.5, delay: 3.2 }}
            className="font-serif text-sm md:text-base text-primary/70 tracking-[0.25em] uppercase mb-6"
          >
            A little universe made only for you
          </motion.p>

          <h1 className="font-script text-6xl md:text-8xl lg:text-[7rem] text-foreground mb-4 leading-tight text-glow">
            Happy Birthday,
          </h1>
          <motion.h2
            animate={{
              textShadow: [
                "0px 0px 20px rgba(220,130,160,0.4)",
                "0px 0px 50px rgba(220,130,160,0.7)",
                "0px 0px 20px rgba(220,130,160,0.4)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-script text-7xl md:text-9xl lg:text-[8.5rem] bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight mb-10"
          >
            {config.boyfriendName} ❤️
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.8, duration: 1 }}
            className="font-serif text-xl md:text-2xl text-foreground/70 italic tracking-wide max-w-2xl mx-auto"
          >
            "{config.customQuote}"
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-3"
        >
          <span className="font-serif text-xs italic text-muted-foreground tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-14 bg-gradient-to-b from-primary/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* Navigation cards */}
      <section className="relative py-16 px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-4">
            Our Little World
          </h2>
          <p className="font-serif italic text-muted-foreground text-lg">
            Every section is a piece of my heart for you
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {NAV_PAGES.map((page, i) => (
            <motion.button
              key={page.path}
              onClick={() => setLocation(page.path)}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="glass-card rounded-2xl p-5 text-center group hover:glow-primary-sm transition-all duration-300 cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-3xl mb-3"
              >
                {page.emoji}
              </motion.div>
              <p className="font-serif text-sm text-foreground/80 group-hover:text-primary transition-colors leading-snug">
                {page.label}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-script text-3xl text-foreground/60"
        >
          Made with love by {config.yourName} ❤️
        </motion.p>
      </footer>
    </div>
  );
}
