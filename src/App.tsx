import { HashRouter, Route, Routes } from "react-router-dom";
import { PlayerProvider } from "@/contexts/PlayerContext";
import LibraryPage from "@/pages/LibraryPage";
import NowPlayingPage from "@/pages/NowPlayingPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import BottomNav from "@/components/BottomNav";
import MiniPlayer from "@/components/MiniPlayer";
import { Toaster } from "@/components/ui/toaster";

const App = () => (
  <PlayerProvider>
    <HashRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/playing" element={<NowPlayingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MiniPlayer />
        <BottomNav />
      </div>
      <Toaster />
    </HashRouter>
  </PlayerProvider>
);

export default App;
