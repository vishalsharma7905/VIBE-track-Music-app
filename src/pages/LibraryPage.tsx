import { useState, useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Search, Heart } from "lucide-react";
import { motion } from "framer-motion";
import SongCover from "@/components/SongCover";
import SongMenu from "@/components/SongMenu";

type Tab = "songs" | "albums" | "artists";

const LibraryPage = () => {
  const { allSongs, play, favorites, toggleFavorite, currentSong, isPlaying } = usePlayer();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("songs");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allSongs.filter(
      (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.album.toLowerCase().includes(q)
    );
  }, [search, allSongs]);

  const albums = useMemo(() => {
    const map = new Map<string, typeof allSongs>();
    filtered.forEach((s) => {
      if (!map.has(s.album)) map.set(s.album, []);
      map.get(s.album)!.push(s);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const artists = useMemo(() => {
    const map = new Map<string, typeof allSongs>();
    filtered.forEach((s) => {
      if (!map.has(s.artist)) map.set(s.artist, []);
      map.get(s.artist)!.push(s);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="pb-36 pt-4 px-4 max-w-[430px] mx-auto">
      <h1 className="text-3xl font-extrabold text-foreground mb-1">Library</h1>
      <p className="text-sm text-muted-foreground mb-4">{allSongs.length} tracks</p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search songs, artists, albums..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex gap-2 mb-4">
        {(["songs", "albums", "artists"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "songs" && (
        <div className="space-y-1">
          {filtered.map((song, i) => {
            const active = currentSong?.id === song.id;
            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => play(song)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  active ? "bg-primary/10" : "hover:bg-card"
                }`}
              >
                <div className="relative">
                  <SongCover songId={song.id} originalUrl={song.coverUrl} alt={song.title} size="md" />
                  {active && isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg">
                      <div className="flex gap-0.5 items-end h-4">
                        {[1, 2, 3].map((b) => (
                          <motion.div
                            key={b}
                            className="w-1 bg-primary rounded-full"
                            animate={{ height: ["4px", "16px", "8px", "14px", "4px"] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${active ? "text-primary" : "text-foreground"}`}>{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground">{formatTime(song.duration)}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                  className="p-1"
                >
                  <Heart className={`w-4 h-4 ${favorites.has(song.id) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </button>
                <SongMenu song={song} />
              </motion.div>
            );
          })}
        </div>
      )}

      {tab === "albums" && (
        <div className="grid grid-cols-2 gap-3">
          {albums.map(([name, songs]) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => play(songs[0])}
              className="bg-card rounded-xl p-3 cursor-pointer hover:bg-surface-hover transition-colors"
            >
              <SongCover songId={songs[0].id} originalUrl={songs[0].coverUrl} alt={name} size="lg" className="mb-2" />
              <p className="text-sm font-semibold text-foreground truncate">{name}</p>
              <p className="text-xs text-muted-foreground">{songs.length} songs</p>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "artists" && (
        <div className="space-y-2">
          {artists.map(([name, songs]) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => play(songs[0])}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-card transition-colors"
            >
              <SongCover songId={songs[0].id} originalUrl={songs[0].coverUrl} alt={name} size="md" className="rounded-full" />
              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">{songs.length} tracks</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
