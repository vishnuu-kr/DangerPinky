import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  context: 'Journal' | 'Game' | 'Global';
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['←', '→'], description: 'Turn to previous / next spread', context: 'Journal' },
  { keys: ['T'], description: 'Toggle paper tone (Cream / Dark Archival)', context: 'Journal' },
  { keys: ['V'], description: 'Toggle view mode (Spread / Scroll)', context: 'Journal' },
  { keys: ['?'], description: 'Open / close this field shortcuts cheat sheet', context: 'Global' },
  { keys: ['Space'], description: 'Pause or resume active game', context: 'Game' },
  { keys: ['W', 'A', 'S', 'D'], description: 'Snake steering fallback (or Arrow Keys)', context: 'Game' },
  { keys: ['Esc'], description: 'Dismiss active modal or screenshot lightbox', context: 'Global' }
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon Stamp */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="ink-stamp ink-stamp-amber text-[9px] py-0.5 px-2">
              FIELD MANUAL
            </span>
            <h3
              id="shortcuts-modal-title"
              className="text-sm sm:text-base font-sans font-black tracking-tight text-white flex items-center gap-1.5"
            >
              <Keyboard className="w-4 h-4 text-pink-400" />
              <span>Keyboard Controls</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2.5 my-2">
          {SHORTCUTS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs font-mono"
            >
              <span className="text-slate-300 font-sans text-xs flex items-center gap-2">
                <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${
                  item.context === 'Journal'
                    ? 'text-pink-400 bg-pink-500/10 border border-pink-500/20'
                    : item.context === 'Game'
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                }`}>
                  {item.context}
                </span>
                <span>{item.description}</span>
              </span>

              <div className="flex items-center gap-1 shrink-0">
                {item.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-mono shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Press <kbd className="px-1 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px]">?</kbd> anywhere to toggle</span>
          <span className="text-pink-400/80 font-bold">UP 3.0 // 18H</span>
        </div>
      </div>
    </div>
  );
};
