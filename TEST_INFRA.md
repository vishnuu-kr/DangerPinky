# DangerPinky Test Infrastructure & E2E Testing Strategy (Tiers 1–4)

## 1. Quality Philosophy & Testing Principles

The DangerPinky project applies an uncompromising dual-track testing philosophy across both its interactive native desktop game and its standalone editorial Project Journal. Because the project embodies a high-stakes, satirical premise—*a little finger tracking camera steering a snake that sends real files to the OS Recycle Bin*—robust test engineering is required to guarantee complete safety, narrative fidelity, and cross-environment reliability.

### Core Testing Pillars:
1. **Opaque-Box Verification**: Tests validate observable behaviors, output specifications, interface contracts, and DOM/data invariants without coupling to private internal variables.
2. **Zero Facade Tests**: Every test exercises real code, real mathematical algorithms, and real data structures. Tests that unconditionally assert `true` or trivially mimic implementations are prohibited.
3. **Dual-Track Environment Isolation**: Tests rigorously distinguish between native Electron desktop mode (with OS Recycle Bin integration) and browser web mode (with simulated files and editorial devlog).
4. **Authoritative Derivation**: Test assertions are derived strictly from `PROJECT.md`, `ORIGINAL_REQUEST.md`, and `editorial_specs.md`.
5. **Progressive Testability & Independence**: Each test suite initializes its own state, isolates mocks, and avoids execution-order coupling.

---

## 2. Test Architecture & Directory Organization

The DangerPinky test suite is organized into distinct layers co-located within `src/tests/` and execution scripts:

```
DangerPinky/
├── src/
│   ├── tests/
│   │   ├── journalRequirements.test.ts  # [NEW] Tiers 1-3 Editorial, Metadata, Routing, Audio & Iframe specs
│   │   ├── gameEngine.test.ts           # Tier 1-2 Deterministic snake physics, 180° turn prevention, collision
│   │   ├── pinkyTracking.test.ts        # Tier 1-2 Landmark 20 extraction, EMA smoothing, deadzones
│   │   ├── filesystem.test.ts           # Tier 1-2 Demo file parsing, categorization, and scan results
│   │   ├── securityValidator.test.ts    # Tier 1-3 Symlink containment, forbidden files, session tokens
│   │   ├── engineTransaction.test.ts    # Tier 2-3 Concurrent file consumption, atomic state transactions
│   │   └── browser-e2e.mjs              # Tier 4 Playwright automated browser flow
│   ├── data/
│   │   └── journalChapters.ts           # Authoritative 18-section editorial data registry
│   ├── filesystem/nativeBridge.ts       # isDesktopApp() runtime bridge
│   └── game/audio.ts                    # Procedural Web Audio API synthesizer
├── scripts/
│   ├── copy-docs.cjs                    # Build sync script (dist/ -> docs/ + 404.html + .nojekyll)
│   ├── test-local-server.cjs            # Local desktop integration runner
│   ├── verify-real-mode.ts              # Danger mode native bridge verification
│   └── verify-candy-settings.cjs        # Settings persistence verification
├── TEST_INFRA.md                        # This document: Comprehensive testing strategy
└── TEST_READY.md                        # Final verification certificate
```

---

## 3. Four-Tier Testing Framework

### Tier 1: Feature Coverage (Happy Path & Interface Contracts)
Tier 1 establishes that all declared functional units, user stories, and editorial sections exist, follow their interface contracts, and return expected results under valid operating conditions.

- **Editorial Completeness (All 18 Sections)**:
  - Verifies presence of Opening Hero, all 16 chronological/thematic chapters, and Final Reflection.
  - Verifies sequential IDs (`hero`, `chapter-01` through `chapter-16`, `closing`).
  - Verifies each chapter contains non-empty titles, subtitles, and substantive first-person narrative arrays.
