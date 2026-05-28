import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Music, ChevronLeft, Pause } from "lucide-react";
import { useLocation } from "wouter";
import { gamesConfig, config } from "@/config";

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
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number; type: "heart" | "sparkle" }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 100,
      size: Math.random() * 1.2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 15,
      type: (Math.random() > 0.5 ? "heart" : "sparkle") as "heart" | "sparkle"
    }));
    setParticles(newParticles);
  }, []);

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

export default function Games() {
  const [, setLocation] = useLocation();
  const [musicPlaying, setMusicPlaying] = useState(false);
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
  const [catchScore, setCatchScore] = useState(0);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; speed: number; size: number; caught: boolean }>>([]);
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
        onClick={() => setMusicPlaying(!musicPlaying)}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:scale-105 transition-transform"
      >
        {musicPlaying ? <Pause className="w-5 h-5" /> : <Music className="w-5 h-5" />}
      </button>

      {/* SECTION 1: HERO */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="font-script text-5xl md:text-7xl text-primary drop-shadow-[0_0_20px_rgba(255,182,193,0.4)] max-w-4xl"
        >
          {gamesConfig.heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-serif italic text-xl md:text-2xl text-muted-foreground mt-6"
        >
          {gamesConfig.subheading}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-serif italic text-sm text-primary/50 mt-24 tracking-wider"
        >
          ✦ play to unlock hidden surprises ✦
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="font-serif text-xs text-muted-foreground/50 mt-4"
        >
          ✦ There are hidden surprises scattered around… ✦
        </motion.p>
      </section>

      {/* SECTION 2: MEMORY MATCH */}
      <section className="relative z-10 py-32 px-4 flex flex-col items-center text-center max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-4xl text-primary mb-12"
        >
          Memory Match 🌸
        </motion.h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg w-full">
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.uid) || matched.includes(card.uid);
            const isMatched = matched.includes(card.uid);
            return (
              <div 
                key={card.uid}
                onClick={() => {
                  if (isFlipped || flipped.length >= 2) return;
                  setFlipped((p) => [...p, card.uid]);
                }}
                className={`aspect-square glass-card rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-300 ${isMatched ? 'ring-2 ring-primary/60 shadow-[0_0_12px_rgba(255,182,193,0.5)]' : ''}`}
              >
                <AnimatePresence initial={false} mode="wait">
                  {isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-2"
                    >
                      <span className="text-3xl mb-1">{card.emoji}</span>
                      <span className="font-serif text-[10px] sm:text-xs text-foreground leading-tight">{card.label}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-2xl text-primary/40 font-script border border-primary/20 rounded-full w-8 h-8 flex items-center justify-center animate-pulse">?</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {matchMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 glass-card rounded-2xl max-w-sm w-[90%] p-6 z-50 text-center"
            >
              <p className="font-serif italic text-primary">{matchMessage}</p>
              <div className="flex justify-center gap-2 mt-4 text-primary">
                <Heart className="w-4 h-4 fill-current" />
                <Heart className="w-4 h-4 fill-current" />
                <Heart className="w-4 h-4 fill-current" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {allMatched && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 p-6 glass-card rounded-2xl w-full"
            >
              <p className="font-serif italic text-lg text-primary">
                You remembered them all! Just like I remember every moment with you. 🌸
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* SECTION 3: QUIZ */}
      <section className="relative z-10 py-32 px-4 flex flex-col items-center text-center max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-4xl text-primary mb-12"
        >
          How Well Do You Know Us? 💭
        </motion.h2>

        {!quizComplete ? (
          <div className="w-full max-w-xl">
            <div className="h-1 rounded-full bg-primary/30 w-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${(quizIndex / gamesConfig.quizQuestions.length) * 100}%` }}
              />
            </div>
            
            <motion.div
              key={quizIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <p className="font-serif text-xl md:text-2xl text-foreground font-semibold">
                {gamesConfig.quizQuestions[quizIndex].question}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {gamesConfig.quizQuestions[quizIndex].options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.03, borderColor: "rgba(255,182,193,0.4)" }}
                  onClick={() => handleQuizAnswer(idx)}
                  className="glass-card rounded-2xl p-4 text-center font-serif text-foreground cursor-pointer disabled:opacity-50 transition-colors"
                  disabled={answered}
                >
                  {opt}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`font-serif italic p-4 rounded-xl ${feedback === gamesConfig.quizQuestions[quizIndex].correctMsg ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-black/5'}`}
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-8 max-w-lg w-full"
          >
            <p className="font-serif text-lg text-foreground leading-relaxed">
              You know us pretty well! Score: {score}/{gamesConfig.quizQuestions.length}.<br/><br/>
              But the most important thing you know is that I love you endlessly. 💕
            </p>
          </motion.div>
        )}
      </section>

      {/* SECTION 4: HEART CATCH */}
      <section className="relative z-10 py-32 px-4 flex flex-col items-center text-center max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-script text-4xl text-primary mb-2"
        >
          Catch My Heart 💕
        </motion.h2>
        <p className="font-serif italic text-muted-foreground mb-8">
          Tap the floating hearts before they escape!
        </p>

        <div className="relative h-[400px] md:h-[500px] w-full max-w-2xl rounded-3xl glass overflow-hidden mx-auto border border-primary/20">
          {!gameActive && !gameWon && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/50 backdrop-blur-sm">
              <button
                onClick={() => setGameActive(true)}
                className="px-8 py-3 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg shadow-lg transition-transform hover:scale-105"
              >
                Start Game 💕
              </button>
            </div>
          )}

          <div className="absolute top-4 right-6 z-10 font-script text-2xl text-primary bg-white/50 px-4 py-1 rounded-full shadow-sm">
            ❤️ {catchScore} / {gamesConfig.catchTargetScore}
          </div>

          <AnimatePresence>
            {hearts.map((h) => {
              if (h.caught) return null;
              return (
                <motion.div
                  key={h.id}
                  initial={{ y: "100%", opacity: 1 }}
                  animate={{ y: "-20%", opacity: 0 }}
                  transition={{ duration: h.speed, ease: "linear" }}
                  onAnimationComplete={() => {
                    setHearts(prev => prev.filter(heart => heart.id !== h.id));
                  }}
                  className="absolute text-primary cursor-pointer hover:scale-110 active:scale-90 transition-transform"
                  style={{ left: `${h.x}%`, fontSize: `${h.size}rem` }}
                  onClick={() => {
                    setCatchScore(s => s + 1);
                    setHearts(prev => prev.map(heart => heart.id === h.id ? { ...heart, caught: true } : heart));
                  }}
                >
                  <Heart className="fill-current" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-card rounded-2xl max-w-lg mt-8 p-6"
            >
              <p className="font-serif italic text-lg text-primary">
                {gamesConfig.catchUnlockMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

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
            onClick={() => setLocation("/")}
            className="px-8 py-4 rounded-full bg-primary/80 hover:bg-primary text-white font-serif text-lg tracking-wide transition-all shadow-[0_0_15px_rgba(255,182,193,0.4)]"
          >
            {gamesConfig.ctaLabel}
          </button>
          
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
