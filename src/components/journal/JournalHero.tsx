import React, { useState } from 'react';
import {
  Play,
  ArrowDown,
  Github,
  ArrowLeft,
  FolderArchive,
  X,
} from 'lucide-react';
import { HERO_DATA, PERSISTENT_LINKS } from '../../data/journalChapters';

interface JournalHeroProps {
  onStartDemo?: () => void;
  onStartWithCamera?: () => void;
  onBackToLanding?: () => void;
  onOpenBook?: () => void;
}

export const JournalHero: React.FC<JournalHeroProps> = ({
  onStartDemo,
  onStartWithCamera,
  onBackToLanding,
  onOpenBook
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoModalOpen) setIsVideoModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen]);

  const handleScrollToChapter = (id: string) => {
    if (onOpenBook) {
      onOpenBook();
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id={HERO_DATA.id}
      className="relative pt-6 pb-16 px-0 overflow-hidden"
    >
      {/* Subtle ambient light pool */}
      <div className="absolute top-12 left-[40%] -translate-x-1/2 w-[650px] h-[350px] bg-pink-500/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

        {/* ─── HARDCOVER BOOK CASING WITH BRASS CORNERS ─── */}
        <div className="book-casing relative">
          <div className="book-corner-tl" />
          <div className="book-corner-tr" />
          <div className="book-corner-bl" />
          <div className="book-corner-br" />

          {/* ─── THE PHYSICAL DOSSIER SHEET ─── */}
          <div className="dossier-sheet rounded-xl p-6 sm:p-10 md:p-12 relative overflow-hidden border border-slate-700/50 shadow-2xl bg-[#090e1a]/95">

          {/* Masking tape on top center */}
          <div className="masking-tape-strip top-0 left-1/2 -translate-x-1/2" />

          {/* Top Stamp Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-8 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <FolderArchive className="w-4 h-4 text-pink-400" />
              <span className="font-bold tracking-wider text-slate-300">FIELD NOTES // OVERNIGHT MAKEATHON</span>
              <span className="text-slate-600">·</span>
              <span className="text-pink-400">LOG #03</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="ink-stamp ink-stamp-green">
                SUBMITTED · 10:45 AM
              </span>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left 7 Cols: Personal Identity + Headline + Lead Story */}
            <div className="lg:col-span-7 space-y-6">

              {/* Personal Identity Block: PERSON → NIGHT → PROJECT */}
              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 font-mono text-xs text-slate-300 relative">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-2">
                  <div>
                    <span className="text-lg font-bold text-white tracking-wide block">VISHNU K R</span>
                    <span className="text-[11px] text-pink-400 font-medium">SNMIMT · TINKERHUB OUTREACH LEAD</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <div>11 → 12 SEP 2026</div>
                    <div className="text-amber-400/90 font-semibold">18-HOUR SPRINT</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>OUTREACH LEAD → ACCIDENTAL BUILDER</span>
                  <span className="font-handwriting text-pink-300 text-sm transform -rotate-1">
                    ↳ I wasn&apos;t planning to build anything
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight text-white leading-tight mb-3">
                  I Was Supposed to Be Documenting Everyone Else.
                </h1>
                <p className="text-lg sm:text-xl text-pink-300/95 font-sans font-medium italic leading-snug">
                  &ldquo;Instead, I accidentally spent 18 hours building a snake that eats files.&rdquo;
                </p>
                <div className="mt-2 text-xs font-mono text-slate-400 flex items-center gap-2">
                  <span>PROJECT ARTIFACT:</span>
                  <span className="text-pink-400 font-bold">DangerPinky</span>
                  <span className="text-slate-600">·</span>
                  <span>TINKERHUB USELESS PROJECTS 3.0</span>
                </div>
              </div>

              {/* Lead narrative */}
              <div className="text-sm sm:text-[15px] leading-relaxed text-slate-300 border-l-2 border-pink-500/40 pl-4 py-1">
                <p>{HERO_DATA.leadText}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => handleScrollToChapter(HERO_DATA.ctas.startJourney.targetId)}
                  className="px-5 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <span>READ MY NIGHT ↓</span>
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-4 py-2.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 hover:text-white font-mono text-xs font-bold border border-pink-500/40 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                  title="Watch the official live demo video recorded during the hackathon"
                >
                  <Play className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                  <span>WATCH VIDEO DEMO</span>
                </button>

                <button
                  onClick={() => {
                    if (onStartDemo) {
                      onStartDemo();
                    } else {
                      handleScrollToChapter(HERO_DATA.ctas.playGame.targetId);
                    }
                  }}
                  className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-pink-300 hover:text-white font-mono text-xs font-bold border border-pink-500/30 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-pink-400" />
                  <span>PLAY DANGERPINKY</span>
                </button>

                <a
                  href={PERSISTENT_LINKS.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-mono text-xs border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>REPO ↗</span>
                </a>

                {onStartWithCamera && (
                  <button
                    onClick={onStartWithCamera}
                    className="px-3 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-pink-300 hover:text-white font-mono text-xs border border-pink-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>CAMERA ↗</span>
                  </button>
                )}

                {onBackToLanding && (
                  <button
                    onClick={onBackToLanding}
                    className="px-3.5 py-2.5 rounded-lg text-slate-500 hover:text-slate-300 font-mono text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right 5 Cols: Single Physical Artifact + Tilted Note */}
            <div className="lg:col-span-5 space-y-6 flex flex-col items-center sm:items-end">

              {/* Tilted Yellow Sticky Note */}
              <div className="sticky-note sticky-note-yellow w-full max-w-sm sm:self-end">
                <div className="sticky-note-tape" />
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1 font-sans">
                  // 02:14 AM scratchpad
                </div>
                <p className="text-xl text-slate-900 leading-snug font-bold">
                  &ldquo;I wasn&apos;t even supposed to be building anything. I was supposed to be running around telling everyone else to document their projects.&rdquo;
                </p>
                <div className="text-right text-xs font-handwriting text-slate-700 mt-2">
                  — Vishnu, Outreach Lead
                </div>
              </div>

              {/* Photographed Screen Artifact with Play Video Action */}
              <div
                onClick={() => setIsVideoModalOpen(true)}
                className="group relative w-full max-w-sm rounded-lg bg-white p-2.5 pb-5 shadow-2xl border border-slate-200/20 transform rotate-1 hover:rotate-0 transition-transform duration-300 cursor-pointer"
                style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)' }}
                title="Click to play live demonstration video (Google Drive)"
              >
                {/* Masking tape on top right */}
                <div className="absolute -top-3 right-6 w-12 h-6 masking-tape-strip" />

                <div className="relative aspect-[16/10] bg-slate-950 rounded overflow-hidden mb-2">
                  <img
                    src="./screenshots/gameplay.png"
                    alt="DangerPinky screen in action"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Play Video Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/15 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-pink-600/90 group-hover:bg-pink-500 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 font-mono text-[9px] text-pink-300 border border-pink-500/40">
                    LIVE WEBCAM HUD
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 font-mono text-[9px] text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>WATCH DEMO</span>
                  </div>
                </div>
                <div className="font-handwriting text-slate-800 text-sm leading-tight text-center">
                  Artifact #01: Devouring real files via Landmark 20 · Click to play video
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Embedded Google Drive Video Player Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-slate-950 border border-pink-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/90 text-white font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                <span className="font-bold">DangerPinky — Official Hackathon Demo Video</span>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close video (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src="https://drive.google.com/file/d/1aIiCRxT6f9T7WfaB7Iu2qHBtmiiLmvXs/preview"
                title="DangerPinky Live Demo Video"
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  </section>
);
};
