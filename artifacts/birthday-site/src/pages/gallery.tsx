import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Music, ChevronLeft, X, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { galleryConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

export default function Gallery() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [selectedPhoto, setSelectedPhoto] = useState<typeof galleryConfig.photos[0] | null>(null);
  const [activeCloud, setActiveCloud] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  const currentIndex = selectedPhoto
    ? galleryConfig.photos.findIndex(p => p.id === selectedPhoto.id)
    : -1;

  const goToPrev = useCallback(() => {
    if (currentIndex <= 0) return;
    setSelectedPhoto(galleryConfig.photos[currentIndex - 1]);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= galleryConfig.photos.length - 1) return;
    setSelectedPhoto(galleryConfig.photos[currentIndex + 1]);
  }, [currentIndex]);

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "ArrowRight") goToNext();
      else if (e.key === "Escape") setSelectedPhoto(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, goToPrev, goToNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  // Varying heights for masonry effect
  const heights = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-[4/5]", "aspect-square"];

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
          <p className="absolute -top-8 font-serif italic text-sm text-muted-foreground/60">Click the clouds for hidden notes</p>
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

      {/* Masonry Gallery Grid */}
      <section className="relative z-10 max-w-6xl mx-auto py-24 px-4">
        <div className="columns-2 md:columns-3 gap-5 space-y-5">
          {galleryConfig.photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.03, rotate: 0 }}
              onClick={() => setSelectedPhoto(photo)}
              className="break-inside-avoid cursor-pointer group relative"
              style={{ rotate: `${photo.rotate}deg` }}
            >
              {/* Glassmorphism frame */}
              <div className="glass-card rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(255,182,193,0.15)] group-hover:shadow-[0_8px_35px_rgba(255,182,193,0.35)] transition-shadow duration-500">
                {/* Image container with varying aspect ratios */}
                <div className={`${heights[index % heights.length]} relative overflow-hidden`}>
                  <img
                    src={photo.image}
                    alt={photo.caption}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dreamy gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-primary/5 to-transparent pointer-events-none" />
                  {/* Soft inner glow */}
                  <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(255,182,193,0.15)] pointer-events-none" />
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  {/* Emoji badge */}
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full glass-card flex items-center justify-center text-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photo.emoji}
                  </div>
                </div>

                {/* Caption area */}
                <div className="p-4 text-center">
                  <h3 className="font-script text-xl text-primary">{photo.caption}</h3>
                  <p className="font-serif text-xs text-muted-foreground mt-1">{photo.date}</p>
                </div>
              </div>

              {/* Dreamy glow pulse on hover */}
              <motion.div
                className="absolute -inset-2 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                animate={{ boxShadow: ["0 0 0px rgba(255,182,193,0)", "0 0 20px rgba(255,182,193,0.15)", "0 0 0px rgba(255,182,193,0)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
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

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            ref={lightboxRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/50 backdrop-blur-2xl"
            onClick={() => setSelectedPhoto(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 z-[110] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-110 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev button */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 md:left-8 z-[110] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-110 transition-transform"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next button */}
            {currentIndex < galleryConfig.photos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 md:right-8 z-[110] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-110 transition-transform"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Lightbox content */}
            <motion.div
              key={selectedPhoto.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="max-w-lg w-[90%] mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={selectedPhoto.image}
                    alt={selectedPhoto.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                </div>

                {/* Info */}
                <div className="p-8 text-center space-y-4">
                  <div className="text-3xl">{selectedPhoto.emoji}</div>
                  <h3 className="font-script text-3xl text-primary">{selectedPhoto.caption}</h3>
                  <p className="font-serif text-sm text-muted-foreground">{selectedPhoto.date}</p>
                  <p className="font-serif italic text-lg text-foreground/80 leading-relaxed">
                    "{selectedPhoto.hiddenNote}"
                  </p>
                  <div className="flex justify-center gap-2 text-primary/40 pt-2">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>

              {/* Photo counter */}
              <div className="text-center mt-4">
                <span className="font-serif text-sm text-muted-foreground/60">
                  {currentIndex + 1} / {galleryConfig.photos.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
