import { useState } from "react";
import { MoreVertical, Play, Heart, ImageIcon, Info } from "lucide-react";
import { Song } from "@/data/mockSongs";
import { usePlayer } from "@/contexts/PlayerContext";
import ArtworkEditor from "./ArtworkEditor";
import { motion, AnimatePresence } from "framer-motion";

interface SongMenuProps {
  song: Song;
  children?: React.ReactNode;
}

const SongMenu = ({ song, children }: SongMenuProps) => {
  const [open, setOpen] = useState(false);
  const [artworkOpen, setArtworkOpen] = useState(false);
  const { play, toggleFavorite, favorites } = usePlayer();

  const menuItems = [
    { icon: Play, label: "Play", action: () => { play(song); setOpen(false); } },
    {
      icon: Heart,
      label: favorites.has(song.id) ? "Unfavorite" : "Favorite",
      action: () => { toggleFavorite(song.id); setOpen(false); },
    },
    { icon: ImageIcon, label: "Edit Artwork", action: () => { setOpen(false); setArtworkOpen(true); } },
    { icon: Info, label: "Song Info", action: () => setOpen(false) },
  ];

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        {children || <MoreVertical className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[430px] bg-card rounded-t-3xl border border-border p-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Song info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <img src={song.coverUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist} • {song.album}</p>
                </div>
              </div>

              {/* Menu items */}
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ArtworkEditor song={song} open={artworkOpen} onClose={() => setArtworkOpen(false)} />
    </>
  );
};

export default SongMenu;
