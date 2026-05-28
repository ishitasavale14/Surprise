import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, X, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { config, memories, transitionQuotes } from "@/config";

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

export default function OurStory() {
  const [, setLocation] = useLocation();
  const [selectedMemory, setSelectedMemory] = useState<typeof memories[0] | null>(null);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient text-foreground overflow-x-hidden selection:bg-primary selection:text-white relative">
      <FloatingParticles />
      <BokehBackground />
      
      {/* Back Navigation */}
      <button 
        onClick={() => setLocation("/")}
        className="fixed top-6 left-6 z-40 p-3 rounded-full glass-card hover:scale-105 transition-transform duration-300 group flex items-center justify-center"
        aria-label="Back to Home"
      >
        <ChevronLeft className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
      </button>

      {/* Section Intro */}
      <section className="relative pt-32 pb-20 px-4 z-10 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <motion.h1 
            animate={{ textShadow: ["0px 0px 0px rgba(255,182,193,0)", "0px 0px 20px rgba(255,182,193,0.5)", "0px 0px 0px rgba(255,182,193,0)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="font-script text-6xl md:text-8xl text-primary drop-shadow-md mb-6"
          >
            Our Story ❤️
          </motion.h1>
          <p className="font-serif text-xl md:text-3xl text-foreground/80 italic max-w-2xl mx-auto">
            Every moment with you became my favorite memory.
          </p>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="relative py-20 px-4 z-10 max-w-6xl mx-auto">
        <div className="flex flex-col space-y-32">
          {memories.map((memory, index) => {
            const isEven = index % 2 === 0;
            // Alternate quotes between pairs of cards
            const showQuote = index > 0 && index % 2 === 0;
            const quoteIndex = (index / 2 - 1) % transitionQuotes.length;

            return (
              <div key={memory.id} className="relative">
                {showQuote && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.5 }}
                    className="py-16 text-center"
                  >
                    <p className="font-script text-4xl md:text-5xl text-primary/80 max-w-3xl mx-auto leading-relaxed">
                      "{transitionQuotes[quoteIndex]}"
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ duration: 1.2, type: "spring", stiffness: 50 }}
                  className={`flex justify-center md:justify-${isEven ? "end" : "start"} items-center w-full`}
                >
                  <div 
                    onClick={() => setSelectedMemory(memory)}
                    className="glass-card p-6 pb-8 md:p-8 md:pb-10 rounded-[1.5rem] w-full max-w-md cursor-pointer group hover:shadow-xl transition-all duration-500 relative"
                    style={{ transform: `rotate(${memory.rotate}deg)` }}
                  >
                    {/* Tape Accents */}
                    <div className="absolute top-[-10px] left-4 w-2 h-8 bg-primary/30 backdrop-blur-md -rotate-12 rounded-sm shadow-sm" />
                    <div className="absolute top-[-10px] right-4 w-2 h-8 bg-primary/30 backdrop-blur-md rotate-12 rounded-sm shadow-sm" />

                    {/* Photo Area */}
                    <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 to-accent/20 rounded-xl overflow-hidden relative mb-6">
                      <motion.div 
                        className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 p-6 text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <span className="font-serif italic text-lg mb-2">[ Add Photo ]</span>
                        <span className="text-4xl opacity-50">{memory.emoji}</span>
                      </motion.div>
                      <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none" />
                    </div>

                    {/* Text Area */}
                    <div className="text-center space-y-3">
                      <p className="font-script text-2xl text-primary">{memory.date}</p>
                      <h3 className="font-serif font-bold text-2xl text-foreground/90">{memory.title}</h3>
                      <p className="font-sans text-sm text-foreground/70 leading-relaxed">
                        {memory.description}
                      </p>
                    </div>
                    
                    {/* Floating Decoration */}
                    <motion.div 
                      className="absolute -bottom-4 -right-4 text-3xl opacity-80"
                      animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {memory.emoji}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Outro CTA */}
      <section className="relative py-32 px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <button onClick={() => setLocation("/letter")} className="px-10 py-5 rounded-full bg-primary/90 hover:bg-primary text-white font-serif text-xl tracking-wide transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,182,193,0.8)] backdrop-blur-md overflow-hidden relative group">
            <span className="relative z-10 flex items-center gap-2">
              Open Birthday Letter <Heart className="w-5 h-5 fill-current" />
            </span>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
          
          <button 
            onClick={() => setLocation("/")}
            className="font-serif italic text-foreground/60 hover:text-primary transition-colors text-sm mt-4"
          >
            ← Back to Home
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center relative z-10">
        <p className="font-script text-3xl text-foreground/70">
          Made with love by {config.yourName}
        </p>
      </footer>

      {/* Memory Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-card p-8 md:p-12 rounded-[2rem] max-w-lg w-full relative overflow-hidden text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedMemory(null)}
                className="absolute top-6 right-6 text-foreground/50 hover:text-primary transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="absolute -top-10 -left-10 text-primary/10 w-40 h-40">
                <Heart className="w-full h-full fill-current" />
              </div>

              <span className="text-5xl block mb-6 drop-shadow-sm">{selectedMemory.emoji}</span>
              <p className="font-script text-3xl text-primary mb-2">{selectedMemory.date}</p>
              <h3 className="font-serif text-3xl font-bold mb-6 text-foreground/90">{selectedMemory.title}</h3>
              
              <div className="space-y-6 text-foreground/80 font-sans">
                <p className="leading-relaxed">
                  {selectedMemory.description}
                </p>
                
                <div className="h-[1px] w-24 bg-primary/30 mx-auto" />
                
                <p className="font-serif italic text-lg text-primary/90">
                  "{selectedMemory.hiddenMessage}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}