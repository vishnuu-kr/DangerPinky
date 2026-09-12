import React from 'react';
import { Play, Flame, FolderOpen, ShieldCheck, Sparkles, Video, Crown, Heart, ArrowRight, BookOpen } from 'lucide-react';

interface LandingScreenProps {
  onStartWithCamera: () => void;
  onStartDemo: () => void;
  onOpenFolderPicker: () => void;
  onSelectRealFiles: () => void;
  onOpenJournal: () => void;
  isDesktop?: boolean;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartWithCamera,
  onStartDemo,
  onOpenFolderPicker,
  onSelectRealFiles,
  onOpenJournal,
  isDesktop = false
}) => {
  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-8 text-center max-w-5xl mx-auto select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Cute Pill Badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/85 border border-pink-500/30 text-xs font-semibold text-slate-200 backdrop-blur-md mb-5 shadow-lg">
        <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span className="bg-gradient-to-r from-pink-400 to-rose-300 bg-clip-text text-transparent font-bold tracking-wide">
          DangerPinky
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-pink-300 flex items-center gap-1">
          <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> Pinky Gesture Controlled
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-emerald-400 font-medium">
          {isDesktop ? 'OS Recycle Bin Active' : 'Safe Web Mode'}
        </span>
      </div>

      {/* Hero Banner Card */}
      <div className="w-full max-w-4xl bg-slate-950/80 rounded-3xl overflow-hidden border-2 border-pink-500/30 shadow-2xl backdrop-blur-md mb-8 group hover:border-pink-500/50 transition-all duration-300">
        <div className="relative w-full aspect-[2.6/1] overflow-hidden bg-emerald-950/40 flex items-center justify-center">
          <img
            src="/images/danger_pinky_banner.png"
            alt="DangerPinky — The Cute Snake, The Real Danger!"
            className="w-full h-full object-cover object-center select-none pointer-events-none transform group-hover:scale-[1.01] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Subtitle & Tagline */}
      <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
        Control the cute pink snake with your <strong className="text-pink-400 font-bold underline decoration-pink-500/50 underline-offset-4">pinky finger</strong>.
        Eat safe demo fruit, or brave <strong className="text-amber-400 font-bold underline decoration-amber-500/50 underline-offset-4">Danger Mode</strong> with your own real files!
      </p>

      {/* Primary 3D Candy Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-xl mb-10">
        {/* Play Demo Candy Button (Pink) */}
        <button
          onClick={onStartDemo}
          className="btn-candy-pink w-full sm:w-1/2 py-4 px-6 rounded-full font-game text-xl sm:text-2xl font-black flex items-center justify-center gap-3 cursor-pointer group"
          title="Play safely with demo mock files (no real files modified)"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
          <span>Play Demo</span>
        </button>

        {/* Danger Mode Candy Button (Golden Amber) */}
        <button
          onClick={onSelectRealFiles}
          className="btn-candy-gold w-full sm:w-1/2 py-4 px-6 rounded-full font-game text-xl sm:text-2xl font-black flex items-center justify-center gap-3 cursor-pointer group"
          title="Play with real files from a selected folder (eaten files moved to Recycle Bin)"
        >
          <div className="w-8 h-8 rounded-full bg-amber-600/25 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Flame className="w-5 h-5 text-rose-600 fill-amber-500 animate-bounce-gentle" />
          </div>
          <span>Danger Mode</span>
        </button>
      </div>

      {/* Secondary Utility Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl mb-10">
        <button
          onClick={onStartWithCamera}
          className="btn-candy-pill px-4 py-2 rounded-full text-xs font-semibold text-pink-300 hover:text-white flex items-center gap-2 cursor-pointer"
        >
          <Video className="w-3.5 h-3.5 text-pink-400" />
          <span>Pinky Cam Setup & Calibrate</span>
        </button>

        <button
          onClick={onOpenFolderPicker}
          className="btn-candy-pill px-4 py-2 rounded-full text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-2 cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Browse Demo Files</span>
        </button>

        <button
          onClick={onOpenJournal}
          className="btn-candy-pill px-4 py-2 rounded-full text-xs font-semibold text-amber-300 hover:text-white flex items-center gap-2 cursor-pointer border-amber-500/40"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Read Dev Journal</span>
        </button>
      </div>

      {/* Feature Highlights Grid in 3D Candy Button UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full text-left mb-8">
        {/* Pinky-Controlled Candy Card */}
        <div
          className="card-candy-pink p-6 rounded-3xl flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="btn-candy-pink w-12 h-12 rounded-2xl flex items-center justify-center p-0 shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-game font-bold bg-pink-500/25 text-pink-200 border-2 border-pink-400/50 shadow-sm">
                AI TRACKING
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-game font-bold text-white mb-2 flex items-center gap-2">
              Pinky-Controlled
            </h3>
            <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed font-normal mb-5">
              Real-time hand landmark tracking with MediaPipe. Move your pinky finger or whole hand to steer the cute pink snake.
            </p>
          </div>
          <button
            onClick={onStartWithCamera}
            className="btn-candy-pink w-full py-2.5 px-4 rounded-full font-game font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer group"
          >
            <Video className="w-4 h-4 text-white" />
            <span>Setup Pinky Cam</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Danger Mode (Real Files) Candy Card */}
        <div
          className="card-candy-gold p-6 rounded-3xl flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="btn-candy-gold w-12 h-12 rounded-2xl flex items-center justify-center p-0 shrink-0">
                <Flame className="w-6 h-6 text-rose-700 fill-amber-300 animate-bounce-gentle" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-game font-bold bg-amber-500/25 text-amber-200 border-2 border-amber-400/50 shadow-sm">
                REAL FILES
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-game font-bold text-amber-100 mb-2 flex items-center gap-2">
              Danger Mode (Real Files)
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-normal mb-5">
              Pick any folder on your computer. When the snake eats a fruit, that file is moved directly to the OS Recycle Bin for safe recovery.
            </p>
          </div>
          <button
            onClick={onSelectRealFiles}
            className="btn-candy-gold w-full py-2.5 px-4 rounded-full font-game font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer group"
          >
            <FolderOpen className="w-4 h-4 text-amber-950" />
            <span>Select Folder & Play</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-950" />
          </button>
        </div>

        {/* Play Demo (Safe Mode) Candy Card */}
        <div
          className="card-candy-green p-6 rounded-3xl flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="btn-candy-green w-12 h-12 rounded-2xl flex items-center justify-center p-0 shrink-0">
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-game font-bold bg-emerald-500/25 text-emerald-200 border-2 border-emerald-400/50 shadow-sm">
                100% SAFE
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-game font-bold text-emerald-100 mb-2 flex items-center gap-2">
              Play Demo (Safe Mode)
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal mb-5">
              Want zero file risk? Play Demo uses simulated mock files. Works with webcam pinky tracking or keyboard arrows/WASD.
            </p>
          </div>
          <button
            onClick={onStartDemo}
            className="btn-candy-green w-full py-2.5 px-4 rounded-full font-game font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer group"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Demo Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Dev Journal & Building Story Banner */}
      <div 
        onClick={onOpenJournal}
        className="w-full max-w-4xl p-5 rounded-3xl bg-gradient-to-r from-pink-950/60 via-slate-900/80 to-amber-950/60 border-2 border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 shadow-xl backdrop-blur-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer group"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-game font-bold text-base sm:text-lg">
                The Making of DangerPinky
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Devlog & Journal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
              Explore how we trained MediaPipe Landmark 20, built the 60FPS engine, and created Russian Roulette for files.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-game font-bold text-pink-300 group-hover:text-white px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/40 shrink-0">
          <span>Read Full Journal</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Safety Guarantee Candy Pill */}
      <div className="card-candy-safety w-full max-w-3xl px-6 py-4 rounded-full flex items-center gap-4 text-xs select-none backdrop-blur-md mb-4 shadow-xl">
        <div className="btn-candy-green w-11 h-11 rounded-full flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <span className="text-white font-game text-sm sm:text-base font-bold mr-2 drop-shadow">
            Safety Bound:
          </span>
          <span className="text-emerald-50 text-xs sm:text-sm font-medium leading-relaxed">
            Zero files are ever permanently deleted. Files eaten in Danger Mode go directly to your OS Trash / Recycle Bin, recoverable at any time.
          </span>
        </div>
      </div>
    </div>
  );
};
