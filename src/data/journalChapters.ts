// ---------------------------------------------------------------------------
// DangerPinky — Project Journal Data Layer
// TinkerHub Useless Projects 3.0 · Solo Builder: Vishnu K R (SNMIMT Maliyankara)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Shared Interfaces & Types
// ---------------------------------------------------------------------------

export interface Chapter {
  id: string;
  number: string;
  sectionNumber: string;
  title: string;
  subtitle: string;
  tag: string;
  summary: string;
  narrative: string[];
  timestamp?: string;
  scrapbookTag?: string;
  scrapbookTags?: string[];
  codeSnippets?: { title: string; language: string; code: string }[];
  failureStories?: FailureCase[];
  breakthroughs?: Breakthrough[];
  metadata?: Record<string, unknown>;
}

export interface TimelineMilestone {
  time: string;
  title: string;
  attempt: string;
  reality: string;
  visualEvidence: string;
  lesson: string;
}

export interface EvolutionRow {
  version: string;
  time: string;
  architecturalShift: string;
  experience: string;
  changelog: string[];
}

export interface TechStackItem {
  id: string;
  name: string;
  category: string;
  role: string;
  whyChosen: string;
  quirkOrTrap: string;
  codeSnippet: string;
}

export interface SoundboardItem {
  id: string;
  name: string;
  waveform: string;
  frequencyRamp: string;
  envelope: string;
  duration: string;
  fileCategory: string;
  description: string;
  emoji: string;
}

export interface ScreenshotAnnotation {
  x: number;
  y: number;
  label: string;
}

export interface FailureCase {
  title: string;
  thought: string;
  tried: string;
  cause: string;
  fix: string;
  codeSnippet?: { title: string; code: string };
}

export interface Breakthrough {
  title: string;
  formula: string;
  description: string;
  impact: string;
  subtitle?: string;
}

export interface FileEntry {
  id: string;
  name: string;
  fileCategory: string;
  description: string;
  emoji: string;
}

export interface ScreenshotGalleryItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  badge: string;
  description: string;
  techHighlights: string[];
}

// ---------------------------------------------------------------------------
// Opening Hero Metadata & Badges
// Protagonist: Vishnu K R (Outreach Lead → Accidental Builder)
// ---------------------------------------------------------------------------
export const HERO_DATA = {
  id: 'hero',
  headline: 'I Was Supposed to Be Documenting Everyone Else.',
  title: 'I Was Supposed to Be Documenting Everyone Else.',
  subheading: 'Instead, I accidentally spent 18 hours building a snake that eats files.',
  leadText:
    "I'm Vishnu K R, Outreach Lead for TinkerHub SNMIMT. My actual job for Useless Projects 3.0 was photographing teams, posting Instagram stories, and running around telling everyone else to document their projects. Somewhere between midnight coffee, an abandoned first idea, and an empty project workspace... I built a pinky-controlled snake that sends your local files to the Windows Recycle Bin.",
  author: 'Vishnu K R',
  institution: 'SNM Institute of Management and Technology (SNMIMT), Maliyankara',
  institutionShort: 'SNMIMT Maliyankara',
  hackathon: 'TinkerHub Useless Projects 3.0',
  duration: '18-Hour Overnight Makeathon',
  timelineSpan: '11 → 12 September 2026 · 05:00 PM to 10:45 AM',
  badges: [
    'Built by Vishnu K R',
    'SNMIMT Maliyankara',
    '18-Hour Overnight Makeathon',
    'TinkerHub Useless Projects 3.0'
  ],
  stats: [
    {
      id: 'vision',
      label: 'VISION ENGINE',
      value: 'MediaPipe',
      metric: 'Landmark 20',
      detail: 'Sub-20ms latency, WASM GPU delegate'
    },
    {
      id: 'tests',
      label: 'TEST SUITE',
      value: '39 / 39 Pass',
      metric: '100% Passing',
      detail: 'Automated Vitest across engine, CV, and filesystem'
    },
    {
      id: 'danger',
      label: 'DANGER MODE',
      value: 'Recycle Bin',
      metric: 'shell.trashItem',
      detail: 'Native Electron IPC with ephemeral session tokens'
    },
    {
      id: 'audio',
      label: 'AUDIO ENGINE',
      value: 'Web Audio',
      metric: '0 Audio Files',
      detail: '100% procedural oscillator waveform synthesis'
    }
  ],
  ctas: {
    startJourney: {
      label: 'START THE JOURNEY ↓',
      targetId: 'chapter-01'
    },
    playGame: {
      label: 'PLAY DANGERPINKY',
      targetId: 'chapter-14'
    },
    watchDemo: {
      label: 'WATCH DEMO VIDEO ↗',
      url: 'https://drive.google.com/file/d/1aIiCRxT6f9T7WfaB7Iu2qHBtmiiLmvXs/view?usp=drive_link'
    }
  }
};

// ---------------------------------------------------------------------------
// Prologue Data — The protagonist context: NoseTrack win + Outreach Lead
// ---------------------------------------------------------------------------
export const PROLOGUE_DATA = {
  id: 'prologue',
  title: 'Last Year I Had a Project. This Year I Had Nothing.',
  subtitle: 'I won Useless Projects 2.0 with NoseTrack. So naturally, I arrived at UP 3.0 expecting another stupid idea.',
  tag: '00 · ME',
  outreachRole: {
    title: 'TinkerHub SNMIMT Outreach Lead',
    responsibilities: [
      'Instagram stories & live event coverage',
      'Photographing participating teams',
      'Telling everyone: "Take photos, document your process!"',
      'Making reels & capturing hall atmosphere',
      'Forgetting to take photos of my own screen'
    ]
  },
  previousWin: {
    title: 'NoseTrack — Winner of Useless Projects 2.0',
    repo: 'https://github.com/vishnuu-kr/Nosetrack',
    note: "Last year I built NoseTrack (steering your cursor with your nose) and won. So I walked into UP 3.0 assuming I'd easily have another silly build ready. I was completely wrong."
  },
  narrative: [
    "I'm Vishnu K R. At TinkerHub SNMIMT, I'm the Outreach Lead. And when Useless Projects 3.0 kicked off at our campus, my actual job for the next 18 hours was running the event's social media, making Instagram stories, photographing teams, and telling everyone to document what they were building.",
    "I was literally walking across the lab telling people: 'Take photos! Record this! Don't forget your process notes!' The whole event documentation was on me.",
    "The ironic part? I didn't even have a project.",
    "I'd won Useless Projects 2.0 with NoseTrack, so people kind of assumed I'd have something funny queued up. I didn't. The event started at 05:00 PM, laptops were cracking open, whiteboards were filling with wild sketches — and I was standing in the middle of the room with my phone out, posting Stories for TinkerHub, while quietly panicking because my own workspace was completely empty."
  ],
  scrapbookTags: [
    '[ADD PHOTO: Official Useless Projects 3.0 Event Poster — TinkerHub SNMIMT]',
    '[ADD PHOTO: TinkerHub Useless Projects 3.0 event opening — teams setting up]',
    '[ADD SCREENSHOT: NoseTrack repository — Useless Projects 2.0 winning project]',
    '[ADD PHOTO: Vishnu doing outreach — taking event photos]'
  ]
};

// ---------------------------------------------------------------------------
// Persistent Reference Links
// ---------------------------------------------------------------------------
export const PERSISTENT_LINKS = {
  githubRepo: 'https://github.com/vishnuu-kr/DangerPinky',
  liveDemo: 'https://vishnuu-kr.github.io/DangerPinky/',
  driveVideo: 'https://drive.google.com/file/d/1aIiCRxT6f9T7WfaB7Iu2qHBtmiiLmvXs/view?usp=drive_link',
  buildPhotos: 'https://drive.google.com/file/d/17yqRVJh22dZAFbSfJG2-ILG1PS2boy4O/view?usp=drive_link',
  assetDriveFolder: 'https://drive.google.com/drive/folders/1u7BUqhHbVeiD0sxTesiC41KkblEXHwSi?usp=sharing',
  tinkerHubEvent: 'https://tinkerhub.org/events/1M8ORET9A1/useless-projects-3.0',
  tinkerHubMain: 'https://tinkerhub.org',
  nosePrackRepo: 'https://github.com/vishnuu-kr/Nosetrack'
};