- **Ground-Truth Project Metadata**:
  - Creator: **Vishnu K R**
  - Institution: **SNM Institute of Management and Technology (SNMIMT), Maliyankara**
  - Sprint Duration: **18-Hour Overnight Makeathon**
  - Hackathon: **TinkerHub Useless Projects 3.0**
- **External Evidence Linkage**:
  - Deployed Game: `https://vishnuu-kr.github.io/DangerPinky/`
  - GitHub Repo: `https://github.com/vishnuu-kr/DangerPinky`
  - Demo Video: `https://drive.google.com/file/d/1aIiCRxT6f9T7WfaB7Iu2qHBtmiiLmvXs/view?usp=drive_link`
  - Build Photos: `https://drive.google.com/file/d/17yqRVJh22dZAFbSfJG2-ILG1PS2boy4O/view?usp=drive_link`
  - Asset Vault: `https://drive.google.com/drive/folders/1u7BUqhHbVeiD0sxTesiC41KkblEXHwSi?usp=sharing`
- **Audio Soundboard Mappings**:
  - Validates that Web Audio procedural synthesizer handles 5 distinct audio triggers:
    1. `image`: Sine wave chime ($659.25\text{ Hz} \to 987.77\text{ Hz}$, $0.17\text{s}$)
    2. `code`: Square wave 8-bit arpeggio ($440\text{ Hz} \to 880\text{ Hz}$, $0.15\text{s}$)
    3. `archive`: Sawtooth frequency slide ($200\text{ Hz} \to 600\text{ Hz}$, $0.16\text{s}$)
    4. `highscore`: Triangle fanfare chord sequence ($523.25, 659.25, 783.99, 1046.5\text{ Hz}$)
    5. `gameover`: Descending sawtooth slide ($240\text{ Hz} \to 55\text{ Hz}$, $0.50\text{s}$)
- **Interactive Embedded Arena (Section 14)**:
  - Iframe target source: `https://vishnuu-kr.github.io/DangerPinky/`
  - Permission flags: `allow="camera; autoplay; fullscreen"`
  - Direct external link targets new tab with `rel="noopener noreferrer"`.
- **Scrapbook Annotation Hooks**:
  - Verifies presence of labeled physical evidence placeholders (`[ADD SKETCH PHOTO]`, `[ADD BUG SCREENSHOT]`, etc.).

---

### Tier 2: Boundary & Corner Cases (Adversarial & Edge Scenarios)
Tier 2 stress-tests boundary limits, filters out invalid state transitions, and enforces negative constraints.

- **Non-Corporate Voice & Buzzword Prohibition**:
  - Adversarial scanner checks all chapter texts, subtitles, summaries, and quotes against a blacklist of corporate jargon:
    - `"leveraging innovative technologies"`
    - `"iterative design process"`
    - `"synergistic"` / `"synergy"`
    - `"paradigm shift"` / `"paradigm"`
    - `"seamlessly integrated"`
    - `"holistic approach"`
    - `"actionable insights"`
    - `"scalable cloud infrastructure"`
    - `"next-generation solution"`
    - `"mission-critical"`
- **Desktop vs Web Routing Behavior**:
  - Tests `getInitialScreen()` logic under multiple permutations:
    - Web browser with empty hash $\to$ `'JOURNAL'`
    - Web browser with `#game` or `#play` hash $\to$ `'LANDING'`
    - Web browser with `#journal` hash $\to$ `'JOURNAL'`
    - Desktop Electron environment (`isDesktopApp() === true`) $\to$ `'LANDING'`
    - Desktop Electron with `#journal` explicit override $\to$ `'JOURNAL'`
- **Computer Vision Signal Processing Limits**:
  - **Deadzone Threshold**: Tip movement with magnitude $< 0.028$ hand units must be rejected as tremor noise.
  - **Dominant Axis Ratio**: Vectors where dominant axis is less than $1.05\times$ secondary axis must be discarded to prevent accidental diagonal flips.
  - **Smoothing Filter**: Validates Exponential Moving Average with $\alpha = 0.35$ dampens sudden coordinate spikes.
