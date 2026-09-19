# Dispatch Assignment: teamwork_preview_worker_m1

## Role
Implementation Worker (Milestone 1: Core Foundation & Data Layer)

## Working Directory
c:\Users\Windows 10\Downloads\DangerPinky\.agents\teamwork_preview_worker_m1

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Context & Inputs
- User Request: `c:\Users\Windows 10\Downloads\DangerPinky\.agents\ORIGINAL_REQUEST.md`
- Project Plan: `c:\Users\Windows 10\Downloads\DangerPinky\PROJECT.md`
- Editorial Specs: `c:\Users\Windows 10\Downloads\DangerPinky\.agents\teamwork_preview_spec_miner_survey_1\editorial_specs.md`
- Codebase Survey: `c:\Users\Windows 10\Downloads\DangerPinky\.agents\teamwork_preview_explorer_survey_1\survey_codebase.md`
- Build/Test Survey: `c:\Users\Windows 10\Downloads\DangerPinky\.agents\teamwork_preview_explorer_survey_2\survey_tests_build.md`

## Write Ownership
You have exclusive write ownership of:
1. `src/App.tsx`
2. `scripts/copy-docs.cjs`
3. `src/data/journalChapters.ts`

## Specific Tasks
1. **Desktop vs Web Dual Routing in `src/App.tsx`**:
   - Update `getInitialScreen()` so that:
     ```typescript
     if (typeof window !== 'undefined') {
       const hash = window.location.hash.toLowerCase();
       if (hash === '#game' || hash === '#play') return 'LANDING';
       if (hash === '#journal') return 'JOURNAL';
       if (isDesktopApp()) return 'LANDING';
       return 'JOURNAL';
     }
     ```
   - Ensure `isDesktopApp()` is properly imported from `src/filesystem/nativeBridge.ts`.
   - Ensure the Navbar allows toggling between `'JOURNAL'`, `'LANDING'`, and `'GAME'`.
2. **Docs SPA 404 Resilience in `scripts/copy-docs.cjs`**:
   - Ensure that after copying `dist/` to `docs/`, `docs/404.html` is overwritten with the contents of `docs/index.html` (or structured so GitHub Pages handles SPA fallback cleanly without loading unbundled `/src/main.tsx`).
3. **Comprehensive Chapter Data Layer in `src/data/journalChapters.ts`**:
   - Create `src/data/journalChapters.ts` exporting fully populated, high-personality data models for:
     - Opening Hero: Title "Somewhere between a stupid idea and a working game, DangerPinky happened", metadata badge (Vishnu K R, SNMIMT Maliyankara, 18-Hour Overnight Makeathon, TinkerHub Useless Projects 3.0), CTA.
     - Section 01 to 16: All 16 chapters with detailed, substantive, authentic first-person developer copy (written in Vishnu's voice, strictly zero corporate buzzwords). Incorporate the exact technical facts: Landmark 20 vs 17 vector math, hand scale calculation, EMA alpha = 0.35, deadzone 0.028, Web Audio oscillator frequencies (sine 659-988Hz, square 440-880Hz, sawtooth 200-600Hz), radial fruit shaders, Electron session token and `shell.trashItem` safety sandbox.
     - Include failure stories (what thought, tried, cause, fix) for Section 04.
     - Include breakthrough moments for Section 05.
     - Include before/after comparison metadata for Section 06.
     - Include tool workbench specifications for Section 09.
     - Include solo builder details for Section 10.
     - Include Section 14 play metadata pointing to `https://vishnuu-kr.github.io/DangerPinky/`.
     - Include Section 16 roadmap items (multiplayer pinky duels, custom themes, Mac/Linux trash).
     - Include poetic Final Reflection and persistent links (GitHub repo, Google Drive demo, build photos, full asset folder).
4. **Verification**:
   - Run `npx tsc --noEmit` to guarantee zero TypeScript errors.
   - Run `npm test` to verify all unit tests pass.
   - Run `npm run build` and `node scripts/copy-docs.cjs`.
5. **Handoff**:
   - Write handoff report in `c:\Users\Windows 10\Downloads\DangerPinky\.agents\teamwork_preview_worker_m1\handoff.md`.

## 2026-09-18T12:45:43Z
You are teamwork_preview_worker_m1.
Your working directory is: c:\Users\Windows 10\Downloads\DangerPinky\.agents\teamwork_preview_worker_m1
Read your instructions in: c:\Users\Windows 10\Downloads\DangerPinky\.agents\teamwork_preview_worker_m1\DISPATCH.md
Read the original user request in: c:\Users\Windows 10\Downloads\DangerPinky\.agents\ORIGINAL_REQUEST.md
Read the project architecture in: c:\Users\Windows 10\Downloads\DangerPinky\PROJECT.md
Read the editorial specifications in: c:\Users\Windows 10\Downloads\DangerPinky\.agents\teamwork_preview_spec_miner_survey_1\editorial_specs.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Task:
You have exclusive write ownership of:
- src/App.tsx
- scripts/copy-docs.cjs
- src/data/journalChapters.ts

1. In src/App.tsx, update getInitialScreen() to check `isDesktopApp()` so desktop Electron defaults to 'LANDING' while web visitors default to 'JOURNAL'.
2. In scripts/copy-docs.cjs, ensure docs/404.html correctly duplicates the bundled index.html for SPA routing.
3. In src/data/journalChapters.ts, create the comprehensive data layer containing all 18 sections (Opening Hero, Chapters 01-16, Final Reflection) with rich, authentic first-person developer copy from Vishnu K R (SNMIMT Maliyankara, 18-hour makeathon, TinkerHub 3.0), incorporating all real technical formulas and details. Strictly 0 corporate buzzwords.
4. Run `npx tsc --noEmit` and `npm test` to verify zero type errors and passing tests.
5. Write your handoff report to c:\Users\Windows 10\Downloads\DangerPinky\.agents\teamwork_preview_worker_m1\handoff.md
6. Send a message to the orchestrator when complete.
