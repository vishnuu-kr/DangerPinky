import { GameConfig } from '../types/game';
import { DEFAULT_GAME_CONFIG } from '../game/constants';

const HIGH_SCORE_KEY = 'filesnake_highscore';
const CONFIG_KEY = 'dangerpinky_config_v3';

export function getStoredHighScore(): number {
  try {
    const val = localStorage.getItem(HIGH_SCORE_KEY);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch (e) {
    return 0;
  }
}

export function saveHighScore(score: number): boolean {
  try {
    const current = getStoredHighScore();
    if (score > current) {
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      return true;
    }
  } catch (e) {
    // Ignore storage quota / private browsing errors
  }
  return false;
}

export function getStoredConfig(): GameConfig {
  try {
    const val = localStorage.getItem(CONFIG_KEY);
    if (val) {
      return { ...DEFAULT_GAME_CONFIG, ...JSON.parse(val) };
    }
  } catch (e) {
    // Fallback to defaults
  }
  return { ...DEFAULT_GAME_CONFIG };
}

export function saveConfig(config: GameConfig) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    // Ignore storage errors
  }
}
