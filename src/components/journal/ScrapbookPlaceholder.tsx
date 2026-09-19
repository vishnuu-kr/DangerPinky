import React from 'react';
import { Camera, Coffee, Terminal, Hand } from 'lucide-react';

interface ScrapbookPlaceholderProps {
  tag: string;
  caption?: string;
  evidenceUrl?: string;
  badgeType?: string;
  isVerified?: boolean;
  rotate?: 'cw' | 'ccw' | 'none';
  imgSrc?: string;
}

export const ScrapbookPlaceholder: React.FC<ScrapbookPlaceholderProps> = ({
  tag,
  caption,
  evidenceUrl,
  rotate = 'cw',
  imgSrc,
}) => {
  const rotateClass = rotate === 'cw' ? 'rotate-1' : rotate === 'ccw' ? '-rotate-1' : '';

  // Determine if this should show a real screenshot
  const lowerTag = tag.toLowerCase();
  let resolvedImage = imgSrc;
  if (!resolvedImage) {
    if (lowerTag.includes('gameplay') || lowerTag.includes('hud') || lowerTag.includes('landmark')) {
      resolvedImage = './screenshots/gameplay.png';
    } else if (lowerTag.includes('gameover') || lowerTag.includes('game over') || lowerTag.includes('recycle bin')) {
      resolvedImage = './screenshots/gameover.png';
    } else if (lowerTag.includes('settings') || lowerTag.includes('sensitivity')) {
      resolvedImage = './screenshots/settings.png';
    }
  }

  const isNapkinSketch = lowerTag.includes('sketch') || lowerTag.includes('napkin');
  const isTerminalArtifact = lowerTag.includes('terminal') || lowerTag.includes('test') || lowerTag.includes('ipc');
  const isCoffeeMoment = lowerTag.includes('coffee') || lowerTag.includes('tea');

  const cleanLabel = tag.replace(/^\[ADD (PHOTO|SCREENSHOT|SKETCH|TERMINAL LOG):\s*/i, '').replace(/\]$/, '');

  const inner = (
    <div className={`inline-block w-full transition-transform duration-300 hover:scale-[1.01] hover:rotate-0 ${rotateClass}`}>
      {/* Polaroid outer frame */}
      <div
        className="bg-white p-2.5 pb-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_2px_6px_rgba(0,0,0,0.3)] border border-slate-200/40 relative"
        style={{ borderRadius: '2px' }}
      >
        {/* Masking tape on top corner */}
        <div
          className="absolute -top-2 left-6 w-9 h-3.5 opacity-85 z-10 masking-tape-strip"
          style={{ transform: rotate === 'cw' ? 'rotate(-6deg)' : 'rotate(5deg)' }}
        />

        {/* Image / Artifact Container */}
        <div className="w-full aspect-[16/10] bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center">
          {resolvedImage ? (
            <img
              src={resolvedImage}
              alt={caption || cleanLabel}
              className="w-full h-full object-cover"
            />
          ) : isNapkinSketch ? (
            /* Real Napkin Diagram SVG */
            <div className="w-full h-full p-4 bg-[#141b2d] flex flex-col justify-between text-slate-300 font-mono text-[11px]">
              <div className="flex items-center justify-between text-pink-400 border-b border-pink-500/30 pb-1 text-[10px]">
                <span>NAPKIN SCRATCHPAD // 12:30 AM</span>
                <span>P20 ➔ P17</span>
              </div>
              <div className="my-auto flex items-center justify-center gap-4 text-center">
                <div className="p-2 rounded border border-dashed border-pink-400/50 bg-pink-500/10">
                  <Hand className="w-6 h-6 text-pink-400 mx-auto mb-1" />
                  <span className="text-[9px] text-pink-300 block">PINKY (P20)</span>
                </div>
                <span className="text-amber-400 font-bold text-base">➔</span>
                <div className="p-2 rounded border border-dashed border-emerald-400/50 bg-emerald-500/10">
                  <div className="text-base">🐍</div>
                  <span className="text-[9px] text-emerald-300 block">SNAKE</span>
                </div>
                <span className="text-amber-400 font-bold text-base">➔</span>
                <div className="p-2 rounded border border-dashed border-rose-400/50 bg-rose-500/10">
                  <div className="text-base">🗑️</div>
                  <span className="text-[9px] text-rose-300 block">RECYCLE</span>
                </div>
              </div>
              <div className="text-[9px] text-slate-500 text-center font-handwriting text-sm">
                &ldquo;What if pinky moves snake, snake eats real file?&rdquo;
              </div>
            </div>
          ) : isTerminalArtifact ? (
            /* Real Terminal Output Artifact */
            <div className="w-full h-full p-3 bg-slate-950 text-emerald-400 font-mono text-[10px] flex flex-col justify-between overflow-hidden">
              <div className="flex items-center gap-1.5 text-slate-500 border-b border-slate-800 pb-1">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>vitest // engine verification</span>
              </div>
              <div className="space-y-0.5 py-1">
                <div>✓ tests/gameEngine.test.ts (13)</div>
                <div>✓ tests/pinkyTracking.test.ts (10)</div>
                <div>✓ tests/filesystem.test.ts (6)</div>
                <div className="text-pink-300 font-bold">✓ 39 passed in 412ms</div>
              </div>
              <div className="text-[9px] text-slate-500">
                10:15 AM · Clean build before freeze
              </div>
            </div>
          ) : isCoffeeMoment ? (
            /* Tea Stall Moment */
            <div className="w-full h-full p-4 bg-[#16120e] flex flex-col justify-between text-amber-200/90 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-amber-500 text-[10px] uppercase">
                <Coffee className="w-3.5 h-3.5" />
                <span>Hostel Tea Stall · 12:15 AM</span>
              </div>
              <div className="my-auto text-center space-y-1">
                <div className="text-2xl">☕</div>
                <div className="font-handwriting text-lg text-amber-100">
                  &ldquo;No photo. Just black tea, tired laughs, and the idea.&rdquo;
                </div>
              </div>
              <div className="text-[9px] text-amber-400/60 text-center">
                Vishnu + TinkerHub night crew
              </div>
            </div>
          ) : (
            /* Field Dispatch / Event Observation */
            <div className="w-full h-full p-4 bg-[#0d1322] flex flex-col justify-between text-slate-300 font-mono text-xs">
              <div className="flex items-center justify-between text-pink-400 text-[10px] border-b border-slate-800 pb-1">
                <span className="flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>FIELD LOG</span>
                </span>
                <span className="text-slate-500">UP 3.0</span>
              </div>
              <div className="my-auto text-center space-y-1">
                <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                  {cleanLabel}
                </div>
                <div className="font-handwriting text-base text-pink-300/90">
                  &ldquo;Documenting everyone else while having no code of my own.&rdquo;
                </div>
              </div>
              <div className="text-[9px] text-slate-500 text-center">
                TinkerHub SNMIMT Outreach Record
              </div>
            </div>
          )}
        </div>

        {/* Caption below image inside white frame */}
        {caption && (
          <div className="mt-1.5 px-1">
            <p className="font-handwriting text-slate-900 text-xs sm:text-[13px] text-center leading-snug tracking-wide">
              {caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return evidenceUrl ? (
    <a
      href={evidenceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block cursor-pointer"
    >
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
};
