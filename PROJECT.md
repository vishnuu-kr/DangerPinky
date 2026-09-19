# Project: DangerPinky Standalone Project Journal

## Architecture
- **Web App Entry & Routing**:
  - `src/App.tsx`: Detects environment via `isDesktopApp()`.
    - Desktop (`isDesktopApp() === true` in Electron): Defaults to `'LANDING'` screen (native game dashboard, folder picker, OS Recycle Bin).
    - Web (`isDesktopApp() === false` on GitHub Pages / root): Defaults to `'JOURNAL'` screen (immersive 18-section Project Journal).
    - Bidirectional switching via Navbar ("Dev Journal" vs "Play Game") and Section 14 launcher buttons.
  - `scripts/copy-docs.cjs`: Syncs `dist/` to `docs/` and ensures `docs/404.html` mirrors `dist/index.html` with `.nojekyll` intact for GitHub Pages SPA routing.
- **Authentic Storytelling Data Layer (`src/data/journalChapters.ts`)**:
  - All 18 sections (Hero, Chapters 01-16, Final Reflection) written in authentic, first-person developer voice (Vishnu K R, SNMIMT Maliyankara, 18-hour overnight makeathon, TinkerHub Useless Projects 3.0).
  - Strictly 0 corporate marketing buzzwords ("seamless continuous feedback loop", "leveraging", "optimized", "robust architecture", "innovative", "cutting-edge", "comprehensive solution", "deterministically tested application", "production-ready", "high-level engineering", "thoughtful roadmap", "cohesive experience").
  - Mandatory Hero opening: *"I didn't start with a game plan. I started with a stupid question: What if cleaning up your Downloads folder was actually dangerous?"*
  - Mandatory Failure opening: *"Between the evening and the middle of the night, I managed to break the same game in three completely different ways."*
  - Preserves all 13 ground-truth keyword sets (Landmark 20 vector math, EMA smoothing alpha = 0.35, deadzone 0.028, Web Audio oscillator frequencies, `shell.trashItem` sandboxing).
  - 4 Proof-of-Work Badges (`"FOUND THIS IN THE REPO"`, `"THIS WAS THE FIRST VERSION"`, `"I LEFT THIS BROKEN FOR WAY TOO LONG"`, `"THIS IS THE FIX"`).
  - Technical Deep Dive structured data for collapsible drawer rendering.
- **Two-Tier Reading System & Magazine Layout System (`src/components/journal/`)**:
  - **5-Min Journey Mode**: Subtle navigation toggle in `ChapterNav.tsx` jumping through the 6 core pillars: Origin (Ch01) → First Prototype (Ch03) → Biggest Failure (Ch04) → Breakthrough (Ch05) → Final Result (Ch13) → Play (Ch14).
  - **Collapsible Deep Dives (`TechnicalDeepDive.tsx`)**: Reusable expandable drawer housing MediaPipe GPU math, EMA smoothing, Electron IPC security validator token, and Web Audio oscillator formulas.
  - **Magazine-Style Layouts (`JournalScreen.tsx`)**: Breaks away from card grids into dynamic spreads (asymmetrical split spreads, cinematic showcases, engineering autopsy diffs, longform feature spreads).
  - **Refined Persistent Bottom Bar**: Compact, 38px auto-minimizing glassmorphic navigation pill displaying 5-Min Journey progress and unobtrusive actions.
  - **Preserved Interactive Widgets**: Procedural audio soundboard, comparison slider, screenshot lightbox, and Section 14 iframe embed.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Desktop/Web Dual Routing | `getInitialScreen()` routes Electron to `LANDING` and web to `JOURNAL` | M1 | survey_codebase |
