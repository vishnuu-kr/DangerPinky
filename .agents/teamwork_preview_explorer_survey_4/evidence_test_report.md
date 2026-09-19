# DangerPinky Visual Evidence, ARCHIVE SLOT & Test Suite Survey Report

**Author**: `teamwork_preview_explorer_survey_4` (Explorer: Visual Evidence & Tests Survey)  
**Date**: 2026-09-18  
**Scope**: `src/tests/*`, `src/components/journal/*`, `src/data/journalChapters.ts`, `src/App.tsx`, `public/screenshots/`, and Requirements R1–R4 from `ORIGINAL_REQUEST.md` (2026-09-18T13:39:23Z).

---

## 1. Executive Summary & Survey Scope

This survey investigates the existing test suite, visual evidence presentation, scrapbook placeholder components, and architectural integrity of the DangerPinky Project Journal. Our goal is to equip test writers and frontend implementers with precise findings, concrete regression boundaries, and actionable implementation blueprints to fulfill Requirements R1–R4:

1. **Test Suite Baseline**: The current automated test suite consists of 7 test files executing **115 passing tests** in Vitest (`npm test` passes in ~1.3 seconds). TypeScript check (`npx tsc --noEmit`) passes with 0 errors. The production build (`npm run build`) bundles cleanly in ~3.8 seconds.
2. **Critical Test Breakage Risks**:
   - **Scrapbook Tag Assertion**: `src/tests/journalRequirements.test.ts` (lines 484–510) strictly asserts that every tag must begin with `[ADD ` and end with `]`. Changing chapter data directly to `ARCHIVE SLOT: [...]` without updating the test assertion will cause immediate test failure.
   - **Mandatory Narrative Keywords**: 13 chapters have hard-coded keyword assertions (e.g. `CCleaner`, `Downloads folder`, `2,400`, `EMA`, `0.35`, `isOppositeDirection`, `session tokens`, `shell.trashItem`, `P20`, `P17`, `1.05`, `MediaPipe`, `WASM`, `Vishnu K R`, `SNM Institute of Management and Technology`, `airline ground controller`, `unplugged`). Rewriting copy to eliminate corporate buzzwords must preserve these exact ground-truth tokens.
   - **PlayEmbedSection Source Code Verification**: `src/tests/adversarialChallenger.test.ts` (lines 386–409) executes an exact substring check on `src/components/journal/PlayEmbedSection.tsx` for 8 specific strings (`allow="camera; autoplay; fullscreen"`, `title="DangerPinky Live Game"`, `loading="lazy"`, `target="_blank"`, `rel="noopener noreferrer"`, `e.key === 'Escape'`, `window.removeEventListener('keydown', handleKeyDown)`, `setReloadKey`). These must not be altered during refactoring.
3. **ARCHIVE SLOT Transformation**: `ScrapbookPlaceholder.tsx` currently renders a generic, loud card with masking tape and the title `ARCHIVAL EVIDENCE PLACEHOLDER`. It must be redesigned into an authentic, blueprint-styled `ARCHIVE SLOT: [Original sketch goes here]` component that is visually distinct from verified visual proof-of-work evidence.
4. **Proof-of-Work Badges**: 4 distinct badges must be introduced and tied to real codebase and makeathon evidence:
   - `"FOUND THIS IN THE REPO"`
   - `"THIS WAS THE FIRST VERSION"`
   - `"I LEFT THIS BROKEN FOR WAY TOO LONG"`
   - `"THIS IS THE FIX"`
5. **New Tests Required**: An expanded corporate buzzword prohibition test (covering 12+ new corporate terms), test suites for the "5 MIN JOURNEY" mode, collapsible technical deep dives, proof-of-work badges, and subtle bottom navigation bar.

---

## 2. Existing Test Suite Survey (115 Tests Across 7 Files)

### 2.1 Test File Catalog

