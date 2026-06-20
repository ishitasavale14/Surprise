import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, Check, X } from "lucide-react";
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

  const handleCardClick = (uid: string) => {
    if (flipped.length === 2 || flipped.includes(uid) || matched.includes(uid)) return;
    setFlipped((prev) => [...prev, uid]);
  };

  const resetMemoryGame = () => {
    const doubled = [...gamesConfig.memoryCards, ...gamesConfig.memoryCards].map((c, i) => ({
      ...c,
      uid: `${c.id}-${i}`,
    }));
    setCards(doubled.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setAllMatched(false);
  };

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

  const resetQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setAnswered(false);
    setQuizComplete(false);
    setFeedback(null);
  };

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
      <section className="relative z-10 min-h-[60dvh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="font-script text-6xl md:text-8xl text-primary text-glow mb-4"
        >
          {gamesConfig.heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-serif italic text-xl md:text-2xl text-muted-foreground max-w-xl"
        >
          {gamesConfig.subheading}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="font-serif italic text-xs text-muted-foreground/40 mt-8 tracking-widest uppercase"
        >
          ✦ psst… there might be a few secrets hidden on this page ✦
        </motion.p>
      </section>

      {/* SECTION 2: MEMORY MATCH */}
      <section className="relative z-10 py-16 px-4 max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-script text-4xl md:text-5xl text-primary text-center mb-3"
        >
          Memory Match 🧩
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-serif italic text-center text-muted-foreground mb-10"
        >
          Match the pairs to reveal a little memory
        </motion.p>

        <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-lg mx-auto">
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.uid) || matched.includes(card.uid);
            return (
              <motion.div
                key={card.uid}
                onClick={() => handleCardClick(card.uid)}
                whileHover={{ scale: matched.includes(card.uid) ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="aspect-square cursor-pointer"
                style={{ perspective: "600px" }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Back */}
                  <div
                    className="absolute inset-0 glass-card rounded-xl flex items-center justify-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <Heart className="w-6 h-6 text-primary/30" fill="currentColor" />
                  </div>
                  {/* Front */}
                  <div
                    className={`absolute inset-0 rounded-xl flex items-center justify-center text-2xl md:text-3xl ${matched.includes(card.uid) ? "bg-primary/30" : "glass-card-strong"}`}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    {card.emoji}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {matchMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 glass-card rounded-2xl p-4 text-center max-w-md mx-auto"
            >
              <p className="font-serif italic text-sm text-primary">{matchMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {allMatched && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 text-center"
            >
              <p className="font-script text-3xl text-primary mb-4">You matched them all! ❤️</p>
              <button
                onClick={resetMemoryGame}
                className="px-6 py-3 rounded-full glass-card text-foreground font-serif hover:bg-white/40 transition-colors"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* SECTION 3: QUIZ */}
      <section className="relative z-10 py-16 px-4 max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-script text-4xl md:text-5xl text-primary text-center mb-3"
        >
          Do You Know Us? 💭
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-serif italic text-center text-muted-foreground mb-10"
        >
          A little quiz, just for fun
        </motion.p>

        <div className="glass-card-strong rounded-3xl p-8">
          {!quizComplete ? (
            <>
              <p className="font-serif text-xs text-muted-foreground mb-2 tracking-widest uppercase">
                Question {quizIndex + 1} of {gamesConfig.quizQuestions.length}
              </p>
              <h3 className="font-serif text-xl text-foreground/90 mb-6">
                {gamesConfig.quizQuestions[quizIndex].question}
              </h3>
              <div className="space-y-3">
                {gamesConfig.quizQuestions[quizIndex].options.map((opt, idx) => {
                  const isCorrect = answered && idx === gamesConfig.quizQuestions[quizIndex].correct;
                  const isWrong = answered && idx !== gamesConfig.quizQuestions[quizIndex].correct;
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      whileHover={!answered ? { scale: 1.02 } : {}}
                      disabled={answered}
                      className={`w-full text-left px-5 py-3 rounded-xl font-serif transition-all flex items-center justify-between ${
                        isCorrect ? "bg-primary/30 text-primary" : isWrong ? "bg-destructive/10 text-muted-foreground" : "glass-card hover:bg-white/40"
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && <Check className="w-4 h-4" />}
                      {isWrong && <X className="w-4 h-4 opacity-40" />}
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence>
                {feedback && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-serif italic text-sm text-primary mt-5"
                  >
                    {feedback}
                  </motion.p>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="text-center">
              <p className="font-script text-3xl text-primary mb-3">
                You scored {score} / {gamesConfig.quizQuestions.length} ❤️
              </p>
              <p className="font-serif italic text-muted-foreground mb-6">
                {score === gamesConfig.quizQuestions.length
                  ? "You know us perfectly!"
                  : "Either way — I love you more than any quiz could measure."}
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 rounded-full glass-card text-foreground font-serif hover:bg-white/40 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: ENDING */}
      <section className="relative z-10 py-32 px-4 flex flex-col items-center justify-center text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="font-script text-5xl md:text-6xl text-primary text-glow mb-12 max-w-3xl"
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
