# Codebase & Architecture Survey: DangerPinky Repository

**Author**: `teamwork_preview_explorer_survey_1` (Codebase & Architecture Explorer)  
**Date**: 2026-09-18  
**Repository**: `DangerPinky` (Package name: `filesnake`, v1.0.0)  
**Working Directory**: `c:\Users\Windows 10\Downloads\DangerPinky`  
**Test Suite Status**: 39 / 39 passing (`vitest run`)  
**TypeScript Status**: 0 errors (`npx tsc --noEmit`)  

---

## 1. Executive Architectural Summary

DangerPinky is a hybrid React + TypeScript + Vite + Tailwind CSS + Electron application built for the **TinkerHub Useless Projects 3.0** hackathon. It functions both as an arcade game where players steer a cute pink snake using optical pinky finger gestures via MediaPipe Hand Landmarker, and as an operating system Russian Roulette game where eaten fruits correspond to local user files that get safely moved to the operating system's Recycle Bin / Trash.

The codebase is engineered with strict separation of concerns across:
1. **Game Engine & Rendering** (`src/game/`): Deterministic 60 FPS tick-based grid snake engine, directional queue input buffer with suicide 180° turn prevention, dual-tone checkered canvas renderer, and 3D radial candy fruit shaders with floating file badges.
2. **Computer Vision & Tracking** (`src/tracking/`): MediaPipe Hand Landmarker WASM pipeline isolating Landmark 20 (Pinky TIP) relative to palm anchors (Landmarks 0 & 9), filtered by Exponential Moving Average (EMA) and deadzone thresholding to reject whole-hand translation noise.
3. **Electron Native IPC Sandbox** (`electron/` & `src/filesystem/nativeBridge.ts`): Cryptographic session tokens, strict path containment validation, symlink traversal prevention, and `shell.trashItem` integration.
4. **Procedural Audio Synthesizer** (`src/game/audio.ts`): 100% code-generated procedural sound effects using Web Audio API oscillators and gain envelopes with zero external audio assets.
5. **Presentation & Storytelling** (`src/components/`): 3D tactile candy button/card design system, game HUD, modals, and the Project Journal screen.

---

## 2. Repository & Package Configuration Analysis

### `package.json`
- **Name**: `filesnake` (v1.0.0, private, ESM module `"type": "module"`).
- **Electron Main Entry**: `"main": "dist-electron/main.cjs"`.
- **Key Dependencies**:
  - `@mediapipe/tasks-vision` (^0.10.14): On-device hand landmarker WASM bundle.
  - `canvas-confetti` (^1.9.3): Victory/gameover confetti particle effects.
  - `clsx` (^2.1.1) & `tailwind-merge` (^2.3.0): Utility class composition.
  - `lucide-react` (^0.395.0): Clean SVG icon set.
  - `react` / `react-dom` (^18.3.1): UI framework.
- **Key Dev Dependencies**:
  - `electron` (^44.3.0): Desktop shell runtime.
  - `vite` (^5.3.1) & `@vitejs/plugin-react` (^4.3.1): Bundler and dev server.
  - `vitest` (^1.6.0): Unit test runner.
  - `typescript` (^5.5.2): Static typing.
  - `tailwindcss` (^3.4.4) & `autoprefixer` (^10.4.19) & `postcss` (^8.4.38).
- **Scripts**:
  - `dev`: `vite` (Port 3000).
  - `build`: `tsc && vite build` (Outputs to `dist/`).
  - `build:pages`: `tsc && vite build && node scripts/copy-docs.cjs` (Synchronizes `dist/` to `docs/` for GitHub Pages).
  - `build:electron`: Bundles `electron/main.ts` and `electron/preload.ts` to `dist-electron/main.cjs` and `dist-electron/preload.cjs` using `esbuild`.
  - `desktop`: `npm run build && npm run build:electron && electron .` (Full desktop build and launch).
  - `test`: `vitest run` (Executes 39 automated tests).
  - `test:desktop`: `electron scripts/test-local-server.cjs`.

### `vite.config.ts`
- Base URL is explicitly set to relative: `base: './'`. This is essential because it allows both GitHub Pages (`https://<user>.github.io/<repo>/`) and Electron's local embedded server (`http://127.0.0.1:<port>/index.html`) or `file://` protocol to load bundled assets without 404 pathing errors.
- `optimizeDeps.exclude: ['@mediapipe/tasks-vision']`: Prevents Vite from attempting to pre-bundle the heavy MediaPipe WASM and web worker loaders.

