import { Point, Direction, SnakeState, Collectible, GameConfig, FruitType } from '../types/game';
import { GameFile } from '../types/file';
import { DIFFICULTY_SPEEDS } from './constants';

export const FRUIT_TYPES: FruitType[] = ['apple', 'orange', 'grape', 'strawberry', 'watermelon', 'cherry'];

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT'
};

export const DIRECTION_DELTAS: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export interface StepResult {
  gameOver: boolean;
  gameWon?: boolean;
  reason?: 'WALL_COLLISION' | 'SELF_COLLISION';
  eatenFile?: GameFile;
  eatenFruit?: FruitType;
  eatenPosition?: Point;
  collidedFood?: Collectible;
  newScore: number;
}

export class SnakeEngine {
  private config: GameConfig;
  private snake: SnakeState;
  private food: Collectible | null = null;
  private availableFiles: GameFile[] = [];
  private unconsumedFiles: GameFile[] = [];
  private score: number = 0;
  private filesEaten: GameFile[] = [];
  private directionQueue: Direction[] = [];
  private autoConsume: boolean = true;

  constructor(config: GameConfig, files: GameFile[] = [], autoConsume: boolean = true) {
    this.config = config;
    this.autoConsume = autoConsume;
    this.availableFiles = files && files.length > 0 ? [...files] : [];
    this.resetFilePool();
    this.snake = this.createInitialSnake();
    this.spawnFood();
  }

  public setAutoConsume(auto: boolean) {
    this.autoConsume = auto;
  }

  public isAutoConsume(): boolean {
    return this.autoConsume;
  }

  private resetFilePool() {
    this.unconsumedFiles = this.availableFiles.length > 0 ? [...this.availableFiles] : [];
  }

  public reset(files?: GameFile[]) {
    if (files && files.length > 0) {
      this.availableFiles = [...files];
    }
    this.resetFilePool();
    this.score = 0;
    this.filesEaten = [];
    this.directionQueue = [];
    this.snake = this.createInitialSnake();
    this.spawnFood();
  }

  public updateConfig(config: GameConfig) {
    const oldGridSize = this.config.gridSize;
    this.config = config;
    if (oldGridSize !== config.gridSize) {
      this.reset(this.availableFiles);
    } else if (this.food && (this.food.position.x >= config.gridSize || this.food.position.y >= config.gridSize)) {
      this.spawnFood();
    }
  }

  public updateFiles(files: GameFile[]) {
    if (files && files.length > 0) {
      this.availableFiles = [...files];
      this.resetFilePool();
    }
  }

  private createInitialSnake(): SnakeState {
    const midX = Math.min(this.config.gridSize - 1, Math.max(3, Math.floor(this.config.gridSize / 2)));
    const midY = Math.floor(this.config.gridSize / 2);

    return {
      body: [
        { id: 1, x: midX, y: midY },
        { id: 2, x: midX - 1, y: midY },
        { id: 3, x: midX - 2, y: midY },
        { id: 4, x: midX - 3, y: midY }
      ],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      growthPending: 0,
      isAlive: true
    };
  }

  public setDirection(newDir: Direction): boolean {
    // Determine the baseline direction against which this new input is evaluated:
    // If moves are already queued, evaluate against the last queued move.
    // Otherwise, evaluate against the snake's active heading.
    const lastPlannedDirection = this.directionQueue.length > 0
      ? this.directionQueue[this.directionQueue.length - 1]
      : this.snake.direction;

    // Reject duplicate inputs
    if (lastPlannedDirection === newDir) {
      return false;
    }

    // Reject direct 180-degree reverse turns (suicide turns)
    if (OPPOSITE_DIRECTIONS[lastPlannedDirection] === newDir) {
      return false;
    }

    // Buffer up to 2 directions to guarantee crisp, responsive cornering
    if (this.directionQueue.length < 2) {
      this.directionQueue.push(newDir);
    } else {
      this.directionQueue[1] = newDir;
    }

    this.snake.nextDirection = this.directionQueue[0];
    return true;
  }

  public getSnakeState(): SnakeState {
    return { ...this.snake, body: [...this.snake.body] };
  }

  public getFood(): Collectible | null {
    return this.food;
  }

  public getScore(): number {
    return this.score;
  }

  public getFilesEaten(): GameFile[] {
    return [...this.filesEaten];
  }

  public getNextFile(): GameFile {
    if (this.availableFiles.length === 0) {
      return {
        id: `mock-${Date.now()}`,
        name: 'document.pdf',
        extension: 'pdf',
        category: 'document',
        size: 1024 * 45
      };
    }
    // If all files in pool have been consumed, refill pool gracefully (Section 17)
    if (this.unconsumedFiles.length === 0) {
      this.unconsumedFiles = [...this.availableFiles];
    }
    // Pop from unconsumed pool to prevent early repeats
    return this.unconsumedFiles.shift()!;
  }

  public spawnFood(): Collectible | null {
    const occupied = new Set<string>();
    for (const segment of this.snake.body) {
      occupied.add(`${segment.x},${segment.y}`);
    }

    const freeCells: Point[] = [];
    for (let x = 0; x < this.config.gridSize; x++) {
      for (let y = 0; y < this.config.gridSize; y++) {
        if (!occupied.has(`${x},${y}`)) {
          freeCells.push({ x, y });
        }
      }
    }

    if (freeCells.length === 0) {
      // Board completely filled! Player won
      return null;
    }

    const randomIndex = Math.floor(Math.random() * freeCells.length);
    const chosenPos = freeCells[randomIndex];
    const file = this.getNextFile();
    const fruitType = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];