| File | Tests | Core Responsibilities |
|---|---|---|
| `src/tests/journalRequirements.test.ts` | 49 | Verifies all 18 editorial sections, numbering 01–16, paragraph length & count, specific technical and narrative keywords, scrapbook tags, audio soundboard waveforms & parameters, Web vs Desktop routing contract. |
| `src/tests/adversarialChallenger.test.ts` | 27 | Fuzz testing on hash routing (11 adversarial hashes, 100-hashchange flurry), Web Audio oscillator stress & error recovery, Section 14 iframe permissions and source code verification, production build & `docs/` mirror integrity. |
| `src/tests/gameEngine.test.ts` | 13 | Snake grid movement, collision boundaries, self-collision, direction buffering, food consumption, speed scaling. |
| `src/tests/pinkyTracking.test.ts` | 10 | Landmark 20 coordinate extraction, Exponential Moving Average (EMA) filter smoothing, Moving Average filter, relative vector deadzone detection. |
| `src/tests/securityValidator.test.ts` | 7 | Electron native directory containment, blocking `../` directory traversal, canonical target path verification. |
| `src/tests/filesystem.test.ts` | 6 | Demo file mock data, file classification into 6 categories (.jpg, .mp4, .mp3, .pdf, .js, .zip), metadata structure. |
| `src/tests/engineTransaction.test.ts` | 3 | Real-mode file move 2-phase commit transaction (ensuring snake only consumes food after confirmed Recycle Bin transfer). |

*(Note: `src/tests/browser-e2e.mjs` is a standalone Playwright end-to-end test script against `dist/` and is run separately from `npm test`.)*

---

## 3. Potential Test Breakages & Drift Risks in R1–R4

When executing the anti-corporate rewrite (R1), the magazine-style layout changes (R2), the two-tier reading system (R3), and the subtle bottom bar (R4), developers and writers face specific breaking hazards:

### 3.1 Hazard A: Scrapbook Tag Assertions (`journalRequirements.test.ts` lines 484–510)
```typescript
// CURRENT TEST:
it('verifies chapters requiring physical evidence have styled scrapbook tags', () => {
  const allTags = CHAPTERS.flatMap((c) => [
    ...(c.scrapbookTag ? [c.scrapbookTag] : []),
    ...(c.scrapbookTags || [])
  ]);
  allTags.forEach((tag) => {
    expect(tag.startsWith('[ADD ')).toBe(true);
    expect(tag.endsWith(']')).toBe(true);
  });
});
```
- **The Risk**: Requirement R2 specifies replacing generic placeholders with editorial `ARCHIVE SLOT: [Original sketch goes here]`. If `scrapbookTag` strings in `CHAPTERS` are changed from `[ADD ...]` to `ARCHIVE SLOT: [...]`, `expect(tag.startsWith('[ADD ')).toBe(true)` will throw an assertion failure.
- **The Solution**: 
  1. Either update the test in `journalRequirements.test.ts` to allow both forms:
     ```typescript
     expect(tag.startsWith('[ADD ') || tag.startsWith('ARCHIVE SLOT:') || tag.startsWith('[ARCHIVE SLOT')).toBe(true);
     ```
  2. Or have `ScrapbookPlaceholder.tsx` / `ArchiveSlot.tsx` internally render the prefix `ARCHIVE SLOT:` dynamically while keeping the tag content clean, OR update both data and tests synchronously.

### 3.2 Hazard B: Mandatory Keywords in Narrative Copy
The existing test suite requires specific ground-truth phrases. During the rewrite, if these phrases are pruned as "too verbose", tests will immediately fail:

