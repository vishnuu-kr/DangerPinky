# Handoff Report: DangerPinky Repository Architecture Survey

**Agent**: `teamwork_preview_explorer_survey_1`  
**Role**: Codebase & Architecture Explorer (Survey Phase)  
**Date**: 2026-09-18  
**Report Type**: Hard Handoff (Task Complete)  
**Deliverable File**: `c:\Users\Windows 10\Downloads\DangerPinky\.agents\teamwork_preview_explorer_survey_1\survey_codebase.md`  

---

## 1. Observation

1. **Configurations & Build Tools**:
   - `package.json` (lines 1–44): Project name is `filesnake`, version `1.0.0`, `"type": "module"`, `"main": "dist-electron/main.cjs"`. Scripts include `dev`, `build` (`tsc && vite build`), `build:pages` (`tsc && vite build && node scripts/copy-docs.cjs`), `build:electron` (`esbuild electron/main.ts ...`), `desktop` (`npm run build && npm run build:electron && electron .`), and `test` (`vitest run`).
   - `vite.config.ts` (lines 5–15): Base is set to `./` (`base: './'`), server port is 3000, and `@mediapipe/tasks-vision` is excluded from Vite dependency optimization.
   - `tsconfig.json` (lines 1–25): Strict TypeScript configuration with `"noUnusedLocals": true`, `"noUnusedParameters": true`, targeting `ES2020` and bundling mode `bundler`.
   - `tailwind.config.js` (lines 1–45): Extends theme with custom color palette `snake-*` (greens `#10b981`, pinks `#ec4899`, dark slate `#070b14`), custom font families (`Fredoka` as `font-game`, `JetBrains Mono` as `font-mono`, `Plus Jakarta Sans` as `font-sans`), and custom keyframe animations (`wiggle`, `bounce-gentle`, `pulse-subtle`).
   - `src/index.css` (lines 32–335): Defines complex 3D tactile candy button shaders (`.btn-candy-pink`, `.btn-candy-gold`, `.btn-candy-green`, `.btn-candy-pill`) and 3D candy cards (`.card-candy-pink`, `.card-candy-gold`, `.card-candy-green`, `.card-candy-safety`) utilizing multi-layer gradients, inset specular gloss highlights, and depressed active states.

2. **Entry Points & Navigation**:
   - `index.html` (lines 14–21): Loads Google Fonts for Fredoka, JetBrains Mono, and Plus Jakarta Sans; root div `<div id="root"></div>`; entry script `/src/main.tsx`.
   - `src/main.tsx` (lines 1–11): Mounts `<App />` within `React.StrictMode`.
   - `src/App.tsx` (lines 35–69): Current routing logic:
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
     Currently, `getInitialScreen` checks hash `#game` or `#play`, defaulting to `JOURNAL` for any unhashed entry (including desktop launch).

3. **Desktop Mode & Native OS Recycle Bin Capabilities**:
   - `electron/preload.ts` (lines 4–38): Exposes `window.fileSnakeNative` via `contextBridge.exposeInMainWorld`, setting `isDesktop: true`, and providing IPC methods `getPlatform`, `selectFolder`, `consumeFile`, `disableRealMode`, `openRecycleBin`.
   - `src/filesystem/nativeBridge.ts` (lines 26–28):
     ```ts
     export function isDesktopApp(): boolean {
       return typeof window !== 'undefined' && Boolean(window.fileSnakeNative?.isDesktop);
     }
     ```
   - `electron/main.ts` (lines 21–65, 122–283): Starts an embedded HTTP server on `127.0.0.1:<port>` with explicit MIME mapping for `.wasm` and `.task`. Implements IPC handlers:
     - `fs:selectFolder`: Uses `dialog.showOpenDialog`, scans folder via `electron/scanner.ts`, issues a cryptographically random 16-byte hex `sessionToken`.
     - `fs:consumeFile`: Verifies session token, checks path containment and symlink boundaries using `validatePathContainment` in `electron/securityValidator.ts`, and invokes `await shell.trashItem(containment.canonicalTarget)` to send files to the OS Recycle Bin.
     - `fs:openRecycleBin`: Executes `shell.openPath('shell:RecycleBinFolder')` on Windows and `~/.Trash` on macOS.

4. **Assets & Procedural Audio Engine**:
   - Static files in `public/`:
     - `public/images/danger_pinky_banner.png` (809 KB)
     - `public/snake-icon.svg` (398 B)
     - `public/screenshots/`: `landing.png`, `gameplay.png`, `settings.png`, `gameover.png`
     - `public/models/hand_landmarker.task` (7.8 MB)
     - `public/wasm/`: 6 WASM and JS loader files for MediaPipe Vision tasks.
     - `public/.nojekyll` and `public/404.html`
   - `src/game/audio.ts` (lines 3–222): 100% procedural sound synthesis using native Web Audio API oscillators. Generates distinct waveforms per category:
     - `image`: Sine wave chime E5 (659.25 Hz) to B5 (987.77 Hz)
     - `code`: 8-bit square wave dual arpeggio 440 Hz to 880 Hz
     - `audio`: Triangle wave triple chime C5-E5-G5
     - `video`: Brassy sawtooth swell E4 (329.63 Hz) to 440 Hz
     - `archive`: Sawtooth frequency slide 200 Hz to 600 Hz
     - `document`: Typewriter chime D5 (587.33 Hz) to A5 (880 Hz)
     - `playGameOver`: Sawtooth pitch drop 240 Hz to 55 Hz
     - `playHighScore`: Ascending arpeggio C5 -> E5 -> G5 -> C6

