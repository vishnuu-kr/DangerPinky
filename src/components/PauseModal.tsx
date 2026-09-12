import React, { useEffect } from 'react';
import { Play, RefreshCw, Settings, Home, Pause, ShieldCheck, VideoOff } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onQuitToLanding: () => void;
  realFileMode?: boolean;
  onDisableRealMode?: () => void;
  isPinkyLost?: boolean;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onOpenSettings,
  onQuitToLanding,
  realFileMode = false,
  onDisableRealMode,
  isPinkyLost = false
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onResume]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-sm card-candy-pink p-7 rounded-3xl shadow-2xl text-center flex flex-col items-center">
        {/* 3D Candy Pause / Camera Lost Icon */}
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto mb-3.5 shadow-lg ${
          isPinkyLost ? 'bg-gradient-to-br from-rose-500 to-pink-600 border-2 border-rose-400' : 'btn-candy-pink'
        }`}>
          {isPinkyLost ? <VideoOff className="w-8 h-8" /> : <Pause className="w-8 h-8 fill-white" />}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-game text-white tracking-wide mb-1 drop-shadow">
          {isPinkyLost ? 'Hand Out of View' : 'Game Paused'}
        </h2>
        <p className="text-xs text-pink-100/90 font-game mb-6">
          {isPinkyLost
            ? 'Bring your hand back into view to auto-resume, or press any key'
            : 'Press Space or click Resume to continue feeding'}
        </p>

        <div className="flex flex-col gap-3 w-full">
          {/* Resume Game Candy Button */}
          <button
            onClick={onResume}
            className="btn-candy-green w-full py-3.5 px-6 rounded-full font-game text-lg font-black flex items-center justify-center gap-2.5 cursor-pointer shadow-lg group"
          >
            <Play className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform ml-0.5" />
            <span>Resume Game</span>
          </button>

          {/* Restart Candy Button */}
          <button
            onClick={onRestart}
            className="btn-candy-gold w-full py-3 px-5 rounded-full font-game font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className="w-4 h-4 text-amber-950" />
            <span>Restart Game</span>
          </button>

          {/* Real Mode Switch */}
          {realFileMode && onDisableRealMode && (
            <button
              onClick={() => {
                onDisableRealMode();
                onResume();
              }}
              className="btn-candy-pink w-full py-2.5 px-4 rounded-full font-game font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Switch to Safe Demo Mode</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="btn-candy-pill w-full py-2.5 px-4 rounded-full text-slate-200 hover:text-white font-game font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-300" />
            <span>Settings</span>
          </button>

          {/* Quit Button */}
          <button
            onClick={onQuitToLanding}
            className="btn-candy-pill w-full py-2 px-4 rounded-full text-pink-300 hover:text-pink-100 font-game text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
