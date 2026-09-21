import { useEffect, useRef, useState, useCallback } from 'react';
import { Direction } from '../types/game';
import { TrackingStatus, PinkyTrackingFrame } from '../types/tracking';
import { getHandLandmarker } from '../tracking/landmarker';
import { PinkyDetector } from '../tracking/pinkyDetector';
import type { HandLandmarker } from '@mediapipe/tasks-vision';

export interface UseCameraTrackerOptions {
  onDirection?: (direction: Direction) => void;
  onFrame?: (frame: PinkyTrackingFrame | null) => void;
  onStatusChange?: (status: TrackingStatus) => void;
  sensitivity?: number;
  fingerMode?: import('../types/game').FingerMode;
  enabled?: boolean;
}

export function useCameraTracker(options: UseCameraTrackerOptions) {
  const { onDirection, onFrame, onStatusChange, sensitivity = 3, fingerMode = 'PINKY', enabled = true } = options;

  const [status, setStatus] = useState<TrackingStatus>('NOT_STARTED');
  const statusRef = useRef<TrackingStatus>('NOT_STARTED');
  const [error, setError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const onDirectionRef = useRef(onDirection);
  onDirectionRef.current = onDirection;

  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  // External UI elements
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const registeredCanvasesRef = useRef<Set<HTMLCanvasElement>>(new Set());

  // Master persistent video element to guarantee continuous MediaPipe tracking
  // even across modal open/close or React unmount cycles
  const masterVideoRef = useRef<HTMLVideoElement | null>(null);
  if (!masterVideoRef.current && typeof document !== 'undefined') {
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.autoplay = true;
    v.width = 480;
    v.height = 360;
    masterVideoRef.current = v;
  }

  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const detectorRef = useRef<PinkyDetector>(new PinkyDetector({ sensitivity, fingerMode }));
  const animFrameIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  // Keep sensitivity and fingerMode synced
  useEffect(() => {
    detectorRef.current.setSensitivity(sensitivity);
  }, [sensitivity]);

  useEffect(() => {
    if (fingerMode) {
      detectorRef.current.setFingerMode(fingerMode);
    }
  }, [fingerMode]);

  const updateStatus = useCallback((newStatus: TrackingStatus) => {
    statusRef.current = newStatus;
    setStatus(newStatus);
    if (onStatusChangeRef.current) {
      onStatusChangeRef.current(newStatus);
    }
  }, []);

  const registerCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      registeredCanvasesRef.current.add(canvas);
    }
  }, []);

  const unregisterCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      registeredCanvasesRef.current.delete(canvas);
    }
  }, []);

  // Start Camera and initialize MediaPipe
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      updateStatus('INITIALIZING');

      // 1. Get Camera Stream with resilient fallback
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 480 },
            height: { ideal: 360 },
            facingMode: 'user'
          },
          audio: false
        });
      } catch (initialErr) {
        console.warn('[useCameraTracker] Ideal camera constraints failed, attempting fallback to basic video:', initialErr);
        // Fallback without resolution/facingMode to avoid hardware MFT GetPhotoState failures
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }
      streamRef.current = mediaStream;
      setStream(mediaStream);

      // Attach stream to persistent master video
      if (masterVideoRef.current) {
        masterVideoRef.current.srcObject = mediaStream;
        masterVideoRef.current.play().catch((e) => console.warn('Master video play error:', e));
      }

      // Also attach to external videoRef if already mounted
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((e) => console.warn('UI video play error:', e));
      }

      // 2. Load MediaPipe Hand Landmarker
      const landmarker = await getHandLandmarker();
      landmarkerRef.current = landmarker;
      setIsModelLoaded(true);
      updateStatus('SHOW_HAND');

    } catch (err: unknown) {
      let msg = 'Camera access error';
      if (typeof DOMException !== 'undefined' && err instanceof DOMException) {
        if (err.name === 'NotReadableError' || err.name === 'TrackStartError' || err.message?.includes('hardware resources')) {
          msg = 'Camera is currently in use by another application (Zoom, Teams, or background window). Please close other camera apps and retry.';
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          msg = 'Camera permission was denied. Please allow camera access in your system settings.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          msg = 'No camera device was detected. Please connect a webcam.';
        } else {
          msg = `${err.name}: ${err.message}`;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      console.error('[useCameraTracker] Camera start error:', msg, err);
      setError(msg);
      updateStatus('NOT_STARTED');
    }
  }, [updateStatus]);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setStream(null);
    }
    if (masterVideoRef.current) {
      masterVideoRef.current.srcObject = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    detectorRef.current.reset();
    updateStatus('NOT_STARTED');
  }, [updateStatus]);

  // Automatically start camera when enabled is true, and stop when enabled becomes false
  useEffect(() => {
    if (enabled && !streamRef.current && statusRef.current === 'NOT_STARTED' && !error) {
      startCamera();
    } else if (!enabled && streamRef.current) {
      stopCamera();
    }
  }, [enabled, error, startCamera, stopCamera]);

  // Ensure external video element receives stream when mounted or re-rendered
  useEffect(() => {
    const video = videoRef.current;
    const s = streamRef.current;
    if (video && s) {
      if (video.srcObject !== s) {
        video.srcObject = s;
      }
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
  });

  // Clean up camera stream and animation frame on hook unmount
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Frame processing loop - runs continuously while enabled & model loaded
  useEffect(() => {
    if (!enabled || !isModelLoaded) {
      return;
    }

    let isRunning = true;

    const processLoop = () => {
      if (!isRunning) return;

      const video = masterVideoRef.current || videoRef.current;
      const landmarker = landmarkerRef.current;

      if (video && landmarker) {
        if (video.paused && streamRef.current) {
          video.play().catch(() => {});
        }

        if (
          video.readyState >= 2 &&
          video.currentTime !== lastVideoTimeRef.current
        ) {
          lastVideoTimeRef.current = video.currentTime;
          const startTimeMs = performance.now();

          try {
            const results = landmarker.detectForVideo(video, startTimeMs);

            const hasHand = results.landmarks && results.landmarks.length > 0;
            const rawLandmarks = hasHand ? results.landmarks[0] : null;

            // Process landmarks through pinky detector (isMirrored = true)
            const frame = detectorRef.current.processFrame(rawLandmarks, true);

            const currentStatus = detectorRef.current.getStatus();
            if (currentStatus !== statusRef.current) {
              updateStatus(currentStatus);
            }

            if (frame && frame.detectedDirection && onDirectionRef.current) {
              onDirectionRef.current(frame.detectedDirection);
            }

            if (onFrameRef.current) {
              onFrameRef.current(frame);
            }

            // Draw skeleton & pinky indicator on all active canvas elements
            const allCanvases: HTMLCanvasElement[] = Array.from(registeredCanvasesRef.current);
            if (canvasRef.current && !allCanvases.includes(canvasRef.current)) {
              allCanvases.push(canvasRef.current);
            }

            for (const canvas of allCanvases) {
              drawHandOverlay(canvas, rawLandmarks, frame);
            }
          } catch (e) {
            console.warn('Inference error:', e);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(processLoop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [enabled, isModelLoaded, updateStatus]);

  // Helper to draw skeleton and pinky tip dot on canvas
  const drawHandOverlay = (
    canvas: HTMLCanvasElement,
    rawLandmarks: { x: number; y: number }[] | null,
    frame: PinkyTrackingFrame | null
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!rawLandmarks || rawLandmarks.length < 21) {
      return;
    }

    const w = canvas.width;
    const h = canvas.height;

    // Draw hand skeleton lines (subtle cyan/slate)
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    const connections = [
      // Thumb
      [0, 1], [1, 2], [2, 3], [3, 4],
      // Index
      [0, 5], [5, 6], [6, 7], [7, 8],
      // Middle
      [0, 9], [9, 10], [10, 11], [11, 12],
      // Ring
      [0, 13], [13, 14], [14, 15], [15, 16],
      // Pinky
      [0, 17], [17, 18], [18, 19], [19, 20],
      // Palm base
      [5, 9], [9, 13], [13, 17]
    ];

    for (const [i, j] of connections) {
      const p1 = rawLandmarks[i];
      const p2 = rawLandmarks[j];
      // Mirror X coordinates for selfie view
      const x1 = (1 - p1.x) * w;
      const y1 = p1.y * h;
      const x2 = (1 - p2.x) * w;
      const y2 = p2.y * h;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    const isIndex = detectorRef.current.getFingerMode() === 'INDEX';
    const activeIndices = isIndex ? [5, 6, 7, 8] : [17, 18, 19, 20];
    const activeColor = isIndex ? '#06b6d4' : '#ec4899';
    const activeGlow = isIndex ? '#22d3ee' : '#f472b6';

    // Highlight active control finger segments (Pinky vs Index)
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let k = 0; k < activeIndices.length; k++) {
      const p = rawLandmarks[activeIndices[k]];
      const x = (1 - p.x) * w;
      const y = p.y * h;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Motion trail of recent positions
    const recent = detectorRef.current.getRecentPositions();
    if (recent.length > 1 && frame) {
      for (let r = 0; r < recent.length - 1; r++) {
        const pt = recent[r];
        const nextPt = recent[r + 1];
        const alpha = ((r + 1) / recent.length) * 0.4;
        ctx.strokeStyle = isIndex ? `rgba(6, 182, 212, ${alpha})` : `rgba(236, 72, 153, ${alpha})`;
        ctx.lineWidth = 2;
        const trailX = (frame.smoothedTip.x + (pt.x - nextPt.x) * 0.12) * w;
        const trailY = (frame.smoothedTip.y + (pt.y - nextPt.y) * 0.12) * h;
        ctx.beginPath();
        ctx.arc(trailX, trailY, 2.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Prominent Glowing TIP indicator
    if (frame) {
      const tipX = frame.smoothedTip.x * w;
      const tipY = frame.smoothedTip.y * h;

      // Glow halo
      ctx.shadowColor = activeColor;
      ctx.shadowBlur = 14;
      ctx.fillStyle = activeGlow;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 7.5, 0, Math.PI * 2);
      ctx.fill();

      // Glowing tracking confidence boundary ring
      const isNearEdge = frame.smoothedTip.x < 0.08 || frame.smoothedTip.x > 0.92 || frame.smoothedTip.y < 0.08 || frame.smoothedTip.y > 0.92;
      const confidenceColor = isNearEdge ? '#f43f5e' : activeGlow;

      ctx.save();
      ctx.strokeStyle = confidenceColor;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(tipX, tipY, 13, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner white core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tipX, tipY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Direction flick arrow overlay if moving
      if (frame.detectedDirection) {
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = activeGlow;
        ctx.lineWidth = 2;
        const arrowLen = 14;
        let dx = 0, dy = 0;
        if (frame.detectedDirection === 'UP') dy = -arrowLen;
        else if (frame.detectedDirection === 'DOWN') dy = arrowLen;
        else if (frame.detectedDirection === 'LEFT') dx = -arrowLen;
        else if (frame.detectedDirection === 'RIGHT') dx = arrowLen;

        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX + dx, tipY + dy);
        ctx.stroke();
      }
    }

    ctx.restore();
  };

  return {
    videoRef,
    canvasRef,
    status,
    error,
    isModelLoaded,
    stream,
    registerCanvas,
    unregisterCanvas,
    startCamera,
    stopCamera,
    detector: detectorRef.current
  };
}
