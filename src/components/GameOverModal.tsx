import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, FolderOpen, Share2, Check, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { GameStats } from '../types/game';
import { CATEGORY_THEMES } from '../game/constants';
import { formatFileSize, formatDuration } from '../utils/formatters';
import confetti from 'canvas-confetti';

interface GameOverModalProps {
  stats: GameStats | null;
  onPlayAgain: () => void;
  onChangeFolder: () => void;
  onQuitToMenu: () => void;
  realFileMode?: boolean;
  onOpenRecycleBin?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onPlayAgain,
  onChangeFolder,
  onQuitToMenu,
  realFileMode = false,
  onOpenRecycleBin
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showFileDetails, setShowFileDetails] = useState<boolean>(false);

  useEffect(() => {
    if (stats?.isNewHighScore) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [stats]);

  if (!stats) return null;

  const totalBytes = stats.filesEaten.reduce((acc, f) => acc + f.size, 0);

  const handleShare = () => {
    const summary = `🐍 FileSnake Record!\n🎮 Score: ${stats.score}\n📁 Files Fed: ${stats.filesEaten.length} (${formatFileSize(totalBytes)})\n⏱️ Time Survived: ${formatDuration(stats.durationSeconds)}\nControlled 100% with my pinky finger!`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className={`w-full max-w-md ${stats.isNewHighScore ? 'card-candy-gold' : 'card-candy-pink'} p-5 sm:p-7 rounded-3xl shadow-2xl text-center max-h-[92vh] flex flex-col overflow-hidden text-slate-100`}>
        {/* Candy Trophy / Icon Badge */}
        <div className={`w-14 h-14 ${stats.isNewHighScore ? 'btn-candy-gold' : 'btn-candy-pink'} rounded-3xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg`}>
          <Trophy className={`w-7 h-7 ${stats.isNewHighScore ? 'text-amber-950 animate-bounce-gentle' : 'text-white'}`} />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black font-game text-white tracking-wide uppercase drop-shadow mb-1">
          {stats.isNewHighScore ? 'NEW HIGH SCORE! 🏆' : 'GAME OVER'}
        </h2>
        <p className="text-xs text-pink-200/90 font-medium font-game mb-4">
          {stats.isNewHighScore ? 'Incredible pinky dexterity! You beat your best!' : 'Watch out for walls, boundaries, and your own tail!'}
        </p>

        {/* Score Showcase Cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <div className="p-3 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 flex flex-col items-center shadow-inner">
            <span className="text-[11px] uppercase tracking-wider text-pink-300 font-bold font-game mb-0.5">
              Final Score
            </span>
            <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 leading-none">
              {stats.score}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border-2 border-amber-500/30 flex flex-col items-center shadow-inner">
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-300 font-bold font-game mb-0.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>High Score</span>
            </div>
            <span className="text-3xl sm:text-4xl font-black font-mono text-amber-300 leading-none">
              {stats.highScore}
            </span>
          </div>
        </div>

        {/* Stats summary row */}
        <div className="flex items-center justify-around py-2.5 px-3 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 text-xs text-slate-300 mb-3.5 font-game shadow-inner">
          <div>
            <span className="text-pink-300/80">Fed: </span>
            <span className="font-bold font-mono text-pink-400">{stats.filesEaten.length} files</span>
          </div>
          <span className="text-pink-500/40">•</span>
          <div>
            <span className="text-pink-300/80">Total: </span>
            <span className="font-bold font-mono text-cyan-300">{formatFileSize(totalBytes)}</span>
          </div>
          <span className="text-pink-500/40">•</span>
          <div>
            <span className="text-pink-300/80">Time: </span>
            <span className="font-bold font-mono text-white">{formatDuration(stats.durationSeconds)}</span>
          </div>
        </div>

        {/* Files Eaten Breakdown Accordion */}
        {stats.filesEaten.length > 0 && (
          <div className="flex-1 min-h-0 flex flex-col mb-4 border-2 border-pink-500/30 rounded-2xl bg-slate-950/80 overflow-hidden shadow-inner">
            <button
              onClick={() => setShowFileDetails(!showFileDetails)}
              className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-bold font-game text-pink-200 hover:bg-pink-500/10 transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>Files Consumed</span>
                <span className="btn-candy-pink px-2 py-0.2 rounded-full text-[10px] font-black">{stats.filesEaten.length}</span>
              </span>
              {showFileDetails ? <ChevronUp className="w-4 h-4 text-pink-300" /> : <ChevronDown className="w-4 h-4 text-pink-300" />}
            </button>

            {showFileDetails && (
              <div className="flex-1 overflow-y-auto max-h-36 p-2 divide-y divide-pink-500/20 text-left">
                {stats.filesEaten.map((f, i) => {
                  const theme = CATEGORY_THEMES[f.category] || CATEGORY_THEMES.other;
                  return (
                    <div key={i} className="py-1.5 px-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-black font-game ${theme.badgeClass}`}>
                          {f.extension || 'file'}
                        </span>
                        <span className="truncate text-slate-200 font-mono text-[11px]">{f.name}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px] shrink-0">
                        {formatFileSize(f.size)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={onPlayAgain}
            className="btn-candy-green w-full py-3.5 rounded-full font-game text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg group"
          >
            <RefreshCw className="w-5 h-5 stroke-[2.5] group-hover:rotate-180 transition-transform duration-500" />
            <span>PLAY AGAIN</span>
          </button>

          {realFileMode && onOpenRecycleBin && (
            <button
              onClick={onOpenRecycleBin}
              className="btn-candy-gold w-full py-2.5 rounded-full font-game font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Trash2 className="w-4 h-4 text-amber-950" />
              <span>View & Restore Files in Recycle Bin</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className="btn-candy-pill py-2.5 rounded-full font-game font-bold text-xs text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-pink-300" />}
              <span>{copied ? 'Copied!' : 'Share Score'}</span>
            </button>

            <button
              onClick={onChangeFolder}
              className="btn-candy-pill py-2.5 rounded-full font-game font-bold text-xs text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Change Folder</span>
            </button>
          </div>

          <button
            onClick={onQuitToMenu}
            className="btn-candy-pill py-2 rounded-full font-game text-xs font-semibold text-pink-300 hover:text-white transition cursor-pointer mt-0.5"
          >
            Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
