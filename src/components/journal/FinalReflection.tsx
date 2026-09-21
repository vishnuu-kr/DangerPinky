import React, { useState } from 'react';
import {
  Heart,
  Github,
  Play,
  Camera,
  ArrowRight,
  Film,
  FileArchive,
  X
} from 'lucide-react';
import { FINAL_REFLECTION, PERSISTENT_LINKS } from '../../data/journalChapters';
import { BookSpread } from './BookSpread';

interface FinalReflectionProps {
  viewMode?: 'spread' | 'scroll';
  paperTone?: 'dark' | 'cream';
}

export const FinalReflection: React.FC<FinalReflectionProps> = ({
  viewMode = 'spread',
  paperTone = 'dark',
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoModalOpen) setIsVideoModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen]);
  const drawerArtifacts = [
    {
      id: 'game',
      type: 'CARTRIDGE // PLAYABLE BUILD',
      title: 'DangerPinky Web Edition',
      note: 'Safe Demo running directly in browser with synthetic files',
      url: PERSISTENT_LINKS.liveDemo,
      icon: <Play className="w-4 h-4 text-pink-400 fill-pink-400" />,
      tag: 'PLAY IT ↗',
      tagColor: 'text-pink-400 border-pink-500/40 bg-pink-500/10',
    },
    {
      id: 'repo',
      type: 'USB DISK // SOURCE ARCHIVE',
      title: 'GitHub Repository',
      note: '116 unit tests, MediaPipe WASM integration, Electron IPC',
      url: PERSISTENT_LINKS.githubRepo,
      icon: <Github className="w-4 h-4 text-emerald-400" />,
      tag: 'GITHUB ↗',
      tagColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    },
    {
      id: 'video',
      type: 'VIDEO TAPE // DEMO RECORDING',
      title: 'Google Drive Video Walkthrough',
      note: 'Live recorded demonstration showing optical pinky gesture steering',
      url: PERSISTENT_LINKS.driveVideo,
      icon: <Film className="w-4 h-4 text-rose-400" />,
      tag: 'WATCH ↗',
      tagColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    },
    {
      id: 'photos',
      type: 'PHOTO ENVELOPE // EVENT EVIDENCE',
      title: 'Hardware Build Photos',
      note: 'Workstation captures, camera testing setup & late-night room',
      url: PERSISTENT_LINKS.buildPhotos,
      icon: <Camera className="w-4 h-4 text-amber-400" />,
      tag: 'PHOTOS ↗',
      tagColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
    {
      id: 'assets',
      type: 'ARCHIVE FOLDER // MOCKUPS',
      title: 'Asset Drive Directory',
      note: 'Raw canvas screenshots, mockups, and high-res vector assets',
      url: PERSISTENT_LINKS.assetDriveFolder,
      icon: <FileArchive className="w-4 h-4 text-purple-400" />,
      tag: 'DRIVE ↗',
      tagColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    },
    {
      id: 'community',
      type: 'EVENT DISPATCH // HOST',
      title: 'TinkerHub Foundation',
      note: 'Useless Projects 3.0 — the makeathon that started it all',
      url: PERSISTENT_LINKS.tinkerHubMain,
      icon: <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />,
      tag: 'TINKERHUB ↗',
      tagColor: 'text-pink-400 border-pink-500/40 bg-pink-500/10',
    }
  ];

  return (
    <BookSpread
      id={FINAL_REFLECTION.id}
      viewMode={viewMode}
      paperTone={paperTone}
      leftPageNumber={35}
      rightPageNumber={36}
      leftRunningHead="VISHNU K R // FIELD NOTES"
      rightRunningHead="EPILOGUE // CLOSING COLOPHON"
      leftContent={
        <div className="flex flex-col justify-between h-full space-y-3">
          <div>
            <div className="inline-block mb-1.5">
              <span className="ink-stamp ink-stamp-red text-[9px]">EPILOGUE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-sans font-black tracking-tight text-white mb-1">
              {FINAL_REFLECTION.title}
            </h2>
            <p className="text-xs font-sans italic text-pink-300/80 mb-2.5">
              &ldquo;{FINAL_REFLECTION.subtitle}&rdquo;
            </p>
          </div>

          {/* Narrative text in Vishnu's voice */}
          <div className="book-drop-cap">
            <div className="reader-prose text-xs sm:text-[12.5px] space-y-2 text-slate-300 leading-relaxed font-sans">
              {FINAL_REFLECTION.narrative.map((p, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 5
                      ? 'font-bold text-pink-200 border-l-2 border-pink-500 pl-2.5 py-0.5 my-1.5 bg-pink-500/[0.04]'
                      : ''
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Closing quiet takeaway & colophon */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1 mt-auto">
            <p className="font-handwriting text-lg sm:text-xl text-pink-300 leading-snug">
              &ldquo;It started as a stupid idea. Then it broke. Then I fixed it. And somehow, it became this.&rdquo;
            </p>
            <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between pt-1">
              <span>{FINAL_REFLECTION.footerCredit}</span>
              <span>{FINAL_REFLECTION.copyright}</span>
            </div>
            {/* Closing handwritten sign-off */}
            <div className="font-handwriting text-lg text-pink-300/80 text-center pt-2 transform -rotate-1">
              — Vishnu K R, SNMIMT · Built in 18 hours, documented in love
            </div>
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-2.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="ink-stamp ink-stamp-amber text-[9px]">DRAWER ARCHIVE</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                // PHYSICAL ARTIFACTS LEFT ON DESK
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-sans font-black tracking-tight text-white mb-0.5">
              From the Project Drawer
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mb-2">
              The actual repositories, demo recordings, and evidence files preserved from the 18-hour sprint.
            </p>
          </div>

          {/* Official TinkerHub UP 3.0 Wrap Poster Artifact */}
          <div className="relative p-2.5 bg-slate-950/90 rounded-lg border border-pink-500/30 shadow-xl flex items-center gap-3 hover:scale-[1.01] transition-transform duration-150">
            <div
              className="absolute -top-2 left-6 w-10 h-3.5 opacity-80 z-10 masking-tape-strip"
              style={{ transform: 'rotate(-2deg)' }}
            />
            {/* Uncropped Portrait Poster Frame */}
            <a
              href="./images/useless_3_thankyou.png"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-20 sm:w-24 shrink-0 bg-slate-900 rounded overflow-hidden border border-slate-700 shadow-md group cursor-pointer block"
              title="Click to view full high-res wrap poster"
            >
              <img
                src="./images/useless_3_thankyou.png"
                alt="TinkerHub Useless Projects 3.0 Official Thank You Poster"
                className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[8px] font-mono font-bold bg-slate-950/90 text-pink-300 px-1 py-0.5 rounded border border-pink-500/40">
                  VIEW ↗
                </span>
              </div>
            </a>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="ink-stamp ink-stamp-pink text-[7.5px] py-0 px-1">CAMPUS WRAP</span>
                <span className="text-[8.5px] font-mono text-slate-400">SNMIMT AUDITORIUM</span>
              </div>
              <h4 className="text-xs sm:text-[13px] font-bold text-white font-sans truncate">
                TinkerHub UP 3.0 Official Poster
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-300 font-sans leading-relaxed mt-0.5">
                The official celebration dispatch commemorating 12 builder squads, 65 makers, and 18 hours of delightfully useless engineering.
              </p>
              <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-slate-500">
                <span className="font-handwriting text-xs text-pink-300">↳ &ldquo;thank you for making it useless&rdquo;</span>
                <span className="text-pink-400 font-semibold">ALL-ACCESS</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {drawerArtifacts.map((art) => {
              const isVideoItem = art.id === 'video';
              return (
                <a
                  key={art.id}
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (isVideoItem) {
                      e.preventDefault();
                      setIsVideoModalOpen(true);
                    }
                  }}
                  className="group relative p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-pink-500/40 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 flex flex-col justify-between"
                  style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.35)' }}
                >
                  {/* Top tape accent */}
                  <div className="absolute -top-1.5 right-3 w-7 h-3 masking-tape-strip opacity-70" />

                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 scale-90 -ml-0.5">
                        {art.icon}
                      </div>
                      <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded border ${art.tagColor}`}>
                        {art.tag}
                      </span>
                    </div>

                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">
                      {art.type}
                    </div>
                    <h4 className="font-sans font-bold text-xs text-white group-hover:text-pink-300 transition-colors mb-0.5 line-clamp-1">
                      {art.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-sans leading-snug line-clamp-2">
                      {art.note}
                    </p>
                  </div>

                  <div className="mt-1.5 pt-1 border-t border-slate-900/80 flex items-center justify-between text-[9.5px] font-mono text-slate-500 group-hover:text-pink-400 transition-colors">
                    <span>{isVideoItem ? 'WATCH VIDEO' : 'OPEN ARTIFACT'}</span>
                    <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="py-1.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center flex items-center justify-between text-[10px] font-mono text-slate-500 mt-auto shrink-0">
            <span className="ink-stamp ink-stamp-red text-[8.5px]">END OF LOGBOOK</span>
            <span>ARCHIVED: KOCHI, KERALA // OCTOBER 2024</span>
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
      }
    />
  );
};