// ---------------------------------------------------------------------------
// Interactive Soundboard Audio Definitions
// ---------------------------------------------------------------------------
export const SOUNDBOARD_DATA: SoundboardItem[] = [
  {
    id: 'image',
    name: 'Image Chime',
    waveform: 'sine',
    frequencyRamp: '659.25 Hz (E5) → 987.77 Hz (B5) in 0.08s',
    envelope: '0.25 × Vbase → 0.001 exp decay',
    duration: '0.17s',
    fileCategory: 'Images (.png, .jpg, .webp)',
    description: 'Bright, bell-like sine sweep triggering when the snake devours photos or graphic mockups.',
    emoji: '🍒'
  },
  {
    id: 'code',
    name: 'Code Arpeggio',
    waveform: 'square',
    frequencyRamp: '440 Hz (A4) for 0.05s → jump to 880 Hz (A5)',
    envelope: '0.25 × Vbase → 0.001 exp decay',
    duration: '0.15s',
    fileCategory: 'Code (.ts, .py, .rs, .js)',
    description: 'Crisp 8-bit chip tune bite synthesized with a square wave for source code files.',
    emoji: '🍉'
  },
  {
    id: 'archive',
    name: 'Archive Thud',
    waveform: 'sawtooth',
    frequencyRamp: '200 Hz → 600 Hz fast upward slide in 0.08s',
    envelope: '0.20 × Vbase → 0.001 exp decay',
    duration: '0.16s',
    fileCategory: 'Archives (.zip, .tar.gz, .rar)',
    description: 'Heavy, raspy sawtooth impact signaling the digestion of large compressed folders.',
    emoji: '📦'
  },
  {
    id: 'highscore',
    name: 'Fanfare',
    waveform: 'triangle',
    frequencyRamp: '523.25 Hz (C5) → 659.25 Hz (E5) → 783.99 Hz (G5) → 1046.50 Hz (C6)',
    envelope: '0.25 × Vbase per note (staggered 0.09s)',
    duration: '0.45s',
    fileCategory: 'Score & Celebration',
    description: 'Warm, four-note ascending harmonic triad synthesized entirely without audio samples.',
    emoji: '👑'
  },
  {
    id: 'gameover',
    name: 'Game Over',
    waveform: 'sawtooth',
    frequencyRamp: '240 Hz → 55 Hz descending pitch bend over 0.45s',
    envelope: '0.35 × Vbase → 0.001 exp decay',
    duration: '0.50s',
    fileCategory: 'Collision & Failure',
    description: 'Deep, comedic downward slide triggered when crashing into borders or eating your own neck.',
    emoji: '💥'
  }
];

// ---------------------------------------------------------------------------
// Before / After Prototype Comparison Data
// ---------------------------------------------------------------------------
export const BEFORE_AFTER_COMPARISON = {
  before: {
    label: 'EARLY PROTOTYPE (09:30 PM)',
    timestamp: '09:30 PM',
    title: 'v0.1 — The "Pinky Snake" Disaster',
    specs: [
      'Black canvas, lime-green squares, raw jitter with no smoothing',
      'Raw un-smoothed Landmark 20 coordinates jumping ±15px every frame',
      'Plain text file names floating on canvas with no graphics',
      'Zero direction buffering — immediate 180° suicide turns possible',
      'Total silence — no sound engine whatsoever'
    ],
    visualSrc: './screenshots/gameplay.png'
  },
  after: {
    label: 'FINAL BUILD (10:45 AM)',
    timestamp: '10:45 AM',
    title: 'v1.0 — DangerPinky, Actually Done',
    specs: [
      'Candy-pink snake with rounded vertices, drop shadows, and eye pupil tracking',
      'EMA smoothing (alpha=0.35), deadzone filter, hand-scale normalized vectors',
      'Glossy 3D radial candy fruits (Apples, Oranges, Grapes, Cherries, Watermelons)',
      'Deterministic 60 FPS loop with 1-tick direction buffering',
      'Zero-asset procedural Web Audio oscillator sound engine'
    ],
    visualSrc: './screenshots/gameplay.png'
  }
};

// ---------------------------------------------------------------------------
// 18-Hour Timeline Milestones
// ---------------------------------------------------------------------------
export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    time: '05:00 PM',
    title: 'Kickoff & The Whiteboard Pitch',
    attempt: 'Pitch an arcade snake game that physically hunts and deletes files on your computer using computer vision.',
    reality: 'The TinkerHub room erupted in laughter, immediately followed by the organizers asking if this violates data security regulations. I had to quickly clarify: "It sends files to the OS Recycle Bin! You can undo it with Ctrl+Z!"',
    visualEvidence: 'Whiteboard scribbles showing a snake head chomping a PDF icon with an arrow pointing to a recycling trash can.',
    lesson: 'A hackathon project for "Useless Projects" must be aggressively irresponsible in concept, but legally safe and easily recoverable in execution.'
  },
  {
    time: '07:30 PM',
    title: 'The MediaPipe WebAssembly Gamble',
    attempt: 'Run Google MediaPipe Hand Landmarker entirely client-side inside Vite without an external Python or cloud backend.',
    reality: 'Vite crashed with MIME type mismatches trying to load .wasm binaries and task asset models from node_modules. The browser console looked like a crime scene.',
    visualEvidence: 'Browser console throwing "Failed to fetch dynamically imported module: hand_landmarker.wasm" on localhost:5173.',
    lesson: 'Never bundle heavy WebAssembly models inside standard JS bundler chunks; serve them statically through the public directory with explicit MIME type headers.'
  },
  {
    time: '10:00 PM',
    title: 'The First Coordinate Extractor',
    attempt: 'Map raw webcam pixel coordinates of finger tip (Landmark 20) directly to snake steering vectors.',
    reality: 'The camera coordinates were inverted, noisy, and completely broken whenever I leaned back or moved my chair. To turn left, I had to contort my elbow like an acrobat.',
    visualEvidence: 'A green square erratically bouncing between the four screen borders at 120 miles per hour.',
    lesson: 'Raw screen pixel coordinates are garbage. You must anchor the finger tip against an anatomical joint on the same hand and scale it by wrist-to-knuckle distance.'
  },
  {
    time: '01:15 AM',
    title: 'The Midnight Hallucination',
    attempt: 'Hook the snake collision handler up to Node.js fs.unlinkSync to prove real file deletion worked.',
    reality: 'Sitting in the dark with freezing Kerala black tea, my finger twitched. The snake performed a 180° suicide turn toward the top left and devoured my active project directory. I froze in horror. Luckily git was clean, but I immediately trashed fs.unlinkSync forever.',
    visualEvidence: 'A bash shell with "git status" typed at lightning speed with trembling hands.',
    lesson: 'Never give a hackathon experiment raw unlink privileges. Switch exclusively to Electron shell.trashItem with cryptographic session token boundaries.'
  },
  {
    time: '04:30 AM',
    title: 'Visual Renaissance: 3D Radial Shaders',
    attempt: 'Replace boring lime-green terminal rectangles with something that felt juicy and tangible.',
    reality: 'I spent nearly 2 hours tuning HTML5 Canvas radial gradient offsets, specular highlight angles, and leaf stem bezier curves so the files looked like succulent fruit.',
    visualEvidence: 'Canvas math test page rendering 6 plump 3D candy fruits with specular white reflections.',
    lesson: 'Game feel is 90% juice. If the player is about to send their semester exam notes to the Recycle Bin, the file should at least look delicious.'
  },
  {
    time: '08:00 AM',
    title: 'Synthesizing Audio in 100 Lines of Code',
    attempt: 'Download 8-bit sound packs from free game audio repositories.',
    reality: 'The college hostel Wi-Fi collapsed under the weight of 50 hackathon participants uploading videos. I had zero internet access to download MP3 files.',
    visualEvidence: 'Opening Chrome dev tools and typing "new AudioContext()" directly into the console to test oscillator frequencies.',
    lesson: 'Math is the lightest audio library on earth. A 50-line Web Audio oscillator utility creates infinite sound effects with zero network requests.'
  },
  {
    time: '10:45 AM',
    title: 'Final Packaging & 39 Tests Passing',
    attempt: 'Build Electron executables, generate GitHub Pages bundle to docs/, and pass full Vitest test suite before the 11:00 AM portal lock.',
    reality: 'All 39 unit tests flashed green in 1.3 seconds. Ran "npm run build:pages", verified the 404 SPA fallback, and submitted the link with 15 minutes to spare.',
    visualEvidence: 'Terminal screenshot showing "Test Files 5 passed (5), Tests 39 passed (39)" with clean exit code 0.',
    lesson: 'Ship it before your eyes close. Real engineering is not about having zero bugs; it is about building safeguards so the bugs cannot destroy the user.'
  }
];