| Section | Mandatory Strings Checked in Tests |
|---|---|
| **Chapter 01** | `'Downloads folder'`, `'2,400'`, `'CCleaner'`, `'Windows Disk Cleanup'`, `'dopamine'`, `'existential dread'` |
| **Chapter 02** | Kickoff `'05:00 PM'`, final milestone `'10:45 AM'`. Each milestone requires `attempt.length > 15`, `reality.length > 15`, `visualEvidence.length > 15`, `lesson.length > 15`. |
| **Chapter 03** | Title contains `'The First Prototype'`, subtitle contains `'Okay. It technically works.'`, summary contains `'v0.1'`, narrative contains `'monochrome'` and `'09:30 PM'`. `BEFORE_AFTER_COMPARISON.before.timestamp === '09:30 PM'`, `after.timestamp === '10:45 AM'`. |
| **Chapter 04** | 3 failure stories. Failure 1: title `'Jitter'`, fix contains `'EMA'` and `'0.35'`. Failure 2: title `'Suicide Turn'`, cause contains `'recoil'`, fix contains `'isOppositeDirection'`. Failure 3: title `'IPC Race Condition'`, fix contains `'session tokens'` and `'shell.trashItem'`. |
| **Chapter 05** | 3 breakthroughs. BT 1: title `'Relative Pinky Vector'`, formula contains `'P20'` and `'P17'`. BT 2: title `'Dominant Axis'`, formula contains `'1.05'`. BT 3: title `'Procedural Oscillator'`, formula contains `'AudioContext'`. |
| **Chapter 06** | Versions `['v0.1', 'v0.4', 'v0.7', 'v0.9', 'v1.0']`. Each row requires `architecturalShift.length > 15`, `experience.length > 15`, `changelog.length >= 3`. |
| **Chapter 07** | Narrative must contain (case-insensitive): `'candy'`, `'radial'`, `'apple'`, `'orange'`, `'grape'`, `'watermelon'`, `'cherri'`. |
| **Chapter 08** | Summary contains `'60 FPS'`, narrative contains `'MediaPipe'`, `'WASM'`, `'GPU delegate'`, `'accumulator'`, `'realpathSync'`. |
| **Chapter 09** | 6 tools: `'MediaPipe'`, `'Vite'`, `'Tailwind'`, `'Electron'`, `'Web Audio'`, `'Vitest'`. Each requires `whyChosen > 15`, `quirkOrTrap > 15`, `codeSnippet > 20`. |
| **Chapter 10** | Subtitle: `'Vishnu K R'`, `'SNMIMT Maliyankara'`. Narrative: `'Vishnu K R'`, `'SNM Institute of Management and Technology'`, `'Maliyankara'`, `'Ernakulam, Kerala'`, `'solo'`. |
| **Chapter 11** | Narrative must contain: `'black tea'`, `'banana chips'`, `'airline ground controller'`, `'webcam'`, `'unplugged'`. |
| **Chapter 12** | Narrative must contain: `'06:00 AM'`, `'07:30 AM'`, `'08:45 AM'`, `'09:30 AM'`, `'10:15 AM'`, `'security test suites'`, `'build:pages'`. |
| **Chapter 13** | 4 screenshot IDs: `'landing'`, `'gameplay'`, `'settings'`, `'gameover'`. Each has `.png` and `techHighlights.length >= 3`. |
| **Chapter 14** | Subtitle contains `'Enough reading. Play it.'`, `gameUrl === 'https://vishnuu-kr.github.io/DangerPinky/'`. Controls: `camera`, `keyboard`, `pause`. |
| **Chapter 15** | Narrative contains: `'lesson 1'`, `'lesson 2'`, `'lesson 3'`, `'useless ideas'`, `'computer vision'`, `'hard drive'`. |
| **Chapter 16** | 4 roadmap items: `'WebRTC Multiplayer'`, `'Custom Candy Theme'`, `'Linux & macOS Trash'`, `'Voice Shouting'`. |
| **Final Reflection** | Title `'Final Reflection'`, subtitle `'In praise of making things for no good reason'`. Narrative contains: `'TinkerHub Useless Projects'`, `'absurd'`. Links: `githubRepo`, `liveDemo`, `tinkerHubMain`. |
| **Hero Data** | Author `'Vishnu K R'`, institution `'SNM Institute of Management and Technology'`, `duration === '18-Hour Overnight Makeathon'`. Stat `'TEST SUITE'` value `'39 / 39 Pass'`. CTAs: `'START THE JOURNEY ↓'` -> `'chapter-01'`, `'PLAY DANGERPINKY'` -> `'chapter-14'`. |

### 3.3 Hazard C: Chapter Structural Constraints
- Every chapter must contain at least 2 narrative paragraphs (`chapter.narrative.length >= 2`).
- Every paragraph must exceed 50 characters (`paragraph.trim().length > 50`).

### 3.4 Hazard D: PlayEmbedSection Source Code Inspection
`adversarialChallenger.test.ts` (lines 386–409) directly reads the file `src/components/journal/PlayEmbedSection.tsx` via `fs.readFileSync` and asserts that these 8 exact character sequences are present:
1. `allow="camera; autoplay; fullscreen"`
2. `title="DangerPinky Live Game"`
3. `loading="lazy"`
4. `target="_blank"`
5. `rel="noopener noreferrer"`
6. `e.key === 'Escape'`
7. `window.removeEventListener('keydown', handleKeyDown)`
8. `setReloadKey` and `key={reloadKey}`

**Rule**: Any refactor to `PlayEmbedSection.tsx` must keep these lines verbatim.

---

## 4. Architectural Transformation of ScrapbookPlaceholders into ARCHIVE SLOTs

