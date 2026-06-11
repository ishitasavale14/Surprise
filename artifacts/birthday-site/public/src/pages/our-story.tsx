import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { config, memories, transitionQuotes } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

export default function OurStory() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [selectedMemory, setSelectedMemory] = useState<typeof memories[0] | null>(null);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient text-foreground overflow-x-hidden relative">
      <FloatingParticles />
      <BokehBackground />

      <button onClick={() => setLocation("/")}
        className="fixed top-6 left-6 z-40 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform">
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
      <button onClick={togglePlay}
        className="fixed top-6 right-6 z-40 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform">
        <Heart className="w-5 h-5 text-primary" fill={isPlaying ? "currentColor" : "none"} />
      </button>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 z-10 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5 }}>
          <p className="font-serif italic text-muted-foreground text-lg mb-4">a love story written in moments…</p>
          <motion.h1
            animate={{ textShadow: ["0px 0px 0px rgba(220,130,160,0)", "0px 0px 40px rgba(220,130,160,0.6)", "0px 0px 0px rgba(220,130,160,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-script text-7xl md:text-9xl text-primary mb-6">
            Our Story ❤️
          </motion.h1>
          <p className="font-serif text-xl md:text-2xl text-foreground/70 italic max-w-2xl mx-auto">
            Every moment with you became my favourite memory.
          </p>
        </motion.div>

        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 font-serif italic text-xs text-primary/40 tracking-widest uppercase">
          ✦ scroll through our memories ✦
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="relative py-20 px-4 z-10 max-w-5xl mx-auto">
        <div className="flex flex-col space-y-24">
          {memories.map((memory, index) => {
            const isEven = index % 2 === 0;
            const showQuote = index > 0 && index % 2 === 0;
            const quoteIndex = (Math.floor(index / 2) - 1 + transitionQuotes.length) % transitionQuotes.length;

            return (
              <div key={memory.id} className="relative">
                {showQuote && (
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.5 }} className="py-16 text-center">
                    <p className="font-script text-4xl md:text-5xl text-primary/70 max-w-3xl mx-auto leading-relaxed text-glow">
                      "{transitionQuotes[quoteIndex]}"
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: isEven ? 60 : -60, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 1, type: "spring", stiffness: 60 }}
                  className={`flex ${isEven ? "justify-end" : "justify-start"} w-full`}
                >
                  <motion.div
                    onClick={() => setSelectedMemory(memory)}
                    whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
                    className="glass-card-strong p-6 pb-8 md:p-8 md:pb-10 rounded-[1.8rem] w-full max-w-sm cursor-pointer group transition-all duration-500 relative hover:glow-primary-sm"
                    style={{ transform: `rotate(${memory.rotate}deg)` }}
                  >
                    {/* Tape strips */}
                    <div className="absolute -top-3 left-6 w-2 h-8 bg-primary/25 backdrop-blur-md -rotate-12 rounded-sm" />
                    <div className="absolute -top-3 right-6 w-2 h-8 bg-primary/25 backdrop-blur-md rotate-12 rounded-sm" />

                    {/* Photo area */}
                    <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-xl overflow-hidden relative mb-6 border border-primary/10">
                      <motion.div className="w-full h-full flex flex-col items-center justify-center gap-3"
                        whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}>
                        <span className="text-5xl opacity-60">{memory.emoji}</span>
                        <span className="font-serif italic text-sm text-muted-foreground/50">[ Add Photo ]</span>
                      </motion.div>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="font-script text-2xl text-primary">{memory.date}</p>
                      <h3 className="font-serif font-semibold text-xl text-foreground/90">{memory.title}</h3>
                      <p className="font-sans text-sm text-foreground/60 leading-relaxed">{memory.description}</p>
                    </div>

                    <p className="absolute bottom-4 right-6 font-serif italic text-xs text-primary/40">tap to read ✦</p>

                    <motion.div className="absolute -bottom-4 -right-4 text-2xl opacity-70"
                      animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}>
                      {memory.emoji}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-4 z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1 }} className="flex flex-col items-center gap-5">
          <motion.button onClick={() => setLocation("/letter")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            className="btn-shimmer px-10 py-5 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-xl tracking-wide transition-all glow-primary flex items-center gap-3">
            Open Birthday Letter <Heart className="w-5 h-5 fill-current" />
          </motion.button>
          <button onClick={() => setLocation("/")} className="font-serif italic text-foreground/50 hover:text-primary transition-colors text-sm">
            ← Back to Home
          </button>
        </motion.div>
      </section>

      <footer className="py-12 text-center relative z-10">
        <p className="font-script text-3xl text-foreground/50">Made with love by {config.yourName}</p>
      </footer>

      {/* Memory modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-xl"
            onClick={() => setSelectedMemory(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-card-strong p-8 md:p-12 rounded-[2rem] max-w-lg w-full relative text-center shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedMemory(null)}
                className="absolute top-6 right-6 text-foreground/40 hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="absolute -top-10 -left-10 text-primary/5 w-40 h-40">
                <Heart className="w-full h-full fill-current" />
              </div>
              <span className="text-5xl block mb-6">{selectedMemory.emoji}</span>
              <p className="font-script text-3xl text-primary mb-1">{selectedMemory.date}</p>
              <h3 className="font-serif text-2xl font-semibold mb-6 text-foreground/90">{selectedMemory.title}</h3>
              <p className="font-sans text-base text-foreground/70 leading-relaxed mb-6">{selectedMemory.description}</p>
              <div className="h-px w-20 bg-primary/30 mx-auto mb-6" />
              <p className="font-serif italic text-lg text-primary/80">"{selectedMemory.hiddenMessage}"</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
