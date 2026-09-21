import React, { useEffect, useRef, useState } from 'react';
import { X, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenshotGalleryItem } from '../../data/journalChapters';

interface LightboxModalProps {
  item: ScreenshotGalleryItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  totalCount?: number;
  currentIndex?: number;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  onClose,
  onNext,
  onPrev,
  totalCount = 4,
  currentIndex = 0,
}) => {
  const [visible, setVisible] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Trigger open animation
  useEffect(() => {
    if (item) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
    }
  }, [item]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const handleClose = () => {
    setVisible(false);
    // Small delay so exit animation can play
    setTimeout(onClose, 180);
  };

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(delta) > 50) {
      if (delta < 0 && onNext) onNext();
      else if (delta > 0 && onPrev) onPrev();
    }
  };

  if (!item) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`relative bg-[#0a0f1d] border border-pink-500/30 rounded-2xl max-w-4xl w-full shadow-[0_40px_100px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh] transition-all duration-200 ${
          visible ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ transformOrigin: 'center center' }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-800/60 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest px-2.5 py-1 rounded bg-pink-500/10 border border-pink-500/25 shrink-0">
              {item.badge}
            </span>
            <span className="text-xs font-mono text-slate-500 hidden sm:block truncate">
              {item.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Image index */}
            <span className="font-mono text-[11px] text-slate-500 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hidden sm:block">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
            </span>

            {totalCount > 1 && onPrev && (
              <button
                onClick={onPrev}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                title="Previous (← arrow)"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {totalCount > 1 && onNext && (
              <button
                onClick={onNext}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                title="Next (→ arrow)"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer ml-1 border border-slate-800"
              title="Close (Escape)"
              aria-label="Close lightbox"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative bg-black/60 flex items-center justify-center overflow-hidden shrink-0"
          style={{ maxHeight: '52vh' }}>
          <img
            src={item.src}
            alt={item.title}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: '52vh' }}
          />

          {/* Arrow overlays for touch/click navigation */}
          {totalCount > 1 && onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-950/90 transition-colors cursor-pointer border border-slate-700/40"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {totalCount > 1 && onNext && (
            <button
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-950/90 transition-colors cursor-pointer border border-slate-700/40"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Title + Description */}
        <div className="px-5 pt-3.5 pb-2 overflow-y-auto shrink-0">
          <h3 className="text-base sm:text-lg font-sans font-black text-white mb-1.5 leading-snug">
            {item.title}
          </h3>

          <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-sans mb-3">
            {item.description}
          </p>

          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3">
            <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wider block mb-1.5">
              Engineering Highlights
            </span>
            <div className="space-y-1.5">
              {item.techHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[12px] text-slate-300 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom hint */}
          <p className="text-[10px] font-mono text-slate-600 text-center mt-3">
            Swipe or use ← → arrows to navigate · Esc to close
          </p>
        </div>
      </div>
    </div>
  );
};
