# DangerPinky Build, Verification & Test Systems Survey

**Author**: `teamwork_preview_explorer_survey_2` (Build & Test Suite Explorer)  
**Date**: 2026-09-18  
**Repository**: `DangerPinky` (Package: `filesnake`, v1.0.0)  
**Working Directory**: `c:\Users\Windows 10\Downloads\DangerPinky`  
**Automated Test Suite Status**: **39 / 39 tests passing** (`vitest run` in 1.38s)  
**TypeScript Compilation Status**: **0 errors** (`npx tsc --noEmit`)  
**Production Build Status**: **Clean bundle generation** (`dist/` & `docs/` synced)

---

## 1. Executive Summary & Verification Matrix

DangerPinky features a multi-target build and verification pipeline supporting two distinct runtime environments:
1. **GitHub Pages Web Experience**: A static web application hosted from the `docs/` folder, featuring relative asset paths (`base: './'`), Jekyll suppression (`.nojekyll`), client fallback (`404.html`), and on-device MediaPipe WASM computer vision.
2. **Electron Desktop Application**: A native desktop application (`npm run desktop`) with Node.js 18 integration, local HTTP server (`http://127.0.0.1:<port>`), camera permission bypass, and native OS Recycle Bin/Trash file transactions (`shell.trashItem`).

### System Verification Matrix (Verified Baseline)

| Command / Script | Target / Tool | Current Output / Status | Exit Code | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `npm test` | `vitest run` | **39 passed** (5 test files) in 1.38s | `0` | Pure unit/logic tests; fast execution in Node environment. |
| `npx tsc --noEmit` | TypeScript 5.5.2 | **0 errors, 0 warnings** | `0` | Strict flags enabled (`noUnusedLocals`, `noUnusedParameters`). |
| `npm run build` | `tsc && vite build` | **Clean build** in 4.51s; outputs to `dist/` | `0` | Generates minified CSS (56 kB), JS (466 kB), HTML (1.62 kB). |
| `npm run build:pages` | `tsc && vite build && copy-docs` | **Clean build + sync** in 4.83s | `0` | Copies entire `dist/` tree to `docs/` using `scripts/copy-docs.cjs`. |
| `npm run build:electron` | `esbuild` | **Bundled** `main.cjs` (17.4 kB) & `preload.cjs` (1.5 kB) | `0` | Targets Node 18, bundles in <15ms. |

---

## 2. Examination of `package.json` Scripts

The repository defines 11 scripts in `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "build:pages": "tsc && vite build && node scripts/copy-docs.cjs",
  "build:electron": "esbuild electron/main.ts --bundle --platform=node --target=node18 --external:electron --outfile=dist-electron/main.cjs && esbuild electron/preload.ts --bundle --platform=node --target=node18 --external:electron --outfile=dist-electron/preload.cjs",
  "start": "electron .",
  "desktop": "npm run build && npm run build:electron && electron .",
  "preview": "vite preview",
  "test": "vitest run",
  "test:desktop": "electron scripts/test-local-server.cjs",
  "test:real-mode": "esbuild scripts/verify-real-mode.ts --bundle --platform=node --target=node18 --external:electron --outfile=dist-scripts/verify-real-mode.cjs && electron dist-scripts/verify-real-mode.cjs",
  "verify:settings": "electron scripts/verify-candy-settings.cjs"
}
```

### Script Profiles & Behaviors

1. **`npm run dev` (`vite`)**:
   - Launches the Vite development server on port 3000 (`http://localhost:3000`).
   - Supports Hot Module Replacement (HMR) for React components and Tailwind CSS.
2. **`npm run build` (`tsc && vite build`)**:
   - Phase 1: `tsc` typechecks the entire codebase according to `tsconfig.json` (`noEmit: true`). Any unused variables, unused imports, or type errors halt the build.
   - Phase 2: `vite build` bundles the client into `dist/`. All static assets from `public/` (`models/`, `wasm/`, `screenshots/`, `images/`, `.nojekyll`, `404.html`) are copied to `dist/`.
3. **`npm run build:pages` (`tsc && vite build && node scripts/copy-docs.cjs`)**:
   - Executes standard build, then invokes `scripts/copy-docs.cjs` to mirror `dist/` directly into `docs/` for GitHub Pages hosting.
4. **`npm run build:electron`**:
   - Uses `esbuild` to compile TypeScript Electron entry points:
     - `electron/main.ts` $\rightarrow$ `dist-electron/main.cjs`
     - `electron/preload.ts` $\rightarrow$ `dist-electron/preload.cjs`
   - Configured with `--platform=node --target=node18 --external:electron`.
