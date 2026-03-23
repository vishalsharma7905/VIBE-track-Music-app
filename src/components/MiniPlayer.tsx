import { usePlayer } from "@/contexts/PlayerContext";
import { Play, Pause, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SongCover from "@/components/SongCover";

const MiniPlayer = () => {
  const { currentSong, isPlaying, togglePlay, next, currentTime } = usePlayer();
  const navigate = useNavigate();

  if (!currentSong) return null;

  const progress = currentSong.duration > 0 ? (currentTime / currentSong.duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        exit={{ y: 80 }}
        className="fixed bottom-[76px] left-0 right-0 z-40"
      >
        <div className="mx-auto max-w-[430px] px-4">
          <div
            className="relative overflow-hidden rounded-2xl bg-card/90 backdrop-blur-xl border border-border cursor-pointer"
            onClick={() => navigate("/playing")}
          >
            <div className="absolute top-0 left-0 h-[2px] bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
            <div className="flex items-center gap-3 p-3">
              <SongCover
                songId={currentSong.id}
                originalUrl={currentSong.coverUrl}
                alt={currentSong.title}
                size="sm"
                className={isPlaying ? "animate-pulse-glow" : ""}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{currentSong.title}</p>
                <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button onClick={togglePlay} className="p-2 rounded-full bg-primary text-primary-foreground">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button onClick={next} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniPlayer;