### 4.1 Deficiencies of Current Implementation
In `src/components/journal/ScrapbookPlaceholder.tsx`:
- It displays a bright pink box with faux masking tape and an all-caps banner: `ARCHIVAL EVIDENCE PLACEHOLDER`.
- It gives an impression of incomplete or "broken" website construction rather than intentional archival curation.
- It does not distinguish between unverified historical sketches and finished proof-of-work evidence.

### 4.2 Target ARCHIVE SLOT Design Specification
Requirement R2 states:
> "Replace noisy generic placeholders with clearly styled editorial `ARCHIVE SLOT: [Original sketch goes here]`, visually distinct from finished evidence. Unverified items use styled, honest `ARCHIVE SLOT` indicators instead of fake claims."

The new design should feature:
1. **Editorial Archival Stamp**: A muted blueprint-slate container (`bg-slate-950/70 border border-dashed border-slate-700 hover:border-slate-500`) with technical blueprint grid lines or diagonal cross-hatching.
2. **Archival Typography**: Monospace badge in amber or cyan: `ARCHIVE SLOT // UNVERIFIED PHYSICAL ARTIFACT`.
3. **Clean Bracketed Tag**: `ARCHIVE SLOT: [Original 2:00 AM napkin diagram showing snake with mouth open toward a PDF file]`.
4. **Honest Context Note**: Explaining that this physical artifact was drawn on paper during the makeathon and is pending flatbed scan, with an explicit link to view makeathon build photos on Google Drive.
5. **Visual Distinction from Verified Evidence**:
   - **Verified Evidence (e.g. repo screenshots, code snippets)**: Solid glowing border, high-contrast candy-pink / emerald accents, verified proof-of-work badge (e.g. `"FOUND THIS IN THE REPO"`).
   - **Archive Slot**: Muted, dashed, blueprint aesthetics, amber/zinc metadata badge, honest status note.

---

## 5. Proof-of-Work Badges & Real Visual Evidence Integration

### 5.1 The 4 Required Proof-of-Work Badges

| Badge Text | Theme / Color | Icon | Target Location in Journal | Evidence Anchored |
|---|---|---|---|---|
| `"FOUND THIS IN THE REPO"` | Cyan / Emerald (`bg-cyan-950/80 text-cyan-300 border-cyan-500/40`) | `Code2` or `GitCommit` | Section 03 (First Prototype code) & Section 09 (Tech Stack) | Actual v0.1 collision check code from commit history; MediaPipe `hand_landmarker.task` loader. |
| `"THIS WAS THE FIRST VERSION"` | Amber / Slate (`bg-amber-950/80 text-amber-300 border-amber-500/40`) | `Clock` or `Sparkles` | Section 03 (The First Prototype) & Section 06 (Evolution Matrix v0.1) | Monochrome green rectangles on black canvas at 09:30 PM before any styling. |
| `"I LEFT THIS BROKEN FOR WAY TOO LONG"` | Rose / Red (`bg-rose-950/80 text-rose-300 border-rose-500/40`) | `AlertTriangle` or `Flame` | Section 04 (Failures) & Section 11 (The Chaos) | Camera coordinate jitter when leaning back; 180° suicide turn eating active project folder; unplugged webcam. |
| `"THIS IS THE FIX"` | Emerald / Green (`bg-emerald-950/80 text-emerald-300 border-emerald-500/40`) | `CheckCircle2` or `ShieldCheck` | Section 04 (Fixes) & Section 05 (Breakthroughs) | EMA filter formula ($\alpha = 0.35$); `isOppositeDirection` vector check; `shell.trashItem` with ephemeral session tokens. |

### 5.2 Real Visual Evidence Assets Available

1. **Google Drive Video Demo**:
   - URL: `https://drive.google.com/file/d/1aIiCRxT6f9T7WfaB7Iu2qHBtmiiLmvXs/view?usp=drive_link`
   - Role: Featured in Hero CTA (`WATCH 18-HR DEMO`) and Section 13 (The Final Result) as full-width video card.
2. **Build Photos on Google Drive**:
   - URL: `https://drive.google.com/file/d/17yqRVJh22dZAFbSfJG2-ILG1PS2boy4O/view?usp=drive_link`
   - Role: Referenced in hardware build sections (Section 02, Section 11) and Archive Slots.
