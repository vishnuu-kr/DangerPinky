import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Maximize2,
  AlertTriangle,
  GitCommit,
  Layers,
  Code2,
  Clock,
  Zap,
  Coffee,
  Share2,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  HERO_DATA,
  PROLOGUE_DATA,
  CHAPTERS,
  TIMELINE_MILESTONES,
  TECH_STACK,
  EVOLUTION_DATA,
  SCREENSHOTS_DATA,
  getAllSectionIds,
  ScreenshotGalleryItem
} from '../data/journalChapters';
import { sound } from '../game/audio';

import { ChapterNav } from './journal/ChapterNav';
import { BookCover } from './journal/BookCover';

import { LightboxModal } from './journal/LightboxModal';
import { ComparisonSlider } from './journal/ComparisonSlider';
import { ScrapbookPlaceholder } from './journal/ScrapbookPlaceholder';
import { PlayEmbedSection } from './journal/PlayEmbedSection';
import { FinalReflection } from './journal/FinalReflection';
import { BookSpread } from './journal/BookSpread';
import { RibbonBookmark } from './journal/RibbonBookmark';

interface JournalScreenProps {
  onStartDemo: () => void;
  onStartWithCamera: () => void;
  onSelectRealFiles: () => void;
  onBackToLanding: () => void;
}

// ─── Reusable Field Log Chapter Header ─────────────────────────────────────
interface ChapterHeaderProps {
  chapter: typeof CHAPTERS[number];
  accentClass?: string;
  marginNote?: string;
}

const ChapterHeader: React.FC<ChapterHeaderProps> = ({ chapter, accentClass = 'text-pink-400', marginNote }) => (
  <div className="relative mb-3 pt-1">
    {/* Monospace Log Stamp */}
    <div className="flex flex-wrap items-center gap-2 mb-1.5">
      <span className="ink-stamp ink-stamp-amber text-[9.5px] py-0.5 px-2">
        FIELD NOTE #{chapter.number} // {chapter.tag}
      </span>
      {chapter.timestamp && (
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
          <Clock className="w-3 h-3 text-pink-400" />
          <span>{chapter.timestamp}</span>
        </span>
      )}
    </div>

    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1.5">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-[24px] font-sans font-black tracking-tight text-white leading-snug mb-0.5">
          {chapter.title}
        </h2>
        <p className={`text-xs sm:text-[12.5px] font-sans italic ${accentClass} opacity-90`}>
          &ldquo;{chapter.subtitle}&rdquo;
        </p>
      </div>

      {marginNote && (
        <div className="margin-note text-pink-300 text-sm shrink-0 transform md:-rotate-2 max-w-xs mt-1 md:mt-0 font-handwriting">
          ↳ {marginNote}
        </div>
      )}
    </div>

    <div className="chapter-divider mt-2 mb-2 max-w-xs" />
  </div>
);

// ─── Editorial Prose Layout (Open Canvas, not boxed in duplicate cards) ───
interface EditorialProseProps {
  narratives: string[];
  pullquoteIndex?: number;
  highlightIndex?: number;
}

const EditorialProse: React.FC<EditorialProseProps> = ({
  narratives,
  pullquoteIndex,
  highlightIndex
}) => (
  <div className="reader-prose text-slate-200 text-xs sm:text-[12.5px] leading-relaxed max-w-3xl space-y-2 mb-3">
    {narratives.map((para, i) => {
      if (i === pullquoteIndex) {
        return (
          <div key={i} className="pullquote my-2 text-xs sm:text-[12.5px] border-l-2 border-pink-500 pl-3 py-0.5 italic">
            &ldquo;{para}&rdquo;
          </div>
        );
      }
      if (i === highlightIndex) {
        return (
          <p key={i} className="font-semibold text-pink-200 border-l-2 border-pink-500 pl-3 py-0.5 my-2 bg-pink-500/[0.04]">
            {para}
          </p>
        );
      }
      return <p key={i}>{para}</p>;
    })}
  </div>
);

// ─── Terminal Window Frame (Authentic Artifact) ───────────────────────────
const TerminalWindow: React.FC<{
  title?: string;
  command?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title = 'bash — vkr@snmimt-laptop', command, children, className = '' }) => (
  <div className={`terminal-window ${className}`}>
    <div className="terminal-header flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <div className="terminal-dot bg-rose-500/80" />
          <div className="terminal-dot bg-amber-500/80" />
          <div className="terminal-dot bg-emerald-500/80" />
        </div>
        <span className="text-[11px] font-mono text-slate-400 font-semibold ml-2">{title}</span>
      </div>
    </div>
    <div className="p-4 sm:p-5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
      {command && (
        <div className="text-emerald-400 mb-2 font-bold flex items-center gap-2">
          <span className="text-slate-500">$</span>
          <span>{command}</span>
        </div>
      )}
      {children}
    </div>
  </div>
);