    this.food = {
      id: `${file.id}-${Date.now()}`,
      position: chosenPos,
      file,
      fruitType,
      spawnTime: typeof performance !== 'undefined' ? performance.now() : Date.now()
    };

    return this.food;
  }

  public step(): StepResult {
    if (!this.snake.isAlive) {
      return { gameOver: true, newScore: this.score };
    }

    // Apply the next queued direction if available
    if (this.directionQueue.length > 0) {
      this.snake.direction = this.directionQueue.shift()!;
    } else {
      this.snake.direction = this.snake.nextDirection;
    }
    this.snake.nextDirection = this.directionQueue.length > 0
      ? this.directionQueue[0]
      : this.snake.direction;

    const delta = DIRECTION_DELTAS[this.snake.direction];
    const head = this.snake.body[0];

    let nextX = head.x + delta.x;
    let nextY = head.y + delta.y;

    // Boundary check: Classic obstacle walls vs Wrap-around portals
    if (this.config.gameMode === 'CLASSIC') {
      if (nextX < 0 || nextX >= this.config.gridSize || nextY < 0 || nextY >= this.config.gridSize) {
        this.snake.isAlive = false;
        return {
          gameOver: true,
          reason: 'WALL_COLLISION',
          newScore: this.score
        };
      }
    } else {
      // Seamless 4-edge wrap-around movement (Wrap mode)
      if (nextX < 0) nextX = this.config.gridSize - 1;
      else if (nextX >= this.config.gridSize) nextX = 0;

      if (nextY < 0) nextY = this.config.gridSize - 1;
      else if (nextY >= this.config.gridSize) nextY = 0;
    }

    // Self-collision check
    // If tail is not growing, the tail segment will move away this tick,
    // so colliding with the very last tail segment is safe ONLY if growthPending === 0
    const bodyToCheck = this.snake.growthPending > 0
      ? this.snake.body
      : this.snake.body.slice(0, -1);

    for (const segment of bodyToCheck) {
      if (segment.x === nextX && segment.y === nextY) {
        this.snake.isAlive = false;
        return {
          gameOver: true,
          reason: 'SELF_COLLISION',
          newScore: this.score
        };
      }
    }

    // Create new head
    const newHead: import('../types/game').SnakeSegment = {
      id: Date.now() + Math.random(),
      x: nextX,
      y: nextY
    };

    this.snake.body.unshift(newHead);

    let eatenFile: GameFile | undefined;
    let eatenFruit: FruitType | undefined;
    let eatenPosition: Point | undefined;
    let collidedFood: Collectible | undefined;

    // Check if food was reached
    if (this.food && nextX === this.food.position.x && nextY === this.food.position.y) {
      collidedFood = this.food;
      if (this.autoConsume) {
        eatenFile = this.food.file;
        eatenFruit = this.food.fruitType;
        eatenPosition = { ...this.food.position };
        this.score += 1;
        this.filesEaten.push(eatenFile);
        this.snake.growthPending += 1;
        const nextFood = this.spawnFood();
        if (!nextFood) {
          // Board filled completely! Player won
          this.snake.isAlive = false;
          return {
            gameOver: true,
            gameWon: true,
            eatenFile,
            eatenFruit,
            eatenPosition,
            newScore: this.score
          };
        }
      } else {
        // Clear active food temporarily to prevent multiple collisions during async transaction
        this.food = null;
      }
    }

    // Handle body growth vs trimming tail
    if (this.snake.growthPending > 0) {
      this.snake.growthPending--;
    } else {
      this.snake.body.pop();
    }

    return {
      gameOver: false,
      eatenFile,
      eatenFruit,
      eatenPosition,
      collidedFood,
      newScore: this.score
    };
  }

  public commitFoodConsumption(food: Collectible): {
    score: number;
    eatenFile: GameFile;
    eatenFruit: FruitType;
    eatenPosition: Point;
    gameWon?: boolean;
  } {
    this.score += 1;
    this.filesEaten.push(food.file);
    this.snake.growthPending += 1;
    const nextFood = this.spawnFood();
    const gameWon = !nextFood;
    if (gameWon) {
      this.snake.isAlive = false;
    }
    return {
      score: this.score,
      eatenFile: food.file,
      eatenFruit: food.fruitType,
      eatenPosition: food.position,
      gameWon
    };
  }

  public cancelFoodConsumption(_food: Collectible, _reason?: string): void {
    // Discard invalid/stale/locked food without growing snake or scoring, and spawn replacement
    this.spawnFood();
  }

  public getCurrentTickSpeed(): number {
    const baseSpeed = DIFFICULTY_SPEEDS[this.config.difficulty] ?? this.config.initialSpeedMs ?? 140;
    if (this.config.difficulty !== 'DYNAMIC') {
      return baseSpeed;
    }
    // Dynamic: start at baseSpeed and speed up slightly per food eaten
    const speed = baseSpeed - (this.score * this.config.speedDecrementPerFood);
    return Math.max(this.config.minSpeedMs, speed);
  }

  public triggerSelfCollision() {
    this.snake.isAlive = false;
  }
}
