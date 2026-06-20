import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, Play, Pause } from "lucide-react";
import { useLocation } from "wouter";
import { endingConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

function ShootingStars() {
  const [stars, setStars] = useState<{ id: number; top: string; duration: number }[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setStars(prev => [...prev, { id, top: `${Math.random() * 50 + 5}%`, duration: 2 + Math.random() }]);
      setTimeout(() => setStars(prev => prev.filter(s => s.id !== id)), 3000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map(star => (
        <motion.div key={star.id}
          initial={{ x: "-5vw", y: 0, opacity: 0 }}
          animate={{ x: "110vw", y: 120, opacity: [0, 1, 1, 0] }}
          transition={{ duration: star.duration, ease: "easeOut" }}
          className="absolute h-px w-20 rounded-full"
          style={{
            top: star.top,
            rotate: "15deg",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(220,130,160,0.6))",
            boxShadow: "0 0 8px rgba(255,255,255,0.6)",
          }}
        />
      ))}
    </div>
  );
}

function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2.4, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
      className="mt-16 relative max-w-md md:max-w-2xl mx-auto"
    >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ boxShadow: "0 0 60px rgba(255,182,193,0.2), 0 0 120px rgba(220,100,140,0.08)" }} />

      {/* Video card with glassmorphism */}
      <div className="relative rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>

        {/* Video element */}
        <div className="relative aspect-video bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-pink-900/30">
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-t-3xl"
            onCanPlay={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            onEnded={() => setIsPlaying(false)}
            playsInline
            preload="metadata"
            style={{ display: hasError ? "none" : "block" }}
          >
            <source src="/videos/our-video.mp4" type="video/mp4" />
            <source src="/videos/our-video.webm" type="video/webm" />
          </video>

          {/* Loading / placeholder state */}
          <AnimatePresence>
            {(!isLoaded || hasError) && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Heart className="w-14 h-14 text-pink-300/60" fill="currentColor" />
                </motion.div>
                <p className="font-serif italic text-pink-200/40 text-sm px-6 text-center">
                  {hasError ? "Add your video to /public/videos/our-video.mp4" : "Loading our memory…"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Play/Pause overlay button */}
          {isLoaded && !hasError && (
            <motion.button
              onClick={togglePlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <motion.div
                animate={{ opacity: isPlaying ? 0 : 1 }}
                whileHover={{ opacity: 1 }}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: "rgba(255,182,193,0.2)",
                  backdropFilter: "blur(8px)",
                  border: "2px solid rgba(255,182,193,0.4)",
                  boxShadow: "0 0 30px rgba(255,182,193,0.3)",
                }}
              >
                {isPlaying
                  ? <Pause className="w-6 h-6 text-pink-200" />
                  : <Play className="w-6 h-6 text-pink-200 ml-1" />
                }
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Caption bar */}
        <div className="px-6 py-4 text-center">
          <p className="font-handwriting text-pink-200/70 text-lg">Us, always ❤️</p>
          <p className="font-serif italic text-pink-200/40 text-xs mt-1">A little movie just for you</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Ending() {
  const [, setLocation] = useLocation();
  const { isPlaying: musicPlaying, togglePlay } = useMusicContext();
  const [wishMade, setWishMade] = useState(false);

  const handleWish = () => {
    setWishMade(true);
    for (let i = 0; i < 36; i++) {
      const star = document.createElement("div");
      star.className = "wish-star";
      star.style.left = `${window.innerWidth / 2 + (Math.random() * 240 - 120)}px`;
      star.style.top  = `${window.innerHeight / 2 + (Math.random() * 240 - 120)}px`;
      star.style.setProperty("--tx", `${Math.random() * 300 - 150}px`);
      star.style.setProperty("--ty", `${-120 - Math.random() * 300}px`);
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 2200);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden relative"
      style={{ background: "linear-gradient(180deg, #1a0a12 0%, #0d0510 40%, #0a0316 100%)" }}>
      <BokehBackground />
      <FloatingParticles count={20} />
      <ShootingStars />

      {/* Twinkling stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} className="fixed rounded-full bg-white animate-twinkle pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            opacity: Math.random() * 0.6 + 0.1,
          }}
        />
      ))}

      <button onClick={() => setLocation("/scrapbook")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform">
        <ChevronLeft className="w-6 h-6 text-white/70" />
      </button>
      <button onClick={togglePlay}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform">
        <Heart className="w-5 h-5 text-pink-300" fill={musicPlaying ? "currentColor" : "none"} />
      </button>

      {/* Intro + Video */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 pb-24">
        {endingConfig.introLines.map((line, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 + i * 0.8 }}
            className="font-script text-5xl md:text-7xl text-pink-200 mb-4"
            style={{ textShadow: "0 0 40px rgba(255,182,193,0.5)" }}>
            {line}
          </motion.p>
        ))}

        {/* Video section replaces photo card */}
        <VideoSection />
      </section>

      {/* Big quote */}
      <section className="relative z-10 py-24 px-4 text-center">
        <motion.p initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.8 }}
          className="font-script text-4xl md:text-6xl text-pink-200 max-w-3xl mx-auto leading-relaxed"
          style={{ textShadow: "0 0 40px rgba(255,182,193,0.3)" }}>
          "{endingConfig.bigQuote}"
        </motion.p>
      </section>

      {/* Make a wish */}
      <section className="relative z-10 py-24 px-4 flex flex-col items-center text-center">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-script text-6xl text-pink-200 mb-4"
          style={{ textShadow: "0 0 30px rgba(255,182,193,0.5)" }}>
          Make A Birthday Wish ❤️
        </motion.h2>
        <p className="font-serif italic text-pink-200/50 mb-14 text-lg">Close your eyes. The stars are listening.</p>

        <div className="relative">
          <motion.button onClick={handleWish} disabled={wishMade}
            whileHover={!wishMade ? { scale: 1.05 } : {}} whileTap={{ scale: 0.97 }}
            className="btn-shimmer relative font-script text-3xl px-14 py-7 rounded-full transition-all z-10 flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "rgba(255,182,193,0.15)",
              border: "2px solid rgba(255,182,193,0.4)",
              color: "rgb(255,182,193)",
              boxShadow: "0 0 40px rgba(255,182,193,0.25), inset 0 0 20px rgba(255,182,193,0.05)",
            }}>
            ✨ {wishMade ? "Wish Made ✨" : "Make Wish"} ✨
          </motion.button>
          {!wishMade && <div className="absolute inset-0 rounded-full border border-pink-300/20 animate-ping opacity-30 pointer-events-none" />}
        </div>

        <AnimatePresence>
          {wishMade && (
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="mt-14 max-w-lg p-10 rounded-3xl text-center"
              style={{ background: "rgba(255,182,193,0.08)", border: "1px solid rgba(255,182,193,0.2)", backdropFilter: "blur(20px)" }}>
              <Heart className="w-10 h-10 text-pink-300/50 mx-auto mb-6 animate-heartbeat" fill="currentColor" />
              <p className="font-serif italic text-xl text-pink-100/80 leading-relaxed">{endingConfig.wishMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Heart rain finale */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 py-32 overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => (
          <motion.div key={i} className="absolute text-pink-400/20"
            style={{ left: `${Math.random() * 100}%`, top: "-10%" }}
            animate={{ y: ["0", "120vh"], opacity: [0, 0.5, 0] }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 6, ease: "linear" }}>
            <Heart className="fill-current" style={{ width: `${Math.random() * 12 + 8}px`, height: `${Math.random() * 12 + 8}px` }} />
          </motion.div>
        ))}

        <p className="font-script text-3xl text-pink-200/50 mb-16 z-10">The Last Words</p>
        <div className="space-y-8 mb-24 z-10">
          {endingConfig.finalLines.map((line, idx) => (
            <motion.p key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, delay: idx * 0.6 }}
              className="font-serif italic text-2xl md:text-3xl text-pink-100/70 leading-relaxed">{line}</motion.p>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.5, delay: 1 }} className="z-10 text-center">
          <h1 className="font-script text-6xl md:text-8xl text-pink-200 mb-6 animate-heartbeat"
            style={{ textShadow: "0 0 50px rgba(255,182,193,0.6), 0 0 100px rgba(220,100,140,0.2)" }}>
            Happy Birthday, {config.boyfriendName}
          </h1>
          <p className="font-serif italic text-xl text-pink-200/50 mb-4">Forever yours,</p>
          <div className="inline-block relative">
            <span className="font-script text-4xl text-pink-200/80">{config.yourName}</span>
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 2.5 }}
              className="absolute bottom-0 left-0 h-px bg-pink-300/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <section className="relative z-10 py-16 px-4 text-center">
        <p className="font-script text-2xl text-pink-200/30">Made with love, always — {config.yourName}</p>
      </section>
    </div>
  );
}
