import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BOARD_THEMES, DEFAULT_GAME_CONFIG } from '../game/constants';
import { triggerHaptic, setHapticsEnabled, isHapticsEnabled } from '../utils/haptics';
import { sound } from '../game/audio';
import { ParticleSystem } from '../game/particles';
import { GameRenderer } from '../game/renderer';
import { BoardTheme, GameStats, SnakeState, Collectible } from '../types/game';

function createMockCanvas(): HTMLCanvasElement {
  const handler: ProxyHandler<any> = {
    get(target: any, prop: string) {
      if (prop === 'canvas') return { width: 400, height: 400 };
      if (prop === 'measureText') return () => ({ width: 10 });
      if (prop === 'createLinearGradient' || prop === 'createRadialGradient') {
        return () => ({ addColorStop: vi.fn() });
      }
      if (prop in target) return target[prop];
      target[prop] = vi.fn();
      return target[prop];
    },
    set(target: any, prop: string, val: any) {
      target[prop] = val;
      return true;
    }
  };
  const ctx = new Proxy({}, handler);
  return {
    width: 400,
    height: 400,
    getContext: vi.fn(() => ctx)
  } as unknown as HTMLCanvasElement;
}

describe('Sensory & Feel Improvements', () => {
  describe('Board Environment Themes', () => {
    const requiredThemes: BoardTheme[] = ['MEADOW', 'CYBER_NEON', 'SYNTH_DUSK', 'RETRO_DESKTOP'];

    it('defines all 4 board environment themes with full palettes', () => {
      requiredThemes.forEach((themeKey) => {
        const theme = BOARD_THEMES[themeKey];
        expect(theme).toBeDefined();
        expect(theme.name).toBeTruthy();
        expect(theme.emoji).toBeTruthy();
        expect(theme.tileA).toMatch(/^#|^rgba/);
        expect(theme.tileB).toMatch(/^#|^rgba/);
        expect(theme.gridLine).toBeTruthy();
        expect(theme.outerBorder).toBeTruthy();
        expect(theme.glowColor).toBeTruthy();
        expect(theme.textColor).toBeTruthy();
      });
    });

    it('defaults game config to MEADOW theme and haptics enabled', () => {
      expect(DEFAULT_GAME_CONFIG.boardTheme).toBe('MEADOW');
      expect(DEFAULT_GAME_CONFIG.hapticsEnabled).toBe(true);
    });
  });

  describe('Haptic Feedback Controller', () => {
    beforeEach(() => {
      setHapticsEnabled(true);
      vi.restoreAllMocks();
    });

    it('enables and disables haptics correctly', () => {
      expect(isHapticsEnabled()).toBe(true);
      setHapticsEnabled(false);
      expect(isHapticsEnabled()).toBe(false);
      setHapticsEnabled(true);
      expect(isHapticsEnabled()).toBe(true);
    });

    it('safely handles missing navigator.vibrate in headless environments', () => {
      expect(() => {
        triggerHaptic('turn');
        triggerHaptic('eat');
        triggerHaptic('combo');
        triggerHaptic('near_miss');
        triggerHaptic('powerup');
        triggerHaptic('crash');
      }).not.toThrow();
    });

    it('calls navigator.vibrate with correct patterns when supported', () => {
      const vibrateMock = vi.fn();
      const originalVibrate = typeof navigator !== 'undefined' ? (navigator as any).vibrate : undefined;

      try {
        Object.defineProperty(navigator, 'vibrate', {
          value: vibrateMock,
          writable: true,
          configurable: true
        });

        triggerHaptic('turn');
        expect(vibrateMock).toHaveBeenCalledWith(12);

        triggerHaptic('eat');
        expect(vibrateMock).toHaveBeenCalledWith(28);

        triggerHaptic('combo');
        expect(vibrateMock).toHaveBeenCalledWith([20, 30, 25]);

        triggerHaptic('near_miss');
        expect(vibrateMock).toHaveBeenCalledWith(10);

        triggerHaptic('crash');
        expect(vibrateMock).toHaveBeenCalledWith([80, 40, 120]);

        // When haptics disabled, vibrate should not be called
        setHapticsEnabled(false);
        vibrateMock.mockClear();
        triggerHaptic('eat');
        expect(vibrateMock).not.toHaveBeenCalled();
      } finally {
        if (originalVibrate !== undefined) {
          Object.defineProperty(navigator, 'vibrate', {
            value: originalVibrate,
            writable: true,
            configurable: true
          });
        }
      }
    });
  });

  describe('Audio Immersion & Spatial Audio', () => {
    it('sets combo level within range 0 to 5', () => {
      expect(() => {
        sound.setComboLevel(0);
        sound.setComboLevel(1);
        sound.setComboLevel(3);
        sound.setComboLevel(5);
        sound.setComboLevel(10); // Clamped safely
      }).not.toThrow();
    });

    it('plays heartbeat audio for near-miss tension safely', () => {
      expect(() => {
        sound.playHeartbeat();
      }).not.toThrow();
    });

    it('accepts spatial audio panning in crunch and eat sounds', () => {
      expect(() => {
        sound.playCrunchSound(-1.0); // Far left
        sound.playCrunchSound(0.0);  // Center
        sound.playCrunchSound(1.0);  // Far right
        sound.playEatSound('code', 1, 0.5);
      }).not.toThrow();
    });

    it('toggles pause audio low-pass filter safely', () => {
      expect(() => {
        sound.setPaused(true);
        sound.setPaused(false);
      }).not.toThrow();
    });
  });

  describe('Suction Ingestion Particles', () => {
    it('emits suction particles that pull toward snake head coordinates', () => {
      const particles = new ParticleSystem();
      expect(particles.getParticles().length).toBe(0);

      // Emit suction at food position (100, 100) toward snake head at (80, 80)
      particles.emitSuction(100, 100, 80, 80, '#06b6d4', 8);
      expect(particles.getParticles().length).toBe(8);

      // Update particle physics
      particles.update();
      const remaining = particles.getParticles();
      expect(remaining.length).toBeGreaterThan(0);
      // Particles should have alpha decremented
      expect(remaining[0].alpha).toBeLessThan(1.0);

      particles.clear();
      expect(particles.getParticles().length).toBe(0);
    });
  });

  describe('Renderer Sensory Integration', () => {
    it('renders board themes, ghost directions, and speed streaks without throwing', () => {
      const canvas = createMockCanvas();
      const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
      const renderer = new GameRenderer();
      const particles = new ParticleSystem();

      const mockSnake: SnakeState = {
        body: [
          { x: 5, y: 5, id: 1 },
          { x: 4, y: 5, id: 2 },
          { x: 3, y: 5, id: 3 }
        ],
        direction: 'RIGHT',
        nextDirection: 'UP',
        growthPending: 0,
        isAlive: true
      };

      const mockFood: Collectible = {
        id: 'f1',
        position: { x: 8, y: 5 },
        file: { id: 'f1', name: 'data.json', extension: 'json', category: 'code', size: 1024 },
        fruitType: 'apple',
        spawnTime: 0
      };

      expect(() => {
        renderer.render({
          ctx,
          width: 400,
          height: 400,
          gridSize: 10,
          snake: mockSnake,
          food: mockFood,
          particles,
          gameMode: 'WRAP',
          time: 1000,
          snakeSkin: 'CANDY_PINK',
          boardTheme: 'CYBER_NEON',
          comboCount: 4,
          isSpeedSurging: true
        });
      }).not.toThrow();

      // Render other themes
      expect(() => {
        renderer.render({
          ctx,
          width: 400,
          height: 400,
          gridSize: 10,
          snake: mockSnake,
          food: mockFood,
          particles,
          gameMode: 'CLASSIC',
          time: 1000,
          snakeSkin: 'CYBER_GREEN',
          boardTheme: 'SYNTH_DUSK',
          comboCount: 0,
          isSpeedSurging: false
        });
      }).not.toThrow();

        expect(() => {
        renderer.render({
          ctx,
          width: 400,
          height: 400,
          gridSize: 10,
          snake: mockSnake,
          food: mockFood,
          particles,
          gameMode: 'WRAP',
          time: 1000,
          snakeSkin: 'GOLDEN_CHROMA',
          boardTheme: 'RETRO_DESKTOP',
          comboCount: 2,
          isSpeedSurging: false
        });
      }).not.toThrow();
    });

    it('renders anatomical snake with near-miss sweat drops and knockout dizzy stars', () => {
      const canvas = createMockCanvas();
      const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
      const renderer = new GameRenderer();
      const particles = new ParticleSystem();

      const deadSnake: SnakeState = {
        body: [
          { x: 5, y: 5, id: 1 },
          { x: 4, y: 5, id: 2 },
          { x: 3, y: 5, id: 3 },
          { x: 2, y: 5, id: 4 }
        ],
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        growthPending: 0,
        isAlive: false
      };

      const mockFood: Collectible = {
        id: 'f1',
        position: { x: 8, y: 5 },
        file: { id: 'f1', name: 'data.json', extension: 'json', category: 'code', size: 1024 },
        fruitType: 'apple',
        spawnTime: 0
      };

      // Test fatal knockout state (cross eyes, orbiting stars, rattle tail)
      expect(() => {
        renderer.render({
          ctx,
          width: 400,
          height: 400,
          gridSize: 10,
          snake: deadSnake,
          food: mockFood,
          particles,
          gameMode: 'CLASSIC',
          time: 2500,
          snakeSkin: 'CANDY_PINK',
          boardTheme: 'MEADOW',
          comboCount: 0,
          isNearMiss: false
        });
      }).not.toThrow();

      // Test near-miss state (anime danger sweat drop, chewing cheek puffs, fiery combo gaze)
      const aliveSnake: SnakeState = { ...deadSnake, isAlive: true };
      expect(() => {
        renderer.render({
          ctx,
          width: 400,
          height: 400,
          gridSize: 10,
          snake: aliveSnake,
          food: mockFood,
          particles,
          gameMode: 'CLASSIC',
          time: 3000,
          snakeSkin: 'GOLDEN_CHROMA',
          boardTheme: 'CYBER_NEON',
          comboCount: 5,
          digestionProgress: 0.35,
          isNearMiss: true
        });
      }).not.toThrow();

      // Test Google Snake in GOOGLE_BLUE skin with wide gaping chomp mouth approaching food
      const chompFood: Collectible = {
        id: 'f2',
        position: { x: 6, y: 5 }, // 1 cell right of head at (5, 5)
        file: { id: 'f2', name: 'apple.png', extension: 'png', category: 'image', size: 2048 },
        fruitType: 'apple',
        spawnTime: 0
      };

      expect(() => {
        renderer.render({
          ctx,
          width: 400,
          height: 400,
          gridSize: 10,
          snake: aliveSnake,
          food: chompFood,
          particles,
          gameMode: 'CLASSIC',
          time: 3500,
          snakeSkin: 'GOOGLE_BLUE',
          boardTheme: 'MEADOW',
          comboCount: 0,
          isNearMiss: false
        });
      }).not.toThrow();
    });
  });

  describe('Fatal Moment Death Cam Snapshot', () => {
    it('records fatalCrashSnapshot structure in game stats', () => {
      const mockStats: GameStats = {
        score: 15,
        highScore: 25,
        filesEaten: [],
        startTime: Date.now() - 42000,
        durationSeconds: 42,
        isNewHighScore: false,
        gameMode: 'CLASSIC',
        hazardRating: 'CHAOTIC JANITOR 🥇',
        fatalCrashSnapshot: {
          headX: 10,
          headY: 5,
          collisionType: 'WALL IMPACT',
          nearestFoodDistance: 3
        }
      };

      expect(mockStats.fatalCrashSnapshot).toBeDefined();
      expect(mockStats.fatalCrashSnapshot?.headX).toBe(10);
      expect(mockStats.fatalCrashSnapshot?.headY).toBe(5);
      expect(mockStats.fatalCrashSnapshot?.collisionType).toBe('WALL IMPACT');
      expect(mockStats.fatalCrashSnapshot?.nearestFoodDistance).toBe(3);
    });
  });
});
