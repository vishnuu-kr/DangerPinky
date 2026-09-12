import { describe, it, expect } from 'vitest';
import { ExponentialSmoothingFilter, MovingAverageFilter } from '../tracking/smoothing';
import { PinkyDetector } from '../tracking/pinkyDetector';
import { CalibrationManager } from '../tracking/calibration';
import { Landmark2D } from '../types/tracking';

// Helper to construct a realistic 21-landmark hand in rest pose
function createRestingHand(offsetX: number = 0, offsetY: number = 0): Landmark2D[] {
  const landmarks: Landmark2D[] = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5 }));

  // Wrist
  landmarks[0] = { x: 0.5 + offsetX, y: 0.8 + offsetY };

  // Thumb
  landmarks[1] = { x: 0.42 + offsetX, y: 0.72 + offsetY };
  landmarks[2] = { x: 0.38 + offsetX, y: 0.64 + offsetY };
  landmarks[3] = { x: 0.34 + offsetX, y: 0.58 + offsetY };
  landmarks[4] = { x: 0.30 + offsetX, y: 0.52 + offsetY };

  // Index
  landmarks[5] = { x: 0.44 + offsetX, y: 0.55 + offsetY };
  landmarks[6] = { x: 0.43 + offsetX, y: 0.45 + offsetY };
  landmarks[7] = { x: 0.42 + offsetX, y: 0.38 + offsetY };
  landmarks[8] = { x: 0.41 + offsetX, y: 0.32 + offsetY };

  // Middle
  landmarks[9] = { x: 0.50 + offsetX, y: 0.52 + offsetY };
  landmarks[10] = { x: 0.50 + offsetX, y: 0.42 + offsetY };
  landmarks[11] = { x: 0.50 + offsetX, y: 0.35 + offsetY };
  landmarks[12] = { x: 0.50 + offsetX, y: 0.28 + offsetY };

  // Ring
  landmarks[13] = { x: 0.56 + offsetX, y: 0.55 + offsetY };
  landmarks[14] = { x: 0.57 + offsetX, y: 0.46 + offsetY };
  landmarks[15] = { x: 0.58 + offsetX, y: 0.40 + offsetY };
  landmarks[16] = { x: 0.58 + offsetX, y: 0.34 + offsetY };

  // Pinky (17: MCP, 18: PIP, 19: DIP, 20: TIP)
  landmarks[17] = { x: 0.62 + offsetX, y: 0.58 + offsetY };
  landmarks[18] = { x: 0.63 + offsetX, y: 0.50 + offsetY };
  landmarks[19] = { x: 0.64 + offsetX, y: 0.44 + offsetY };
  landmarks[20] = { x: 0.65 + offsetX, y: 0.38 + offsetY };

  return landmarks;
}

