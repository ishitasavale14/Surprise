import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { gamesConfig, config } from "@/config";
import { useMusicContext } from "@/context/MusicContext";
import FloatingParticles from "@/components/FloatingParticles";
import BokehBackground from "@/components/BokehBackground";

export default function Games() {
  const [, setLocation] = useLocation();
  const { isPlaying, togglePlay } = useMusicContext();
  const [easterEggMessage, setEasterEggMessage] = useState<string | null>(null);

  // Memory Match State
  const [cards, setCards] = useState(() => {
    const doubled = [...gamesConfig.memoryCards, ...gamesConfig.memoryCards].map((c, i) => ({
      ...c,
      uid: `${c.id}-${i}`,
      flipped: false,
      matched: false,
    }));
    return doubled.sort(() => Math.random() - 0.5);
  });
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [matchMessage, setMatchMessage] = useState<string | null>(null);
  const [allMatched, setAllMatched] = useState(false);

  // Memory Match Logic
  useEffect(() => {
    if (flipped.length !== 2) return;
    const card1 = cards.find((c) => c.uid === flipped[0]);
    const card2 = cards.find((c) => c.uid === flipped[1]);
    if (card1 && card2 && card1.id === card2.id) {
      setMatched((prev) => [...prev, flipped[0], flipped[1]]);
      setMatchMessage(card1.matchMessage);
      const to = setTimeout(() => setFlipped([]), 300);
      const msgTo = setTimeout(() => setMatchMessage(null), 3000);
      return () => { clearTimeout(to); clearTimeout(msgTo); };
    } else {
      const to = setTimeout(() => setFlipped([]), 900);
      return () => clearTimeout(to);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setAllMatched(true);
    }
  }, [matched, cards]);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleQuizAnswer = (idx: number) => {
    if (answered || quizComplete) return;
    setAnswered(true);
    const q = gamesConfig.quizQuestions[quizIndex];
    if (idx === q.correct) {
      setScore((s) => s + 1);
      setFeedback(q.correctMsg);
      setTimeout(() => {
        if (quizIndex + 1 < gamesConfig.quizQuestions.length) {
          setQuizIndex(quizIndex + 1);
          setAnswered(false);
          setFeedback(null);
        } else {
          setQuizComplete(true);
        }
      }, 1800);
    } else {
      setFeedback(q.wrongMsg);
      setTimeout(() => {
        setAnswered(false);
        setFeedback(null);
      }, 1800);
    }
  };

  // Catch Hearts State
  const [gameActive, setGameActive] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameActive && !gameWon) {
      spawnRef.current = setInterval(() => {
        setHearts((prev) => [
          ...prev,
          { id: Date.now(), x: Math.random() * 85 + 5, speed: Math.random() * 4 + 3, size: Math.random() * 1.5 + 1, caught: false },
        ]);
      }, 800);
    } else if (spawnRef.current) {
      clearInterval(spawnRef.current);
    }
    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameActive, gameWon]);

  useEffect(() => {
    if (catchScore >= gamesConfig.catchTargetScore) {
      setGameWon(true);
      setGameActive(false);
    }
  }, [catchScore]);

  const handleEasterEgg = (msg: string) => {
    setEasterEggMessage(msg);
    setTimeout(() => setEasterEggMessage(null), 3000);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-animated-gradient overflow-x-hidden relative selection:bg-primary selection:text-white">
      <BokehBackground />
      <FloatingParticles />

      {/* Easter Egg Spots */}
      <div 
        className="absolute top-[30%] left-[5%] w-12 h-12 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer bg-primary/10 z-20"
        onClick={() => handleEasterEgg(gamesConfig.easterEggs[0].message)}
      />
      <div 
        className="absolute top-[60%] right-[8%] w-12 h-12 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer bg-primary/10 z-20"
        onClick={() => handleEasterEgg(gamesConfig.easterEggs[1].message)}
      />
      <div 
        className="absolute top-[80%] left-[15%] w-12 h-12 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer bg-primary/10 z-20"
        onClick={() => handleEasterEgg(gamesConfig.easterEggs[2].message)}
      />

      <AnimatePresence>
        {easterEggMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 glass-card rounded-xl p-4 font-serif italic text-primary max-w-[200px]"
          >
            {easterEggMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed UI */}
      <button 
        onClick={() => setLocation("/future")}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={togglePlay}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        <Heart className="w-5 h-5 text-primary" fill={isPlaying ? "currentColor" : "none"} />
      </button>

      {/* SECTION 1: HERO */}

      {/* SECTION 6: ENDING */}
      <section className="relative z-10 py-32 px-4 flex flex-col items-center justify-center text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="font-script text-5xl md:text-6xl text-primary animate-pulse drop-shadow-[0_0_15px_rgba(255,182,193,0.4)] mb-12 max-w-3xl"
        >
          {gamesConfig.endingText}
        </motion.h2>

        <div className="flex flex-col sm:flex-row gap-4">
          
          <button
            onClick={() => setLocation("/gallery")}
            className="px-8 py-4 rounded-full glass-card text-foreground font-serif text-lg transition-colors hover:bg-white/40"
          >
            Photo Gallery →
          </button>
        </div>

        <p className="font-script text-2xl text-foreground/60 mt-24">
          Made with love by {config.yourName}
        </p>
      </section>
    </div>
  );
}