5. **Test Suite & Type Checking**:
   - `vitest run` executed directly via `npm test`: 5 test files, 39 tests passed in 1.45s.
   - `npx tsc --noEmit`: Exited with code 0 (0 errors).

---

## 2. Logic Chain

1. **From Observations to Routing Differentiation**:
   - In `src/App.tsx`, `getInitialScreen` currently inspects only `window.location.hash`. When running inside Electron (`npm run desktop`), the window opens `http://127.0.0.1:${localServerPort}/index.html` without a hash.
   - Because `isDesktopApp()` returns `true` exclusively within Electron, testing `isDesktopApp()` within `getInitialScreen` allows us to cleanly route:
     - If `isDesktopApp()` is true: Default to `'LANDING'` so desktop players can immediately pick folders and play the native game with OS Recycle Bin functionality.
     - If `isDesktopApp()` is false: Default to `'JOURNAL'` so web visitors arriving at the root URL (e.g. GitHub Pages) directly experience the complete 16-chapter Project Journal.
   - Bidirectional navigation remains preserved: web visitors can navigate to `#game` / `'LANDING'` / `'GAME'`, and desktop users can click "Dev Journal" in the Navbar to read the build story.

2. **From Observations to Section 14 Live Game Embedding**:
   - Requirement R1 specifies Section 14 must embed `https://vishnuu-kr.github.io/DangerPinky/` in a responsive iframe with fullscreen toggle, controls hints, and external launch link.
   - In addition, because the game engine, canvas renderer, and hooks are already modularized in `src/game/` and `src/App.tsx`, web visitors can also seamlessly launch the in-app demo game directly from the Journal screen without page reloads.

3. **From Observations to 16-Chapter Storytelling Expansion**:
   - `JournalScreen.tsx` currently contains 887 lines with 6 milestones, a hero section, an audio soundboard, and hardware specs.
   - To satisfy all 16 chapters and ObsidianUI-inspired styling (R1 and R2), `JournalScreen.tsx` should be systematically structured with:
     - Sticky chapter navigation with active scroll tracking.
     - 16 distinct chapter sections with authentic first-person developer copy (Vishnu K R, SNMIMT Maliyankara, 18-hour overnight makeathon).
     - Interactive before/after comparison slider.
     - Image lightbox for screenshot inspection with technical bullet points.
     - Stylized scrapbook annotation placeholders (`[ADD SKETCH PHOTO]`, `[ADD BUG SCREENSHOT]`).
     - Procedural audio soundboard wired directly to `sound` from `src/game/audio.ts`.

---

## 3. Caveats

1. **Network Independence**: The MediaPipe model (`hand_landmarker.task`, 7.8 MB) and WASM binaries are stored locally in `public/models` and `public/wasm/`. No external CDN dependency is required for offline desktop play or local preview, but CDN fallbacks exist in `src/tracking/landmarker.ts` if local WASM loading is blocked by restrictive browser sandbox policies.
2. **Real File Mode Safety in Browsers**: Browsers do not permit arbitrary filesystem file trashing via JavaScript. Web visitors are informed via `BrowserNoticeModal` that Real File Mode is an Electron desktop capability, while Safe Demo Mode works 100% in all modern browsers with webcam access.
3. **No Code Modification Undertaken**: As an explorer in the Survey Phase, this investigation was strictly read-only. No source files were modified.

---

## 4. Conclusion

The DangerPinky repository architecture is clean, modular, and in good health. Both TypeScript compilation (`tsc --noEmit`) and the Vitest test suite (39 tests) pass with zero errors. The system is well-positioned for implementing the complete 16-chapter Project Journal website as the primary web experience, while preserving desktop Electron functionality with full OS Recycle Bin capabilities.

---

## 5. Verification Method

To verify these findings independently, execute:
```powershell
# 1. Run unit test suite (must pass 39/39 tests)
npm test

# 2. Check TypeScript compilation (must exit with code 0)
npx tsc --noEmit

# 3. Test production bundle generation
npm run build

# 4. Verify docs directory synchronization for GitHub Pages
node scripts/copy-docs.cjs

# 5. Inspect architecture survey documentation
Get-Content -Path ".agents/teamwork_preview_explorer_survey_1/survey_codebase.md"
```
