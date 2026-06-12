import { createContext, useContext, useState, useRef, useEffect } from "react";
import { config } from "@/config";

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  isMuted: false,
  volume: 0.5,
  togglePlay: () => {},
  toggleMute: () => {},
  setVolume: () => {},
});

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    const audio = new Audio(config.musicSrc);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted((prev) => !prev);
  };

  const setVolume = (v: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = v;
    setVolumeState(v);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusicContext = () => useContext(MusicContext);
