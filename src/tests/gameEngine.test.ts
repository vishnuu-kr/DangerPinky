import { describe, it, expect, beforeEach } from 'vitest';
import { SnakeEngine } from '../game/engine';
import { DEFAULT_GAME_CONFIG } from '../game/constants';
import { getDemoFiles } from '../filesystem/demoFiles';

describe('SnakeEngine Core Logic', () => {
  let engine: SnakeEngine;
  const demoFiles = getDemoFiles();

  beforeEach(() => {
    engine = new SnakeEngine(DEFAULT_GAME_CONFIG, demoFiles);
  });

  it('initializes snake with 4 segments centered on the grid', () => {
    const state = engine.getSnakeState();
    expect(state.body.length).toBe(4);
    expect(state.direction).toBe('RIGHT');
    expect(state.isAlive).toBe(true);

    const head = state.body[0];
    const neck = state.body[1];
    const tail = state.body[2];

    expect(head.x).toBe(Math.floor(DEFAULT_GAME_CONFIG.gridSize / 2));
    expect(neck.x).toBe(head.x - 1);
    expect(tail.x).toBe(head.x - 2);
  });

  it('rejects direct 180-degree reverse turns for all direction pairs', () => {
    // Heading RIGHT -> attempt LEFT
    expect(engine.setDirection('LEFT')).toBe(false);
    expect(engine.setDirection('UP')).toBe(true);
    engine.step(); // Now heading UP

    // Heading UP -> attempt DOWN
    expect(engine.setDirection('DOWN')).toBe(false);
    expect(engine.setDirection('LEFT')).toBe(true);
    engine.step(); // Now heading LEFT

    // Heading LEFT -> attempt RIGHT
    expect(engine.setDirection('RIGHT')).toBe(false);
    expect(engine.setDirection('DOWN')).toBe(true);
    engine.step(); // Now heading DOWN

    // Heading DOWN -> attempt UP
    expect(engine.setDirection('UP')).toBe(false);
  });

  it('wraps around seamlessly across all 4 boundaries without dying (V2 Wrap-Around)', () => {
    const config = { ...DEFAULT_GAME_CONFIG, gridSize: 6, gameMode: 'WRAP' as const };

    // Test RIGHT boundary wrap -> LEFT edge:
    const eRight = new SnakeEngine(config, demoFiles);
    eRight.step(); // x=4
    eRight.step(); // x=5
    const wrapRight = eRight.step(); // wraps to x=0
    expect(wrapRight.gameOver).toBe(false);
    expect(eRight.getSnakeState().body[0].x).toBe(0);

    // Test TOP boundary wrap -> BOTTOM edge:
    const eTop = new SnakeEngine(config, demoFiles);
    eTop.setDirection('UP');
    eTop.step(); // y=2
    eTop.step(); // y=1
    eTop.step(); // y=0
    const wrapTop = eTop.step(); // wraps to y=5
    expect(wrapTop.gameOver).toBe(false);
    expect(eTop.getSnakeState().body[0].y).toBe(5);

    // Test BOTTOM boundary wrap -> TOP edge:
    const eBottom = new SnakeEngine(config, demoFiles);
    eBottom.setDirection('DOWN');
    eBottom.step(); // y=4
    eBottom.step(); // y=5
    const wrapBottom = eBottom.step(); // wraps to y=0
    expect(wrapBottom.gameOver).toBe(false);
    expect(eBottom.getSnakeState().body[0].y).toBe(0);

    // Test LEFT boundary wrap -> RIGHT edge:
    const eLeft = new SnakeEngine(config, demoFiles);
    eLeft.setDirection('UP');
    eLeft.step();
    eLeft.setDirection('LEFT');
    eLeft.step(); // x=2
    eLeft.step(); // x=1
    eLeft.step(); // x=0
    const wrapLeft = eLeft.step(); // wraps to x=5
    expect(wrapLeft.gameOver).toBe(false);
    expect(eLeft.getSnakeState().body[0].x).toBe(5);
  });

  it('triggers game over on self-collision when snake loops into its own body', () => {
    const bigConfig = { ...DEFAULT_GAME_CONFIG, gridSize: 16, gameMode: 'CLASSIC' as const };
    const selfEngine = new SnakeEngine(bigConfig, demoFiles);

    // Grow snake to 7 segments by eating 3 food items (initial 4 + 3 = 7)
    for (let i = 0; i < 3; i++) {
      const food = selfEngine.getFood()!;
      const h = selfEngine.getSnakeState().body[0];
      food.position = { x: h.x + 1, y: h.y };
      selfEngine.step();
    }
    expect(selfEngine.getSnakeState().body.length).toBe(7);

    // Make snake loop: currently moving RIGHT
    // Turn UP
    selfEngine.setDirection('UP');
    selfEngine.step();

    // Turn LEFT
    selfEngine.setDirection('LEFT');
    selfEngine.step();

    // Turn DOWN into body
    selfEngine.setDirection('DOWN');
    const selfHit = selfEngine.step();

    expect(selfHit.gameOver).toBe(true);
    expect(selfHit.reason).toBe('SELF_COLLISION');
  });

  it('operates correctly with a single file in the folder (Test 23)', () => {
    const singleFile = [demoFiles[0]];
    const oneEngine = new SnakeEngine(DEFAULT_GAME_CONFIG, singleFile);

    expect(oneEngine.getFood()?.file.name).toBe(singleFile[0].name);

    // Eat the single file
    const food = oneEngine.getFood()!;
    const head = oneEngine.getSnakeState().body[0];
    food.position = { x: head.x + 1, y: head.y };
    const result = oneEngine.step();

    expect(result.newScore).toBe(1);
    expect(result.eatenFile?.name).toBe(singleFile[0].name);

    // New food spawns seamlessly recycling the single file
    expect(oneEngine.getFood()?.file.name).toBe(singleFile[0].name);
  });

  it('preserves active game state and score during non-destructive config updates', () => {
    const initialFood = engine.getFood()!;
    const head = engine.getSnakeState().body[0];
    initialFood.position = { x: head.x + 1, y: head.y };
    engine.step(); // score = 1

    expect(engine.getScore()).toBe(1);

    // Update config (e.g. sound volume or sensitivity)
    engine.updateConfig({ ...DEFAULT_GAME_CONFIG, soundVolume: 0.2, pinkySensitivity: 5 });

    // Score and snake must remain intact
    expect(engine.getScore()).toBe(1);
    expect(engine.getSnakeState().body.length).toBe(5);
  });

  it('moves head forward on step', () => {
    const initialHead = engine.getSnakeState().body[0];
    const result = engine.step();

    expect(result.gameOver).toBe(false);
    const newHead = engine.getSnakeState().body[0];
    expect(newHead.x).toBe(initialHead.x + 1);
    expect(newHead.y).toBe(initialHead.y);
  });

  it('maintains continuous file collection and growth across wrap-around boundaries (Section 17)', () => {
    const smallConfig = { ...DEFAULT_GAME_CONFIG, gridSize: 6, gameMode: 'WRAP' as const };
    const wrapEngine = new SnakeEngine(smallConfig, demoFiles);

    // Spawn food at the wrapped destination cell (0, 3)
    const food = wrapEngine.getFood()!;
    food.position = { x: 0, y: 3 };

    // Initial head at x=3, y=3. Step right 2 times -> x=5
    wrapEngine.step(); // x=4
    wrapEngine.step(); // x=5

    // Next step wraps to x=0 and eats the food at (0, 3)
    const wrapAndEat = wrapEngine.step(); // wraps to x=0, eats food!

    expect(wrapAndEat.gameOver).toBe(false);
    expect(wrapEngine.getSnakeState().body[0].x).toBe(0);
    expect(wrapAndEat.newScore).toBe(1);
    expect(wrapAndEat.eatenFile).toBeDefined();
    expect(wrapEngine.getScore()).toBe(1);
  });

  it('wraps around borders when gameMode is WRAP', () => {
    const wrapConfig = { ...DEFAULT_GAME_CONFIG, gridSize: 6, gameMode: 'WRAP' as const };
    const wrapEngine = new SnakeEngine(wrapConfig, demoFiles);

    wrapEngine.step(); // x=4
    wrapEngine.step(); // x=5
    const wrappedResult = wrapEngine.step(); // wraps to x=0

    expect(wrappedResult.gameOver).toBe(false);
    expect(wrapEngine.getSnakeState().body[0].x).toBe(0);
  });

  it('handles eating food, growing body, and increasing score', () => {
    const initialScore = engine.getScore();
    const initialLength = engine.getSnakeState().body.length;

    // Manually place food in front of snake
    const food = engine.getFood()!;
    const head = engine.getSnakeState().body[0];
    food.position = { x: head.x + 1, y: head.y };

    const result = engine.step();
    expect(result.gameOver).toBe(false);
    expect(result.newScore).toBe(initialScore + 1);
    expect(result.eatenFile).toBeDefined();

    // Body should now be 4 segments (growthPending was consumed)
    expect(engine.getSnakeState().body.length).toBe(initialLength + 1);
    expect(engine.getFilesEaten().length).toBe(1);
  });

  it('calculates dynamic tick speed scaling as files are eaten', () => {
    const dynamicConfig = {
      ...DEFAULT_GAME_CONFIG,
      difficulty: 'DYNAMIC' as const,
      initialSpeedMs: 140,
      minSpeedMs: 65,
      speedDecrementPerFood: 5
    };
    const dynEngine = new SnakeEngine(dynamicConfig, demoFiles);

    expect(dynEngine.getCurrentTickSpeed()).toBe(140);

    // Simulate eating 4 food items
    for (let i = 0; i < 4; i++) {
      const food = dynEngine.getFood()!;
      const h = dynEngine.getSnakeState().body[0];
      food.position = { x: h.x + 1, y: h.y };
      dynEngine.step();
    }

    // 140 - (4 * 5) = 120ms
    expect(dynEngine.getCurrentTickSpeed()).toBe(120);
  });

  it('triggers game over with WALL_COLLISION when gameMode is CLASSIC and snake hits borders', () => {
    const classicConfig = { ...DEFAULT_GAME_CONFIG, gridSize: 6, gameMode: 'CLASSIC' as const };

    // Test hitting right wall:
    const eRight = new SnakeEngine(classicConfig, demoFiles);
    // Initial head at x=3, y=3
    eRight.step(); // x=4
    eRight.step(); // x=5
    const hitRight = eRight.step(); // tries to go to x=6 -> wall collision
    expect(hitRight.gameOver).toBe(true);
    expect(hitRight.reason).toBe('WALL_COLLISION');

    // Test hitting top wall:
    const eTop = new SnakeEngine(classicConfig, demoFiles);
    eTop.setDirection('UP');
    eTop.step(); // y=2
    eTop.step(); // y=1
    eTop.step(); // y=0
    const hitTop = eTop.step(); // tries to go to y=-1 -> wall collision
    expect(hitTop.gameOver).toBe(true);
    expect(hitTop.reason).toBe('WALL_COLLISION');

    // Test hitting bottom wall:
    const eBottom = new SnakeEngine(classicConfig, demoFiles);
    eBottom.setDirection('DOWN');
    eBottom.step(); // y=4
    eBottom.step(); // y=5
    const hitBottom = eBottom.step(); // tries to go to y=6 -> wall collision
    expect(hitBottom.gameOver).toBe(true);
    expect(hitBottom.reason).toBe('WALL_COLLISION');

    // Test hitting left wall:
    const eLeft = new SnakeEngine(classicConfig, demoFiles);
    eLeft.setDirection('UP');
    eLeft.step(); // y=2, x=3
    eLeft.setDirection('LEFT');
    eLeft.step(); // x=2
    eLeft.step(); // x=1
    eLeft.step(); // x=0
    const hitLeft = eLeft.step(); // tries to go to x=-1 -> wall collision
    expect(hitLeft.gameOver).toBe(true);
    expect(hitLeft.reason).toBe('WALL_COLLISION');
  });

  it('triggers victory when snake fills the entire board (gameWon: true)', () => {
    const config = { ...DEFAULT_GAME_CONFIG, gridSize: 4, gameMode: 'WRAP' as const };
    const winEngine = new SnakeEngine(config, demoFiles);

    // 4x4 grid = 16 cells. Snake occupies 15 cells; cell (3, 3) is free.
    const bodySegments = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (!(x === 3 && y === 3)) {
          bodySegments.push({ id: y * 4 + x + 1, x, y });
        }
      }
    }

    // Head at (3, 2), moving DOWN into (3, 3)
    const nonHead = bodySegments.filter(s => !(s.x === 3 && s.y === 2));
    (winEngine as any).snake.body = [{ id: 99, x: 3, y: 2 }, ...nonHead];
    (winEngine as any).snake.direction = 'DOWN';
    (winEngine as any).snake.nextDirection = 'DOWN';

    // Place the food at the remaining cell (3, 3)
    const food = winEngine.getFood()!;
    food.position = { x: 3, y: 3 };

    const winResult = winEngine.step();
    expect(winResult.gameOver).toBe(true);
    expect(winResult.gameWon).toBe(true);
    expect(winResult.newScore).toBe(1);
  });
});

