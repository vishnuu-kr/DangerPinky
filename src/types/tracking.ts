import { Direction } from './game';

export interface Landmark2D {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  z?: number;
}

export type TrackingStatus = 'NOT_STARTED' | 'INITIALIZING' | 'SHOW_HAND' | 'PINKY_TRACKED' | 'PINKY_LOST';

export interface PinkyLandmarks {
  mcp: Landmark2D; // Landmark 17
  pip: Landmark2D; // Landmark 18
  dip: Landmark2D; // Landmark 19
  tip: Landmark2D; // Landmark 20
}

export interface PinkyDebugInfo {
  pinkyX: number;
  pinkyY: number;
  deltaX: number;
  deltaY: number;
  direction: Direction | null;
  status: TrackingStatus;
}

export interface PinkyTrackingFrame {
  timestamp: number;
  rawTip: Landmark2D;
  smoothedTip: Landmark2D;
  displacement: { dx: number; dy: number };
  detectedDirection: Direction | null;
  confidence: number;
  isPinkyRaised: boolean;
  debug?: PinkyDebugInfo;
}

export interface CalibrationStep {
  targetDirection: Direction;
  label: string;
  instruction: string;
  isComplete: boolean;
  detectedDisplacement?: { dx: number; dy: number };
}

export interface CalibrationData {
  thresholdX: number;
  thresholdY: number;
  dominantAxisRatio: number;
  isCalibrated: boolean;
}
