# Dispatch Task: Milestone 4 (M4) — Editorial Data Layer, Proof-of-Work & Component Primitives

You are `teamwork_preview_worker_m4`.
Your working directory is: `c:/Users/Windows 10/Downloads/DangerPinky/.agents/teamwork_preview_worker_m4`

MANDATORY INTEGRITY WARNING:
> DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Read:
- `c:/Users/Windows 10/Downloads/DangerPinky/.agents/ORIGINAL_REQUEST.md` (specifically `## 2026-09-18T13:39:23Z`)
- `c:/Users/Windows 10/Downloads/DangerPinky/PROJECT.md`
- `c:/Users/Windows 10/Downloads/DangerPinky/.agents/teamwork_preview_spec_miner_survey_2/spec_report.md`
- `c:/Users/Windows 10/Downloads/DangerPinky/.agents/teamwork_preview_explorer_survey_3/layout_report.md`
- `c:/Users/Windows 10/Downloads/DangerPinky/.agents/teamwork_preview_explorer_survey_4/evidence_test_report.md`

Your Exclusive File Ownership:
- `src/data/journalChapters.ts`
- `src/components/journal/ScrapbookPlaceholder.tsx`
- `src/components/journal/TechnicalDeepDive.tsx`
- `src/components/journal/ChapterNav.tsx`
- `src/components/journal/JournalHero.tsx`
- `src/tests/journalRequirements.test.ts`

Tasks:
1. `src/data/journalChapters.ts`:
   - Incorporate the exact survey findings from `spec_report.md`.
   - Set Hero opening copy verbatim: "I didn't start with a game plan. I started with a stupid question: What if cleaning up your Downloads folder was actually dangerous?"
   - Set Failure opening copy (Ch04) verbatim: "Between the evening and the middle of the night, I managed to break the same game in three completely different ways."
   - Rewrite the entire narrative across all 18 sections into authentic, first-person developer voice as Vishnu K R (short, direct, conversational sentences with humor, frustration, and real observations).
   - Strictly eradicate all corporate marketing buzzwords: "seamless continuous feedback loop", "leveraging", "optimized", "robust architecture", "innovative", "cutting-edge", "comprehensive solution", "deterministically tested application", "production-ready", "high-level engineering", "thoughtful roadmap", "cohesive experience", and any corporate synonyms.
   - Strictly preserve all 13 ground-truth keyword sets required by existing tests (see `evidence_test_report.md`):
     - Ch01: `Downloads folder`, `2,400`, `CCleaner`, `Windows Disk Cleanup`, `dopamine`, `existential dread`
     - Ch04: `Jitter`, `EMA`, `0.35`, `Suicide Turn`, `recoil`, `isOppositeDirection`, `IPC Race Condition`, `session tokens`, `shell.trashItem`
     - Ch05: `Relative Pinky Vector`, `P20`, `P17`, `Dominant Axis`, `1.05`, `Procedural Oscillator`, `AudioContext`
     - Ch07: `candy`, `radial`, `apple`, `orange`, `grape`, `watermelon`, `cherri`
     - Ch08: `60 FPS`, `MediaPipe`, `WASM`, `GPU delegate`, `accumulator`, `realpathSync`
     - Ch10: `Vishnu K R`, `SNM Institute of Management and Technology`, `Maliyankara`, `Ernakulam, Kerala`, `solo`
     - Ch11: `black tea`, `banana chips`, `airline ground controller`, `webcam`, `unplugged`
     - Ch12: `06:00 AM`, `07:30 AM`, `08:45 AM`, `09:30 AM`, `10:15 AM`, `security test suites`, `build:pages`
     - Ch15: `lesson 1`, `lesson 2`, `lesson 3`, `useless ideas`, `computer vision`, `hard drive`
     - Ch16: `WebRTC Multiplayer`, `Custom Candy Theme`, `Linux & macOS Trash`, `Voice Shouting`
     - Hero: `Vishnu K R`, `SNMIMT Maliyankara`, `18-Hour Overnight Makeathon`, `TinkerHub Useless Projects 3.0`
     - Stats: `'TEST SUITE'` value `'39 / 39 Pass'`
   - Export `JOURNEY_PILLARS = ['ch01-concept', 'ch03-first-prototype', 'ch04-the-failures', 'ch05-the-breakthrough', 'ch13-the-result', 'ch14-play-game']`.
   - Add proof-of-work badges: `"FOUND THIS IN THE REPO"`, `"THIS WAS THE FIRST VERSION"`, `"I LEFT THIS BROKEN FOR WAY TOO LONG"`, `"THIS IS THE FIX"`.
   - Add structured `technicalDeepDive` data for collapsible drawers (MediaPipe WASM GPU math, EMA smoothing formula, Electron IPC security validator token, procedural Web Audio oscillator parameters).

2. `src/components/journal/ScrapbookPlaceholder.tsx`:
   - Redesign from generic masking tape into blueprint-slate `ARCHIVE SLOT: [Original sketch goes here]`.
   - Visually distinguish unverified physical sketches from verified proof-of-work badges.

3. `src/components/journal/TechnicalDeepDive.tsx`:
   - Create a reusable collapsible component with expandable drawers, accessible toggle button, formula/code rendering, and smooth transition.

4. `src/components/journal/ChapterNav.tsx`:
   - Add "5 MIN JOURNEY" mode toggle button in header/nav.
   - When active, highlight the 6 core pillars, with smooth jump and indicator.

5. `src/components/journal/JournalHero.tsx`:
   - Render the updated authentic developer opening copy and badges.

6. `src/tests/journalRequirements.test.ts`:
   - Update tag assertion (lines 484-510) so it accepts both `[ADD ` and `ARCHIVE SLOT:` or `[ARCHIVE SLOT`.
   - Expand buzzword checks to test all newly banned buzzwords.

7. Verification:
   - Run `npx tsc --noEmit` (0 errors).
   - Run `npm test` (all tests pass).
   - Document commands and results in `handoff.md`.

Write your report to `c:/Users/Windows 10/Downloads/DangerPinky/.agents/teamwork_preview_worker_m4/handoff.md` and send a message when complete.

## 2026-09-18T13:52:13Z
Read c:/Users/Windows 10/Downloads/DangerPinky/.agents/teamwork_preview_worker_m4/DISPATCH.md and execute Milestone 4 tasks. You have exclusive write ownership over src/data/journalChapters.ts, src/components/journal/ScrapbookPlaceholder.tsx, src/components/journal/TechnicalDeepDive.tsx, src/components/journal/ChapterNav.tsx, src/components/journal/JournalHero.tsx, and src/tests/journalRequirements.test.ts. Follow all instructions, preserve all required keywords, eliminate buzzwords, verify with npx tsc --noEmit and npm test, write handoff.md, and send message when complete.