| 2 | Docs SPA & 404 Fix | `copy-docs.cjs` syncs `dist/` to `docs/` with `.nojekyll` & SPA `404.html` | M1 | survey_tests_build |
| 3 | Journal Chapter Data Layer | TypeScript data models & full text for Chapters 1-16 + Hero + Reflection | M1 | editorial_specs |
| 4 | Hero Section & Metadata Badge | Opening screen with headline, creator Vishnu K R, SNMIMT Maliyankara, TinkerHub 3.0 | M2 | ORIGINAL_REQUEST R1 |
| 5 | Chapters 01-04 (Origin & Breakage) | Sections 01 to 04 covering concept, 18-hr timeline, first prototype, and failures | M2 | ORIGINAL_REQUEST R1 |
| 6 | Chapters 05-08 (Breakthroughs & Evolution) | Sections 05 to 08 covering breakthroughs, evolution, candy pink shift, ML learnings | M2 | ORIGINAL_REQUEST R1 |
| 7 | Chapters 09-13 (Tools, Solo Builder & Push) | Sections 09 to 13 covering tech workbench, Vishnu solo role, late-night push | M2 | ORIGINAL_REQUEST R1 |
| 8 | Chapters 14-16 & Final Reflection | Sections 14 (Play embed), 15 (Learnings), 16 (Roadmap), and Poetic Reflection | M2 | ORIGINAL_REQUEST R1 |
| 9 | Sticky Chapter Navigation | ObsidianUI-inspired sticky sidebar/header with active scroll tracking | M2 | ORIGINAL_REQUEST R2 |
| 10 | Interactive Audio Soundboard | Procedural Web Audio API soundboard with 5 interactive waveform buttons | M2 | ORIGINAL_REQUEST R2 |
| 11 | Screenshot Lightbox Modal | Interactive modal for zoomable high-res screenshots with technical annotations | M2 | ORIGINAL_REQUEST R2 |
| 12 | Before/After Visual Slider | Draggable comparison slider contrasting early terminal prototype with candy build | M2 | ORIGINAL_REQUEST R2 |
| 13 | Labeled Scrapbook Placeholders | Stylized placeholders linking to Drive | M2 | ORIGINAL_REQUEST R2 |
| 14 | Embedded Game Section 14 | Responsive iframe with `https://vishnuu-kr.github.io/DangerPinky/` | M2 | ORIGINAL_REQUEST R1 |
| 15 | Test & Build Pipeline Verification | 115 Vitest tests pass, 0 TS errors, clean build in dist/ synced to docs/ | M3 | ORIGINAL_REQUEST R3 |
| 16 | Anti-Corporate Human Narrative Pass | Rewrite all 18 sections as authentic Vishnu K R, 0 corporate buzzwords, mandatory openings | M4 | ORIGINAL_REQUEST R1 |
| 17 | Proof-of-Work Badges & ARCHIVE SLOT | Monospace badges ("FOUND THIS IN THE REPO", etc.) and blueprint ARCHIVE SLOT components | M4 | ORIGINAL_REQUEST R2 |
| 18 | Two-Tier 5-Min Journey Navigation | Navigation toggle jumping through the 6 core pillars with progress indicator | M4, M5 | ORIGINAL_REQUEST R3 |
| 19 | Collapsible Technical Deep Dives | `<TechnicalDeepDive>` expandable drawers for MediaPipe math, EMA, IPC token, Web Audio | M4, M5 | ORIGINAL_REQUEST R3 |
| 20 | Dynamic Magazine-Style Layouts | Asymmetrical split spreads, cinematic showcases, engineering autopsy, longform features | M5 | ORIGINAL_REQUEST R2 |
| 21 | Refined Subtle Bottom Bar | Compact 38px auto-minimizing glassmorphic navigation bar | M5 | ORIGINAL_REQUEST R4 |
| 22 | Comprehensive Gate Verification V2 | Reviewers, Challengers, Auditor, and full test suite passing 0 TS errors, build synced | M6 | Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core Foundation & Data Layer | Routing (`src/App.tsx`), `scripts/copy-docs.cjs`, initial chapter data | none | DONE |
| M2 | Full Editorial UI & Interactive Widgets | Initial ObsidianUI components, soundboard, lightbox, slider, iframe embed | M1 | DONE |
| M3 | Initial E2E Verification & Build Sync | 115 Vitest tests, TS check, build:pages sync | M1, M2 | DONE |
| M4 | Editorial Data Layer, Proof-of-Work & Component Primitives | Rewrite `journalChapters.ts` (authentic voice, 0 buzzwords, mandatory openings, badges, deep dive data), `ScrapbookPlaceholder.tsx` (ARCHIVE SLOT styling), create `TechnicalDeepDive.tsx`, update `ChapterNav.tsx` (5-Min Journey toggle), update `journalRequirements.test.ts` | M3 | IN_PROGRESS |
| M5 | Dynamic Magazine Layouts, Subtle Bottom Bar & Page Assembly | Overhaul `JournalScreen.tsx` with magazine layouts and collapsible drawers, refine bottom bar, add `editorialAuthenticityV2.test.ts`, run typecheck and `build:pages` | M4 | PLANNED |
| M6 | Independent Multi-Agent Verification & Forensic Audit | 2 Reviewers, 2 Challengers, 1 Forensic Auditor, strict gate checks | M5 | PLANNED |

