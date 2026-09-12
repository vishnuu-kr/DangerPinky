import { Trophy, Volume2, VolumeX, Pause, Play, Settings, RefreshCw, FolderOpen, Video, VideoOff, Flame, Crown } from 'lucide-react';
import { GameStatus } from '../types/game';

interface GameHUDProps {
  score: number;
  highScore: number;
  filesEatenCount: number;
  filesConsumedCount?: number;
  status: GameStatus;
  soundMuted: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onOpenSettings: () => void;
  onRestart: () => void;
  onOpenFolderPicker: () => void;
  folderName: string;
  realFileMode?: boolean;
  onDisableRealMode?: () => void;
  cameraActive?: boolean;
  onToggleCamera?: () => void;
  lastDirection?: string | null;
  onQuitToLanding?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  highScore,
  filesEatenCount,
  filesConsumedCount = 0,
  status,
  soundMuted,
  onToggleSound,
  onTogglePause,
  onOpenSettings,
  onRestart,
  onOpenFolderPicker,
  folderName,
  realFileMode = false,
  onDisableRealMode,
  cameraActive = false,
  onToggleCamera,
  lastDirection,
  onQuitToLanding
}: GameHUDProps) => {
  return (
    <div className="w-full flex flex-col">
      <header className="w-full bg-gradient-to-r from-[#3d6e20] via-[#488226] to-[#3d6e20] text-white flex items-center justify-between px-2.5 py-2 sm:px-4 sm:py-2.5 select-none rounded-t-2xl border-b-2 border-[#335919] shadow-md">
        {/* Hidden text for screen-readers and test suites */}
        <span className="sr-only">SCORE {score} HIGH {highScore} FED {filesEatenCount} {folderName}</span>

        {/* Left: Score with Apple */}
        <div className="flex items-center gap-1.5 sm:gap-2.5" data-testid="hud-score">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 flex items-center justify-center shadow-inner border border-white/20">
            <span className="text-xl sm:text-2xl leading-none select-none filter drop-shadow" role="img" aria-label="Apple">
              🍎
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-white font-game tracking-wide leading-none drop-shadow">
            {score}
          </span>
        </div>

        {/* Center: High Score & DangerPinky Badge */}
        <div className="flex items-center gap-1.5 sm:gap-3" data-testid="hud-high-score">
          {onQuitToLanding ? (
            <button
              onClick={onQuitToLanding}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/40 hover:bg-slate-950/70 border border-pink-500/30 hover:border-pink-500/60 text-[11px] font-bold text-pink-300 shadow-inner transition active:scale-95 cursor-pointer group"
              title="Return to DangerPinky Home Screen"
            >
              <Crown className="w-3 h-3 text-amber-400 fill-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="font-game tracking-wider">DangerPinky</span>
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/40 border border-pink-500/30 text-[11px] font-bold text-pink-300 shadow-inner">
              <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-game tracking-wider">DangerPinky</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 fill-amber-300 filter drop-shadow shrink-0" />
            <span className="text-xl sm:text-2xl font-black text-white font-game tracking-wide leading-none drop-shadow">
              {highScore}
            </span>
          </div>
        </div>

        {/* Right: Candy Control Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Change Folder */}
          <button
            onClick={onOpenFolderPicker}
            className="p-1.5 rounded-xl text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition active:scale-95 shadow-sm"
            title={`Food Source: ${folderName || 'Default Folder'} (Click to change)`}
            aria-label="Change food folder"
          >
            <FolderOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-200" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-xl text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition active:scale-95 shadow-sm"
            title={soundMuted ? 'Unmute audio' : 'Mute audio'}
            aria-label={soundMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {soundMuted ? (
              <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-300" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            )}
          </button>

          {/* Restart Game */}
          <button
            onClick={onRestart}
            className="p-1.5 rounded-xl text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition active:scale-95 shadow-sm"
            title="Restart game"
            aria-label="Restart game"
          >
            <RefreshCw className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-200" />
          </button>

          {/* Pause / Resume */}
          <button
            onClick={onTogglePause}
            className="p-1.5 rounded-xl text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition active:scale-95 shadow-sm"
            title={status === 'PAUSED' ? 'Resume game (Spacebar)' : 'Pause game (Spacebar)'}
            aria-label={status === 'PAUSED' ? 'Resume game' : 'Pause game'}
          >
            {status === 'PAUSED' ? (
              <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300 fill-amber-300 animate-pulse" />
            ) : (
              <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            )}
          </button>

          {/* Camera Toggle */}
          {onToggleCamera && (
            <button
              onClick={onToggleCamera}
              className={`p-1.5 rounded-xl transition active:scale-95 flex items-center gap-1 border shadow-sm ${
                cameraActive
                  ? 'text-pink-100 bg-pink-500/40 hover:bg-pink-500/50 border-pink-300/50'
                  : 'text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border-white/20'
              }`}
              title={cameraActive ? 'Disable Pinky Camera (Use Keyboard)' : 'Enable Pinky Camera'}
              aria-label={cameraActive ? 'Disable Camera' : 'Enable Camera'}
            >
              {cameraActive ? (
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-pink-300" />
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                </div>
              ) : (
                <VideoOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              )}
            </button>
          )}

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition active:scale-95 shadow-sm cursor-pointer"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
          </button>
        </div>
      </header>

      {/* Mode Sub-Bar: Real Mode vs Demo Mode & Emergency Stop */}
      <div className={`w-full px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs border-b ${
        realFileMode
          ? 'bg-slate-950/95 border-amber-500/50 text-amber-200 shadow-inner'
          : 'bg-[#35581c]/80 border-[#2b4916] text-emerald-200/90'
      }`}>
        <div className="flex items-center gap-2 overflow-hidden">
          {realFileMode ? (
            <>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold tracking-wide shrink-0">
                <Flame className="w-4 h-4 text-rose-500 fill-amber-400 animate-bounce-gentle" />
                <span className="font-game text-sm text-amber-300">DANGER MODE</span>
              </span>
              <span className="text-slate-600 shrink-0">•</span>
              <span className="truncate text-slate-300 text-[11px]">
                FOLDER: <strong className="text-white">{folderName}</strong>
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5 text-pink-300 font-medium tracking-wide font-game text-xs">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              DEMO MODE (Safe Mock Files)
            </span>
          )}

          {cameraActive && (
            <>
              <span className="text-slate-600 shrink-0">•</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-game text-xs border border-pink-500/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                PINKY CAM
                {lastDirection && (
                  <span className="ml-1 text-white font-black bg-pink-600 px-1.5 py-0.2 rounded-full animate-bounce text-[10px]">
                    {lastDirection === 'UP' ? '▲ UP' : lastDirection === 'DOWN' ? '▼ DOWN' : lastDirection === 'LEFT' ? '◀ LEFT' : '▶ RIGHT'}
                  </span>
                )}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          {realFileMode && (
            <span className="font-mono text-amber-300 font-bold text-[10px] sm:text-[11px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              TRASHED: {filesConsumedCount}
            </span>
          )}

          {realFileMode && onDisableRealMode && (
            <button
              onClick={onDisableRealMode}
              className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-game text-[11px] tracking-wide transition shadow-sm active:scale-95"
              title="Immediately disable Real File Mode and stop moving files to Recycle Bin"
            >
              STOP REAL MODE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
