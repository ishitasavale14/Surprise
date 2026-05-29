import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ChevronLeft, Gift, Music } from "lucide-react";
import { useLocation } from "wouter";
import { surpriseConfig, config } from "@/config";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

export default function Surprise() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<"intro" | "reveal" | "finale">("intro");
  const [flash, setFlash] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const handleUnlock = () => {
    setFlash(true);
    setTimeout(() => {
      setPhase("reveal");
      setFlash(false);
    }, 600);
  };

  const handleGiftClick = () => {
    if (!giftOpen) setGiftOpen(true);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient text-foreground overflow-x-hidden selection:bg-primary selection:text-white relative">
      <FloatingParticles heartsOnly />
      <BokehBackground />

      <AnimatePresence>
        {flash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4"
          >
            <motion.h1
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="font-script text-5xl md:text-7xl text-primary drop-shadow-[0_0_30px_rgba(255,182,193,0.8)] text-center max-w-4xl"
            >
              {surpriseConfig.unlockMessage}
            </motion.h1>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              onClick={handleUnlock}
              data-testid="tap-unlock-button"
              className="mt-16 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-serif text-xl tracking-wide transition-all shadow-[0_0_20px_rgba(255,182,193,0.6)] hover:shadow-[0_0_30px_rgba(255,182,193,0.8)] flex items-center gap-2"
            >
              Tap To Unlock <Sparkles className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 py-24 px-4 min-h-screen flex flex-col items-center gap-32 max-w-6xl mx-auto"
          >
            {/* Section A: Surprise Message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card rounded-3xl max-w-2xl p-10 md:p-16 text-center relative w-full"
            >
              <div className="absolute -top-3 -left-3 w-16 h-4 bg-primary/20 backdrop-blur-sm -rotate-45 shadow-sm rounded-sm" />
              <div className="absolute -top-3 -right-3 w-16 h-4 bg-primary/20 backdrop-blur-sm rotate-45 shadow-sm rounded-sm" />
              
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-8"
              >
                ❤️
              </motion.div>
              
              <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-foreground/80">
                {surpriseConfig.surpriseMessage}
              </p>
            </motion.div>

            {/* Section B: Photo Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full flex flex-col items-center"
            >
              <h2 className="font-script text-4xl md:text-5xl text-primary mb-12">Our Favorite Moments</h2>
              
              <div className="w-full overflow-x-auto pb-12 pt-4 px-4 flex gap-6 snap-x snap-mandatory hide-scrollbar">
                {surpriseConfig.carouselPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    className="snap-start shrink-0 glass-card rounded-xl p-4 w-[280px] flex flex-col relative"
                    style={{ rotate: `${photo.rotate}deg` }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                    onMouseEnter={() => setActiveTooltip(photo.id)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <div className="w-full aspect-[4/5] bg-gradient-to-br from-primary/10 to-accent/20 rounded-md mb-4 flex items-center justify-center border border-primary/20 overflow-hidden relative">
                       <span className="font-serif text-sm text-primary/40">[ Add Photo ]</span>
                    </div>
                    <div className="text-center mt-auto">
                      <p className="font-serif font-bold text-lg mb-1">{photo.caption}</p>
                      <p className="font-script text-primary text-xl">{photo.date}</p>
                    </div>

                    <AnimatePresence>
                      {activeTooltip === photo.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: -20, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-primary/20 w-64 text-center z-50 pointer-events-none"
                        >
                          <p className="font-serif text-sm text-foreground/80">{photo.hiddenNote}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Section C: Gift Box */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center w-full"
            >
              <h2 className="font-script text-4xl md:text-5xl text-primary mb-16 text-center">A Little Something For You 🎁</h2>

              <div className="relative w-full max-w-md flex flex-col items-center min-h-[300px]">
                {/* Gift Box CSS Drawing */}
                <motion.div
                  onClick={handleGiftClick}
                  data-testid="gift-box"
                  className="cursor-pointer relative drop-shadow-[0_0_20px_rgba(255,182,193,0.5)] z-20"
                  animate={{ y: giftOpen ? 0 : [0, -12, 0] }}
                  transition={{ y: { duration: 3, repeat: giftOpen ? 0 : Infinity, ease: "easeInOut" } }}
                >
                  {/* Box Body */}
                  <div className={`w-[160px] h-[140px] rounded-lg border border-primary/40 relative overflow-hidden transition-colors duration-1000 ${giftOpen ? 'bg-primary/30 shadow-[0_0_40px_rgba(255,182,193,0.8)]' : 'bg-primary/20'}`}>
                    {/* Vertical Ribbon */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-primary/60" />
                    {/* Horizontal Ribbon */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-4 bg-primary/60" />
                  </div>

                  {/* Box Lid */}
                  <motion.div 
                    className="absolute -top-4 -left-2 right-[-8px] h-8 rounded-md bg-primary/30 border border-primary/50 shadow-md origin-bottom flex justify-center z-10"
                    animate={giftOpen ? { y: -100, rotate: -25, opacity: 0, x: -30 } : { y: 0, rotate: 0, opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {/* Bow */}
                    <div className="absolute -top-6 flex gap-1">
                      <div className="w-8 h-8 rounded-full border-4 border-primary/60 rounded-bl-none -rotate-45" />
                      <div className="w-8 h-8 rounded-full border-4 border-primary/60 rounded-br-none rotate-45" />
                    </div>
                  </motion.div>

                  {/* Burst Hearts */}
                  <AnimatePresence>
                    {giftOpen && Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={`burst-${i}`}
                        className="absolute top-1/2 left-1/2 text-primary"
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{ 
                          scale: Math.random() * 1.5 + 0.5,
                          x: (Math.random() - 0.5) * 200, 
                          y: -50 - Math.random() * 150,
                          opacity: 0,
                          rotate: Math.random() * 180
                        }}
                        transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
                      >
                        <Heart className="fill-current w-6 h-6" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {!giftOpen && (
                  <p className="font-serif italic text-muted-foreground mt-8 animate-pulse">Click to open</p>
                )}

                {/* Secret Message Reveal */}
                <AnimatePresence>
                  {giftOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="mt-12 glass-card rounded-2xl p-8 max-w-md w-full text-center space-y-6 relative z-10"
                    >
                      <p className="font-serif text-lg text-foreground/90">{surpriseConfig.giftRevealMessage}</p>
                      <p className="font-serif italic text-primary font-medium">{surpriseConfig.secretMessage}</p>
                      
                      <div className="pt-4 flex flex-col items-center gap-2">
                        <a 
                          href={surpriseConfig.spotifyLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/50 hover:bg-accent text-accent-foreground font-serif transition-colors shadow-sm"
                        >
                          <Music className="w-4 h-4" /> Listen Together
                        </a>
                        <span className="text-xs text-muted-foreground font-sans">Open in Spotify</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Transition to Finale */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 mb-24"
            >
              <button
                onClick={() => setPhase("finale")}
                data-testid="continue-finale-button"
                className="px-8 py-4 rounded-full bg-primary/90 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,182,193,0.8)]"
              >
                Continue to Finale ✨
              </button>
            </motion.div>

          </motion.div>
        )}

        {phase === "finale" && (
          <motion.div
            key="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 bg-animated-gradient"
          >
            {/* Raining Hearts */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={`rain-${i}`}
                className="fixed text-primary/40 pointer-events-none"
                style={{ left: `${Math.random() * 100}vw` }}
                initial={{ y: "-10vh", rotate: 0 }}
                animate={{ y: "110vh", rotate: 360 }}
                transition={{
                  duration: 5 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
              >
                <Heart className="w-4 h-4 fill-current" />
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-4xl">
              {surpriseConfig.finalLines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.8, duration: 1 }}
                  className="font-script text-4xl md:text-6xl text-primary"
                >
                  {line}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + surpriseConfig.finalLines.length * 0.8 + 0.5, duration: 1.5 }}
                className="pt-8"
              >
                <h1 className="font-script text-5xl md:text-7xl text-primary drop-shadow-[0_0_20px_rgba(255,182,193,0.5)] animate-pulse">
                  Happy Birthday, {config.boyfriendName}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + surpriseConfig.finalLines.length * 0.8 + 2, duration: 1 }}
                className="flex flex-col items-center pt-8 space-y-2"
              >
                <p className="font-serif italic text-foreground/60 text-lg">With all my love,</p>
                <div className="relative">
                  <span className="font-script text-4xl md:text-5xl text-primary inline-block pb-2">{config.yourName}</span>
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5 + surpriseConfig.finalLines.length * 0.8 + 2.5, duration: 1, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + surpriseConfig.finalLines.length * 0.8 + 4, duration: 1 }}
                className="pt-16 flex flex-col items-center gap-4"
              >
                <button
                  onClick={() => setLocation("/reasons")}
                  className="px-8 py-3 rounded-full glass-card hover:bg-white/50 border border-primary/30 text-foreground font-serif text-lg tracking-wide transition-all shadow-[0_0_15px_rgba(255,182,193,0.3)] hover:shadow-[0_0_20px_rgba(255,182,193,0.5)]"
                >
                  Reasons I Love You 💕
                </button>
                <button
                  onClick={() => setLocation("/")}
                  className="px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-serif text-lg tracking-wide transition-all shadow-[0_0_20px_rgba(255,182,193,0.6)] hover:shadow-[0_0_30px_rgba(255,182,193,0.8)]"
                >
                  {surpriseConfig.replayLabel}
                </button>
                <button
                  onClick={() => setLocation("/letter")}
                  className="font-serif text-sm text-foreground/50 hover:text-primary transition-colors"
                >
                  ← Back to Letter
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
