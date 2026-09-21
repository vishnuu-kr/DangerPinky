import React, { useEffect, useRef } from 'react';
import { FloatingNotification, GameStatus, Direction, GameMode, BoardTheme } from '../types/game';
import { BOARD_THEMES } from '../game/constants';

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  floatingNotes: FloatingNotification[];
  countdown: number;
  status: GameStatus;
  boardTheme?: BoardTheme;
  isScreenShaking?: boolean;
  isNearMiss?: boolean;
  timeRemaining?: number;
  gameMode?: GameMode;
  onSwipeDirection?: (dir: Direction) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  canvasRef,
  containerRef,
  floatingNotes,
  countdown,
  status,
  boardTheme = 'MEADOW',
  isScreenShaking = false,
  isNearMiss = false,
  timeRemaining,
  gameMode,
  onSwipeDirection
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !onSwipeDirection) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipe = 28;
    if (Math.hypot(dx, dy) >= minSwipe) {
      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onSwipeDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  // Setup canvas size with DPI scaling on mount and window resize
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const size = Math.floor(Math.min(rect.width, rect.height || rect.width));

      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [canvasRef, containerRef]);

  const currentTheme = BOARD_THEMES[boardTheme] || BOARD_THEMES.MEADOW;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        backgroundColor: currentTheme.tileA,
        boxShadow: `0 0 28px ${currentTheme.glowColor}`
      }}
      className={`relative aspect-square w-full mx-auto rounded-b-2xl overflow-hidden flex items-center justify-center select-none transition-all duration-75 ${
        isScreenShaking ? 'translate-x-1 -translate-y-1 rotate-[0.5deg] scale-[1.015]' : ''
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-none"
      />

      {/* Near Miss Danger Vignette */}
      {isNearMiss && status === 'PLAYING' && (
        <div className="absolute inset-0 pointer-events-none border-4 border-rose-500/80 shadow-[inset_0_0_40px_rgba(244,63,94,0.6)] animate-pulse z-10" />
      )}

      {/* Time Attack 60s Remaining Badge */}
      {gameMode === 'TIME_ATTACK' && status === 'PLAYING' && timeRemaining !== undefined && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 border border-amber-500/50 text-xs font-mono font-black text-amber-300 shadow-lg backdrop-blur-sm animate-pulse">
          <span>⏱️</span>
          <span>{timeRemaining}s</span>
        </div>
      )}

      {/* Floating "+1 filename" Eaten Notifications (Subtle Simulated Deletion Pill) */}
      {floatingNotes.map((note) => {
        return (
          <div
            key={note.id}
            style={{
              left: `${note.x}px`,
              top: `${note.y - 16}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-full pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300 z-20"
          >
            <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/80 text-white border border-white/20 shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
              <span className="truncate max-w-[200px] sm:max-w-[280px]">{note.text}</span>
            </div>
          </div>
        );
      })}

      {/* Countdown 3-2-1 Overlay */}
      {status === 'COUNTDOWN' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex flex-col items-center">
            <span className="text-8xl sm:text-9xl font-black font-game text-transparent bg-clip-text bg-gradient-to-br from-pink-400 via-rose-300 to-amber-300 animate-bounce-gentle">
              {countdown === 0 ? 'GO!' : countdown}
            </span>
            <span className="text-sm font-semibold text-slate-300 uppercase tracking-widest mt-2">
              Get Ready!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
