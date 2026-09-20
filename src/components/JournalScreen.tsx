import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Maximize2,
  AlertTriangle,
  GitCommit,
  Layers,
  Clock,
  Zap,
  Coffee,
  Share2,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Terminal
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
import { AudioSoundboard } from './journal/AudioSoundboard';
import { KeyboardShortcutsModal } from './journal/KeyboardShortcutsModal';

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
  maxParagraphs?: number;
}

const EditorialProse: React.FC<EditorialProseProps> = ({
  narratives,
  pullquoteIndex,
  highlightIndex,
  maxParagraphs
}) => {
  const displayed = maxParagraphs ? narratives.slice(0, maxParagraphs) : narratives;
  return (
    <div className="reader-prose text-slate-200 text-xs sm:text-[12px] leading-relaxed max-w-3xl space-y-1.5 mb-2.5">
      {displayed.map((para, i) => {
        if (i === pullquoteIndex) {
          return (
            <div key={i} className="pullquote my-1.5 text-xs sm:text-[12px] border-l-2 border-pink-500 pl-2.5 py-0.5 italic">
              &ldquo;{para}&rdquo;
            </div>
          );
        }
        if (i === highlightIndex) {
          return (
            <p key={i} className="font-semibold text-pink-200 border-l-2 border-pink-500 pl-2.5 py-0.5 my-1.5 bg-pink-500/[0.04]">
              {para}
            </p>
          );
        }
        return <p key={i}>{para}</p>;
      })}
    </div>
  );
};

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
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => sound.getMuted());
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleToggleSound = () => {
    const nextMuted = !isSoundMuted;
    sound.setMuted(nextMuted);
    setIsSoundMuted(nextMuted);
    showToast(nextMuted ? 'Journal audio muted' : 'Journal audio active');
  };

  const showToast = (msg: string) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href.split('#')[0] + '#journal';
    const shareData = {
      title: 'DangerPinky — Devlog & Game',
      text: 'DangerPinky: Russian Roulette for your filesystem, controlled by your pinky finger. 18-hour makeathon field log by Vishnu K R.',
      url: shareUrl
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share dismissed
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Devlog link copied to clipboard!');
        return;
      } catch {
        // clipboard fallback
      }
    }
    showToast('Link: ' + shareUrl);
  };

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (viewMode !== 'spread') return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (viewMode !== 'spread' || touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        goToNextSpread();
      } else {
        goToPrevSpread();
      }
    }
  };

  const triggerPageFlip = (dir: 'next' | 'prev') => {
    if (flipTimerRef.current) window.clearTimeout(flipTimerRef.current);
    setFlipDirection(dir);
    setIsFlipping(true);
    sound.playPageTurn();
    flipTimerRef.current = window.setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
    }, 560);
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

  // Keyboard navigation for page turns in book spread mode & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }
      if (e.key === 't' || e.key === 'T') {
        setPaperTone((prev) => (prev === 'dark' ? 'cream' : 'dark'));
        return;
      }
      if (e.key === 'v' || e.key === 'V') {
        setViewMode((prev) => (prev === 'spread' ? 'scroll' : 'spread'));
        return;
      }
      if (viewMode !== 'spread') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
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

  // Map spread index → human-readable chapter label for the bottom nav
  const getSpreadLabel = (idx: number): { chapter: string; title: string } => {
    if (idx === 0) return { chapter: 'COVER', title: 'Hardcover Dossier' };
    if (idx === 1) return { chapter: '00 · PROLOGUE', title: 'The Opening Situation' };
    if (idx === 18) return { chapter: 'EPILOGUE', title: 'The Project Drawer' };
    const ch = CHAPTERS[idx - 2];
    if (ch) return { chapter: `${ch.number} · ${ch.tag}`, title: ch.title };
    return { chapter: `SPREAD ${idx + 1}`, title: '' };
  };
  const currentSpreadInfo = getSpreadLabel(spreadIndex);

  return (
    <div className="min-h-screen bg-[#070b14] desk-grid text-slate-100 font-sans selection:bg-pink-500 selection:text-white pb-24 relative">

      <LightboxModal
        item={activeLightboxItem}
        onClose={() => setActiveLightboxItem(null)}
        onNext={handleNextLightbox}
        onPrev={handlePrevLightbox}
        currentIndex={activeLightboxItem ? SCREENSHOTS_DATA.findIndex((s) => s.id === activeLightboxItem.id) : 0}
        totalCount={SCREENSHOTS_DATA.length}
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
        isSoundMuted={isSoundMuted}
        onToggleSound={handleToggleSound}
        onPrevPage={goToPrevSpread}
        onNextPage={goToNextSpread}
        currentPage={spreadIndex + 1}
        totalPages={sectionIds.length}
        canPrev={spreadIndex > 0}
        canNext={spreadIndex < sectionIds.length - 1}
        onShare={handleShare}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Hanging Silk Ribbon Bookmark */}
      <RibbonBookmark
        currentSectionId={activeSection}
        onSelectSection={handleSelectSection}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className={`relative ${viewMode === 'spread' ? 'book-stage' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

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
            layoutVariant="editorial"
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
              <div className="space-y-2.5">
                {/* 2-Column Document Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Outreach Clipboard Card */}
                  <div className="relative p-3 rounded-lg bg-slate-950/80 border border-slate-800 shadow-xl flex flex-col justify-between">
                    <div className="masking-tape-strip -top-2.5 left-4" />
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-pink-400 font-bold uppercase tracking-wider mb-1">
                        <Share2 className="w-3 h-3 shrink-0" />
                        <span className="leading-tight">Outreach Lead // SNMIMT</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 font-sans mb-1.5">
                        My official role while other teams coded:
                      </p>
                      <ul className="space-y-0.5 text-[10.5px] font-mono text-slate-300">
                        {PROLOGUE_DATA.outreachRole.responsibilities.slice(0, 3).map((r, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-pink-400 font-bold">↳</span>
                            <span className="line-clamp-1">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* NoseTrack Index Card */}
                  <div className="relative p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="ink-stamp ink-stamp-amber text-[8.5px] py-0.2 px-1.5">UP 2.0 WINNER</span>
                        <a
                          href={PROLOGUE_DATA.previousWin.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-amber-400 hover:underline flex items-center gap-0.5"
                        >
                          GitHub ↗
                        </a>
                      </div>
                      <h4 className="font-sans font-bold text-xs sm:text-[13px] text-white mb-0.5">
                        {PROLOGUE_DATA.previousWin.title}
                      </h4>
                      <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed line-clamp-3">
                        {PROLOGUE_DATA.previousWin.note}
                      </p>
                    </div>
                  </div>
                </div>

                <ScrapbookPlaceholder
                  compact
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
            layoutVariant="notebook"
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

                <div className="p-2.5 mt-2.5 rounded-lg bg-rose-500/[0.04] border border-rose-500/20 text-rose-300 font-handwriting text-sm text-center">
                  ↳ &ldquo;Rule #1: If someone else is excited about the same idea, let them have it. Find something dumber.&rdquo;
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
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
                  compact
                  tag={CHAPTERS[0].scrapbookTags?.[0] || '[ADD PHOTO: Teams setting up]'}
                  caption="Teams opening laptops, ideas flying. My repo was empty."
                  rotate="ccw"
                />

                {/* Discarded Project Audit Slip */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 text-[10px]">
                    <span className="text-pink-400 font-bold">SCRAPPED PROJECT AUDIT</span>
                    <span className="text-slate-500">18:30 IST</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    <strong>Conflict Post-Mortem:</strong> Another team pitched an audio-cursor idea 20 minutes in. Rather than build a duplicate on campus, I archived my repo and stepped away.
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span>Outcome: Zero lines of code. 100% outreach duty.</span>
                    <span className="ink-stamp ink-stamp-red text-[8px] py-0.2 px-1">ABANDONED</span>
                  </div>
                </div>
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
            layoutVariant="editorial"
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

                {/* Quiet Anchor Artifact: Empty Terminal Thermal Receipt */}
                <div className="thermal-receipt -rotate-1 mt-2 shadow-lg">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1.5 text-[10px]">
                    <span className="font-mono font-bold text-rose-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>TERMINAL AUDIT // 21:00 IST</span>
                    </span>
                    <span className="ink-stamp ink-stamp-red text-[7px] py-0 px-1">0 COMMITS</span>
                  </div>
                  <div className="space-y-1 font-mono text-[10px] text-slate-300 py-1">
                    <div className="text-slate-400">
                      <span className="text-pink-400 font-bold">$</span> cd ~/projects/dangerpinky
                    </div>
                    <div className="text-rose-400/90 pl-3">
                      bash: cd: /home/vishnu/projects/dangerpinky: No such file or directory
                    </div>
                    <div className="text-slate-400">
                      <span className="text-pink-400 font-bold">$</span> git status
                    </div>
                    <div className="text-rose-400/90 pl-3">
                      fatal: not a git repository (or any of the parent directories): .git
                    </div>
                  </div>
                  <div className="pt-1.5 mt-1 border-t border-slate-800 text-[9px] font-mono text-slate-400 flex justify-between items-center">
                    <span>Active workspace: None</span>
                    <span className="text-amber-400 font-semibold">100% OUTREACH DUTY</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-amber-500/[0.05] border border-amber-500/20 text-amber-200 font-handwriting text-sm text-center">
                  &ldquo;Telling everyone else to document their build... while my screen was black.&rdquo;
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Physical Relic: Outreach Timeline Dispatch Tape Slip */}
                <div className="dispatch-tape-slip rotate-1 border-amber-500/30 shadow-xl">
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-amber-500/20">
                    <span className="text-amber-400 font-mono font-bold text-[10.5px] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>DISPATCH LOG // 18:00 → 00:15 IST</span>
                    </span>
                    <span className="ink-stamp ink-stamp-amber text-[7.5px] py-0.2 px-1">OUTREACH DESK</span>
                  </div>
                  <div className="space-y-1 text-[10.5px] font-mono text-slate-300">
                    <div className="flex justify-between items-center">
                      <span><span className="text-amber-400 font-bold">18:07</span> — Story: &ldquo;UP 3.0 starts!&rdquo;</span>
                      <span className="text-slate-500 text-[9px]">Campus gate</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span><span className="text-amber-400 font-bold">18:42</span> — Photo: Team #04 setup</span>
                      <span className="text-slate-500 text-[9px]">Lab 3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span><span className="text-amber-400 font-bold">19:13</span> — &ldquo;Bro shoot our board!&rdquo;</span>
                      <span className="text-slate-500 text-[9px]">Floor 1</span>
                    </div>
                    <div className="flex justify-between items-center text-rose-400 font-semibold">
                      <span><span className="text-amber-400 font-bold">20:06</span> — 2 hours in: Still no project</span>
                      <span className="text-rose-400/70 text-[9px]">0 ideas</span>
                    </div>
                    <div className="flex justify-between items-center text-rose-400 font-semibold">
                      <span><span className="text-amber-400 font-bold">21:17</span> — 3 hours in: Brainstorm void</span>
                      <span className="text-rose-400/70 text-[9px]">0 code</span>
                    </div>
                    <div className="flex justify-between items-center text-cyan-300">
                      <span><span className="text-amber-400 font-bold">23:58</span> — Tea stall run with TinkerHub crew</span>
                      <span className="text-cyan-400/70 text-[9px]">Gate stall</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-400 font-bold pt-1 border-t border-slate-800">
                      <span><span className="text-amber-400">00:14</span> — &ldquo;What if snake follows pinky?&rdquo;</span>
                      <span className="ink-stamp ink-stamp-green text-[6.5px] py-0 px-0.5">BREAKTHROUGH</span>
                    </div>
                  </div>
                </div>

                <ScrapbookPlaceholder
                  compact
                  tag={CHAPTERS[1].scrapbookTags?.[0] || '[ADD PHOTO: Event floor busy]'}
                  caption="Running around with phone documenting everyone else"
                  rotate="cw"
                />

                {/* Media Lead Dispatch Status Card */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 text-[10px]">
                    <span className="text-cyan-400 font-bold">DISPATCH DISK STATS</span>
                    <span className="text-slate-500">SNMIMT CAMPUS</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-0.5">
                    <div className="p-1 rounded bg-slate-900/60 border border-slate-800">
                      <div className="text-sm font-bold text-white font-mono">14</div>
                      <div className="text-[8.5px] text-slate-400">Stories Filed</div>
                    </div>
                    <div className="p-1 rounded bg-slate-900/60 border border-slate-800">
                      <div className="text-sm font-bold text-white font-mono">22</div>
                      <div className="text-[8.5px] text-slate-400">Squads Filmed</div>
                    </div>
                    <div className="p-1 rounded bg-slate-900/60 border border-rose-500/30">
                      <div className="text-sm font-bold text-rose-400 font-mono">0</div>
                      <div className="text-[8.5px] text-rose-400/80">Commits Made</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans italic pt-0.5">
                    &ldquo;Watching 40 developers build while I stood by the door with an empty VS Code window.&rdquo;
                  </p>
                </div>
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
            layoutVariant="notebook"
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

                {/* Field Audio Log // Dialogue Transcript as Authentic Taped Dispatch */}
                <div className="dispatch-tape-slip border-amber-500/30 text-xs text-slate-300 shadow-xl space-y-2 mt-2">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5 text-[10px]">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>AUDIO LOG // HOSTEL TEA STALL</span>
                    </span>
                    <span className="text-slate-500 font-mono">00:14 IST · SNMIMT GATE</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] leading-relaxed font-sans">
                    <p>
                      <strong className="text-amber-300 font-mono text-[10.5px]">Friend:</strong>{' '}
                      <span className="text-slate-300">&ldquo;Bro, hackathon is half over. You really doing nothing?&rdquo;</span>
                    </p>
                    <p>
                      <strong className="text-pink-400 font-mono text-[10.5px]">Vishnu:</strong>{' '}
                      <span className="text-slate-200">&ldquo;What if I make a snake game that follows my pinky finger with the webcam?&rdquo;</span>
                    </p>
                    <p>
                      <strong className="text-amber-300 font-mono text-[10.5px]">Friend:</strong>{' '}
                      <span className="text-slate-400">&ldquo;That sounds completely useless. You&rsquo;re definitely gonna lose.&rdquo;</span>
                    </p>
                    <p>
                      <strong className="text-pink-400 font-mono text-[10.5px]">Vishnu:</strong>{' '}
                      <span className="text-emerald-400 font-semibold">&ldquo;Perfect. That&rsquo;s literally the name of the hackathon.&rdquo;</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                    <span>Inciting Incident · Decisive Turn</span>
                    <span className="ink-stamp ink-stamp-pink text-[8px] py-0.2 px-1">PROJECT GREENLIT</span>
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Midnight Coffee Scratchpad Card */}
                <div className="relative p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 overflow-hidden shadow-xl">
                  {/* Subtle Coffee Stain Ring Watermark */}
                  <div
                    className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full border-4 border-amber-900/25 pointer-events-none"
                    style={{ filter: 'blur(1px)' }}
                  />

                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-1.5">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>12:15 AM · Hostel Tea Stall Conversation</span>
                  </div>

                  <p className="font-handwriting text-lg sm:text-xl text-white leading-relaxed mb-2">
                    &ldquo;What if I made a snake game that followed my pinky?&rdquo;
                  </p>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>FIRST DRAFT:</span>
                    <span className="line-through text-slate-500">Pinky Snake</span>
                    <span className="text-pink-400 font-bold">↳ DangerPinky</span>
                  </div>
                </div>

                {/* Hand-drawn Napkin Scratchpad Schematic on Graph Paper */}
                <ScrapbookPlaceholder
                  tag="[ADD SKETCH: First napkin sketch]"
                  caption="First scribble at 12:30 AM: Pinky -> Snake -> Recycle Bin"
                  rotate="none"
                />

                <ScrapbookPlaceholder
                  compact
                  tag="[ADD PHOTO: Late night coffee]"
                  caption="Tired conversations & black tea at midnight"
                  rotate="ccw"
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
            layoutVariant="technical"
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[3]}
                  accentClass="text-emerald-400"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[3].narrative} pullquoteIndex={3} maxParagraphs={3} />
                </div>

                {/* v0.1 Code Snippet in Terminal */}
                {CHAPTERS[3].codeSnippets?.[0] && (
                  <TerminalWindow title="src/game/firstPrototype.ts (09:30 PM)" command="git diff HEAD~1">
                    <pre className="text-emerald-400 font-mono text-xs leading-relaxed max-h-24 overflow-hidden">
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

                  {/* Prototype Audit Slip */}
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[10.5px] space-y-1.5 mt-2.5 shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-[10px]">
                      <span className="text-emerald-400 font-bold uppercase">PROTOTYPE AUDIT // 09:30 PM</span>
                      <span className="ink-stamp ink-stamp-amber text-[7px] py-0 px-1">BARE BONES</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-300 font-sans">
                      <div>• Canvas: 300×300 raw 2D context</div>
                      <div>• Food: Raw unstyled text labels</div>
                      <div>• Jitter: Unfiltered Landmark 20</div>
                      <div>• Danger: 0% (No file recycling)</div>
                    </div>
                    <p className="text-[10px] font-handwriting text-slate-400 text-center pt-0.5">
                      &ldquo;It worked. But who cares about a snake that just eats fake dots?&rdquo;
                    </p>
                  </div>
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
            layoutVariant="editorial"
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[4]}
                  accentClass="text-pink-400"
                  marginNote="the moment: what if the snake ate a FILE?"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[4].narrative} highlightIndex={6} maxParagraphs={4} />
                </div>

                {/* Formula Scratchpad on Desk */}
                <div className="p-3 rounded-lg bg-pink-500/[0.04] border border-pink-500/30 font-handwriting text-lg text-pink-300">
                  Pinky Control + Snake + Local File + Windows Recycle Bin = DangerPinky 🔥
                </div>

                {/* Safety Architecture Callout as Authentic Taped Field Dispatch */}
                <div className="dispatch-tape-slip border-amber-500/30 text-xs text-slate-300 shadow-xl space-y-1.5 mt-2">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-1 text-[10px]">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>SAFETY PROTOCOL // SANDBOX</span>
                    </span>
                    <span className="ink-stamp ink-stamp-green text-[7.5px] py-0.2 px-1">100% RECOVERABLE</span>
                  </div>
                  <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                    Files are routed to the OS Recycle Bin via <code className="text-pink-300 font-mono">shell.trashItem</code> — never permanently deleted and 100% recoverable.
                  </p>
                  <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>✓ System files strictly blacklisted</span>
                    <span>✓ ntuser.dat &amp; desktop.ini filtered</span>
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Interactive 3-Step Breakthrough Switcher */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                    <span className="ink-stamp ink-stamp-amber text-[8.5px]">
                      BREAKTHROUGH {activeBreakthroughIdx + 1} OF {CHAPTERS[4].breakthroughs?.length || 3}
                    </span>
                    <div className="flex gap-1">
                      {CHAPTERS[4].breakthroughs?.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveBreakthroughIdx(idx)}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-all ${
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
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h4 className="font-bold text-xs sm:text-[13px] text-white">{bt.title}</h4>
                          {bt.formula && (
                            <span className="font-mono text-[9.5px] text-pink-400 font-bold bg-pink-500/10 px-1.5 py-0.2 rounded border border-pink-500/30">
                              {bt.formula}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{bt.description}</p>
                        <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                          <Zap className="w-3 h-3" />
                          <span>IMPACT: {bt.impact}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Real Screenshot Artifact of the Dangerous Mode Settings Dialog */}
                <ScrapbookPlaceholder
                  compact
                  tag="[ADD SCREENSHOT: Dangerous Mode Sandbox Settings Dialog]"
                  imgSrc="./screenshots/settings.png"
                  caption="Dangerous Mode sandbox: OS Trash integration confirmation"
                  rotate="none"
                />

                <ScrapbookPlaceholder
                  compact
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
            layoutVariant="standard"
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[5]}
                  accentClass="text-cyan-400"
                  marginNote="this was probably a bad idea"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[5].narrative} pullquoteIndex={3} maxParagraphs={3} />
                </div>

                {/* The Split-Screen Reality Card filling the lower half of left page */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 shadow-lg space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>THE SPLIT-SCREEN OBSESSION</span>
                    </span>
                    <span className="ink-stamp ink-stamp-cyan text-[7.5px] py-0.2 px-1">PARALLEL WORK</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] font-sans">
                    <div className="p-2 rounded bg-amber-950/20 border border-amber-500/20">
                      <span className="text-[9px] font-mono font-bold text-amber-400 block mb-0.5">JOB 01 // OUTREACH</span>
                      <p className="text-slate-300 leading-snug">
                        Documenting 50 builders, capturing 2 AM Instagram reels, answering queries: &ldquo;Document your build!&rdquo;
                      </p>
                    </div>
                    <div className="p-2 rounded bg-pink-950/20 border border-pink-500/20">
                      <span className="text-[9px] font-mono font-bold text-pink-400 block mb-0.5">JOB 02 // DANGERPINKY</span>
                      <p className="text-slate-300 leading-snug">
                        MediaPipe Landmark 20 extraction, 60 FPS HTML5 Canvas engine loop, trashItem OS safety integration.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-pink-500/[0.06] border border-pink-500/30 text-pink-300 font-handwriting text-base transform -rotate-1 text-center">
                  &ldquo;Telling everyone to document... while I forgot my own screen.&rdquo;
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Physical Relic: Thermal Terminal Receipt */}
                <div className="thermal-receipt rotate-1">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 text-[10px]">
                    <span className="font-mono font-bold text-pink-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>BUILD LOG // 02:43 AM IST</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[9px]">BRANCH: journal</span>
                  </div>
                  <div className="space-y-1 font-mono text-[10.5px] text-slate-300 py-1">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400">c48f21a</span>
                      <span className="text-slate-200">fix: landmark 20 offset &amp; deadzone</span>
                      <span className="text-slate-500 text-[9px]">02:18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400">9b1a03e</span>
                      <span className="text-slate-200">feat: shell.trashItem native hook</span>
                      <span className="text-slate-500 text-[9px]">02:35</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400">3e18a99</span>
                      <span className="text-slate-200">wip: 1-tick mutex stop suicide turn</span>
                      <span className="text-slate-500 text-[9px]">02:43</span>
                    </div>
                  </div>
                  <div className="pt-2 mt-1 border-t border-slate-800 text-[9px] font-mono text-emerald-400 flex justify-between items-center">
                    <span>BUILD PASS // 0 ERRORS</span>
                    <span className="ink-stamp ink-stamp-green text-[7px] py-0 px-1">VERIFIED</span>
                  </div>
                </div>

                {/* Physical Relic: Instagram Story Dispatch Tape Slip */}
                <div className="dispatch-tape-slip -rotate-1 border-amber-500/30">
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-amber-500/20">
                    <span className="text-amber-400 font-mono font-bold text-[10.5px] flex items-center gap-1.5">
                      <span>📸</span>
                      <span>FIELD EVIDENCE // INSTAGRAM QUEUE</span>
                    </span>
                    <span className="ink-stamp ink-stamp-amber text-[7.5px] py-0.2 px-1">@snmimt</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300 font-mono text-[10.5px]">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-[9.5px]">08:30 PM</span>
                      <span>Story: &ldquo;UP 3.0 in full swing! 🔥&rdquo; (48 views)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-[9.5px]">01:45 AM</span>
                      <span>Reel: &ldquo;The 2 AM trenches — coffee &amp; code&rdquo;</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-[9.5px]">03:30 AM</span>
                      <span>Photos: Auditorium sleeping bags &amp; glowing monitors</span>
                    </div>
                  </div>
                  <div className="pt-1.5 mt-2 border-t border-slate-800/80 flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>TinkerHub Outreach Lead Broadcast</span>
                    <span className="text-amber-400">100% POSTED</span>
                  </div>
                </div>

                <ScrapbookPlaceholder
                  compact
                  tag="[ADD PHOTO: Event atmosphere — Vishnu doing outreach while coding]"
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
            layoutVariant="technical"
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[6]}
                  accentClass="text-emerald-400"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[6].narrative} pullquoteIndex={0} maxParagraphs={3} />
                </div>

                {CHAPTERS[6].codeSnippets?.[0] && (
                  <TerminalWindow title="src/game/pinkyDetector.ts — Relative Vector Math">
                    <pre className="text-emerald-400 font-mono text-xs leading-relaxed max-h-24 overflow-hidden">
                      <code>{CHAPTERS[6].codeSnippets[0].code}</code>
                    </pre>
                  </TerminalWindow>
                )}
              </>
            }
            rightContent={
              <div className="space-y-2.5">
                {/* Hardware & Engine Architecture Specifications Slip */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs shadow-xl">
                  <div className="text-[10px] text-pink-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                    <Layers className="w-3 h-3" />
                    <span>Engine Architecture // Evidence Slip</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[8px] text-slate-500 uppercase block">Vision</span>
                      <span className="text-pink-300 font-bold text-[11px] block">MediaPipe</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[8px] text-slate-500 uppercase block">Landmark</span>
                      <span className="text-pink-300 font-bold text-[11px] block">P20 vs P17</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[8px] text-slate-500 uppercase block">Engine</span>
                      <span className="text-emerald-300 font-bold text-[11px] block">60 FPS</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[8px] text-slate-500 uppercase block">Recycle Hook</span>
                      <span className="text-amber-300 font-bold text-[11px] block">trashItem</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[8px] text-slate-500 uppercase block">Sound</span>
                      <span className="text-cyan-300 font-bold text-[11px] block">Web Audio</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[8px] text-slate-500 uppercase block">Tests</span>
                      <span className="text-emerald-300 font-bold text-[11px] block">39 / 39 Pass</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Procedural Soundboard */}
                <AudioSoundboard compact />

                <ScrapbookPlaceholder
                  compact
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
            layoutVariant="technical"
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[7]}
                  accentClass="text-rose-400"
                  marginNote="my pinky was lying to me"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[7].narrative} maxParagraphs={3} />
                </div>

                {/* Triage Forensic Dossier Card */}
                <div className="p-3 rounded-lg bg-slate-950/90 border border-rose-500/30 shadow-lg text-xs font-mono space-y-2 mt-3">
                  <div className="flex items-center justify-between border-b border-rose-500/20 pb-1.5">
                    <span className="text-rose-400 font-bold text-[10.5px] uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>TRIAGE DOSSIER // 03:00 AM TRENCHES</span>
                    </span>
                    <span className="ink-stamp ink-stamp-red text-[7.5px] py-0.2 px-1">SEVERITY: CRITICAL</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded bg-rose-950/20 border border-rose-900/30">
                      <span className="text-[8px] text-slate-500 block">BUG TYPE</span>
                      <span className="text-rose-300 font-bold">180° Inversion</span>
                    </div>
                    <div className="p-1.5 rounded bg-rose-950/20 border border-rose-900/30">
                      <span className="text-[8px] text-slate-500 block">FILE</span>
                      <span className="text-pink-300 font-bold">GameEngine.ts</span>
                    </div>
                    <div className="p-1.5 rounded bg-emerald-950/20 border border-emerald-900/30">
                      <span className="text-[8px] text-slate-500 block">STATUS</span>
                      <span className="text-emerald-300 font-bold">Mutex Patched</span>
                    </div>
                  </div>
                  <p className="text-[10.5px] font-sans text-slate-300 leading-snug">
                    When pinky flicked left while head traveled right, double-queued events caused the snake to eat its own neck on frame 0. Patched via 1-tick direction mutex buffer.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-500/[0.05] border border-rose-500/30 text-rose-300 font-handwriting text-base text-center transform -rotate-1 mt-2">
                  &ldquo;A bug at 03:00 AM isn&apos;t just an error. It&apos;s an existential question.&rdquo;
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Interactive Bug Dispatch Switcher */}
                <div className="rounded-lg bg-slate-950/90 border border-rose-500/30 overflow-hidden shadow-xl">
                  <div className="px-3.5 py-1.5 bg-rose-950/30 border-b border-rose-500/20 flex flex-wrap items-center justify-between gap-2">
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
                      <div className="p-2.5 space-y-1.5 text-xs font-sans card-switcher-content" key={activeBugIdx}>
                        <h4 className="font-bold text-xs sm:text-[13px] text-white">{failure.title}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono">
                          <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                            <span className="text-[8.5px] text-slate-500 uppercase block mb-0.5">What I Thought:</span>
                            <p className="text-slate-300 italic text-[10.5px]">&ldquo;{failure.thought}&rdquo;</p>
                          </div>
                          <div className="p-1.5 rounded bg-rose-950/20 border border-rose-900/40">
                            <span className="text-[8.5px] text-rose-400 uppercase font-bold block mb-0.5">What Happened:</span>
                            <p className="text-slate-200 text-[10.5px]">{failure.tried}</p>
                          </div>
                        </div>

                        <div className="p-1.5 rounded bg-amber-500/[0.04] border border-amber-500/20 text-slate-300 font-mono text-[10.5px]">
                          <span className="text-[8.5px] text-amber-400 font-bold uppercase block mb-0.5">Root Cause:</span>
                          <p>{failure.cause}</p>
                        </div>

                        <div className="p-1.5 rounded bg-emerald-500/[0.05] border border-emerald-500/30 font-mono text-emerald-300 text-[10.5px]">
                          <span className="text-[8.5px] text-emerald-400 font-bold uppercase block mb-0.5">How I Fixed It:</span>
                          <p className="font-semibold">{failure.fix}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <ScrapbookPlaceholder
                  compact
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
            layoutVariant="technical"
            leftContent={
              <>
                {/* ─── VISHNU MOMENT (02:17 AM) — COMPACT TYPOGRAPHY ─── */}
                <div className="mb-2 p-2 rounded-lg bg-pink-500/[0.04] border border-pink-500/20 flex items-center justify-between text-xs">
                  <span className="text-[9.5px] font-mono text-pink-400 font-bold uppercase">02:17 AM HALL FLOOR:</span>
                  <span className="font-handwriting text-base text-pink-200">&ldquo;I think this is actually stupid... and that&apos;s why I kept building it.&rdquo;</span>
                </div>

                <ChapterHeader
                  chapter={CHAPTERS[8]}
                  accentClass="text-pink-400"
                  marginNote="04:30 AM: all the ridiculous pieces clicked"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[8].narrative} pullquoteIndex={3} maxParagraphs={2} />
                </div>

                {/* Candy Fruit Gallery - Compact Strip */}
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1 font-bold">
                    CANVAS SPRITE ARTIFACTS // 0.00 KB EXTERNAL ASSETS
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {[
                      { name: 'Apple', emoji: '🍎' },
                      { name: 'Orange', emoji: '🍊' },
                      { name: 'Grape', emoji: '🍇' },
                      { name: 'Berry', emoji: '🍓' },
                      { name: 'Melon', emoji: '🍉' },
                      { name: 'Cherry', emoji: '🍒' },
                    ].map((fruit, idx) => (
                      <div
                        key={idx}
                        className="rounded p-1.5 text-center bg-slate-950/80 border border-slate-800"
                      >
                        <div className="text-lg leading-none mb-0.5">{fruit.emoji}</div>
                        <div className="font-sans font-bold text-[9px] text-white truncate">{fruit.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Procedural Rendering Spec Slip */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-pink-500/20 text-xs font-mono space-y-1.5 mt-2.5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 text-[10px]">
                    <span className="text-pink-400 font-bold">PROCEDURAL RENDERING SPEC</span>
                    <span className="ink-stamp ink-stamp-pink text-[7px] py-0 px-1">0 KB SPRITES</span>
                  </div>
                  <div className="text-[10.5px] text-slate-300 font-sans leading-relaxed">
                    Instead of loading PNG textures, each candy fruit and snake segment is drawn dynamically using HTML5 Canvas radial gradients, specular highlights, and shadow blurs.
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800/60 text-[9px] text-slate-400 font-mono text-center">
                    <div>Radial Gradients: 100%</div>
                    <div>Image Assets: 0 KB</div>
                    <div>Render Overhead: &lt;1.2ms</div>
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Tech Stack Workbench */}
                <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950/90 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-slate-800 gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-sans font-bold text-xs text-white">Workbench Tools</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {TECH_STACK.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTechId(item.id)}
                          className={`px-1.5 py-0.2 rounded font-mono text-[9.5px] transition-colors cursor-pointer ${
                            activeTechId === item.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {item.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <div>
                      <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider">
                        {selectedTech.category}
                      </span>
                      <h3 className="text-sm font-sans font-bold text-white mt-0.2">{selectedTech.name}</h3>
                      <p className="text-[11px] font-mono text-slate-400">{selectedTech.role}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-sans">
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                        <span className="font-mono text-emerald-400 text-[8.5px] uppercase font-bold block mb-0.5">Why Chosen</span>
                        <p className="text-slate-300 leading-snug line-clamp-2">{selectedTech.whyChosen}</p>
                      </div>
                      <div className="p-2 rounded bg-rose-950/20 border border-rose-900/30">
                        <span className="font-mono text-rose-400 text-[8.5px] uppercase font-bold block mb-0.5">Quirk or Trap</span>
                        <p className="text-slate-300 leading-snug line-clamp-2">{selectedTech.quirkOrTrap}</p>
                      </div>
                    </div>

                    <div>
                      <pre className="terminal-block text-[10.5px] overflow-x-auto max-h-20 leading-tight">
                        <code>{selectedTech.codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <ScrapbookPlaceholder
                  compact
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
            layoutVariant="editorial"
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[9]}
                  accentClass="text-emerald-400"
                  marginNote="wearing every hat solo: CV, physics, audio, security, social media"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[9].narrative} highlightIndex={4} maxParagraphs={3} />
                </div>

                {/* Vishnu's Hackathon ID Card */}
                <div className="relative p-2.5 rounded-lg bg-slate-950/80 border border-emerald-500/30 shadow-xl">
                  <div className="masking-tape-strip -top-2 left-6" />
                  <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-800/80 pb-1">
                    <span className="ink-stamp ink-stamp-green text-[8px] py-0.2 px-1">SOLO BUILDER DOSSIER</span>
                    <span className="text-[9px] font-mono text-slate-500">UP 3.0 // 18H</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1 font-mono text-xs mb-1.5">
                    <div>
                      <span className="text-slate-500 text-[8.5px] block">BUILDER:</span>
                      <span className="text-emerald-300 font-bold text-[11px]">Vishnu K R</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[8.5px] block">COLLEGE:</span>
                      <span className="text-slate-300 text-[11px] truncate block">SNMIMT</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[8.5px] block">ROLE:</span>
                      <span className="text-pink-400 font-bold text-[11px]">Outreach</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {[
                      'MediaPipe WASM',
                      'Canvas 60FPS',
                      'Electron IPC',
                      'Web Audio',
                      'Vitest Suite'
                    ].map((hat, i) => (
                      <span key={i} className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[9px] font-mono text-slate-300">
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
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
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

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-mono font-bold text-cyan-300">{selectedEvolution.version}</span>
                        <span className="text-amber-300 text-[10.5px]">{selectedEvolution.time}</span>
                      </div>
                      <p className="text-slate-300 mt-0.5 font-sans text-[11px]">{selectedEvolution.architecturalShift}</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-[8.5px] text-emerald-400 uppercase font-bold block mb-0.5">Changelog Notes</span>
                      <ul className="space-y-0.5 text-slate-300 text-[10px]">
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
                  compact
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
            layoutVariant="notebook"
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[10]}
                  accentClass="text-rose-400"
                  marginNote="brilliant debugging Vishnu 👍"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[10].narrative} pullquoteIndex={0} maxParagraphs={3} />
                </div>

                {/* 03:45 AM Field Incident Card */}
                <div className="p-3 rounded-lg bg-slate-950/90 border border-rose-500/30 shadow-xl font-mono text-xs space-y-1.5 mt-3">
                  <div className="flex items-center justify-between border-b border-rose-500/20 pb-1 text-[10px]">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3" />
                      <span>INCIDENT LOG // 03:45 AM</span>
                    </span>
                    <span className="ink-stamp ink-stamp-amber text-[7px] py-0 px-1">HUMAN ERROR</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 font-sans">
                    <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                      <span className="font-mono text-slate-500 text-[8px] block">SYMPTOM</span>
                      Video stream 0 FPS. Frantic pinky waving for 15 mins.
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                      <span className="font-mono text-emerald-400 text-[8px] block">ROOT CAUSE</span>
                      Elbow nudged USB cable loose from laptop port.
                    </div>
                  </div>
                  <div className="pt-1 border-t border-slate-800 text-[9px] font-mono text-slate-400 text-center">
                    Resolution: Plugged back in. Tracking resumed immediately.
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Sticky Note: The Unplugged Webcam */}
                <div className="sticky-note sticky-note-pink max-w-md">
                  <div className="sticky-note-tape" />
                  <div className="text-[9px] font-mono text-rose-800 uppercase tracking-wider mb-1 font-sans">
                    // 03:45 AM Field Incident
                  </div>
                  <p className="text-sm text-slate-900 font-bold leading-snug">
                    &ldquo;I spent fifteen minutes frantically waving my pinky like an airline ground controller directing a plane on the tarmac... before realizing my elbow had unplugged the webcam.&rdquo;
                  </p>
                </div>

                <ScrapbookPlaceholder
                  compact
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
            layoutVariant="editorial"
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[11]}
                  accentClass="text-amber-400"
                  marginNote="sun rising. five hours left. everything must compile."
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[11].narrative} pullquoteIndex={0} maxParagraphs={3} />
                </div>

                {/* Morning countdown grid */}
                <div className="pt-1">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                    // SUNDAY MORNING COUNTDOWN SPRINT
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-mono">
                    {[
                      { time: '06:00 AM', text: 'Touch D-Pad fallback' },
                      { time: '07:30 AM', text: 'Web Audio oscillators' },
                      { time: '08:45 AM', text: 'Security test suites' },
                      { time: '09:30 AM', text: 'Game Over confetti' },
                      { time: '10:15 AM', text: 'Code freeze & build' },
                      { time: '10:45 AM', text: 'Submitted (15m left)' },
                    ].map((slot, i) => (
                      <div key={i} className="p-1.5 rounded bg-slate-950/80 border border-slate-800">
                        <div className="font-bold text-amber-400 text-[10.5px] leading-none mb-0.5">{slot.time}</div>
                        <div className="text-slate-300 font-sans text-[9.5px] leading-tight">{slot.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-3">
                {/* Interactive 18-Hour Milestone Navigator */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between gap-2 pb-1.5 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pink-400" />
                      <span className="font-sans font-bold text-xs text-white">18-Hour Milestone Log</span>
                    </div>
                    <span className="text-[9.5px] font-mono text-pink-400 font-bold px-1.5 py-0.2 rounded bg-pink-950/40 border border-pink-900/50">
                      MILESTONE {activeMilestoneIdx + 1} OF {TIMELINE_MILESTONES.length}
                    </span>
                  </div>

                  {/* Milestone time selector pills */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 mb-2.5">
                    {TIMELINE_MILESTONES.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMilestoneIdx(idx)}
                        className={`px-1 py-1 rounded text-center transition-all cursor-pointer ${
                          activeMilestoneIdx === idx
                            ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-600/40 ring-1 ring-pink-300'
                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        <div className="text-[9px] font-mono leading-none">{m.time.split(' ')[0]}</div>
                        <div className="text-[7.5px] font-mono uppercase opacity-75">{m.time.split(' ')[1]}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Milestone Card */}
                  {(() => {
                    const m = TIMELINE_MILESTONES[activeMilestoneIdx];
                    return (
                      <div className="space-y-1.5 font-sans">
                        <div className="flex items-baseline justify-between gap-1.5">
                          <h4 className="font-bold text-xs text-white">{m.title}</h4>
                          <span className="ink-stamp ink-stamp-amber text-[8.5px] shrink-0 py-0.2 px-1">
                            {m.time}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                            <span className="text-[8px] font-mono text-slate-500 uppercase font-bold block">Attempted Goal</span>
                            <p className="text-slate-300 font-sans leading-snug text-[10.5px]">{m.attempt}</p>
                          </div>

                          <div className="p-1.5 rounded bg-rose-950/25 border border-rose-900/30">
                            <span className="text-[8px] font-mono text-rose-400 uppercase font-bold block">Reality in the Room</span>
                            <p className="text-rose-200 font-sans leading-snug text-[10.5px]">{m.reality}</p>
                          </div>

                          <div className="p-1.5 rounded bg-emerald-950/25 border border-emerald-900/30">
                            <span className="text-[8px] font-mono text-emerald-400 uppercase font-bold block">Architectural Takeaway</span>
                            <p className="text-emerald-200 font-sans leading-snug text-[10.5px]">{m.lesson}</p>
                          </div>
                        </div>

                        {/* Prev / Next milestone nav buttons */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-xs font-mono">
                          <button
                            disabled={activeMilestoneIdx === 0}
                            onClick={() => setActiveMilestoneIdx((prev) => Math.max(0, prev - 1))}
                            className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed border border-slate-800 cursor-pointer text-[10px]"
                          >
                            ← Earlier
                          </button>
                          <span className="text-[9px] text-slate-500 italic truncate max-w-[170px]">
                            {m.visualEvidence}
                          </span>
                          <button
                            disabled={activeMilestoneIdx === TIMELINE_MILESTONES.length - 1}
                            onClick={() => setActiveMilestoneIdx((prev) => Math.min(TIMELINE_MILESTONES.length - 1, prev + 1))}
                            className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed border border-slate-800 cursor-pointer text-[10px]"
                          >
                            Later →
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* THE MORNING AFTER (10:45 AM) COMPACT DOSSIER */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 shadow-xl relative">
                  <div className="masking-tape-strip -top-2 left-6" />
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-2">
                    <span className="ink-stamp ink-stamp-green text-[8px] py-0.2 px-1">THE MORNING AFTER</span>
                    <span className="text-[9.5px] font-mono text-slate-400">10:45 AM · UP 3.0</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 font-mono text-center mb-1.5">
                    <div className="p-1 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-base font-bold text-white">18</div>
                      <div className="text-[7.5px] text-slate-500 uppercase">Hours</div>
                    </div>
                    <div className="p-1 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-base font-bold text-pink-400">1</div>
                      <div className="text-[7.5px] text-slate-500 uppercase">Project</div>
                    </div>
                    <div className="p-1 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-base font-bold text-amber-400">0</div>
                      <div className="text-[7.5px] text-slate-500 uppercase">Sleep</div>
                    </div>
                    <div className="p-1 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-base font-bold text-cyan-400">???</div>
                      <div className="text-[7.5px] text-slate-500 uppercase">Black Teas</div>
                    </div>
                  </div>

                  <div className="font-handwriting text-sm text-pink-300 text-center">
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
            layoutVariant="technical"
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[12]}
                  accentClass="text-pink-400"
                  marginNote="a snake. controlled by your pinky. eating real files."
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[12].narrative} pullquoteIndex={0} maxParagraphs={3} />
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

                {/* Gold Master Specification Dispatch Slip */}
                <div className="dispatch-tape-slip -rotate-0.5 mt-2 border-pink-500/30">
                  <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-pink-500/20 text-[10px] font-mono">
                    <span className="text-pink-400 font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>RUNTIME GOLD MASTER // SPEC SHEET</span>
                    </span>
                    <span className="ink-stamp ink-stamp-green text-[7px] py-0 px-1">PASSED</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center font-mono text-[9px]">
                    <div className="p-1 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block text-[7.5px]">ENGINE</span>
                      <span className="text-pink-300 font-bold">60 FPS Loop</span>
                    </div>
                    <div className="p-1 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block text-[7.5px]">TRACKER</span>
                      <span className="text-pink-300 font-bold">Landmark 20</span>
                    </div>
                    <div className="p-1 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block text-[7.5px]">SAFETY</span>
                      <span className="text-emerald-300 font-bold">Trash Recoverable</span>
                    </div>
                    <div className="p-1 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block text-[7.5px]">SYNTHESIZER</span>
                      <span className="text-cyan-300 font-bold">4 Waveforms</span>
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
                        className="group p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-pink-500/50 transition-all duration-300 cursor-pointer journal-photo-hover"
                      >
                        <div className="relative aspect-[16/10] max-h-[85px] bg-slate-900 rounded img-zoom-on-hover mb-1">
                          <img
                            src={item.src}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-1 right-1 p-0.5 rounded bg-slate-950/80 text-slate-300 scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Maximize2 className="w-3 h-3" />
                          </div>
                          <div className="absolute bottom-1 left-1">
                            <span className="px-1 py-0.5 rounded text-[8px] font-mono font-bold bg-slate-950/90 text-pink-300 border border-pink-500/30">
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
            layoutVariant="technical"
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
            layoutVariant="notebook"
            leftContent={
              <>
                <ChapterHeader
                  chapter={CHAPTERS[14]}
                  accentClass="text-emerald-400"
                  marginNote="three things that stayed with me after the event"
                />
                <div className="book-drop-cap">
                  <EditorialProse narratives={CHAPTERS[14].narrative} highlightIndex={1} maxParagraphs={3} />
                </div>

                {/* Sticky Note: The Core Realization */}
                <div className="sticky-note sticky-note-yellow max-w-md">
                  <div className="sticky-note-tape" />
                  <div className="text-[9px] font-mono text-amber-900 uppercase tracking-wider mb-0.5 font-bold">
                    // VISHNU'S CORE TAKEAWAY
                  </div>
                  <p className="text-sm text-slate-900 font-bold leading-snug">
                    &ldquo;The person who was supposed to document everyone else ended up having the most to document.&rdquo;
                  </p>
                  <div className="mt-1.5 text-right font-mono text-[10px] text-amber-900">
                    — 10:45 AM Sunday morning
                  </div>
                </div>
              </>
            }
            rightContent={
              <div className="space-y-2.5">
                <div className="space-y-1.5">
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
                    <div key={idx} className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2">
                      <span className={`ink-stamp ${truth.color} shrink-0 text-[8px] py-0.2 px-1`}>
                        {truth.stamp}
                      </span>
                      <div>
                        <h4 className="font-sans font-bold text-xs text-white mb-0.5">{truth.title}</h4>
                        <p className="text-[10.5px] text-slate-300 font-sans leading-snug">{truth.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <ScrapbookPlaceholder
                  compact
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
            layoutVariant="editorial"
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
          <div className="mt-6 rounded-2xl bg-slate-950/95 border border-slate-800/60 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Reading Progress Indicator — thinner, sharper */}
            <div className="h-[2px] bg-slate-900 w-full relative overflow-hidden">
              <div
                className="h-full transition-all duration-700 ease-out"
                style={{
                  width: `${((spreadIndex + 1) / sectionIds.length) * 100}%`,
                  background: 'linear-gradient(90deg, #be185d 0%, #ec4899 50%, #ffba00 100%)',
                  boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)',
                }}
              />
            </div>

            <div className="flex items-stretch min-h-[56px]">
              {/* Prev Button */}
              <button
                type="button"
                onClick={goToPrevSpread}
                disabled={spreadIndex === 0}
                className={`px-5 sm:px-6 py-3 flex items-center gap-2 font-mono text-xs font-bold transition-all duration-150 cursor-pointer border-r border-slate-800/60 shrink-0 ${
                  spreadIndex === 0
                    ? 'opacity-20 cursor-not-allowed text-slate-600'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60 active:bg-slate-900'
                }`}
                title="Previous spread (← arrow key)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline tracking-widest">PREV</span>
              </button>

              {/* Center: Chapter label + dot progress + keyboard hints */}
              <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-2.5 px-3 sm:px-4 min-w-0">
                {/* Chapter indicator — the main improvement */}
                <div className="flex items-center gap-2 min-w-0 max-w-full">
                  <span className="font-mono text-[9.5px] font-bold text-pink-500 uppercase tracking-[0.18em] shrink-0">
                    {currentSpreadInfo.chapter}
                  </span>
                  {currentSpreadInfo.title && (
                    <>
                      <span className="text-slate-700 shrink-0 hidden sm:inline">—</span>
                      <span className="font-sans text-[10.5px] text-slate-400 truncate hidden sm:block">
                        {currentSpreadInfo.title}
                      </span>
                    </>
                  )}
                </div>

                {/* Dot progress indicator */}
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {sectionIds.map((_, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleSelectSection(sectionIds[idx])}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        idx === spreadIndex
                          ? 'w-5 h-[5px] bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.7)]'
                          : idx < spreadIndex
                          ? 'w-[5px] h-[5px] bg-pink-800/60 hover:bg-pink-500/60'
                          : 'w-[5px] h-[5px] bg-slate-800 hover:bg-slate-600'
                      }`}
                      title={`${idx + 1}: ${getSpreadLabel(idx).chapter}`}
                    />
                  ))}
                </div>

                {/* Keyboard hints + page counter */}
                <div className="font-mono text-[9px] text-slate-600 tracking-widest flex items-center justify-center gap-1.5">
                  <span className="text-slate-500 font-semibold">{String(spreadIndex + 1).padStart(2, '0')}</span>
                  <span>/</span>
                  <span>{sectionIds.length}</span>
                  <span className="text-slate-700 hidden sm:inline">·</span>
                  <span className="hidden sm:inline-flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 text-[8px] font-mono">←</kbd>
                    <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 text-[8px] font-mono">→</kbd>
                    <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 text-[8px] font-mono">Space</kbd>
                    <span className="text-slate-600 ml-0.5">to flip</span>
                  </span>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={goToNextSpread}
                disabled={spreadIndex >= sectionIds.length - 1}
                className={`px-5 sm:px-6 py-3 flex items-center gap-2 font-mono text-xs font-bold transition-all duration-150 cursor-pointer border-l border-slate-800/60 shrink-0 ${
                  spreadIndex >= sectionIds.length - 1
                    ? 'opacity-20 cursor-not-allowed text-slate-600'
                    : 'bg-pink-600/10 text-pink-400 hover:bg-pink-600/20 hover:text-pink-300 active:bg-pink-600/30'
                }`}
                title="Next spread (→ arrow key or Space)"
              >
                <span className="hidden sm:inline tracking-widest">NEXT</span>
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-pink-300 font-mono text-xs font-bold px-4 py-2 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.8)] border border-pink-500/40 flex items-center gap-2 animate-bounce-gentle">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Keyboard Shortcuts Dossier Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
