import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { letterConfig, config } from "@/config";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";
import { useMusicContext } from "@/context/MusicContext";

function FloatingPhrases() {
  const positions = [
    { left: "8%", delay: 0 }, { left: "22%", delay: 5 }, { left: "38%", delay: 12 },
    { left: "55%", delay: 3 }, { left: "72%", delay: 18 }, { left: "88%", delay: 8 },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {letterConfig.floatingPhrases.map((phrase, i) => (
        <motion.div
          key={i}
          className="absolute font-script text-2xl md:text-3xl text-primary/15 whitespace-nowrap"
          style={{ left: positions[i % positions.length].left, top: "110%" }}
          animate={{ y: ["0vh", "-130vh"], opacity: [0, 0.8, 0.8, 0] }}
          transition={{
            duration: 22 + i * 4,
            repeat: Infinity,
            delay: positions[i % positions.length].delay,
            ease: "linear",
          }}
        >
          {phrase}
        </motion.div>
      ))}
    </div>
  );
}

function EnvelopeSVG({ isOpen }: { isOpen: boolean }) {
  return (
    <svg viewBox="0 0 320 220" className="w-full" style={{ filter: "drop-shadow(0 20px 60px rgba(220,130,160,0.3))" }}>
      <defs>
        <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,240,245,0.95)" />
          <stop offset="100%" stopColor="rgba(255,220,230,0.9)" />
        </linearGradient>
        <linearGradient id="flapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,210,225,0.98)" />
          <stop offset="100%" stopColor="rgba(245,190,210,0.95)" />
        </linearGradient>
      </defs>

      {/* Envelope body */}
      <rect x="10" y="60" width="300" height="150" rx="8" fill="url(#envGrad)"
        stroke="rgba(220,130,160,0.3)" strokeWidth="1" />

      {/* Inner V lines */}
      <line x1="10" y1="210" x2="160" y2="130" stroke="rgba(220,130,160,0.2)" strokeWidth="1" />
      <line x1="310" y1="210" x2="160" y2="130" stroke="rgba(220,130,160,0.2)" strokeWidth="1" />

      {/* Wax seal */}
      <motion.g
        animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <circle cx="160" cy="135" r="18" fill="rgba(220,100,140,0.85)" />
        <text x="160" y="141" textAnchor="middle" fill="white" fontSize="16" fontFamily="serif">♥</text>
      </motion.g>

      {/* Flap */}
      <motion.path
        d="M10,60 L160,150 L310,60 Z"
        fill="url(#flapGrad)"
        stroke="rgba(220,130,160,0.3)"
        strokeWidth="1"
        style={{ transformOrigin: "160px 60px" }}
        animate={{ rotateX: isOpen ? -180 : 0, opacity: isOpen ? 0.4 : 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      />
    </svg>
  );
}

export default function Letter() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [phase, setPhase] = useState<"envelope" | "opening" | "letter">("envelope");
  const [flapOpen, setFlapOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; x: number; y: number } | null>(null);

  const handleOpen = () => {
    setFlapOpen(true);
    setPhase("opening");
    setTimeout(() => setPhase("letter"), 1400);
  };

  const handleWordClick = (e: React.MouseEvent, msgId: number) => {
    const msg = letterConfig.hiddenMessages.find(m => m.id === msgId);
    if (!msg) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setToast({ message: msg.message, x: rect.left + rect.width / 2, y: rect.top - 16 });
    setTimeout(() => setToast(null), 3000);
  };

  const highlightParagraph = (text: string, idx: number) => {
    if (idx === 2) {
      return text
        .replace(
          "I love the way you laugh",
          `<span class="cursor-pointer text-primary font-semibold underline decoration-dotted decoration-primary/50" data-msg="1">I love the way you laugh</span>`
        )
        .replace(
          "you choose me",
          `<span class="cursor-pointer text-primary font-semibold underline decoration-dotted decoration-primary/50" data-msg="2">you choose me</span>`
        );
    }
    return text;
  };

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient text-foreground overflow-x-hidden relative">
      <BokehBackground />
      <FloatingParticles heartsOnly />
      <FloatingPhrases />

      {/* Nav */}
      <button
        onClick={() => setLocation("/our-story")}
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

      {/* Envelope phase */}
      <AnimatePresence>
        {phase !== "letter" && (
          <motion.section
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-20 flex flex-col items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="text-center mb-12"
            >
              <p className="font-serif italic text-muted-foreground text-lg mb-2">
                Something I've been wanting to tell you…
              </p>
              <h1 className="font-script text-6xl md:text-8xl text-primary text-glow">
                A Letter for You
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full max-w-sm relative"
            >
              {/* Letter peeking out */}
              <motion.div
                animate={{ y: flapOpen ? -60 : 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-[85%] h-16 glass-card-strong rounded-t-xl flex items-center justify-center z-0"
              >
                <p className="font-script text-2xl text-primary/60">With all my love…</p>
              </motion.div>

              <div className="relative z-10">
                <EnvelopeSVG isOpen={flapOpen} />
              </div>

              {!flapOpen && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  onClick={handleOpen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-shimmer mt-8 w-full py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all glow-primary flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Open Your Letter
                  <Sparkles className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Letter phase */}
      <AnimatePresence>
        {phase === "letter" && (
          <motion.div
            
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-start px-4 py-24"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-16"
            >
              <p className="font-serif italic text-muted-foreground mb-2">You opened it ❤️</p>
              <h1 className="font-script text-7xl md:text-8xl text-primary text-glow">
                Dear {config.boyfriendName},
              </h1>
            </motion.div>

            {/* Letter card */}
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="glass-card-strong rounded-[2rem] max-w-2xl w-full p-10 md:p-16 relative"
            >
              {/* Decorative corners */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-handwriting text-2xl text-primary/80 mb-8"
              >
                {letterConfig.greeting}
              </motion.p>

              <div className="space-y-6">
                {letterConfig.paragraphs.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.25, duration: 0.8 }}
                    className="font-serif text-lg md:text-xl text-foreground/85 leading-[1.9] italic"
                    dangerouslySetInnerHTML={{ __html: highlightParagraph(para, i) }}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      const msgId = target.dataset.msg;
                      if (msgId) handleWordClick(e, parseInt(msgId));
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-10"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                className="text-center"
              >
                <p className="font-script text-3xl text-primary mb-2">
                  {letterConfig.closingLine}
                </p>
                <p className="font-handwriting text-2xl text-primary/70 mt-4">
                  — {letterConfig.signature}
                </p>
              </motion.div>
            </motion.div>

            {/* Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="font-serif italic text-xs text-muted-foreground/50 mt-6 text-center"
            >
              ✦ tap the highlighted words for hidden messages ✦
            </motion.p>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2 }}
              onClick={() => setLocation("/reasons")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-shimmer mt-12 px-10 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all glow-primary flex items-center gap-3"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              Continue Reading Our Story
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden message toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed z-[200] glass-card-strong rounded-2xl px-6 py-4 max-w-xs text-center shadow-xl pointer-events-none"
            style={{ left: Math.min(toast.x - 100, window.innerWidth - 220), top: toast.y - 80 }}
          >
            <p className="font-serif italic text-sm text-foreground/90">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
