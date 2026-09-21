import { useEffect, useRef, useState, useCallback } from 'react';
import { SnakeEngine } from '../game/engine';
import { GameRenderer } from '../game/renderer';
import { ParticleSystem } from '../game/particles';
import { sound } from '../game/audio';
import { GameConfig, GameStatus, Direction, FloatingNotification, GameStats } from '../types/game';
import { GameFile } from '../types/file';
import { FRUIT_COLORS, FRUIT_EMOJIS } from '../game/constants';
import { saveHighScore, saveLeaderboardEntry } from '../utils/storage';
import { consumeNativeFile } from '../filesystem/nativeBridge';
import { triggerHaptic, setHapticsEnabled } from '../utils/haptics';

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
  const [comboCount, setComboCount] = useState<number>(1);
  const [filesEaten, setFilesEaten] = useState<GameFile[]>([]);
  const [filesConsumedCount, setFilesConsumedCount] = useState<number>(0);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNotification[]>([]);
  const [countdown, setCountdown] = useState<number>(3);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [isNearMiss, setIsNearMiss] = useState<boolean>(false);

  const digestionStartTimeRef = useRef<number>(0);
  const timeAttackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerScreenShake = useCallback(() => {
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 220);
  }, []);

  // Synchronous status ref prevents stale closures across render cycles
  const statusRef = useRef<GameStatus>('IDLE');
  const setGameStatus = useCallback((newStatus: GameStatus) => {
    statusRef.current = newStatus;
    setStatus(newStatus);
    sound.setPaused(newStatus === 'PAUSED');
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
    setHapticsEnabled(config.hapticsEnabled !== false);
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
        triggerHaptic('turn');
      }
      return accepted;
    }
    return false;
  }, []);

  // Start game with 3-2-1 countdown
  const startGame = useCallback(
    (customFiles?: GameFile[], customRealMode?: boolean, customToken?: string) => {
      clearCountdownInterval();

      let filesToUse = customFiles && customFiles.length > 0 ? customFiles : filesRef.current;
      const filter = configRef.current.fileFilter;
      if (filter && filter !== 'ALL') {
        const filtered = filesToUse.filter((f) => {
          if (filter === 'MEDIA_ONLY') return f.category === 'image' || f.category === 'video' || f.category === 'audio';
          if (filter === 'CODE_DOCS') return f.category === 'code' || f.category === 'document';
          if (filter === 'JUNK_ONLY') return f.category === 'other' || ['tmp', 'log', 'bak', 'cache'].includes(f.extension?.toLowerCase() || '');
          return true;
        });
        if (filtered.length > 0) {
          filesToUse = filtered;
        }
      }
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
      setComboCount(1);
      setTimeRemaining(60);
      setFilesConsumedCount(0);
      filesConsumedCountRef.current = 0;
      operationInProgressRef.current = false;
      setFilesEaten([]);
      setFloatingNotes([]);
      setGameStatus('COUNTDOWN');
      setCountdown(3);
      sound.stopBgm();
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
          sound.startBgm(engineRef.current?.getCurrentTickSpeed() || 140);

          if (configRef.current.gameMode === 'TIME_ATTACK') {
            if (timeAttackTimerRef.current) clearInterval(timeAttackTimerRef.current);
            timeAttackTimerRef.current = setInterval(() => {
              setTimeRemaining((prev) => {
                if (prev <= 1) {
                  if (timeAttackTimerRef.current) {
                    clearInterval(timeAttackTimerRef.current);
                    timeAttackTimerRef.current = null;
                  }
                  if (engineRef.current) {
                    engineRef.current.triggerSelfCollision();
                  }
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }
        }
      }, 850);
    },
    [clearCountdownInterval, setGameStatus]
  );

  const pauseGame = useCallback(() => {
    if (statusRef.current === 'PLAYING') {
      sound.stopBgm();
      if (timeAttackTimerRef.current) {
        clearInterval(timeAttackTimerRef.current);
        timeAttackTimerRef.current = null;
      }
      setGameStatus('PAUSED');
    }
  }, [setGameStatus]);

  const resumeGame = useCallback(() => {
    if (statusRef.current === 'PAUSED') {
      lastTickTimeRef.current = performance.now();
      sound.startBgm(engineRef.current?.getCurrentTickSpeed() || 140);
      setGameStatus('PLAYING');

      if (configRef.current.gameMode === 'TIME_ATTACK') {
        if (timeAttackTimerRef.current) clearInterval(timeAttackTimerRef.current);
        timeAttackTimerRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              if (timeAttackTimerRef.current) {
                clearInterval(timeAttackTimerRef.current);
                timeAttackTimerRef.current = null;
              }
              if (engineRef.current) {
                engineRef.current.triggerSelfCollision();
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  }, [setGameStatus]);

  const togglePause = useCallback(() => {
    if (statusRef.current === 'PLAYING') {
      pauseGame();
    } else if (statusRef.current === 'PAUSED') {
      resumeGame();
    }
  }, [pauseGame, resumeGame]);

  const stopGame = useCallback(() => {
    clearCountdownInterval();
    if (timeAttackTimerRef.current) {
      clearInterval(timeAttackTimerRef.current);
      timeAttackTimerRef.current = null;
    }
    sound.stopBgm();
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
                sound.stopBgm();
                if (timeAttackTimerRef.current) {
                  clearInterval(timeAttackTimerRef.current);
                  timeAttackTimerRef.current = null;
                }
                triggerScreenShake();
                sound.playGameOver();
                triggerHaptic('crash');
                setGameStatus('GAME_OVER');

                const finalScore = engine.getScore();
                const curHigh = highScoreRef.current;
                const isNewHigh = finalScore > curHigh;
                if (isNewHigh) {
                  saveHighScore(finalScore);
                  onHighScoreChangeRef.current(finalScore);
                  sound.playHighScore();
                }

                const rating = finalScore >= 40 ? 'HARD DRIVE REAPER 👑' : finalScore >= 25 ? 'CHAOTIC JANITOR 🥇' : finalScore >= 12 ? 'RECKLESS CLEANER 🥈' : 'NOVICE BROOM 🥉';
                const totalCleanedBytes = engine.getFilesEaten().reduce((acc, f) => acc + f.size, 0);

                const snakeHead = engine.getSnakeState().body[0] || { x: 0, y: 0 };
                const curFood = engine.getFood();
                const distToFood = curFood
                  ? Math.hypot(curFood.position.x - snakeHead.x, curFood.position.y - snakeHead.y)
                  : 0;

                const fatalCrashSnapshot = {
                  headX: snakeHead.x,
                  headY: snakeHead.y,
                  collisionType: result.reason || 'COLLISION',
                  nearestFoodDistance: Math.round(distToFood * 10) / 10
                };

                const leaderboardEntry: import('../types/game').LeaderboardEntry = {
                  id: `run-${Date.now()}`,
                  score: finalScore,
                  date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                  mode: curConfig.gameMode,
                  filesCount: engine.getFilesEaten().length,
                  bytesCleaned: totalCleanedBytes,
                  durationSeconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
                  isRealMode: !!realFileModeRef.current,
                  hazardRating: rating
                };
                saveLeaderboardEntry(leaderboardEntry);

                const stats: GameStats = {
                  score: finalScore,
                  highScore: Math.max(curHigh, finalScore),
                  filesEaten: engine.getFilesEaten(),
                  startTime: startTimeRef.current,
                  durationSeconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
                  isNewHighScore: isNewHigh,
                  realFilesConsumedCount: filesConsumedCountRef.current,
                  gameMode: curConfig.gameMode,
                  hazardRating: rating,
                  fatalCrashSnapshot
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
                        digestionStartTimeRef.current = performance.now();

                        const pan = Math.max(-0.85, Math.min(0.85, ((commit.eatenPosition.x / curConfig.gridSize) - 0.5) * 1.8));
                        sound.playEatSound(commit.eatenFile.category, commit.comboCount, pan);
                        sound.setComboLevel(commit.comboCount);

                        if (commit.specialType) {
                          sound.playPowerUpSound(commit.specialType);
                          triggerHaptic('powerup');
                          if (commit.specialType === 'SPEED_BURST') triggerScreenShake();
                        } else if (commit.comboCount > 1) {
                          triggerHaptic('combo');
                        } else {
                          triggerHaptic('eat');
                        }

                        if (commit.eatenFile.category === 'video' || commit.eatenFile.category === 'archive') {
                          triggerScreenShake();
                        }
                        if (commit.comboCount > 1) {
                          setComboCount(commit.comboCount);
                        }
                        if (curConfig.gameMode === 'TIME_ATTACK') {
                          setTimeRemaining((t) => Math.min(99, t + 3));
                        }

                        const fruitType = commit.eatenFruit;
                        const fruitColor = FRUIT_COLORS[fruitType] || '#ef4444';

                        const dpr = window.devicePixelRatio || 1;
                        const logicalWidth = canvas.width / dpr;
                        const cellSize = logicalWidth / curConfig.gridSize;
                        const px = commit.eatenPosition.x * cellSize + cellSize / 2;
                        const py = commit.eatenPosition.y * cellSize + cellSize / 2;

                        const snakeHead = engine.getSnakeState().body[0];
                        const headPx = snakeHead ? snakeHead.x * cellSize + cellSize / 2 : px;
                        const headPy = snakeHead ? snakeHead.y * cellSize + cellSize / 2 : py;
                        particles.emit(px, py, fruitColor, 12);
                        particles.emitSuction(px, py, headPx, headPy, fruitColor, 12);

                        let noteText = `+${commit.pointsAdded || 1} Moved to Trash: ${opResult.fileName || food.file.name}`;
                        if (commit.comboCount > 1) {
                          noteText = `🔥 ${commit.comboCount}x COMBO! ${noteText}`;
                        }

                        const newNote: FloatingNotification = {
                          id: `note-${Date.now()}-${Math.random()}`,
                          text: noteText,
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
                digestionStartTimeRef.current = performance.now();

                const pan = Math.max(-0.85, Math.min(0.85, ((result.eatenPosition.x / curConfig.gridSize) - 0.5) * 1.8));
                sound.playEatSound(result.eatenFile.category, result.comboCount || 1, pan);
                sound.setComboLevel(result.comboCount || 1);

                if (result.specialType) {
                  sound.playPowerUpSound(result.specialType);
                  triggerHaptic('powerup');
                  if (result.specialType === 'SPEED_BURST') triggerScreenShake();
                } else if ((result.comboCount || 1) > 1) {
                  triggerHaptic('combo');
                } else {
                  triggerHaptic('eat');
                }

                if (result.eatenFile.category === 'video' || result.eatenFile.category === 'archive') {
                  triggerScreenShake();
                }
                if ((result.comboCount || 1) > 1) {
                  setComboCount(result.comboCount || 1);
                }
                if (curConfig.gameMode === 'TIME_ATTACK') {
                  setTimeRemaining((t) => Math.min(99, t + 3));
                }

                const fruitType = result.eatenFruit || 'apple';
                const fruitColor = FRUIT_COLORS[fruitType] || '#ef4444';
                const fruitEmoji = FRUIT_EMOJIS[fruitType] || '🍎';

                // Burst a small casual cluster of fruit sparks and vacuum implosion
                const dpr = window.devicePixelRatio || 1;
                const logicalWidth = canvas.width / dpr;
                const cellSize = logicalWidth / curConfig.gridSize;
                const px = result.eatenPosition.x * cellSize + cellSize / 2;
                const py = result.eatenPosition.y * cellSize + cellSize / 2;

                const snakeHead = engine.getSnakeState().body[0];
                const headPx = snakeHead ? snakeHead.x * cellSize + cellSize / 2 : px;
                const headPy = snakeHead ? snakeHead.y * cellSize + cellSize / 2 : py;
                particles.emit(px, py, fruitColor, 12);
                particles.emitSuction(px, py, headPx, headPy, fruitColor, 12);

                const funPhrases = [
                  `Deleted: ${result.eatenFile.name}`,
                  `${fruitEmoji} Deleted: ${result.eatenFile.name}`,
                  `Consumed: ${result.eatenFile.name}`,
                  `${fruitEmoji} Consumed: ${result.eatenFile.name}`
                ];
                let msg = funPhrases[Math.floor(Math.random() * funPhrases.length)];
                if ((result.comboCount || 1) > 1) {
                  msg = `🔥 ${result.comboCount}x COMBO! (+${result.pointsAdded || 1}) ${result.eatenFile.name}`;
                }

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

          const digestionElapsed = now - digestionStartTimeRef.current;
          const digestionProgress = digestionElapsed < 550 ? digestionElapsed / 550 : -1;

          // Check for near miss (1 tile away from lethal wall or self segment)
          let isDangerNear = false;
          if (curStatus === 'PLAYING') {
            const snakeState = engine.getSnakeState();
            const head = snakeState.body[0];
            const delta = {
              UP: { x: 0, y: -1 },
              DOWN: { x: 0, y: 1 },
              LEFT: { x: -1, y: 0 },
              RIGHT: { x: 1, y: 0 }
            }[snakeState.direction];
            const nextX = head.x + delta.x;
            const nextY = head.y + delta.y;
            const hitWall = config.gameMode === 'CLASSIC' && (nextX < 0 || nextX >= config.gridSize || nextY < 0 || nextY >= config.gridSize);
            const hitSelf = snakeState.body.slice(1).some(seg => seg.x === nextX && seg.y === nextY);
            isDangerNear = hitWall || hitSelf;
            setIsNearMiss(isDangerNear);
            if (isDangerNear) {
              sound.playHeartbeat();
              triggerHaptic('near_miss');
            }
          } else {
            setIsNearMiss(false);
          }

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
            time: now,
            snakeSkin: curConfig.snakeSkin,
            digestionProgress,
            boardTheme: curConfig.boardTheme,
            comboCount,
            isSpeedSurging: curConfig.gameMode === 'TIME_ATTACK',
            isNearMiss: isDangerNear
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
    comboCount,
    filesEaten,
    filesConsumedCount,
    floatingNotes,
    countdown,
    timeRemaining,
    isScreenShaking,
    isNearMiss,
    startGame,
    stopGame,
    pauseGame,
    resumeGame,
    togglePause,
    changeDirection
  };
}
