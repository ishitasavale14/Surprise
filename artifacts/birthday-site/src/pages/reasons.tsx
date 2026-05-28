import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, X } from "lucide-react";
import { useLocation } from "wouter";
import { reasonsConfig, config } from "@/config";

function FloatingHearts() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 100,
      size: Math.random() * 1.2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 15,
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
            y: [0, -150, -300],
            x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25],
            opacity: [0, 0.5, 0],
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

export default function Reasons() {
  const [, setLocation] = useLocation();
  const [selectedReason, setSelectedReason] = useState<typeof reasonsConfig.reasons[0] | null>(null);
  const [visibleNotes, setVisibleNotes] = useState<number[]>([]);
  const activeSparklesRef = useRef(0);

  // Sparkle trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeSparklesRef.current > 20) return;
      
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle-dot";
      sparkle.style.left = `${e.clientX - 3}px`;
      sparkle.style.top = `${e.clientY - 3}px`;
      
      document.body.appendChild(sparkle);
      activeSparklesRef.current += 1;
      
      setTimeout(() => {
        if (document.body.contains(sparkle)) {
          document.body.removeChild(sparkle);
        }
        activeSparklesRef.current -= 1;
      }, 600);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Hidden notes reveal effect
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setVisibleNotes(prev => [...prev, 0]), 3000),
      setTimeout(() => setVisibleNotes(prev => [...prev, 1]), 6000),
      setTimeout(() => setVisibleNotes(prev => [...prev, 2]), 10000),
      setTimeout(() => setVisibleNotes(prev => [...prev, 3]), 14000),
    ];
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const getCardColorStyles = (color: string) => {
    switch (color) {
      case "lavender":
        return { border: "border-[#E6D7FF]/60", dot: "bg-[#C4A8FF]" };
      case "peach":
        return { border: "border-[#FFDAB9]/60", dot: "bg-[#FFB347]" };
      case "pink":
      default:
        return { border: "border-primary/40", dot: "bg-primary" };
    }
  };

  const hiddenNotePositions = [
    "top-[-40px] left-[-20px] md:top-[-80px] md:left-[-60px]",
    "top-[20%] right-[-20px] md:top-[10%] md:right-[-60px]",
    "bottom-[20%] left-[-20px] md:bottom-[15%] md:left-[-80px]",
    "bottom-[-40px] right-[-20px] md:bottom-[-60px] md:right-[-60px]",
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative selection:bg-primary selection:text-white">
      <FloatingHearts />
      <BokehBackground />

      {/* Intro Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="font-script text-6xl md:text-8xl text-primary drop-shadow-[0_0_20px_rgba(255,182,193,0.4)] max-w-4xl"
        >
          {reasonsConfig.heading}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="font-serif italic text-xl md:text-2xl text-muted-foreground mt-6"
        >
          {reasonsConfig.subheading}
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 2, 
            duration: 1,
            y: { duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
          }}
          className="font-serif italic text-sm text-primary/60 mt-24 tracking-wider"
        >
          ✦ tap a card to read more ✦
        </motion.p>
      </section>

      {/* Love Notes Grid Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="relative">
          {/* Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto">
            {reasonsConfig.reasons.map((reason, index) => {
              const colors = getCardColorStyles(reason.color);
              return (
                <motion.div
                  key={reason.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.04, 
                    rotate: 0, 
                    filter: "drop-shadow(0 0 12px rgba(255,182,193,0.5))",
                    zIndex: 20
                  }}
                  onClick={() => setSelectedReason(reason)}
                  style={{ rotate: `${reason.rotate}deg` }}
                  className={`glass-card p-6 md:p-8 rounded-3xl cursor-pointer flex flex-col relative border ${colors.border}`}
                >
                  <div className="flex items-center gap-2 mb-4 opacity-70">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                  </div>
                  
                  <span className="absolute top-6 right-6 font-serif text-sm text-primary/40">
                    0{reason.id}
                  </span>
                  
                  <h3 className="font-script text-2xl md:text-3xl text-foreground flex-1 pr-6 leading-relaxed">
                    {reason.short}
                  </h3>
                  
                  <div className="mt-8 text-right">
                    <span className="font-serif text-xs text-muted-foreground/60">
                      tap to read ✦
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Hidden Notes Layer */}
          {reasonsConfig.hiddenNotes.map((note, index) => (
            <AnimatePresence key={`hidden-${index}`}>
              {visibleNotes.includes(index) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 10 - 5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className={`absolute ${hiddenNotePositions[index]} glass max-w-[180px] p-4 rounded-2xl z-0 pointer-events-none drop-shadow-sm`}
                >
                  <p className="font-script text-lg text-primary/80 leading-snug">
                    {note}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </section>

      {/* Mid-Page Cinematic Quote */}
      <section className="relative z-10 py-32 px-4 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2 }}
          className="flex items-center gap-4 md:gap-8 max-w-5xl w-full"
        >
          <div className="h-px w-16 md:w-24 bg-primary/30 hidden md:block" />
          <motion.div 
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex-1 text-center"
          >
            <h2 className="font-script text-4xl md:text-6xl text-foreground/90 leading-tight drop-shadow-[0_0_15px_rgba(255,182,193,0.3)]">
              {reasonsConfig.midQuote}
            </h2>
          </motion.div>
          <div className="h-px w-16 md:w-24 bg-primary/30 hidden md:block" />
        </motion.div>
      </section>

      {/* Ending Section */}
      <section className="relative z-10 py-32 px-4 flex flex-col items-center justify-center text-center space-y-12 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-serif italic text-2xl text-muted-foreground">
            {reasonsConfig.endingLine1}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <h2 className="font-script text-5xl md:text-6xl text-primary animate-pulse drop-shadow-[0_0_20px_rgba(255,182,193,0.5)]">
            {reasonsConfig.endingLine2}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="pt-12 flex flex-col items-center gap-6"
        >
          <button
            onClick={() => setLocation("/surprise")}
            className="px-8 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all shadow-[0_0_15px_rgba(255,182,193,0.4)] hover:shadow-[0_0_20px_rgba(255,182,193,0.6)]"
          >
            {reasonsConfig.ctaLabel}
          </button>
          
          <button
            onClick={() => setLocation("/surprise")}
            className="font-serif text-sm text-foreground/50 hover:text-primary transition-colors"
          >
            ← Back to Surprise
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 2 }}
          className="pt-24 pb-8"
        >
          <p className="font-script text-2xl text-foreground/60">
            Made with love by {config.yourName}
          </p>
        </motion.div>
      </section>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {selectedReason && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReason(null)}
              className="absolute inset-0 bg-white/40 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg glass-card rounded-3xl p-8 sm:p-10 shadow-2xl z-10 overflow-hidden"
            >
              {/* Sparkle burst effect on open */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: 0, 
                    scale: Math.random() * 1 + 0.5,
                    x: Math.cos((i * Math.PI) / 4) * (80 + Math.random() * 40),
                    y: Math.sin((i * Math.PI) / 4) * (80 + Math.random() * 40)
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 text-primary/60 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                >
                  <Sparkles className="w-5 h-5 fill-current" />
                </motion.div>
              ))}

              <button
                onClick={() => setSelectedReason(null)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full glass text-foreground/60 hover:text-foreground transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute top-4 right-8 font-serif text-5xl text-primary/10 select-none pointer-events-none">
                0{selectedReason.id}
              </div>

              <div className="relative z-10 pt-4 flex flex-col items-center text-center">
                <h2 className="font-script text-4xl sm:text-5xl text-primary leading-tight mb-6">
                  {selectedReason.short}
                </h2>
                
                <div className="w-16 h-px bg-primary/40 mx-auto my-4" />
                
                <p className="font-serif text-lg sm:text-xl leading-relaxed text-foreground/80 mt-4">
                  {selectedReason.expanded}
                </p>

                <div className="flex gap-3 mt-10 justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.2,
                        ease: "easeInOut" 
                      }}
                      className="text-primary/60"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes sparkle-fade {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(2); }
        }
        .sparkle-dot {
          animation: sparkle-fade 0.6s ease-out forwards;
          position: fixed;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          pointer-events: none;
          background: rgba(255,182,193,0.8);
          z-index: 9999;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
