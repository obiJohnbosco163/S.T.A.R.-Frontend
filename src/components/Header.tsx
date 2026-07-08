import { Sun, Moon, Volume2, VolumeX } from "lucide-react";
import { Theme } from "../types";

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  audioActive: boolean;
  onAudioToggle: () => void;
}

export default function Header({ theme, onThemeToggle, audioActive, onAudioToggle }: HeaderProps) {
  // Gentle beep audio function for the technical look-and-feel
  const playBeep = (freq = 800, duration = 0.05) => {
    if (!audioActive) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = freq;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be blocked or unsupported
    }
  };

  const handleAudioToggle = () => {
    onAudioToggle();
    if (!audioActive) {
      // Play brief feedback beep
      setTimeout(() => playBeep(1200, 0.08), 50);
      setTimeout(() => playBeep(1500, 0.1), 150);
    }
  };

  return (
    <header className="w-full max-w-7xl mx-auto px-4 md:px-6 py-3 mt-4 bg-slate-900/40 dark:bg-[#0F1520]/40 backdrop-blur-md border border-slate-200/20 dark:border-[#2DD4BF]/10 rounded-full flex justify-between items-center z-50">
      {/* Brand Logo & Wordmark */}

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full border border-teal-500/30 flex items-center justify-center bg-slate-100 dark:bg-[#0D1C2D] overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-transparent animate-pulse" />
          <img src="assets/star_project_icon_only.png" alt="S.T.A.R. Icon" className="w-full h-full object-cover" />
            
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-semibold tracking-widest text-slate-500 dark:text-[#bacac5]/70 uppercase">
            AI AGENT • CROO NETWORK
          </span>
          <span className="font-sans font-bold tracking-[0.25em] text-slate-800 dark:text-[#d4e4fa] text-sm md:text-base">
            S.T.A.R.
          </span>
        </div>
      </div>

      {/* Center Links (Static Branding) */}
      <div className="hidden md:flex gap-6">
        <span className="text-xs font-semibold text-teal-600 dark:text-[#2DD4BF] tracking-wider uppercase">
          EXPLORE
        </span>
        <span className="text-xs font-semibold text-slate-500 dark:text-[#bacac5] hover:text-teal-500 tracking-wider uppercase cursor-pointer transition-colors">
          NETWORK
        </span>
        <span className="text-xs font-semibold text-slate-500 dark:text-[#bacac5] hover:text-teal-500 tracking-wider uppercase cursor-pointer transition-colors">
          LAYER
        </span>
      </div>

      {/* Controllers: Theme & Audio */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle Button */}
        <button
          onClick={() => {
            onThemeToggle();
            playBeep(900, 0.05);
          }}
          className="p-2 rounded-full border border-slate-200 dark:border-teal-500/15 bg-white/50 dark:bg-[#0d1c2d]/40 text-slate-600 dark:text-[#d4e4fa] hover:text-teal-600 dark:hover:text-[#2DD4BF] hover:bg-teal-500/5 transition-all"
          title={`Toggle ${theme === "dark" ? "Light" : "Dark"} Mode`}
          aria-label="Toggle visual theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Audio Toggle Button */}
        <button
          onClick={handleAudioToggle}
          className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 ${
            audioActive
              ? "bg-teal-500/10 border-teal-500/40 text-teal-600 dark:text-[#2DD4BF]"
              : "bg-slate-200/40 dark:bg-[#1c2b3c]/60 border-slate-300/30 dark:border-teal-500/10 text-slate-500 dark:text-[#bacac5]"
          }`}
          title="Toggle system audio feedback"
        >
          {audioActive ? (
            <Volume2 className="w-4.5 h-4.5" />
          ) : (
            <VolumeX className="w-4.5 h-4.5" />
          )}
          <span className="hidden sm:inline">Audio: {audioActive ? "On" : "Off"}</span>
        </button>
      </div>
    </header>
  );
}