5. **`npm run desktop` (`npm run build && npm run build:electron && electron .`)**:
   - Full end-to-end desktop workflow: builds the web client to `dist/`, compiles Electron main/preload scripts, and boots the native Electron window.
6. **`npm test` (`vitest run`)**:
   - Single-run execution of the test suite. All 39 tests run in ~1.38s.
7. **Electron Automation / Verification Scripts**:
   - `test:desktop`: Headless verification that embedded HTTP server serves WASM/model assets and initializes MediaPipe.
   - `test:real-mode`: Verifies native filesystem scanning, system file exclusion, containment sandboxing, and Recycle Bin file operations.
   - `verify:settings`: Automates opening the settings modal and capturing screenshots.

---

## 3. Deep Dive into the Automated Test Suite (The 39 Tests)

All 39 automated tests reside in `src/tests/` across 5 test suites. All 39 pass cleanly:

```
 RUN  v1.6.1 C:/Users/Windows 10/Downloads/DangerPinky

 ✓ src/tests/securityValidator.test.ts  (7 tests) 21ms
 ✓ src/tests/filesystem.test.ts  (6 tests) 8ms
 ✓ src/tests/gameEngine.test.ts  (13 tests) 12ms
 ✓ src/tests/engineTransaction.test.ts  (3 tests) 7ms
 ✓ src/tests/pinkyTracking.test.ts  (10 tests) 11ms

 Test Files  5 passed (5)
      Tests  39 passed (39)
```

### 3.1. `src/tests/securityValidator.test.ts` (7 Tests)
Tests the containment logic in `electron/securityValidator.ts`:
- `allows files located directly inside the selected folder`: Verifies that a file inside the root test directory is allowed.
- `allows files in subdirectories within the selected folder`: Verifies that nested files inside subfolders are allowed.
- `strictly BLOCKS files located outside the selected folder`: Verifies that files outside the selected directory are rejected.
- `strictly BLOCKS path traversal attempts using ../`: Verifies that `../` relative traversal paths are detected and blocked.
- `strictly BLOCKS system and hidden files`: Asserts that `isSafeUserFile()` returns `false` for `.git`, `.DS_Store`, `desktop.ini`, `Thumbs.db`, `ntuser.dat`, and `true` for standard user files (`photo.jpg`, `report.pdf`, `script.py`).
- `rejects targets that do not exist`: Returns `allowed: false` with reason `does not exist`.
- `rejects directories as target files`: Verifies that directory paths cannot be targeted for file consumption (`not a regular file`).

### 3.2. `src/tests/filesystem.test.ts` (6 Tests)
Tests file categorization and utility formatters in `src/filesystem/`:
- `correctly extracts file extensions`: Tests lowercase normalization and multi-dot handling (`photo.jpg` $\rightarrow$ `jpg`, `ARCHIVE.ZIP` $\rightarrow$ `zip`, `archive.tar.gz` $\rightarrow$ `gz`, `Dockerfile` $\rightarrow$ `""`).
- `classifies filenames into correct categories`: Verifies classification into `image`, `video`, `audio`, `document`, `code`, `archive`, and `other`.
- `falls back to mimeType when extension is missing or unusual`: Validates fallback to MIME types (e.g. `image/webp` $\rightarrow$ `image`).
- `generates a rich library of demo files with all categories`: Asserts `getDemoFiles()` returns $\ge 20$ files spanning all 6 categories.
- `formats byte sizes cleanly`: Tests `formatFileSize` for `0 B`, `1.0 KB`, `4.5 MB`, `2.0 GB`.
- `formats durations in mm:ss format`: Tests `formatDuration` for `00:00`, `00:45`, `01:35`, `60:00`.

