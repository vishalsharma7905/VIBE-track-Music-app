import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Song, mockSongs, mockListeningStats, ListeningRecord } from "@/data/mockSongs";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  queue: Song[];
  listeningStats: Record<string, ListeningRecord>;
  favorites: Set<string>;
}

interface PlayerContextType extends PlayerState {
  play: (song: Song) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleFavorite: (id: string) => void;
  setQueue: (songs: Song[]) => void;
  allSongs: Song[];
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");
  const [queue, setQueue] = useState<Song[]>(mockSongs);
  const [listeningStats] = useState<Record<string, ListeningRecord>>(mockListeningStats);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentSong) {
      timerRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= (currentSong?.duration || 0)) {
            next();
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, currentSong]);

  const play = useCallback((song: Song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const getNextIndex = useCallback(() => {
    if (!currentSong) return 0;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    if (shuffle) return Math.floor(Math.random() * queue.length);
    return (idx + 1) % queue.length;
  }, [currentSong, queue, shuffle]);

  const next = useCallback(() => {
    if (repeat === "one" && currentSong) {
      setCurrentTime(0);
      return;
    }
    const nextIdx = getNextIndex();
    setCurrentSong(queue[nextIdx]);
    setCurrentTime(0);
  }, [getNextIndex, queue, repeat, currentSong]);

  const previous = useCallback(() => {
    if (currentTime > 3) {
      setCurrentTime(0);
      return;
    }
    if (!currentSong) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    const prevIdx = idx <= 0 ? queue.length - 1 : idx - 1;
    setCurrentSong(queue[prevIdx]);
    setCurrentTime(0);
  }, [currentSong, queue, currentTime]);

  const seek = useCallback((time: number) => setCurrentTime(time), []);
  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong, isPlaying, currentTime, shuffle, repeat, queue, listeningStats, favorites,
        play, togglePlay, next, previous, seek, toggleShuffle, cycleRepeat, toggleFavorite, setQueue,
        allSongs: mockSongs,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
