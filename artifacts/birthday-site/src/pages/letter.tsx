import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ChevronLeft, Gift } from "lucide-react";
import { useLocation } from "wouter";
import { letterConfig, config } from "@/config";

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-primary/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: `${p.size}rem` }}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.random() * 30 - 15, Math.random() * 30 - 15],
            opacity: [0, 0.6, 0],
            rotate: [0, Math.random() * 180],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        >
          <Heart fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}

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
        className="absolute bottom-1/3 right-1/4 w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[120px] mix-blend-multiply" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], x: [0, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-2/3 left-1/2 w-[30vw] h-[30vw] rounded-full bg-[#E6D7FF]/30 blur-[90px] mix-blend-multiply" 
      />
    </div>
  );
}

function FloatingPhrases() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {letterConfig.floatingPhrases.map((phrase, i) => (
        <motion.div
          key={i}
          className="absolute font-script text-2xl md:text-3xl text-primary/20 whitespace-nowrap"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `110%`,
          }}
          animate={{
            y: ['0vh', '-120vh'],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 20,
            ease: "linear",
          }}
        >
          {phrase}
        </motion.div>
      ))}
    </div>
  );
}

export default function Letter() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<"envelope" | "letter">("envelope");
  const [flapOpen, setFlapOpen] = useState(false);
  
  const [toast, setToast] = useState<{ id: number; message: string; x: number; y: number } | null>(null);

  const handleOpenLetter = () => {
    setFlapOpen(true);
    setTimeout(() => setPhase("letter"), 1200);
  };

  const handleHiddenMessageClick = (e: React.MouseEvent, msgId: number) => {
    const hiddenMsg = letterConfig.hiddenMessages.find(m => m.id === msgId);
    if (!hiddenMsg) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setToast({
      id: Date.now(),
      message: hiddenMsg.message,
      x: rect.left + rect.width / 2,
      y: rect.top - 20,
    });

    setTimeout(() => setToast(null), 3500);
  };

  // Helper to parse paragraph text and wrap trigger words
  const renderParagraph = (text: string): React.ReactNode[] => {
    let result: React.ReactNode[] = [text];

    letterConfig.hiddenMessages.forEach(msg => {
      const newResult: React.ReactNode[] = [];
      result.forEach((part) => {
        if (typeof part !== "string") {
          newResult.push(part);
          return;
        }
        const segments = part.split(msg.trigger);
        segments.forEach((seg, j) => {
          if (seg) newResult.push(seg);
          if (j < segments.length - 1) {
            newResult.push(
              <span
                key={`trigger-${msg.id}-${j}-${seg.length}`}
                onClick={(e) => handleHiddenMessageClick(e, msg.id)}
                className="border-b border-primary/50 text-foreground/90 cursor-pointer hover:text-primary hover:border-primary transition-colors"
              >
                {msg.trigger}
              </span>
            );
          }
        });
      });
      result = newResult;
    });

    return result;
  };

  const replacedGreeting = letterConfig.greeting.replace("[BOYFRIEND_NAME]", config.boyfriendName).replace("[YOUR_NAME]", config.yourName);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient text-foreground overflow-x-hidden selection:bg-primary selection:text-white relative">
      <FloatingParticles />
      <BokehBackground />
      {phase === "letter" && <FloatingPhrases />}

      <button 
        onClick={() => setLocation("/our-story")}
        className="fixed top-6 left-6 z-50 p-3 rounded-full glass-card hover:scale-105 transition-transform duration-300 group flex items-center justify-center shadow-lg"
        aria-label="Back to Our Story"
      >
        <ChevronLeft className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
      </button>

      <AnimatePresence mode="wait">
        {phase === "envelope" && (
          <motion.div 
            key="envelope-phase"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="font-script text-4xl md:text-5xl text-primary drop-shadow-sm mb-12 text-center"
            >
              A letter written only for you ❤️
            </motion.h2>

            <div className="relative w-full max-w-[320px] aspect-[4/3] perspective-1000 mx-auto">
              <motion.div 
                className="w-full h-full relative"
                animate={flapOpen ? { y: 20 } : { y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Back of envelope */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(255,182,193,0.4)] border border-white/50" />
                
                {/* Envelope Flap */}
                <motion.div 
                  className="absolute top-0 left-0 w-full h-[60%] origin-top z-20"
                  animate={{ rotateX: flapOpen ? -180 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Flap Front */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/10 backdrop-blur-md border border-white/40"
                    style={{ 
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      backfaceVisibility: "hidden"
                    }}
                  />
                  {/* Flap Back */}
                  <div 
                    className="absolute inset-0 bg-white/60 backdrop-blur-md border border-white/40 rotate-x-180"
                    style={{ 
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      backfaceVisibility: "hidden",
                      transform: "rotateX(180deg)"
                    }}
                  />

                  {/* Wax Seal */}
                  {!flapOpen && (
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary shadow-md flex items-center justify-center border-2 border-primary/50 text-white font-script text-xl"
                    >
                      L
                    </motion.div>
                  )}
                </motion.div>

                {/* Envelope Front Bottom */}
                <div 
                  className="absolute bottom-0 left-0 w-full h-[70%] bg-white/50 backdrop-blur-md z-10 border-t border-white/60 rounded-b-xl shadow-inner"
                  style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 50% 30%, 0 0)" }}
                />
              </motion.div>
            </div>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: flapOpen ? 0 : 1, y: flapOpen ? 20 : 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              onClick={handleOpenLetter}
              className="mt-16 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-serif text-lg tracking-wide transition-all shadow-[0_0_20px_rgba(255,182,193,0.6)] hover:shadow-[0_0_30px_rgba(255,182,193,0.8)] relative overflow-hidden group"
            >
              <span className="relative z-10">Open Letter</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "letter" && (
          <motion.div
            key="letter-phase"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-20 pt-32 pb-40 px-4 min-h-screen flex flex-col items-center"
          >
            <div className="w-full max-w-[680px] bg-[rgba(255,248,240,0.7)] backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-16 relative">
              
              {/* Tape Accents */}
              <div className="absolute -top-3 -left-3 w-16 h-4 bg-primary/20 backdrop-blur-sm -rotate-45 shadow-sm rounded-sm" />
              <div className="absolute -top-3 -right-3 w-16 h-4 bg-primary/20 backdrop-blur-sm rotate-45 shadow-sm rounded-sm" />
              
              {/* Top Deco */}
              <div className="text-center mb-10 text-primary opacity-60">
                <Sparkles className="w-6 h-6 mx-auto inline-block" />
              </div>

              {/* Lined paper faint texture */}
              <div className="absolute inset-0 pointer-events-none rounded-3xl opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(255,182,193,0.3) 32px)', backgroundPositionY: '8rem' }} />

              <div className="relative z-10 space-y-8 text-foreground/80">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="font-script text-3xl md:text-4xl text-primary mb-8"
                >
                  {replacedGreeting}
                </motion.p>

                {letterConfig.paragraphs.map((paragraph, idx) => (
                  <motion.p 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1 }}
                    className="font-serif text-lg md:text-xl leading-loose"
                  >
                    {renderParagraph(paragraph.replace("[BOYFRIEND_NAME]", config.boyfriendName))}
                  </motion.p>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="pt-12 text-center space-y-8"
                >
                  <motion.p 
                    animate={{ textShadow: ["0px 0px 0px rgba(255,182,193,0)", "0px 0px 15px rgba(255,182,193,0.6)", "0px 0px 0px rgba(255,182,193,0)"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="font-script text-4xl md:text-5xl text-primary"
                  >
                    {letterConfig.closingLine}
                  </motion.p>
                  
                  <p className="font-script text-3xl text-foreground text-right pr-8">
                    — {letterConfig.signature}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Ending CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 1.5 }}
              className="mt-32 flex flex-col items-center gap-6"
            >
              <button 
                data-testid="unlock-surprise-button"
                onClick={() => setLocation("/surprise")}
                className="px-10 py-5 rounded-full bg-primary/90 hover:bg-primary text-white font-serif text-xl tracking-wide transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,182,193,0.8)] backdrop-blur-md overflow-hidden relative group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Unlock Your Birthday Surprise <Gift className="w-5 h-5 fill-current/20" />
                </span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
              
              <button 
                onClick={() => setLocation("/our-story")}
                className="font-serif italic text-foreground/60 hover:text-primary transition-colors text-sm mt-4"
              >
                ← Back to Our Story
              </button>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Message Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -20 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="fixed z-50 pointer-events-none"
            style={{ left: toast.x, top: toast.y, x: '-50%' }}
          >
            <div className="bg-white/90 backdrop-blur-md text-foreground font-serif text-sm px-4 py-3 rounded-2xl shadow-xl border border-primary/20 text-center min-w-[200px] max-w-[280px]">
              {toast.message}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0], opacity: [1, 0, 0] }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center justify-center text-primary pointer-events-none"
              >
                <Heart className="w-12 h-12 fill-current" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}