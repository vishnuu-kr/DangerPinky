import React, { useState, useEffect } from 'react';
import { Video, CheckCircle2, AlertCircle, Sparkles, X, ArrowRight, RefreshCw } from 'lucide-react';
import { TrackingStatus, PinkyTrackingFrame, CalibrationData } from '../types/tracking';
import { CalibrationManager } from '../tracking/calibration';
import { Direction } from '../types/game';

interface CameraSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadyToPlay: (calData?: CalibrationData) => void;
  onPlayWithKeyboard?: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  status: TrackingStatus;
  error: string | null;
  startCamera: () => Promise<void>;
  sensitivity: number;
  onSensitivityChange: (val: number) => void;
  lastFrame?: PinkyTrackingFrame | null;
  stream?: MediaStream | null;
  registerCanvas?: (canvas: HTMLCanvasElement | null) => void;
  unregisterCanvas?: (canvas: HTMLCanvasElement | null) => void;
}

export const CameraSetupModal: React.FC<CameraSetupModalProps> = ({
  isOpen,
  onClose,
  onReadyToPlay,
  onPlayWithKeyboard,
  videoRef,
  canvasRef,
  status,
  error,
  startCamera,
  sensitivity,
  onSensitivityChange,
  lastFrame,
  stream,
  registerCanvas,
  unregisterCanvas
}) => {
  const [calibrationManager] = useState(() => new CalibrationManager());
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [detectedDir, setDetectedDir] = useState<Direction | null>(null);
  const [calData, setCalData] = useState<CalibrationData | undefined>(undefined);

  // Sync stream to video element when modal opens
  useEffect(() => {
    if (isOpen && videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen, videoRef, stream]);

  // Register canvas with tracker
  useEffect(() => {
    if (isOpen && canvasRef.current && registerCanvas) {
      registerCanvas(canvasRef.current);
      return () => {
        if (unregisterCanvas) unregisterCanvas(canvasRef.current);
      };
    }
  }, [isOpen, canvasRef, registerCanvas, unregisterCanvas]);

  useEffect(() => {
    calibrationManager.onComplete((data) => {
      setCalData(data);
    });
  }, [calibrationManager]);

  // Auto start camera when modal opens if not already running and no error
  useEffect(() => {
    if (isOpen && status === 'NOT_STARTED' && !error) {
      startCamera();
    }
  }, [isOpen, status, error, startCamera]);

  // Handle pinky movement frames during calibration
  useEffect(() => {
    if (!isOpen || !lastFrame) return;

    setDetectedDir(lastFrame.detectedDirection);

    if (lastFrame.detectedDirection && !isCalibrated) {
      const stepSuccess = calibrationManager.checkDirection(
        lastFrame.detectedDirection,
        lastFrame.displacement.dx,
        lastFrame.displacement.dy
      );

      if (stepSuccess) {
        setCurrentStepIndex((prev) => prev + 1);
        if (calibrationManager.isFinished()) {
          setIsCalibrated(true);
        }
      }
    }
  }, [isOpen, lastFrame, isCalibrated, calibrationManager]);

  if (!isOpen) return null;

  const steps = calibrationManager.getSteps();
  const currentStep = calibrationManager.getCurrentStep();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl card-candy-pink p-5 sm:p-7 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-pink-500/30">
          <div className="flex items-center gap-3">
            <div className="btn-candy-pink w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center p-0 shrink-0 shadow-md">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
                <h2 className="text-lg sm:text-xl font-black font-game text-white tracking-wide uppercase drop-shadow flex items-center gap-2">
                  <span>Pinky Camera Setup</span>
                  <span className="btn-candy-pink px-2.5 py-0.5 rounded-full text-[10px] font-game font-black">
                    MediaPipe AI
                  </span>
                </h2>
              </div>
              <p className="text-xs text-pink-200/90 font-medium font-game">
                Position your hand so your pinky finger is clearly tracked
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-candy-pill p-2 rounded-xl text-slate-200 hover:text-white cursor-pointer"
            aria-label="Close setup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview & Canvas Overlay */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-pink-500/40 aspect-video flex items-center justify-center shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100"
          />
          <canvas
            ref={canvasRef}
            width={480}
            height={360}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Status Overlay Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-pink-500/40 text-xs font-game font-bold">
            {status === 'INITIALIZING' && (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span className="text-amber-200 font-game">Loading MediaPipe Models...</span>
              </>
            )}
            {status === 'SHOW_HAND' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-300 font-game font-bold">Show hand to camera</span>
              </>
            )}
            {status === 'PINKY_TRACKED' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-game font-black">Pinky Tracked!</span>
              </>
            )}
            {status === 'PINKY_LOST' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-rose-300 font-game font-bold">Pinky Lost</span>
              </>
            )}
            {status === 'NOT_STARTED' && (
              <span className="text-slate-400 font-game">Camera Inactive</span>
            )}
          </div>

          {/* Real-time detected gesture banner */}
          {detectedDir && (
            <div className="btn-candy-pink absolute top-3 right-3 px-4 py-1.5 rounded-full font-game font-black text-xs uppercase tracking-wider animate-bounce-gentle shadow-lg">
              Flick {detectedDir}
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center z-20">
              <AlertCircle className="w-10 h-10 text-rose-400 mb-2 animate-bounce-gentle" />
              <h3 className="text-base font-black font-game text-white mb-1">Camera access is required for pinky control.</h3>
              <p className="text-xs text-pink-200/80 max-w-sm mb-4 font-game">{error}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => startCamera()}
                  className="btn-candy-pink px-5 py-2.5 rounded-full font-game font-black text-xs cursor-pointer shadow-md"
                >
                  Try again
                </button>
                {onPlayWithKeyboard && (
                  <button
                    onClick={onPlayWithKeyboard}
                    className="btn-candy-green px-5 py-2.5 rounded-full font-game font-black text-xs cursor-pointer shadow-md"
                  >
                    Play with keyboard
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4-Direction Calibration Flow */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-black font-game text-white">
                {isCalibrated ? 'Calibration Complete! 🎉' : 'Pinky Movement Calibration'}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-pink-300">
              {isCalibrated ? '4 / 4' : `${currentStepIndex} / ${steps.length}`}
            </span>
          </div>

          {!isCalibrated && currentStep && (
            <div className="p-3 rounded-2xl bg-pink-500/15 border border-pink-500/30 mb-3 text-center animate-pulse-subtle">
              <span className="text-sm font-black font-game text-pink-300 block mb-0.5">
                {currentStep.label}
              </span>
              <span className="text-xs text-pink-100/90 font-game">
                {currentStep.instruction}
              </span>
            </div>
          )}

          {/* Calibration step pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((step, idx) => (
              <div
                key={step.targetDirection}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-2xl text-xs font-game transition-all ${
                  step.isComplete
                    ? 'btn-candy-green text-white font-black shadow-sm'
                    : idx === currentStepIndex
                    ? 'btn-candy-pink text-white font-black shadow-md scale-[1.02]'
                    : 'btn-candy-pill text-slate-400 font-bold'
                }`}
              >
                {step.isComplete ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3] shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-black">
                    {idx + 1}
                  </span>
                )}
                <span>{step.targetDirection}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sensitivity Adjustment */}
        <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 shadow-inner">
          <label className="text-xs font-game font-bold text-slate-200 flex items-center gap-1.5">
            <span>Pinky Sensitivity:</span>
            <span className="btn-candy-pink px-2.5 py-0.5 rounded-full text-[11px] font-game font-black">
              {sensitivity} / 5
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={sensitivity}
            onChange={(e) => onSensitivityChange(parseInt(e.target.value, 10))}
            className="w-44 sm:w-48 accent-pink-500 cursor-pointer"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-pink-500/30">
          <button
            onClick={() => {
              calibrationManager.reset();
              setCurrentStepIndex(0);
              setIsCalibrated(false);
            }}
            className="btn-candy-pill px-4 py-2 rounded-full font-game text-xs font-bold text-pink-300 hover:text-white transition cursor-pointer"
          >
            Restart Calibration
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => onReadyToPlay(calData)}
              className="btn-candy-pill px-4 py-2.5 rounded-full font-game font-bold text-xs sm:text-sm text-slate-200 hover:text-white transition cursor-pointer"
            >
              Skip Calibration
            </button>
            <button
              onClick={() => onReadyToPlay(calData)}
              className="btn-candy-green px-6 py-2.5 rounded-full font-game font-black text-xs sm:text-sm text-white shadow-lg cursor-pointer flex items-center gap-2 group"
            >
              <span>Continue to Game</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