- **Engine Invariant: 180° Suicide Turn Blocker**:
  - Moving `RIGHT` and inputting `LEFT` $\to$ rejected immediately.
  - Moving `UP` and inputting `DOWN` $\to$ rejected immediately.
  - Opposite directions buffered or ignored so the snake never collides into its own neck segment on the next tick.
- **Filesystem Security Boundaries**:
  - Path traversal attempts (e.g., `../../Windows/System32`) must fail canonical containment check.
  - Blacklisted filenames (`desktop.ini`, `ntuser.dat`, `pagefile.sys`, `.git`) must be rejected from scanning.

---

### Tier 3: Cross-Feature Interactions & Architectural Coupling
Tier 3 ensures that independent subsystems interact harmoniously across asynchronous boundaries.

- **Tracking State Machine $\leftrightarrow$ Game Loop Auto-Pause**:
  - When gesture tracking is active and `PINKY_LOST` fires, the game loop automatically transitions to `PAUSED`.
  - When `PINKY_TRACKED` resumes, game unpauses seamlessly.
  - If player presses keyboard controls (WASD/Arrows), keyboard mode overrides pinky lost pause, allowing uninterrupted gameplay.
- **Sound Engine $\leftrightarrow$ Fruit Devouring Events**:
  - Eating an image file (`.png`) triggers `playEatSound('image')`.
  - Eating a script file (`.ts`) triggers `playEatSound('code')`.
  - Eating an archive file (`.zip`) triggers `playEatSound('archive')`.
- **Electron Native Bridge $\leftrightarrow$ Atomic Session Containment**:
  - Real Danger Mode creates an ephemeral 16-byte cryptographic session token.
  - File consumption requests require matching session token and folder root path.
  - If a file is in flight (`in_transit`), duplicate consumption calls are prevented.
- **Build & SPA Documentation Pipeline**:
  - Running `copy-docs.cjs` must duplicate `dist/` into `docs/`.
  - Ensures `docs/.nojekyll` exists for GitHub Pages asset routing.
  - Ensures `docs/404.html` mirrors `dist/index.html` to handle client-side routing on GitHub Pages.

---

### Tier 4: Real-World Scenarios & Operational Environments
Tier 4 validates the end-to-end user experience in realistic operational conditions.

- **Web Browser Experience (GitHub Pages)**:
  - A user visiting the root URL is greeted by the full 16-chapter Project Journal.
  - Smooth-scrolling sticky navigation tracks chapter reading progress.
  - Soundboard synthesizes real audio upon user click without requiring external asset network requests.
  - Section 14 iframe renders the live playable game.
- **Desktop Electron App Experience (`npm run desktop`)**:
  - The application opens directly into the Game Hub (`'LANDING'`).
  - Native folder picker accesses local folders.
  - Recycled files move to the actual Windows Recycle Bin via `shell.trashItem`.
- **Mobile & Touchscreen Fallback**:
  - Chapter navigation adapts to a touch-scrollable pill carousel.
  - Onscreen Touch D-pad controls enable complete game interaction without camera or keyboard.

---

## 4. Test Execution & CI Automation Commands

| Purpose | Command | Target / Scope | Expected Exit / Output |
|---|---|---|---|
| **Automated Unit & Requirements Tests** | `npm test` | Vitest across all `src/tests/*.test.ts` | 0 errors, 100% test pass |
| **TypeScript Strict Compilation** | `npx tsc --noEmit` | Strict type checking across `src/` | 0 errors |
| **Production Bundle Build** | `npm run build` | Vite packaging to `dist/` | Generated clean assets |
| **GitHub Pages Synchronization** | `npm run build:pages` | Build + `scripts/copy-docs.cjs` | `docs/` synced with `.nojekyll` and `404.html` |
| **Desktop Local Server Verification** | `npm run test:desktop` | Electron local bridge verification | Headless electron success |
| **Native Real-Mode Security Audit** | `npm run test:real-mode` | Native IPC token verification | All security checks pass |
