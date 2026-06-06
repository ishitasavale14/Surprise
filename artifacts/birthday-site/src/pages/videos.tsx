import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, ChevronLeft, X, ChevronRight, Play, Heart, Maximize, Minimize } from "lucide-react";
import { useLocation } from "wouter";
import { videosConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

export default function Videos() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [selectedVideo, setSelectedVideo] = useState<typeof videosConfig.videos[0] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  const currentIndex = selectedVideo
    ? videosConfig.videos.findIndex(v => v.id === selectedVideo.id)
    : -1;

  const goToPrev = useCallback(() => {
    if (currentIndex <= 0) return;
    setSelectedVideo(videosConfig.videos[currentIndex - 1]);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= videosConfig.videos.length - 1) return;
    setSelectedVideo(videosConfig.videos[currentIndex + 1]);
  }, [currentIndex]);

  useEffect(() => {
    if (!selectedVideo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "ArrowRight") goToNext();
      else if (e.key === "Escape") {
        setSelectedVideo(null);
        setIsFullscreen(false);
      }
      else if (e.key === "f" || e.key === "F") toggleFullscreen();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedVideo, goToPrev, goToNext]);

  // Auto-play video when selected
  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [selectedVideo]);

  const toggleFullscreen = () => {
    if (!modalRef.current) return;
    if (!document.fullscreenElement) {
      modalRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

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

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative selection:bg-primary selection:text-white">
      <BokehBackground />
      <FloatingParticles />

      <button
        onClick={() => setLocation("/gallery")}
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

      {/* Hero */}
      <section className="relative z-10 min-h-[70dvh] flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="font-script text-6xl md:text-8xl text-primary drop-shadow-[0_0_20px_rgba(255,182,193,0.3)]"
        >
          {videosConfig.heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-serif italic text-xl md:text-2xl text-muted-foreground mt-6 max-w-2xl"
        >
          {videosConfig.subheading}
        </motion.p>
      </section>

      {/* Video Grid */}
      <section className="relative z-10 max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videosConfig.videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -4 }}
              onClick={() => setSelectedVideo(video)}
              className="cursor-pointer group"
            >
              {/* Card */}
              <div className="glass-card rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(255,182,193,0.15)] group-hover:shadow-[0_8px_35px_rgba(255,182,193,0.3)] transition-shadow duration-500">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/15 to-accent/20 overflow-hidden">
                  <video
                    src={video.src}
                    muted
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                  {/* Dreamy gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-primary/5 to-transparent pointer-events-none" />
                  {/* Inner glow */}
                  <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(255,182,193,0.15)] pointer-events-none" />
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      className="w-16 h-16 rounded-full glass-card flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
                    </motion.div>
                  </div>

                  {/* Duration badge placeholder */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-white/80 text-xs font-mono">
                    0:00
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 text-center">
                  <h3 className="font-script text-2xl text-primary">{video.title}</h3>
                  <p className="font-serif text-xs text-muted-foreground mt-1">{video.date}</p>
                </div>
              </div>

              {/* Dreamy glow pulse */}
              <motion.div
                className="absolute -inset-2 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                animate={{ boxShadow: ["0 0 0px rgba(255,182,193,0)", "0 0 20px rgba(255,182,193,0.12)", "0 0 0px rgba(255,182,193,0)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mid Quote */}
      <section className="relative z-10 py-24 px-4 text-center">
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="font-script text-4xl md:text-5xl text-primary max-w-3xl mx-auto drop-shadow-sm"
        >
          {videosConfig.midQuote}
        </motion.p>
      </section>

      {/* Ending */}
      <section className="relative z-10 py-32 flex flex-col items-center justify-center text-center px-4">
        <p className="font-serif italic text-2xl text-muted-foreground mb-12">
          {videosConfig.endingLine}
        </p>
        <button
          onClick={() => setLocation("/special")}
          className="px-8 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all shadow-[0_0_15px_rgba(255,182,193,0.4)]"
        >
          {videosConfig.ctaLabel}
        </button>
        <p className="font-script text-2xl text-foreground/60 mt-16">
          Made with love by {config.yourName}
        </p>
      </section>

      {/* Cinematic Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/50 backdrop-blur-2xl"
            onClick={() => { setSelectedVideo(null); setIsFullscreen(false); }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close */}
            <button
              onClick={() => { setSelectedVideo(null); setIsFullscreen(false); }}
              className="absolute top-6 right-6 z-[110] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-110 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="absolute top-6 right-20 z-[110] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-110 transition-transform"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>

            {/* Prev */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 md:left-8 z-[110] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-110 transition-transform"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next */}
            {currentIndex < videosConfig.videos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 md:right-8 z-[110] w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-110 transition-transform"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Video Player */}
            <motion.div
              key={selectedVideo.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="max-w-3xl w-[92%] mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
                {/* Video */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <video
                    ref={videoRef}
                    src={selectedVideo.src}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-8 text-center space-y-4">
                  <h3 className="font-script text-3xl text-primary">{selectedVideo.title}</h3>
                  <p className="font-serif text-sm text-muted-foreground">{selectedVideo.date}</p>
                  <p className="font-serif italic text-lg text-foreground/80 leading-relaxed">
                    "{selectedVideo.hiddenNote}"
                  </p>
                  <div className="flex justify-center gap-2 text-primary/40 pt-2">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>

              {/* Counter */}
              <div className="text-center mt-4">
                <span className="font-serif text-sm text-muted-foreground/60">
                  {currentIndex + 1} / {videosConfig.videos.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
