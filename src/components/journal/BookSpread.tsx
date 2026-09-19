import React from 'react';

interface BookSpreadProps {
  leftPageNumber: number;
  rightPageNumber: number;
  leftRunningHead?: string;
  rightRunningHead?: string;
  paperTone?: 'dark' | 'cream';
  viewMode?: 'spread' | 'scroll';
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  fullWidthContent?: React.ReactNode;
  id?: string;
  className?: string;
}

export const BookSpread: React.FC<BookSpreadProps> = ({
  leftPageNumber,
  rightPageNumber,
  leftRunningHead = 'VISHNU K R // FIELD NOTES',
  rightRunningHead = 'UP 3.0 // 18-HOUR LOGBOOK',
  paperTone = 'dark',
  viewMode = 'spread',
  leftContent,
  rightContent,
  fullWidthContent,
  id,
  className = ''
}) => {
  const isSpreadMode = viewMode === 'spread';

  return (
    <section id={id} className={`my-6 lg:my-8 scroll-mt-24 ${className}`}>
      {/* Outer book spread frame with paper deckle edges */}
      <div
        className={`book-spread book-deckle-edges relative overflow-hidden ${
          isSpreadMode ? 'book-spread-fixed' : ''
        }`}
      >
        {/* Central spine crease between pages on desktop (only when dual page) */}
        {!fullWidthContent && <div className="hidden lg:block book-spine-crease" />}

        {fullWidthContent ? (
          <div
            className={`p-5 sm:p-8 lg:p-10 ${
              paperTone === 'cream' ? 'paper-cream' : 'paper-dark'
            } relative flex flex-col justify-between h-full min-h-full`}
          >
            {/* Running Header */}
            <div className="book-running-head text-slate-400 mb-3 flex items-center justify-between border-b border-slate-800/60 pb-2 shrink-0">
              <span>{leftRunningHead}</span>
              <span className="text-pink-400 font-mono tracking-widest text-[11px] font-bold">
                [ FOLD-OUT TECHNICAL SCHEMATIC ]
              </span>
              <span>{rightRunningHead}</span>
            </div>

            {/* Fold-out Content Area */}
            <div className="flex-1 min-h-0 space-y-4 pb-2 overflow-y-auto custom-page-scrollbar">
              {fullWidthContent}
            </div>

            {/* Folio Page Numbers */}
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-800/40 text-xs font-mono text-slate-500 shrink-0">
              <span>— PAGE {leftPageNumber} —</span>
              <span className="ink-stamp ink-stamp-green text-[9px]">DOUBLE-PAGE FOLD-OUT</span>
              <span>— PAGE {rightPageNumber} —</span>
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 items-stretch h-full ${
              paperTone === 'cream' ? 'paper-cream' : 'paper-dark'
            } ${isSpreadMode ? 'book-spread-grid' : ''}`}
          >
            {/* ─── LEFT PAGE (VERSO) ─── */}
            <div
              className="p-5 sm:p-7 lg:p-8 lg:pr-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/60 relative h-full min-h-full"
            >
              {/* Running Header */}
              <div className="book-running-head text-slate-400 shrink-0">
                <span>{leftRunningHead}</span>
                <span className="text-pink-400">SNMIMT MALIYANKARA</span>
              </div>

              {/* Natural Left Page Content */}
              <div className="flex-1 min-h-0 space-y-4 pb-2 overflow-y-auto custom-page-scrollbar">
                {leftContent}
              </div>

              {/* Folio Page Number */}
              <div className="book-page-folio shrink-0 mt-auto">
                <span>— PAGE {leftPageNumber} —</span>
              </div>
            </div>

            {/* ─── RIGHT PAGE (RECTO) ─── */}
            <div
              className="p-5 sm:p-7 lg:p-8 lg:pl-10 flex flex-col justify-between relative h-full min-h-full"
            >
              {/* Running Header */}
              <div className="book-running-head text-slate-400 shrink-0">
                <span className="text-emerald-400">MAKER EVIDENCE</span>
                <span>{rightRunningHead}</span>
              </div>

              {/* Natural Right Page Content */}
              <div className="flex-1 min-h-0 space-y-4 pb-2 overflow-y-auto custom-page-scrollbar">
                {rightContent}
              </div>

              {/* Folio Page Number */}
              <div className="book-page-folio shrink-0 mt-auto">
                <span>— PAGE {rightPageNumber} —</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

