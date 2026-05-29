import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Music, ChevronLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { galleryConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";

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
  const [particles] = useState(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100 + 100,
    size: Math.random() * 1.2 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 15,
    type: (Math.random() > 0.5 ? "heart" : "sparkle") as "heart" | "sparkle"
  })));

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

export default function Gallery() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [selectedPhoto, setSelectedPhoto] = useState<typeof galleryConfig.photos[0] | null>(null);
  const [activeCloud, setActiveCloud] = useState<number | null>(null);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative selection:bg-primary selection:text-white">
      <BokehBackground />
      <FloatingParticles />

      <button 
        onClick={() => setLocation("/games")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={togglePlay}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        {isPlaying ? <Music className="w-5 h-5 opacity-50" /> : <Music className="w-5 h-5" />}
      </button>

      <section className="relative z-10 min-h-[80dvh] flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="font-script text-6xl md:text-8xl text-primary drop-shadow-[0_0_15px_rgba(255,182,193,0.3)]"
        >
          {galleryConfig.heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-serif italic text-xl md:text-2xl text-muted-foreground mt-6"
        >
          {galleryConfig.subheading}
        </motion.p>

        <div className="mt-20 relative w-full max-w-2xl h-48 mx-auto flex items-center justify-center">
          <p className="absolute -top-8 font-serif italic text-sm text-muted-foreground/60">☁️ Click the clouds for hidden notes</p>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-20 md:w-48 md:h-32 bg-white/60 blur-sm rounded-full shadow-lg cursor-pointer flex items-center justify-center"
              style={{
                left: i === 0 ? '10%' : i === 1 ? '40%' : '70%',
                top: i % 2 === 0 ? '20%' : '60%'
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i }}
              onClick={() => {
                setActiveCloud(i);
                setTimeout(() => setActiveCloud(null), 3000);
              }}
            >
              <AnimatePresence>
                {activeCloud === i && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: -40 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className="absolute whitespace-nowrap glass-card px-4 py-2 rounded-2xl font-script text-xl text-primary z-20"
                  >
                    {galleryConfig.cloudMessages[i]}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto py-24 px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {galleryConfig.photos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ scale: 1.04, rotate: 0, boxShadow: "0 0 25px rgba(255,182,193,0.4)" }}
              className="glass-card rounded-3xl p-4 cursor-pointer transition-all"
              style={{ rotate: `${photo.rotate}deg` }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex flex-col items-center justify-center text-center p-4">
                <span className="text-5xl mb-4">{photo.emoji}</span>
                <span className="font-serif italic text-muted-foreground/60">[ Add Photo ]</span>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-script text-2xl text-primary">{photo.caption}</h3>
                <p className="font-serif text-xs text-muted-foreground mt-1">{photo.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-24 px-4 text-center">
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="font-script text-4xl md:text-5xl text-primary max-w-3xl mx-auto"
        >
          {galleryConfig.midQuote}
        </motion.p>
      </section>

      <section className="relative z-10 py-24 px-4 max-w-4xl mx-auto text-center">
        <h2 className="font-script text-4xl text-foreground mb-12">Our Little Universe ✨</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square glass rounded-2xl flex items-center justify-center">
              <span className="font-serif italic text-muted-foreground/50">[ Memory ]</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-32 flex flex-col items-center text-center px-4">
        <p className="font-serif italic text-2xl text-muted-foreground mb-12">
          {galleryConfig.endingLine}
        </p>
        <button
          onClick={() => setLocation("/special")}
          className="px-8 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all shadow-[0_0_15px_rgba(255,182,193,0.4)]"
        >
          {galleryConfig.ctaLabel}
        </button>
        <p className="font-script text-2xl text-foreground/60 mt-16">
          Made with love by {config.yourName}
        </p>
      </section>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-white/40 backdrop-blur-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-sm w-full rounded-3xl p-8 text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-6xl mb-6">{selectedPhoto.emoji}</div>
              <h3 className="font-script text-4xl text-primary mb-2">{selectedPhoto.caption}</h3>
              <p className="font-serif text-sm text-muted-foreground mb-6">{selectedPhoto.date}</p>
              <p className="font-serif italic text-lg text-foreground/80">"{selectedPhoto.hiddenNote}"</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
