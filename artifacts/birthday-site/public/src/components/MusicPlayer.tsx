import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronDown, ChevronUp, Music2 } from "lucide-react";
import { useState } from "react";
import { useMusicContext } from "@/context/MusicContext";
import { config as musicConfig } from "@/config";

export default function MusicPlayer() {
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume } = useMusicContext();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 2, duration: 0.7, type: "spring" }}
    >
      <motion.div
        className="glass-card-strong rounded-2xl overflow-hidden shadow-xl"
        animate={{ width: expanded ? 260 : 64, height: expanded ? 160 : 64 }}
        transition={{ type: "spring", damping: 22, stiffness: 220 }}
      >
        {/* Collapsed state */}
        <AnimatePresence>
          {!expanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(true)}
              className="w-16 h-16 flex items-center justify-center relative"
            >
              {/* Vinyl disc */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 border border-primary/30 flex items-center justify-center"
              >
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </motion.div>
              {/* Pulse ring when playing */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-2xl border border-primary/30 animate-ping opacity-30" />
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Expanded state */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
              className="p-4 flex flex-col gap-3 h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-primary/70" />
                  <div>
                    <p className="font-serif text-xs font-medium text-foreground/80 leading-tight">
                      {musicConfig.songTitle}
                    </p>
                    <p className="font-serif text-[10px] text-muted-foreground">
                      {musicConfig.artist}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <ChevronDown className="w-3 h-3 text-primary" />
                </button>
              </div>

              {/* Waveform bars */}
              <div className="flex items-center justify-center gap-[3px] h-8">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-primary/60"
                    animate={isPlaying ? {
                      height: ["4px", `${Math.random() * 20 + 6}px`, "4px"],
                    } : { height: "4px" }}
                    transition={{
                      duration: 0.6 + Math.random() * 0.4,
                      repeat: Infinity,
                      delay: i * 0.05,
                      ease: "easeInOut",
                    }}
                    style={{ height: "4px" }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center transition-colors glow-primary-sm flex-shrink-0"
                >
                  {isPlaying
                    ? <Pause className="w-4 h-4 text-white" />
                    : <Play className="w-4 h-4 text-white ml-0.5" />
                  }
                </button>

                <button onClick={toggleMute} className="hover:opacity-70 transition-opacity flex-shrink-0">
                  {isMuted
                    ? <VolumeX className="w-4 h-4 text-primary/60" />
                    : <Volume2 className="w-4 h-4 text-primary/60" />
                  }
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-pink-400 cursor-pointer h-1"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Playing dot indicator */}
      {isPlaying && !expanded && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.div>
  );
}