### 3.3. `src/tests/gameEngine.test.ts` (13 Tests)
Tests the core deterministic snake engine in `src/game/engine.ts`:
- `initializes snake with 4 segments centered on the grid`: Verifies initial length (4), direction (`RIGHT`), alive state (`true`), and centered coordinates.
- `rejects direct 180-degree reverse turns for all direction pairs`: Prevents immediate reverse turns (RIGHT $\rightarrow$ LEFT, UP $\rightarrow$ DOWN, LEFT $\rightarrow$ RIGHT, DOWN $\rightarrow$ UP).
- `wraps around seamlessly across all 4 boundaries without dying (V2 Wrap-Around)`: Exhaustively tests boundary wrapping on all 4 borders (RIGHT $\rightarrow$ x=0, TOP $\rightarrow$ y=max, BOTTOM $\rightarrow$ y=0, LEFT $\rightarrow$ x=max).
- `triggers game over on self-collision when snake loops into its own body`: Verifies self-collision detection when length is 7 and head enters body coordinates.
- `operates correctly with a single file in the folder (Test 23)`: Verifies single-file folder resilience without crashing or infinite spawning loops.
- `preserves active game state and score during non-destructive config updates`: Ensures `updateConfig()` does not reset score or snake length.
- `moves head forward on step`: Verifies grid increment upon `step()`.
- `maintains continuous file collection and growth across wrap-around boundaries (Section 17)`: Verifies eating food located on a wrap-around boundary.
- `wraps around borders when gameMode is WRAP`: Reconfirms wrap behavior in WRAP mode.
- `handles eating food, growing body, and increasing score`: Verifies score increment, body growth, and `filesEaten` audit record.
- `calculates dynamic tick speed scaling as files are eaten`: Verifies speed scaling in `DYNAMIC` difficulty from 140ms down to 120ms after eating 4 items.
- `triggers game over with WALL_COLLISION when gameMode is CLASSIC and snake hits borders`: Verifies boundary collisions trigger game over in CLASSIC mode on all 4 walls.
- `triggers victory when snake fills the entire board (gameWon: true)`: Verifies that filling all cells on the grid triggers `gameWon: true`.

### 3.4. `src/tests/engineTransaction.test.ts` (3 Tests)
Tests transactional consumption used during Electron native Real Danger Mode:
- `detects collidedFood on step without immediately modifying score or growing snake`: In transactional mode (`autoConsume: false`), stepping onto food flags `collidedFood` but does NOT increment score or grow the snake until confirmed.
- `commits food consumption upon successful transaction`: Calling `commitFoodConsumption()` records score, increments eaten files, and schedules growth for the next step.
- `cancels food consumption safely when transaction fails (e.g. locked or missing file)`: Calling `cancelFoodConsumption()` leaves score at 0, leaves snake length unchanged, and spawns replacement food so the game is not stuck.

### 3.5. `src/tests/pinkyTracking.test.ts` (10 Tests)
Tests mathematical filtering and gesture detection in `src/tracking/`:
- `smooths coordinates with Exponential Moving Average`: Verifies `ExponentialSmoothingFilter` weighting.
- `smooths coordinates with Moving Average`: Verifies window averaging in `MovingAverageFilter`.
- `ignores tiny tracking noise below threshold`: Verifies jitter $<0.005$ is discarded without triggering direction changes.
- `rejects whole-hand translation (Test 8: Whole-Hand Movement Test)`: When the whole hand moves $(+0.12, +0.08)$ but the pinky remains stationary relative to the palm, no direction is detected.
- `rejects movements of other fingers (Test 9: Other Finger Test)`: Vigorous movement of thumb, index, middle, or ring fingers does not trigger pinky direction.
- `detects pinky flick RIGHT when moving pinky right`: Asserts physical right flick registers `RIGHT` (with camera mirror inversion handled).
- `detects pinky flick LEFT when moving pinky left`: Asserts physical left flick registers `LEFT`.
- `detects pinky flick UP when moving pinky up`: Asserts screen upward movement registers `UP`.
- `detects pinky flick DOWN when moving pinky down`: Asserts screen downward movement registers `DOWN`.
- `cycles through 4-direction calibration correctly`: Tests the 4-step interactive calibration sequence (`RIGHT` $\rightarrow$ `LEFT` $\rightarrow$ `UP` $\rightarrow$ `DOWN` $\rightarrow$ finished).

---

## 4. Vitest Configuration, Environment, and Mocks Analysis

### Configuration Architecture
- **No separate `vitest.config.ts`**: Vitest seamlessly detects and inherits settings from `vite.config.ts`.
- **Environment**: Runs in the default Node.js environment (`environment: 'node'`).
- **No jsdom / happy-dom installed**: Dev dependencies in `package.json` do not include `jsdom`. All 39 existing unit tests test pure TypeScript logic, mathematical filters, and data structures.
- **Speed**: The complete test suite runs in under 1.5 seconds.

