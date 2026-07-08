import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Theme } from "./types";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("star-theme");
    return (saved as Theme) || "dark";
  });

  // Sync theme with HTML document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("star-theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // --- PREMIUM AMBIENT SYNTH AUDIO ENGINE ---
  const [ambientActive, setAmbientActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and clean up background music
  useEffect(() => {
    const audio = new Audio("/assets/1001141003-1.mp3");
    audio.loop = true;
    audio.volume = 0.45; // Pleasant level
    bgMusicRef.current = audio;

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  const startAmbientHum = () => {
    // 1. Play Background Music
    if (bgMusicRef.current) {
      bgMusicRef.current.play().catch((err) => {
        console.warn("Background music autoplay was blocked or failed:", err);
      });
    }

    // 2. Play Synthesizer Drone
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.015, ctx.currentTime); // Soft drone overlay
      mainGain.connect(ctx.destination);
      gainNodeRef.current = mainGain;

      // Create complex drone/hum at 55Hz (A1) and harmonics
      const frequencies = [55, 110, 165, 220];
      const oscillators = frequencies.map((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.type = idx === 0 ? "sawtooth" : "sine";
        
        osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);

        const gainVal = idx === 0 ? 0.4 : 0.2 / idx;
        oscGain.gain.setValueAtTime(gainVal, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(mainGain);
        return osc;
      });

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.setValueAtTime(4, ctx.currentTime);
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
      lfoGain.gain.setValueAtTime(100, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      oscillators.forEach((osc) => {
        osc.disconnect();
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(frequencies.indexOf(osc.frequency.value) === 0 ? 0.3 : 0.1, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(filter);
      });
      filter.connect(mainGain);

      oscillators.forEach((osc) => osc.start());
      lfo.start();
      oscillatorsRef.current = oscillators;
    } catch (e) {
      console.warn("Ambient hum synthesis is not supported or blocked by browser policies.");
    }
    setAmbientActive(true);
  };

  const stopAmbientHum = () => {
    // 1. Pause Background Music
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }

    // 2. Stop Synthesizer Drone
    try {
      oscillatorsRef.current.forEach((osc) => osc.stop());
      oscillatorsRef.current = [];
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      // Ignored
    }
    setAmbientActive(false);
  };

  const toggleAmbientHum = () => {
    if (ambientActive) {
      stopAmbientHum();
    } else {
      startAmbientHum();
    }
  };

  // Clean up audio nodes on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch (e) {}
      });
    };
  }, []);

  return (
    <div className={`min-h-screen relative flex flex-col items-center select-none overflow-x-hidden font-sans transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-[#0A0E14] text-[#d4e4fa] blueprint-grid" 
        : "bg-[#F8FAFC] text-slate-800 blueprint-grid-light"
    }`}>
      {/* Decorative Scanline */}
      <div className={theme === "dark" ? "scanline pointer-events-none" : "scanline-light pointer-events-none"} />

      {/* Fixed/Sticky Top Navigation Header */}
      <div className="w-full px-4 z-40">
        <Header 
          theme={theme} 
          onThemeToggle={handleThemeToggle} 
          audioActive={ambientActive}
          onAudioToggle={toggleAmbientHum}
        />
      </div>

      {/* Main Container */}
      <main className="w-full max-w-7xl px-4 md:px-6 flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-16 py-12 lg:py-20 z-20">
        
        {/* Left Column: Copy & Actions */}
        <div className="flex-1 flex flex-col items-start gap-6 max-w-[620px]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5">
            <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-[#2DD4BF] animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold text-teal-600 dark:text-[#2DD4BF] uppercase tracking-widest">
              Listed and online on Croo Network
            </span>
          </div>

          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight leading-tight ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}>
            Meet the intelligence layer that turns prospect insight into momentum.
          </h1>

          <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-[#bacac5]/90">
            S.T.A.R. is a sleek AI agent that helps teams understand companies, shape smarter outreach, and move from research to action faster.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4 w-full sm:w-auto">
            {/* Direct Redirect Button: Redirects to the AI Agent UI in Croo Network */}
            <a
              href="https://agent.croo.network/agents/888b2e91-245a-4776-b6aa-9e6fc1654a21"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 btn-primary text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 select-none cursor-pointer hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] dark:hover:shadow-[0_0_25px_rgba(45,212,191,0.45)]"
            >
              <span>Use Agent</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Ambient Sound Trigger Button */}
            <button
              onClick={toggleAmbientHum}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-full border text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 group cursor-pointer ${
                ambientActive
                  ? "bg-teal-500/15 border-teal-500/50 text-teal-600 dark:text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                  : "bg-slate-100 dark:bg-[#0d1c2d]/40 border-slate-300/30 dark:border-teal-500/10 text-slate-600 dark:text-[#bacac5] hover:border-teal-500/40"
              }`}
            >
              <span>Ambient sound</span>
              <span className={`text-[10px] ${ambientActive ? "text-teal-600 dark:text-[#2DD4BF]" : "text-slate-400 dark:text-[#bacac5]/40"}`}>
                {ambientActive ? "live" : "off"}
              </span>
              <div className="flex gap-0.5 items-end h-3 pl-1">
                <div className={`w-0.75 h-2 bg-teal-500/50 rounded-full ${ambientActive ? "animate-[bounce_0.8s_infinite_0s]" : ""}`} />
                <div className={`w-0.75 h-3 bg-teal-500 rounded-full ${ambientActive ? "animate-[bounce_0.8s_infinite_0.15s]" : ""}`} />
                <div className={`w-0.75 h-1.5 bg-teal-500/50 rounded-full ${ambientActive ? "animate-[bounce_0.8s_infinite_0.3s]" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Visual HUD Mockup */}
        <div className="flex-1 w-full max-w-[540px] relative">
          {/* Subtle background drafting grid effect */}
          <div className="absolute -top-6 -right-6 w-48 h-48 border-t border-r border-teal-500/10 rounded-tr-2xl pointer-events-none" />
          
          <div className="glass-card shadow-2xl p-5 md:p-6 flex flex-col gap-5 relative overflow-hidden group">
            
            {/* Header of HUD */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/40 dark:border-[#2DD4BF]/10">
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#bacac5]/70 uppercase">
                AGENT EXPERIENCE
              </span>
              <div className="px-2.5 py-0.5 rounded-full bg-teal-500/10 dark:bg-[#2DD4BF]/10 border border-teal-500/35 dark:border-[#2DD4BF]/30">
                <span className="text-[9px] font-bold text-teal-600 dark:text-[#2DD4BF] tracking-widest uppercase">
                  LIVE
                </span>
              </div>
            </div>

            {/* Radar View Screen */}
            <div className="aspect-video w-full rounded-lg bg-slate-900/90 dark:bg-[#051424]/90 overflow-hidden border border-slate-200/50 dark:border-teal-500/10 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent" />
              
              {/* Decorative Crosshairs & Coordinates Grid */}
              <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-teal-500" />
                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-teal-500" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-teal-500 rounded-full" />
              </div>

              {/* Pulsing Target Star */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <svg className="w-16 h-16 text-teal-600 dark:text-[#2DD4BF] animate-[pulse_2s_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>

            {/* Features Status Indicators */}
            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0d1c2d]/40 border border-slate-200/40 dark:border-teal-500/5 flex justify-between items-center transition-all hover:border-teal-500/20">
                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-[#d4e4fa]">
                  Research with context
                </span>
                <CheckCircle2 className="w-4.5 h-4.5 text-teal-600 dark:text-[#2DD4BF]" />
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0d1c2d]/40 border border-slate-200/40 dark:border-teal-500/5 flex justify-between items-center transition-all hover:border-teal-500/20">
                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-[#d4e4fa]">
                  Deliver crisp next steps
                </span>
                <CheckCircle2 className="w-4.5 h-4.5 text-teal-600 dark:text-[#2DD4BF]" />
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0d1c2d]/40 border border-slate-200/40 dark:border-teal-500/5 flex justify-between items-center transition-all hover:border-teal-500/20">
                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-[#d4e4fa]">
                  Launch with confidence
                </span>
                <CheckCircle2 className="w-4.5 h-4.5 text-teal-600 dark:text-[#2DD4BF]" />
              </div>
            </div>

            {/* Bottom HUD Metadata */}
            <div className="flex justify-between items-center font-mono text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-500/50 uppercase border-t border-slate-200/40 dark:border-[#2DD4BF]/10 pt-3">
              <span>LAT: 34.0522 • LONG: -118.2437</span>
              <span>CORE VERSION 2.0.44-BETA</span>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

