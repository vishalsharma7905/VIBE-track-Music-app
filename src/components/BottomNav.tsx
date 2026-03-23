import { useLocation, useNavigate } from "react-router-dom";
import { Music, BarChart3, Settings, Library } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: Library, label: "Library" },
  { path: "/playing", icon: Music, label: "Playing" },
  { path: "/analytics", icon: BarChart3, label: "Stats" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[430px] px-4 pb-2">
        <div className="flex items-center justify-around rounded-2xl bg-card/80 backdrop-blur-xl border border-border p-2">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-primary/15"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon
                  className={`w-5 h-5 relative z-10 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-[10px] font-semibold relative z-10 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