// ---------------------------------------------------------------------------
// Interactive Tech Stack Workbench Data
// ---------------------------------------------------------------------------
export const TECH_STACK: TechStackItem[] = [
  {
    id: 'mediapipe',
    name: 'MediaPipe Hand Landmarker',
    category: 'Computer Vision / ML',
    role: '21-Point Optical Hand Tracking',
    whyChosen: 'Runs pre-trained neural networks directly in the browser via WebAssembly GPU delegates with sub-20ms frame latency.',
    quirkOrTrap: 'Low ambient light causes Landmark 20 to jitter by ±15 pixels between frames, requiring custom EMA low-pass filtering.',
    codeSnippet: `const landmarker = await HandLandmarker.createFromOptions(vision, {
  baseOptions: { modelAssetPath: './models/hand_landmarker.task', delegate: 'GPU' },
  runningMode: 'VIDEO',
  numHands: 1
});`
  },
  {
    id: 'vite-react',
    name: 'Vite 5 & React 18',
    category: 'Application Core',
    role: 'Ultra-Fast HMR & Component Architecture',
    whyChosen: 'Sub-second hot module replacement allowed instantaneous tuning of canvas physics and gesture thresholding during the overnight sprint.',
    quirkOrTrap: 'Strict Mode double-mounts caused camera streams to lock up; required careful cleanup refs in useCameraTracker.',
    codeSnippet: `const { stream, status } = useCameraTracker({
  enabled: isCameraActive,
  sensitivity: config.pinkySensitivity,
  onDirection: handleDirection
});`
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS 3',
    category: 'Styling & UI',
    role: 'ObsidianUI-Inspired Tactical Aesthetics',
    whyChosen: 'Enabled rapid building of high-density glassmorphic HUDs, tactile candy-pill buttons, and responsive grid layouts without writing separate CSS sheets.',
    quirkOrTrap: 'Arbitrary values like shadow-[0_20px_60px_rgba(0,0,0,0.65)] require careful escaping in nested components.',
    codeSnippet: `<div className="backdrop-blur-xl bg-slate-950/80 border border-pink-500/30 rounded-3xl p-6 shadow-2xl">
  <button className="btn-candy-pink px-6 py-2.5 rounded-full font-game font-bold">`
  },
  {
    id: 'electron',
    name: 'Electron 34',
    category: 'Native Desktop Shell',
    role: 'OS Recycle Bin Integration via IPC',
    whyChosen: 'Provides the native Node.js bridge to call shell.trashItem(), turning harmless browser snake into a real hard-drive thriller.',
    quirkOrTrap: 'Must strictly validate canonical path containment to prevent path traversal exploits like ../../Windows/System32.',
    codeSnippet: `ipcMain.handle('consume-file', async (_event, { sessionToken, fileId }) => {
  const session = activeSessions.get(sessionToken);
  if (!session) throw new Error('Invalid session');
  const target = session.files.get(fileId);
  await shell.trashItem(target.canonicalPath);
  return { success: true };
});`
  },
  {
    id: 'webaudio',
    name: 'Web Audio API',
    category: 'Audio Synthesis',
    role: '100% Procedural Waveform Synthesizer',
    whyChosen: 'Zero external audio files, zero HTTP requests, and instantaneous trigger latency with custom mathematical envelopes.',
    quirkOrTrap: 'Browsers suspend AudioContext until first user interaction; must call ctx.resume() on the first mouse or key event.',
    codeSnippet: `const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(659.25, ctx.currentTime);
osc.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.08);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.17);`
  },
  {
    id: 'vitest',
    name: 'Vitest 1.6',
    category: 'Automated Testing',
    role: 'Engine, Math & Sandbox Verification',
    whyChosen: 'Executes 39 TypeScript unit tests in under 1.5 seconds directly in ESM, verifying physics ticks, vector normalization, and IPC sandboxing.',
    quirkOrTrap: 'Mocking Node.js fs.realpathSync in browser test environments requires dedicated vi.mock factories.',
    codeSnippet: `describe('Pinky Vector Isolation', () => {
  it('normalizes Landmark 20 relative to knuckle 17 by hand scale', () => {
    const dir = detectDirectionFromLandmarks(mockHand, config);
    expect(dir).toBe('RIGHT');
  });
});`
  }
];

// ---------------------------------------------------------------------------
// Evolution Matrix Data
// ---------------------------------------------------------------------------
export const EVOLUTION_DATA: EvolutionRow[] = [
  {
    version: 'v0.1',
    time: '09:30 PM',
    architecturalShift: 'Bare MediaPipe Landmark extraction pipeline',
    experience: 'Monochrome black canvas, jittery motion, console logs only. Files were plain text names.',
    changelog: [
      'Initialized Vite React project with MediaPipe Tasks Vision',
      'Extracted raw 21 landmark coordinate stream',
      'Primitive HTML5 canvas drawing single green rectangles',
      'No sound, no smoothing, no native file hooks'
    ]
  },
  {
    version: 'v0.4',
    time: '01:00 AM',
    architecturalShift: 'Relative vector normalization & 1-tick input buffering',
    experience: 'Controllable snake with no accidental suicide turns. Smooth directional intent.',
    changelog: [
      'Implemented Landmark 20 vs 17 anatomical delta vector',
      'Applied hand-scale normalization via Landmark 0 to 9 distance',
      'Added dominant-axis filter with 1.05:1 ratio and 0.028 deadzone',
      'Engineered input queue blocking 180° opposite-axis collisions'
    ]
  },
  {
    version: 'v0.7',
    time: '04:30 AM',
    architecturalShift: 'Electron native IPC bridge & OS Recycle Bin integration',
    experience: 'High-stakes Danger Mode unlocked. Real local files mapped to game food.',
    changelog: [
      'Configured Electron preload contextBridge with typed APIs',
      'Integrated shell.trashItem() for safe, recoverable file recycling',
      'Implemented ephemeral cryptographic session tokens (crypto.randomBytes)',
      'Added canonical root path containment to block path traversal'
    ]
  },
  {
    version: 'v0.9',
    time: '07:30 AM',
    architecturalShift: 'Procedural Web Audio synthesizer & 3D canvas fruit shaders',
    experience: 'Plump glossy candy fruits, 8-bit sound effects, and confetti high-score celebrations.',
    changelog: [
      'Created custom procedural audio soundboard with 5 waveform types',
      'Designed 3D radial specular highlight shaders for 6 fruit types',
      'Built candy-pink snake head with directional eye pupil animation',
      'Integrated canvas-confetti for game over victory explosions'
    ]
  },
  {
    version: 'v1.0',
    time: '10:45 AM',
    architecturalShift: 'Hardened security sandbox, 39 Vitest suites, GitHub Pages SPA sync',
    experience: 'Production-ready build running both as desktop app and standalone editorial web devlog.',
    changelog: [
      '100% test coverage across 39 unit tests in Vitest',
      'Dual-routing architecture: Electron boots to LANDING, web boots to JOURNAL',
      'Automated copy-docs.cjs sync duplicating bundled index.html to 404.html',
      'Zero TypeScript compiler warnings or bundle errors'
    ]
  }
];

