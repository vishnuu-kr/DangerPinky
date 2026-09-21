import React from 'react';
import { Settings, X, Volume2, Gamepad2, Sliders, Zap, Grid, Check, Sparkles, Music, Palette, Hand, Filter, Layers, Smartphone } from 'lucide-react';
import { GameConfig, Difficulty, SnakeSkin, FingerMode, GameMode, FileFilterCategory, BoardTheme } from '../types/game';
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

const GAME_MODE_OPTIONS: { mode: GameMode; name: string; badge: string; desc: string }[] = [
  { mode: 'WRAP', name: 'Wrap-Around', badge: 'PORTAL 🌀', desc: 'Snake portals seamlessly across edges' },
  { mode: 'CLASSIC', name: 'Classic Walls', badge: 'LETHAL 🧱', desc: 'Outer boundaries are lethal obstacles' },
  { mode: 'TIME_ATTACK', name: 'Time Attack', badge: '60s RUSH ⏱️', desc: 'Eat as many files before 60s expires' },
  { mode: 'ZEN', name: 'Zen Tail-Slice', badge: 'PEACEFUL 🧘', desc: 'Body collisions trim your tail safely' }
];

const SKIN_OPTIONS: { key: SnakeSkin; name: string; emoji: string; color: string }[] = [
  { key: 'GOOGLE_BLUE', name: 'Google Blue', emoji: '🔵', color: '#4772eb' },
  { key: 'CANDY_PINK', name: 'Candy Pink', emoji: '🍬', color: '#ff3b94' },
  { key: 'CYBER_GREEN', name: 'Matrix Green', emoji: '💚', color: '#10b981' },
  { key: 'SYNTHWAVE', name: 'Synthwave', emoji: '💜', color: '#8b5cf6' },
  { key: 'GOLDEN_CHROMA', name: 'Golden VIP', emoji: '👑', color: '#f59e0b' }
];

const THEME_OPTIONS: { key: BoardTheme; name: string; emoji: string; color: string }[] = [
  { key: 'MEADOW', name: 'Meadow Lawn', emoji: '🌱', color: '#a2d149' },
  { key: 'CYBER_NEON', name: 'Cyber Terminal', emoji: '⚡', color: '#06b6d4' },
  { key: 'SYNTH_DUSK', name: 'Synthwave Dusk', emoji: '🌆', color: '#d946ef' },
  { key: 'RETRO_DESKTOP', name: 'Retro OS 95', emoji: '💾', color: '#008080' }
];

const FINGER_MODE_OPTIONS: { mode: FingerMode; name: string; desc: string; icon: string }[] = [
  { mode: 'PINKY', name: 'Pinky Finger (Classic)', desc: 'Landmark 20 flick gesture (DangerPinky)', icon: '🤙' },
  { mode: 'INDEX', name: 'DangerPointer (Index)', desc: 'Landmark 8 pointer fallback (Casual friendly)', icon: '☝️' }
];

