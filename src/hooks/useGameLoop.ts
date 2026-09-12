import { useEffect, useRef, useState, useCallback } from 'react';
import { SnakeEngine } from '../game/engine';
import { GameRenderer } from '../game/renderer';
import { ParticleSystem } from '../game/particles';
import { sound } from '../game/audio';
import { GameConfig, GameStatus, Direction, FloatingNotification, GameStats } from '../types/game';
import { GameFile } from '../types/file';
import { FRUIT_COLORS, FRUIT_EMOJIS } from '../game/constants';
import { saveHighScore } from '../utils/storage';
import { consumeNativeFile } from '../filesystem/nativeBridge';

export interface UseGameLoopParams {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  config: GameConfig;
  files: GameFile[];
  highScore: number;
  onHighScoreChange: (newHigh: number) => void;
  onGameOver: (stats: GameStats) => void;
  realFileMode?: boolean;
  sessionToken?: string;
}

export function useGameLoop({
  canvasRef,
  config,
  files,
  highScore,
  onHighScoreChange,
  onGameOver,
  realFileMode = false,
  sessionToken
}: UseGameLoopParams) {
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState<number>(0);
  const [filesEaten, setFilesEaten] = useState<GameFile[]>([]);
  const [filesConsumedCount, setFilesConsumedCount] = useState<number>(0);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNotification[]>([]);
  const [countdown, setCountdown] = useState<number>(3);

  // Synchronous status ref prevents stale closures across render cycles
  const statusRef = useRef<GameStatus>('IDLE');
  const setGameStatus = useCallback((newStatus: GameStatus) => {
    statusRef.current = newStatus;
    setStatus(newStatus);
  }, []);

  const engineRef = useRef<SnakeEngine | null>(null);
  const rendererRef = useRef<GameRenderer>(new GameRenderer());
  const particlesRef = useRef<ParticleSystem>(new ParticleSystem());
  const animFrameIdRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Stable callbacks and state refs for the RAF loop
  const highScoreRef = useRef<number>(highScore);
  highScoreRef.current = highScore;

  const onHighScoreChangeRef = useRef(onHighScoreChange);
  onHighScoreChangeRef.current = onHighScoreChange;

  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  const configRef = useRef(config);
  configRef.current = config;

  const filesRef = useRef<GameFile[]>(files);
  filesRef.current = files;

  const filesConsumedCountRef = useRef<number>(0);
  filesConsumedCountRef.current = filesConsumedCount;

  const realFileModeRef = useRef<boolean>(realFileMode);
  realFileModeRef.current = realFileMode;

  const sessionTokenRef = useRef<string | undefined>(sessionToken);
  sessionTokenRef.current = sessionToken;

  const operationInProgressRef = useRef<boolean>(false);

  const clearCountdownInterval = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      clearCountdownInterval();
    };
  }, [clearCountdownInterval]);

  // Synchronize engine config, files, and real-mode consumption without resetting active game
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new SnakeEngine(config, files, !realFileMode);
    } else {
      engineRef.current.updateConfig(config);
      engineRef.current.updateFiles(files);
      engineRef.current.setAutoConsume(!realFileMode);
      if (statusRef.current === 'IDLE') {
        engineRef.current.reset(files);
      }
    }
    if (typeof window !== 'undefined') {
      (window as any).__gameEngine = engineRef.current;
    }
  }, [config, files, realFileMode]);

  // Handle direction input - stable callback that always reads live statusRef
  const changeDirection = useCallback((dir: Direction): boolean => {
    if (engineRef.current && (statusRef.current === 'PLAYING' || statusRef.current === 'COUNTDOWN')) {
      const accepted = engineRef.current.setDirection(dir);
      if (accepted) {
        sound.playGestureTick();
      }
      return accepted;
    }
    return false;
  }, []);

  // Start game with 3-2-1 countdown
  const startGame = useCallback(
    (customFiles?: GameFile[], customRealMode?: boolean, customToken?: string) => {
      clearCountdownInterval();

      const filesToUse = customFiles && customFiles.length > 0 ? customFiles : filesRef.current;
      const isReal = customRealMode !== undefined ? customRealMode : realFileModeRef.current;
      if (customRealMode !== undefined) {
        realFileModeRef.current = customRealMode;
      }
      if (customToken !== undefined) {
        sessionTokenRef.current = customToken;
      }

      if (!engineRef.current) {
        engineRef.current = new SnakeEngine(configRef.current, filesToUse, !isReal);
      } else {
        engineRef.current.setAutoConsume(!isReal);
        engineRef.current.updateConfig(configRef.current);
        engineRef.current.reset(filesToUse);
      }
      if (typeof window !== 'undefined') {
        (window as any).__gameEngine = engineRef.current;
      }

      particlesRef.current.clear();
      setScore(0);
      setFilesConsumedCount(0);
      filesConsumedCountRef.current = 0;
      operationInProgressRef.current = false;
      setFilesEaten([]);
      setFloatingNotes([]);
      setGameStatus('COUNTDOWN');
      setCountdown(3);
      sound.playCountdown(false);

      let count = 3;
      countdownIntervalRef.current = setInterval(() => {
        count--;
        if (count > 0) {
          setCountdown(count);
          sound.playCountdown(false);
        } else {
          clearCountdownInterval();
          setCountdown(0);
          sound.playCountdown(true);
          setGameStatus('PLAYING');
          startTimeRef.current = Date.now();
          lastTickTimeRef.current = performance.now();
        }
      }, 850);
    },
    [clearCountdownInterval, setGameStatus]
  );

  const pauseGame = useCallback(() => {
    if (statusRef.current === 'PLAYING') {
      setGameStatus('PAUSED');
    }
  }, [setGameStatus]);

  const resumeGame = useCallback(() => {
    if (statusRef.current === 'PAUSED') {
      lastTickTimeRef.current = performance.now();
      setGameStatus('PLAYING');
    }
  }, [setGameStatus]);

  const togglePause = useCallback(() => {
    if (statusRef.current === 'PLAYING') {
      setGameStatus('PAUSED');
    } else if (statusRef.current === 'PAUSED') {
      lastTickTimeRef.current = performance.now();
      setGameStatus('PLAYING');
    }
  }, [setGameStatus]);

  const stopGame = useCallback(() => {
    clearCountdownInterval();
    setGameStatus('IDLE');
  }, [clearCountdownInterval, setGameStatus]);

  // Main animation and tick loop - decoupled from state re-render churn
  useEffect(() => {
    let isRunning = true;

    const loop = (now: number) => {
      if (!isRunning) return;

      const canvas = canvasRef.current;
      const engine = engineRef.current;
      const renderer = rendererRef.current;
      const particles = particlesRef.current;

      if (canvas && engine) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const curStatus = statusRef.current;
          const curConfig = configRef.current;

          // Step game logic if playing
          if (curStatus === 'PLAYING') {
            const tickInterval = engine.getCurrentTickSpeed();
            const elapsed = now - lastTickTimeRef.current;

            if (elapsed >= tickInterval) {
              lastTickTimeRef.current = now;
              const result = engine.step();

              if (result.gameOver) {
                sound.playGameOver();
                setGameStatus('GAME_OVER');

                const finalScore = engine.getScore();
                const curHigh = highScoreRef.current;
                const isNewHigh = finalScore > curHigh;
                if (isNewHigh) {
                  saveHighScore(finalScore);
                  onHighScoreChangeRef.current(finalScore);
                  sound.playHighScore();
                }

                const stats: GameStats = {
                  score: finalScore,
                  highScore: Math.max(curHigh, finalScore),
                  filesEaten: engine.getFilesEaten(),
                  startTime: startTimeRef.current,
                  durationSeconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
                  isNewHighScore: isNewHigh,
                  realFilesConsumedCount: filesConsumedCountRef.current
                };
                onGameOverRef.current(stats);
              } else if (result.collidedFood) {
                // Real File Mode async consumption transaction
                const food = result.collidedFood;
                const token = sessionTokenRef.current;

                if (!operationInProgressRef.current && token) {
                  operationInProgressRef.current = true;

                  consumeNativeFile(token, food.file.id)
                    .then((opResult) => {
                      if (opResult.success) {
                        const commit = engine.commitFoodConsumption(food);
                        sound.playEatSound(commit.eatenFile.category);

                        const fruitType = commit.eatenFruit;
                        const fruitColor = FRUIT_COLORS[fruitType] || '#ef4444';

                        const dpr = window.devicePixelRatio || 1;
                        const logicalWidth = canvas.width / dpr;
                        const cellSize = logicalWidth / curConfig.gridSize;
                        const px = commit.eatenPosition.x * cellSize + cellSize / 2;
                        const py = commit.eatenPosition.y * cellSize + cellSize / 2;
                        particles.emit(px, py, fruitColor, 16);

                        const newNote: FloatingNotification = {
                          id: `note-${Date.now()}-${Math.random()}`,
                          text: `+1 Moved to Trash: ${opResult.fileName || food.file.name}`,
                          subtext: 'Recoverable from OS Recycle Bin',
                          category: commit.eatenFile.category,
                          extension: commit.eatenFile.extension,
                          fruitType,
                          x: px,
                          y: py,
                          createdAt: Date.now()
                        };

                        setFloatingNotes((prev) => [...prev.slice(-2), newNote]);
                        setScore(commit.score);
                        setFilesConsumedCount((prev) => prev + 1);
                        setFilesEaten(engine.getFilesEaten());

                        if (commit.score > highScoreRef.current) {
                          onHighScoreChangeRef.current(commit.score);
                        }
                      } else {
                        // Native Trash operation failed (file locked, missing, or blocked)
                        engine.cancelFoodConsumption(food, opResult.reason);

                        const warnNote: FloatingNotification = {
                          id: `note-${Date.now()}-${Math.random()}`,
                          text: `Couldn't consume ${food.file.name}`,
                          subtext: opResult.reason || 'File locked or unavailable',
                          category: food.file.category,
                          extension: food.file.extension,
                          fruitType: food.fruitType,
                          x: (canvas.width / (window.devicePixelRatio || 1)) / 2,
                          y: 80,
                          createdAt: Date.now()
                        };

                        setFloatingNotes((prev) => [...prev.slice(-2), warnNote]);
                      }
                    })
                    .catch((err) => {
                      engine.cancelFoodConsumption(food, String(err));
                    })
                    .finally(() => {
                      operationInProgressRef.current = false;
                    });
                } else if (!token) {
                  // Fallback: token missing, safely cancel consumption and respawn replacement food
                  engine.cancelFoodConsumption(food, 'No active real mode session token');
                }
              } else if (result.eatenFile && result.eatenPosition) {
                // Food was eaten!
                sound.playEatSound(result.eatenFile.category);

                const fruitType = result.eatenFruit || 'apple';
                const fruitColor = FRUIT_COLORS[fruitType] || '#ef4444';
                const fruitEmoji = FRUIT_EMOJIS[fruitType] || '🍎';

                // Burst a small casual cluster of fruit sparks (Section 17)
                const dpr = window.devicePixelRatio || 1;
                const logicalWidth = canvas.width / dpr;
                const cellSize = logicalWidth / curConfig.gridSize;
                const px = result.eatenPosition.x * cellSize + cellSize / 2;
                const py = result.eatenPosition.y * cellSize + cellSize / 2;
                particles.emit(px, py, fruitColor, 12);

                // Add subtle simulated consumption notification (Section 14 & 15)
                const funPhrases = [
                  `Deleted: ${result.eatenFile.name}`,
                  `${fruitEmoji} Deleted: ${result.eatenFile.name}`,
                  `Consumed: ${result.eatenFile.name}`,
                  `${fruitEmoji} Consumed: ${result.eatenFile.name}`
                ];
                const msg = funPhrases[Math.floor(Math.random() * funPhrases.length)];

                const newNote: FloatingNotification = {
                  id: `note-${Date.now()}-${Math.random()}`,
                  text: msg,
                  subtext: 'File intact on computer',
                  category: result.eatenFile.category,
                  extension: result.eatenFile.extension,
                  fruitType,
                  x: px,
                  y: py,
                  createdAt: Date.now()
                };

                setFloatingNotes((prev) => [...prev.slice(-2), newNote]);
                setScore(result.newScore);
                setFilesEaten(engine.getFilesEaten());

                if (result.newScore > highScoreRef.current) {
                  onHighScoreChangeRef.current(result.newScore);
                }
              }
            }
          }

          // Update particle physics
          particles.update();

          // Render current game frame with clean High-DPI support
          const dpr = window.devicePixelRatio || 1;
          const logicalWidth = canvas.width / dpr;
          const logicalHeight = canvas.height / dpr;

          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.scale(dpr, dpr);

          renderer.render({
            ctx,
            width: logicalWidth,
            height: logicalHeight,
            gridSize: curConfig.gridSize,
            snake: engine.getSnakeState(),
            food: engine.getFood(),
            particles,
            gameMode: curConfig.gameMode,
            realFileMode: realFileModeRef.current,
            time: now
          });

          ctx.restore();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [canvasRef, setGameStatus]);

  // Clean up expired floating notifications after 1.8 seconds
  useEffect(() => {
    if (floatingNotes.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setFloatingNotes((prev) => prev.filter((n) => now - n.createdAt < 1800));
    }, 200);
    return () => clearInterval(interval);
  }, [floatingNotes]);

  return {
    status,
    score,
    filesEaten,
    filesConsumedCount,
    floatingNotes,
    countdown,
    startGame,
    stopGame,
    pauseGame,
    resumeGame,
    togglePause,
    changeDirection
  };
}
