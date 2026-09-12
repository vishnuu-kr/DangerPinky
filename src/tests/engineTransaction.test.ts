import { describe, it, expect, beforeEach } from 'vitest';
import { SnakeEngine } from '../game/engine';
import { DEFAULT_GAME_CONFIG } from '../game/constants';
import { getDemoFiles } from '../filesystem/demoFiles';

describe('SnakeEngine Transactional Consumption', () => {
  let engine: SnakeEngine;
  const demoFiles = getDemoFiles();

  beforeEach(() => {
    // Initialize engine with autoConsume = false (Transactional Real Mode)
    engine = new SnakeEngine(DEFAULT_GAME_CONFIG, demoFiles, false);
  });

  it('detects collidedFood on step without immediately modifying score or growing snake', () => {
    const food = engine.getFood()!;
    const head = engine.getSnakeState().body[0];
    const initialScore = engine.getScore();
    const initialLength = engine.getSnakeState().body.length;

    // Place food directly ahead of snake head
    food.position = { x: head.x + 1, y: head.y };

    const stepResult = engine.step();

    expect(stepResult.gameOver).toBe(false);
    expect(stepResult.collidedFood).toBeDefined();
    expect(stepResult.collidedFood?.file.id).toBe(food.file.id);

    // CRITICAL: Score must NOT have incremented yet!
    expect(engine.getScore()).toBe(initialScore);
    // CRITICAL: Snake body length must NOT have grown yet!
    expect(engine.getSnakeState().body.length).toBe(initialLength);
    // CRITICAL: Files eaten list must remain empty until commit
    expect(engine.getFilesEaten().length).toBe(0);
  });

  it('commits food consumption upon successful transaction', () => {
    const food = engine.getFood()!;
    const head = engine.getSnakeState().body[0];
    food.position = { x: head.x + 1, y: head.y };

    const stepResult = engine.step();
    const collidedFood = stepResult.collidedFood!;

    // Now commit the transaction (simulating successful Recycle Bin move)
    const commitResult = engine.commitFoodConsumption(collidedFood);

    expect(commitResult.score).toBe(1);
    expect(commitResult.eatenFile.id).toBe(collidedFood.file.id);
    expect(engine.getScore()).toBe(1);
    expect(engine.getFilesEaten().length).toBe(1);

    // Verify next food has spawned
    expect(engine.getFood()).toBeDefined();

    // Verify snake grows on subsequent step
    const lengthBeforeStep = engine.getSnakeState().body.length;
    engine.step();
    expect(engine.getSnakeState().body.length).toBe(lengthBeforeStep + 1);
  });

  it('cancels food consumption safely when transaction fails (e.g. locked or missing file)', () => {
    const food = engine.getFood()!;
    const head = engine.getSnakeState().body[0];
    food.position = { x: head.x + 1, y: head.y };

    const stepResult = engine.step();
    const collidedFood = stepResult.collidedFood!;

    // Cancel the transaction (simulating locked/missing file)
    engine.cancelFoodConsumption(collidedFood, 'File locked by another application');

    // CRITICAL: Score must remain 0
    expect(engine.getScore()).toBe(0);
    expect(engine.getFilesEaten().length).toBe(0);

    // Verify replacement food spawned so gameplay continues seamlessly
    expect(engine.getFood()).toBeDefined();

    // Verify snake does NOT grow on next step
    const lengthBeforeStep = engine.getSnakeState().body.length;
    engine.step();
    expect(engine.getSnakeState().body.length).toBe(lengthBeforeStep);
  });
});
