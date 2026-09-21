import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Play, ChevronDown, CheckCircle2, Circle, BookOpen, Scroll, Sun, Moon, ChevronLeft, ChevronRight, ArrowLeft, Share2, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { CHAPTERS, HERO_DATA, PROLOGUE_DATA, FINAL_REFLECTION } from '../../data/journalChapters';

interface ChapterNavProps {
  activeSection: string;
  onSelectSection?: (sectionId: string) => void;
  onPlayDemo?: () => void;
  onBackToLanding?: () => void;
  viewMode?: 'spread' | 'scroll';
  onToggleViewMode?: () => void;
  paperTone?: 'dark' | 'cream';
  onTogglePaperTone?: () => void;
  isSoundMuted?: boolean;
  onToggleSound?: () => void;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  currentPage?: number;
  totalPages?: number;
  canPrev?: boolean;
  canNext?: boolean;
  onShare?: () => void;
  onOpenShortcuts?: () => void;
  spreadProgress?: number;
  journeyMode?: boolean;
  onToggleJourneyMode?: () => void;
}

interface NavItem {
  id: string;
  shortLabel: string;
  fullTitle: string;
  tag: string;
}

const MACRO_PHASES = [
  { id: 'prologue', num: '00', name: 'Prologue', label: '00 Prologue', target: 'prologue', match: ['hero', 'prologue'] },
  { id: 'nothing', num: '01', name: 'Nothing', label: '01 Nothing', target: 'chapter-01', match: ['chapter-01', 'chapter-02'] },
  { id: 'coffee', num: '02', name: 'Coffee', label: '02 Coffee', target: 'chapter-03', match: ['chapter-03', 'chapter-04'] },
  { id: 'build', num: '03', name: 'Build', label: '03 Build', target: 'chapter-05', match: ['chapter-05', 'chapter-06', 'chapter-07'] },
  { id: 'chaos', num: '04', name: 'Chaos', label: '04 Chaos', target: 'chapter-08', match: ['chapter-08', 'chapter-09', 'chapter-10', 'chapter-11'] },
  { id: 'finish', num: '05', name: 'Finish', label: '05 Finish', target: 'chapter-12', match: ['chapter-12', 'chapter-13', 'chapter-14'] },
  { id: 'aftermath', num: '06', name: 'Aftermath', label: '06 Aftermath', target: 'closing', match: ['chapter-15', 'chapter-16', 'closing'] },
];

