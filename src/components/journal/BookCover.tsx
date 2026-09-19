import React from 'react';
import { BookOpen, Play, Sparkles, ArrowLeft } from 'lucide-react';

interface BookCoverProps {
  onOpenBook: () => void;
  onPlayGame: () => void;
  onBackToLanding?: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({ onOpenBook, onPlayGame, onBackToLanding }) => {
  return (
    <section id="hero" className="relative my-8 lg:my-10 max-w-4xl mx-auto px-2 sm:px-4">
      {/* Outer 3D Hardcover Book Shell with Fore-edge Page Thickness */}
      <div className="relative rounded-2xl bg-[#0b101c] border border-slate-700/60 shadow-[8px_8px_0px_#141c2e,14px_14px_0px_#0d1422,22px_22px_45px_rgba(0,0,0,0.9)] select-none overflow-hidden book-cover-fixed">

        {/* ─── LEFT LEATHER BOOK SPINE HINGE ─── */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#070b14] via-[#111827] to-[#0b101c] border-r border-amber-500/20 shadow-[inset_-3px_0_6px_rgba(0,0,0,0.8)] z-20 flex flex-col items-center justify-between py-8">
          {/* Embossed spine ribs */}
          <div className="w-5 sm:w-7 h-1 bg-amber-500/30 rounded-full shadow-sm" />
          <div className="text-[9px] font-mono tracking-widest text-amber-400/40 uppercase rotate-90 whitespace-nowrap">
            LOGBOOK · VOL. 03
          </div>
          <div className="w-5 sm:w-7 h-1 bg-amber-500/30 rounded-full shadow-sm" />
        </div>

        {/* ─── BRASS CORNER GUARDS ─── */}
        <div className="book-corner-tl" />
        <div className="book-corner-tr" />
        <div className="book-corner-bl" />
        <div className="book-corner-br" />

        {/* ─── FRONT COVER FACE (Offset from left spine) ─── */}
        <div className="pl-10 sm:pl-16 pr-6 sm:pr-10 py-4 sm:py-5 relative z-10 text-center flex flex-col justify-between h-full min-h-0">

          {/* Stamped Top Archive Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 border-b border-slate-800/80 pb-2 text-xs font-mono shrink-0">
            <div className="flex items-center gap-2 text-left">
              <span className="ink-stamp ink-stamp-amber text-[9.5px]">
                TINKERHUB SNMIMT · ARCHIVE
              </span>
              <span className="text-slate-400 text-[10.5px] hidden sm:inline">
                USELESS PROJECTS 3.0 // FIELD NOTES
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="ink-stamp ink-stamp-green text-[9.5px]">
                SUBMITTED · 10:45 AM
              </span>
            </div>
          </div>

          {/* Inner Gold Foil Debossed Frame */}
          <div className="relative border border-amber-500/25 rounded-xl p-4 sm:p-6 my-1 bg-gradient-to-b from-[#0e1526]/80 via-[#0a0f1d]/90 to-[#070b14]/95 shadow-inner flex flex-col justify-between flex-1">

            {/* Category Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[11px] font-mono font-bold tracking-widest uppercase mb-2 mx-auto">
              <Sparkles className="w-3 h-3" />
              <span>18-Hour Developer Dossier</span>
            </div>

            {/* Debossed Main Title */}
            <h1 className="text-4xl sm:text-6xl font-sans font-black tracking-tight text-white leading-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] mb-2">
              DANGER<span className="text-pink-500">PINKY</span>
            </h1>

            {/* Subtitle / Core Contrast */}
            <p className="font-handwriting text-xl sm:text-2xl text-pink-300 transform -rotate-1 max-w-xl mx-auto leading-tight mb-2">
              &ldquo;I was supposed to be documenting everyone else.&rdquo;
            </p>

            {/* Narrative Premise */}
            <p className="text-xs sm:text-[13px] font-sans text-slate-300 max-w-xl mx-auto leading-relaxed mb-3">
              Instead, I accidentally spent 18 hours at TinkerHub Useless Projects 3.0 building a snake game that tracks your little finger through a webcam and devours files from your hard drive into the Windows Recycle Bin.
            </p>

            {/* ─── PHYSICAL MAKER DOSSIER PLAQUE ─── */}
            <div className="my-2 p-3 sm:p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 max-w-lg mx-auto text-left shadow-2xl relative w-full">
              <div className="masking-tape-strip -top-2.5 left-8" />
              <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
                <span>OFFICIAL MAKER SPECIFICATION</span>
                <span className="text-emerald-400 font-bold">11 → 12 SEPT 2026</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[9px]">BUILDER:</span>
                  <span className="text-white font-bold text-xs">Vishnu K R</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">EVENT ROLE:</span>
                  <span className="text-pink-400 font-bold text-xs">Outreach Lead</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">COLLEGE:</span>
                  <span className="text-slate-300 text-xs truncate block">SNMIMT</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">ARTIFACT:</span>
                  <span className="text-emerald-400 font-bold text-xs block">DangerPinky v1.0</span>
                </div>
              </div>
            </div>

            {/* ─── PRIMARY TACTILE BOOK ACTION BUTTONS ─── */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenBook}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-mono font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_8px_20px_rgba(255,32,127,0.4)] hover:shadow-[0_12px_25px_rgba(255,32,127,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>OPEN LOGBOOK (READ SPREAD 1)</span>
              </button>

              <button
                onClick={onPlayGame}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-mono font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>PLAY GAME ARENA</span>
              </button>

              {onBackToLanding && (
                <button
                  onClick={onBackToLanding}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-mono text-xs flex items-center gap-1.5 border border-slate-800/80 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Game Hub</span>
                </button>
              )}
            </div>

          </div>

          {/* Stamped Colophon Footnote */}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-500 shrink-0">
            <span>VOLUME I // 16 LOG ENTRIES</span>
            <span>PROLOGUE + 16 CHAPTERS + EPILOGUE</span>
            <span>116 PASSING UNIT TESTS</span>
          </div>

        </div>
      </div>
    </section>
  );
};
