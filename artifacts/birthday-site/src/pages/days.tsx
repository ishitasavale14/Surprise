import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { daysConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

export default function Days() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [selectedMemory, setSelectedMemory] = useState<typeof daysConfig.memories[0] | null>(null);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative">
      <BokehBackground />
      <FloatingParticles />

      <button onClick={() => setLocation("/special")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform">
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
      <button onClick={togglePlay}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform">
        <Heart className="w-5 h-5 text-primary" fill={isPlaying ? "currentColor" : "none"} />
      </button>

      {/* Hero */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4 }}>
          <p className="font-serif italic text-muted-foreground text-lg mb-4">every single day with you…</p>
          <h1 className="font-script text-7xl md:text-9xl text-primary text-glow mb-6">{daysConfig.heading}</h1>
          <p className="font-serif italic text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {daysConfig.subheading}
          </p>
        </motion.div>

        {/* Featured memory card */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
          className="mt-16 glass-card-strong max-w-2xl w-full rounded-[2rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-xl m-4" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-xl m-4" />
          <div className="text-5xl mb-5">{daysConfig.featuredMemory.emoji}</div>
          <h2 className="font-script text-4xl text-primary text-glow mb-4">{daysConfig.featuredMemory.title}</h2>
          <p className="font-serif italic text-lg text-foreground/75 leading-relaxed mb-5">
            "{daysConfig.featuredMemory.text}"
          </p>
          <p className="font-serif text-xs text-muted-foreground/50 tracking-widest">✦ Our most treasured memory ✦</p>
        </motion.div>
      </section>

      {/* Month grid */}
      <section className="relative z-10 py-24 px-4 max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-script text-5xl text-center text-primary text-glow mb-4">Month by Month ✦</motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }} className="font-serif italic text-center text-muted-foreground mb-12">
          Tap any month to reveal our hidden memory ❤️
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {daysConfig.memories.map((month, index) => (
            <motion.div key={month.id}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.06, y: -3 }} onClick={() => setSelectedMemory(month)}
              className="glass-card-strong rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center gap-2 hover:glow-primary-sm">
              <span className="text-3xl mb-1">{month.emoji}</span>
              <h3 className="font-script text-xl text-primary">{month.month}</h3>
              <p className="font-serif text-xs text-foreground/60 italic line-clamp-2">{month.note}</p>
              <p className="font-serif text-[10px] text-primary/30 mt-1">tap ✦</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mid quote */}
      <section className="relative z-10 py-24 px-4 text-center">
        <motion.p initial={{ opacity: 0, filter: "blur(10px)" }} whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }} transition={{ duration: 1.5 }}
          className="font-script text-4xl md:text-5xl text-primary text-glow max-w-3xl mx-auto leading-relaxed">
          {daysConfig.midQuote}
        </motion.p>
      </section>

      {/* Future goals */}
      <section className="relative z-10 py-16 px-4 max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-script text-4xl text-center text-primary text-glow mb-12">
          The Pages We Haven't Written Yet ✨
        </motion.h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {daysConfig.futureGoals.map((goal, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: index * 0.2 }}
              className="flex-1 glass rounded-2xl p-6 border border-dashed border-primary/25 text-center flex flex-col items-center gap-3">
              <span className="text-primary text-sm">✦</span>
              <p className="font-serif italic text-muted-foreground/80 text-sm leading-relaxed">{goal}…</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ending */}
      <section className="relative z-10 py-32 flex flex-col items-center justify-center text-center px-4">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-script text-4xl md:text-5xl text-primary text-glow mb-2">{daysConfig.endingLine1}</motion.p>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="font-script text-4xl md:text-5xl text-primary text-glow mb-14">{daysConfig.endingLine2}</motion.p>
        <motion.button onClick={() => setLocation("/ending")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="btn-shimmer px-10 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg glow-primary flex items-center gap-3">
          <Heart className="w-5 h-5" fill="currentColor" /> {daysConfig.ctaLabel}
        </motion.button>
        <p className="font-script text-2xl text-foreground/40 mt-16">Made with love by {config.yourName}</p>
      </section>

      {/* Month modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-background/60 backdrop-blur-xl"
            onClick={() => setSelectedMemory(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="glass-card-strong max-w-md w-full rounded-3xl p-10 text-center relative"
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="text-6xl mb-5">{selectedMemory.emoji}</div>
              <h3 className="font-script text-4xl text-primary text-glow mb-2">{selectedMemory.month}</h3>
              <p className="font-serif text-sm text-muted-foreground mb-6">{selectedMemory.note}</p>
              <div className="h-px w-16 bg-primary/30 mx-auto mb-6" />
              <p className="font-serif italic text-lg text-foreground/85 leading-relaxed mb-6">
                "{selectedMemory.hiddenMemory}"
              </p>
              <Heart className="w-5 h-5 text-primary/30 mx-auto fill-current" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
