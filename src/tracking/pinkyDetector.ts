import { Direction } from '../types/game';
import { Landmark2D, PinkyLandmarks, PinkyTrackingFrame, TrackingStatus, PinkyDebugInfo } from '../types/tracking';
import { ExponentialSmoothingFilter } from './smoothing';

export interface PinkyDetectorConfig {
  sensitivity: number; // 1 to 5, default 3
  lockoutDurationMs: number; // Cooldown after triggering direction, default 180ms
  smoothingAlpha: number; // EMA alpha, default 0.35 (responsive lightweight smoothing)
  dominantAxisRatio: number; // Dominant axis threshold ratio, default 1.15
}

export class PinkyDetector {
  private tipFilter: ExponentialSmoothingFilter;
  private relFilter: ExponentialSmoothingFilter;
  private config: PinkyDetectorConfig;
  private anchorRelPoint: Landmark2D | null = null;
  private pinkyPositions: Array<{ x: number; y: number; time: number }> = [];
  private lastTriggerTime: number = 0;
  private lastSeenTime: number = 0;
  private status: TrackingStatus = 'NOT_STARTED';
  private lastDetectedDirection: Direction | null = null;

  constructor(config?: Partial<PinkyDetectorConfig>) {
    this.config = {
      sensitivity: 3,
      lockoutDurationMs: 120,
      smoothingAlpha: 0.35,
      dominantAxisRatio: 1.05,
      ...config
    };
    this.tipFilter = new ExponentialSmoothingFilter(this.config.smoothingAlpha);
    this.relFilter = new ExponentialSmoothingFilter(this.config.smoothingAlpha);
  }

  public setSensitivity(sensitivity: number) {
    this.config.sensitivity = Math.max(1, Math.min(5, sensitivity));
  }

  public getStatus(): TrackingStatus {
    return this.status;
  }

  public reset() {
    this.tipFilter.reset();
    this.relFilter.reset();
    this.anchorRelPoint = null;
    this.pinkyPositions = [];
    this.lastTriggerTime = 0;
    this.lastSeenTime = 0;
    this.lastDetectedDirection = null;
    this.status = 'NOT_STARTED';
  }

  /**
   * Dead-zone threshold in normalized hand-scale units
   * Tuned to reject ambient jitter while responding instantaneously to intentional pinky movements
   */
  public getThreshold(): number {
    switch (this.config.sensitivity) {
      case 1: return 0.055;
      case 2: return 0.040;
      case 3: return 0.028;
      case 4: return 0.018;
      case 5: return 0.010;
      default: return 0.028;
    }
  }

