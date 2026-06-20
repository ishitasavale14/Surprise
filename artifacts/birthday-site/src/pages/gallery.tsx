import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useLocation } from "wouter";
import { galleryConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

type Photo = typeof galleryConfig.photos[0];

function PhotoCard({
  photo,
  index,
  onClick,
}: {
  photo: Photo;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="relative group cursor-pointer"
      style={{ transform: `rotate(${photo.rotate}deg)` }}
      whileHover={{ rotate: 0, scale: 1.03, zIndex: 10 }}
    >
      {/* Polaroid frame */}
      <div className="polaroid transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(220,130,160,0.3)]">
        {/* Photo area */}
        <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "4/3" }}>
          {/* Placeholder / future image */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 flex items-center justify-center">
            <span className="text-5xl">{photo.emoji}</span>
          </div>

          {/* Hover overlay */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3"
          >
            <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
            <p className="font-serif italic text-white text-sm drop-shadow-lg px-4 text-center">
              {photo.hiddenNote}
            </p>
          </motion.div>

          {/* Glow on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-0 rounded-sm ring-2 ring-primary/40"
            style={{ pointerEvents: "none" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: "rgba(20,5,15,0.85)", backdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative max-w-lg w-full"
      >
        <div className="polaroid">
          <div
            className="relative bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 flex items-center justify-center rounded-sm"
            style={{ aspectRatio: "4/3" }}
          >
            <span className="text-8xl">{photo.emoji}</span>
          </div>
          <div className="py-4 text-center">
            <p className="font-serif italic text-sm text-primary/80 mt-3 px-4 leading-relaxed">
              {photo.hiddenNote}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={onPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? "bg-primary w-6" : "bg-white/30"}`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeCloud, setActiveCloud] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() =>
    setLightboxIndex(i => i !== null ? (i - 1 + galleryConfig.photos.length) % galleryConfig.photos.length : null), []);
  const next = useCallback(() =>
    setLightboxIndex(i => i !== null ? (i + 1) % galleryConfig.photos.length : null), []);

  // Masonry-like column distribution
  // Distribute 10 photos across 3 columns: col1→4, col2→3, col3→3
  const col1 = galleryConfig.photos.filter((_, i) => i % 3 === 0);
  const col2 = galleryConfig.photos.filter((_, i) => i % 3 === 1);
  const col3 = galleryConfig.photos.filter((_, i) => i % 3 === 2);

  const getGlobalIndex = (photo: Photo) => galleryConfig.photos.findIndex(p => p.id === photo.id);

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative">
      <BokehBackground />
      <FloatingParticles />

      {/* Nav */}
      <button
        onClick={() => setLocation("/games")}
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

      {/* Hero */}
      <section className="relative z-10 min-h-[60dvh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="font-script text-6xl md:text-8xl text-primary text-glow mb-4"
        >
          {galleryConfig.heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-serif italic text-xl md:text-2xl text-muted-foreground max-w-xl"
        >
          {galleryConfig.subheading}
        </motion.p>

        {/* Interactive clouds */}
        <div className="mt-14 relative w-full max-w-2xl h-40 mx-auto flex items-center justify-center">
          <p className="absolute -top-6 font-serif italic text-xs text-muted-foreground/50 tracking-wider">
            ☁️ Click the clouds for hidden notes
          </p>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute cursor-pointer select-none"
              style={{ left: i === 0 ? "8%" : i === 1 ? "38%" : "68%", top: i % 2 === 0 ? "20%" : "55%" }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.2 }}
              onClick={() => { setActiveCloud(i); setTimeout(() => setActiveCloud(null), 3000); }}
            >
              <div className="w-28 h-16 md:w-40 md:h-20 bg-white/50 rounded-full blur-sm shadow-lg" />
              <AnimatePresence>
                {activeCloud === i && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: -50 }}
                    exit={{ opacity: 0, y: -70, scale: 0.9 }}
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap glass-card px-4 py-2 rounded-2xl font-script text-xl text-primary z-20"
                  >
                    {galleryConfig.cloudMessages[i]}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="relative z-10 px-4 pb-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="flex flex-col gap-6 md:gap-8">
            {col1.map(photo => (
              <PhotoCard key={photo.id} photo={photo} index={getGlobalIndex(photo)} onClick={() => openLightbox(getGlobalIndex(photo))} />
            ))}
          </div>
          <div className="flex flex-col gap-6 md:gap-8 mt-8">
            {col2.map(photo => (
              <PhotoCard key={photo.id} photo={photo} index={getGlobalIndex(photo)} onClick={() => openLightbox(getGlobalIndex(photo))} />
            ))}
          </div>
          <div className="hidden md:flex flex-col gap-8 mt-4">
            {col3.map(photo => (
              <PhotoCard key={photo.id} photo={photo} index={getGlobalIndex(photo)} onClick={() => openLightbox(getGlobalIndex(photo))} />
            ))}
          </div>
        </div>
      </section>

      {/* Mid quote */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 py-16 px-4 text-center"
      >
        <p className="font-script text-4xl md:text-5xl text-primary text-glow max-w-2xl mx-auto">
          "{galleryConfig.midQuote}"
        </p>
      </motion.section>

      {/* End + CTA */}
      <section className="relative z-10 py-16 px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-serif italic text-xl text-muted-foreground mb-10"
        >
          {galleryConfig.endingLine}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setLocation("/special")}
          className="btn-shimmer px-10 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all glow-primary flex items-center gap-3 mx-auto"
        >
          <Heart className="w-5 h-5" fill="currentColor" />
          {galleryConfig.ctaLabel}
        </motion.button>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={galleryConfig.photos}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
