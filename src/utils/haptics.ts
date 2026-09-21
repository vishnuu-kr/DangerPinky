/**
 * Haptic Feedback Controller for DangerPinky
 * Safe wrapper around the HTML5 Vibration API (navigator.vibrate)
 * with graceful fallback in environments where haptics are unsupported.
 */

export type HapticType = 'turn' | 'eat' | 'combo' | 'crash' | 'near_miss' | 'powerup';

let hapticsEnabled = true;

export function setHapticsEnabled(enabled: boolean) {
  hapticsEnabled = enabled;
}

export function isHapticsEnabled(): boolean {
  return hapticsEnabled;
}

export function triggerHaptic(type: HapticType): boolean {
  if (!hapticsEnabled) return false;
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return false;

  try {
    switch (type) {
      case 'turn':
        // Crisp 12ms tick on steering flick
        return navigator.vibrate(12);

      case 'eat':
        // 28ms tactile thump on file ingestion
        return navigator.vibrate(28);

      case 'combo':
        // Rapid double pulse (20ms on, 30ms off, 25ms on)
        return navigator.vibrate([20, 30, 25]);

      case 'powerup':
        // Ascending power burst rumble
        return navigator.vibrate([15, 20, 35, 20, 45]);

      case 'near_miss':
        // Brief warning pulse
        return navigator.vibrate(10);

      case 'crash':
        // Heavy 160ms collision crash rumble
        return navigator.vibrate([80, 40, 120]);

      default:
        return false;
    }
  } catch {
    // Ignore restricted permission / user gesture errors
    return false;
  }
}