### `tsconfig.json` & `tsconfig.node.json`
- Target: `ES2020`, Module: `ESNext`, JSX: `react-jsx`.
- Strict mode is turned on: `"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`, `"noFallthroughCasesInSwitch": true`.
- Included files: `["src"]`. Any unused parameter or import inside `src/` will cause `tsc --noEmit` and `npm run build` to fail immediately.

### `tailwind.config.js` & `postcss.config.js`
- Content paths: `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`.
- Theme extensions:
  - Custom snake palette: `snake-950` (`#070b14`), `snake-900` (`#0c1222`), `snake-850`, `snake-800`, `snake-700`, `snake-green` (`#10b981`), `snake-greenLight`, `snake-greenDark`, `snake-pinky` (`#ec4899`), `snake-pinkyLight` (`#f472b6`), `snake-pinkyDark` (`#db2777`).
  - Custom typography fonts: `font-game` (`Fredoka`), `font-mono` (`JetBrains Mono`), `font-sans` (`Plus Jakarta Sans`).
  - Keyframe animations: `pulse-subtle`, `bounce-gentle`, and `wiggle` (rotates between -3deg and 3deg).

---

## 3. Entry Points & Routing Architecture

### `index.html`
- Links Google Fonts for `Fredoka` (500, 600, 700), `JetBrains Mono` (400, 500, 600, 700), and `Plus Jakarta Sans` (400, 500, 600, 700, 800).
- Sets body styling: `bg-[#070b14] text-slate-100 min-h-screen selection:bg-pink-500 selection:text-white font-sans antialiased overflow-x-hidden`.
- Mounts `<div id="root"></div>` and scripts `/src/main.tsx`.

### `src/main.tsx`
- Standard React 18 root mounting with `React.StrictMode` wrapping `<App />` and importing `./index.css`.

### `src/App.tsx` (Current State & Routing Mechanism)
- Screens: `'LANDING' | 'GAME' | 'JOURNAL'`.
- Synchronizes with `window.location.hash` (`#game` / `#play` -> `LANDING`, `#journal` -> `JOURNAL`).
- Component tree:
  - `Navbar`: Header shown on `LANDING` and `JOURNAL` screens.
  - `LandingScreen`: Hero banner, mode selectors (Safe Demo vs Danger Mode), Pinky Cam setup CTA, feature cards, and "Read Dev Journal" banner.
  - `JournalScreen`: 887-line devlog component currently displaying introductory chapters, media links, milestone timeline, audio soundboard, and hardware specs.
  - `<main>` (Game Screen): Unified board enclosure containing `GameHUD`, `GameCanvas`, `TouchControls`, `CameraCornerHUD`, and modal controllers (`CameraSetupModal`, `FolderPickerModal`, `PauseModal`, `GameOverModal`, `RealModeConfirmModal`, `BrowserNoticeModal`, `SettingsModal`).

---

## 4. Native Desktop Mode vs Web Mode Architecture

### Desktop Execution Lifecycle (`npm run desktop`)
1. **Compilation**: `esbuild` compiles `electron/main.ts` -> `dist-electron/main.cjs` and `electron/preload.ts` -> `dist-electron/preload.cjs`. Vite builds frontend -> `dist/`.
2. **Main Process Initialization** (`electron/main.ts`):
   - Command-line switches enable camera/media device access (`--enable-experimental-web-platform-features`, `--enable-features=MediaStream`).
   - `startEmbeddedServer()` creates an internal HTTP server on `127.0.0.1:<ephemeral-port>` serving `dist/` with explicit MIME types (`.wasm`, `.task`, `.html`, `.js`, etc.).
   - Electron opens `BrowserWindow` with `preload: dist-electron/preload.cjs`, `nodeIntegration: false`, `contextIsolation: true`.
   - `session.defaultSession.setPermissionRequestHandler` automatically grants camera permissions for Pinky Tracking.
3. **Preload Context Bridge** (`electron/preload.ts`):
   - Exposes `window.fileSnakeNative`:
     - `isDesktop: true`
     - `getPlatform()` -> invokes `'fs:getPlatform'`
     - `selectFolder()` -> invokes `'fs:selectFolder'`
     - `consumeFile(sessionToken, fileId)` -> invokes `'fs:consumeFile'`
     - `disableRealMode()` -> invokes `'fs:disableRealMode'`
     - `openRecycleBin()` -> invokes `'fs:openRecycleBin'`

