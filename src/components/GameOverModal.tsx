import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, FolderOpen, Share2, Check, ChevronDown, ChevronUp, Trash2, Award, ListOrdered, FileText, Download } from 'lucide-react';
import { GameStats, LeaderboardEntry } from '../types/game';
import { CATEGORY_THEMES } from '../game/constants';
import { formatFileSize, formatDuration } from '../utils/formatters';
import { getStoredLeaderboard } from '../utils/storage';
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
  const [copiedCert, setCopiedCert] = useState<boolean>(false);
  const [downloadingImg, setDownloadingImg] = useState<boolean>(false);
  const [showFileDetails, setShowFileDetails] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'CERTIFICATE' | 'LEADERBOARD'>('CERTIFICATE');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (stats?.isNewHighScore) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    setLeaderboard(getStoredLeaderboard());
  }, [stats]);

  if (!stats) return null;

  const totalBytes = stats.filesEaten.reduce((acc, f) => acc + f.size, 0);
  const rating = stats.hazardRating || (stats.score >= 40 ? 'HARD DRIVE REAPER 👑' : stats.score >= 25 ? 'CHAOTIC JANITOR 🥇' : stats.score >= 12 ? 'RECKLESS CLEANER 🥈' : 'NOVICE BROOM 🥉');

  const handleShare = () => {
    const summary = `🎯 DangerPinky Record!\n🎮 Score: ${stats.score}\n📁 Files Fed: ${stats.filesEaten.length} (${formatFileSize(totalBytes)})\n⏱️ Time Survived: ${formatDuration(stats.durationSeconds)}\nControlled 100% with my pinky finger!`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareCertificate = () => {
    const cert = [
      '╔════════════════════════════════════════════════╗',
      '║   ⚠️ DANGERPINKY HARD DRIVE HAZARD CERT ⚠️     ║',
      '╠════════════════════════════════════════════════╣',
      `║ HAZARD RATING: ${rating}`,
      `║ FINAL SCORE:   ${stats.score}`,
      `║ FILES CONSUMED:${stats.filesEaten.length} files (${formatFileSize(totalBytes)})`,
      `║ TIME SURVIVED: ${formatDuration(stats.durationSeconds)}`,
      `║ GAME MODE:     ${stats.gameMode || 'WRAP'}`,
      `║ STORAGE MODE:  ${realFileMode ? 'Real OS Files (Recycled)' : 'Safe Demo (Simulated)'}`,
      '║ CONTROL MODE:  100% AI Pinky Gesture Tracking',
      '╚════════════════════════════════════════════════╝'
    ].join('\n');
    navigator.clipboard.writeText(cert).then(() => {
      setCopiedCert(true);
      setTimeout(() => setCopiedCert(false), 2000);
    });
  };

  const handleDownloadImageCard = () => {
    if (!stats) return;
    setDownloadingImg(true);

    try {
      const cvs = document.createElement('canvas');
      cvs.width = 1200;
      cvs.height = 675;
      const c = cvs.getContext('2d');
      if (!c) return;

      // Dark cyber gradient background
      const bgGrad = c.createLinearGradient(0, 0, 1200, 675);
      bgGrad.addColorStop(0, '#070b14');
      bgGrad.addColorStop(0.5, '#13091f');
      bgGrad.addColorStop(1, '#070b14');
      c.fillStyle = bgGrad;
      c.fillRect(0, 0, 1200, 675);

      // Grid background pattern
      c.strokeStyle = 'rgba(217, 70, 239, 0.08)';
      c.lineWidth = 1;
      for (let x = 0; x < 1200; x += 40) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, 675);
        c.stroke();
      }
      for (let y = 0; y < 675; y += 40) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(1200, y);
        c.stroke();
      }

      // Outer cyber neon border
      c.strokeStyle = '#ec4899';
      c.lineWidth = 6;
      c.strokeRect(16, 16, 1168, 643);

      c.strokeStyle = '#f59e0b';
      c.lineWidth = 2;
      c.strokeRect(26, 26, 1148, 623);

      // Header Banner
      c.fillStyle = '#ff3b94';
      c.font = 'bold 22px monospace';
      c.textAlign = 'center';
      c.fillText('⚠️ OFFICIAL HARD DRIVE HAZARD CERTIFICATE ⚠️', 600, 70);

      // Title
      c.fillStyle = '#ffffff';
      c.font = '900 48px sans-serif';
      c.fillText('DANGERPINKY', 600, 130);

      c.fillStyle = '#f472b6';
      c.font = '600 18px sans-serif';
      c.fillText('Russian Roulette For Your Filesystem • 100% AI Pinky Tracking', 600, 165);

      // Hazard Rating Seal
      c.fillStyle = 'rgba(245, 158, 11, 0.12)';
      c.strokeStyle = '#f59e0b';
      c.lineWidth = 3;
      c.beginPath();
      c.roundRect(300, 195, 600, 70, 16);
      c.fill();
      c.stroke();

      c.fillStyle = '#fbbf24';
      c.font = '900 24px sans-serif';
      c.fillText(`HAZARD RATING: ${rating}`, 600, 238);

      // Stat Cards Grid
      const cards = [
        { label: 'FINAL SCORE', val: `${stats.score} PTS`, col: '#34d399' },
        { label: 'HIGH SCORE', val: `${stats.highScore} PTS`, col: '#fbbf24' },
        { label: 'FILES CONSUMED', val: `${stats.filesEaten.length} (${formatFileSize(totalBytes)})`, col: '#38bdf8' },
        { label: 'TIME SURVIVED', val: formatDuration(stats.durationSeconds), col: '#f472b6' }
      ];

      cards.forEach((card, idx) => {
        const cx = 100 + (idx % 2) * 520;
        const cy = 295 + Math.floor(idx / 2) * 110;
        c.fillStyle = 'rgba(15, 23, 42, 0.85)';
        c.strokeStyle = 'rgba(236, 72, 153, 0.35)';
        c.lineWidth = 2;
        c.beginPath();
        c.roundRect(cx, cy, 480, 85, 14);
        c.fill();
        c.stroke();

        c.fillStyle = '#94a3b8';
        c.font = 'bold 14px monospace';
        c.textAlign = 'left';
        c.fillText(card.label, cx + 24, cy + 32);

        c.fillStyle = card.col;
        c.font = '900 28px monospace';
        c.fillText(card.val, cx + 24, cy + 68);
      });

      // Death Cam snapshot info
      if (stats.fatalCrashSnapshot) {
        c.fillStyle = 'rgba(225, 29, 72, 0.2)';
        c.strokeStyle = '#e11d48';
        c.lineWidth = 2;
        c.beginPath();
        c.roundRect(100, 535, 1000, 50, 12);
        c.fill();
        c.stroke();

        c.fillStyle = '#fca5a5';
        c.font = 'bold 16px monospace';
        c.textAlign = 'center';
        c.fillText(`💀 FATAL MOMENT: ${stats.fatalCrashSnapshot.collisionType} at Grid [${stats.fatalCrashSnapshot.headX}, ${stats.fatalCrashSnapshot.headY}] • ${stats.fatalCrashSnapshot.nearestFoodDistance} cells from food`, 600, 566);
      }

      // Footer
      c.fillStyle = '#64748b';
      c.font = '13px monospace';
      c.textAlign = 'center';
      c.fillText('TINKERHUB USELESS PROJECTS 3.0 • PLAY ONLINE: https://vishnuu-kr.github.io/DangerPinky/', 600, 615);

      // Trigger download
      const link = document.createElement('a');
      link.download = `DangerPinky-Certificate-${stats.score}pts.png`;
      link.href = cvs.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Failed to generate PNG certificate:', e);
    } finally {
      setTimeout(() => setDownloadingImg(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className={`w-full max-w-md ${stats.isNewHighScore ? 'card-candy-gold' : 'card-candy-pink'} p-5 sm:p-6 rounded-3xl shadow-2xl text-center max-h-[92vh] flex flex-col overflow-hidden text-slate-100`}>
        {/* Candy Trophy / Icon Badge */}
        <div className={`w-12 h-12 ${stats.isNewHighScore ? 'btn-candy-gold' : 'btn-candy-pink'} rounded-2xl flex items-center justify-center text-white mx-auto mb-2 shadow-lg`}>
          <Trophy className={`w-6 h-6 ${stats.isNewHighScore ? 'text-amber-950 animate-bounce-gentle' : 'text-white'}`} />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black font-game text-white tracking-wide uppercase drop-shadow mb-0.5">
          {stats.isNewHighScore ? 'NEW HIGH SCORE! 🏆' : 'GAME OVER'}
        </h2>
        <p className="text-[11px] text-pink-200/90 font-medium font-game mb-3">
          {stats.isNewHighScore ? 'Incredible pinky dexterity! You beat your best!' : 'Watch out for walls, boundaries, and your own tail!'}
        </p>

        {/* Tabs switcher: Hazard Certificate vs Top 5 Leaderboard */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-950/60 rounded-2xl mb-3 border border-pink-500/20">
          <button
            onClick={() => setActiveTab('CERTIFICATE')}
            className={`flex-1 py-1.5 px-3 rounded-xl font-game font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'CERTIFICATE'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-pink-200/70 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Hazard Certificate</span>
          </button>
          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`flex-1 py-1.5 px-3 rounded-xl font-game font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'LEADERBOARD'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-pink-200/70 hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>
        </div>

        {activeTab === 'CERTIFICATE' ? (
          <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pr-0.5 space-y-2.5">
            {/* Hard Drive Hazard Certificate Card */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-300 text-left shadow-inner flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80 block">Hazard Rating</span>
                  <span className="text-xs sm:text-sm font-black font-game text-amber-200 leading-tight block">{rating}</span>
                </div>
              </div>
              <button
                onClick={handleShareCertificate}
                className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-[10px] font-game flex items-center gap-1 cursor-pointer transition shadow-sm shrink-0"
              >
                {copiedCert ? <Check className="w-3 h-3 text-emerald-800 stroke-[3]" /> : <Share2 className="w-3 h-3 stroke-[2.5]" />}
                <span>{copiedCert ? 'Copied!' : 'Copy Cert'}</span>
              </button>
            </div>

            {/* Fatal Moment Death Cam Card */}
            {stats.fatalCrashSnapshot && (
              <div className="p-2.5 rounded-2xl bg-rose-950/40 border-2 border-rose-500/40 text-left shadow-inner flex items-center justify-between animate-in fade-in duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-300 font-mono text-sm shrink-0">
                    💀
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 font-game">
                        Fatal Moment: {stats.fatalCrashSnapshot.collisionType}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-300">
                      Grid [{stats.fatalCrashSnapshot.headX}, {stats.fatalCrashSnapshot.headY}] • {stats.fatalCrashSnapshot.nearestFoodDistance} cells from food
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                  DEATH CAM
                </span>
              </div>
            )}

            {/* Score Showcase Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 flex flex-col items-center shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-pink-300 font-bold font-game mb-0.5">
                  Final Score
                </span>
                <span className="text-3xl font-black font-mono text-emerald-400 leading-none">
                  {stats.score}
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-950/80 border-2 border-amber-500/30 flex flex-col items-center shadow-inner">
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-300 font-bold font-game mb-0.5">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>High Score</span>
                </div>
                <span className="text-3xl font-black font-mono text-amber-300 leading-none">
                  {stats.highScore}
                </span>
              </div>
            </div>

            {/* Stats summary row */}
            <div className="flex items-center justify-around py-2 px-3 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 text-[11px] text-slate-300 font-game shadow-inner">
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
              <div className="border-2 border-pink-500/30 rounded-2xl bg-slate-950/80 overflow-hidden shadow-inner text-left">
                <button
                  onClick={() => setShowFileDetails(!showFileDetails)}
                  className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold font-game text-pink-200 hover:bg-pink-500/10 transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-pink-400" />
                    <span>Files Consumed</span>
                    <span className="btn-candy-pink px-2 py-0.2 rounded-full text-[10px] font-black">{stats.filesEaten.length}</span>
                  </span>
                  {showFileDetails ? <ChevronUp className="w-4 h-4 text-pink-300" /> : <ChevronDown className="w-4 h-4 text-pink-300" />}
                </button>

                {showFileDetails && (
                  <div className="max-h-28 overflow-y-auto p-2 divide-y divide-pink-500/20">
                    {stats.filesEaten.map((f, i) => {
                      const theme = CATEGORY_THEMES[f.category] || CATEGORY_THEMES.other;
                      return (
                        <div key={i} className="py-1 px-1.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-black font-game ${theme.badgeClass}`}>
                              {f.extension || 'file'}
                            </span>
                            <span className="truncate text-slate-200 font-mono text-[10px]">{f.name}</span>
                          </div>
                          <span className="text-slate-400 font-mono text-[9px] shrink-0">
                            {formatFileSize(f.size)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 min-h-[160px] max-h-56 overflow-y-auto pr-0.5 space-y-1.5 text-left">
            {leaderboard.length === 0 ? (
              <div className="p-6 text-center text-xs text-pink-300/70 font-game">
                No previous runs recorded yet.
              </div>
            ) : (
              leaderboard.map((entry, idx) => (
                <div
                  key={entry.id || idx}
                  className={`p-2.5 rounded-2xl border-2 flex items-center justify-between text-xs font-game transition ${
                    entry.score === stats.score && entry.durationSeconds === stats.durationSeconds
                      ? 'bg-amber-500/20 border-amber-400/60 shadow-md'
                      : 'bg-slate-950/80 border-pink-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                      idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-emerald-400 font-mono text-xs">{entry.score} pts</span>
                        <span className="text-[10px] text-pink-300/80">({entry.filesCount} files)</span>
                      </div>
                      <div className="text-[9px] text-slate-400 flex items-center gap-1">
                        <span>{entry.mode}</span>
                        <span>•</span>
                        <span>{entry.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 font-bold block">
                      {entry.hazardRating ? entry.hazardRating.split(' ')[0] : 'RUN'}
                    </span>
                    <span className="text-[9px] text-cyan-300 font-mono">{formatFileSize(entry.bytesCleaned)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-3 border-t border-pink-500/20">
          <button
            onClick={onPlayAgain}
            className="btn-candy-green w-full py-3 rounded-full font-game text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg group"
          >
            <RefreshCw className="w-4 h-4 stroke-[2.5] group-hover:rotate-180 transition-transform duration-500" />
            <span>PLAY AGAIN</span>
          </button>

          {realFileMode && onOpenRecycleBin && (
            <button
              onClick={onOpenRecycleBin}
              className="btn-candy-gold w-full py-2 rounded-full font-game font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-950" />
              <span>View & Restore Files in Recycle Bin</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className="btn-candy-pill py-2 rounded-full font-game font-bold text-xs text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-pink-300" />}
              <span>{copied ? 'Copied!' : 'Share Score'}</span>
            </button>

            <button
              onClick={handleDownloadImageCard}
              disabled={downloadingImg}
              className="btn-candy-pill py-2 rounded-full font-game font-bold text-xs text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-300" />
              <span>{downloadingImg ? 'Generating...' : 'Save PNG Card'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onChangeFolder}
              className="btn-candy-pill py-2 rounded-full font-game font-bold text-xs text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Change Folder</span>
            </button>

            <button
              onClick={onQuitToMenu}
              className="btn-candy-pill py-2 rounded-full font-game text-xs font-semibold text-pink-300 hover:text-white transition cursor-pointer"
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
