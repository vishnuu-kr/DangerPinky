import React from 'react';
import { Settings, X, Volume2, Gamepad2, Sliders, Zap, Grid, Check, Sparkles } from 'lucide-react';
import { GameConfig, Difficulty } from '../types/game';
import { DIFFICULTY_SPEEDS } from '../game/constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GameConfig;
  onUpdateConfig: (newConfig: Partial<GameConfig>) => void;
}

interface GridOption {
  size: number;
  label: string;
  badge?: string;
}

const GRID_OPTIONS: GridOption[] = [
  { size: 10, label: '10 × 10', badge: 'Standard ⭐' },
  { size: 12, label: '12 × 12', badge: 'Compact' },
  { size: 14, label: '14 × 14', badge: 'Medium' },
  { size: 16, label: '16 × 16', badge: 'Large' },
  { size: 20, label: '20 × 20', badge: 'Classic' },
];

interface DifficultyOption {
  diff: Difficulty;
  label: string;
  emoji: string;
  speedDesc: string;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { diff: 'CHILL', label: 'Chill', emoji: '🐢', speedDesc: 'Relaxed' },
  { diff: 'CLASSIC', label: 'Classic', emoji: '🐍', speedDesc: 'Standard' },
  { diff: 'FAST', label: 'Fast', emoji: '⚡', speedDesc: 'Turbo' },
  { diff: 'DYNAMIC', label: 'Dynamic', emoji: '🚀', speedDesc: 'Speeds Up' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDifficultyChange = (diff: Difficulty) => {
    onUpdateConfig({
      difficulty: diff,
      initialSpeedMs: DIFFICULTY_SPEEDS[diff]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div id="settings-modal" className="relative w-full max-w-lg card-candy-pink p-5 sm:p-7 rounded-3xl shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-pink-500/30">
          <div className="flex items-center gap-3">
            <div className="btn-candy-pink w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center p-0 shrink-0 shadow-md">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
                <h2 className="text-lg sm:text-xl font-black font-game text-white tracking-wide uppercase drop-shadow">
                  Game Settings
                </h2>
              </div>
              <p className="text-xs text-pink-200/90 font-medium font-game">
                Customize board size, speed, & controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-candy-pill p-2 rounded-xl text-slate-200 hover:text-white cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-left">
          {/* Speed & Difficulty */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200 mb-2 flex items-center gap-1.5 font-game">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Speed & Difficulty</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DIFFICULTY_OPTIONS.map(({ diff, label, emoji, speedDesc }) => {
                const isSelected = config.difficulty === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyChange(diff)}
                    className={`p-2.5 rounded-2xl transition text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'btn-candy-gold text-slate-950 font-black shadow-md scale-[1.02]'
                        : 'btn-candy-pill text-slate-200 hover:text-white font-game font-bold'
                    }`}
                  >
                    <span className="text-base">{emoji}</span>
                    <span className="text-xs font-game font-black tracking-wide">{label}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-amber-950 font-bold' : 'text-slate-400'}`}>
                      {speedDesc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Board Grid Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-pink-200 flex items-center gap-1.5 font-game">
                <Grid className="w-3.5 h-3.5 text-pink-300" />
                <span>Board Grid Size</span>
              </label>
              <span className="text-[11px] font-game text-pink-300/90">
                Current: <strong className="text-white font-bold">{config.gridSize} × {config.gridSize}</strong>
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {GRID_OPTIONS.map(({ size, label, badge }) => {
                const isSelected = config.gridSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => onUpdateConfig({ gridSize: size })}
                    className={`p-2 rounded-2xl transition text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'btn-candy-pink text-white font-black shadow-md scale-[1.02]'
                        : 'btn-candy-pill text-slate-200 hover:text-white font-game font-bold'
                    }`}
                  >
                    <span className="text-xs font-game font-black">{label}</span>
                    <span className={`text-[10px] font-game ${isSelected ? 'text-pink-100 font-bold' : 'text-pink-300/70'}`}>
                      {badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Game Mode */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200 mb-2 flex items-center gap-1.5 font-game">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Game Mode</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateConfig({ gameMode: 'WRAP' })}
                className={`p-3 rounded-2xl text-left transition cursor-pointer flex flex-col gap-0.5 ${
                  config.gameMode === 'WRAP'
                    ? 'btn-candy-green text-white shadow-md'
                    : 'btn-candy-pill text-slate-200 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-game font-black text-xs sm:text-sm">Wrap-Around Mode</span>
                  {config.gameMode === 'WRAP' && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </div>
                <span className={`text-[11px] leading-tight ${config.gameMode === 'WRAP' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  Snake portals seamlessly across edges
                </span>
              </button>

              <button
                onClick={() => onUpdateConfig({ gameMode: 'CLASSIC' })}
                className={`p-3 rounded-2xl text-left transition cursor-pointer flex flex-col gap-0.5 ${
                  config.gameMode === 'CLASSIC'
                    ? 'btn-candy-gold text-slate-950 shadow-md'
                    : 'btn-candy-pill text-slate-200 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-game font-black text-xs sm:text-sm">Classic Obstacle Mode</span>
                  {config.gameMode === 'CLASSIC' && <Check className="w-4 h-4 text-amber-950 stroke-[3]" />}
                </div>
                <span className={`text-[11px] leading-tight ${config.gameMode === 'CLASSIC' ? 'text-amber-950' : 'text-slate-400'}`}>
                  Outer boundary walls are lethal obstacles
                </span>
              </button>
            </div>
          </div>

          {/* Sliders Container */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 space-y-3.5 shadow-inner">
            {/* Pinky Sensitivity */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-game font-bold text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" />
                  <span>Pinky Flick Sensitivity</span>
                </label>
                <span className="btn-candy-pink px-2.5 py-0.5 rounded-full text-[11px] font-game font-black">
                  Level {config.pinkySensitivity} / 5
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={config.pinkySensitivity}
                onChange={(e) => onUpdateConfig({ pinkySensitivity: parseInt(e.target.value, 10) })}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-game">
                <span>Coarse (Fewer turns)</span>
                <span>Responsive (Fast flicks)</span>
              </div>
            </div>

            {/* Synthesizer Audio Volume */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-game font-bold text-slate-200 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Game Synthesizer Volume</span>
                </label>
                <span className="btn-candy-green px-2.5 py-0.5 rounded-full text-[11px] font-game font-black">
                  {Math.round(config.soundVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={config.soundVolume}
                onChange={(e) => onUpdateConfig({ soundVolume: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* On-Screen Touch Controls Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 shadow-inner">
            <div className="flex items-center gap-2.5">
              <Gamepad2 className="w-4.5 h-4.5 text-cyan-300" />
              <div>
                <span className="text-xs font-game font-bold text-white block">On-Screen Touch Controls</span>
                <span className="text-[11px] text-slate-400 font-game">Display D-pad overlay on touch screens</span>
              </div>
            </div>
            <button
              onClick={() => onUpdateConfig({ touchControlsEnabled: !config.touchControlsEnabled })}
              className={`w-12 h-6.5 rounded-full transition-all relative cursor-pointer border ${
                config.touchControlsEnabled
                  ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : 'bg-slate-800 border-slate-700'
              }`}
              aria-label="Toggle on-screen touch controls"
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  config.touchControlsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-pink-500/30 flex justify-end">
          <button
            onClick={onClose}
            className="btn-candy-green w-full sm:w-auto px-7 py-2.5 rounded-full font-game font-black text-xs sm:text-sm text-white shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>SAVE & CLOSE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