### OS Recycle Bin & Real File Mode Security Sandbox
- When a user chooses "Danger Mode" in desktop:
  - `fs:selectFolder`: Opens OS native folder picker dialog (`dialog.showOpenDialog`).
  - Directory scanning (`electron/scanner.ts`): Recursively walks the directory up to 500 files, excluding forbidden directories (`node_modules`, `.git`, `.vscode`, `dist`, `$recycle.bin`, `windows`, etc.) and system files (`desktop.ini`, `thumbs.db`, `.ds_store`, `ntuser.dat`).
  - Opaque IDs: Generates opaque file IDs (`f-<hex>`) and an ephemeral 32-character hexadecimal `sessionToken`. The renderer never sees absolute file system paths.
  - Path Containment & Symlink Validation (`electron/securityValidator.ts`): When `consumeFile` is called, `validatePathContainment` verifies that:
    1. The target file is within the canonical root (`fs.realpathSync`).
    2. Symlinks or NTFS junctions that escape the root folder are blocked (`..` traversal check).
    3. The file is a regular file and not a system file.
  - OS Recycle Bin Operation: Calls Electron's `shell.trashItem(canonicalTarget)`. This sends the file directly to the native Windows Recycle Bin (or macOS `~/.Trash`), ensuring **zero permanent data loss**—any devoured file is easily recoverable.
  - `fs:openRecycleBin`: Executes `shell.openPath('shell:RecycleBinFolder')` on Windows or `~/.Trash` on macOS, allowing the user to view devoured files with one click.

### Clean Differentiation & Routing Strategy
In `src/filesystem/nativeBridge.ts`:
```ts
export function isDesktopApp(): boolean {
  return typeof window !== 'undefined' && Boolean(window.fileSnakeNative?.isDesktop);
}
```
Currently in `src/App.tsx`:
```ts
const getInitialScreen = (): 'LANDING' | 'GAME' | 'JOURNAL' => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#game' || hash === '#play') return 'LANDING';
    return 'JOURNAL';
  }
  return 'JOURNAL';
};
```
**Architecture Gap & Clean Solution**:
- **On Web** (`isDesktopApp() === false`):
  - Web visitors opening the root URL should immediately land on the comprehensive **Project Journal** (`'JOURNAL'`).
  - Section 14 ("Play DangerPinky") embeds the live game via a responsive iframe (`https://vishnuu-kr.github.io/DangerPinky/`) or allows switching into the game via `#game` / `onStartDemo`.
- **On Desktop** (`isDesktopApp() === true`):
  - Desktop users running `npm run desktop` launched the app to play the native game with OS Recycle Bin capabilities.
  - Therefore, `getInitialScreen` should inspect `isDesktopApp()`: if true, default to `'LANDING'` (the game landing hub) unless `#journal` is explicitly set.
  - In `Navbar`, desktop users can still click "Dev Journal" to view the build story anytime, while web users can jump between chapters or launch the game.

---

## 5. UI Systems, Styling & Components

### 3D Candy Button & Card CSS System (`src/index.css`)
The project features a tactile, glossy "3D candy" visual identity inspired by arcade machines:
1. `.btn-candy-pink`: Multi-stop linear gradient (`#ff65ad` -> `#ff207f` -> `#d80064`), rounded pill border with `inset` specular gloss highlights, 7px bottom edge shadow (`#750033`), and hover/active depressed transform feedback.
2. `.btn-candy-gold`: Amber/gold danger theme (`#fff05a` -> `#ffba00` -> `#e67700`) with deep brown bottom border (`#8a3f00`) and bounce animation.
3. `.btn-candy-green`: Emerald green safe theme (`#4ce689` -> `#10b981` -> `#047857`) for safe demo mode.
4. `.btn-candy-pill`: Subtle translucent glass pills with inset highlights for HUD controls and secondary actions.
5. `.card-candy-pink`, `.card-candy-gold`, `.card-candy-green`, `.card-candy-safety`: Feature containers with top-lit curvilinear specular highlights (`::before`), colored drop shadows, and responsive elevation.

