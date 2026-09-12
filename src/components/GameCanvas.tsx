import React, { useEffect } from 'react';
import { FloatingNotification, GameStatus } from '../types/game';

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  floatingNotes: FloatingNotification[];
  countdown: number;
  status: GameStatus;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  canvasRef,
  containerRef,
  floatingNotes,
  countdown,
  status
}) => {
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

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full mx-auto rounded-b-2xl overflow-hidden bg-[#a2d149] flex items-center justify-center select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-none"
      />

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
