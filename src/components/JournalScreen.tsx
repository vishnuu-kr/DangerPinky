import React, { useState } from 'react';
import {
  Video,
  Terminal,
  Cpu,
  ShieldCheck,
  Flame,
  Volume2,
  Play,
  Github,
  ExternalLink,
  CheckCircle2,
  Maximize2,
  X,
  Heart
} from 'lucide-react';
import { sound } from '../game/audio';

interface JournalScreenProps {
  onStartDemo: () => void;
  onStartWithCamera: () => void;
  onSelectRealFiles: () => void;
  onBackToLanding: () => void;
}

interface ScreenshotItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  badge: string;
  description: string;
  techHighlights: string[];
}

const SCREENSHOTS: ScreenshotItem[] = [
  {
    id: 'landing',
    title: 'Landing & Mode Selector Dashboard',
    subtitle: 'The Gateway to Useless Danger',
    src: '/screenshots/landing.png',
    badge: 'UI / UX',
    description: 'The polished candy-pink retro entry point. Players choose between Safe Demo Mode (simulated files, 100% risk-free) or Real Danger Mode (electron-native Recycle Bin integration).',
    techHighlights: [
      '3D radial candy button shaders with tactile press feedback',
      'Dynamic detection of Electron vs Web runtime',
      'Instant access to pinky calibration and folder inspection'
    ]
  },
  {
    id: 'gameplay',
    title: 'Active Gameplay & Pinky Vision HUD',
    subtitle: 'Steering with Landmark 20 in Real Time',
    src: '/screenshots/gameplay.png',
    badge: 'Computer Vision & Canvas',
    description: 'The snake devours local files transformed into glossy 3D candy fruits. The corner HUD tracks the little finger tip with a glowing crosshair and shows direction intent.',
    techHighlights: [
      'Sub-20ms latency MediaPipe Hand Landmarker WASM pipeline',
      'EMA (Exponential Moving Average) coordinate smoothing filter',
      'Floating file badges and tail segment animation'
    ]
  },
  {
    id: 'settings',
    title: 'Candy Customization Suite',
    subtitle: 'Fine-Tuning Sensitivity & Grids',
    src: '/screenshots/settings.png',
    badge: 'State & Configuration',
    description: 'Comprehensive player settings with reactive sliders for pinky gesture sensitivity, grid dimensions (10x10, 12x12, 16x16), sound volume, and touch D-pad fallback.',
    techHighlights: [
      'Persistent localStorage configuration with typed validation',
      'Live sensitivity deadzone calibration in degrees and delta pixels',
      'Touch D-pad support for laptops with touchscreens'
    ]
  },
  {
    id: 'gameover',
    title: 'Game Over Modal & File Audit',
    subtitle: 'Celebrating High Scores & Auditing Recycled Files',
    src: '/screenshots/gameover.png',
    badge: 'Physics & Audit Trail',
    description: 'The session summary displaying total score, fruits devoured, and an audit table of files dispatched to the Recycle Bin with direct one-click OS Recycle Bin launcher.',
    techHighlights: [
      'Multi-burst confetti physics powered by canvas-confetti',
      'Audit log of every file operation with timestamps',
      'Direct Windows explorer.exe shell hook to open Recycle Bin'
    ]
  }
];