### Existing Component Inventory
| Component | Path | Size | Primary Function |
|---|---|---|---|
| `App.tsx` | `src/App.tsx` | 19.9 KB | Master app controller, navigation routing, game loop & tracker state sync, modal rendering |
| `Navbar.tsx` | `src/components/Navbar.tsx` | 4.8 KB | Global header with brand badge, Game Hub vs Dev Journal switcher, and external links |
| `JournalScreen.tsx` | `src/components/JournalScreen.tsx` | 49.1 KB | Project Journal screen (currently 6 milestones, hero, video demo, audio soundboard, hardware specs) |
| `LandingScreen.tsx` | `src/components/LandingScreen.tsx` | 13.9 KB | Game entry dashboard with 3D candy cards, banner, mode selection |
| `GameHUD.tsx` | `src/components/GameHUD.tsx` | 10.8 KB | In-game scoreboard, high score, folder label, mute/pause/camera toggles |
| `GameCanvas.tsx` | `src/components/GameCanvas.tsx` | 3.1 KB | Canvas mount with responsive aspect-square wrapper, countdown overlay, floating point notes |
| `CameraCornerHUD.tsx`| `src/components/CameraCornerHUD.tsx` | 7.8 KB | Draggable/floating corner PIP showing live webcam feed, pinky crosshair, status pill |
| `CameraSetupModal.tsx`| `src/components/CameraSetupModal.tsx`| 13.7 KB | Camera permissions, sensitivity slider, calibration test screen |
| `FolderPickerModal.tsx`| `src/components/FolderPickerModal.tsx`| 12.9 KB | File preview table, category breakdown pills, simulated demo folder selector |
| `PauseModal.tsx` | `src/components/PauseModal.tsx` | 4.4 KB | Pause overlay with resume, restart, settings, quit, and pinky-lost resume status |
| `GameOverModal.tsx` | `src/components/GameOverModal.tsx` | 9.2 KB | Game over modal with score recap, confetti trigger, eaten files table, open Recycle Bin button |
| `SettingsModal.tsx` | `src/components/SettingsModal.tsx` | 13.5 KB | Grid size (10, 12, 16), difficulty, pinky sensitivity, sound volume, touch controls toggle |
| `TouchControls.tsx` | `src/components/TouchControls.tsx` | 2.3 KB | On-screen touch D-pad for mobile/tablet devices |
| `RealModeConfirmModal.tsx`| `src/components/RealModeConfirmModal.tsx`| 7.4 KB | High-stakes safety warning modal explaining Recycle Bin behavior before starting real mode |
| `BrowserNoticeModal.tsx`| `src/components/BrowserNoticeModal.tsx` | 3.7 KB | Explains to browser visitors that Real Mode requires the Electron desktop app |

---

## 6. Computer Vision & Pinky Tracking Pipeline

### The MediaPipe Hand Landmarker (`src/tracking/landmarker.ts`)
- Utilizes Google's `@mediapipe/tasks-vision` `HandLandmarker`.
- Loads from local assets first (`/wasm` and `/models/hand_landmarker.task`), with automatic fallback to jsdelivr CDN if local files are blocked or unavailable.
- Attempts GPU WebGL delegate first; if unavailable, seamlessly falls back to CPU delegate.

### Pinky Feature Extraction & Geometry (`src/tracking/pinkyDetector.ts`)
- MediaPipe outputs 21 3D hand landmarks.
- DangerPinky isolates:
  - Landmark 0: Wrist
  - Landmark 9: Middle MCP (anatomical palm center anchor)
  - Landmark 17: Pinky MCP (knuckle base)
  - Landmark 18: Pinky PIP
  - Landmark 19: Pinky DIP
  - Landmark 20: Pinky TIP (primary directional cursor)
- **Relative Vector Normalization**: To prevent player whole-hand motion from falsely steering the snake, the detector measures the pinky tip vector **relative to the palm center** (Landmarks 0 & 9), normalized by hand size (distance between wrist and middle MCP).
- **Coordinate Smoothing**: Uses an Exponential Moving Average (EMA) filter with alpha `0.35` (`smoothed = alpha * current + (1 - alpha) * previous`).
- **Dead-Zone Thresholding**: Configurable deadzone based on sensitivity (1 to 5, default 3 is 0.028 normalized units). Tiny ambient finger tremors are discarded.
- **Direction Lockout**: Enforces a 120ms cooldown between direction triggers to prevent stuttering.

---

## 7. Procedural Audio Engine (`src/game/audio.ts`)