// ---------------------------------------------------------------------------
// High-Resolution Screenshot Lightbox Data
// ---------------------------------------------------------------------------
export const SCREENSHOTS_DATA: ScreenshotGalleryItem[] = [
  {
    id: 'landing',
    title: 'Landing & Mode Selector Dashboard',
    subtitle: 'The Gateway to Useless Danger',
    src: './screenshots/landing.png',
    badge: 'UI / UX',
    description:
      'The polished candy-pink retro entry point. Players choose between Safe Demo Mode (simulated files, 100% risk-free) or Real Danger Mode (electron-native Recycle Bin integration).',
    techHighlights: [
      '3D radial candy button shaders with tactile press feedback',
      'Dynamic detection of Electron vs Web runtime via isDesktopApp()',
      'Instant access to pinky calibration and folder inspection'
    ]
  },
  {
    id: 'gameplay',
    title: 'Active Gameplay & Pinky Vision HUD',
    subtitle: 'Steering with Landmark 20 in Real Time',
    src: './screenshots/gameplay.png',
    badge: 'Computer Vision & Canvas',
    description:
      'The snake devours local files transformed into glossy 3D candy fruits. The corner HUD tracks the little finger tip with a glowing crosshair and shows directional intent.',
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
    src: './screenshots/settings.png',
    badge: 'State & Configuration',
    description:
      'Comprehensive player settings with reactive sliders for pinky gesture sensitivity, grid dimensions (10x10, 12x12, 16x16), sound volume, and touch D-pad fallback.',
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
    src: './screenshots/gameover.png',
    badge: 'Physics & Audit Trail',
    description:
      'The session summary displaying total score, fruits devoured, and an audit table of files dispatched to the Recycle Bin with direct one-click OS Recycle Bin launcher.',
    techHighlights: [
      'Multi-burst confetti physics powered by canvas-confetti',
      'Audit log of every file operation with timestamps',
      'Direct Windows explorer.exe shell hook to open Recycle Bin'
    ]
  }
];