export const ChapterNav: React.FC<ChapterNavProps> = ({
  activeSection,
  onSelectSection,
  onPlayDemo,
  onBackToLanding,
  viewMode = 'spread',
  onToggleViewMode,
  paperTone = 'dark',
  onTogglePaperTone,
  isSoundMuted = false,
  onToggleSound,
  onPrevPage,
  onNextPage,
  currentPage,
  totalPages,
  canPrev,
  canNext,
  onShare,
  onOpenShortcuts,
  spreadProgress,
  journeyMode = false,
  onToggleJourneyMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        setScrolled(scrollY > 80);

        // Calculate reading progress
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;
        setReadingProgress(progress);
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const navItems: NavItem[] = [
    {
      id: HERO_DATA.id,
      shortLabel: 'Hero',
      fullTitle: 'The Making of DangerPinky',
      tag: 'OVERVIEW'
    },
    {
      id: PROLOGUE_DATA.id,
      shortLabel: '00. PROLOGUE',
      fullTitle: PROLOGUE_DATA.title,
      tag: PROLOGUE_DATA.tag
    },
    ...CHAPTERS.map((ch) => ({
      id: ch.id,
      shortLabel: `${ch.number}. ${ch.tag}`,
      fullTitle: ch.title,
      tag: ch.tag
    })),
    {
      id: FINAL_REFLECTION.id,
      shortLabel: 'Epilogue',
      fullTitle: FINAL_REFLECTION.title,
      tag: FINAL_REFLECTION.tag
    }
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onSelectSection) {
      onSelectSection(id);
    }
    if (viewMode === 'scroll') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const activePhase = MACRO_PHASES.find((p) => p.match.includes(activeSection)) || MACRO_PHASES[0];
  const activeIndex = navItems.findIndex((item) => item.id === activeSection);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-2xl bg-[#070b14]/94 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
          : 'backdrop-blur-lg bg-[#070b14]/80'
      }`}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4" style={{ height: scrolled ? '52px' : '60px', transition: 'height 0.3s ease' }}>

        {/* Left: Back to Game & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
              title="Return to DangerPinky Game Hub"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline font-bold">Game Hub</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick(HERO_DATA.id)}
            className="flex items-center gap-2.5 shrink-0 group cursor-pointer focus:outline-none"
            title="Logbook Cover"
          >
            <div
              className="w-7 h-7 rounded bg-pink-600 flex items-center justify-center text-xs font-mono font-bold text-white shadow-sm group-hover:bg-pink-500 transition-colors"
            >
              VK
            </div>
            <div className="text-left">
              <div className="font-mono font-bold text-xs tracking-wider text-white group-hover:text-pink-300 transition-colors flex items-center gap-2">
                <span>VISHNU K R</span>
                <span className="hidden sm:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  FIELD NOTES
                </span>
              </div>
              {!scrolled && (
                <div className="text-[10px] font-mono text-slate-500 hidden 2xl:block transition-all">
                  TinkerHub UP 3.0 · 18-Hour Sprint
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Center: Clean 7 Macro Phases (Adaptive Accordion Pills) */}
        <nav className="hidden md:flex items-center gap-1 shrink-0 py-1 px-1">
          {MACRO_PHASES.map((phase) => {
            const isActive = phase.id === activePhase.id;
            const isPillarPhase = ['prologue', 'coffee', 'build', 'finish'].includes(phase.id);
            const journeyRing = journeyMode && isPillarPhase ? 'ring-1 ring-amber-400/60' : '';
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => handleNavClick(phase.target)}
                title={`Chapters: ${phase.match.join(', ')}`}
                className={`shrink-0 whitespace-nowrap px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${journeyRing} ${
                  isActive
                    ? 'bg-pink-500/15 text-pink-300 font-bold border border-pink-500/40 shadow-[0_0_12px_rgba(236,72,153,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse shrink-0" />}
                <span className="font-semibold">{phase.num}</span>
                <span className={isActive ? 'inline' : 'hidden xl:inline'}>{phase.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Spread Page Turn Controls (when in spread mode) */}
          {viewMode === 'spread' && onPrevPage && onNextPage && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg px-1 py-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={onPrevPage}
                disabled={!canPrev}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Previous Spread (Left Arrow)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[11px] text-slate-400 font-bold whitespace-nowrap">
                {currentPage && totalPages ? `${currentPage}/${totalPages}` : 'SPREAD'}
              </span>
              <button
                type="button"
                onClick={onNextPage}
                disabled={!canNext}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Next Spread (Right Arrow)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Book View Mode Switcher (Spread vs Continuous Scroll) */}
          {onToggleViewMode && (
            <button
              onClick={onToggleViewMode}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-pink-500/50 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title={viewMode === 'spread' ? 'Switch to Continuous Scroll View' : 'Switch to Two-Page Book Spread View'}
            >
              {viewMode === 'spread' ? (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-pink-400" />
                  <span className="hidden xl:inline text-[11px]">SPREAD</span>
                </>
              ) : (
                <>
                  <Scroll className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xl:inline text-[11px]">SCROLL</span>
                </>
              )}
            </button>
          )}

          {/* Paper Tone Toggle */}
          {onTogglePaperTone && (
            <button
              onClick={onTogglePaperTone}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              title={paperTone === 'cream' ? 'Switch to Dark Archival Paper' : 'Switch to Vintage Cream Paper'}
            >
              {paperTone === 'cream' ? (
                <Moon className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              )}
            </button>
          )}

          {/* Sound Toggle (Paper Turn Audio) */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className={`hidden sm:flex p-1.5 rounded-lg bg-slate-900 border text-xs font-mono transition-colors cursor-pointer ${
                isSoundMuted
                  ? 'border-slate-800 text-slate-500 hover:text-slate-300'
                  : 'border-pink-500/40 text-pink-400 hover:text-pink-300 hover:border-pink-500/60 shadow-[0_0_8px_rgba(236,72,153,0.2)]'
              }`}
              title={isSoundMuted ? 'Turn Sound On (Paper Page Audio)' : 'Mute Sound (Paper Page Audio)'}
            >
              {isSoundMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Share Action */}
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="hidden sm:flex p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-pink-500/50 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              title="Share Devlog (or Copy Link)"
            >
              <Share2 className="w-3.5 h-3.5 text-pink-400" />
            </button>
          )}

          {/* Keyboard Shortcuts Dossier */}
          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="hidden lg:flex p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              title="Keyboard Shortcuts Manual (?)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}

          {/* Mobile current section indicator */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-pink-300 hover:bg-slate-800 cursor-pointer transition-colors"
            aria-label="Toggle Chapter Navigation Menu"
          >
            <span className="truncate max-w-[80px]">{activePhase.label}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 5-Min Fast Track Toggle */}
          {onToggleJourneyMode && (
            <button
              type="button"
              onClick={onToggleJourneyMode}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                journeyMode
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                  : 'bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500/50'
              }`}
              title={journeyMode ? 'Exit 5-Minute Fast Track' : 'Start 5-Minute 6-Pillar Fast Track'}
            >
              <span>5-MIN</span>
              <span>⚡</span>
            </button>
          )}

          {/* Play button */}
          <button
            onClick={onPlayDemo ? onPlayDemo : () => handleNavClick('chapter-14')}
            className="px-3 py-1.5 rounded bg-pink-600 hover:bg-pink-500 font-mono font-bold text-xs text-white flex items-center gap-1 cursor-pointer shadow transition-colors journal-play-glow"
          >
            <Play className="w-3 h-3 fill-white" />
            <span className="hidden sm:inline">PLAY</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-300 hover:text-white cursor-pointer transition-colors"
            aria-label="Toggle Chapters Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reading progress bar at bottom of header */}
      <div
        className="reading-progress-bar"
        style={{
          width: `${viewMode === 'spread' && spreadProgress !== undefined ? spreadProgress : readingProgress}%`,
          background: 'linear-gradient(90deg, #be185d 0%, #ec4899 50%, #ffba00 100%)',
          boxShadow: (viewMode === 'spread' && spreadProgress !== undefined ? spreadProgress : readingProgress) > 5 ? '0 0 6px rgba(236, 72, 153, 0.6)' : 'none',
        }}
      />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/60 bg-[#070b14]/97 backdrop-blur-2xl px-4 py-4 max-h-[72vh] overflow-y-auto shadow-2xl">
          <div className="text-[10px] font-mono font-bold text-pink-400/70 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span>Chapter Index — {navItems.length} Sections</span>
            <span className="text-slate-600">jump to section</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navItems.map((item, idx) => {
              const isActive = activeSection === item.id;
              const isPast = idx < activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-pink-500/15 border border-pink-500/40 text-pink-200 font-bold'
                      : isPast
                      ? 'bg-slate-950/60 border border-slate-800/50 text-slate-500'
                      : 'bg-slate-900/50 border border-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {isPast && !isActive ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500/60 shrink-0" />
                    ) : isActive ? (
                      <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse shrink-0" />
                    ) : (
                      <Circle className="w-3 h-3 text-slate-700 shrink-0" />
                    )}
                    <span className="truncate">{item.fullTitle}</span>
                  </span>
                  <span className="text-[9px] text-pink-400/60 shrink-0 font-semibold uppercase tracking-wider">
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Utilities */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            {onToggleSound && (
              <button
                type="button"
                onClick={onToggleSound}
                className={`py-2 px-3 rounded-lg border font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSoundMuted
                    ? 'bg-slate-900 border-slate-800 text-slate-400'
                    : 'bg-pink-500/10 border-pink-500/30 text-pink-300'
                }`}
              >
                {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-pink-400" />}
                <span>{isSoundMuted ? 'Muted' : 'Audio On'}</span>
              </button>
            )}
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="flex-1 py-2 px-3 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Share</span>
              </button>
            )}
            {onOpenShortcuts && (
              <button
                type="button"
                onClick={onOpenShortcuts}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Shortcuts</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