  /**
   * Process landmarks for a single video frame
   * @param rawLandmarks Array of 21 landmarks from MediaPipe Hand Landmarker
   * @param isMirrored True if webcam is mirrored for user selfie view
   */
  public processFrame(
    rawLandmarks: Landmark2D[] | null | undefined,
    isMirrored: boolean = true
  ): PinkyTrackingFrame | null {
    const now = Date.now();

    // 1. Hand presence validation
    if (!rawLandmarks || rawLandmarks.length < 21) {
      if (this.status !== 'NOT_STARTED') {
        if (now - this.lastSeenTime > 300) {
          this.status = 'PINKY_LOST';
        }
      }
      return null;
    }

    const wasLost = this.status === 'PINKY_LOST' || this.status === 'NOT_STARTED';
    this.lastSeenTime = now;
    this.status = 'PINKY_TRACKED';

    // Key anatomical landmarks:
    // Landmark 0: Wrist
    // Landmark 9: Middle MCP (palm center anchor)
    // Landmark 17: Pinky MCP (knuckle base of pinky)
    // Landmark 18: Pinky PIP
    // Landmark 19: Pinky DIP
    // Landmark 20: Pinky TIP (primary control point)
    const rawWrist = rawLandmarks[0];
    const rawMiddleMcp = rawLandmarks[9];
    const rawMcp = rawLandmarks[17];
    const rawTip = rawLandmarks[20];

    // Hand scale reference (wrist to middle knuckle)
    // Makes calculations invariant to user distance from webcam
    const handScale = Math.hypot(
      rawMiddleMcp.x - rawWrist.x,
      rawMiddleMcp.y - rawWrist.y
    ) || Math.hypot(rawMcp.x - rawWrist.x, rawMcp.y - rawWrist.y) || 0.15;

    // Relative pinky vector: Tip relative to Pinky MCP base, normalized by hand scale
    // This gives:
    // 1. Whole-hand translation invariance: when whole hand moves, Tip and MCP move together
    // 2. Non-pinky finger invariance: index, thumb, middle, ring finger movements leave 17 & 20 unchanged
    // 3. User coordinate consistency:
    //    Flicking right -> positive relX (+dx)
    //    Flicking left -> negative relX (-dx)
    //    Flicking up -> negative relY (-dy)
    //    Flicking down -> positive relY (+dy)
    const relX = (isMirrored ? (rawMcp.x - rawTip.x) : (rawTip.x - rawMcp.x)) / handScale;
    const relY = (rawTip.y - rawMcp.y) / handScale;

    // Absolute normalized screen tip coordinates (for canvas preview and HUD indicator)
    const normalizedRawTip: Landmark2D = {
      x: isMirrored ? 1.0 - rawTip.x : rawTip.x,
      y: rawTip.y,
      z: rawTip.z
    };
    const smoothedTip = this.tipFilter.filter(normalizedRawTip);

    // Smooth relative pinky coordinates using lightweight EMA filter
    const smoothedRel = this.relFilter.filter({ x: relX, y: relY });

    // When re-entering view after being lost, or on initialization, reset anchor without triggering
    if (wasLost || !this.anchorRelPoint) {
      this.anchorRelPoint = { ...smoothedRel };
      this.pinkyPositions = [{ x: smoothedRel.x, y: smoothedRel.y, time: now }];
      return {
        timestamp: now,
        rawTip: normalizedRawTip,
        smoothedTip,
        displacement: { dx: 0, dy: 0 },
        detectedDirection: null,
        confidence: 1.0,
        isPinkyRaised: true,
        debug: {
          pinkyX: parseFloat(smoothedTip.x.toFixed(2)),
          pinkyY: parseFloat(smoothedTip.y.toFixed(2)),
          deltaX: 0,
          deltaY: 0,
          direction: null,
          status: this.status
        }
      };
    }

    // Maintain sliding movement window (up to 8 frames or 250ms)
    this.pinkyPositions.push({ x: smoothedRel.x, y: smoothedRel.y, time: now });
    while (this.pinkyPositions.length > 8 || (this.pinkyPositions.length > 2 && now - this.pinkyPositions[0].time > 250)) {
      this.pinkyPositions.shift();
    }

    // Window movement delta (from start of active gesture window to current position)
    const startPos = this.pinkyPositions[0];
    const windowDx = smoothedRel.x - startPos.x;
    const windowDy = smoothedRel.y - startPos.y;

    // Anchor displacement delta
    const anchorDx = smoothedRel.x - this.anchorRelPoint.x;
    const anchorDy = smoothedRel.y - this.anchorRelPoint.y;

    // Use strongest directional movement signal
    const dx = Math.abs(windowDx) > Math.abs(anchorDx) ? windowDx : anchorDx;
    const dy = Math.abs(windowDy) > Math.abs(anchorDy) ? windowDy : anchorDy;
    const distance = Math.hypot(anchorDx, anchorDy);
    const threshold = this.getThreshold();

    // Subtle drift: when pinky is resting stationary, slowly adapt anchor
    if (distance < threshold * 0.35) {
      this.anchorRelPoint.x += (smoothedRel.x - this.anchorRelPoint.x) * 0.05;
      this.anchorRelPoint.y += (smoothedRel.y - this.anchorRelPoint.y) * 0.05;
    }

    let detectedDirection: Direction | null = null;
    const isLockedOut = (now - this.lastTriggerTime) < this.config.lockoutDurationMs;

    // Movement detection: trigger immediately when displacement exceeds threshold
    if (!isLockedOut && (Math.abs(dx) >= threshold || Math.abs(dy) >= threshold)) {
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Dominant-axis detection
      if (absDx >= absDy) {
        detectedDirection = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        detectedDirection = dy > 0 ? 'DOWN' : 'UP';
      }

      if (detectedDirection) {
        this.lastTriggerTime = now;
        this.lastDetectedDirection = detectedDirection;
        // Immediately reset anchor and position window to current point
        // This lets subsequent turns trigger naturally from wherever the finger currently is!
        this.anchorRelPoint = { ...smoothedRel };
        this.pinkyPositions = [{ x: smoothedRel.x, y: smoothedRel.y, time: now }];
      }
    }

    const debug: PinkyDebugInfo = {
      pinkyX: parseFloat(smoothedTip.x.toFixed(2)),
      pinkyY: parseFloat(smoothedTip.y.toFixed(2)),
      deltaX: parseFloat(dx.toFixed(2)),
      deltaY: parseFloat(dy.toFixed(2)),
      direction: detectedDirection || this.lastDetectedDirection,
      status: this.status
    };

    return {
      timestamp: now,
      rawTip: normalizedRawTip,
      smoothedTip,
      displacement: { dx, dy },
      detectedDirection,
      confidence: 1.0,
      isPinkyRaised: true, // Do not gate on finger pose; natural pinky movements always register
      debug
    };
  }

  public extractPinkyJoints(
    rawLandmarks: Landmark2D[] | null | undefined,
    isMirrored: boolean = true
  ): PinkyLandmarks | null {
    if (!rawLandmarks || rawLandmarks.length < 21) return null;

    const mirror = (l: Landmark2D): Landmark2D => ({
      x: isMirrored ? 1.0 - l.x : l.x,
      y: l.y,
      z: l.z
    });

    return {
      mcp: mirror(rawLandmarks[17]),
      pip: mirror(rawLandmarks[18]),
      dip: mirror(rawLandmarks[19]),
      tip: mirror(rawLandmarks[20])
    };
  }
}
