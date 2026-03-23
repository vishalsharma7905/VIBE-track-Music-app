import { useState } from "react";
import { Moon, Volume2, Timer, Gauge, Info } from "lucide-react";

const SettingsPage = () => {
  const [sleepTimer, setSleepTimer] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const timerOptions = [0, 15, 30, 45, 60, 90];

  return (
    <div className="pb-36 pt-4 px-4 max-w-[430px] mx-auto">
      <h1 className="text-3xl font-extrabold text-foreground mb-6">Settings</h1>

      <div className="space-y-3">
        {/* Sleep Timer */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Timer className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Sleep Timer</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {timerOptions.map((t) => (
              <button
                key={t}
                onClick={() => setSleepTimer(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  sleepTimer === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {t === 0 ? "Off" : `${t}m`}
              </button>
            ))}
          </div>
        </div>

        {/* Playback Speed */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Gauge className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Playback Speed</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  playbackSpeed === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-primary" />
            <div>
              <span className="text-sm font-semibold text-foreground">VibeTrack</span>
              <p className="text-xs text-muted-foreground">v1.0.0 — Your music, your stats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
