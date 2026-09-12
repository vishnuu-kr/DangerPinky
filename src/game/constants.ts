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
  touchControlsEnabled: false,
  pinkySensitivity: 3, // 1 to 5 scale, 3 is standard
};

export const DIFFICULTY_SPEEDS: Record<GameConfig['difficulty'], number> = {
  CHILL: 200,   // Relaxed & leisurely pace
  CLASSIC: 140, // Standard classic arcade speed
  FAST: 85,     // High-speed thrill
  DYNAMIC: 140  // Starts classic, accelerates per food
};
