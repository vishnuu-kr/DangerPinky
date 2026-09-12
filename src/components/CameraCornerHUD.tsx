import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { TrackingStatus, PinkyTrackingFrame } from '../types/tracking';

interface CameraCornerHUDProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  status: TrackingStatus;
  enabled: boolean;
  frame?: PinkyTrackingFrame | null;
  onOpenCalibration: () => void;
  stream?: MediaStream | null;
  registerCanvas?: (canvas: HTMLCanvasElement | null) => void;
  unregisterCanvas?: (canvas: HTMLCanvasElement | null) => void;
}

export const CameraCornerHUD: React.FC<CameraCornerHUDProps> = ({
  videoRef,
  canvasRef,
  status,
  enabled,
  frame,
  onOpenCalibration,
  stream,
  registerCanvas,
  unregisterCanvas
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showDebug, setShowDebug] = useState<boolean>(false);

  // Sync stream to video element
  React.useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }
      video.play().catch(() => {});
    }
  }, [videoRef, stream, isMinimized]);

  // Register canvas on mount
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && registerCanvas) {
      registerCanvas(canvas);
      return () => {
        if (unregisterCanvas) unregisterCanvas(canvas);
      };
    }
  }, [canvasRef, registerCanvas, unregisterCanvas, isMinimized]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end transition-all select-none">
      {/* Container card */}
      <div className="bg-slate-950/90 backdrop-blur-md border-2 border-pink-500/40 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Card Header bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-pink-500/30 text-xs gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                status === 'PINKY_TRACKED'
                  ? 'bg-emerald-400 animate-pulse'
                  : status === 'PINKY_LOST'
                  ? 'bg-rose-500 animate-ping'
                  : status === 'SHOW_HAND'
                  ? 'bg-amber-400'
                  : 'bg-pink-400 animate-spin'
              }`}
            />
            <span className="font-game font-black text-[11px] tracking-wide uppercase">
              {status === 'PINKY_TRACKED' ? (
                <span className="text-emerald-400">PINKY ACTIVE</span>
              ) : status === 'PINKY_LOST' ? (
                <span className="text-rose-400">HAND OUT OF VIEW</span>
              ) : status === 'SHOW_HAND' ? (
                <span className="text-amber-400">SHOW HAND</span>
              ) : (
                <span className="text-pink-400">TRACKING...</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className={`btn-candy-pill p-1 rounded-lg text-[10px] transition cursor-pointer ${
                showDebug ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Pinky Debug Info"
            >
              <Terminal className="w-3 h-3" />
            </button>
            <button
              onClick={onOpenCalibration}
              className="btn-candy-pink px-2.5 py-0.5 rounded-full text-[10px] font-game font-black text-white cursor-pointer shadow-sm"
              title="Recalibrate pinky sensitivity"
            >
              Calibrate
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="btn-candy-pill p-1 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
              title={isMinimized ? 'Expand preview' : 'Minimize preview'}
            >
              {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Video & Canvas View */}
        {!isMinimized && (
          <div className="relative w-48 h-36 bg-slate-950 flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />
            <canvas
              ref={canvasRef}
              width={192}
              height={144}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Direction Flash Indicator when finger moves */}
            {frame?.detectedDirection && (
              <div className="absolute inset-0 flex items-center justify-center bg-pink-500/25 pointer-events-none transition-all">
                <div className="btn-candy-pink px-3.5 py-1 rounded-full text-white font-black font-game text-xs tracking-wider shadow-lg flex items-center gap-1">
                  <span>
                    {frame.detectedDirection === 'UP' ? '▲' : frame.detectedDirection === 'DOWN' ? '▼' : frame.detectedDirection === 'LEFT' ? '◀' : '▶'}
                  </span>
                  <span>{frame.detectedDirection}</span>
                </div>
              </div>
            )}

            {/* Debug overlay (Section 12) */}
            {showDebug && frame && (
              <div className="absolute inset-x-2 bottom-2 p-2 rounded-lg bg-black/85 backdrop-blur-sm border border-slate-700/70 font-mono text-[9px] text-slate-300 pointer-events-none space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-pink-400">Pinky:</span>
                  <span>X: {frame.debug?.pinkyX ?? frame.smoothedTip.x.toFixed(2)}, Y: {frame.debug?.pinkyY ?? frame.smoothedTip.y.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">Delta:</span>
                  <span>X: {frame.displacement.dx >= 0 ? `+${frame.displacement.dx.toFixed(2)}` : frame.displacement.dx.toFixed(2)}, Y: {frame.displacement.dy >= 0 ? `+${frame.displacement.dy.toFixed(2)}` : frame.displacement.dy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-amber-400">Dir:</span>
                  <span className="text-white">{frame.debug?.direction || 'NONE'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">Track:</span>
                  <span>{status === 'PINKY_TRACKED' ? 'GOOD' : status}</span>
                </div>
              </div>
            )}

            {/* Hint overlay if hand lost */}
            {status === 'PINKY_LOST' && (
              <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[12px] font-bold text-rose-100 leading-tight">
                  Hand Out of View
                </span>
                <span className="text-[10px] text-rose-300/90 mt-0.5">
                  Game paused • Bring hand into view
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
