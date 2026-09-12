export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export type GameStatus = 'IDLE' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type GameMode = 'CLASSIC' | 'WRAP'; // Classic has lethal walls, Wrap wraps around edges

export type Difficulty = 'CHILL' | 'CLASSIC' | 'FAST' | 'DYNAMIC';

export interface GameConfig {
  gridSize: number;           // e.g. 20 (20x20 grid)
  initialSpeedMs: number;     // e.g. 140ms per tick
  minSpeedMs: number;         // e.g. 60ms minimum (fastest)
  speedDecrementPerFood: number; // e.g. 2ms faster per food in DYNAMIC
  gameMode: GameMode;
  difficulty: Difficulty;
  soundEnabled: boolean;
  soundVolume: number;        // 0.0 to 1.0
  touchControlsEnabled: boolean;
  pinkySensitivity: number;   // 1 to 5 (threshold multiplier)
}

export type FruitType = 'apple' | 'orange' | 'grape' | 'strawberry' | 'watermelon' | 'cherry';

export interface Collectible {
  id: string;
  position: Point;
  file: import('./file').GameFile;
  fruitType: FruitType;
  spawnTime: number;
}

export interface SnakeSegment extends Point {
  id: number;
}

export interface SnakeState {
  body: SnakeSegment[];
  direction: Direction;
  nextDirection: Direction;
  growthPending: number;
  isAlive: boolean;
}

export interface FloatingNotification {
  id: string;
  text: string;
  subtext?: string;
  category: import('./file').FileCategory;
  extension: string;
  fruitType?: FruitType;
  x: number;
  y: number;
  createdAt: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  filesEaten: import('./file').GameFile[];
  startTime: number;
  durationSeconds: number;
  isNewHighScore: boolean;
  realFilesConsumedCount?: number;
}
