import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { useState } from "react";
import { useMusicContext } from "@/context/MusicContext";

export default function MusicPlayer() {
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume } = useMusicContext();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      <motion.div
        className="glass-card rounded-2xl overflow-hidden shadow-lg"
        animate={{ width: expanded ? 230 : 56 }}
        transition={{ type: "spring", damping: 22, stiffness: 200 }}
        style={{ height: 56 }}
      >
        <div className="flex items-center gap-2 px-3 h-[56px] min-w-0">
          <button
            onClick={togglePlay}
            className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-primary" />
            ) : (
              <Music className="w-4 h-4 text-primary" />
            )}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                className="flex items-center gap-2 overflow-hidden"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-serif text-xs text-muted-foreground whitespace-nowrap">
                  {isPlaying ? "♪ Playing…" : "Paused"}
                </span>
                <button
                  onClick={toggleMute}
                  className="shrink-0 hover:opacity-70 transition-opacity"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-primary/60" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-primary/60" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 accent-pink-300 cursor-pointer"
                  aria-label="Volume"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center ml-auto text-primary/50 hover:text-primary transition-colors text-[10px] font-bold"
            aria-label={expanded ? "Collapse player" : "Expand player"}
          >
            {expanded ? "✕" : "♫"}
          </button>
        </div>
      </motion.div>

      {isPlaying && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.div>
  );
}