3. **Full Asset Drive Folder**:
   - URL: `https://drive.google.com/drive/folders/1u7BUqhHbVeiD0sxTesiC41KkblEXHwSi?usp=sharing`
   - Role: Referenced in Final Reflection link directory and Section 13.
4. **Local Verified Screenshots (`public/screenshots/`)**:
   - `landing.png` (646 KB): High-res mode selector dashboard.
   - `gameplay.png` (325 KB): Pinky vision HUD, Landmark 20 crosshairs, candy fruits.
   - `settings.png` (646 KB): Sensitivity tuning and grid dimensions.
   - `gameover.png` (115 KB): Game over score and file consumption audit.
   - `danger_pinky_banner.png` in `public/images/` (809 KB): Official hackathon hero banner.
5. **Live Deployed Web App**:
   - URL: `https://vishnuu-kr.github.io/DangerPinky/`
   - Role: Embedded in Section 14 responsive iframe with camera/keyboard fallbacks.

---

## 6. Section 14 Responsive Iframe & Desktop Mode (Zero Regressions)

### 6.1 Section 14 Responsive Iframe Requirements
To ensure 100% test compatibility and zero regressions:
1. `src` must resolve to `https://vishnuu-kr.github.io/DangerPinky/`.
2. Must keep `allow="camera; autoplay; fullscreen"`.
3. Must retain the `Escape` key handler to dismiss fullscreen mode.
4. Must maintain controls guidance for both camera (Landmark 20) and keyboard (Arrow Keys / WASD / Space).
5. Must retain the `setReloadKey` reload trigger.

### 6.2 Electron Desktop Routing Requirements
In `src/App.tsx` and `src/filesystem/nativeBridge.ts`:
1. `isDesktopApp()` must return `true` if and only if `window.fileSnakeNative?.isDesktop` is truthy.
2. When running in Electron desktop mode:
   - Initial screen defaults to `'LANDING'`.
   - Native directory selection (`pickNativeDirectory()`), real file mode (`shell.trashItem`), and Recycle Bin launcher remain active.
   - User can still view the journal by visiting `#journal`.
3. When running in a web browser:
   - Initial screen defaults to `'JOURNAL'` (root URL without hash).
   - Visiting `#game` or `#play` routes to `'LANDING'`.
   - Real Danger Mode displays a polite educational modal explaining that browser sandboxes cannot delete OS files without Electron desktop mode.

---

## 7. New Tests Needed for Requirements R1–R4

We recommend creating a new dedicated test file: `src/tests/editorialAuthenticityV2.test.ts` (or adding to `journalRequirements.test.ts`), covering:

### 7.1 Test Suite 1: Expanded Corporate Buzzword Scanner
```typescript
const FORBIDDEN_V2_BUZZWORDS = [
  'seamless continuous feedback loop',
  'seamlessly',
  'seamless',
  'leveraging',
  'leverage',
  'optimized architecture',
  'robust architecture',
  'robust',
  'innovative',
  'cutting-edge',
  'comprehensive solution',
  'deterministically tested application',
  'production-ready',
  'high-level engineering',
  'thoughtful roadmap',
  'cohesive experience',
  'synergy',
  'paradigm shift',
  'holistic approach',
  'actionable insights'
];
```
- **Assertion**: Scan all text extracted from `HERO_DATA`, `CHAPTERS`, `FINAL_REFLECTION`, `TIMELINE_MILESTONES`, `TECH_STACK`, `EVOLUTION_DATA`.
- **Target**: Zero occurrences.
- **Adversarial Check**: Ensure the scanner detects contaminated sample text.

### 7.2 Test Suite 2: Authentic Human Builder Tone Signatures
- **Hero Opening Signature**:
  Verify `HERO_DATA.openingHook` or narrative contains:
  *"I didn't start with a game plan. I started with a stupid question: What if cleaning up your Downloads folder was actually dangerous?"*
- **Chapter 04 Failure Section Signature**:
  Verify `CHAPTERS[3].narrative` contains:
  *"Between the evening and the middle of the night, I managed to break the same game in three completely different ways."*
- **Verification Markers**:
  Ensure that any unverified claims use honest markers like `[VERIFY THIS DETAIL]` or `ARCHIVE SLOT: [...]`.