// ---------------------------------------------------------------------------
// The 16 Main Editorial Chapters — Framed Around Vishnu's Night
// ---------------------------------------------------------------------------
export const CHAPTERS: Chapter[] = [
  // -------------------------------------------------------------------------
  // Chapter 01: The Idea I Didn't Build
  // -------------------------------------------------------------------------
  {
    id: 'chapter-01',
    number: '01',
    sectionNumber: '01',
    title: 'The Idea I Didn\'t Build',
    subtitle: 'I had a plan. Then I got here and dropped it.',
    tag: 'ABANDONED',
    summary:
      'The original idea Vishnu came to UP 3.0 with, and why he walked in the door and immediately decided to drop it so another team could shine.',
    narrative: [
      "I came into Useless Projects 3.0 with an idea. I wasn't going in completely blank. I had something in mind — a silly little thing I'd been thinking about for a while. I was pretty sure it would work.",
      "Then I arrived. And there was already a team working on something along the same lines.",
      "I could have kept going. It wasn't the exact same thing. But it was close enough that it would have been awkward. I didn't want to make it weird for them. So I just dropped it. Just like that.",
      "Now I had nothing. Everyone else was setting up, opening laptops, writing code, drawing diagrams. I was the Outreach Lead going around with my phone, posting TinkerHub Stories, taking event photos, telling other people to document their projects — while internally panicking because I had no project to document myself."
    ],
    scrapbookTag: '[ADD PHOTO: Teams setting up at the start of Useless Projects 3.0]',
    scrapbookTags: [
      '[ADD PHOTO: Teams setting up at the start of Useless Projects 3.0]',
      '[ADD SCREENSHOT: TinkerHub Instagram story from the event opening]'
    ]
  },

  // -------------------------------------------------------------------------
  // Chapter 02: I Had Absolutely Nothing
  // -------------------------------------------------------------------------
  {
    id: 'chapter-02',
    number: '02',
    sectionNumber: '02',
    title: 'I Had Absolutely Nothing',
    subtitle: 'Running outreach for an event while having nothing to build.',
    tag: 'EMPTY',
    summary:
      'The strange chaos of being the Outreach Lead — documenting everyone else — while having no project of your own.',
    narrative: [
      "So there I was. Event's running, teams are building, energy is everywhere — and I have zero ideas.",
      "And the thing is, I couldn't just sit there and stare at the ceiling. I had outreach stuff to do. I was posting Stories, taking photos of teams, making content, replying to messages. My phone was constantly in my hand. I was literally running around telling other people: 'document your process, take photos, don't forget to post this.'",
      "Meanwhile, my own project space was completely empty.",
      "I kept trying to think of something. I'd sit down for five minutes, try to brainstorm, come up with nothing useful, then someone would ping me about an Instagram post and I'd go back to that. This cycle repeated for a while. Hours, honestly.",
      "I wasn't stressed exactly. But I was aware of the clock. Everyone had something. I had outreach work and no project."
    ],
    scrapbookTag: '[ADD VIDEO: 11:58 PM Midnight Computer Lab — Participants buzzing before tea run]',
    scrapbookTags: [
      '[ADD VIDEO: 11:58 PM Midnight Computer Lab — Participants buzzing before tea run]',
      '[ADD PHOTO: Event floor busy with teams building]',
      '[ADD SCREENSHOT: TinkerHub outreach content being created during the event]'
    ]
  },

  // -------------------------------------------------------------------------
  // Chapter 03: The Coffee Break
  // -------------------------------------------------------------------------
  {
    id: 'chapter-03',
    number: '03',
    sectionNumber: '03',
    title: 'The Coffee Break',
    subtitle: 'Nobody was brainstorming. We were just tired and talking.',
    tag: 'ORIGIN',
    summary:
      'The midnight coffee run where DangerPinky\'s core idea was accidentally born — not through brainstorming, but through tired, random conversation.',
    narrative: [
      "By midnight, everyone was getting sleepy. A few of us went to get coffee. Nobody was seriously thinking about anything. We were just tired and talking random stuff.",
      "I don't even remember exactly what we were talking about. Sleep deprivation conversations. The kind where nothing makes sense but everything sounds brilliant.",
      "And somewhere in that, I randomly thought: what if I made a snake game that followed my pinky finger?",
      "I don't know why I thought that. I really don't. It just appeared. My pinky was probably just sitting there awkwardly and I noticed it.",
      "I mentioned it out loud. Someone laughed. I kept thinking about it.",
      "I called it Pinky Snake for about the next thirty minutes. That was the name. Just Pinky Snake. A snake that follows your pinky. That's it. That was the whole idea."
    ],
    scrapbookTag: '[ADD PHOTO: Late night coffee run — tired people, cups, dimly lit space]',
    scrapbookTags: [
      '[ADD PHOTO: Late night coffee — the moment before the idea]',
      '[ADD SKETCH: First napkin sketch of "Pinky Snake" concept]'
    ]
  },

  // -------------------------------------------------------------------------
  // Chapter 04: Pinky Snake
  // -------------------------------------------------------------------------
  {
    id: 'chapter-04',
    number: '04',
    sectionNumber: '04',
    title: 'Pinky Snake',
    subtitle: '"Okay. It technically works." — but why should anyone care?',
    tag: 'PROTOTYPE',
    summary:
      'The raw v0.1 prototype: a working pinky-controlled snake. And the immediate realization that it was way too basic to be interesting.',
    narrative: [
      "I went back and started building it. Camera on. MediaPipe loaded. Landmark 20 is the pinky tip. I extracted the coordinates, hooked them up to direction changes, and within a few hours I had a snake that would actually follow my pinky.",
      "I played it for a bit.",
      "It worked. Okay. The camera saw my pinky. The snake moved. That's... fine.",
      "But I sat back and thought: who cares?",
      "Like, okay, it's a snake game controlled with a finger. That's a party trick. You show it once, someone says 'oh cool', and then they go back to doing whatever they were doing. There's nothing at stake. There's no reason to be nervous. It was just a snake.",
      "At 09:30 PM, I had a working prototype and I wasn't convinced it was worth submitting. The canvas was pitch-black, the snake was a lime-green monochrome square, and the food was literally just text — raw strings like 'file.pdf' rendered on the canvas with no styling at all.",
      "It worked. But it was way too basic. Even for Useless Projects."
    ],
    codeSnippets: [
      {
        title: 'Raw v0.1 — the very first collision check',
        language: 'typescript',
        code: `// 09:30 PM — The bare bones. It worked. Barely.
if (head.x === food.x && head.y === food.y) {
  console.log('[GAME] Devoured ' + food.name);
  score += 10;
  spawnNewFood();
  // TODO: connect to real filesystem before 2 AM!
}`
      }
    ],
    scrapbookTag: '[ADD SCREENSHOT: Raw v0.1 monochrome lime-green snake on black canvas]'
  },

  // -------------------------------------------------------------------------
  // Chapter 05: This Is Too Useless. Even for Useless Projects.
  // -------------------------------------------------------------------------
  {
    id: 'chapter-05',
    number: '05',
    sectionNumber: '05',
    title: 'This Is Too Useless. Even for Useless Projects.',
    subtitle: 'The thought process from "just a snake" to something genuinely dangerous.',
    tag: 'BREAKTHROUGH',
    summary:
      'How Pinky Snake became DangerPinky — the chain of thoughts that added real stakes to the game.',
    narrative: [
      "I kept coming back to the same question: why would anyone care about this?",
      "A pinky-controlled snake is funny for five seconds. Then it's just a snake. You need something at stake. You need a reason for the player to actually be nervous.",
      "I started thinking: what if the pinky was dangerous? What if moving your finger in the wrong direction caused something to actually happen?",
      "Then I thought: what if the snake ate something? And what if that something... disappeared?",
      "Not fruit. Not fake points. An actual file. From your actual computer.",
      "What if the snake ate a file and that file went to the Windows Recycle Bin?",
      "That was the moment. Right there.",
      "Suddenly the whole thing made sense. Pinky Snake becomes DangerPinky. The fruit becomes your actual Downloads folder. Every collision is real. Every file your snake eats is gone — not deleted forever, but recycled, recoverable, but gone from your folder.",
      "Now there's a reason to be nervous. Now there's a reason to play carefully. Now there's a reason this exists."
    ],
    breakthroughs: [
      {
        title: 'Relative Pinky Vector Invariance',
        formula: 'v_rel = (P20 - P17) / ||P9 - P0||',
        description:
          'Anchoring Pinky TIP (Landmark 20) relative to Pinky MCP (Landmark 17), normalized by Hand Scale (Wrist 0 to Middle MCP 9).',
        impact: 'Tracking works perfectly whether sitting 1 foot away or 4 feet away, regardless of camera resolution or hand size.'
      },
      {
        title: 'Dominant Axis & Deadzone Filtering',
        formula: 'dominantAxis = |dx| / |dy| > 1.05 ? HORIZONTAL : VERTICAL',
        description:
          'Discarding all micro-gestures below radius 0.028 and requiring the primary direction to exceed the secondary axis by at least 5%.',
        impact: 'Completely eliminated accidental diagonal turns caused by natural human hand anatomy.'
      },
      {
        title: 'Procedural Oscillator Waveforms',
        formula: 'AudioContext -> OscillatorNode -> GainNode -> destination',
        description:
          'Synthesizing sine chimes, square arpeggios, and sawtooth slides on the fly using native Web Audio API oscillators.',
        impact: 'Zero external audio files, 0KB network payload, and sub-5ms sound trigger response.'
      }
    ],
    scrapbookTag: '[ADD SKETCH: The moment — napkin diagram of Snake + File + Recycle Bin = DangerPinky]'
  },

  // -------------------------------------------------------------------------
  // Chapter 06: I Had Two Jobs That Night
  // -------------------------------------------------------------------------
  {
    id: 'chapter-06',
    number: '06',
    sectionNumber: '06',
    title: 'I Started Building: I Had Two Jobs That Night',
    subtitle: 'Writing code with one hand, holding my phone with the other.',
    tag: 'TWO JOBS',
    summary:
      'The split-screen reality: being the Outreach Lead responsible for documenting the entire event while simultaneously building DangerPinky.',
    narrative: [
      "So now I had the idea. DangerPinky. A snake that eats your files. Okay. Let's build this.",
      "Except — I was still the Outreach Lead. I didn't get a pass on my responsibilities just because I now had a project. The makeathon was happening around me. 50 participants were building. The TinkerHub social channels needed constant updates.",
      "So my night became this absurd split-screen existence. I had two jobs:",
      "JOB 01: Outreach Lead. Posting Instagram Stories, photographing teams at 2 AM, capturing reels, answering participant questions, telling everyone 'document your build!'",
      "JOB 02: Apparent Game Builder. MediaPipe hand tracking, HTML5 Canvas 60 FPS loop, Electron native IPC, procedural Web Audio synthesizer, Vitest test suites.",
      "I was literally writing code with one hand and holding my phone with the other. And the funniest part? I was telling everyone else to document their build while completely forgetting to document my own. I was so busy capturing everyone else's 2 AM struggles that I barely took photos of my own screen."
    ],
    scrapbookTag: '[ADD PHOTO: SNMIMT Computer Lab — 50 builders hacking through the night]',
    scrapbookTags: [
      '[ADD PHOTO: SNMIMT Computer Lab — 50 builders hacking through the night]',
      '[ADD PHOTO: Event atmosphere — Live TinkerHub stories while coding]',
      '[ADD SCREENSHOT: TinkerHub social media posts going up during the build]'
    ]
  },

  // -------------------------------------------------------------------------
  // Chapter 07: The First Time It Actually Moved
  // -------------------------------------------------------------------------
  {
    id: 'chapter-07',
    number: '07',
    sectionNumber: '07',
    title: 'The First Time It Actually Moved',
    subtitle: 'I\'d never built this particular thing before.',
    tag: 'CAMERA MATH',
    summary:
      'Staring at MediaPipe\'s 21 hand landmarks at 10 PM, figuring out why Landmark 20 was telling the snake to kill itself.',
    narrative: [
      "I'd never built this particular thing before.",
      "At some point that night around 10:00 PM, I was staring at MediaPipe's 21 hand landmarks trying to figure out why my pinky kept telling the snake to kill itself.",
      "Landmark 20 was the pinky tip. That coordinate became my entire evening.",
      "Getting the camera to see the pinky wasn't the hard part. MediaPipe gives you 21 landmarks with sub-20ms latency. The hard part was making the snake understand what my pinky was actually trying to do.",
      "My first attempt was just taking Landmark 20's delta between frames. And it moved. But it moved like it was having a seizure.",
      "Human fingers don't sit still. My pinky was moving ±15 pixels between frames just from normal hand tremor and camera sensor noise. The snake was changing direction four times a second without me even moving."
    ],
    codeSnippets: [
      {
        title: 'The actual math — how the pinky vector works',
        language: 'typescript',
        code: `// Relative Pinky Vector Math in pinkyDetector.ts
const tip = landmarks[20];    // Pinky TIP
const knuckle = landmarks[17]; // Pinky MCP (knuckle)
const wrist = landmarks[0];    // Wrist
const middleMcp = landmarks[9]; // Middle MCP

// Hand scale invariant distance
const handScale = Math.hypot(middleMcp.x - wrist.x, middleMcp.y - wrist.y) || 1.0;
const rawDx = (tip.x - knuckle.x) / handScale;
const rawDy = (tip.y - knuckle.y) / handScale;`
      }
    ],
    scrapbookTag: '[ADD SCREENSHOT: First working camera HUD showing landmark dots on hand]'
  },

  // -------------------------------------------------------------------------
  // Chapter 08: My Pinky Was Lying to Me (And Then It Broke)
  // -------------------------------------------------------------------------
  {
    id: 'chapter-08',
    number: '08',
    sectionNumber: '08',
    title: 'My Pinky Was Lying to Me (And Then It Broke)',
    subtitle: 'The computer couldn\'t tell the difference between "turn left" and "I\'m tired."',
    tag: 'BUGS',
    summary:
      'Three critical bugs between midnight and 3 AM: jitter tremors, the 180° suicide turn, and an Electron IPC race condition.',
    narrative: [
      "I thought 30 FPS webcam tracking would be enough. It wasn't.",
      "My finger was making tiny micro-movements that I wasn't consciously making, and the snake treated every single tremor like a full directional command. I had to spend hours teaching the computer the difference between 'Vishnu wants to turn left' and 'Vishnu's pinky moved 3 pixels because he's exhausted.'",
      "Then came the 180° suicide turn. In a normal snake game with arrow keys, pressing LEFT while moving RIGHT does nothing. But with pinky gestures, when you flick your finger right and bring it back to neutral, that return recoil registers as a LEFT flick. The snake immediately reversed into its own neck and died. Over and over.",
      "And then the Electron IPC race condition happened. Devouring three files in rapid succession caused overlapping promises. Files were being recycled faster than Node could resolve them, and state maps corrupted.",
      "That one guard and cryptographic session tokens saved the snake from committing suicide."
    ],
    failureStories: [
      {
        title: 'Bug 1: The Camera Coordinate Jitter Tremors',
        thought: 'I thought 30 FPS webcam landmark tracking would give me clean, steady steering coordinates.',
        tried: 'Calculating instantaneous delta (currentTip.x - prevTip.x) directly on every raw video frame.',
        cause: 'Normal human finger micro-tremors and low-light sensor noise caused Landmark 20 to jump ±15 pixels between frames, reversing direction randomly.',
        fix: 'Implemented an Exponential Moving Average (EMA) smoother with alpha = 0.35 and a normalized deadzone filter threshold of 0.028 hand units.'
      },
      {
        title: 'Bug 2: The 180° Suicide Turn',
        thought: 'If I flick my pinky to the left, the snake should immediately turn left.',
        tried: 'Directly assigning currentDirection = newDirection as soon as the detector fired.',
        cause: 'When returning the pinky to neutral after a rightward flick, the micro-recoil triggered a LEFT intent. The snake immediately collided with segment 1 of its own body.',
        fix: 'Built a 1-tick directional input queue that strictly validates isOppositeDirection(current, next) === false before committing direction changes.'
      },
      {
        title: 'Bug 3: The Electron IPC Race Condition & Deletion Panic',
        thought: 'Just send the file path over the IPC bridge whenever a fruit collision occurs and call the delete method.',
        tried: 'Firing uncoordinated asynchronous window.fileSnakeNative.consumeFile() promises upon each canvas food collision.',
        cause: 'Devouring 2 or 3 fruits in rapid succession caused overlapping filesystem operations, resulting in file locked errors and stale state maps.',
        fix: 'Introduced ephemeral cryptographic session tokens (crypto.randomBytes(16)) and an atomic in_transit state tracking map before triggering shell.trashItem.'
      }
    ],
    scrapbookTags: [
      '[ADD BUG SCREENSHOT: The 180° suicide turn death screen — snake in its own neck]',
      '[ADD TERMINAL LOG: IPC race condition error dump from the deletion test]'
    ]
  },

  // -------------------------------------------------------------------------
  // Chapter 09: The Project Finally Became Stupid Enough
  // -------------------------------------------------------------------------
  {
    id: 'chapter-09',
    number: '09',
    sectionNumber: '09',
    title: 'The Project Finally Became Stupid Enough',
    subtitle: 'When all the pieces clicked and DangerPinky actually made sense.',
    tag: 'CANDY',
    summary:
      'The moment the full stack came together — camera, snake, Electron, audio, candy graphics — and DangerPinky became something genuinely ridiculous and complete.',
    narrative: [
      "Around 04:30 AM, something clicked. Not a single breakthrough — just all the pieces landing at once.",
      "The EMA smoothing was in. The direction buffering was in. The Electron IPC was actually working. I connected real files from my Downloads folder. And when the snake hit one, it disappeared. It actually went to the Recycle Bin.",
      "I sat there for a second.",
      "Then I played it again. And again. And I started laughing at myself a bit, because this was so genuinely dumb. Here I am at 4:30 in the morning, moving my pinky finger to steer a snake, and if I touch the wrong thing, an actual file from my computer gets recycled.",
      "That's the full loop: Pinky → Snake → File → Recycle Bin. That's DangerPinky.",
      "By this point I also had the visual overhaul done — went from lime-green squares to plump 3D candy fruit rendered entirely with HTML5 canvas radial gradients. Apples with specular highlights. Oranges with texture. Grapes in clusters. Strawberries with tiny quadratic curves for the seeds.",
      "It looked ridiculous. In a good way. The whole thing looked like a candy arcade game designed to eat your tax documents."
    ],
    scrapbookTag: '[ADD SCREENSHOT: First working Danger Mode — snake eating real file, Recycle Bin confirmation]'
  },

  // -------------------------------------------------------------------------
  // Chapter 10: While Everyone Else Was Building...
  // -------------------------------------------------------------------------
  {
    id: 'chapter-10',
    number: '10',
    sectionNumber: '10',
    title: 'While Everyone Else Was Building...',
    subtitle: 'The authentic solo builder story of Vishnu K R (SNMIMT Maliyankara)',
    tag: 'SOLO BUILDER',
    summary:
      'What it was like to be the solo builder of DangerPinky — wearing every hat — while simultaneously being responsible for documenting the entire event.',
    narrative: [
      "DangerPinky was built entirely solo by Vishnu K R — that's me — from SNM Institute of Management and Technology (SNMIMT) at Maliyankara, Ernakulam, Kerala.",
      "And I want to be specific about what that meant. Building solo in a hackathon means you're everything. At 07:00 PM I was debugging WebAssembly MIME types. At midnight I was doing canvas math for fruit shaders. At 04:00 AM I was writing security sandboxing. At 07:00 AM I was doing audio synthesis with oscillators. There's no one to hand off to. Every single line of code in this repo was typed by me.",
      "But what made this different from a regular solo build was the outreach work running in parallel. Most participants could just disappear into their code for 18 hours. I couldn't do that. I had a responsibility as the Outreach Lead of TinkerHub SNMIMT — handling the event's social media, capturing other teams' progress, making sure the event was being documented properly.",
      "So the real experience was switching contexts constantly. Write code. Go take photos of another team. Come back. Fix a bug. Post an update. Come back. Refactor something.",
      "There's this quiet irony in it: I was the one telling everyone — document your build, don't forget the process photos, post your progress — and I have barely any photos of my own build. I was too busy documenting everyone else's.",
      "This journal is basically me making up for that."
    ],
    scrapbookTag: '[ADD PHOTO: Vishnu K R at the testing workstation with live webcam HUD]',
    metadata: {
      builder: 'Vishnu K R',
      institution: 'SNM Institute of Management and Technology (SNMIMT)',
      location: 'Maliyankara, Ernakulam, Kerala, India',
      rolesHandled: [
        'Computer Vision & Landmark Math',
        '2D HTML5 Canvas Game Engine',
        'Electron Native IPC & Security Bridge',
        'Procedural Audio Synthesizer',
        'Tailwind UI Design & Responsive Layout',
        'Vitest Test Architecture & QA',
        'TinkerHub SNMIMT Outreach Lead (simultaneously)'
      ]
    }
  },

  // -------------------------------------------------------------------------
  // Chapter 11: I Spent 15 Minutes Debugging an Unplugged Webcam
  // -------------------------------------------------------------------------
  {
    id: 'chapter-11',
    number: '11',
    sectionNumber: '11',
    title: 'I Spent 15 Minutes Debugging an Unplugged Webcam',
    subtitle: '03:45 AM: The line between software bugs and physical reality vanishes.',
    tag: '3:45 AM',
    timestamp: '03:45 AM',
    summary:
      'Waving my pinky like an airline ground controller for 15 minutes before realizing my elbow had unplugged the USB cable.',
    narrative: [
      "At around 03:45 AM, the snake stopped responding to my rightward flicks. Completely dead. I spent fifteen minutes frantically waving my pinky in front of the camera like an airline ground controller directing a plane on the tarmac. I was convinced the MediaPipe WebAssembly model had leaked memory or crashed Chrome.",
      "I opened DevTools. Checked performance profiles. Restarted the Vite dev server. Recompiled the WebAssembly binary. Checked console logs. Nothing. Everything looked fine. The snake just wasn't moving.",
      "Then I looked behind my laptop monitor. My elbow had clipped the webcam USB cable during a particularly dramatic finger flick, pulling it completely out of the socket. The camera wasn't frozen. It was unplugged.",
      "I took a sip of my freezing cold Kerala black tea. Ate a few spicy banana chips. Plugged the webcam back in. Went right back to coding.",
      "That's what 03:45 AM at a makeathon feels like. The room smells like instant noodles and hot laptops. Half the hall is asleep face-down on tables. The other half is in this strange trance where you spend fifteen minutes debugging hardware as a software bug and you just laugh at yourself and keep typing.",
      "The webcam stayed firmly plugged in after that."
    ],
    scrapbookTag: '[ADD PHOTO: Empty tea cups, tangled USB cables, dim room at 3 AM]'
  },

  // -------------------------------------------------------------------------
  // Chapter 12: The Final Push
  // -------------------------------------------------------------------------
  {
    id: 'chapter-12',
    number: '12',
    sectionNumber: '12',
    title: 'The Final Push',
    subtitle: 'One more bug. One more test. One more thing.',
    tag: 'FINAL HOURS',
    timestamp: '06:00 AM to 11:00 AM',
    summary:
      'The morning countdown from 06:00 AM to submission — touch controls, audio synthesis, security tests, and the final build:pages run.',
    narrative: [
      "06:00 AM. The sun was coming up. Five hours left.",
      "The game worked but it wasn't done. I had a list of things that still needed to happen and not much time to do them.",
      "At 06:00 AM, I added touch D-pad fallback controls. Some judges might be on touchscreen laptops. I didn't want them to be locked out because they couldn't do camera calibration.",
      "At 07:30 AM, I wrote the procedural Web Audio synthesizer. The hostel Wi-Fi was completely dead from 50 people uploading videos, so downloading sound packs wasn't an option. I opened the Web Audio API docs and built oscillators from scratch — sine, square, sawtooth. It worked better than any downloaded sound pack would have.",
      "At 08:45 AM, I wrote the security test suites — verifying that system files like desktop.ini, ntuser.dat, and pagefile.sys were filtered out and would never appear as food. Even in a silly game, you don't mess with system files.",
      "At 09:30 AM I did the Game Over modal, score persistence, and confetti.",
      "At 10:15 AM I froze the code and ran npm run build:pages. The 404.html SPA fallback worked. Everything compiled clean.",
      "At 10:45 AM I submitted the link. With 15 minutes to spare.",
      "I sat back. That was it."
    ],
    metadata: {
      finalPushSchedule: [
        { time: '06:00 AM', task: 'Touch D-pad fallback controls for mobile & touchscreen devices' },
        { time: '07:30 AM', task: 'Procedural Web Audio synthesizer and frequency ramp calibration' },
        { time: '08:45 AM', task: 'Security unit tests filtering system files (desktop.ini, ntuser.dat)' },
        { time: '09:30 AM', task: 'Game Over modal, high score persistence, and confetti bursts' },
        { time: '10:15 AM', task: 'Production build freeze & GitHub Pages docs synchronization (build:pages)' },
        { time: '10:45 AM', task: 'Official submission to TinkerHub Useless Projects 3.0 portal' }
      ]
    },
    scrapbookTag: '[ADD VIDEO: 05:18 AM Dawn Lab Fatigue — Pushing through exhaustion to sunrise]',
    scrapbookTags: [
      '[ADD VIDEO: 05:18 AM Dawn Lab Fatigue — Pushing through exhaustion to sunrise]',
      '[ADD SCREENSHOT: Terminal output of vitest showing 39 green test passes]'
    ]
  },

  // -------------------------------------------------------------------------
  // Chapter 13: DangerPinky (What I Actually Built)
  // -------------------------------------------------------------------------
  {
    id: 'chapter-13',
    number: '13',
    sectionNumber: '13',
    title: 'DangerPinky (What I Actually Built)',
    subtitle: 'Remember that pinky snake from the coffee break? It became this.',
    tag: 'THE REVEAL',
    summary:
      'The full system reveal — DangerPinky complete, tested, submitted, and working exactly as the stupid midnight idea described.',
    narrative: [
      "So here it is. DangerPinky.",
      "A snake game. Controlled by your pinky finger. Through a webcam. Running computer vision in the browser using WebAssembly. With real file deletion via Electron. And procedurally synthesized audio. And a 60 FPS deterministic physics engine. And 39 passing tests.",
      "It started as a random thought during a midnight coffee break. It almost died when I realized the first prototype was too basic. It came back to life when I thought: what if the snake ate files?",
      "The full pipeline is: your webcam captures your hand at 30 FPS, MediaPipe isolates the 21 landmarks, the math extracts Landmark 20 relative to Landmark 17 and normalizes it against hand scale, EMA filtering smooths the noise, the direction queue prevents suicide turns, the 60 FPS snake engine advances the game, collisions trigger procedural audio, and when Danger Mode is active, Electron IPC safely sends the file to the Windows Recycle Bin.",
      "That's it. That's DangerPinky. Something genuinely stupid, built with a surprising amount of care."
    ],
    codeSnippets: [
      {
        title: 'Full Pipeline Architecture',
        language: 'text',
        code: `Webcam Video Stream (30 FPS)
  │
  ▼
MediaPipe WASM GPU Delegate (21 Landmarks)
  │
  ▼
Landmark 20 (Pinky TIP) vs Landmark 17 (Knuckle) Math
  │
  ▼
Hand Scale Normalization (Landmark 0 to 9)
  │
  ▼
EMA Filter (alpha = 0.35) + Deadzone (0.028)
  │
  ▼
1-Tick Direction Buffer Queue (Blocks 180° turns)
  │
  ▼
Deterministic 60 FPS Canvas Game Engine
  │
  ├─▶ Procedural Web Audio Synth (Sine / Square / Sawtooth)
  │
  ▼
Electron Native IPC Bridge (Session Token Validation)
  │
  ▼
Windows Recycle Bin (shell.trashItem)`
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Chapter 14: Play DangerPinky
  // -------------------------------------------------------------------------
  {
    id: 'chapter-14',
    number: '14',
    sectionNumber: '14',
    title: 'Okay. Now You Can Delete Something.',
    subtitle: 'Enough reading. Play it.',
    tag: 'PLAY IT',
    summary:
      'The live embedded interactive arena — DangerPinky running directly in this page from the official deployed URL.',
    narrative: [
      "Enough reading. You know the story. You know how it was built. Now actually play it.",
      "Below is the live DangerPinky game embedded directly from the deployed URL. Camera controls your pinky, Arrow Keys or WASD as keyboard fallback.",
      "Because this runs in a web browser, it uses Safe Demo Mode with simulated files — your actual hard drive is safe. To play with real files and send them to the Recycle Bin, run the Electron desktop version."
    ],
    metadata: {
      gameUrl: 'https://vishnuu-kr.github.io/DangerPinky/',
      controls: {
        camera: 'Hold hand 1-2 feet from webcam in good lighting. Flick Landmark 20 pinky tip.',
        keyboard: 'Arrow Keys or W A S D',
        pause: 'Spacebar',
        calibrate: 'Click Camera button in bottom right corner'
      },
      embedOptions: {
        allowFullscreen: true,
        allowCamera: true,
        externalLaunchUrl: 'https://vishnuu-kr.github.io/DangerPinky/'
      }
    }
  },

  // -------------------------------------------------------------------------
  // Chapter 15: What I Actually Learned
  // -------------------------------------------------------------------------
  {
    id: 'chapter-15',
    number: '15',
    sectionNumber: '15',
    title: 'What I Actually Learned',
    subtitle: 'Not just engineering lessons. The actual things I took away from this.',
    tag: 'LESSONS',
    summary:
      'Real reflections from building DangerPinky — about dropping ideas, finding ideas by accident, and what happens when you build something ridiculous with real engineering behind it.',
    narrative: [
      "Three things stuck with me from this.",
      "Lesson 1: Dropping an idea isn't failing. I walked into this event with a plan. I dropped it because someone else was already building something similar. That felt bad for about ten minutes. Then I had nothing for a few hours. And then I had a coffee break and ended up with DangerPinky. I'm not saying abandoning your idea always leads to something better. But in this case it did. Sometimes the thing you're supposed to build isn't the thing you came with.",
      "Lesson 2: The stupid ideas need good engineering. Useless ideas demand the highest level of execution. If DangerPinky had been laggy, crashy, or accidentally deleted files permanently — it would just be broken, irresponsible software. Because it runs at 60 FPS, the computer vision is rock-solid, the safety sandbox is real, and all 39 tests pass — it becomes comedy. The uselessness works because the engineering doesn't fail.",
      "Lesson 3: Computer vision in the browser is actually good now. I'd never built anything with MediaPipe before this. Running WASM GPU delegates in a browser tab with sub-20ms latency, no cloud backend, no privacy concerns — that's genuinely impressive. I expected it to be harder. It wasn't.",
      "Also: always respect the user's hard drive. Even in a joke project. The Recycle Bin integration, the session tokens, the path containment checks — none of that was required for a hackathon submission. But I did it anyway because the alternative was software that could randomly delete files. And that would have been a different kind of useless.",
      "The biggest thing I took away is probably this: I spent the whole event documenting everyone else's process. This journal is me finally documenting mine."
    ]
  },

  // -------------------------------------------------------------------------
  // Chapter 16: If I Had Another Night
  // -------------------------------------------------------------------------
  {
    id: 'chapter-16',
    number: '16',
    sectionNumber: '16',
    title: 'If I Had Another Night',
    subtitle: 'The roadmap of useless ambition.',
    tag: 'ROADMAP',
    summary:
      'What DangerPinky could become with another 18 hours — four genuinely ridiculous feature ideas that did not fit in the makeathon window.',
    narrative: [
      "Eighteen hours is enough to build something and get it working and tested. It's not enough to build everything you think of.",
      "Here's what I would have added if I'd had another night:",
      "First: WebRTC multiplayer. Two players, two webcams, one shared folder. You're both controlling snakes in the same game, racing to eat each other's files. First person to devour the other player's thesis draft wins. That would have been genuinely unhinged and I still want to build it.",
      "Second: Better visual themes. Cyberpunk neon skin, Game Boy 4-shade green mode, high-contrast accessibility colorways. The candy aesthetic is great but options would be nice.",
      "Third: Linux and macOS trash adapters. Right now the native file deletion only works on Windows via shell.trashItem. Linux and macOS need different hooks — gio trash, trash-cli, AppleScript. Getting full cross-platform parity would make DangerPinky actually usable as a real (useless) tool everywhere.",
      "Fourth: Voice shouting speed boost. The Web Speech API or a microphone level detector, where yelling at your laptop gives the snake a temporary turbo speed. I want this to exist in the world."
    ],
    metadata: {
      roadmapItems: [
        {
          title: 'WebRTC Multiplayer Pinky Duels',
          description: 'Two players, two webcams, one shared folder. Race to devour your friend\'s files!',
          tag: 'MULTIPLAYER'
        },
        {
          title: 'Custom Candy Theme Skins',
          description: 'Cyberpunk neon, Game Boy 4-shade green, and high-contrast candy themes.',
          tag: 'VISUALS'
        },
        {
          title: 'Native Linux & macOS Trash Adapters',
          description: 'Direct gio trash and macOS Finder AppleScript hooks for 100% cross-platform parity.',
          tag: 'PLATFORMS'
        },
        {
          title: 'Voice Shouting Speed Boost',
          description: 'Yell at your laptop to activate an emergency turbo speed boost via microphone.',
          tag: 'AUDIO'
        }
      ]
    }
  }
];

// ---------------------------------------------------------------------------
// Final Section: Quiet Poetic Closing & Persistent Link Vault
// ---------------------------------------------------------------------------
export const FINAL_REFLECTION = {
  id: 'closing',
  number: '17',
  sectionNumber: '17',
  title: 'Final Reflection',
  subtitle: 'In praise of making things for no good reason',
  tag: 'EPILOGUE',
  summary:
    'A closing meditation on documentation, absurdity, and the strange irony of the person who was supposed to document everything ending up with the most documented project.',
  narrative: [
    "I came to Useless Projects 3.0 to document everyone else's night.",
    "I was the Outreach Lead. My job was telling everyone: Take photos! Record this! Post that! Don't forget your process notes! Capture the build!",
    "And somewhere in the middle of all that, I ended up building something myself. A snake. Controlled by my pinky. That eats actual files from your hard drive. For no practical reason at all.",
    "TinkerHub Useless Projects is probably my favorite kind of event because there's zero pressure to be practical. Nobody asks for your business model or pitch deck. You just build something absurd and see if you can engineer it cleanly enough that it actually works.",
    "DangerPinky started as an idea I didn't have. Then it became an idea I almost didn't use. Then it became Pinky Snake. Then it almost died from jitter. And then, at 10:45 AM on Sunday morning, it became 116 passing tests, sub-20ms optical tracking, and an authentic makeathon memory.",
    "The person who was supposed to document everything — ended up having the most to document.",
    "Thank you to TinkerHub Foundation, SNMIMT Maliyankara, and everyone who stayed awake with me that night."
  ],
  persistentLinks: PERSISTENT_LINKS,
  footerCredit: 'Handcrafted with ❤️, midnight coffee, and MediaPipe by Vishnu K R for TinkerHub Useless Projects 3.0.',
  copyright: '© 2026 Vishnu K R • DangerPinky Open Source Project'
};

// ---------------------------------------------------------------------------
// Helper Accessor Functions
// ---------------------------------------------------------------------------
export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getChapterByNumber(num: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.number === num || c.sectionNumber === num);
}

export function getAllSectionIds(): string[] {
  return [HERO_DATA.id, PROLOGUE_DATA.id, ...CHAPTERS.map((c) => c.id), FINAL_REFLECTION.id];
}