### Test Fixtures & Mocks
- **In-memory Hand Skeleton Fixture (`createRestingHand`)**: In `pinkyTracking.test.ts`, a synthetic 21-landmark array is constructed representing standard MediaPipe hand landmarks (wrist landmark 0, MCP/PIP/DIP/TIP landmarks 17–20 for pinky).
- **Filesystem Demo Generator (`getDemoFiles`)**: Used across `filesystem.test.ts`, `gameEngine.test.ts`, and `engineTransaction.test.ts` to supply realistic `GameFile` objects.
- **Disk Sandbox Fixture**: In `securityValidator.test.ts`, real temporary directories are created in `os.tmpdir()` using Node's `fs.mkdtempSync` and cleaned up in `afterAll`.
- **No External Network or GPU Mocking Needed**: Computer vision tests test the math layers (`PinkyDetector`, `ExponentialSmoothingFilter`, `MovingAverageFilter`, `CalibrationManager`) directly without requiring live webcam hardware or WebGL/WASM delegates.

---

## 5. Build Pipeline & Bundling Mechanics

### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision']
  }
})
```

- **`base: './'`**: Essential for GitHub Pages subpath hosting (`https://vishnuu-kr.github.io/DangerPinky/`) and Electron file loading. All asset URLs in generated HTML/CSS use relative `./assets/...` paths.
- **`optimizeDeps.exclude: ['@mediapipe/tasks-vision']`**: Prevents Vite from attempting to bundle heavy pre-compiled MediaPipe C++ WASM web workers into the client chunk.

### TypeScript Strictness (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**Critical Guardrail for New Code**:
Because `"noUnusedLocals": true` and `"noUnusedParameters": true` are active, any unused variable, unused import (e.g. from `lucide-react`), or unused parameter in any new component or chapter will immediately cause `tsc` to fail, which halts `npm run build` and `npm run build:pages`.

---

## 6. Scripts Directory (`scripts/`) Deep Dive

The `scripts/` directory contains 7 scripts:

| Script | Type | Function & Analysis |
| :--- | :--- | :--- |
| `scripts/copy-docs.cjs` | CommonJS | Copies `dist/` to `docs/` recursively via `fs.cpSync(srcDir, destDir, { recursive: true })`. Essential for `npm run build:pages`. |
| `scripts/test-local-server.cjs` | Electron CJS | Launches a headless Electron browser window pointing to embedded HTTP server on port 0, verifies media device permissions, and asserts MediaPipe landmarker initialization. |
| `scripts/test-landmarker-init.cjs` | Electron CJS | Tests `@mediapipe/tasks-vision` initialization with GPU delegate and verifies CPU fallback logic. |
| `scripts/test-mediapipe-fetch.cjs` | Electron CJS | Verifies `window.__getHandLandmarker` availability in renderer. |
| `scripts/verify-candy-settings.cjs` | Electron CJS | Automated headless script that clicks "Play Demo", clicks settings, verifies `#settings-modal` exists in DOM, and captures screenshots. |
| `scripts/verify-real-mode.ts` | TypeScript | Creates temporary sandbox files, executes `scanNativeDirectory()`, verifies system file exclusion, tests containment, and moves files to Recycle Bin via `shell.trashItem()`. |
| `scripts/capture-landing.cjs` | Electron CJS | Standalone script for screenshot capture. |

---

## 7. `dist/`, `docs/`, and GitHub Pages Requirements

### Requirements for Clean GitHub Pages Deployment
1. **Target Directory**: GitHub Pages is configured to serve from the repository's `/docs` directory.
2. **`.nojekyll` File**:
   - Location: `public/.nojekyll`, `dist/.nojekyll`, `docs/.nojekyll`.
   - Purpose: By default, GitHub Pages processes sites with Jekyll. Jekyll suppresses directories and files starting with underscores and can interfere with `.task` model files and `.wasm` binaries. The `.nojekyll` marker disables Jekyll completely.
3. **`404.html` File**:
   - Location: `public/404.html`, `dist/404.html`, `docs/404.html`.
   - Purpose: GitHub Pages serves `404.html` when a user navigates to an unrecognized path or directly refreshes a deep link.
   - **Key Finding / Bug Risk**: In `public/404.html`, line 20 currently references `<script type="module" src="/src/main.tsx"></script>`. In production GitHub Pages, `/src/main.tsx` is NOT served. For production resilience, `docs/404.html` should be kept in sync with the compiled `dist/index.html` bundle or contain an SPA redirect script.
4. **Static Binary Assets (`models/` & `wasm/`)**:
   - `public/models/hand_landmarker.task` (7.8 MB)
   - `public/wasm/vision_wasm_internal.*` (~33 MB across 6 files)
   - Both directories are automatically copied by Vite into `dist/` and by `scripts/copy-docs.cjs` into `docs/`.

---

## 8. Dependency & Potential Breakage Analysis for Project Journal

