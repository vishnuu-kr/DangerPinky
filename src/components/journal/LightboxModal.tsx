import React, { useEffect } from 'react';
import { X, CheckCircle2, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ScreenshotGalleryItem } from '../../data/journalChapters';

interface LightboxModalProps {
  item: ScreenshotGalleryItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  onClose,
  onNext,
  onPrev
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="relative bg-slate-900 border-2 border-pink-500/40 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30">
              {item.badge}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              {item.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onPrev && (
              <button
                onClick={onPrev}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Previous Screenshot (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Next Screenshot (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
              title="Close (Escape)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h3 className="text-lg sm:text-2xl font-game font-bold text-white mb-3">
          {item.title}
        </h3>

        {/* Image Container */}
        <div className="relative aspect-[16/10] max-h-[50vh] w-full rounded-2xl overflow-hidden border border-slate-800 bg-black/80 mb-4 flex items-center justify-center shrink-0">
          <img
            src={item.src}
            alt={item.title}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-black/60 backdrop-blur-md text-slate-400">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Narrative & Technical Highlights Scroll Area */}
        <div className="overflow-y-auto space-y-3.5 pr-1">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {item.description}
          </p>

          <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block mb-1">
              Engineering Highlights:
            </span>
            {item.techHighlights.map((hl, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
