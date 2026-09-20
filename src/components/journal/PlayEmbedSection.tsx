import React, { useState, useEffect } from 'react';
import {
  Play,
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCcw,
  Video,
  Keyboard,
  Flame
} from 'lucide-react';
import { PERSISTENT_LINKS } from '../../data/journalChapters';

interface PlayEmbedSectionProps {
  onStartDemo?: () => void;
  onStartWithCamera?: () => void;
  onSelectRealFiles?: () => void;
  hideTopNotice?: boolean;
  iframeHeight?: string;
}

export const PlayEmbedSection: React.FC<PlayEmbedSectionProps> = ({
  onStartDemo,
  onStartWithCamera,
  onSelectRealFiles,
  hideTopNotice = false,
  iframeHeight = 'h-[265px] sm:h-[285px]'
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'video' | 'game' | 'clip'>('video');

  const liveUrl = PERSISTENT_LINKS.liveDemo;
  const demoVideoEmbedUrl = 'https://drive.google.com/file/d/1aIiCRxT6f9T7WfaB7Iu2qHBtmiiLmvXs/preview';
  const gameplayClipEmbedUrl = 'https://drive.google.com/file/d/1E13dHVe5IdU1-mxnOFmG7JbfV21UzL75/preview';

  // Listen to Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="my-1">
      {/* Explicit Safety Notice */}
      {!hideTopNotice && (
        <div className="mb-2.5 p-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="ink-stamp ink-stamp-green text-[9px] py-0.5 px-1.5">SANDBOXED RUNTIME</span>
            <span className="text-slate-300 text-[11px]">
              Web edition uses memory-only mock files. Your real storage cannot be modified.
            </span>
          </div>
          <span className="text-emerald-400 font-bold text-[10.5px] shrink-0">100% RECOVERABLE / ZERO RISK</span>
        </div>
      )}

      {/* Embedded Arena Container */}
      <div
        className={`transition-all duration-300 ${
          isFullscreen
            ? 'fixed inset-0 z-50 w-screen h-screen bg-black flex flex-col p-2 sm:p-4'
            : 'relative bg-slate-950/90 border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl max-w-5xl mx-auto'
        }`}
      >
        {/* Frame Top Header & Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 px-1">
          {/* Media Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Demo Video</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('game')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'game'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Keyboard className="w-3 h-3" />
              <span>Play Game</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('clip')}
              className={`hidden sm:flex px-2 py-1 rounded-lg text-xs font-mono font-bold items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'clip'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Raw Clip</span>
            </button>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2">
            {/* Reload button (when in game mode) */}
            {activeTab === 'game' && (
              <button
                onClick={handleReload}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
                title="Reload embedded game"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reload</span>
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand to Fullscreen'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>

            {/* External New-Tab Launch */}
            <a
              href={activeTab === 'video' ? PERSISTENT_LINKS.driveVideo : liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <span>{activeTab === 'video' ? 'Drive ↗' : 'Open Tab'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Responsive Media Container */}
        <div
          className={`relative w-full rounded-xl overflow-hidden border border-slate-800 bg-black flex-1 ${
            isFullscreen ? 'h-[calc(100vh-65px)]' : iframeHeight
          }`}
        >
          {activeTab === 'video' && (
            <iframe
              src={demoVideoEmbedUrl}
              title="DangerPinky Live Demo Video"
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          )}

          {activeTab === 'clip' && (
            <iframe
              src={gameplayClipEmbedUrl}
              title="DangerPinky Raw Gameplay Clip"
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          )}

          {/* Interactive Game Iframe (kept mounted for fast switching & state persistence) */}
          <iframe
            key={reloadKey}
            src={liveUrl}
            title="DangerPinky Live Game"
            className={`w-full h-full border-0 ${activeTab === 'game' ? 'block' : 'hidden'}`}
            allow="camera; autoplay; fullscreen"
            loading="lazy"
          />
        </div>

        {/* Controls Guide Bar */}
        {!isFullscreen && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 text-pink-300 font-semibold text-[11px]">
                <Video className="w-3.5 h-3.5 text-pink-400" />
                <span>Pinky: Landmark 20</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-300 font-semibold text-[11px]">
                <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Keys: Arrows / WASD</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400 text-[10.5px]">
                <kbd className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[9.5px]">
                  Space
                </kbd>
                <span>Pause</span>
              </span>
            </div>

            {/* Quick Local Play Actions */}
            <div className="flex items-center gap-1.5">
              {onStartDemo && (
                <button
                  onClick={onStartDemo}
                  className="px-2.5 py-0.5 rounded-full bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Play className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
                  <span>Launch Demo</span>
                </button>
              )}

              {onStartWithCamera && (
                <button
                  onClick={onStartWithCamera}
                  className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Video className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Webcam</span>
                </button>
              )}

              {onSelectRealFiles && (
                <button
                  onClick={onSelectRealFiles}
                  className="px-2.5 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Flame className="w-2.5 h-2.5 text-amber-400" />
                  <span>Danger Mode</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