When adding the comprehensive 16-chapter Project Journal and interactive widgets (ObsidianUI gradients, Web Audio soundboard, before/after comparison slider, image lightbox, and sticky chapter navigation), the following dependency and breakage risks must be managed:

### Risk 1: Electron Desktop Mode Default Screen Regression (Requirement R3)
- **Current Behavior**: In `src/App.tsx`:
  ```typescript
  const getInitialScreen = (): 'LANDING' | 'GAME' | 'JOURNAL' => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#game' || hash === '#play') return 'LANDING';
      return 'JOURNAL';
    }
    return 'JOURNAL';
  };
```
- **The Issue**: When running `npm run desktop`, Electron starts with an empty hash (`/index.html`). Because `isDesktopApp()` is not checked in `getInitialScreen()`, Electron will default to opening the Project Journal rather than the game dashboard!
- **Requirement R3**: "Ensure that when running inside Electron (`npm run desktop`), the native game still functions with full OS Recycle Bin capability, while web visitors directly experience the full Project Journal."
- **Required Fix**: Update `getInitialScreen()`:
  ```typescript
  const getInitialScreen = (): 'LANDING' | 'GAME' | 'JOURNAL' => {
    if (typeof window !== 'undefined') {
      if (isDesktopApp()) return 'LANDING';
      const hash = window.location.hash.toLowerCase();
      if (hash === '#game' || hash === '#play') return 'LANDING';
      return 'JOURNAL';
    }
    return 'JOURNAL';
  };
  ```

### Risk 2: TypeScript Compilation Failures (`noUnusedLocals`, `noUnusedParameters`)
- Any unused import from `lucide-react`, unused prop, or unused local variable in any of the 16 chapters will cause `npx tsc --noEmit` to fail with exit code 2.
- **Rule**: Implementers must run `npx tsc --noEmit` before considering any component complete.

### Risk 3: Test Suite Regression (39 Tests Must Stay 39)
- None of the existing 39 tests should be modified or deleted.
- The Project Journal is purely additive. It lives in `src/components/JournalScreen.tsx` (and subcomponents) and consumes existing utilities (`src/game/audio.ts`, `src/filesystem/nativeBridge.ts`).
- New components must not mutate game engine defaults or change function signatures of `SnakeEngine`, `PinkyDetector`, or `validatePathContainment`.

### Risk 4: Procedural Audio Synthesizer Integration
- Requirement R2 requires an interactive procedural soundboard playing waveforms (`image chime`, `code arpeggio`, `archive thud`, `fanfare`, `game over`).
- All of these oscillators are already implemented in `src/game/audio.ts` via `sound`:
  - `sound.playEatSound('image')` $\rightarrow$ Crisp bright bell tone (E5 to B5 sine)
  - `sound.playEatSound('code')` $\rightarrow$ 8-bit retro dual jump arpeggio (440 to 880 square)
  - `sound.playEatSound('archive')` $\rightarrow$ Zippy frequency slide / thud (sawtooth 200 to 600)
  - `sound.playHighScore()` $\rightarrow$ Fanfare arpeggio (C5, E5, G5, C6 triangle)
  - `sound.playGameOver()` $\rightarrow$ Sawtooth downward plunge (240 to 55)
  - `sound.playGestureTick()` $\rightarrow$ Crisp tick
- Re-implementing oscillators in React state is unnecessary and can cause AudioContext suspension issues on mobile browsers. Utilizing `import { sound } from '../game/audio'` guarantees unified volume/mute state.

### Risk 5: Embedded Game Iframe Permissions (Section 14)
- Section 14 embeds `https://vishnuu-kr.github.io/DangerPinky/`.
- The iframe must declare `allow="camera; microphone; fullscreen; autoplay"` so the player can test camera tracking inside the frame if they choose, while providing explicit external launch fallback buttons.

---

## 9. Recommendations & Verification Checklist for Implementation

1. **Keep `npm test` passing (39/39)**:
   - Run `npm test` after any edits.
2. **Keep `npx tsc --noEmit` clean (0 errors)**:
   - Check strict typing, no unused imports.
3. **Verify `npm run build:pages`**:
   - Ensures `dist/` builds and `docs/` is updated.
4. **Ensure `docs/404.html` reflects production build**:
   - Verify `scripts/copy-docs.cjs` syncs `dist/index.html` to `docs/404.html` so direct GitHub Pages deep links work without attempting to load `/src/main.tsx`.
5. **Verify Desktop Mode**:
   - Ensure `isDesktopApp()` opens `LANDING` screen when running in Electron.
