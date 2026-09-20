import React from 'react';
import { Terminal, Hand, Users, Bug, Laptop, Clock, Coffee } from 'lucide-react';

interface ScrapbookPlaceholderProps {
  tag: string;
  caption?: string;
  evidenceUrl?: string;
  badgeType?: string;
  isVerified?: boolean;
  rotate?: 'cw' | 'ccw' | 'none';
  imgSrc?: string;
  compact?: boolean;
  className?: string;
}

export const ScrapbookPlaceholder: React.FC<ScrapbookPlaceholderProps> = ({
  tag,
  caption,
  evidenceUrl,
  rotate = 'cw',
  imgSrc,
  compact = false,
  className = '',
}) => {
  const rotateClass = rotate === 'cw' ? 'rotate-1' : rotate === 'ccw' ? '-rotate-1' : '';

  // Determine if this should show a real screenshot
  const lowerTag = tag.toLowerCase();
  let resolvedImage = imgSrc;
  if (!resolvedImage) {
    if (lowerTag.includes('gameplay') || lowerTag.includes('hud') || lowerTag.includes('landmark') || lowerTag.includes('prototype') || lowerTag.includes('v0.1') || lowerTag.includes('lime')) {
      resolvedImage = './screenshots/gameplay.png';
    } else if (lowerTag.includes('gameover') || lowerTag.includes('game over') || lowerTag.includes('recycle bin')) {
      resolvedImage = './screenshots/gameover.png';
    } else if (lowerTag.includes('settings') || lowerTag.includes('sensitivity')) {
      resolvedImage = './screenshots/settings.png';
    } else if (lowerTag.includes('banner') || lowerTag.includes('poster')) {
      resolvedImage = './images/danger_pinky_banner.png';
    } else if (lowerTag.includes('teams') || lowerTag.includes('opening') || lowerTag.includes('event') || lowerTag.includes('floor') || lowerTag.includes('hall') || lowerTag.includes('setting up')) {
      resolvedImage = './images/tinkerhub_event_group.jpg';
    } else if (lowerTag.includes('closing') || lowerTag.includes('letter') || lowerTag.includes('coordinator')) {
      resolvedImage = './images/useless_3_closing.png';
    } else if (lowerTag.includes('thank') || lowerTag.includes('wrap') || lowerTag.includes('reflection') || lowerTag.includes('morning sun')) {
      resolvedImage = './images/useless_3_thankyou.png';
    } else if (lowerTag.includes('ui') || lowerTag.includes('dashboard') || lowerTag.includes('landing')) {
      resolvedImage = './screenshots/landing.png';
    }
  }

  const isNapkinSketch = lowerTag.includes('sketch') || lowerTag.includes('napkin') || lowerTag.includes('diagram');
  const isTerminalArtifact = lowerTag.includes('terminal') || lowerTag.includes('test') || lowerTag.includes('ipc') || lowerTag.includes('vitest') || lowerTag.includes('build log');
  const isBugArtifact = lowerTag.includes('bug') || lowerTag.includes('suicide') || lowerTag.includes('180') || lowerTag.includes('crash');
  const isCoffeeMoment = lowerTag.includes('coffee') || /\b(tea|chai)\b/i.test(lowerTag);
  const isVenueSetup = lowerTag.includes('teams') || lowerTag.includes('opening') || lowerTag.includes('floor') || lowerTag.includes('setting up');
  const isWorkstation = lowerTag.includes('workstation') || lowerTag.includes('cables') || lowerTag.includes('3 am');

  const cleanLabel = tag.replace(/^\[ADD (PHOTO|SCREENSHOT|SKETCH|TERMINAL LOG|BUG SCREENSHOT):\s*/i, '').replace(/\]$/, '');

  // 1. REAL SCREENSHOT / PHOTOGRAPH
  if (resolvedImage) {
    const photoContent = (
      <div className={`inline-block w-full max-w-full p-0.5 transition-all duration-300 hover:scale-[1.015] hover:rotate-0 hover:shadow-2xl ${rotateClass} ${className}`}>
        <div
          className={`${compact ? 'p-2 pb-3' : 'p-2.5 pb-4'} bg-white relative rounded-sm shadow-xl`}
          style={{
            boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.08)',
          }}
        >
          {/* Subtle Masking Tape */}
          <div
            className="absolute -top-2.5 left-6 w-10 h-4 opacity-80 z-10"
            style={{
              background: 'rgba(254, 240, 138, 0.65)',
              borderLeft: '1.5px dashed rgba(0,0,0,0.12)',
              borderRight: '1.5px dashed rgba(0,0,0,0.12)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transform: rotate === 'cw' ? 'rotate(-4deg)' : 'rotate(3deg)',
            }}
          />

          <div className={`w-full bg-slate-950 border border-slate-800/80 relative overflow-hidden flex items-center justify-center ${
            compact ? 'aspect-[16/9] max-h-[160px]' : 'aspect-[16/10] max-h-[210px]'
          }`}>
            <img
              src={resolvedImage}
              alt={caption || cleanLabel}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className={`${compact ? 'mt-1.5 px-1' : 'mt-2 px-1.5'} flex items-start justify-between gap-2`}>
            {caption && (
              <p className="font-handwriting text-slate-700 text-xs sm:text-[13px] leading-snug tracking-wide flex-1">
                {caption}
              </p>
            )}
            <span className="font-mono text-[8px] text-slate-400/80 shrink-0 mt-0.5 text-right">
              12 SEPT 2026
            </span>
          </div>
        </div>
      </div>
    );

    const targetUrl = evidenceUrl || resolvedImage;
    return targetUrl ? (
      <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer" title="Click to view full image">
        {photoContent}
      </a>
    ) : (
      <div>{photoContent}</div>
    );
  }

  // 2. HAND-DRAWN NAPKIN SKETCH ON GRAPH PAPER
  if (isNapkinSketch) {
    return (
      <div className={`field-schematic ${rotateClass} ${className} shadow-xl`}>
        <div className="flex items-center justify-between text-pink-400 border-b border-white/10 pb-1.5 mb-2 text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            <span>NAPKIN SCRATCHPAD // 12:30 AM</span>
          </span>
          <span className="text-slate-400 font-mono text-[9px]">P20 ➔ P17 VECTOR</span>
        </div>

        <div className="py-2.5 flex items-center justify-around text-center">
          <div className="p-2 rounded border border-dashed border-pink-500/40 bg-pink-500/[0.07]">
            <Hand className="w-5 h-5 text-pink-400 mx-auto mb-1" />
            <span className="text-[9px] font-mono font-bold text-pink-300 block">PINKY</span>
            <span className="text-[8px] font-mono text-slate-400">P20 Tip</span>
          </div>
          <span className="text-amber-400 font-bold text-base">➔</span>
          <div className="p-2 rounded border border-dashed border-emerald-500/40 bg-emerald-500/[0.07]">
            <div className="text-base mb-0.5">🐍</div>
            <span className="text-[9px] font-mono font-bold text-emerald-300 block">SNAKE</span>
            <span className="text-[8px] font-mono text-slate-400">Canvas 60FPS</span>
          </div>
          <span className="text-amber-400 font-bold text-base">➔</span>
          <div className="p-2 rounded border border-dashed border-rose-500/40 bg-rose-500/[0.07]">
            <div className="text-base mb-0.5">🗑️</div>
            <span className="text-[9px] font-mono font-bold text-rose-300 block">RECYCLE</span>
            <span className="text-[8px] font-mono text-slate-400">shell.trashItem</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <p className="font-handwriting text-pink-300 text-sm leading-tight">
            &ldquo;{caption || 'The napkin equation that changed everything.'}&rdquo;
          </p>
          <span className="font-mono text-[8px] text-slate-500 shrink-0">12:30 IST</span>
        </div>
      </div>
    );
  }

  // 3. THERMAL TERMINAL RECEIPT (Code, Tests, Commits)
  if (isTerminalArtifact) {
    return (
      <div className={`thermal-receipt ${rotateClass} ${className}`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 text-[10px] text-emerald-400">
          <span className="flex items-center gap-1.5 font-bold">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>VITEST VERIFICATION RECEIPT</span>
          </span>
          <span className="text-slate-500 text-[9px]">PASS · 10:15 AM</span>
        </div>
        <div className="space-y-1 text-[10.5px] text-slate-300 font-mono py-1">
          <div className="flex justify-between"><span>✓ src/game/gameEngine.test.ts</span><span className="text-emerald-400">13 pass</span></div>
          <div className="flex justify-between"><span>✓ src/game/pinkyTracking.test.ts</span><span className="text-emerald-400">10 pass</span></div>
          <div className="flex justify-between"><span>✓ src/game/filesystem.test.ts</span><span className="text-emerald-400">6 pass</span></div>
          <div className="flex justify-between"><span>✓ src/game/securityValidator.test.ts</span><span className="text-emerald-400">7 pass</span></div>
          <div className="flex justify-between font-bold text-pink-300 pt-1 border-t border-slate-800">
            <span>TOTAL TEST RUN</span>
            <span>39 PASSED · 412ms</span>
          </div>
        </div>
        <div className="mt-2 text-[9px] text-slate-500 font-mono text-center">
          # FREEZE COMMIT // v1.0 CANDY ENGINE VERIFIED
        </div>
      </div>
    );
  }

  // 4. CRASH FORENSICS MEMO
  if (isBugArtifact) {
    return (
      <div className={`dispatch-tape-slip ${rotateClass} ${className} border-rose-500/30`}>
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-1.5 mb-2">
          <span className="flex items-center gap-1.5 text-rose-400 font-mono font-bold text-[10.5px]">
            <Bug className="w-3.5 h-3.5 text-rose-400" />
            <span>INCIDENT AUTOPSY // 03:15 AM</span>
          </span>
          <span className="ink-stamp ink-stamp-red text-[7.5px] py-0.2 px-1">FATAL 180°</span>
        </div>
        <div className="space-y-1.5 text-[11px] font-mono text-slate-300 py-1">
          <div className="p-2 rounded bg-rose-950/30 border border-rose-900/30">
            <span className="text-rose-400 font-bold block text-[9.5px]">SYMPTOM:</span>
            <p className="text-slate-300 font-sans leading-snug">
              Instant suicide turn. Pinky flicked left while head moving right; frame queue inverted direction before body advanced, causing head to bite neck segment 1.
            </p>
          </div>

          {/* Forensic Vector Collision Trace Diagram */}
          <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[9.5px]">
            <div className="flex items-center justify-between text-slate-400 mb-1 border-b border-slate-800 pb-0.5">
              <span>FORENSIC FRAME TRACE</span>
              <span className="text-rose-400">COLLISION AT t=42ms</span>
            </div>
            <div className="flex items-center justify-around py-1 text-center">
              <div className="p-1 rounded bg-rose-500/10 border border-rose-500/40">
                <span className="text-[8px] text-slate-400 block">HEAD</span>
                <span className="text-rose-400 font-bold">[X: 4, Y: 2]</span>
                <span className="text-[7.5px] text-pink-300 block">DIR: LEFT ⬅</span>
              </div>
              <div className="text-rose-500 font-bold text-xs animate-pulse">💥 BITE</div>
              <div className="p-1 rounded bg-slate-900 border border-slate-700">
                <span className="text-[8px] text-slate-400 block">SEGMENT 1</span>
                <span className="text-slate-200 font-bold">[X: 3, Y: 2]</span>
                <span className="text-[7.5px] text-slate-400 block">NECK SEGMENT</span>
              </div>
            </div>
            <div className="text-[8.5px] text-amber-300 text-center pt-0.5 border-t border-slate-800/80">
              <code>if (nextDir.x === -currDir.x) return; // Mutex Drop</code>
            </div>
          </div>

          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-emerald-400 font-bold block text-[9.5px]">PATCH APPLIED:</span>
            <p className="text-slate-300 font-sans leading-snug">
              1-Tick Direction Mutex Buffer in <code className="text-pink-300">GameEngine.ts</code> prevents opposite inputs until next game tick commits.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 5. TEA STALL / COFFEE VIGNETTE
  if (isCoffeeMoment) {
    return (
      <div className={`dispatch-tape-slip ${rotateClass} ${className} border-amber-500/30`}>
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5 mb-2">
          <span className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[10px]">
            <Coffee className="w-3.5 h-3.5" />
            <span>TEA STALL MEMO // 00:14 IST</span>
          </span>
          <span className="text-slate-500 font-mono text-[9px]">SNMIMT CAMPUS GATE</span>
        </div>
        <div className="py-2 text-center space-y-1">
          <p className="font-handwriting text-lg text-amber-200 leading-snug">
            &ldquo;No photo. Just black tea, tired laughs, and someone saying: that sounds completely useless.&rdquo;
          </p>
          <span className="font-mono text-[9.5px] text-emerald-400 font-semibold block">
            ↳ &ldquo;Perfect. That&rsquo;s literally the name of the hackathon.&rdquo;
          </span>
        </div>
        <div className="pt-1.5 border-t border-slate-800/80 flex justify-between items-center text-[9px] font-mono text-slate-500">
          <span>TinkerHub Night Crew</span>
          <span className="ink-stamp ink-stamp-amber text-[7.5px] py-0.2 px-1">INCITING INCIDENT</span>
        </div>
      </div>
    );
  }

  // 6. VENUE SETUP / TEAMS STARTING
  if (isVenueSetup) {
    return (
      <div className={`dispatch-tape-slip ${rotateClass} ${className} border-cyan-500/30`}>
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-2">
          <span className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-[10px]">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>VENUE KICKOFF // 05:00 PM</span>
          </span>
          <span className="text-slate-500 font-mono text-[9px]">SNMIMT AUDITORIUM</span>
        </div>
        <div className="py-2 text-center space-y-1">
          <p className="font-handwriting text-base text-cyan-100 leading-snug">
            &ldquo;{caption || 'Keyboards clicking, whiteboards full of flowchart ideas, teams laughing. Everyone has a mission.'}&rdquo;
          </p>
        </div>
        <div className="pt-1.5 border-t border-slate-800/80 flex justify-between items-center text-[9px] font-mono text-slate-500">
          <span>TinkerHub UP 3.0 Floor</span>
          <span className="text-cyan-400 font-mono text-[9px]">40 DEVELOPERS</span>
        </div>
      </div>
    );
  }

  // 7. 3 AM WORKSTATION REALITY
  if (isWorkstation) {
    return (
      <div className={`dispatch-tape-slip ${rotateClass} ${className} border-purple-500/30`}>
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-1.5 mb-2">
          <span className="flex items-center gap-1.5 text-purple-400 font-mono font-bold text-[10px]">
            <Laptop className="w-3.5 h-3.5 text-purple-400" />
            <span>WORKBENCH REALITY // 03:45 AM</span>
          </span>
          <span className="text-slate-500 font-mono text-[9px]">HALLWAY FLOOR</span>
        </div>
        <div className="py-2 text-center space-y-1">
          <p className="font-handwriting text-base text-purple-200 leading-snug">
            &ldquo;{caption || 'Empty black tea cups, tangled cables, and the unplugged webcam panic.'}&rdquo;
          </p>
        </div>
        <div className="pt-1.5 border-t border-slate-800/80 flex justify-between items-center text-[9px] font-mono text-slate-500">
          <span>Solo Builder Station</span>
          <span className="text-purple-400 font-mono text-[9px]">0 HOURS SLEEP</span>
        </div>
      </div>
    );
  }

  // 6. GENERAL FIELD DISPATCH MEMO (Default for non-photo moments)
  return (
    <div className={`dispatch-tape-slip ${rotateClass} ${className}`}>
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
        <span className="flex items-center gap-1.5 text-pink-400 font-mono font-bold text-[10px]">
          <Clock className="w-3.5 h-3.5" />
          <span>FIELD DISPATCH // SNMIMT</span>
        </span>
        <span className="text-slate-500 font-mono text-[9px]">LOG RECORD</span>
      </div>
      <div className="py-1.5 space-y-1">
        <h5 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
          {cleanLabel}
        </h5>
        <p className="font-handwriting text-sm text-pink-300/90 leading-snug">
          &ldquo;{caption || 'Documenting everyone else while having no code of my own.'}&rdquo;
        </p>
      </div>
      <div className="pt-1.5 border-t border-slate-800/80 flex justify-between items-center text-[9px] font-mono text-slate-500">
        <span>TinkerHub UP 3.0 Outreach Record</span>
        <span className="text-pink-400 font-mono font-semibold">11–12 SEPT 2026</span>
      </div>
    </div>
  );
};
