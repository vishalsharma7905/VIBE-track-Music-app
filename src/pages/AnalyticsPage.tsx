import { useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Clock, Music, TrendingUp, Headphones } from "lucide-react";
import SongCover from "@/components/SongCover";

const AnalyticsPage = () => {
  const { listeningStats, allSongs } = usePlayer();

  const totalSeconds = useMemo(
    () => Object.values(listeningStats).reduce((a, s) => a + s.totalListenSeconds, 0),
    [listeningStats]
  );

  const topSongs = useMemo(() => {
    return Object.values(listeningStats)
      .sort((a, b) => b.totalListenSeconds - a.totalListenSeconds)
      .slice(0, 10)
      .map((stat) => ({
        ...stat,
        song: allSongs.find((s) => s.id === stat.songId)!,
      }));
  }, [listeningStats, allSongs]);

  const topArtists = useMemo(() => {
    const map = new Map<string, number>();
    Object.values(listeningStats).forEach((stat) => {
      const song = allSongs.find((s) => s.id === stat.songId);
      if (song) map.set(song.artist, (map.get(song.artist) || 0) + stat.totalListenSeconds);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [listeningStats, allSongs]);

  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((d) => ({ day: d, minutes: Math.floor(Math.random() * 120 + 15) }));
  }, []);

  const monthlyData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({ day: i + 1, minutes: Math.floor(Math.random() * 90 + 5) }));
  }, []);

  const formatHours = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const stats = [
    { icon: Clock, label: "Total Listened", value: formatHours(totalSeconds), color: "text-primary" },
    { icon: Music, label: "Songs Played", value: Object.keys(listeningStats).length.toString(), color: "text-primary" },
    { icon: TrendingUp, label: "Avg Daily", value: formatHours(Math.floor(totalSeconds / 90)), color: "text-primary" },
    { icon: Headphones, label: "Top Genre", value: "Electronic", color: "text-primary" },
  ];

  return (
    <div className="pb-36 pt-4 px-4 max-w-[430px] mx-auto">
      <h1 className="text-3xl font-extrabold text-foreground mb-1">Insights</h1>
      <p className="text-sm text-muted-foreground mb-6">Your listening habits</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-4 border border-border"
          >
            <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-4 border border-border mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Weekly Listening</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="day" tick={{ fill: "hsl(240,4%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "hsl(240,5%,14%)", border: "1px solid hsl(240,4%,22%)", borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: "hsl(0,0%,95%)" }}
              itemStyle={{ color: "hsl(64,85%,55%)" }}
            />
            <Bar dataKey="minutes" fill="hsl(64,85%,55%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-2xl p-4 border border-border mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="day" tick={{ fill: "hsl(240,4%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "hsl(240,5%,14%)", border: "1px solid hsl(240,4%,22%)", borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: "hsl(0,0%,95%)" }}
              itemStyle={{ color: "hsl(64,85%,55%)" }}
            />
            <Line type="monotone" dataKey="minutes" stroke="hsl(64,85%,55%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-3">Top Songs</h3>
      <div className="space-y-2 mb-6">
        {topSongs.map((item, i) => (
          <motion.div
            key={item.songId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
          >
            <span className="text-sm font-bold text-primary w-6 text-center">{i + 1}</span>
            <SongCover songId={item.song.id} originalUrl={item.song.coverUrl} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{item.song.title}</p>
              <p className="text-xs text-muted-foreground">{item.song.artist}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground">{item.playCount} plays</p>
              <p className="text-[10px] text-muted-foreground">{formatHours(item.totalListenSeconds)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-bold text-foreground mb-3">Top Artists</h3>
      <div className="space-y-2">
        {topArtists.map(([name, seconds], i) => (
          <div key={name} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
            <span className="text-sm font-bold text-primary w-6 text-center">{i + 1}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">{formatHours(seconds)} listened</p>
            </div>
            <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(seconds / topArtists[0][1]) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
