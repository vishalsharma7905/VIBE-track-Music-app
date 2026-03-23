export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  coverUrl: string;
  filePath?: string;
}

export interface ListeningRecord {
  songId: string;
  playCount: number;
  totalListenSeconds: number;
  lastPlayed: string;
  sessions: { date: string; seconds: number }[];
}

const covers = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
];

const artists = ["Luna Nova", "Echo Drift", "Midnight Pulse", "Neon Waves", "Crystal Aura", "Velvet Storm", "Solar Flux", "Deep Current"];
const albums = ["Cosmic Drift", "Electric Dreams", "Midnight Sessions", "Neon Horizons", "Crystal Palace", "Velvet Night", "Solar Flares", "Ocean Floor"];
const titles = [
  "Starlight Serenade", "Electric Sunset", "Midnight Rain", "Neon Boulevard",
  "Crystal Memories", "Velvet Thunder", "Solar Wind", "Deep Blue",
  "Cosmic Highway", "Digital Dawn", "Shadow Dance", "Amber Glow",
  "Phantom Waves", "Twilight Run", "Golden Hour", "Silent Storm",
  "Echoes in Time", "Pulse of Light", "Burning Sky", "Frozen Lake",
];

export const mockSongs: Song[] = titles.map((title, i) => ({
  id: `song-${i + 1}`,
  title,
  artist: artists[i % artists.length],
  album: albums[i % albums.length],
  duration: 180 + Math.floor(Math.random() * 120),
  coverUrl: covers[i % covers.length],
}));

// Generate mock listening data
function generateMockStats(): Record<string, ListeningRecord> {
  const stats: Record<string, ListeningRecord> = {};
  const now = new Date();

  mockSongs.forEach((song) => {
    const playCount = Math.floor(Math.random() * 50) + 1;
    const avgListen = song.duration * (0.6 + Math.random() * 0.4);
    const sessions: { date: string; seconds: number }[] = [];

    for (let j = 0; j < playCount; j++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      sessions.push({
        date: d.toISOString(),
        seconds: Math.floor(avgListen * (0.5 + Math.random() * 0.5)),
      });
    }

    stats[song.id] = {
      songId: song.id,
      playCount,
      totalListenSeconds: sessions.reduce((a, s) => a + s.seconds, 0),
      lastPlayed: sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date,
      sessions,
    };
  });

  return stats;
}

export const mockListeningStats = generateMockStats();
