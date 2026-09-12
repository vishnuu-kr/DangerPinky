import { Direction } from '../types/game';
import { CalibrationStep, CalibrationData } from '../types/tracking';
import { sound } from '../game/audio';

export const CALIBRATION_STEPS: CalibrationStep[] = [
  {
    targetDirection: 'RIGHT',
    label: 'Flick Pinky Right 👉',
    instruction: 'Raise your hand and flick your pinky to the right',
    isComplete: false
  },
  {
    targetDirection: 'LEFT',
    label: 'Flick Pinky Left 👈',
    instruction: 'Now flick your pinky to the left',
    isComplete: false
  },
  {
    targetDirection: 'UP',
    label: 'Flick Pinky Up 👆',
    instruction: 'Flick your pinky upwards',
    isComplete: false
  },
  {
    targetDirection: 'DOWN',
    label: 'Flick Pinky Down 👇',
    instruction: 'Finally, flick your pinky downwards',
    isComplete: false
  }
];

export class CalibrationManager {
  private currentStepIndex: number = 0;
  private steps: CalibrationStep[] = [];
  private capturedDisplacements: { dir: Direction; dx: number; dy: number }[] = [];
  private onCompleteCallback: ((data: CalibrationData) => void) | null = null;

  constructor() {
    this.reset();
  }

  public reset() {
    this.currentStepIndex = 0;
    this.capturedDisplacements = [];
    this.steps = CALIBRATION_STEPS.map((s) => ({ ...s, isComplete: false }));
  }

  public getCurrentStep(): CalibrationStep | null {
    if (this.currentStepIndex >= this.steps.length) {
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  public getSteps(): CalibrationStep[] {
    return this.steps;
  }

  public isFinished(): boolean {
    return this.currentStepIndex >= this.steps.length;
  }

  public onComplete(cb: (data: CalibrationData) => void) {
    this.onCompleteCallback = cb;
  }

  public checkDirection(detected: Direction | null, dx: number, dy: number): boolean {
    if (this.isFinished() || !detected) return false;

    const current = this.getCurrentStep();
    if (!current) return false;

    if (detected === current.targetDirection) {
      current.isComplete = true;
      current.detectedDisplacement = { dx, dy };
      this.capturedDisplacements.push({ dir: detected, dx, dy });

      sound.playCountdown(true);
      this.currentStepIndex++;

      if (this.isFinished()) {
        const calData = this.calculateCalibration();
        if (this.onCompleteCallback) {
          this.onCompleteCallback(calData);
        }
      }
      return true;
    }

    return false;
  }

  private calculateCalibration(): CalibrationData {
    // Average magnitude of successful flicks
    let sumMag = 0;
    for (const c of this.capturedDisplacements) {
      sumMag += Math.hypot(c.dx, c.dy);
    }
    const avgMag = this.capturedDisplacements.length > 0
      ? sumMag / this.capturedDisplacements.length
      : 0.05;

    // Set threshold at ~45% of user's typical movement
    const threshold = Math.max(0.02, Math.min(0.08, avgMag * 0.45));

    return {
      thresholdX: threshold,
      thresholdY: threshold,
      dominantAxisRatio: 1.15,
      isCalibrated: true
    };
  }
}
