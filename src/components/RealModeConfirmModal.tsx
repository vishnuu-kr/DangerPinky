import React, { useEffect } from 'react';
import { AlertTriangle, FolderCheck, CheckCircle2, X, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { DirectoryScanResult } from '../types/file';
import { formatFileSize } from '../utils/formatters';

interface RealModeConfirmModalProps {
  isOpen: boolean;
  scanResult: DirectoryScanResult | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RealModeConfirmModal: React.FC<RealModeConfirmModalProps> = ({
  isOpen,
  scanResult,
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !scanResult) return null;

  const isEmpty = scanResult.totalFiles === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg card-candy-gold p-6 sm:p-7 rounded-3xl shadow-2xl text-slate-100 flex flex-col gap-4">
        {/* Header with 3D Candy Badge */}
        <div className="flex items-center gap-3.5 pb-3.5 border-b border-amber-500/30">
          <div className="btn-candy-gold w-12 h-12 rounded-2xl flex items-center justify-center p-0 shrink-0">
            <AlertTriangle className="w-6 h-6 text-rose-700 fill-amber-300 animate-bounce-gentle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-lg sm:text-xl font-black font-game text-white tracking-wide uppercase drop-shadow">
                Real File Mode Confirmation
              </h2>
            </div>
            <p className="text-xs text-amber-200/90 font-medium font-game">
              Authentic Operating System Recycle Bin Integration
            </p>
          </div>
        </div>

        {/* Selected Folder Details Container */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-amber-500/30 flex flex-col gap-2.5 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-300 font-game font-semibold">Selected Sandbox Root:</span>
            <span className="btn-candy-green px-3 py-0.5 rounded-full text-[11px] font-game font-bold tracking-wider">
              LOCKED
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-white font-game font-bold text-base">
            <FolderCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="truncate">{scanResult.folderName}</span>
          </div>
          <div className="text-xs text-amber-100/80 font-mono pt-2 border-t border-amber-500/20 flex items-center justify-between">
            <span>Files Available: <strong className="text-white font-bold">{scanResult.totalFiles}</strong></span>
            <span>Total Size: <strong className="text-white font-bold">{formatFileSize(scanResult.totalSizeBytes)}</strong></span>
          </div>
        </div>

        {/* Rules & Explicit Consent Message */}
        <div className="space-y-3 text-xs leading-relaxed text-slate-200 bg-amber-950/40 p-4 rounded-2xl border-2 border-amber-500/30">
          <div className="flex items-start gap-3">
            <div className="btn-candy-green w-6 h-6 rounded-lg flex items-center justify-center p-0 shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3]" />
            </div>
            <span>
              Your Snake will be allowed to move files from <strong className="text-amber-300 font-bold">{scanResult.folderName}</strong> to your operating system's <strong className="text-rose-300 font-bold">Recycle Bin / Trash</strong> when the Snake eats them.
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="btn-candy-gold w-6 h-6 rounded-lg flex items-center justify-center p-0 shrink-0 mt-0.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-950 stroke-[2.5]" />
            </div>
            <span>
              <strong className="text-amber-200 font-bold">Files outside this folder will never be touched.</strong> Path traversal, symlink escapes, and system files are strictly blocked.
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="btn-candy-pink w-6 h-6 rounded-lg flex items-center justify-center p-0 shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span>
              <strong className="text-pink-300 font-bold">100% Recoverable:</strong> The actual deletion is NOT permanent. Files moved to Trash can normally be restored using your operating system at any time.
            </span>
          </div>
        </div>

        {/* Safety Tip */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/30 text-[11px] text-amber-100/90 leading-normal">
          <span className="text-amber-300 font-game font-bold">💡 Recommended Safety Rule: </span>
          For your first game, we recommend selecting a folder containing copies of files you don't mind moving to Trash (e.g. <code>DangerPinky-Test</code>).
        </div>

        {/* Empty folder warning */}
        {isEmpty && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border-2 border-rose-500/60 text-xs text-rose-200 flex items-center gap-2.5 shadow-md">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>
              <strong>No usable files found in this folder!</strong> The folder may be empty or all files are excluded system/hidden files. Please cancel and select a folder containing files.
            </span>
          </div>
        )}

        {/* 3D Candy Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="btn-candy-pill w-full sm:w-auto px-5 py-2.5 rounded-full text-slate-200 hover:text-white font-game font-bold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>

          <button
            onClick={onConfirm}
            disabled={isEmpty}
            className={`w-full sm:w-auto px-6 py-3 rounded-full font-game font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 group ${
              isEmpty
                ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-400 border border-slate-700'
                : 'btn-candy-gold cursor-pointer'
            }`}
          >
            <CheckCircle2 className="w-4.5 h-4.5 stroke-[3] text-amber-950 group-hover:scale-110 transition-transform" />
            <span>I UNDERSTAND — ENABLE REAL FILE MODE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
