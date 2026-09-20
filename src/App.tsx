import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { Navbar } from './components/Navbar';
import { JournalScreen } from './components/JournalScreen';
import { GameHUD } from './components/GameHUD';
import { GameCanvas } from './components/GameCanvas';
import { CameraCornerHUD } from './components/CameraCornerHUD';
import { CameraSetupModal } from './components/CameraSetupModal';
import { FolderPickerModal } from './components/FolderPickerModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { TouchControls } from './components/TouchControls';
import { RealModeConfirmModal } from './components/RealModeConfirmModal';
import { BrowserNoticeModal } from './components/BrowserNoticeModal';

import { useGameLoop } from './hooks/useGameLoop';
import { useCameraTracker } from './hooks/useCameraTracker';
import { useKeyboardControls } from './hooks/useKeyboardControls';

import { getDemoFiles } from './filesystem/demoFiles';
import { isDesktopApp, pickNativeDirectory, disableNativeRealMode, openOSRecycleBin } from './filesystem/nativeBridge';
import { GameConfig, GameStats, Direction } from './types/game';
import { GameFile, DirectoryScanResult } from './types/file';
import { PinkyTrackingFrame } from './types/tracking';
import { getStoredHighScore, getStoredConfig, saveConfig } from './utils/storage';
import { sound } from './game/audio';

