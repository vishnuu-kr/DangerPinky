import { Landmark2D } from '../types/tracking';

export class ExponentialSmoothingFilter {
  private alpha: number;
  private current: Landmark2D | null = null;

  constructor(alpha: number = 0.45) {
    this.alpha = alpha;
  }

  public setAlpha(alpha: number) {
    this.alpha = Math.max(0.01, Math.min(1.0, alpha));
  }

  public filter(raw: Landmark2D): Landmark2D {
    if (!this.current) {
      this.current = { ...raw };
      return { ...raw };
    }

    this.current = {
      x: this.alpha * raw.x + (1 - this.alpha) * this.current.x,
      y: this.alpha * raw.y + (1 - this.alpha) * this.current.y,
      z: raw.z !== undefined && this.current.z !== undefined
        ? this.alpha * raw.z + (1 - this.alpha) * this.current.z
        : raw.z
    };

    return { ...this.current };
  }

  public reset() {
    this.current = null;
  }
}

export class MovingAverageFilter {
  private windowSize: number;
  private history: Landmark2D[] = [];

  constructor(windowSize: number = 4) {
    this.windowSize = windowSize;
  }

  public filter(raw: Landmark2D): Landmark2D {
    this.history.push(raw);
    if (this.history.length > this.windowSize) {
      this.history.shift();
    }

    const sum = this.history.reduce(
      (acc, item) => ({
        x: acc.x + item.x,
        y: acc.y + item.y,
        z: (acc.z || 0) + (item.z || 0)
      }),
      { x: 0, y: 0, z: 0 }
    );

    const len = this.history.length;
    return {
      x: sum.x / len,
      y: sum.y / len,
      z: (sum.z || 0) / len
    };
  }

  public reset() {
    this.history = [];
  }
}
