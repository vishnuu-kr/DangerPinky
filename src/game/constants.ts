import { FileCategory, CategoryTheme } from '../types/file';
import { GameConfig } from '../types/game';

export const DEFAULT_GRID_SIZE = 10;

export const CATEGORY_THEMES: Record<FileCategory, CategoryTheme> = {
  image: {
    label: 'Image',
    color: '#06b6d4', // Cyan
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderClass: 'border-cyan-500',
    textClass: 'text-cyan-400',
    iconName: 'Image'
  },
  video: {
    label: 'Video',
    color: '#a855f7', // Purple
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-400',
    iconName: 'Film'
  },
  audio: {
    label: 'Audio',
    color: '#ec4899', // Pink
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    borderClass: 'border-pink-500',
    textClass: 'text-pink-400',
    iconName: 'Music'
  },
  document: {
    label: 'Document',
    color: '#3b82f6', // Blue
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
    iconName: 'FileText'
  },
  code: {
    label: 'Code',
    color: '#eab308', // Amber / Gold
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-400',
    iconName: 'Code'
  },
  archive: {
    label: 'Archive',
    color: '#f97316', // Orange
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-400',
    iconName: 'Archive'
  },
  other: {
    label: 'Other',
    color: '#94a3b8', // Slate
    badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    borderClass: 'border-slate-500',
    textClass: 'text-slate-400',
    iconName: 'File'
  }
};

export const FRUIT_COLORS: Record<import('../types/game').FruitType, string> = {
  apple: '#e53935',
  orange: '#fb8c00',
  grape: '#8e24aa',
  strawberry: '#e91e63',
  watermelon: '#43a047',
  cherry: '#c2185b'
};

export const FRUIT_EMOJIS: Record<import('../types/game').FruitType, string> = {
  apple: '🍎',
  orange: '🍊',
  grape: '🍇',
  strawberry: '🍓',
  watermelon: '🍉',
  cherry: '🍒'
};

export const DEFAULT_GAME_CONFIG: GameConfig = {
  gridSize: 10,
  initialSpeedMs: 140,
  minSpeedMs: 65,
  speedDecrementPerFood: 2,
  gameMode: 'WRAP',
  difficulty: 'CLASSIC',
  soundEnabled: true,
  soundVolume: 0.7,
  musicEnabled: true,
  musicVolume: 0.35,
  touchControlsEnabled: false,
  pinkySensitivity: 3, // 1 to 5 scale, 3 is standard
  snakeSkin: 'CANDY_PINK',
  fingerMode: 'PINKY',
  fileFilter: 'ALL',
  boardTheme: 'MEADOW',
  hapticsEnabled: true
};

export const DIFFICULTY_SPEEDS: Record<GameConfig['difficulty'], number> = {
  CHILL: 200,   // Relaxed & leisurely pace
  CLASSIC: 140, // Standard classic arcade speed
  FAST: 85,     // High-speed thrill
  DYNAMIC: 140  // Starts classic, accelerates per food
};

export interface SnakeSkinPalette {
  name: string;
  emoji: string;
  main: string;
  dark: string;
  highlight: string;
  headTop: string;
  headBottom: string;
  eyeColor: string;
}

export const SNAKE_SKIN_PALETTES: Record<import('../types/game').SnakeSkin, SnakeSkinPalette> = {
  GOOGLE_BLUE: {
    name: 'Google Blue',
    emoji: '🔵',
    main: '#4772eb',
    dark: '#2f58c7',
    highlight: '#608bf8',
    headTop: '#608bf8',
    headBottom: '#1c3ba8',
    eyeColor: '#172b68'
  },
  CANDY_PINK: {
    name: 'Candy Pink',
    emoji: '🍬',
    main: '#ff3b94',
    dark: '#d80064',
    highlight: '#ff7bb9',
    headTop: '#ff90c6',
    headBottom: '#c70057',
    eyeColor: '#1e1b4b'
  },
  CYBER_GREEN: {
    name: 'Matrix Green',
    emoji: '💚',
    main: '#10b981',
    dark: '#047857',
    highlight: '#34d399',
    headTop: '#6ee7b7',
    headBottom: '#065f46',
    eyeColor: '#022c22'
  },
  SYNTHWAVE: {
    name: 'Synthwave',
    emoji: '💜',
    main: '#8b5cf6',
    dark: '#6d28d9',
    highlight: '#a78bfa',
    headTop: '#c084fc',
    headBottom: '#4c1d95',
    eyeColor: '#18022e'
  },
  GOLDEN_CHROMA: {
    name: 'Golden VIP',
    emoji: '👑',
    main: '#f59e0b',
    dark: '#b45309',
    highlight: '#fbbf24',
    headTop: '#fde68a',
    headBottom: '#78350f',
    eyeColor: '#451a03'
  }
};

export const SPECIAL_ITEMS: Record<import('../types/game').SpecialItemType, {
  name: string;
  filename: string;
  emoji: string;
  color: string;
  badge: string;
  description: string;
}> = {
  TRIM_TAIL: {
    name: 'Cache Cleaner',
    filename: 'clean_cache.tmp',
    emoji: '🧹',
    color: '#10b981',
    badge: 'CACHE -2',
    description: 'Trims 2 tail segments'
  },
  SPEED_BURST: {
    name: 'Zip Bomb',
    filename: 'archive_bomb.zip',
    emoji: '💣',
    color: '#f59e0b',
    badge: 'BOOM +5',
    description: '+5 pts & Turbo Surge'
  },
  DOUBLE_POINTS: {
    name: 'Glitch Bug',
    filename: 'system_bug.patch',
    emoji: '👾',
    color: '#d946ef',
    badge: '2X BONUS',
    description: 'Double combo points'
  }
};

export interface BoardThemePalette {
  name: string;
  emoji: string;
  tileA: string;
  tileB: string;
  gridLine: string;
  outerBorder: string;
  glowColor: string;
  textColor: string;
}

export const BOARD_THEMES: Record<import('../types/game').BoardTheme, BoardThemePalette> = {
  MEADOW: {
    name: 'Meadow Lawn',
    emoji: '🌱',
    tileA: '#a2d149',
    tileB: '#aad751',
    gridLine: 'rgba(0, 0, 0, 0.04)',
    outerBorder: '#335919',
    glowColor: 'rgba(162, 209, 73, 0.4)',
    textColor: '#1e3a0f'
  },
  CYBER_NEON: {
    name: 'Cyber Terminal',
    emoji: '⚡',
    tileA: '#090d16',
    tileB: '#0d131f',
    gridLine: 'rgba(6, 182, 212, 0.12)',
    outerBorder: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    textColor: '#22d3ee'
  },
  SYNTH_DUSK: {
    name: 'Synthwave Dusk',
    emoji: '🌆',
    tileA: '#13091f',
    tileB: '#1a0d2a',
    gridLine: 'rgba(217, 70, 239, 0.14)',
    outerBorder: '#d946ef',
    glowColor: 'rgba(217, 70, 239, 0.4)',
    textColor: '#f0abfc'
  },
  RETRO_DESKTOP: {
    name: 'Retro OS 95',
    emoji: '💾',
    tileA: '#008080',
    tileB: '#007575',
    gridLine: 'rgba(255, 255, 255, 0.07)',
    outerBorder: '#c0c0c0',
    glowColor: 'rgba(0, 128, 128, 0.4)',
    textColor: '#ffffff'
  }
};
