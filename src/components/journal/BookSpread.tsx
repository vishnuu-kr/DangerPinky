import React from 'react';

export type LayoutVariant = 'standard' | 'editorial' | 'technical' | 'notebook';

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
  layoutVariant?: LayoutVariant;
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
  className = '',
  layoutVariant = 'standard'
}) => {
  const isSpreadMode = viewMode === 'spread';

  const gridColsClass = 'grid-cols-1 lg:grid-cols-2';

  const leftTextureClass = layoutVariant === 'notebook' ? 'paper-dots' : '';
  const rightTextureClass = layoutVariant === 'technical' ? 'paper-grid' : layoutVariant === 'notebook' ? 'paper-dots' : '';

  return (
    <section id={id} className={`my-6 lg:my-8 scroll-mt-24 ${className}`}>
      {/* Outer book spread frame with paper deckle edges */}
      <div
        className={`book-spread book-deckle-edges relative overflow-hidden ${
          isSpreadMode ? 'book-spread-fixed' : ''
        }`}
      >
        {/* Central spine crease between pages on desktop (only when dual page) */}
        {!fullWidthContent && (
          <div
            className="hidden lg:block book-spine-crease"
            style={{
              boxShadow:
                paperTone === 'cream'
                  ? 'inset -4px 0 8px rgba(120,90,50,0.22), inset 4px 0 8px rgba(120,90,50,0.22)'
                  : 'inset -4px 0 8px rgba(0,0,0,0.4), inset 4px 0 8px rgba(0,0,0,0.4)',
            }}
          />
        )}

        {fullWidthContent ? (
          <div
            className={`p-5 sm:p-8 lg:p-10 ${
              paperTone === 'cream' ? 'paper-cream' : 'paper-dark'
            } ${layoutVariant === 'technical' ? 'paper-grid' : ''} relative flex flex-col justify-between h-full min-h-full`}
          >
            {/* Running Header */}
            <div className={`book-running-head mb-3 flex items-center justify-between border-b pb-2 shrink-0 ${
              paperTone === 'cream' ? 'border-amber-900/15 text-stone-600' : 'border-slate-800/60 text-slate-400'
            }`}>
              <span>{leftRunningHead}</span>
              <span className={`font-mono tracking-widest text-[11px] font-bold ${
                paperTone === 'cream' ? 'text-pink-700' : 'text-pink-400'
              }`}>
                [ FOLD-OUT TECHNICAL SCHEMATIC ]
              </span>
              <span>{rightRunningHead}</span>
            </div>

            {/* Fold-out Content Area */}
            <div className="flex-1 min-h-0 space-y-4 pb-2 overflow-y-auto overflow-x-hidden custom-page-scrollbar">
              {fullWidthContent}
            </div>

            {/* Folio Page Numbers */}
            <div className={`flex justify-between items-center mt-auto pt-2 border-t text-xs font-mono shrink-0 ${
              paperTone === 'cream' ? 'border-amber-900/15 text-stone-500' : 'border-slate-800/40 text-slate-500'
            }`}>
              <span className={`px-2 py-0.5 border-t text-[9px] font-mono ${
                paperTone === 'cream' ? 'border-amber-900/20 text-stone-600' : 'border-slate-700/60 text-slate-600'
              }`}>— PAGE {leftPageNumber} —</span>
              <span className="ink-stamp ink-stamp-green text-[9px]">DOUBLE-PAGE FOLD-OUT</span>
              <span className={`px-2 py-0.5 border-t text-[9px] font-mono ${
                paperTone === 'cream' ? 'border-amber-900/20 text-stone-600' : 'border-slate-700/60 text-slate-600'
              }`}>— PAGE {rightPageNumber} —</span>
            </div>
          </div>
        ) : (
          <div
            className={`grid ${gridColsClass} items-stretch h-full ${
              paperTone === 'cream' ? 'paper-cream' : 'paper-dark'
            } ${isSpreadMode ? 'book-spread-grid' : ''}`}
          >
            {/* ─── LEFT PAGE (VERSO) ─── */}
            <div
              className={`p-4 sm:p-6 lg:p-7 lg:pr-12 xl:pr-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r relative h-full min-h-full ${
                paperTone === 'cream' ? 'border-[#dfd3c3]' : 'border-slate-800/60'
              } ${leftTextureClass}`}
            >
              {/* Running Header */}
              <div className={`book-running-head shrink-0 ${paperTone === 'cream' ? 'text-stone-600' : 'text-slate-400'}`}>
                <span>{leftRunningHead}</span>
                <span className={`font-mono text-[10px] tracking-[0.25em] ${
                  paperTone === 'cream' ? 'text-pink-700 font-bold' : 'text-pink-400'
                }`}>UP 3.0 · SNMIMT</span>
              </div>

              {/* Natural Left Page Content with Smooth Archival Scroll */}
              <div className="flex-1 min-h-0 space-y-2.5 pb-1 overflow-y-auto overflow-x-hidden custom-page-scrollbar">
                {leftContent}
              </div>

              {/* Folio Page Number */}
              <div className="book-page-folio shrink-0 mt-auto">
                <span className={`px-2 py-0.5 border-t text-[9px] font-mono ${
                  paperTone === 'cream' ? 'border-amber-900/20 text-stone-600' : 'border-slate-700/60 text-slate-600'
                }`}>— PAGE {leftPageNumber} —</span>
              </div>
            </div>

            {/* Mobile Page Transition Ribbon */}
            <div className={`lg:hidden flex items-center justify-between py-2 px-5 border-y text-[10px] font-mono shrink-0 ${
              paperTone === 'cream'
                ? 'bg-[#f4efe4] border-amber-900/20 text-stone-700'
                : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
            }`}>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                <span>PAGE {leftPageNumber} COMPLETE</span>
              </span>
              <span className={paperTone === 'cream' ? 'text-pink-700 font-bold tracking-wider' : 'text-pink-400 font-semibold tracking-wider'}>
                CONTINUE TO PAGE {rightPageNumber} ↓
              </span>
            </div>

            {/* ─── RIGHT PAGE (RECTO) ─── */}
            <div
              className={`p-4 sm:p-6 lg:p-7 lg:pl-12 xl:pl-14 flex flex-col justify-between relative h-full min-h-full ${rightTextureClass}`}
            >
              {/* Page curl shadow */}
              <div
                className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
                style={{
                  background:
                    paperTone === 'cream'
                      ? 'radial-gradient(ellipse at bottom right, rgba(120,90,50,0.18) 0%, transparent 70%)'
                      : 'radial-gradient(ellipse at bottom right, rgba(0,0,0,0.4) 0%, transparent 70%)',
                }}
              />

              {/* Running Header */}
              <div className={`book-running-head shrink-0 ${paperTone === 'cream' ? 'text-stone-600' : 'text-slate-400'}`}>
                <span className={`font-mono text-[10px] tracking-[0.25em] ${
                  paperTone === 'cream' ? 'text-emerald-700 font-bold' : 'text-emerald-400'
                }`}>VISHNU K R</span>
                <span>{rightRunningHead}</span>
              </div>

              {/* Natural Right Page Content with Smooth Archival Scroll */}
              <div className="flex-1 min-h-0 space-y-2.5 pb-1 overflow-y-auto overflow-x-hidden custom-page-scrollbar">
                {rightContent}
              </div>

              {/* Folio Page Number */}
              <div className="book-page-folio shrink-0 mt-auto">
                <span className={`px-2 py-0.5 border-t text-[9px] font-mono ${
                  paperTone === 'cream' ? 'border-amber-900/20 text-stone-600' : 'border-slate-700/60 text-slate-600'
                }`}>— PAGE {rightPageNumber} —</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};