export const App: React.FC = () => {
  // Config & Storage
  const [config, setConfig] = useState<GameConfig>(getStoredConfig);
  const [highScore, setHighScore] = useState<number>(getStoredHighScore);

  // App navigation screen with URL hash sync for GitHub Pages / browser
  const getInitialScreen = (): 'LANDING' | 'GAME' | 'JOURNAL' => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#game' || hash === '#play') return 'LANDING';
      if (hash === '#journal') return 'JOURNAL';
      if (isDesktopApp()) return 'LANDING';
      return 'JOURNAL';
    }
    return 'JOURNAL';
  };

  const [screen, setScreenState] = useState<'LANDING' | 'GAME' | 'JOURNAL'>(getInitialScreen);

  const setScreen = useCallback((newScreen: 'LANDING' | 'GAME' | 'JOURNAL') => {
    setScreenState(newScreen);
    if (typeof window !== 'undefined') {
      if (newScreen === 'JOURNAL') {
        window.location.hash = '#journal';
      } else if (newScreen === 'LANDING') {
        window.location.hash = '#game';
      }
    }
  }, []);

  // Listen to browser hash changes (back / forward navigation in browser)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#game' || hash === '#play') {
        setScreenState('LANDING');
      } else if (hash === '#journal') {
        setScreenState('JOURNAL');
      } else if (hash === '') {
        setScreenState(isDesktopApp() ? 'LANDING' : 'JOURNAL');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Filesystem food source
  const [files, setFiles] = useState<GameFile[]>(getDemoFiles);
  const [folderName, setFolderName] = useState<string>('Demo Showcase Folder');

  // Real File Mode & Session State
  const [realFileMode, setRealFileMode] = useState<boolean>(false);
  const [sessionToken, setSessionToken] = useState<string | undefined>(undefined);
  const [pendingScanResult, setPendingScanResult] = useState<DirectoryScanResult | null>(null);

  // Modals state
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState<boolean>(false);
  const [isRealConfirmModalOpen, setIsRealConfirmModalOpen] = useState<boolean>(false);
  const [isBrowserNoticeModalOpen, setIsBrowserNoticeModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [gameOverStats, setGameOverStats] = useState<GameStats | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__openSettings = () => setIsSettingsModalOpen(true);
      (window as any).__closeSettings = () => setIsSettingsModalOpen(false);
      (window as any).__triggerGameOver = (customStats?: any) => {
        setGameOverStats({
          score: 540,
          highScore: 540,
          isNewHighScore: true,
          filesEaten: [
            { name: 'thesis_final_v2.docx', size: 1420000, category: 'docs', extension: 'docx' },
            { name: 'production_database_dump.sql', size: 4890000, category: 'code', extension: 'sql' },
            { name: 'grandma_birthday_photo.raw', size: 18200000, category: 'media', extension: 'raw' },
            { name: 'tax_return_2024.pdf', size: 840000, category: 'docs', extension: 'pdf' },
            { name: 'passwords_backup.kdbx', size: 120000, category: 'archives', extension: 'kdbx' }
          ],
          durationSeconds: 78,
          timestamp: Date.now(),
          ...customStats
        });
      };
    }
  }, []);

  // Camera & Tracking state
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [lastPinkyFrame, setLastPinkyFrame] = useState<PinkyTrackingFrame | null>(null);
  const [lastDirection, setLastDirection] = useState<Direction | null>(null);
  const dirTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // DOM Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync sound settings with audio engine
  useEffect(() => {
    sound.setMuted(!config.soundEnabled);
    sound.setVolume(config.soundVolume);
  }, [config.soundEnabled, config.soundVolume]);

  const updateConfig = useCallback((patch: Partial<GameConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...patch };
      saveConfig(updated);
      return updated;
    });
  }, []);



  const handleGameOver = useCallback((stats: GameStats) => {
    setGameOverStats(stats);
  }, []);

  // Game loop hook
  const gameLoop = useGameLoop({
    canvasRef,
    config,
    files,
    highScore,
    onHighScoreChange: setHighScore,
    onGameOver: handleGameOver,
    realFileMode,
    sessionToken
  });

  // Track whether player is actively playing with keyboard or has calibrated gesture steering
  const isKeyboardActiveRef = useRef<boolean>(false);
  const hasTrackedPinkyThisRoundRef = useRef<boolean>(false);
  const pausedByPinkyLostRef = useRef<boolean>(false);

  // Direct stable direction handler passed to keyboard, camera, and touch controls
  const handleDirection = useCallback((dir: Direction) => {
    const accepted = gameLoop.changeDirection(dir);
    if (accepted) {
      setLastDirection(dir);
      if (dirTimeoutRef.current) clearTimeout(dirTimeoutRef.current);
      dirTimeoutRef.current = setTimeout(() => setLastDirection(null), 800);
    }
    return accepted;
  }, [gameLoop]);

  // Handle keyboard direction specifically (WASD / Arrows)
  const handleKeyboardDirection = useCallback((dir: Direction) => {
    isKeyboardActiveRef.current = true;
    // If paused due to pinky lost, seamlessly resume upon keyboard keypress
    if (gameLoop.status === 'PAUSED' && pausedByPinkyLostRef.current) {
      pausedByPinkyLostRef.current = false;
      gameLoop.resumeGame();
    }
    return handleDirection(dir);
  }, [gameLoop, handleDirection]);

  // Keyboard fallback & controls hook
  useKeyboardControls(
    handleKeyboardDirection,
    () => {
      isKeyboardActiveRef.current = true;
      pausedByPinkyLostRef.current = false;
      gameLoop.togglePause();
    },
    screen === 'GAME'
  );

  // Explicit Resume Game handler
  const handleResumeGame = useCallback(() => {
    isKeyboardActiveRef.current = true;
    pausedByPinkyLostRef.current = false;
    gameLoop.resumeGame();
  }, [gameLoop]);

  // Camera tracker hook
  const cameraTracker = useCameraTracker({
    enabled: cameraActive,
    sensitivity: config.pinkySensitivity,
    onDirection: handleDirection,
    onFrame: setLastPinkyFrame
  });

  // Track when pinky is actually detected in current session
  useEffect(() => {
    if (cameraTracker.status === 'PINKY_TRACKED') {
      hasTrackedPinkyThisRoundRef.current = true;
      isKeyboardActiveRef.current = false;
    }
  }, [cameraTracker.status]);

  // Lost Pinky Auto-Pause & Auto-Resume
  useEffect(() => {
    if (!cameraActive) {
      pausedByPinkyLostRef.current = false;
      return;
    }

    // Only auto-pause if user had established gesture tracking AND is not using keyboard
    if (
      gameLoop.status === 'PLAYING' &&
      cameraTracker.status === 'PINKY_LOST' &&
      hasTrackedPinkyThisRoundRef.current &&
      !isKeyboardActiveRef.current
    ) {
      pausedByPinkyLostRef.current = true;
      gameLoop.pauseGame();
    } else if (
      gameLoop.status === 'PAUSED' &&
      cameraTracker.status === 'PINKY_TRACKED' &&
      pausedByPinkyLostRef.current
    ) {
      pausedByPinkyLostRef.current = false;
      gameLoop.resumeGame();
    }
  }, [cameraActive, gameLoop.status, cameraTracker.status, gameLoop]);

  // Real File Mode Handlers
  const handleSelectRealFiles = async () => {
    if (!isDesktopApp()) {
      setIsBrowserNoticeModalOpen(true);
      return;
    }

    try {
      const res = await pickNativeDirectory();
      if (res && res.files.length > 0) {
        setPendingScanResult(res);
        setIsRealConfirmModalOpen(true);
      }
    } catch (err) {
      console.warn('Native directory picker error or cancelled:', err);
    }
  };

  const handleConfirmRealMode = () => {
    if (!pendingScanResult) return;
    const realFiles = pendingScanResult.files;
    const realToken = pendingScanResult.sessionToken;
    const fName = pendingScanResult.folderName;

    setRealFileMode(true);
    setSessionToken(realToken);
    setFiles(realFiles);
    setFolderName(fName);
    setIsRealConfirmModalOpen(false);
    setCameraActive(true);
    hasTrackedPinkyThisRoundRef.current = false;
    pausedByPinkyLostRef.current = false;
    setScreen('GAME');
    setTimeout(() => {
      gameLoop.startGame(realFiles, true, realToken);
    }, 50);
  };

  const handleCancelRealMode = async () => {
    await disableNativeRealMode();
    setPendingScanResult(null);
    setIsRealConfirmModalOpen(false);
  };

  const handleDisableRealMode = async () => {
    await disableNativeRealMode();
    setRealFileMode(false);
    setSessionToken(undefined);
    const demoFiles = getDemoFiles();
    setFiles(demoFiles);
    setFolderName('Demo Showcase Folder');
  };

  // Screen actions
  const handleStartWithCamera = async () => {
    setCameraActive(true);
    setIsCameraModalOpen(true);
  };

  const handleStartDemo = async () => {
    const demoFiles = getDemoFiles();
    await disableNativeRealMode();
    setRealFileMode(false);
    setSessionToken(undefined);
    setFiles(demoFiles);
    setFolderName('Demo Showcase Folder');
    setCameraActive(true);
    hasTrackedPinkyThisRoundRef.current = false;
    pausedByPinkyLostRef.current = false;
    setScreen('GAME');
    setTimeout(() => {
      gameLoop.startGame(demoFiles, false, undefined);
    }, 50);
  };

  const handlePlayWithKeyboard = () => {
    setIsCameraModalOpen(false);
    setCameraActive(false);
    hasTrackedPinkyThisRoundRef.current = false;
    pausedByPinkyLostRef.current = false;
    setScreen('GAME');
    setTimeout(() => {
      gameLoop.startGame(files, realFileMode, sessionToken);
    }, 50);
  };

  const handleCameraReady = () => {
    setIsCameraModalOpen(false);
    setCameraActive(true);
    hasTrackedPinkyThisRoundRef.current = false;
    pausedByPinkyLostRef.current = false;
    setScreen('GAME');
    setTimeout(() => {
      gameLoop.startGame(files, realFileMode, sessionToken);
    }, 50);
  };

  const handleFilesSelected = (selectedFiles: GameFile[], folder: string) => {
    setFiles(selectedFiles);
    setFolderName(folder);
    if (screen === 'GAME') {
      gameLoop.startGame(selectedFiles, realFileMode, sessionToken);
    }
  };

  const handleRestart = () => {
    setGameOverStats(null);
    gameLoop.startGame(files, realFileMode, sessionToken);
  };

  const handleQuitToLanding = async () => {
    gameLoop.stopGame();
    await disableNativeRealMode();
    setRealFileMode(false);
    setSessionToken(undefined);
    setGameOverStats(null);
    setScreen('LANDING');
  };

  return (
    <div className={`min-h-screen ${screen === 'JOURNAL' ? 'bg-[#070b14] p-0' : 'bg-[#09110b] p-2 sm:p-4'} text-slate-100 flex flex-col items-center justify-between font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden w-full max-w-full`}>
      {/* Background ambient lighting */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,59,148,0.14),rgba(0,0,0,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />

      {/* Global Navigation Bar on Landing Screen */}
      {screen === 'LANDING' && (
        <Navbar
          currentScreen={screen}
          onNavigate={(s) => setScreen(s)}
          onPlayGame={handleStartDemo}
        />
      )}

      {screen === 'LANDING' ? (
        <LandingScreen
          onStartWithCamera={handleStartWithCamera}
          onStartDemo={handleStartDemo}
          onOpenFolderPicker={() => setIsFolderModalOpen(true)}
          onSelectRealFiles={handleSelectRealFiles}
          onOpenJournal={() => setScreen('JOURNAL')}
          isDesktop={isDesktopApp()}
        />
      ) : screen === 'JOURNAL' ? (
        <JournalScreen
          onStartDemo={handleStartDemo}
          onStartWithCamera={handleStartWithCamera}
          onSelectRealFiles={handleSelectRealFiles}
          onBackToLanding={() => setScreen('LANDING')}
        />
      ) : (
        <main className="w-full max-w-2xl flex flex-col items-center flex-1 my-auto justify-center">
          {/* DangerPinky Unified Board Enclosure */}
          <div className="w-full max-w-[min(640px,82vh)] bg-[#3f7223] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.65),0_0_50px_rgba(255,59,148,0.2)] overflow-hidden border-4 border-[#335919] flex flex-col">
            {/* Game HUD */}
            <GameHUD
              score={gameLoop.score}
              highScore={highScore}
              filesEatenCount={gameLoop.filesEaten.length}
              filesConsumedCount={gameLoop.filesConsumedCount}
              status={gameLoop.status}
              soundMuted={!config.soundEnabled}
              onToggleSound={() => updateConfig({ soundEnabled: !config.soundEnabled })}
              onTogglePause={gameLoop.togglePause}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onRestart={handleRestart}
              onOpenFolderPicker={realFileMode ? handleSelectRealFiles : () => setIsFolderModalOpen(true)}
              folderName={folderName}
              realFileMode={realFileMode}
              onDisableRealMode={handleDisableRealMode}
              cameraActive={cameraActive}
              onToggleCamera={() => setCameraActive((prev) => !prev)}
              lastDirection={lastDirection}
              onQuitToLanding={handleQuitToLanding}
            />

            {/* Game Canvas Board */}
            <GameCanvas
              canvasRef={canvasRef}
              containerRef={canvasContainerRef}
              floatingNotes={gameLoop.floatingNotes}
              countdown={gameLoop.countdown}
              status={gameLoop.status}
            />
          </div>

          {/* Touch D-Pad for mobile / tablet or touch devices */}
          <TouchControls
            onDirection={handleDirection}
            enabled={config.touchControlsEnabled}
          />

          {/* Corner Webcam Live HUD */}
          <CameraCornerHUD
            videoRef={cameraTracker.videoRef}
            canvasRef={cameraTracker.canvasRef}
            status={cameraTracker.status}
            enabled={cameraActive}
            frame={lastPinkyFrame}
            onOpenCalibration={() => setIsCameraModalOpen(true)}
            stream={cameraTracker.stream}
            registerCanvas={cameraTracker.registerCanvas}
            unregisterCanvas={cameraTracker.unregisterCanvas}
          />

          {/* Controls helper hint */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-400 text-center max-w-full px-2">
            <span>
              Controls: <strong className="text-pink-400">Pinky Flick</strong> or{' '}
              <strong className="text-emerald-400">Arrow Keys / WASD</strong>
            </span>
            <span className="hidden xs:inline">•</span>
            <span>
              Pause: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Space</kbd>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className={realFileMode ? 'text-amber-400 font-bold' : 'text-emerald-400/90 font-medium'}>
              {realFileMode ? '● REAL FILE MODE (Recycle Bin Active)' : '○ Safe Demo Mode (Simulated)'}
            </span>
          </div>
        </main>
      )}

      {/* MODALS */}

      {/* Camera Setup & Calibration */}
      <CameraSetupModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onReadyToPlay={handleCameraReady}
        onPlayWithKeyboard={handlePlayWithKeyboard}
        videoRef={cameraTracker.videoRef}
        canvasRef={cameraTracker.canvasRef}
        status={cameraTracker.status}
        error={cameraTracker.error}
        startCamera={cameraTracker.startCamera}
        sensitivity={config.pinkySensitivity}
        onSensitivityChange={(val) => updateConfig({ pinkySensitivity: val })}
        lastFrame={lastPinkyFrame}
        stream={cameraTracker.stream}
        registerCanvas={cameraTracker.registerCanvas}
        unregisterCanvas={cameraTracker.unregisterCanvas}
      />

      {/* Folder Picker Modal */}
      <FolderPickerModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onFilesSelected={handleFilesSelected}
        currentFiles={files}
        currentFolderName={folderName}
      />

      {/* Pause Modal */}
      <PauseModal
        isOpen={gameLoop.status === 'PAUSED'}
        onResume={handleResumeGame}
        onRestart={handleRestart}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onQuitToLanding={handleQuitToLanding}
        realFileMode={realFileMode}
        onDisableRealMode={handleDisableRealMode}
        isPinkyLost={cameraActive && cameraTracker.status === 'PINKY_LOST' && pausedByPinkyLostRef.current}
      />

      {/* Game Over Modal */}
      <GameOverModal
        stats={gameOverStats}
        onPlayAgain={handleRestart}
        onChangeFolder={() => {
          setGameOverStats(null);
          setIsFolderModalOpen(true);
        }}
        onQuitToMenu={handleQuitToLanding}
        realFileMode={realFileMode}
        onOpenRecycleBin={openOSRecycleBin}
      />

      {/* Real File Mode Confirmation Modal (Requirement 10) */}
      <RealModeConfirmModal
        isOpen={isRealConfirmModalOpen}
        scanResult={pendingScanResult}
        onConfirm={handleConfirmRealMode}
        onCancel={handleCancelRealMode}
      />

      {/* Browser Fallback Notice Modal (Requirement 8) */}
      <BrowserNoticeModal
        isOpen={isBrowserNoticeModalOpen}
        onClose={() => setIsBrowserNoticeModalOpen(false)}
        onPlayDemo={() => {
          setIsBrowserNoticeModalOpen(false);
          handleStartDemo();
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={config}
        onUpdateConfig={updateConfig}
      />
    </div>
  );
};
