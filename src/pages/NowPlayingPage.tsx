import { useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Heart, ChevronDown, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SongCover from "@/components/SongCover";
import ArtworkEditor from "@/components/ArtworkEditor";
import { useArtworkStore } from "@/hooks/useArtworkStore";

const NowPlayingPage = () => {
  const {
    currentSong, isPlaying, currentTime, shuffle, repeat,
    togglePlay, next, previous, seek, toggleShuffle, cycleRepeat,
    toggleFavorite, favorites, allSongs, play,
  } = usePlayer();
  const navigate = useNavigate();
  const [artworkOpen, setArtworkOpen] = useState(false);
  const { getSongArtwork } = useArtworkStore();

  const song = currentSong || allSongs[0];

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const progress = song ? (currentTime / song.duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!song) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(Math.floor(pct * song.duration));
  };

  if (!song) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <p className="text-muted-foreground">No songs in library</p>
      </div>
    );
  }

  const coverSrc = getSongArtwork(song.id) || song.coverUrl;

  return (
    <div className="min-h-screen px-6 pt-4 pb-24 max-w-[430px] mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground">
          <ChevronDown className="w-6 h-6" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Now Playing</span>
        <button onClick={() => setArtworkOpen(true)} className="p-2 -mr-2 text-muted-foreground hover:text-primary transition-colors">
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>

      <motion.div
        className="flex-1 flex items-center justify-center mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        key={song.id}
      >
        <div className="relative">
          <div
            className="absolute inset-0 rounded-3xl blur-3xl opacity-30 scale-110"
            style={{ backgroundImage: `url(${coverSrc})`, backgroundSize: "cover" }}
          />
          <SongCover
            songId={song.id}
            originalUrl={song.coverUrl}
            alt={song.title}
            size="xl"
            className={`relative rounded-3xl shadow-2xl ${isPlaying ? "" : "grayscale-[20%]"}`}
          />
        </div>
      </motion.div>

      <div className="flex items-center justify-between mb-6">
        <div className="min-w-0 flex-1">
          <motion.h2
            key={song.title}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-bold text-foreground truncate"
          >
            {song.title}
          </motion.h2>
          <p className="text-sm text-muted-foreground">{song.artist}</p>
        </div>
        <button onClick={() => toggleFavorite(song.id)} className="p-2">
          <Heart className={`w-6 h-6 ${favorites.has(song.id) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="mb-6">
        <div className="h-1.5 bg-secondary rounded-full cursor-pointer relative" onClick={handleSeek}>
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
          <span className="text-xs text-muted-foreground">{formatTime(song.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 mb-8">
        <button onClick={toggleShuffle} className={`p-2 ${shuffle ? "text-primary" : "text-muted-foreground"}`}>
          <Shuffle className="w-5 h-5" />
        </button>
        <button onClick={previous} className="p-2 text-foreground">
          <SkipBack className="w-7 h-7" />
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { if (!currentSong) play(song); else togglePlay(); }}
          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg"
          style={{ boxShadow: "0 0 30px hsl(64 85% 55% / 0.3)" }}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-primary-foreground" />
          ) : (
            <Play className="w-7 h-7 text-primary-foreground ml-1" />
          )}
        </motion.button>
        <button onClick={next} className="p-2 text-foreground">
          <SkipForward className="w-7 h-7" />
        </button>
        <button onClick={cycleRepeat} className={`p-2 ${repeat !== "off" ? "text-primary" : "text-muted-foreground"}`}>
          {repeat === "one" ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
        </button>
      </div>

      <ArtworkEditor song={song} open={artworkOpen} onClose={() => setArtworkOpen(false)} />
    </div>
  );
};

export default NowPlayingPage;