The project contains **zero external MP3 or WAV files**. Every sound is procedurally synthesized in real time via the browser's native `AudioContext`:
1. **Image Fruit Chime**: Crisp bright sine wave tone starting at E5 (659.25 Hz) and exponentially ramping to B5 (987.77 Hz) over 160ms.
2. **Code Fruit Arpeggio**: Retro 8-bit square wave jumping from 440 Hz (A4) to 880 Hz (A5) over 140ms.
3. **Audio Fruit Chime**: Triangle wave triple chime at C5 (523.25 Hz) -> E5 (659.25 Hz) -> G5 (783.99 Hz) over 200ms.
4. **Video Fruit Swell**: Brassy sawtooth wave swell from E4 (329.63 Hz) to 440.0 Hz over 180ms.
5. **Archive Fruit Thud**: Sawtooth pitch slide ramping from 200 Hz to 600 Hz over 150ms.
6. **Document Fruit Chime**: Typewriter chime with sine wave snap from D5 (587.33 Hz) to A5 (880 Hz).
7. **Game Over**: Heavy sawtooth pitch drop plunging from 240 Hz down to 55 Hz over 500ms.
8. **High Score Fanfare**: Ascending arpeggio across C5 -> E5 -> G5 -> C6 (1046.5 Hz).
9. **Countdown**: Sine beeps (440 Hz for 3, 2, 1; 880 Hz for GO).
10. **Gesture Tick**: Subtle high-frequency chirp (700 -> 900 Hz, 50ms) confirming pinky detection.

All methods are exposed via the exported singleton `sound` (`import { sound } from '../game/audio'`), with `setMuted()` and `setVolume()` controls.

---

## 8. Asset Inventory

### Static Assets in `public/` & Root
- `public/images/danger_pinky_banner.png` (809 KB): Official wide hero banner showing the candy pink snake and retro arcade branding.
- `public/snake-icon.svg`: Vector icon of the snake head.
- `public/screenshots/`:
  - `landing.png` (646 KB): High-res capture of the landing dashboard.
  - `gameplay.png` (325 KB): In-game canvas with pinky corner HUD, fruit badges, and garden board.
  - `settings.png` (646 KB): Settings configuration modal.
  - `gameover.png` (115 KB): Game over summary modal with confetti and file audit table.
- `public/models/hand_landmarker.task` (7.8 MB): Google MediaPipe hand landmarker model.
- `public/wasm/`: MediaPipe vision WASM binaries (`vision_wasm_internal.wasm`, `vision_wasm_nosimd_internal.wasm`, etc.).
- `public/.nojekyll` & `public/404.html`: GitHub Pages static routing configuration.

### External Reference Materials
- **Existing Deployed Game**: `https://vishnuu-kr.github.io/DangerPinky/`
- **Official GitHub Repo**: `https://github.com/vishnuu-kr/DangerPinky`
- **Google Drive Live Video Demo**: `https://drive.google.com/file/d/1aIiCRxT6f9T7WfaB7Iu2qHBtmiiLmvXs/view?usp=drive_link`
- **Physical Build Photos**: `https://drive.google.com/file/d/17yqRVJh22dZAFbSfJG2-ILG1PS2boy4O/view?usp=drive_link`
- **Full Asset Drive Folder**: `https://drive.google.com/drive/folders/1u7BUqhHbVeiD0sxTesiC41KkblEXHwSi?usp=sharing`

---

## 9. Verification & Build Health

### Automated Test Suite (`npm test`)
- Runner: `vitest run` (v1.6.1)
- Results: **5 test files, 39 passed (100%), 0 failures**
  - `src/tests/filesystem.test.ts` (6 tests): Mock file generation, category classification, search filtering, size formatting.
  - `src/tests/engineTransaction.test.ts` (3 tests): Atomic file consumption state, duplicate prevention, session rollback.
  - `src/tests/securityValidator.test.ts` (7 tests): Path traversal blocking (`../`), sandbox boundary confinement, system/hidden file filtering (`desktop.ini`, `.git`, `.DS_Store`), non-existent path rejection.
  - `src/tests/pinkyTracking.test.ts` (10 tests): Coordinate EMA smoothing, moving average, deadzone threshold rejection, whole-hand translation invariance (Test 8), mirrored axis flips.
  - `src/tests/gameEngine.test.ts` (13 tests): Grid collision, 180° turn suicide rejection, input buffering, wall wrapping vs wall death, speed acceleration curves.

