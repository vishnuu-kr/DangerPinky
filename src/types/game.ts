export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export type GameStatus = 'IDLE' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type GameMode = 'CLASSIC' | 'WRAP' | 'TIME_ATTACK' | 'ZEN';

export type Difficulty = 'CHILL' | 'CLASSIC' | 'FAST' | 'DYNAMIC';

export type SnakeSkin = 'GOOGLE_BLUE' | 'CANDY_PINK' | 'CYBER_GREEN' | 'SYNTHWAVE' | 'GOLDEN_CHROMA';

export type FingerMode = 'PINKY' | 'INDEX';

export type SpecialItemType = 'TRIM_TAIL' | 'SPEED_BURST' | 'DOUBLE_POINTS';

export type FileFilterCategory = 'ALL' | 'JUNK_ONLY' | 'MEDIA_ONLY' | 'CODE_DOCS';

export type BoardTheme = 'MEADOW' | 'CYBER_NEON' | 'SYNTH_DUSK' | 'RETRO_DESKTOP';

export interface GameConfig {
  gridSize: number;           // e.g. 20 (20x20 grid)
  initialSpeedMs: number;     // e.g. 140ms per tick
  minSpeedMs: number;         // e.g. 60ms minimum (fastest)
  speedDecrementPerFood: number; // e.g. 2ms faster per food in DYNAMIC
  gameMode: GameMode;
  difficulty: Difficulty;
  soundEnabled: boolean;
  soundVolume: number;        // 0.0 to 1.0
  musicEnabled?: boolean;     // Background procedural music
  musicVolume?: number;       // 0.0 to 1.0
  touchControlsEnabled: boolean;
  pinkySensitivity: number;   // 1 to 5 (threshold multiplier)
  snakeSkin?: SnakeSkin;
  fingerMode?: FingerMode;
  fileFilter?: FileFilterCategory;
  boardTheme?: BoardTheme;
  hapticsEnabled?: boolean;
}

export type FruitType = 'apple' | 'orange' | 'grape' | 'strawberry' | 'watermelon' | 'cherry';

export interface Collectible {
  id: string;
  position: Point;
  file: import('./file').GameFile;
  fruitType: FruitType;
  spawnTime: number;
  specialType?: SpecialItemType;
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
  gameMode?: GameMode;
  hazardRating?: string;
  fatalCrashSnapshot?: {
    headX: number;
    headY: number;
    collisionType: string;
    nearestFoodDistance: number;
  };
}

export interface LeaderboardEntry {
  id: string;
  score: number;
  date: string;
  mode: GameMode;
  filesCount: number;
  bytesCleaned: number;
  durationSeconds: number;
  isRealMode: boolean;
  hazardRating: string;
}