### 7.3 Test Suite 3: Proof-of-Work Badges Verification
- Verify that the 4 required proof-of-work badges exist and are referenced:
  1. `"FOUND THIS IN THE REPO"`
  2. `"THIS WAS THE FIRST VERSION"`
  3. `"I LEFT THIS BROKEN FOR WAY TOO LONG"`
  4. `"THIS IS THE FIX"`
- Check that each badge is associated with its respective section and visual or code evidence.

### 7.4 Test Suite 4: Two-Tier Reading System ("5 MIN JOURNEY" Mode & Collapsible Deep Dives)
- **5 MIN JOURNEY Mode**:
  - Verify that the 6 core pillars are registered:
    1. Origin (`chapter-01`)
    2. First Prototype (`chapter-03`)
    3. Biggest Failure (`chapter-04`)
    4. Breakthrough (`chapter-05`)
    5. Final Result (`chapter-13`)
    6. Play (`chapter-14`)
  - Verify that `ChapterNav` or `JournalScreen` exposes a toggle state for "5 MIN JOURNEY" mode.
- **Collapsible Technical Deep Dives**:
  - Verify that the complex engineering explanations are encapsulated inside collapsible containers (with `"HOW THIS WORKS"` or `"TECHNICAL DEEP DIVE"` labels):
    1. MediaPipe WASM GPU delegate math / Landmark 20 extraction
    2. EMA smoothing formula ($S_t = \alpha \cdot X_t + (1 - \alpha) \cdot S_{t-1}$)
    3. Electron IPC security validator & session token
    4. Procedural Web Audio oscillator synthesis parameters

### 7.5 Test Suite 5: Editorial Layout Hierarchy & Subtle Bottom Navigation
- Verify that `ScrapbookPlaceholder` renders with `ARCHIVE SLOT:` styling, distinct from finished evidence.
- Verify that the persistent bottom bar has subtle styling classes (e.g. lightweight backdrop, non-competing z-index, unobtrusive dimensions).
- Verify that Section 14 responsive iframe and Electron desktop routing continue to satisfy all existing regression contracts.

---

## 8. Summary Action Matrix for Implementers & Test Writers

| Component / File | Current State | Required Change | Breaking Risks & Constraints |
|---|---|---|---|
| `src/data/journalChapters.ts` | Contains all 18 sections; some text contains formal buzzwords. `scrapbookTag` uses `[ADD ...]`. | Rewrite copy in authentic first-person voice (Vishnu K R); update Hero & Ch 4 openings; prune 12+ buzzwords; add proof-of-work badges and archive slot markers. | **MUST PRESERVE** all 13 chapter keyword sets from Section 3.2. Synchronize tag format with tests. |
| `src/components/journal/ScrapbookPlaceholder.tsx` | Faux masking tape card titled `ARCHIVAL EVIDENCE PLACEHOLDER`. | Redesign into editorial `ARCHIVE SLOT: [...]` component with blueprint-slate styling and honest explanation. | Ensure it handles both raw tags and formatted archive slots without breaking layout. |
| `src/components/journal/ChapterNav.tsx` | Full 18-section scrollable rail. | Add "5 MIN JOURNEY" navigation toggle that jumps/filters the 6 core pillars. | Maintain responsive drawer for mobile/tablet. |
| `src/components/JournalScreen.tsx` | Uniform card grids for every chapter; formulas printed inline; prominent floating bottom HUD. | Break card grids into dynamic spreads (full-width visuals, split columns); wrap math in collapsible deep-dive drawers; lighten bottom HUD. | Do NOT remove section IDs (`chapter-01` to `chapter-16`, `hero`, `closing`). Keep scroll-spy intact. |
| `src/components/journal/PlayEmbedSection.tsx` | Section 14 iframe container with controls and actions. | Retain full functionality; ensure layout seamlessly fits editorial hierarchy. | **CRITICAL**: Do NOT alter the 8 exact strings checked by `adversarialChallenger.test.ts`. |
| `src/tests/journalRequirements.test.ts` | 49 tests. Checks `tag.startsWith('[ADD ')`. | Update tag validation to accept `ARCHIVE SLOT: [...]`. Expand buzzword blacklist to 12+ new words. | Must keep 100% pass rate. |
| `src/tests/editorialAuthenticityV2.test.ts` (NEW) | Does not exist. | Create new suite for R1–R4: 5-min journey, collapsible deep dives, proof-of-work badges, archive slots. | Follow Vitest ESM standards. |

---

*Report compiled by `teamwork_preview_explorer_survey_4` on 2026-09-18.*
