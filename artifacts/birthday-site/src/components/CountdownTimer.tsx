import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { countdownConfig } from "@/config";

function TimeUnit({ value, label, delay }: { value: number; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className="flex flex-col items-center"
    >
      <div className="glass-card-strong rounded-2xl w-20 h-20 md:w-28 md:h-28 flex items-center justify-center relative overflow-hidden group">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-primary/5"
        />
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="font-serif text-3xl md:text-5xl font-semibold text-primary relative z-10 text-glow"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <p className="font-serif italic text-muted-foreground text-sm mt-3 tracking-wide">{label}</p>
    </motion.div>
  );
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const target = new Date(countdownConfig.targetDate).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setIsPast(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative py-24 px-4 flex flex-col items-center text-center z-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="font-script text-5xl md:text-6xl text-primary text-glow mb-4"
      >
        {countdownConfig.title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="font-serif italic text-muted-foreground text-lg max-w-lg mb-14"
      >
        {countdownConfig.subtitle}
      </motion.p>

      {isPast ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card-strong rounded-3xl p-10 max-w-md"
        >
          <Heart className="w-16 h-16 text-primary mx-auto mb-4 animate-heartbeat" fill="currentColor" />
          <p className="font-script text-4xl text-primary mb-4">It's your birthday! 🎂</p>
          <p className="font-serif italic text-muted-foreground">{countdownConfig.message}</p>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center gap-4 md:gap-8">
            <TimeUnit value={timeLeft.days}    label="Days"    delay={0} />
            <span className="font-script text-4xl text-primary/50 mt-[-1.5rem] animate-pulse">:</span>
            <TimeUnit value={timeLeft.hours}   label="Hours"   delay={0.1} />
            <span className="font-script text-4xl text-primary/50 mt-[-1.5rem] animate-pulse">:</span>
            <TimeUnit value={timeLeft.minutes} label="Minutes" delay={0.2} />
            <span className="font-script text-4xl text-primary/50 mt-[-1.5rem] animate-pulse">:</span>
            <TimeUnit value={timeLeft.seconds} label="Seconds" delay={0.3} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl max-w-lg mt-12 px-8 py-6 flex items-center gap-4"
          >
            <Heart className="w-6 h-6 text-primary flex-shrink-0 animate-heartbeat" fill="currentColor" />
            <p className="font-serif italic text-foreground/80 text-left leading-relaxed">
              {countdownConfig.message}
            </p>
          </motion.div>
        </>
      )}
    </motion.section>
  );
}