// ─── Main JournalScreen Component ──────────────────────────────────────────
export const JournalScreen: React.FC<JournalScreenProps> = ({
  onStartDemo,
  onStartWithCamera,
  onSelectRealFiles,
  onBackToLanding
}) => {
  const sectionIds = getAllSectionIds();
  const [activeSection, setActiveSection] = useState<string>(HERO_DATA.id);
  const [viewMode, setViewMode] = useState<'spread' | 'scroll'>('spread');
  const [paperTone, setPaperTone] = useState<'dark' | 'cream'>('dark');
  const [spreadIndex, setSpreadIndex] = useState<number>(0);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const flipTimerRef = useRef<number | null>(null);

  const [activeLightboxItem, setActiveLightboxItem] = useState<ScreenshotGalleryItem | null>(null);
  const [activeTechId, setActiveTechId] = useState<string>(TECH_STACK[0].id);
  const [activeVersion, setActiveVersion] = useState<string>(EVOLUTION_DATA[4].version);
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState<number>(0);
  const [activeBreakthroughIdx, setActiveBreakthroughIdx] = useState<number>(0);
  const [activeBugIdx, setActiveBugIdx] = useState<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const triggerPageFlip = (dir: 'next' | 'prev') => {
    if (flipTimerRef.current) window.clearTimeout(flipTimerRef.current);
    setFlipDirection(dir);
    setIsFlipping(true);
    sound.playPageTurn();
    flipTimerRef.current = window.setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
    }, 500);
  };

  const handleSelectSection = (id: string) => {
    const idx = sectionIds.indexOf(id);
    if (idx !== -1) {
      if (viewMode === 'spread' && idx !== spreadIndex) {
        triggerPageFlip(idx > spreadIndex ? 'next' : 'prev');
      }
      setSpreadIndex(idx);
      setActiveSection(id);
    }
    if (viewMode === 'scroll') {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // In spread mode: Zero scroll jump! The desk and book stay perfectly still.
  };

  const goToNextSpread = () => {
    if (spreadIndex < sectionIds.length - 1) {
      const next = spreadIndex + 1;
      triggerPageFlip('next');
      setSpreadIndex(next);
      setActiveSection(sectionIds[next]);
      // Zero scroll jump! Site remains still and stable.
    }
  };

  const goToPrevSpread = () => {
    if (spreadIndex > 0) {
      const prev = spreadIndex - 1;
      triggerPageFlip('prev');
      setSpreadIndex(prev);
      setActiveSection(sectionIds[prev]);
      // Zero scroll jump! Site remains still and stable.
    }
  };

  const getSpreadClassName = (index: number) => {
    if (viewMode !== 'spread') return 'block';
    if (spreadIndex !== index) return 'hidden';
    const flipAnim = isFlipping
      ? flipDirection === 'next'
        ? 'book-spread-flip-next'
        : 'book-spread-flip-prev'
      : '';
    return `block ${flipAnim}`;
  };

  // Keyboard navigation for page turns in book spread mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (viewMode !== 'spread') return;
      if (e.key === 'ArrowRight') {
        goToNextSpread();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSpread();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, spreadIndex]);

  useEffect(() => {
    if (viewMode !== 'scroll') return;
    const callback: IntersectionObserverCallback = (entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length > 0) {
        intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const topSectionId = intersecting[0].target.id;
        if (topSectionId) {
          setActiveSection(topSectionId);
          const idx = sectionIds.indexOf(topSectionId);
          if (idx !== -1) setSpreadIndex(idx);
        }
      }
    };
    observerRef.current = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '-15% 0px -40% 0px',
      threshold: [0.1, 0.3, 0.6]
    });
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el && observerRef.current) observerRef.current.observe(el);
    });
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [viewMode]);

  const handleNextLightbox = () => {
    if (!activeLightboxItem) return;
    const currentIndex = SCREENSHOTS_DATA.findIndex((s) => s.id === activeLightboxItem.id);
    const nextIndex = (currentIndex + 1) % SCREENSHOTS_DATA.length;
    setActiveLightboxItem(SCREENSHOTS_DATA[nextIndex]);
  };

  const handlePrevLightbox = () => {
    if (!activeLightboxItem) return;
    const currentIndex = SCREENSHOTS_DATA.findIndex((s) => s.id === activeLightboxItem.id);
    const prevIndex = (currentIndex - 1 + SCREENSHOTS_DATA.length) % SCREENSHOTS_DATA.length;
    setActiveLightboxItem(SCREENSHOTS_DATA[prevIndex]);
  };

  const selectedTech = TECH_STACK.find((t) => t.id === activeTechId) || TECH_STACK[0];
  const selectedEvolution = EVOLUTION_DATA.find((e) => e.version === activeVersion) || EVOLUTION_DATA[4];

  return (
    <div className="min-h-screen bg-[#070b14] desk-grid text-slate-100 font-sans selection:bg-pink-500 selection:text-white pb-24 relative">

      <LightboxModal
        item={activeLightboxItem}
        onClose={() => setActiveLightboxItem(null)}
        onNext={handleNextLightbox}
        onPrev={handlePrevLightbox}
      />

      {/* Top Navigation with Book Controls */}
      <ChapterNav
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onPlayDemo={() => handleSelectSection('chapter-14')}
        onBackToLanding={onBackToLanding}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((prev) => (prev === 'spread' ? 'scroll' : 'spread'))}
        paperTone={paperTone}
        onTogglePaperTone={() => setPaperTone((prev) => (prev === 'dark' ? 'cream' : 'dark'))}
        onPrevPage={goToPrevSpread}
        onNextPage={goToNextSpread}
        currentPage={spreadIndex + 1}
        totalPages={sectionIds.length}
        canPrev={spreadIndex > 0}
        canNext={spreadIndex < sectionIds.length - 1}
      />

      {/* Hanging Silk Ribbon Bookmark */}
      <RibbonBookmark
        currentSectionId={activeSection}
        onSelectSection={handleSelectSection}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`relative ${viewMode === 'spread' ? 'book-stage' : ''}`}>

          {/* 3D Physical Page Turn Leaf Overlay */}
          {viewMode === 'spread' && isFlipping && flipDirection && (
            <div
              className={`hidden lg:block ${
                flipDirection === 'next' ? 'page-flip-leaf-next' : 'page-flip-leaf-prev'
              } ${
                paperTone === 'cream'
                  ? flipDirection === 'next'
                    ? 'paper-cream-leaf-next'
                    : 'paper-cream-leaf-prev'
                  : ''
              }`}
            />
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              HERO — SPREAD 0: THE MAKEATHON DOSSIER HARDCOVER
             ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(0)}>
          <BookCover
            onOpenBook={() => handleSelectSection('prologue')}
            onPlayGame={() => handleSelectSection('chapter-14')}
            onBackToLanding={onBackToLanding}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            PROLOGUE (00) — "I WASN'T EVEN SUPPOSED TO BE THINKING ABOUT THIS"
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(1)}>
          <BookSpread
            id="prologue"
            viewMode={viewMode}
            leftPageNumber={1}
            rightPageNumber={2}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="00. PROLOGUE // THE START"
            paperTone={paperTone}
            leftContent={
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="ink-stamp ink-stamp-red">00 // PROLOGUE</span>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    // THE OPENING SITUATION · 05:00 PM
                  </span>
                </div>

                <div className="flex flex-col gap-1 mb-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-white leading-tight mb-1">
                      {PROLOGUE_DATA.title}
                    </h2>
                    <p className="text-sm font-sans italic text-pink-300/90">
                      &ldquo;{PROLOGUE_DATA.subtitle}&rdquo;
                    </p>
                  </div>
                  <div className="margin-note text-pink-300 text-base transform -rotate-1 shrink-0 font-handwriting">
                    ↳ my actual job: document everyone else
                  </div>
                </div>
                <div className="chapter-divider max-w-md mb-3" />

                <div className="book-drop-cap">
                  <EditorialProse narratives={PROLOGUE_DATA.narrative} pullquoteIndex={2} />
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Outreach Clipboard Card */}
                <div className="relative p-4 rounded-lg bg-slate-950/80 border border-slate-800 shadow-xl">
                  <div className="masking-tape-strip -top-3 left-10" />
                  <div className="flex items-center gap-2 text-xs font-mono text-pink-400 font-bold uppercase tracking-wider mb-2">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{PROLOGUE_DATA.outreachRole.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mb-2">
                    My official role while other teams were starting to code:
                  </p>
                  <ul className="space-y-1 text-xs font-mono text-slate-300">
                    {PROLOGUE_DATA.outreachRole.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-pink-400 font-bold">↳</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* NoseTrack Index Card */}
                <div className="relative p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/30">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="ink-stamp ink-stamp-amber text-[9px] py-0.5 px-2">UP 2.0 WINNER</span>
                    <a
                      href={PROLOGUE_DATA.previousWin.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                    >
                      GitHub ↗
                    </a>
                  </div>
                  <h4 className="font-sans font-bold text-sm text-white mb-0.5">
                    {PROLOGUE_DATA.previousWin.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {PROLOGUE_DATA.previousWin.note}
                  </p>
                </div>

                <ScrapbookPlaceholder
                  tag={PROLOGUE_DATA.scrapbookTags[0]}
                  caption="Teams setting up around 5 PM — meanwhile I had zero project"
                  rotate="cw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 01 — THE IDEA I DIDN'T BUILD
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(2)}>
          <BookSpread
            id="chapter-01"
            viewMode={viewMode}
            leftPageNumber={3}
            rightPageNumber={4}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 01 // THE IDEA I DIDN'T BUILD"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[0]}
                  accentClass="text-rose-400"
                  marginNote="better to have nothing than step on someone's project"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[0].narrative} highlightIndex={2} />
                </div>
              </>
            }
            rightContent={
              <div className="space-y-4">
                {/* Tilted Sticky Note */}
                <div className="sticky-note sticky-note-amber w-full max-w-sm">
                  <div className="sticky-note-tape" />
                  <div className="text-[10px] font-mono text-amber-800 uppercase tracking-wider mb-1 font-sans">
                    // First Hour Decision
                  </div>
                  <p className="text-base text-slate-900 font-bold leading-snug">
                    &ldquo;I could have kept going. But it would have made it awkward for them. So I just dropped it.&rdquo;
                  </p>
                </div>

                <ScrapbookPlaceholder
                  tag={CHAPTERS[0].scrapbookTags?.[0] || '[ADD PHOTO: Teams setting up]'}
                  caption="Teams opening laptops, ideas flying. My repo was empty."
                  rotate="ccw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 02 — I HAD ABSOLUTELY NOTHING
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(3)}>
          <BookSpread
            id="chapter-02"
            viewMode={viewMode}
            leftPageNumber={5}
            rightPageNumber={6}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 02 // I HAD ABSOLUTELY NOTHING"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[1]}
                  accentClass="text-amber-400"
                  marginNote="clock ticking: 6 PM... 8 PM... still nothing"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[1].narrative} pullquoteIndex={1} />
                </div>

                {/* Real contrast visual: The Room vs Vishnu's Terminal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="ink-stamp ink-stamp-green text-[9px]">THE ROOM</span>
                      <span className="text-xs font-mono text-slate-400">100% Energy</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Keyboards clicking everywhere, whiteboards covered with weird flowchart ideas, teams laughing. Everyone has a mission.
                    </p>
                  </div>

                  {/* Empty Terminal window */}
                  <TerminalWindow title="bash — ~/projects/up3" command="git status">
                    <div className="text-slate-500 italic">
                      fatal: not a git repository<br />
                      # Zero lines of code. Zero ideas. Just Instagram Stories.
                    </div>
                  </TerminalWindow>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-4">
                {/* Raw Event Activity Log */}
                <div className="p-4 rounded-lg bg-slate-950/90 border border-slate-800 font-mono text-xs text-slate-300 shadow-lg">
                  <div className="text-[10px] text-pink-400 font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
                    <span>OUTREACH LOG // TIMELINE</span>
                    <span className="text-slate-500">18:00 → 00:15</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-400">
                    <div><span className="text-amber-400">18:07</span> — Story: &ldquo;UP 3.0 starts!&rdquo;</div>
                    <div><span className="text-amber-400">18:42</span> — Photo: Team #04 setup</div>
                    <div><span className="text-amber-400">19:13</span> — &ldquo;Bro shoot our board!&rdquo;</div>
                    <div className="text-rose-400 font-semibold"><span className="text-amber-400">20:06</span> — Still no project</div>
                    <div className="text-rose-400 font-semibold"><span className="text-amber-400">21:17</span> — Still no project</div>
                    <div><span className="text-amber-400">23:58</span> — Coffee run with friends</div>
                    <div className="text-emerald-400 font-bold"><span className="text-amber-400">00:14</span> — Pinky Snake is born</div>
                  </div>
                </div>

                <ScrapbookPlaceholder
                  tag={CHAPTERS[1].scrapbookTags?.[0] || '[ADD PHOTO: Event floor busy]'}
                  caption="Running around with phone documenting everyone else"
                  rotate="cw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 03 — THE COFFEE BREAK (THE INCITING INCIDENT)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(4)}>
          <BookSpread
            id="chapter-03"
            viewMode={viewMode}
            leftPageNumber={7}
            rightPageNumber={8}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 03 // THE COFFEE BREAK"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[2]}
                  accentClass="text-amber-300"
                  marginNote="midnight coffee: where stupid ideas become brilliant"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[2].narrative} highlightIndex={2} />
                </div>

                {/* Midnight Coffee Scratchpad Card */}
                <div className="relative p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-amber-500/30 overflow-hidden shadow-xl">
                  {/* Subtle Coffee Stain Ring Watermark */}
                  <div
                    className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full border-4 border-amber-900/25 pointer-events-none"
                    style={{ filter: 'blur(1px)' }}
                  />
                  <div
                    className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full border-2 border-amber-800/15 pointer-events-none"
                  />

                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
                    <Coffee className="w-4 h-4" />
                    <span>12:15 AM · Hostel Tea Stall Conversation</span>
                  </div>

                  <p className="font-handwriting text-xl sm:text-2xl text-white leading-relaxed mb-2">
                    &ldquo;What if I made a snake game that followed my pinky?&rdquo;
                  </p>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span>FIRST DRAFT NAME:</span>
                    <span className="line-through text-slate-500">Pinky Snake</span>
                    <span className="text-pink-400 font-bold">↳ DangerPinky</span>
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-4">
                <ScrapbookPlaceholder
                  tag="[ADD PHOTO: Late night coffee]"
                  caption="Tired conversations and hot black tea at midnight"
                  rotate="ccw"
                />
                <ScrapbookPlaceholder
                  tag="[ADD SKETCH: First napkin sketch]"
                  caption="First scribble: Pinky Snake concept"
                  rotate="cw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 04 — PINKY SNAKE ("LOOK HOW BAD THIS WAS")
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(5)}>
          <BookSpread
            id="chapter-04"
            viewMode={viewMode}
            leftPageNumber={9}
            rightPageNumber={10}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 04 // PINKY SNAKE (V0.1)"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[3]}
                  accentClass="text-emerald-400"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[3].narrative} pullquoteIndex={3} />
                </div>

                {/* v0.1 Code Snippet in Terminal */}
                {CHAPTERS[3].codeSnippets?.[0] && (
                  <TerminalWindow title="src/game/firstPrototype.ts (09:30 PM)" command="git diff HEAD~1">
                    <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
                      <code>{CHAPTERS[3].codeSnippets[0].code}</code>
                    </pre>
                  </TerminalWindow>
                )}
              </>
            }
            rightContent={
              <div className="space-y-4">
                {/* Before/After Frame: "LOOK HOW BAD THIS WAS" */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="ink-stamp ink-stamp-red text-[9.5px]">VISUAL AUDIT</span>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      // v0.1 MONOCHROME JITTER VS v1.0 CANDY ENGINE
                    </span>
                  </div>
                  <ComparisonSlider />
                </div>
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 05 — THIS IS TOO USELESS. EVEN FOR USELESS PROJECTS.
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(6)}>
          <BookSpread
            id="chapter-05"
            viewMode={viewMode}
            leftPageNumber={11}
            rightPageNumber={12}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 05 // THE TURNING POINT"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[4]}
                  accentClass="text-pink-400"
                  marginNote="the moment: what if the snake ate a FILE?"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[4].narrative} highlightIndex={6} />
                </div>

                {/* Formula Scratchpad on Desk */}
                <div className="p-3.5 rounded-lg bg-pink-500/[0.04] border border-pink-500/30 font-handwriting text-xl text-pink-300">
                  Pinky Control + Snake + Local File + Windows Recycle Bin = DangerPinky 🔥
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3.5">
                {/* Safety Architecture Callout */}
                <div className="p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/30 text-xs font-mono text-slate-300 shadow-xl">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>SAFETY PROTOCOL // SANDBOX</span>
                  </div>
                  <p className="text-slate-300 font-sans text-[11.5px] leading-relaxed mb-2">
                    Files are routed to the OS Recycle Bin via <code className="text-pink-300">shell.trashItem</code> — never permanently deleted and 100% recoverable.
                  </p>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[10.5px] text-slate-400 space-y-0.5">
                    <div>✓ System files strictly blacklisted</div>
                    <div>✓ ntuser.dat &amp; desktop.ini filtered</div>
                  </div>
                </div>

                {/* Interactive 3-Step Breakthrough Switcher */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="ink-stamp ink-stamp-amber text-[9px]">
                      BREAKTHROUGH {activeBreakthroughIdx + 1} OF {CHAPTERS[4].breakthroughs?.length || 3}
                    </span>
                    <div className="flex gap-1">
                      {CHAPTERS[4].breakthroughs?.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveBreakthroughIdx(idx)}
                          className={`px-2 py-0.5 rounded text-[9.5px] font-mono cursor-pointer transition-all ${
                            activeBreakthroughIdx === idx
                              ? 'bg-pink-600 text-white font-bold ring-1 ring-pink-400'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          0{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const bt = CHAPTERS[4].breakthroughs?.[activeBreakthroughIdx];
                    if (!bt) return null;
                    return (
                      <div className="space-y-1.5 font-sans card-switcher-content" key={activeBreakthroughIdx}>
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <h4 className="font-bold text-xs sm:text-sm text-white">{bt.title}</h4>
                          {bt.formula && (
                            <span className="font-mono text-[10px] text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/30">
                              {bt.formula}
                            </span>
                          )}
                        </div>
                        <p className="text-[11.5px] text-slate-300 leading-relaxed">{bt.description}</p>
                        <div className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                          <Zap className="w-3 h-3" />
                          <span>IMPACT: {bt.impact}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <ScrapbookPlaceholder
                  tag="[ADD SKETCH: The moment — napkin diagram of Snake + File + Recycle Bin = DangerPinky]"
                  caption="The napkin equation that changed everything"
                  rotate="cw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 06 — I STARTED BUILDING. THEN I REMEMBERED I HAD A JOB.
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(7)}>
          <BookSpread
            id="chapter-06"
            viewMode={viewMode}
            leftPageNumber={13}
            rightPageNumber={14}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 06 // DUAL LOGBOOK"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[5]}
                  accentClass="text-cyan-400"
                  marginNote="this was probably a bad idea"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[5].narrative} pullquoteIndex={3} />
                </div>

                <div className="p-3 rounded-lg bg-pink-500/[0.06] border border-pink-500/30 text-pink-300 font-handwriting text-lg transform -rotate-1 text-center">
                  &ldquo;Telling everyone to document... while I forgot my own screen.&rdquo;
                </div>
              </>
            }
            rightContent={
              <div className="space-y-4">
                {/* DUAL LOG: CODING ↔ OUTREACH */}
                <div className="space-y-4">
                  <TerminalWindow title="vim — src/game/pinkyDetector.ts" command="git log -n 3 --oneline">
                    <div className="space-y-1 text-slate-300">
                      <div><span className="text-amber-400">c48f21a</span> fix: normalize landmark 20 by hand scale</div>
                      <div><span className="text-amber-400">9b1a03e</span> feat: connect electron shell.trashItem IPC</div>
                      <div><span className="text-amber-400">3e18a99</span> wip: stop snake 180 suicide turn</div>
                      <div className="text-slate-500 pt-2 font-handwriting text-base text-pink-400">
                        // coding in between social media updates
                      </div>
                    </div>
                  </TerminalWindow>

                  <div className="p-4 rounded-lg bg-slate-950/80 border border-amber-500/30 font-mono text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-amber-400">
                        <span className="font-bold uppercase tracking-wider">TinkerHub Instagram Log</span>
                        <span>@tinkerhub_snmimt</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300 text-[11px]">
                        <li>08:30 PM — Story: &ldquo;UP 3.0 in full swing! 🔥&rdquo;</li>
                        <li>11:00 PM — Story: &ldquo;Snack break + recharge ☕&rdquo;</li>
                        <li>01:45 AM — Reel: &ldquo;The 2 AM coding trenches&rdquo;</li>
                        <li>03:30 AM — Photos: Hall sleeping vs building</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <ScrapbookPlaceholder
                  tag={CHAPTERS[5].scrapbookTags?.[0] || '[ADD PHOTO: Event atmosphere]'}
                  caption="Outreach phone in one hand, laptop in the other"
                  rotate="cw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 07 — THE FIRST TIME IT ACTUALLY MOVED
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(8)}>
          <BookSpread
            id="chapter-07"
            viewMode={viewMode}
            leftPageNumber={15}
            rightPageNumber={16}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 07 // FIRST VECTOR MOTION"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[6]}
                  accentClass="text-emerald-400"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[6].narrative} pullquoteIndex={0} />
                </div>

                {CHAPTERS[6].codeSnippets?.[0] && (
                  <TerminalWindow title="src/game/pinkyDetector.ts — Relative Vector Math">
                    <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
                      <code>{CHAPTERS[6].codeSnippets[0].code}</code>
                    </pre>
                  </TerminalWindow>
                )}
              </>
            }
            rightContent={
              <div className="space-y-4">
                {/* Hardware & Engine Architecture Specifications Slip */}
                <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs shadow-xl">
                  <div className="text-[10px] text-pink-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Hardware &amp; Engine Architecture // Evidence Slip</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block">The Hardware</span>
                      <span className="text-pink-300 font-bold block mt-0.5">MediaPipe GPU</span>
                      <span className="text-[10px] text-slate-400">&lt;20ms WASM delegate</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block">The Camera</span>
                      <span className="text-pink-300 font-bold block mt-0.5">Landmark 20</span>
                      <span className="text-[10px] text-slate-400">Relative to Knuckle 17</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block">Game Engine</span>
                      <span className="text-emerald-300 font-bold block mt-0.5">HTML5 Canvas</span>
                      <span className="text-[10px] text-slate-400">Deterministic 60 FPS</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block">The Recycle Hook</span>
                      <span className="text-amber-300 font-bold block mt-0.5">shell.trashItem</span>
                      <span className="text-[10px] text-slate-400">OS Recycle Bin IPC</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block">The Sound</span>
                      <span className="text-cyan-300 font-bold block mt-0.5">Web Audio API</span>
                      <span className="text-[10px] text-slate-400">0 files · Real math</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block">Test Coverage</span>
                      <span className="text-emerald-300 font-bold block mt-0.5">39 / 39 Pass</span>
                      <span className="text-[10px] text-slate-400">Vitest engine suites</span>
                    </div>
                  </div>
                </div>

                <ScrapbookPlaceholder
                  tag={CHAPTERS[6].scrapbookTag || '[ADD SCREENSHOT: First working camera HUD]'}
                  caption="Landmark 20 tracking points visible in live corner HUD"
                  rotate="ccw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 08 — AND THEN IT STARTED BREAKING (BUG DISPATCHES)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(9)}>
          <BookSpread
            id="chapter-08"
            viewMode={viewMode}
            leftPageNumber={17}
            rightPageNumber={18}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 08 // BUG DISPATCHES"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[7]}
                  accentClass="text-rose-400"
                  marginNote="my pinky was lying to me"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[7].narrative} />
                </div>

                <div className="p-3.5 rounded-lg bg-rose-500/[0.05] border border-rose-500/30 text-rose-300 font-handwriting text-xl text-center transform -rotate-1 mt-3">
                  &ldquo;A bug at 03:00 AM isn&apos;t just an error. It&apos;s an existential question.&rdquo;
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3.5">
                {/* Interactive Bug Dispatch Switcher */}
                <div className="rounded-lg bg-slate-950/90 border border-rose-500/30 overflow-hidden shadow-xl">
                  <div className="px-3.5 py-2 bg-rose-950/30 border-b border-rose-500/20 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span className="font-mono font-bold text-xs text-rose-300 uppercase tracking-wider">
                        BUG DISPATCH 0{activeBugIdx + 1}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {CHAPTERS[7].failureStories?.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveBugIdx(idx)}
                          className={`px-2 py-0.5 rounded text-[9.5px] font-mono cursor-pointer transition-all ${
                            activeBugIdx === idx
                              ? 'bg-rose-600 text-white font-bold ring-1 ring-rose-400'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          #0{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const failure = CHAPTERS[7].failureStories?.[activeBugIdx];
                    if (!failure) return null;
                    return (
                      <div className="p-3 space-y-2 text-xs font-sans card-switcher-content" key={activeBugIdx}>
                        <h4 className="font-bold text-xs sm:text-sm text-white">{failure.title}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                            <span className="text-[9px] text-slate-500 uppercase block mb-0.5">What I Thought:</span>
                            <p className="text-slate-300 italic text-[11px]">&ldquo;{failure.thought}&rdquo;</p>
                          </div>
                          <div className="p-2 rounded bg-rose-950/20 border border-rose-900/40">
                            <span className="text-[9px] text-rose-400 uppercase font-bold block mb-0.5">What Actually Happened:</span>
                            <p className="text-slate-200 text-[11px]">{failure.tried}</p>
                          </div>
                        </div>

                        <div className="p-2 rounded bg-amber-500/[0.04] border border-amber-500/20 text-slate-300 font-mono text-[11px]">
                          <span className="text-[9px] text-amber-400 font-bold uppercase block mb-0.5">Root Cause:</span>
                          <p>{failure.cause}</p>
                        </div>

                        <div className="p-2 rounded bg-emerald-500/[0.05] border border-emerald-500/30 font-mono text-emerald-300 text-[11px]">
                          <span className="text-[9px] text-emerald-400 font-bold uppercase block mb-0.5">How I Fixed It:</span>
                          <p className="font-semibold">{failure.fix}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <ScrapbookPlaceholder
                  tag={CHAPTERS[7].scrapbookTags?.[0] || '[ADD BUG SCREENSHOT: The 180° suicide turn]'}
                  caption="The 180° suicide turn: snake colliding with segment 1"
                  rotate="ccw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 09 — THE PROJECT FINALLY BECAME STUPID ENOUGH
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(10)}>
          <BookSpread
            id="chapter-09"
            viewMode={viewMode}
            leftPageNumber={19}
            rightPageNumber={20}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 09 // CANDY PIPELINE"
            paperTone={paperTone}
            leftContent={
              <>
                {/* ─── VISHNU MOMENT (02:17 AM) — PURE TYPOGRAPHY ─── */}
                <div className="mb-6 text-center py-4 border-b border-slate-800/80">
                  <div className="text-[10px] font-mono text-pink-400 uppercase tracking-widest mb-1.5 font-bold">
                    02:17 AM // HALL FLOOR WHISPER
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-sans font-black text-white leading-tight tracking-tight mb-2">
                    I Think This Is Actually Stupid.
                  </h3>
                  <p className="font-handwriting text-xl sm:text-2xl text-pink-300 transform -rotate-1">
                    &ldquo;And that&apos;s exactly why I kept building it.&rdquo;
                  </p>
                </div>

                <ChapterHeader
                  chapter={CHAPTERS[8]}
                  accentClass="text-pink-400"
                  marginNote="04:30 AM: all the ridiculous pieces finally clicked"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[8].narrative} pullquoteIndex={3} />
                </div>

                {/* Candy Fruit Gallery */}
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    CANVAS SPRITE ARTIFACTS // 0.00 KB EXTERNAL ASSETS
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { name: 'Apple', emoji: '🍎', desc: 'Dual-stop radial gloss' },
                      { name: 'Orange', emoji: '🍊', desc: 'Citrus pores, specular' },
                      { name: 'Grape', emoji: '🍇', desc: 'Clustered radials + leaf' },
                      { name: 'Strawberry', emoji: '🍓', desc: 'Quadratic curves, seeds' },
                      { name: 'Watermelon', emoji: '🍉', desc: 'Rind arc, magenta flesh' },
                      { name: 'Cherry', emoji: '🍒', desc: 'Paired globes, curved stems' },
                    ].map((fruit, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg p-2.5 text-center bg-slate-950/80 border border-slate-800"
                      >
                        <div className="text-2xl mb-1">{fruit.emoji}</div>
                        <div className="font-sans font-bold text-xs text-white">{fruit.name}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5 font-mono">{fruit.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-6">
                {/* Tech Stack Workbench */}
                <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950/90 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-800 gap-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span className="font-sans font-bold text-sm text-white">Workbench Tools</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {TECH_STACK.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTechId(item.id)}
                          className={`px-2 py-0.5 rounded font-mono text-xs transition-colors cursor-pointer ${
                            activeTechId === item.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                        {selectedTech.category}
                      </span>
                      <h3 className="text-base font-sans font-bold text-white mt-0.5">{selectedTech.name}</h3>
                      <p className="text-xs font-mono text-slate-400">{selectedTech.role}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                      <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                        <span className="font-mono text-emerald-400 text-[10px] uppercase font-bold block mb-1">Why Chosen</span>
                        <p className="text-slate-300">{selectedTech.whyChosen}</p>
                      </div>
                      <div className="p-2.5 rounded bg-rose-950/20 border border-rose-900/30">
                        <span className="font-mono text-rose-400 text-[10px] uppercase font-bold block mb-1">Quirk or Trap</span>
                        <p className="text-slate-300">{selectedTech.quirkOrTrap}</p>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-slate-500 mb-1.5 flex items-center gap-1.5 uppercase">
                        <Code2 className="w-3.5 h-3.5 text-pink-400" />
                        <span>Representative Code</span>
                      </div>
                      <pre className="terminal-block text-xs overflow-x-auto max-h-48">
                        <code>{selectedTech.codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <ScrapbookPlaceholder
                  tag={CHAPTERS[8].scrapbookTag || '[ADD SCREENSHOT: First working Danger Mode]'}
                  caption="04:30 AM: Full loop working — Pinky -> Snake -> Recycle Bin"
                  rotate="cw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 10 — WHILE EVERYONE ELSE WAS BUILDING...
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(11)}>
          <BookSpread
            id="chapter-10"
            viewMode={viewMode}
            leftPageNumber={21}
            rightPageNumber={22}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 10 // SOLO BUILDER DOSSIER"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[9]}
                  accentClass="text-emerald-400"
                  marginNote="wearing every hat solo: CV, physics, audio, security, social media"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[9].narrative} highlightIndex={4} />
                </div>

                {/* Vishnu's Hackathon ID Card */}
                <div className="relative p-3 rounded-lg bg-slate-950/80 border border-emerald-500/30 shadow-xl">
                  <div className="masking-tape-strip -top-2.5 left-10" />
                  <div className="flex items-center justify-between gap-2 mb-2 border-b border-slate-800/80 pb-1">
                    <span className="ink-stamp ink-stamp-green text-[8.5px] py-0.5 px-1.5">SOLO BUILDER DOSSIER</span>
                    <span className="text-[9.5px] font-mono text-slate-500">UP 3.0 // 18H</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-xs mb-2">
                    <div>
                      <span className="text-slate-500 text-[9px] block">BUILDER:</span>
                      <span className="text-emerald-300 font-bold text-xs">Vishnu K R</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[9px] block">COLLEGE:</span>
                      <span className="text-slate-300 text-xs truncate block">SNMIMT</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[9px] block">ROLE:</span>
                      <span className="text-pink-400 font-bold text-xs">Outreach</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {[
                      'MediaPipe WASM',
                      'HTML5 Canvas 60FPS',
                      'Electron IPC',
                      'Procedural Audio',
                      'Vitest Suite'
                    ].map((hat, i) => (
                      <span key={i} className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[9.5px] font-mono text-slate-300">
                        {hat}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Interactive Version Matrix (v0.1 → v1.0) */}
                <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-sans font-bold text-xs sm:text-sm text-white">Night Timeline of Commits</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {EVOLUTION_DATA.map((row) => (
                        <button
                          key={row.version}
                          onClick={() => setActiveVersion(row.version)}
                          className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors cursor-pointer ${
                            activeVersion === row.version
                              ? 'bg-cyan-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {row.version}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-mono font-bold text-cyan-300">{selectedEvolution.version}</span>
                        <span className="text-amber-300 text-[11px]">{selectedEvolution.time}</span>
                      </div>
                      <p className="text-slate-300 mt-0.5 font-sans text-[11.5px]">{selectedEvolution.architecturalShift}</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-[9px] text-emerald-400 uppercase font-bold block mb-0.5">Changelog Notes</span>
                      <ul className="space-y-0.5 text-slate-300 text-[10.5px]">
                        {selectedEvolution.changelog.map((entry, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-cyan-400">↳</span>
                            <span className="line-clamp-1">{entry}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <ScrapbookPlaceholder
                  tag={CHAPTERS[9].scrapbookTag || '[ADD PHOTO: Vishnu K R at testing workstation]'}
                  caption="Vishnu at the laptop: live pinky HUD active"
                  rotate="cw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 11 — THE CHAOS AROUND 3 AM
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(12)}>
          <BookSpread
            id="chapter-11"
            viewMode={viewMode}
            leftPageNumber={23}
            rightPageNumber={24}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 11 // THE UNPLUGGED WEBCAM"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[10]}
                  accentClass="text-rose-400"
                  marginNote="brilliant debugging Vishnu 👍"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[10].narrative} pullquoteIndex={0} />
                </div>

                {/* Sticky Note: The Unplugged Webcam */}
                <div className="sticky-note sticky-note-pink max-w-md">
                  <div className="sticky-note-tape" />
                  <div className="text-[10px] font-mono text-rose-800 uppercase tracking-wider mb-1 font-sans">
                    // 03:45 AM Field Incident
                  </div>
                  <p className="text-base text-slate-900 font-bold leading-snug">
                    &ldquo;I spent fifteen minutes frantically waving my pinky like an airline ground controller directing a plane on the tarmac... before realizing my elbow had unplugged the webcam.&rdquo;
                  </p>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-6">
                <ScrapbookPlaceholder
                  tag={CHAPTERS[10].scrapbookTag || '[ADD PHOTO: Empty tea cups, tangled cables]'}
                  caption="Empty black tea cups, spicy banana chips, and the unplugged webcam"
                  rotate="ccw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 12 — THE FINAL PUSH (18-HOUR TIMELINE RAIL)
           ═══════════════════════════════════════════════════════════════════ */}
        {/* ═══════════════════════════════════════════════════════════════════
            CH 12 — THE 18-HOUR COUNTDOWN (THE FINAL PUSH)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(13)}>
          <BookSpread
            id="chapter-12"
            viewMode={viewMode}
            leftPageNumber={25}
            rightPageNumber={26}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 12 // 18-HOUR TIMELINE RAIL"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[11]}
                  accentClass="text-amber-400"
                  marginNote="sun rising. five hours left. everything must compile."
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[11].narrative} pullquoteIndex={0} />
                </div>

                {/* Morning countdown grid */}
                <div className="pt-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
                    // SUNDAY MORNING COUNTDOWN SPRINT
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                    {[
                      { time: '06:00 AM', text: 'Touch D-Pad fallback' },
                      { time: '07:30 AM', text: 'Procedural Web Audio oscillators' },
                      { time: '08:45 AM', text: 'Security test suites (whitelist)' },
                      { time: '09:30 AM', text: 'Game Over confetti physics' },
                      { time: '10:15 AM', text: 'Code freeze & build:pages sync' },
                      { time: '10:45 AM', text: 'Submitted to portal (15m left)' },
                    ].map((slot, i) => (
                      <div key={i} className="p-2 rounded bg-slate-950/80 border border-slate-800">
                        <div className="font-bold text-amber-400 text-[11px] mb-0.5">{slot.time}</div>
                        <div className="text-slate-300 font-sans text-[10px]">{slot.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-5">
                {/* Interactive 18-Hour Milestone Navigator */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-pink-400" />
                      <span className="font-sans font-bold text-sm text-white">18-Hour Milestone Log</span>
                    </div>
                    <span className="text-[10px] font-mono text-pink-400 font-bold px-2 py-0.5 rounded bg-pink-950/40 border border-pink-900/50">
                      MILESTONE {activeMilestoneIdx + 1} OF {TIMELINE_MILESTONES.length}
                    </span>
                  </div>

                  {/* Milestone time selector pills */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 mb-3.5">
                    {TIMELINE_MILESTONES.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMilestoneIdx(idx)}
                        className={`px-1 py-1.5 rounded text-center transition-all cursor-pointer ${
                          activeMilestoneIdx === idx
                            ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-600/40 ring-1 ring-pink-300'
                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        <div className="text-[9.5px] font-mono leading-none">{m.time.split(' ')[0]}</div>
                        <div className="text-[8px] font-mono uppercase opacity-75">{m.time.split(' ')[1]}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Milestone Card */}
                  {(() => {
                    const m = TIMELINE_MILESTONES[activeMilestoneIdx];
                    return (
                      <div className="space-y-2.5 font-sans">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-bold text-sm text-white">{m.title}</h4>
                          <span className="ink-stamp ink-stamp-amber text-[9px] shrink-0 py-0.5 px-1.5">
                            {m.time}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-0.5">Attempted Goal</span>
                            <p className="text-slate-300 font-sans leading-relaxed text-[11.5px]">{m.attempt}</p>
                          </div>

                          <div className="p-2 rounded bg-rose-950/25 border border-rose-900/30">
                            <span className="text-[9px] font-mono text-rose-400 uppercase font-bold block mb-0.5">Reality in the Room</span>
                            <p className="text-rose-200 font-sans leading-relaxed text-[11.5px]">{m.reality}</p>
                          </div>

                          <div className="p-2 rounded bg-emerald-950/25 border border-emerald-900/30">
                            <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold block mb-0.5">Architectural Takeaway</span>
                            <p className="text-emerald-200 font-sans leading-relaxed text-[11.5px]">{m.lesson}</p>
                          </div>
                        </div>

                        {/* Prev / Next milestone nav buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
                          <button
                            disabled={activeMilestoneIdx === 0}
                            onClick={() => setActiveMilestoneIdx((prev) => Math.max(0, prev - 1))}
                            className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed border border-slate-800 cursor-pointer"
                          >
                            ← Earlier
                          </button>
                          <span className="text-[10px] text-slate-500 italic truncate max-w-[180px]">
                            {m.visualEvidence}
                          </span>
                          <button
                            disabled={activeMilestoneIdx === TIMELINE_MILESTONES.length - 1}
                            onClick={() => setActiveMilestoneIdx((prev) => Math.min(TIMELINE_MILESTONES.length - 1, prev + 1))}
                            className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed border border-slate-800 cursor-pointer"
                          >
                            Later →
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* THE MORNING AFTER (10:45 AM) */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 shadow-xl relative">
                  <div className="masking-tape-strip -top-2.5 left-8" />
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2.5">
                    <span className="ink-stamp ink-stamp-green text-[9px]">THE MORNING AFTER</span>
                    <span className="text-[10px] font-mono text-slate-400">10:45 AM · UP 3.0</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 font-mono text-center mb-3">
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-lg font-bold text-white">18</div>
                      <div className="text-[8px] text-slate-500 uppercase">Hours</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-lg font-bold text-pink-400">1</div>
                      <div className="text-[8px] text-slate-500 uppercase">Project</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-lg font-bold text-amber-400">0</div>
                      <div className="text-[8px] text-slate-500 uppercase">Sleep</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-lg font-bold text-cyan-400">???</div>
                      <div className="text-[8px] text-slate-500 uppercase">Black Teas</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed mb-2">
                    I came to Useless Projects 3.0 to document everyone else. Somewhere between midnight coffee, an unplugged webcam, and 39 passing Vitest tests, I accidentally built the most ridiculous thing I&apos;ve ever engineered.
                  </p>
                  <div className="font-handwriting text-base text-pink-300 text-right transform -rotate-1">
                    &ldquo;I came to document everyone else. Somehow, I became the story.&rdquo;
                  </div>
                </div>
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 13 — DANGERPINKY (THE BIG REVEAL)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(14)}>
          <BookSpread
            id="chapter-13"
            viewMode={viewMode}
            leftPageNumber={27}
            rightPageNumber={28}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 13 // DANGERPINKY REVEAL"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[12]}
                  accentClass="text-pink-400"
                  marginNote="a snake. controlled by your pinky. eating real files."
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[12].narrative} pullquoteIndex={0} />
                </div>

                {/* Architecture Pipeline Flow */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 shadow-xl font-mono text-xs mt-2">
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                    <span className="ink-stamp ink-stamp-amber text-[8.5px]">ARCHITECTURE PIPELINE FLOW</span>
                    <span className="text-[9.5px] text-emerald-400">60 FPS DETERMINISTIC</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-pink-400 font-bold block text-[9.5px]">01. OPTICAL CAPTURE</span>
                      <span className="text-slate-300">Webcam 30FPS → MediaPipe WASM GPU</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-pink-400 font-bold block text-[9.5px]">02. ANATOMICAL MATH</span>
                      <span className="text-slate-300">Tip 20 vs Knuckle 17 / Hand Scale</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-pink-400 font-bold block text-[9.5px]">03. JITTER FILTER</span>
                      <span className="text-slate-300">EMA (α=0.35) + 0.028 Deadzone</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-emerald-400 font-bold block text-[9.5px]">04. OS TRASH BRIDGE</span>
                      <span className="text-slate-300">Electron IPC → Windows Recycle Bin</span>
                    </div>
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Screenshot Inspector */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Artifact Screen Inspection — Click to Enlarge
                    </span>
                    <span className="text-[10.5px] text-pink-400 font-mono">4 High-Res Captures</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {SCREENSHOTS_DATA.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setActiveLightboxItem(item)}
                        className="group p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-pink-500/50 transition-all duration-300 cursor-pointer"
                      >
                        <div className="relative aspect-[16/10] max-h-[85px] bg-slate-900 rounded overflow-hidden mb-1">
                          <img
                            src={item.src}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-1 right-1 p-0.5 rounded bg-slate-950/80 text-slate-300 scale-75">
                            <Maximize2 className="w-3 h-3" />
                          </div>
                          <div className="absolute bottom-1 left-1">
                            <span className="px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-slate-950/90 text-pink-300 border border-pink-500/30">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                        <h4 className="font-sans font-bold text-[11px] text-white group-hover:text-pink-300 transition-colors line-clamp-1">{item.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Card: The Full Pipeline in Hand */}
                <div className="relative p-2.5 rounded-lg bg-slate-950/80 border border-pink-500/30 shadow-xl">
                  <div className="masking-tape-strip -top-2 left-8" />
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="ink-stamp ink-stamp-amber text-[8.5px] py-0.5 px-1.5">EVIDENCE // ARTIFACT</span>
                    <span className="text-[9.5px] font-mono text-slate-500">CANVAS 60FPS</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-[8.5px] text-pink-400 font-bold block uppercase">Total Asset Weight</span>
                      <span className="text-base font-bold text-white">0.00 KB</span>
                      <p className="text-[9.5px] text-slate-400 font-sans mt-0.5">Zero external sprites or audio. Pure code.</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-[8.5px] text-emerald-400 font-bold block uppercase">Vision Latency</span>
                      <span className="text-base font-bold text-emerald-300">14.2 ms</span>
                      <p className="text-[9.5px] text-slate-400 font-sans mt-0.5">Single-frame optical inference with WASM.</p>
                    </div>
                  </div>

                  <div className="text-right text-pink-400 font-handwriting text-xs pt-1 mt-1 border-t border-slate-800/80">
                    ↳ &ldquo;a whole pipeline for a joke&rdquo;
                  </div>
                </div>
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 14 — PLAY DANGERPINKY (FOLD-OUT TECHNICAL SCHEMATIC)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(15)}>
          <BookSpread
            id="chapter-14"
            viewMode={viewMode}
            leftPageNumber={29}
            rightPageNumber={30}
            leftRunningHead="VISHNU K R // LIVE ARENA"
            rightRunningHead="CH. 14 // PLAYABLE WORKBENCH"
            paperTone={paperTone}
            fullWidthContent={
              <div className="space-y-6">
                <ChapterHeader
                  chapter={CHAPTERS[13]}
                  accentClass="text-emerald-400"
                  marginNote="no more reading. steer with your little finger."
                />

                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[13].narrative} />
                </div>

                <PlayEmbedSection
                  onStartDemo={onStartDemo}
                  onStartWithCamera={onStartWithCamera}
                  onSelectRealFiles={onSelectRealFiles}
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 15 — WHAT I ACTUALLY LEARNED
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(16)}>
          <BookSpread
            id="chapter-15"
            viewMode={viewMode}
            leftPageNumber={31}
            rightPageNumber={32}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 15 // THREE RETROSPECTIVE TRUTHS"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[14]}
                  accentClass="text-emerald-400"
                  marginNote="three things that stayed with me after the event"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[14].narrative} highlightIndex={1} />
                </div>

                {/* Sticky Note: The Core Realization */}
                <div className="sticky-note sticky-note-yellow">
                  <div className="sticky-note-tape" />
                  <div className="text-[10px] font-mono text-amber-900 uppercase tracking-wider mb-1 font-bold">
                    // VISHNU'S CORE TAKEAWAY
                  </div>
                  <p className="text-base text-slate-900 font-bold leading-snug">
                    &ldquo;The person who was supposed to document everyone else ended up having the most to document.&rdquo;
                  </p>
                  <div className="mt-3 text-right font-mono text-[11px] text-amber-900">
                    — 10:45 AM Sunday morning
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                <div className="space-y-2">
                  {[
                    {
                      stamp: 'TRUTH 01',
                      color: 'ink-stamp-green',
                      title: 'Dropping an Idea Isn\'t Failing',
                      desc: 'Stepping aside when another team builds something similar creates the space for a midnight breakthrough.',
                    },
                    {
                      stamp: 'TRUTH 02',
                      color: 'ink-stamp-red',
                      title: 'Useless Ideas Demand Exceptional Engineering',
                      desc: 'When the premise is ridiculous, the execution cannot have flaws. A rock-solid 60 FPS gesture file eater is unforgettable.',
                    },
                    {
                      stamp: 'TRUTH 03',
                      color: 'ink-stamp-amber',
                      title: 'Client-Side Vision + Recycle Bin Safety',
                      desc: 'MediaPipe WASM runs optical neural nets sub-20ms client-side. Routing deletes to OS Trash keeps stakes thrilling without tragedy.',
                    },
                  ].map((truth, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                      <span className={`ink-stamp ${truth.color} shrink-0 text-[8.5px] py-0.5 px-1.5`}>
                        {truth.stamp}
                      </span>
                      <div>
                        <h4 className="font-sans font-bold text-xs text-white mb-0.5">{truth.title}</h4>
                        <p className="text-[11px] text-slate-300 font-sans leading-snug">{truth.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <ScrapbookPlaceholder
                  tag="[PHOTO: Morning sun through the hackathon window]"
                  caption="Sun rising over Ernakulam: laptops sleeping, DangerPinky compiled"
                  rotate="cw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CH 16 — IF I HAD ANOTHER NIGHT (ROADMAP ON DESK)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(17)}>
          <BookSpread
            id="chapter-16"
            viewMode={viewMode}
            leftPageNumber={33}
            rightPageNumber={34}
            leftRunningHead="VISHNU K R // FIELD NOTES"
            rightRunningHead="CH. 16 // UNFINISHED AMBITIONS"
            paperTone={paperTone}
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[15]}
                  accentClass="text-cyan-400"
                  marginNote="the roadmap of useless ambition"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[15].narrative} pullquoteIndex={0} />
                </div>

                {/* Field Slip: Future Sprint Notes */}
                <div className="relative p-3 rounded-lg bg-slate-950/80 border border-cyan-500/30 shadow-xl">
                  <div className="masking-tape-strip -top-2.5 left-8" />
                  <div className="flex items-center justify-between gap-2 mb-2 border-b border-slate-800/80 pb-1">
                    <span className="ink-stamp ink-stamp-cyan text-[8.5px] py-0.5 px-1.5">POST-HACKATHON</span>
                    <span className="text-[9.5px] font-mono text-slate-500">BACKLOG</span>
                  </div>
                  <h4 className="font-sans font-bold text-white text-xs mb-1">
                    Unfinished Inventions
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-2">
                    18 hours proved the concept. An additional weekend could turn this into a full multiplayer party game where two friends duel over deleting files.
                  </p>
                  <div className="text-[10px] font-mono text-cyan-300 flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                    <span>↳ Status: Open Source</span>
                    <span>↳ PRs welcome</span>
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      title: 'WebRTC Multiplayer Duels',
                      desc: "Two players, two webcams, one shared Downloads folder.",
                      tag: 'NETWORKING',
                    },
                    {
                      title: 'Custom Candy Theme Skins',
                      desc: 'Cyberpunk neon candy, retro Game Boy 4-shade green.',
                      tag: 'VISUALS',
                    },
                    {
                      title: 'Linux & macOS Trash Adapters',
                      desc: 'Native gio trash and AppleScript integrations for full parity.',
                      tag: 'PLATFORMS',
                    },
                    {
                      title: 'Voice Shouting Speed Boost',
                      desc: 'Yell at your laptop to activate turbo speed via Web Speech API.',
                      tag: 'AUDIO ML',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[8px] px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-[11px] text-white mb-0.5 line-clamp-1">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-sans leading-snug line-clamp-2">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <ScrapbookPlaceholder
                  tag="[SKETCH: Two-player split screen pinky battle]"
                  caption="Napkin draft: WebRTC peer connection duel over shared directory"
                  rotate="ccw"
                />
              </div>
            }
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SPREAD 18: FINAL REFLECTION & PROJECT DRAWER (EPILOGUE)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className={getSpreadClassName(18)}>
          <FinalReflection viewMode={viewMode} paperTone={paperTone} />
        </div>
        </div>

        {/* ─── BOTTOM SPREAD PAGER FOOTER (Spread Mode Navigation) ─── */}
        {viewMode === 'spread' && (
          <div className="mt-6 rounded-2xl bg-slate-950/95 border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Progress bar strip */}
            <div className="h-[2px] bg-slate-900 w-full relative">
              <div
                className="h-full bg-gradient-to-r from-pink-600 via-pink-400 to-amber-400 transition-all duration-500 ease-out"
                style={{ width: `${((spreadIndex + 1) / sectionIds.length) * 100}%` }}
              />
            </div>

            <div className="flex items-stretch">
              {/* Prev Button */}
              <button
                onClick={goToPrevSpread}
                disabled={spreadIndex === 0}
                className={`px-5 py-3.5 flex items-center gap-2 font-mono text-xs font-bold transition-all duration-200 cursor-pointer border-r border-slate-800/80 shrink-0 ${
                  spreadIndex === 0
                    ? 'opacity-20 cursor-not-allowed text-slate-600'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 active:bg-slate-900'
                }`}
                title="Previous spread (← arrow key)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">PREV</span>
              </button>

              {/* Center: Progress dots + current spread label */}
              <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-2.5 px-4">
                {/* Dot progress indicator */}
                <div className="flex items-center gap-1">
                  {sectionIds.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSection(sectionIds[idx])}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        idx === spreadIndex
                          ? 'w-5 h-2 bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]'
                          : idx < spreadIndex
                          ? 'w-2 h-2 bg-slate-600 hover:bg-pink-500/60'
                          : 'w-2 h-2 bg-slate-800 hover:bg-slate-600'
                      }`}
                      title={`Spread ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="font-mono text-[10px] text-slate-500 tracking-widest">
                  SPREAD {spreadIndex + 1} <span className="text-slate-700">/</span> {sectionIds.length}
                  <span className="ml-2 text-[9px] text-slate-700 hidden sm:inline">· ← → to flip</span>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={goToNextSpread}
                disabled={spreadIndex >= sectionIds.length - 1}
                className={`px-5 py-3.5 flex items-center gap-2 font-mono text-xs font-bold transition-all duration-200 cursor-pointer border-l border-slate-800/80 shrink-0 ${
                  spreadIndex >= sectionIds.length - 1
                    ? 'opacity-20 cursor-not-allowed text-slate-600'
                    : 'bg-pink-600/10 text-pink-400 hover:bg-pink-600/20 hover:text-pink-300 active:bg-pink-600/30'
                }`}
                title="Next spread (→ arrow key)"
              >
                <span className="hidden sm:inline">NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ─── QUIET BOTTOM-CORNER JUMP PILL (Scroll Mode only) ─── */}
      {viewMode === 'scroll' && (
        <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2">
          <button
            onClick={() => handleSelectSection(HERO_DATA.id)}
            className="p-2.5 rounded-full bg-slate-950/90 text-slate-400 hover:text-white border border-slate-800 hover:border-pink-500/50 shadow-xl transition-colors cursor-pointer"
            title="Scroll to Top"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSelectSection('chapter-14')}
            className="px-3.5 py-2 rounded-full bg-pink-600/90 hover:bg-pink-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-xl transition-all cursor-pointer"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Play Game</span>
          </button>
        </div>
      )}
    </div>
  );
};