describe('Pinky Tracking & Gesture Detection', () => {
  it('smooths coordinates with Exponential Moving Average', () => {
    const filter = new ExponentialSmoothingFilter(0.5);

    const first = filter.filter({ x: 0.2, y: 0.4 });
    expect(first.x).toBe(0.2);
    expect(first.y).toBe(0.4);

    const second = filter.filter({ x: 0.4, y: 0.6 });
    expect(second.x).toBeCloseTo(0.3);
    expect(second.y).toBeCloseTo(0.5);
  });

  it('smooths coordinates with Moving Average', () => {
    const ma = new MovingAverageFilter(3);

    ma.filter({ x: 10, y: 10 });
    ma.filter({ x: 20, y: 20 });
    const third = ma.filter({ x: 30, y: 30 });

    expect(third.x).toBe(20);
    expect(third.y).toBe(20);
  });

  it('ignores tiny tracking noise below threshold', () => {
    const detector = new PinkyDetector({ sensitivity: 3, lockoutDurationMs: 0 });
    const hand = createRestingHand();

    // First frame initializes anchor
    const f1 = detector.processFrame(hand, true);
    expect(f1).toBeDefined();
    expect(f1?.detectedDirection).toBeNull();

    // Second frame with micro jitter (<0.005)
    hand[20] = { x: hand[20].x + 0.003, y: hand[20].y + 0.002 };
    const f2 = detector.processFrame(hand, true);
    expect(f2?.detectedDirection).toBeNull(); // Discarded as noise
  });

  it('rejects whole-hand translation (Test 8: Whole-Hand Movement Test)', () => {
    const detector = new PinkyDetector({ sensitivity: 3, lockoutDurationMs: 0 });

    // Initial hand position
    const hand1 = createRestingHand(0, 0);
    detector.processFrame(hand1, true);

    // Entire hand moves significantly right and down (+0.12, +0.08)
    // The pinky remains stable relative to the palm
    const hand2 = createRestingHand(0.12, 0.08);
    const result = detector.processFrame(hand2, true);

    // Must NOT trigger any direction because pinky did not move relative to hand
    expect(result?.detectedDirection).toBeNull();
  });

  it('rejects movements of other fingers (Test 9: Other Finger Test)', () => {
    const detector = new PinkyDetector({ sensitivity: 3, lockoutDurationMs: 0 });

    const hand = createRestingHand();
    detector.processFrame(hand, true);

    // Move index, thumb, middle, and ring fingers vigorously
    hand[4] = { x: 0.20, y: 0.40 }; // Thumb flick
    hand[8] = { x: 0.35, y: 0.20 }; // Index flick
    hand[12] = { x: 0.50, y: 0.18 }; // Middle flick
    hand[16] = { x: 0.60, y: 0.22 }; // Ring flick
    // Pinky landmarks 17-20 remain in place

    const result = detector.processFrame(hand, true);
    expect(result?.detectedDirection).toBeNull();
  });

  it('detects pinky flick RIGHT when moving pinky right', () => {
    const detector = new PinkyDetector({ sensitivity: 3, lockoutDurationMs: 0 });
    const hand = createRestingHand();
    detector.processFrame(hand, true);

    // In mirrored video, physical right moves rawTip to camera-left
    hand[20] = { x: hand[20].x - 0.12, y: hand[20].y };
    const result = detector.processFrame(hand, true);

    expect(result?.detectedDirection).toBe('RIGHT');
  });

  it('detects pinky flick LEFT when moving pinky left', () => {
    const detector = new PinkyDetector({ sensitivity: 3, lockoutDurationMs: 0 });
    const hand = createRestingHand();
    detector.processFrame(hand, true);

    // In mirrored video, physical left moves rawTip to camera-right
    hand[20] = { x: hand[20].x + 0.12, y: hand[20].y };
    const result = detector.processFrame(hand, true);

    expect(result?.detectedDirection).toBe('LEFT');
  });

  it('detects pinky flick UP when moving pinky up', () => {
    const detector = new PinkyDetector({ sensitivity: 3, lockoutDurationMs: 0 });
    const hand = createRestingHand();
    detector.processFrame(hand, true);

    // In screen coordinates, moving UP decreases Y
    hand[20] = { x: hand[20].x, y: hand[20].y - 0.12 };
    const result = detector.processFrame(hand, true);

    expect(result?.detectedDirection).toBe('UP');
  });

  it('detects pinky flick DOWN when moving pinky down', () => {
    const detector = new PinkyDetector({ sensitivity: 3, lockoutDurationMs: 0 });
    const hand = createRestingHand();
    detector.processFrame(hand, true);

    // In screen coordinates, moving DOWN increases Y
    hand[20] = { x: hand[20].x, y: hand[20].y + 0.12 };
    const result = detector.processFrame(hand, true);

    expect(result?.detectedDirection).toBe('DOWN');
  });

  it('cycles through 4-direction calibration correctly', () => {
    const manager = new CalibrationManager();
    expect(manager.getCurrentStep()?.targetDirection).toBe('RIGHT');

    // Wrong direction doesn't advance
    const wrong = manager.checkDirection('UP', 0, -0.05);
    expect(wrong).toBe(false);
    expect(manager.getCurrentStep()?.targetDirection).toBe('RIGHT');

    // Right direction advances to LEFT
    const right = manager.checkDirection('RIGHT', 0.05, 0);
    expect(right).toBe(true);
    expect(manager.getCurrentStep()?.targetDirection).toBe('LEFT');

    // Complete remaining steps
    manager.checkDirection('LEFT', -0.05, 0);
    manager.checkDirection('UP', 0, -0.05);
    manager.checkDirection('DOWN', 0, 0.05);

    expect(manager.isFinished()).toBe(true);
    expect(manager.getCurrentStep()).toBeNull();
  });
});