### TypeScript Compilation (`npx tsc --noEmit`)
- Verified: **0 errors**. Codebase strictly conforms to TypeScript 5.5 compiler checks.

### Production Bundling (`npm run build` & `npm run build:pages`)
- Production bundles cleanly output to `dist/`.
- `scripts/copy-docs.cjs` syncs `dist/` to `docs/` with `.nojekyll` and `404.html` intact for instant GitHub Pages deployment.

---

## 10. Recommendations for Project Journal Implementation

Based on our architectural survey, the following implementation roadmap will fulfill all requirements in `ORIGINAL_REQUEST.md`:

1. **Routing & Entry Point**:
   - Update `src/App.tsx`'s initial screen logic:
     - If `isDesktopApp()` is true -> Default to `'LANDING'` so native desktop users can immediately select folders and play in Real File Mode.
     - If `isDesktopApp()` is false -> Default to `'JOURNAL'` so web visitors arriving at the root URL directly experience the full Project Journal.
   - Retain full bidirectional navigation: users can jump between the Journal and Game Hub via the Navbar, floating footer pills, or URL hash (`#journal` vs `#game`).

2. **16-Chapter Editorial Narrative Architecture (`JournalScreen.tsx`)**:
   - Expand `JournalScreen.tsx` (or modularize into chapter components) to render all 16 chapters in authentic first-person developer voice (Vishnu K R, SNMIMT Maliyankara, 18-hour overnight makeathon):
     - Opening: Hero with "Somewhere between a stupid idea and a working game, DangerPinky happened", metadata badge, and "START THE JOURNEY ↓" smooth scroll button.
     - Section 01: Before DangerPinky (why CCleaner lacks dopamine, digital hoarding scrapbook).
     - Section 02: The Build Begins (hour-by-hour overnight makeathon timeline: 5:00 PM kickoff to morning submission).
     - Section 03: The First Prototype ("Okay. It technically works." vs final build).
     - Section 04: The Things That Broke (camera coordinate noise, 180° suicide turns, Electron IPC race conditions).
     - Section 05: The "Oh." (Breakthrough moments: EMA smoothing, deadzone thresholding, Web Audio oscillator synthesis).
     - Section 06: How DangerPinky Changed (evolution timeline v0.1 to final).
     - Section 07: Design Journey (dark terminal to candy-pink tactile aesthetic, 3D radial fruit shaders).
     - Section 08: Technical Learning (MediaPipe WASM GPU delegates, Landmark 20 extraction, deterministic 60fps game loop, Electron security tokens).
     - Section 09: Tools & Experiments (interactive workbench documenting MediaPipe, Vite, React, Tailwind, Electron, Web Audio API, Vitest).
     - Section 10: Team Contribution (Vishnu K R solo builder story).
     - Section 11: The Chaos (overnight makeathon atmosphere, midnight debugging).
     - Section 12: The Final Push (rapid-fire timeline entries leading to submission).
     - Section 13: The Final Result (cinematic reveal of DangerPinky).
     - Section 14: Play DangerPinky ("Enough reading. Play it." - embedded responsive iframe of `https://vishnuu-kr.github.io/DangerPinky/` with fullscreen toggle, controls hints, and external link).
     - Section 15: What We Learned (honest reflections).
     - Section 16: If We Had More Time (roadmap: multiplayer pinky duels, custom themes, Mac/Linux trash adapters).
     - Final Section: Quiet, poetic closing reflection and persistent project links.

3. **Interactive Editorial UI Elements**:
   - **Sticky Chapter Navigation**: Smooth-scrolling sidebar/toc reflecting active section on scroll.
   - **Interactive Procedural Audio Soundboard**: Re-using `sound` from `src/game/audio.ts` to trigger procedural waveforms.
   - **Interactive Before/After Comparison Widget**: Prototype vs final comparison slider.
   - **Image Lightbox Modal**: High-res screenshot inspector with bulleted engineering highlights.
   - **Scrapbook Annotation Placeholders**: Distinctive `[ADD SKETCH PHOTO]`, `[ADD BUG SCREENSHOT]` stylized drop-in tags.

4. **Zero Regressions**:
   - Ensure all 39 Vitest tests continue to pass.
   - Ensure `npx tsc --noEmit` remains at 0 errors.
   - Ensure `npm run build` and `npm run build:pages` produce a complete `docs/` folder ready for GitHub Pages hosting.