## Interface Contracts
### Routing Contract (`src/App.tsx`)
- `isDesktopApp(): boolean` from `src/filesystem/nativeBridge.ts`
- Web: Initial screen defaults to `'JOURNAL'`.
- Desktop: Initial screen defaults to `'LANDING'`.
- Navbar retains toggling between `'JOURNAL'`, `'LANDING'`, and `'GAME'`.

### Chapter Data Contract (`src/data/journalChapters.ts`)
- Exports `HERO_DATA`, `CHAPTERS` (16 chapters), `FINAL_REFLECTION`, `PERSISTENT_LINKS`, `SOUNDBOARD_DATA`, `SCREENSHOTS_DATA`, `TECH_STACK`, `TIMELINE_MILESTONES`, `EVOLUTION_DATA`.
- New exports / fields:
  - `JOURNEY_PILLARS`: Array of 6 core pillar IDs (`['ch01-concept', 'ch03-first-prototype', 'ch04-the-failures', 'ch05-the-breakthrough', 'ch13-the-result', 'ch14-play-game']`).
  - `PROOF_BADGES`: Type definitions and badges (`'FOUND THIS IN THE REPO' | 'THIS WAS THE FIRST VERSION' | 'I LEFT THIS BROKEN FOR WAY TOO LONG' | 'THIS IS THE FIX'`).
  - `technicalDeepDive`: Optional collapsible object on chapters containing title, formula/algorithm summary, and deep dive text.

### Scrapbook & Archive Slot Contract (`src/components/journal/ScrapbookPlaceholder.tsx`)
- Props: `tag: string`, `description?: string`, `evidenceUrl?: string`, `badgeType?: string`, `isVerified?: boolean`.
- Visual styling: Blueprint-slate styling with `ARCHIVE SLOT: [label]` when unverified, and high-contrast proof-of-work badge when verified evidence is linked.

### Technical Deep Dive Drawer Contract (`src/components/journal/TechnicalDeepDive.tsx`)
- Props: `title: string`, `badge?: string`, `formula?: string`, `codeSnippet?: string`, `children: React.ReactNode`, `defaultOpen?: boolean`.
- Features accessible expandable/collapsible toggle with smooth animation and monospace formatting.

### 5-Min Journey Contract (`src/components/journal/ChapterNav.tsx`)
- Props include `journeyMode: boolean`, `onToggleJourneyMode: (enabled: boolean) => void`, `activeChapter: string`, `onSelectChapter: (id: string) => void`.
- Visual indicators for the 6 core pillars when in 5-Min Journey mode.

## Code Layout
- `src/data/journalChapters.ts` (M4)
- `src/components/journal/ScrapbookPlaceholder.tsx` (M4)
- `src/components/journal/TechnicalDeepDive.tsx` (M4)
- `src/components/journal/ChapterNav.tsx` (M4)
- `src/components/journal/JournalHero.tsx` (M4)
- `src/components/journal/PlayEmbedSection.tsx` (Strictly preserve 8 AST/string tokens)
- `src/components/JournalScreen.tsx` (M5)
- `src/tests/journalRequirements.test.ts` (M4 test update)
- `src/tests/editorialAuthenticityV2.test.ts` (M5 test additions)
- `dist/` and `docs/` (M5 build:pages)