const FILTER_OPTIONS: { key: FileFilterCategory; name: string; emoji: string }[] = [
  { key: 'ALL', name: 'All Files', emoji: '📂' },
  { key: 'JUNK_ONLY', name: 'Junk & Tmp', emoji: '🧹' },
  { key: 'MEDIA_ONLY', name: 'Media Heavy', emoji: '🎬' },
  { key: 'CODE_DOCS', name: 'Code & Docs', emoji: '💻' }
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
      <div id="settings-modal" className="relative w-full max-w-lg card-candy-pink p-5 sm:p-6 rounded-3xl shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-500/30">
          <div className="flex items-center gap-3">
            <div className="btn-candy-pink w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center p-0 shrink-0 shadow-md">
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
                Customize skins, modes, audio, & tracking
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
          {/* Snake Skin Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200 mb-2 flex items-center gap-1.5 font-game">
              <Palette className="w-3.5 h-3.5 text-pink-300" />
              <span>Snake Skin Cosmetic</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SKIN_OPTIONS.map(({ key, name, emoji, color }) => {
                const isSelected = (config.snakeSkin || 'CANDY_PINK') === key;
                return (
                  <button
                    key={key}
                    onClick={() => onUpdateConfig({ snakeSkin: key })}
                    className={`p-2.5 rounded-2xl transition text-center cursor-pointer flex flex-col items-center justify-center gap-1 border-2 ${
                      isSelected
                        ? 'border-white bg-slate-900 shadow-md scale-[1.02]'
                        : 'border-transparent bg-slate-950/70 hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm">{emoji}</span>
                    </div>
                    <span className="text-[11px] font-game font-bold leading-tight">{name}</span>
                    {isSelected && (
                      <span className="text-[9px] font-black uppercase text-pink-300">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Board Environment Theme */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200 mb-2 flex items-center gap-1.5 font-game">
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>Board Environment Theme</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEME_OPTIONS.map(({ key, name, emoji, color }) => {
                const isSelected = (config.boardTheme || 'MEADOW') === key;
                return (
                  <button
                    key={key}
                    onClick={() => onUpdateConfig({ boardTheme: key })}
                    className={`p-2.5 rounded-2xl transition text-center cursor-pointer flex flex-col items-center justify-center gap-1 border-2 ${
                      isSelected
                        ? 'border-white bg-slate-900 shadow-md scale-[1.02]'
                        : 'border-transparent bg-slate-950/70 hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm">{emoji}</span>
                    </div>
                    <span className="text-[11px] font-game font-bold leading-tight">{name}</span>
                    {isSelected && (
                      <span className="text-[9px] font-black uppercase text-emerald-300">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Game Mode (4 options) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200 mb-2 flex items-center gap-1.5 font-game">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Game Mode</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GAME_MODE_OPTIONS.map(({ mode, name, badge, desc }) => {
                const isSelected = config.gameMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => onUpdateConfig({ gameMode: mode })}
                    className={`p-2.5 rounded-2xl text-left transition cursor-pointer flex flex-col gap-0.5 border-2 ${
                      isSelected
                        ? 'bg-slate-900 border-pink-400 text-white shadow-md'
                        : 'bg-slate-950/70 border-pink-500/20 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-game font-black text-xs">{name}</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        {badge}
                      </span>
                    </div>
                    <span className="text-[10px] leading-tight text-slate-400 font-game">
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Finger Tracking Mode (Pinky vs Index Pointer) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200 mb-2 flex items-center gap-1.5 font-game">
              <Hand className="w-3.5 h-3.5 text-amber-300" />
              <span>Camera Tracking Finger</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FINGER_MODE_OPTIONS.map(({ mode, name, desc, icon }) => {
                const isSelected = (config.fingerMode || 'PINKY') === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => onUpdateConfig({ fingerMode: mode })}
                    className={`p-2.5 rounded-2xl text-left transition cursor-pointer flex flex-col gap-0.5 border-2 ${
                      isSelected
                        ? 'bg-slate-900 border-amber-400 text-white shadow-md'
                        : 'bg-slate-950/70 border-pink-500/20 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span>{icon}</span>
                        <span className="font-game font-black text-xs">{name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] leading-tight text-slate-400 font-game">
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Filter Category */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200 mb-2 flex items-center gap-1.5 font-game">
              <Filter className="w-3.5 h-3.5 text-purple-300" />
              <span>File Type Filter</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FILTER_OPTIONS.map(({ key, name, emoji }) => {
                const isSelected = (config.fileFilter || 'ALL') === key;
                return (
                  <button
                    key={key}
                    onClick={() => onUpdateConfig({ fileFilter: key })}
                    className={`p-2 rounded-2xl transition text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 border-2 ${
                      isSelected
                        ? 'bg-slate-900 border-purple-400 text-purple-200 shadow-md'
                        : 'bg-slate-950/70 border-pink-500/20 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{emoji}</span>
                    <span className="text-[10px] font-game font-bold">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

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

          {/* Sliders Container */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 space-y-3.5 shadow-inner">
            {/* Gesture Sensitivity */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-game font-bold text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" />
                  <span>Finger Flick Sensitivity</span>
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

            {/* Retro 8-bit Synthesizer BGM Volume */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-game font-bold text-slate-200 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-purple-400" />
                  <span>Retro 8-Bit BGM Music</span>
                </label>
                <button
                  onClick={() => onUpdateConfig({ musicEnabled: config.musicEnabled === false ? true : false })}
                  className={`text-[10px] font-game font-black px-2 py-0.5 rounded-full cursor-pointer transition ${
                    config.musicEnabled !== false
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {config.musicEnabled !== false ? 'ON' : 'MUTED'}
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={config.musicVolume ?? 0.35}
                onChange={(e) => onUpdateConfig({ musicVolume: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Sound FX Volume */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-game font-bold text-slate-200 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sound FX Volume</span>
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

          {/* Haptic Vibration Feedback Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 shadow-inner">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4.5 h-4.5 text-pink-300" />
              <div>
                <span className="text-xs font-game font-bold text-white block">Haptic Vibration Feedback</span>
                <span className="text-[11px] text-slate-400 font-game">Tactile pulses on turns, file bites, combos, & near-misses</span>
              </div>
            </div>
            <button
              onClick={() => onUpdateConfig({ hapticsEnabled: config.hapticsEnabled === false ? true : false })}
              className={`w-12 h-6.5 rounded-full transition-all relative cursor-pointer border ${
                config.hapticsEnabled !== false
                  ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : 'bg-slate-800 border-slate-700'
              }`}
              aria-label="Toggle haptic vibration feedback"
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  config.hapticsEnabled !== false ? 'translate-x-6' : 'translate-x-1'
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
