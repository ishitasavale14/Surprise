import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ChevronLeft, Gift, Music } from "lucide-react";
import { useLocation } from "wouter";
import { surpriseConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

export default function Surprise() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [phase, setPhase] = useState<"intro" | "reveal" | "finale">("intro");
  const [flash, setFlash] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const handleUnlock = () => {
    setFlash(true);
    setTimeout(() => { setPhase("reveal"); setFlash(false); }, 600);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient text-foreground overflow-x-hidden relative">
      <FloatingParticles heartsOnly />
      <BokehBackground />

      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} className="fixed inset-0 bg-white z-[100] pointer-events-none" />
        )}
      </AnimatePresence>

      <button onClick={() => setLocation("/letter")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform">
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
      <button onClick={togglePlay}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform">
        <Heart className="w-5 h-5 text-primary" fill={isPlaying ? "currentColor" : "none"} />
      </button>

      <AnimatePresence mode="wait">
        {/* INTRO */}
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 text-center">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-serif italic text-muted-foreground text-lg mb-6">
              Something special is waiting for you…
            </motion.p>
            <motion.h1 animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
              className="font-script text-5xl md:text-7xl text-primary text-glow text-center max-w-3xl mb-16">
              {surpriseConfig.unlockMessage}
            </motion.h1>
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }} onClick={handleUnlock}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
              className="btn-shimmer px-10 py-5 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-xl tracking-wide glow-primary flex items-center gap-3">
              <Sparkles className="w-5 h-5" /> Tap To Unlock <Sparkles className="w-5 h-5" />
            </motion.button>
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20 pointer-events-none" style={{ maxWidth: "200px", maxHeight: "70px", top: "calc(50% + 80px)", left: "50%", transform: "translate(-50%,-50%)" }} />
          </motion.div>
        )}

        {/* REVEAL */}
        {phase === "reveal" && (
          <motion.div key="reveal" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            className="relative z-20 py-32 px-4 min-h-screen flex flex-col items-center gap-28 max-w-5xl mx-auto">

            {/* Surprise message */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="glass-card-strong rounded-[2rem] max-w-2xl p-10 md:p-16 text-center relative w-full">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-xl m-4" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-xl m-4" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-xl m-4" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-xl m-4" />
              <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-8">❤️</motion.div>
              <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-foreground/80">
                {surpriseConfig.surpriseMessage}
              </p>
            </motion.div>

            {/* Photo carousel */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full flex flex-col items-center">
              <h2 className="font-script text-5xl text-primary text-glow mb-12">Our Favourite Moments</h2>
              <div className="w-full overflow-x-auto pb-12 pt-4 px-4 flex gap-6 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {surpriseConfig.carouselPhotos.map(photo => (
                  <motion.div key={photo.id}
                    className="snap-start shrink-0 glass-card-strong rounded-2xl p-4 w-[260px] flex flex-col relative cursor-pointer"
                    style={{ transform: `rotate(${photo.rotate}deg)` }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}>
                    <div className="w-full aspect-[4/5] bg-gradient-to-br from-primary/10 to-accent/20 rounded-xl mb-4 flex items-center justify-center border border-primary/15 overflow-hidden relative">
                      <span className="font-serif text-sm text-primary/40 italic">[ Add Photo ]</span>
                    </div>
                    <div className="text-center">
                      <p className="font-serif font-semibold text-base mb-1 text-foreground/80">{photo.caption}</p>
                      <p className="font-script text-primary text-lg">{photo.date}</p>
                    </div>
                    <div className="mt-3 px-2">
                      <p className="font-serif italic text-xs text-muted-foreground/60 text-center leading-relaxed">{photo.hiddenNote}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Gift box */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.8 }} className="flex flex-col items-center w-full">
              <h2 className="font-script text-5xl text-primary text-glow mb-16 text-center">
                A Little Something For You 🎁
              </h2>
              <div className="relative w-full max-w-md flex flex-col items-center min-h-[320px]">
                <motion.div onClick={() => !giftOpen && setGiftOpen(true)} className="cursor-pointer relative z-20"
                  animate={{ y: giftOpen ? 0 : [0, -12, 0] }}
                  transition={{ y: { duration: 3, repeat: giftOpen ? 0 : Infinity } }}>
                  <div className={`w-40 h-36 rounded-xl border relative overflow-hidden transition-all duration-1000 ${giftOpen ? "bg-primary/40 border-primary/60 shadow-[0_0_50px_rgba(220,130,160,0.5)]" : "bg-primary/20 border-primary/40"}`}>
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-primary/60" />
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-4 bg-primary/60" />
                  </div>
                  <motion.div
                    className="absolute -top-4 -left-2 right-[-8px] h-8 rounded-md bg-primary/30 border border-primary/50 origin-bottom flex justify-center z-10"
                    animate={giftOpen ? { y: -100, rotate: -25, opacity: 0, x: -30 } : { y: 0, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}>
                    <div className="absolute -top-6 flex gap-1">
                      <div className="w-7 h-7 rounded-full border-4 border-primary/60 rounded-bl-none -rotate-45" />
                      <div className="w-7 h-7 rounded-full border-4 border-primary/60 rounded-br-none rotate-45" />
                    </div>
                  </motion.div>
                  <AnimatePresence>
                    {giftOpen && Array.from({ length: 10 }).map((_, i) => (
                      <motion.div key={i} className="absolute top-1/2 left-1/2 text-primary"
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{ scale: Math.random() + 0.5, x: (Math.random() - 0.5) * 200, y: -60 - Math.random() * 140, opacity: 0, rotate: Math.random() * 180 }}
                        transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}>
                        <Heart className="fill-current w-5 h-5" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {!giftOpen && (
                  <p className="font-serif italic text-muted-foreground mt-8 animate-pulse text-sm">Click to open ✨</p>
                )}

                <AnimatePresence>
                  {giftOpen && (
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="mt-12 glass-card-strong rounded-2xl p-8 max-w-md w-full text-center space-y-5">
                      <Gift className="w-8 h-8 text-primary mx-auto" />
                      <p className="font-serif text-lg text-foreground/80 leading-relaxed">{surpriseConfig.giftRevealMessage}</p>
                      <p className="font-serif italic text-primary font-medium">{surpriseConfig.secretMessage}</p>
                      <a href={surpriseConfig.spotifyLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 hover:bg-primary/40 text-primary font-serif transition-colors border border-primary/30">
                        <Music className="w-4 h-4" /> Listen Together
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              onClick={() => setPhase("finale")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="btn-shimmer px-10 py-5 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg glow-primary flex items-center gap-3">
              <Sparkles className="w-5 h-5" /> Continue to Finale
            </motion.button>
          </motion.div>
        )}

        {/* FINALE */}
        {phase === "finale" && (
          <motion.div key="finale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 bg-animated-gradient overflow-hidden">
            {Array.from({ length: 28 }).map((_, i) => (
              <motion.div key={i} className="fixed text-primary/30 pointer-events-none"
                style={{ left: `${Math.random() * 100}vw` }}
                initial={{ y: "-10vh" }} animate={{ y: "110vh", rotate: 360 }}
                transition={{ duration: 6 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}>
                <Heart className="fill-current" style={{ width: `${Math.random() * 12 + 8}px`, height: `${Math.random() * 12 + 8}px` }} />
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-4xl">
              {surpriseConfig.finalLines.map((line, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.8 }}
                  className="font-script text-4xl md:text-6xl text-primary text-glow">{line}</motion.div>
              ))}
              <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + surpriseConfig.finalLines.length * 0.8 + 0.5, duration: 1.5 }}
                className="font-script text-5xl md:text-7xl text-primary text-glow animate-heartbeat pt-6">
                Happy Birthday, {config.boyfriendName}
              </motion.h1>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + surpriseConfig.finalLines.length * 0.8 + 2 }}
                className="flex flex-col items-center gap-2">
                <p className="font-serif italic text-foreground/60 text-lg">With all my love,</p>
                <div className="relative">
                  <span className="font-script text-4xl text-primary pb-2 inline-block">{config.yourName}</span>
                  <motion.div className="absolute bottom-0 left-0 h-px bg-primary/50 rounded-full"
                    initial={{ width: "0%" }} animate={{ width: "100%" }}
                    transition={{ delay: 0.5 + surpriseConfig.finalLines.length * 0.8 + 2.5, duration: 1 }} />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + surpriseConfig.finalLines.length * 0.8 + 4 }}
                className="flex flex-col items-center gap-3 pt-8">
                <motion.button onClick={() => setLocation("/reasons")} whileHover={{ scale: 1.04 }}
                  className="btn-shimmer px-8 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg glow-primary">
                  Reasons I Love You 💕
                </motion.button>
                <button onClick={() => setLocation("/")}
                  className="px-8 py-3 rounded-full glass-card text-foreground/70 font-serif hover:text-primary transition-colors">
                  Back to Home
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
