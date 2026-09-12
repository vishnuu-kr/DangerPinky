import React from 'react';
import { BookOpen, Gamepad2, Github, ExternalLink, Sparkles, Heart } from 'lucide-react';

interface NavbarProps {
  currentScreen: 'LANDING' | 'JOURNAL';
  onNavigate: (screen: 'LANDING' | 'JOURNAL') => void;
  onPlayGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onPlayGame,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto px-4 py-3 sticky top-0 z-40 backdrop-blur-xl bg-slate-950/75 border-b border-pink-500/20 rounded-b-2xl transition-all duration-200">
      <div className="flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate('LANDING')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center shadow-md shadow-pink-500/30 group-hover:scale-105 transition-transform">
            <span className="text-xl select-none">🎯</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-game font-bold text-lg bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                DangerPinky
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Useless v3
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline-block">
              Pinky Gesture • Russian Roulette Filesystem
            </span>
          </div>
        </button>

        {/* Center Nav Switcher */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-full border border-slate-800 shadow-inner">
          <button
            onClick={() => onNavigate('LANDING')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-game font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentScreen === 'LANDING'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Game Hub</span>
          </button>

          <button
            onClick={() => onNavigate('JOURNAL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-game font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentScreen === 'JOURNAL'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dev Journal</span>
            <span className="hidden md:inline-flex px-1.5 py-0.2 bg-white/20 rounded-full text-[9px] font-mono">
              Build Story
            </span>
          </button>
        </nav>

        {/* Right Action Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayGame}
            className="hidden sm:flex btn-candy-pink px-4 py-1.5 rounded-full text-xs font-game font-bold items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Play Now</span>
          </button>

          <a
            href="https://github.com/vishnuu-kr/DangerPinky"
            target="_blank"
            rel="noopener noreferrer"
            title="View DangerPinky on GitHub"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href="https://tinkerhub.org/events/1M8ORET9A1/useless-projects-3.0"
            target="_blank"
            rel="noopener noreferrer"
            title="TinkerHub Useless Projects 3.0"
            className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl transition-colors"
          >
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
            <span>TinkerHub</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
};
