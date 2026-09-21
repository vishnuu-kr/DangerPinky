import React from 'react';
import { Monitor, ShieldCheck, Play, X } from 'lucide-react';

interface BrowserNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayDemo: () => void;
}

export const BrowserNoticeModal: React.FC<BrowserNoticeModalProps> = ({
  isOpen,
  onClose,
  onPlayDemo
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md card-candy-gold p-5 sm:p-7 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="btn-candy-gold w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center p-0 shrink-0 shadow-md">
              <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h2 className="text-base sm:text-lg font-black font-game text-white tracking-wide uppercase drop-shadow">
                  Real File Mode Unavailable
                </h2>
              </div>
              <p className="text-xs text-amber-200/90 font-medium font-game">Browser Security Boundary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-candy-pill p-2 rounded-xl text-slate-200 hover:text-white cursor-pointer"
            aria-label="Close notice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Content Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-amber-500/30 text-center flex flex-col items-center shadow-inner font-game">
          <p className="text-sm font-black text-white mb-2 leading-snug">
            This web version cannot move files to your Recycle Bin directly.
          </p>
          <p className="text-xs text-amber-100/80 leading-relaxed mb-3">
            Web browsers enforce strict sandboxes preventing direct OS Trash / Recycle Bin manipulation. For genuine file consumption and OS Recycle Bin integration, run the native <strong>DangerPinky Desktop App</strong>.
          </p>
          <div className="btn-candy-green px-3 py-1 rounded-full text-[11px] font-black font-game flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Zero permanent deletion • 100% Safe Demo</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-amber-500/30">
          <button
            onClick={onClose}
            className="btn-candy-pill w-full sm:w-auto px-5 py-2.5 rounded-full font-game font-bold text-xs sm:text-sm text-slate-200 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
          <button
            onClick={onPlayDemo}
            className="btn-candy-green w-full sm:w-auto px-6 py-2.5 rounded-full font-game font-black text-xs sm:text-sm text-white shadow-lg cursor-pointer flex items-center justify-center gap-2 group"
          >
            <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
            <span>PLAY SAFE DEMO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