export const JournalScreen: React.FC<JournalScreenProps> = ({
  onStartDemo,
  onStartWithCamera,
  onSelectRealFiles,
  onBackToLanding
}) => {
  const [activeLightbox, setActiveLightbox] = useState<ScreenshotItem | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const handleTriggerSound = (name: string, action: () => void) => {
    setPlayingSound(name);
    action();
    setTimeout(() => setPlayingSound(null), 500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 select-none text-slate-100">
      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="relative bg-slate-900 border-2 border-pink-500/40 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">
                  {activeLightbox.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-game font-bold text-white mt-1">
                  {activeLightbox.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLightbox(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-800 bg-black/60 mb-4 flex items-center justify-center">
              <img
                src={activeLightbox.src}
                alt={activeLightbox.title}
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-sm sm:text-base text-slate-300 mb-4 leading-relaxed font-sans">
              {activeLightbox.description}
            </p>

            <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                Engineering Highlights:
              </span>
              {activeLightbox.techHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative text-center mb-16 pt-4">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hackathon Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-pink-500/30 text-xs font-semibold text-slate-200 backdrop-blur-md mb-6 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
          <span className="text-pink-300 font-bold">TinkerHub Useless Projects 3.0</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-300">Official Devlog & Build Journal</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-game font-black tracking-tight text-white mb-4 leading-tight">
          The Making of{' '}
          <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
            DangerPinky
          </span>{' '}
          🎯
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed mb-8">
          The cute candy snake. The ultimate useless danger.{' '}
          <strong className="text-pink-400 font-semibold">
            Russian Roulette for your local filesystem, powered entirely by your little finger.
          </strong>
        </p>

        {/* Hero Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto mb-10 text-left">
          <div className="bg-slate-900/80 border border-pink-500/30 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-pink-400 text-xs font-mono font-bold mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>VISION MODEL</span>
            </div>
            <div className="text-xl font-game font-bold text-white">MediaPipe</div>
            <div className="text-[11px] text-slate-400">Landmark 20 Pinky TIP</div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>TEST SUITE</span>
            </div>
            <div className="text-xl font-game font-bold text-white">39 / 39 Pass</div>
            <div className="text-[11px] text-slate-400">100% vitest automated</div>
          </div>

          <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>DANGER MODE</span>
            </div>
            <div className="text-xl font-game font-bold text-white">Recycle Bin</div>
            <div className="text-[11px] text-slate-400">Electron Native IPC</div>
          </div>

          <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-mono font-bold mb-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span>AUDIO ENGINE</span>
            </div>
            <div className="text-xl font-game font-bold text-white">Web Audio</div>
            <div className="text-[11px] text-slate-400">Procedural waveforms</div>
          </div>
        </div>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartDemo}
            className="btn-candy-pink px-7 py-3 rounded-full font-game font-bold text-base sm:text-lg flex items-center gap-2.5 shadow-xl cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Play Safe Demo</span>
          </button>

          <button
            onClick={onStartWithCamera}
            className="btn-candy-pill px-6 py-3 rounded-full text-sm font-game font-bold text-pink-200 hover:text-white flex items-center gap-2 cursor-pointer border border-pink-500/40"
          >
            <Video className="w-4 h-4 text-pink-400" />
            <span>Test Pinky Camera</span>
          </button>

          <button
            onClick={onBackToLanding}
            className="px-5 py-3 rounded-full text-xs font-mono font-semibold text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
          >
            ← Back to Game Hub
          </button>
        </div>
      </section>

      {/* Origin Story: The Problem & The Solution */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30">
            Genesis & Ideation
          </span>
          <h2 className="text-2xl sm:text-3xl font-game font-black text-white mt-3">
            Why Build Something So Gloriously Useless?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* The Problem */}
          <div className="bg-slate-900/70 border border-rose-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-5">
              <span className="text-2xl">🗑️</span>
            </div>
            <h3 className="text-xl font-game font-bold text-rose-200 mb-3">
              The Problem (That Doesn't Exist)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans mb-4">
              Your Downloads folder is a digital wasteland of 2,400 unorganized files: 47 versions of{' '}
              <code className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-300 text-xs font-mono">
                assignment_final_v2_FINAL_really_final.pdf
              </code>
              , zip archives from 2021 you never opened, blurry WhatsApp memes, and questionable installers you forgot existed.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Traditional disk cleanup tools (like CCleaner or Windows Disk Cleanup) are sterile, soulless, and completely deprived of dopamine. You select checkboxes, click "Delete", and wait in silence. Where is the thrill? Where is the existential dread?
            </p>
          </div>

          {/* The Solution */}
          <div className="bg-slate-900/70 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-5">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-game font-bold text-emerald-200 mb-3">
              The Solution (That Nobody Asked For)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans mb-4">
              We engineered <strong className="text-white font-bold">DangerPinky</strong>: turning routine disk cleanup into a high-stakes arcade survival thriller.
            </p>
            <ul className="text-sm text-slate-300 space-y-2 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">•</span>
                <span><strong>No keyboard, no mouse:</strong> Your pinky finger tip is the steering wheel.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Your files become candy:</strong> Real files turn into plump 3D watermelons and cherries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Danger Mode Roulette:</strong> Eaten files are immediately banished to your OS Recycle Bin!</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Screenshot Gallery with Lightbox */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30">
              Visual Tour
            </span>
            <h2 className="text-2xl sm:text-3xl font-game font-black text-white mt-2">
              Inside DangerPinky
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any screenshot to zoom in and inspect technical highlights.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SCREENSHOTS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="group relative bg-slate-900/80 border border-pink-500/20 hover:border-pink-500/60 rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-pink-500/20 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-2.5 right-2.5 p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 group-hover:text-white border border-slate-700/50">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 text-pink-300 border border-pink-500/30 backdrop-blur-md">
                    {item.badge}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-game font-bold text-base sm:text-lg text-white group-hover:text-pink-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Building Timeline & Devlog Milestones */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            Development Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-game font-black text-white mt-3">
            Day-by-Day Engineering Devlog
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            The chronological step-by-step milestones of building DangerPinky from scratch.
          </p>
        </div>

        <div className="relative border-l-2 border-pink-500/30 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
          {/* Milestone 1 */}
          <div className="relative group">
            <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-pink-500/50">
              1
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-pink-500/40 transition-colors">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono text-pink-400 font-bold">MILESTONE 1</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Conceptualization & Architecture</span>
              </div>
              <h3 className="text-lg font-game font-bold text-white mb-2">
                The Hackathon Spark & The Danger Concept
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-3">
                Started with a fundamental question: "What is the most stressful, unnecessarily high-stakes way to play a retro game?" Conceived DangerPinky for TinkerHub Useless Projects 3.0. Established two core tenets:
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-pink-500/15 text-pink-300 border border-pink-500/30 font-medium">
                  Tenet 1: Pinky-only gesture navigation
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                  Tenet 2: Physical filesystem Russian Roulette
                </span>
              </div>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="relative group">
            <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-pink-500/50">
              2
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-pink-500/40 transition-colors">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono text-pink-400 font-bold">MILESTONE 2</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Computer Vision Pipeline</span>
              </div>
              <h3 className="text-lg font-game font-bold text-white mb-2">
                Taming MediaPipe & Extracting Landmark 20
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-3">
                Integrated Google's MediaPipe Hand Landmarker via WebAssembly GPU delegate. Hand trackers output 21 keypoints; we isolated Landmark 20 (Pinky TIP). Raw camera coordinates are noisy and jittery, so we designed an Exponential Moving Average (EMA) smoother and a strict deadzone threshold to prevent accidental direction flips:
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                <code>
                  smoothedTip = alpha * currentTip + (1 - alpha) * prevSmoothed;
                  <br />
                  if (distance &gt; threshold &amp;&amp; |dx| &gt; |dy|) intent = dx &gt; 0 ? RIGHT : LEFT;
                </code>
              </div>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="relative group">
            <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-pink-500/50">
              3
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-pink-500/40 transition-colors">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono text-pink-400 font-bold">MILESTONE 3</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Game Loop & Physics</span>
              </div>
              <h3 className="text-lg font-game font-bold text-white mb-2">
                Deterministic 60 FPS Snake Engine
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-3">
                Engineered the core game loop to be fully deterministic and independent of monitor refresh rate. Implemented directional input buffering to discard suicide 180° turns (e.g. pressing LEFT while moving RIGHT). Built board wrappers, fruit spawn distribution, and dynamic tail growth.
              </p>
            </div>
          </div>

          {/* Milestone 4 */}
          <div className="relative group">
            <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-pink-500/50">
              4
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-pink-500/40 transition-colors">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono text-pink-400 font-bold">MILESTONE 4</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Electron Native Bridge</span>
              </div>
              <h3 className="text-lg font-game font-bold text-white mb-2">
                The Safe Danger Bridge: OS Recycle Bin Integration
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-3">
                Bridged the renderer process to the Electron main process via typed IPC. When Danger Mode is active, eaten files trigger a native call to move the file into the operating system's Recycle Bin / Trash Can. Implemented cryptographic session tokens to guarantee no file outside the selected folder can ever be touched.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero permanent deletion: 100% recoverable from Windows Recycle Bin at any moment.</span>
              </div>
            </div>
          </div>

          {/* Milestone 5 */}
          <div className="relative group">
            <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-pink-500/50">
              5
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-pink-500/40 transition-colors">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono text-pink-400 font-bold">MILESTONE 5</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Juice & Audio Engineering</span>
              </div>
              <h3 className="text-lg font-game font-bold text-white mb-2">
                Procedural Web Audio Synth & 3D Candy Shaders
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-3">
                Zero external sound mp3 files! Synthesized custom procedural waveforms using the Web Audio API tailored to file categories (sine wave chimes for images, 8-bit square arpeggios for code files, sawtooth slides for archives). Designed candy fruit shaders with radial gloss specular highlights and floating badges.
              </p>
            </div>
          </div>

          {/* Milestone 6 */}
          <div className="relative group">
            <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/50">
              ✓
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-emerald-500/40 transition-colors">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono text-emerald-400 font-bold">MILESTONE 6</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Hardening & Launch</span>
              </div>
              <h3 className="text-lg font-game font-bold text-white mb-2">
                39 Unit Tests & Full Production Build
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-3">
                Achieved 100% pass rate across 39 automated unit test suites covering the game engine, pinky tracking maths, security containment tokens, and filesystem mock layers. Packaged executable desktop and browser bundles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Procedural Audio Synth Playground */}
      <section className="mb-16 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 border-2 border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30">
            Interactive Soundboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-game font-black text-white mt-3">
            Procedural Audio Synthesizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
            Click any button below to test the game's actual synthesized audio waveforms live in your browser!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          <button
            onClick={() => handleTriggerSound('image', () => sound.playEatSound('image'))}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              playingSound === 'image'
                ? 'bg-pink-500 border-white scale-95 shadow-lg shadow-pink-500/50'
                : 'bg-slate-950/80 border-pink-500/30 hover:border-pink-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl">🍒</span>
            <span className="font-game font-bold text-xs text-pink-300">Image Chime</span>
            <span className="text-[10px] font-mono text-slate-400">Sine E5→B5</span>
          </button>

          <button
            onClick={() => handleTriggerSound('code', () => sound.playEatSound('code'))}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              playingSound === 'code'
                ? 'bg-cyan-500 border-white scale-95 shadow-lg shadow-cyan-500/50'
                : 'bg-slate-950/80 border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl">🍉</span>
            <span className="font-game font-bold text-xs text-cyan-300">Code Arpeggio</span>
            <span className="text-[10px] font-mono text-slate-400">Square 8-bit</span>
          </button>

          <button
            onClick={() => handleTriggerSound('audio', () => sound.playEatSound('audio'))}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              playingSound === 'audio'
                ? 'bg-purple-500 border-white scale-95 shadow-lg shadow-purple-500/50'
                : 'bg-slate-950/80 border-purple-500/30 hover:border-purple-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl">🍇</span>
            <span className="font-game font-bold text-xs text-purple-300">Audio Chime</span>
            <span className="text-[10px] font-mono text-slate-400">Tri C-E-G</span>
          </button>

          <button
            onClick={() => handleTriggerSound('archive', () => sound.playEatSound('archive'))}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              playingSound === 'archive'
                ? 'bg-amber-500 border-white scale-95 shadow-lg shadow-amber-500/50'
                : 'bg-slate-950/80 border-amber-500/30 hover:border-amber-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl">📦</span>
            <span className="font-game font-bold text-xs text-amber-300">Archive Thud</span>
            <span className="text-[10px] font-mono text-slate-400">Saw Slide</span>
          </button>

          <button
            onClick={() => handleTriggerSound('highscore', () => sound.playHighScore())}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              playingSound === 'highscore'
                ? 'bg-emerald-500 border-white scale-95 shadow-lg shadow-emerald-500/50'
                : 'bg-slate-950/80 border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl">👑</span>
            <span className="font-game font-bold text-xs text-emerald-300">Fanfare</span>
            <span className="text-[10px] font-mono text-slate-400">Ascending</span>
          </button>

          <button
            onClick={() => handleTriggerSound('gameover', () => sound.playGameOver())}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              playingSound === 'gameover'
                ? 'bg-rose-500 border-white scale-95 shadow-lg shadow-rose-500/50'
                : 'bg-slate-950/80 border-rose-500/30 hover:border-rose-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl">💥</span>
            <span className="font-game font-bold text-xs text-rose-300">Game Over</span>
            <span className="text-[10px] font-mono text-slate-400">Descent 240Hz</span>
          </button>
        </div>

        <div className="text-center text-xs text-slate-400 font-mono">
          Powered entirely by Web Audio API oscillators • 0 external audio files needed
        </div>
      </section>

      {/* Hardware & Optical Engineering Breakdown */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30">
            Physical Interface
          </span>
          <h2 className="text-2xl sm:text-3xl font-game font-black text-white mt-3">
            Hardware & Biometric Schematics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            The biological and optical specifications required to operate DangerPinky.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hardware Specs Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-game font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-pink-400" />
              <span>Hardware Bill of Materials</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm font-sans">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Primary Controller</span>
                <span className="text-pink-300 font-mono font-semibold">1x Human Pinky Finger</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Operating Temperature</span>
                <span className="text-slate-200 font-mono">~37.0°C (Homeothermic)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Range of Motion</span>
                <span className="text-slate-200 font-mono">180° Articulation</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Optical Sensor</span>
                <span className="text-slate-200 font-mono">720p / 1080p RGB Webcam @ 30fps</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Environmental Needs</span>
                <span className="text-slate-200 font-mono">Desk, Chair, High Coffee Tolerance</span>
              </div>
            </div>
          </div>

          {/* Neurological Impulse Pipeline */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-game font-bold text-white mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Neurological to File Deletion Pipeline</span>
              </h3>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] sm:text-xs text-slate-300 space-y-2 leading-relaxed">
                <div className="text-pink-400">[ Human Brain ]</div>
                <div className="text-slate-500 pl-4">│ Impulse to organize cluttered Downloads folder</div>
                <div className="text-pink-400 pl-4">▼</div>
                <div className="text-pink-300 pl-4">[ Pinky Extensor Muscle ] (Flick gesture)</div>
                <div className="text-slate-500 pl-8">│ Photons reflected toward webcam lens</div>
                <div className="text-pink-300 pl-8">▼</div>
                <div className="text-cyan-300 pl-8">[ MediaPipe WASM Landmarker ] (Landmark 20)</div>
                <div className="text-slate-500 pl-12">│ Electron Native IPC Bridge</div>
                <div className="text-cyan-300 pl-12">▼</div>
                <div className="text-amber-400 pl-12">[ Windows Recycle Bin ] ──▶ Dopamine Hit 🎯</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team & TinkerHub Credits */}
      <section className="mb-12 bg-slate-900/60 border border-pink-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-pink-500/30">
          👨‍💻
        </div>

        <h3 className="text-2xl font-game font-bold text-white mb-1">
          Built by VISHNU K R
        </h3>
        <p className="text-sm text-pink-300 font-medium mb-4">
          SNM Institute of Management and Technology, Maliyankara
        </p>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-6 font-sans">
          Created for <strong className="text-white font-bold">TinkerHub Useless Projects 3.0</strong> — dedicated to the spirit of creating wonderfully absurd, technically ambitious software just because we can.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://github.com/vishnuu-kr/DangerPinky"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold transition-colors border border-slate-700"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>

          <a
            href="https://tinkerhub.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-100 text-xs font-mono font-bold transition-colors border border-emerald-500/40"
          >
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span>TinkerHub Foundation</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        </div>
      </section>

      {/* Floating Bottom Bar: Jump into Game */}
      <div className="sticky bottom-4 z-30 flex items-center justify-between gap-3 max-w-2xl mx-auto bg-slate-900/90 border-2 border-pink-500/40 rounded-full px-5 py-3 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="text-xl select-none">🎯</span>
          <div className="text-left hidden sm:block">
            <div className="font-game font-bold text-xs text-white">Ready to risk your files?</div>
            <div className="text-[10px] text-pink-300">Play Safe Demo or Danger Mode</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStartDemo}
            className="btn-candy-pink px-4 py-1.5 rounded-full font-game font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Play Demo</span>
          </button>

          <button
            onClick={onSelectRealFiles}
            className="btn-candy-gold px-4 py-1.5 rounded-full font-game font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Flame className="w-3.5 h-3.5 text-rose-700 fill-amber-300" />
            <span>Danger Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
