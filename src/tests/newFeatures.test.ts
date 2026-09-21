import { describe, it, expect, beforeEach } from 'vitest';
import { SnakeEngine } from '../game/engine';
import { DEFAULT_GAME_CONFIG, SPECIAL_ITEMS, SNAKE_SKIN_PALETTES } from '../game/constants';
import { getDemoFiles } from '../filesystem/demoFiles';
import { PinkyDetector } from '../tracking/pinkyDetector';
import { sound } from '../game/audio';
import { getStoredLeaderboard, saveLeaderboardEntry } from '../utils/storage';
import { GameFile } from '../types/file';
import { LeaderboardEntry } from '../types/game';

describe('New Game Features & Improvements', () => {
  const demoFiles = getDemoFiles();

  describe('Combo Multiplier System', () => {
    it('increments combo multiplier when eating same category consecutively', () => {
      const engine = new SnakeEngine(DEFAULT_GAME_CONFIG, demoFiles, false);
      const codeFile1: GameFile = { id: 'c1', name: 'a.ts', extension: 'ts', category: 'code', size: 100 };
      const codeFile2: GameFile = { id: 'c2', name: 'b.ts', extension: 'ts', category: 'code', size: 200 };
      const codeFile3: GameFile = { id: 'c3', name: 'c.ts', extension: 'ts', category: 'code', size: 300 };

      // Food 1
      const res1 = engine.commitFoodConsumption({
        id: 'f1',
        position: { x: 0, y: 0 },
        file: codeFile1,
        fruitType: 'apple',
        spawnTime: 0
      });
      expect(res1.comboCount).toBe(1);
      expect(res1.newScore).toBe(1);

      // Food 2 of same category (code) -> combo 2
      const res2 = engine.commitFoodConsumption({
        id: 'f2',
        position: { x: 0, y: 0 },
        file: codeFile2,
        fruitType: 'apple',
        spawnTime: 0
      });
      expect(res2.comboCount).toBe(2);
      expect(res2.newScore).toBe(3); // 1 + 2

      // Food 3 of same category (code) -> combo 3
      const res3 = engine.commitFoodConsumption({
        id: 'f3',
        position: { x: 0, y: 0 },
        file: codeFile3,
        fruitType: 'apple',
        spawnTime: 0
      });
      expect(res3.comboCount).toBe(3);
      expect(res3.newScore).toBe(6); // 3 + 3
    });

    it('resets combo multiplier when eating different file category', () => {
      const engine = new SnakeEngine(DEFAULT_GAME_CONFIG, demoFiles, false);
      const codeFile: GameFile = { id: 'c1', name: 'a.ts', extension: 'ts', category: 'code', size: 100 };
      const imgFile: GameFile = { id: 'i1', name: 'a.png', extension: 'png', category: 'image', size: 200 };

      // Consecutive code files
      engine.commitFoodConsumption({
        id: 'f1',
        position: { x: 0, y: 0 },
        file: codeFile,
        fruitType: 'apple',
        spawnTime: 0
      });
      const res2 = engine.commitFoodConsumption({
        id: 'f2',
        position: { x: 0, y: 0 },
        file: codeFile,
        fruitType: 'apple',
        spawnTime: 0
      });
      expect(res2.comboCount).toBe(2);

      // Different category: image -> resets combo to 1
      const res3 = engine.commitFoodConsumption({
        id: 'f3',
        position: { x: 0, y: 0 },
        file: imgFile,
        fruitType: 'orange',
        spawnTime: 0
      });
      expect(res3.comboCount).toBe(1);
    });

    it('caps combo multiplier at maximum 5', () => {
      const engine = new SnakeEngine(DEFAULT_GAME_CONFIG, demoFiles, false);
      const docFile: GameFile = { id: 'd1', name: 'doc.pdf', extension: 'pdf', category: 'document', size: 100 };

      for (let i = 0; i < 7; i++) {
        engine.commitFoodConsumption({
          id: `d-${i}`,
          position: { x: 0, y: 0 },
          file: docFile,
          fruitType: 'strawberry',
          spawnTime: 0
        });
      }
      expect(engine.getComboCount()).toBe(5);
    });
  });

  describe('Zen Mode (Tail Slicing)', () => {
    it('slices tail on self-collision without game over when gameMode is ZEN', () => {
      const zenConfig = {
        ...DEFAULT_GAME_CONFIG,
        gridSize: 16,
        gameMode: 'ZEN' as const
      };
      const engine = new SnakeEngine(zenConfig, demoFiles, true);

      // Grow snake to 7 segments by eating 3 food items (initial 4 + 3 = 7)
      for (let i = 0; i < 3; i++) {
        const food = engine.getFood()!;
        const h = engine.getSnakeState().body[0];
        food.position = { x: h.x + 1, y: h.y };
        engine.step();
      }
      expect(engine.getSnakeState().body.length).toBe(7);

      // Make snake loop into its own body: currently moving RIGHT
      engine.setDirection('UP');
      engine.step();
      engine.setDirection('LEFT');
      engine.step();
      engine.setDirection('DOWN');
      const collisionStep = engine.step();

      // In ZEN mode, collision does not end the game
      expect(collisionStep.gameOver).toBe(false);
      expect(engine.getSnakeState().isAlive).toBe(true);
      expect(collisionStep.wasSliced).toBe(true);
      expect(engine.getSnakeState().body.length).toBeLessThan(7);
      expect(engine.getSnakeState().body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Special Wildcard Power-Ups', () => {
    it('defines metadata for all three power-up types', () => {
      expect(SPECIAL_ITEMS.TRIM_TAIL).toBeDefined();
      expect(SPECIAL_ITEMS.TRIM_TAIL.badge).toBe('CACHE -2');
      expect(SPECIAL_ITEMS.SPEED_BURST).toBeDefined();
      expect(SPECIAL_ITEMS.SPEED_BURST.badge).toBe('BOOM +5');
      expect(SPECIAL_ITEMS.DOUBLE_POINTS).toBeDefined();
      expect(SPECIAL_ITEMS.DOUBLE_POINTS.badge).toBe('2X BONUS');
    });

    it('applies TRIM_TAIL powerup by reducing snake body length', () => {
      const engine = new SnakeEngine(DEFAULT_GAME_CONFIG, demoFiles, false);
      const testFile: GameFile = { id: 't1', name: 'tmp.tmp', extension: 'tmp', category: 'other', size: 50 };

      // Manually extend body to length 6
      const body = (engine as any).snake.body;
      body.push({ x: 0, y: 0, id: 998 }, { x: 0, y: 1, id: 999 });
      expect(engine.getSnakeState().body.length).toBe(6);

      // Eat TRIM_TAIL special item
      engine.commitFoodConsumption({
        id: 'special-trim',
        position: { x: 0, y: 0 },
        file: testFile,
        fruitType: 'apple',
        spawnTime: 0,
        specialType: 'TRIM_TAIL'
      });

      // Body was trimmed by 2 segments
      expect(engine.getSnakeState().body.length).toBe(4);
    });

    it('applies SPEED_BURST by adding 5 bonus points', () => {
      const engine = new SnakeEngine(DEFAULT_GAME_CONFIG, demoFiles, false);
      const testFile: GameFile = { id: 't2', name: 'bomb.zip', extension: 'zip', category: 'archive', size: 500 };

      const res = engine.commitFoodConsumption({
        id: 'special-burst',
        position: { x: 0, y: 0 },
        file: testFile,
        fruitType: 'orange',
        spawnTime: 0,
        specialType: 'SPEED_BURST'
      });

      // 1 base + 5 bonus = 6 points
      expect(res.newScore).toBe(6);
    });

    it('applies DOUBLE_POINTS by doubling combo points awarded', () => {
      const engine = new SnakeEngine(DEFAULT_GAME_CONFIG, demoFiles, false);
      const testFile: GameFile = { id: 't3', name: 'glitch.patch', extension: 'patch', category: 'code', size: 120 };

      const res = engine.commitFoodConsumption({
        id: 'special-double',
        position: { x: 0, y: 0 },
        file: testFile,
        fruitType: 'cherry',
        spawnTime: 0,
        specialType: 'DOUBLE_POINTS'
      });

      // (1 point * combo 1) * 2 = 2 points
      expect(res.newScore).toBe(2);
    });
  });

  describe('Computer Vision Finger Modes', () => {
    it('defaults to PINKY tracking and switches to INDEX pointer mode', () => {
      const detector = new PinkyDetector();
      expect(detector.getFingerMode()).toBe('PINKY');

      detector.setFingerMode('INDEX');
      expect(detector.getFingerMode()).toBe('INDEX');

      detector.setFingerMode('PINKY');
      expect(detector.getFingerMode()).toBe('PINKY');
    });
  });

  describe('Procedural 8-Bit Audio Synthesizer', () => {
    it('allows toggling BGM and setting volume safely', () => {
      sound.setBgmEnabled(true);
      sound.setBgmVolume(0.4);
      expect(() => sound.startBgm(140)).not.toThrow();
      expect(() => sound.stopBgm()).not.toThrow();
    });
  });

  describe('Leaderboard Storage', () => {
    let mockStore: Record<string, string> = {};
    beforeEach(() => {
      mockStore = {};
      (globalThis as any).localStorage = {
        getItem: (k: string) => mockStore[k] || null,
        setItem: (k: string, v: string) => { mockStore[k] = v; },
        removeItem: (k: string) => { delete mockStore[k]; },
        clear: () => { mockStore = {}; }
      };
    });

    it('saves leaderboard entries sorted descending and limits to top 5', () => {
      const baseEntry: Omit<LeaderboardEntry, 'id' | 'score'> = {
        date: 'Sep 21',
        mode: 'WRAP',
        filesCount: 5,
        bytesCleaned: 1024,
        durationSeconds: 30,
        isRealMode: false,
        hazardRating: 'NOVICE'
      };

      saveLeaderboardEntry({ ...baseEntry, id: '1', score: 10 });
      saveLeaderboardEntry({ ...baseEntry, id: '2', score: 50 });
      saveLeaderboardEntry({ ...baseEntry, id: '3', score: 30 });
      saveLeaderboardEntry({ ...baseEntry, id: '4', score: 70 });
      saveLeaderboardEntry({ ...baseEntry, id: '5', score: 20 });
      saveLeaderboardEntry({ ...baseEntry, id: '6', score: 40 });

      const top5 = getStoredLeaderboard();
      expect(top5.length).toBe(5);
      expect(top5[0].score).toBe(70);
      expect(top5[1].score).toBe(50);
      expect(top5[2].score).toBe(40);
      expect(top5[3].score).toBe(30);
      expect(top5[4].score).toBe(20);
    });
  });

  describe('Cosmetic Snake Skins', () => {
    it('provides palettes with head, body, highlight, and eye colors for all 5 skins', () => {
      const skins = ['GOOGLE_BLUE', 'CANDY_PINK', 'CYBER_GREEN', 'SYNTHWAVE', 'GOLDEN_CHROMA'] as const;
      for (const skin of skins) {
        const palette = SNAKE_SKIN_PALETTES[skin];
        expect(palette).toBeDefined();
        expect(palette.name).toBeTruthy();
        expect(palette.main).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(palette.dark).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(palette.highlight).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(palette.headTop).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(palette.headBottom).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(palette.eyeColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });
  });
});
