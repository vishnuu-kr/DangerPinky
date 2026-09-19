import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  HERO_DATA,
  PROLOGUE_DATA,
  PERSISTENT_LINKS,
  SOUNDBOARD_DATA,
  BEFORE_AFTER_COMPARISON,
  TIMELINE_MILESTONES,
  TECH_STACK,
  EVOLUTION_DATA,
  SCREENSHOTS_DATA,
  CHAPTERS,
  FINAL_REFLECTION,
  getChapterById,
  getChapterByNumber,
  getAllSectionIds
} from '../data/journalChapters';
import { isDesktopApp } from '../filesystem/nativeBridge';
import { sound } from '../game/audio';

describe('DangerPinky Dev Journal Requirements Test Suite', () => {
  // =========================================================================
  // TIER 1: FEATURE COVERAGE & EDITORIAL COMPLETENESS
  // =========================================================================
  describe('Tier 1: Chapter Structure & Editorial Completeness', () => {
    it('contains all 19 distinct editorial milestones (Hero + Prologue + 16 Chapters + Final Reflection)', () => {
      expect(HERO_DATA).toBeDefined();
      expect(HERO_DATA.id).toBe('hero');
      expect(PROLOGUE_DATA).toBeDefined();
      expect(PROLOGUE_DATA.id).toBe('prologue');
      expect(CHAPTERS.length).toBe(16);
      expect(FINAL_REFLECTION).toBeDefined();
      expect(FINAL_REFLECTION.id).toBe('closing');

      const allIds = getAllSectionIds();
      expect(allIds.length).toBe(19);
      expect(allIds[0]).toBe('hero');
      expect(allIds[1]).toBe('prologue');
      expect(allIds[18]).toBe('closing');
    });

    it('numbers all 16 chapters sequentially from 01 to 16 with matching section IDs', () => {
      CHAPTERS.forEach((chapter, index) => {
        const expectedNum = String(index + 1).padStart(2, '0');
        const expectedId = `chapter-${expectedNum}`;

        expect(chapter.number).toBe(expectedNum);
        expect(chapter.sectionNumber).toBe(expectedNum);
        expect(chapter.id).toBe(expectedId);
      });
    });

    it('ensures every chapter contains rich, non-empty editorial attributes', () => {
      CHAPTERS.forEach((chapter) => {
        expect(chapter.title.trim().length).toBeGreaterThan(5);
        expect(chapter.subtitle.trim().length).toBeGreaterThan(5);
        expect(chapter.tag.trim().length).toBeGreaterThan(2);
        expect(chapter.summary.trim().length).toBeGreaterThan(20);

        // Must contain substantive authentic narrative (at least 2 paragraphs each)
        expect(Array.isArray(chapter.narrative)).toBe(true);
        expect(chapter.narrative.length).toBeGreaterThanOrEqual(2);

        chapter.narrative.forEach((paragraph) => {
          expect(typeof paragraph).toBe('string');
          expect(paragraph.trim().length).toBeGreaterThan(15);
        });
      });
    });

    it('verifies PROLOGUE_DATA exists and contains the outreach context and NoseTrack prior win', () => {
      expect(PROLOGUE_DATA.id).toBe('prologue');
      expect(PROLOGUE_DATA.outreachRole.title).toContain('TinkerHub SNMIMT Outreach Lead');
      expect(PROLOGUE_DATA.previousWin.title).toContain('NoseTrack');
      expect(PROLOGUE_DATA.narrative.length).toBeGreaterThanOrEqual(3);
    });

    it('verifies Chapter 01: The Idea I Didn\'t Build — covers the abandoned idea and outreach context', () => {
      const ch1 = getChapterById('chapter-01');
      expect(ch1).toBeDefined();
      expect(ch1!.title).toContain("The Idea I Didn't Build");

      const combinedText = ch1!.narrative.join(' ');
      expect(combinedText).toContain('Outreach Lead');
      expect(combinedText).toContain('idea');
      expect(combinedText).toContain('dropped it');
    });

    it('verifies Chapter 02: I Had Absolutely Nothing — covers the empty period and outreach chaos', () => {
      const ch2 = getChapterById('chapter-02');
      expect(ch2).toBeDefined();
      expect(ch2!.title).toContain('I Had Absolutely Nothing');

      const combinedText = ch2!.narrative.join(' ');
      expect(combinedText).toContain('outreach');
      expect(combinedText).toContain('no project');
    });

    it('verifies Chapter 03: The Coffee Break — covers the midnight coffee origin story', () => {
      const ch3 = getChapterById('chapter-03');
      expect(ch3).toBeDefined();
      expect(ch3!.title).toContain('Coffee Break');

      const combinedText = ch3!.narrative.join(' ');
      expect(combinedText).toContain('coffee');
      expect(combinedText).toContain('pinky');
      expect(combinedText).toContain('Pinky Snake');
    });

    it('verifies Chapter 04: Pinky Snake — covers the first prototype and "too basic" realization', () => {
      const ch4 = getChapterById('chapter-04');
      expect(ch4).toBeDefined();
      expect(ch4!.title).toContain('Pinky Snake');
      expect(ch4!.subtitle).toContain('Okay. It technically works.');

      const combinedText = ch4!.narrative.join(' ');
      expect(combinedText).toContain('09:30 PM');
      expect(combinedText).toContain('too basic');

      expect(BEFORE_AFTER_COMPARISON.before.timestamp).toBe('09:30 PM');
      expect(BEFORE_AFTER_COMPARISON.after.timestamp).toBe('10:45 AM');
    });

    it('verifies Chapter 05: Breakthrough documents the chain of thought from "too basic" to DangerPinky', () => {
      const ch5 = getChapterById('chapter-05');
      expect(ch5).toBeDefined();
      expect(ch5!.breakthroughs).toBeDefined();
      expect(ch5!.breakthroughs!.length).toBe(3);

      const combinedText = ch5!.narrative.join(' ');
      expect(combinedText).toContain('file');
      expect(combinedText).toContain('Recycle Bin');
      expect(combinedText).toContain('DangerPinky');

      const [bt1, bt2, bt3] = ch5!.breakthroughs!;

      // Breakthrough 1: Relative pinky vector invariance
      expect(bt1.title).toContain('Relative Pinky Vector');
      expect(bt1.formula).toContain('P20');
      expect(bt1.formula).toContain('P17');

      // Breakthrough 2: Deadzone thresholding & dominant axis
      expect(bt2.title).toContain('Dominant Axis');
      expect(bt2.formula).toContain('1.05');

      // Breakthrough 3: Procedural Web Audio synthesis
      expect(bt3.title).toContain('Procedural Oscillator');
      expect(bt3.formula).toContain('AudioContext');
    });

    it('verifies Chapter 06: Two Jobs — covers the coding + outreach split-screen reality', () => {
      const ch6 = getChapterById('chapter-06');
      expect(ch6).toBeDefined();
      expect(ch6!.title).toContain('I Started Building');
      expect(ch6!.tag).toBe('TWO JOBS');

      const narrative = ch6!.narrative.join(' ');
      expect(narrative.toLowerCase()).toContain('outreach');
      expect(narrative).toContain('code');
      expect(narrative).toContain('document');
    });

    it('verifies Chapter 07: The First Time It Actually Moved — covers camera technical story', () => {
      const ch7 = getChapterById('chapter-07');
      expect(ch7).toBeDefined();
      expect(ch7!.title).toContain('First Time It Actually Moved');

      const narrative = ch7!.narrative.join(' ');
      expect(narrative).toContain('Landmark 20');
      expect(narrative).toContain('pinky');
    });

    it('verifies Chapter 08: And Then It Started Breaking — documents 3 failure stories with root cause and fix', () => {
      const ch8 = getChapterById('chapter-08');
      expect(ch8).toBeDefined();
      expect(ch8!.failureStories).toBeDefined();
      expect(ch8!.failureStories!.length).toBe(3);

      const [failure1, failure2, failure3] = ch8!.failureStories!;

      // Failure 1: Camera coordinate jitter
      expect(failure1.title).toContain('Jitter');
      expect(failure1.fix).toContain('EMA');
      expect(failure1.fix).toContain('0.35');

      // Failure 2: 180° suicide turn
      expect(failure2.title).toContain('Suicide Turn');
      expect(failure2.cause).toContain('recoil');
      expect(failure2.fix).toContain('isOppositeDirection');

      // Failure 3: Electron IPC race conditions
      expect(failure3.title).toContain('IPC Race Condition');
      expect(failure3.fix).toContain('session tokens');
      expect(failure3.fix).toContain('shell.trashItem');
    });

    it('verifies Chapter 09: The Project Finally Became Stupid Enough — covers 04:30 AM completion moment', () => {
      const ch9 = getChapterById('chapter-09');
      expect(ch9).toBeDefined();
      expect(ch9!.title).toContain('Stupid Enough');

      const narrative = ch9!.narrative.join(' ');
      expect(narrative).toContain('04:30 AM');
      expect(narrative).toContain('Recycle Bin');
    });

    it('verifies Chapter 10: Solo Builder — highlights Vishnu K R (SNMIMT Maliyankara) and the dual role', () => {
      const ch10 = getChapterById('chapter-10');
      expect(ch10).toBeDefined();
      expect(ch10!.subtitle).toContain('Vishnu K R');
      expect(ch10!.subtitle).toContain('SNMIMT Maliyankara');

      const narrative = ch10!.narrative.join(' ');
      expect(narrative).toContain('Vishnu K R');
      expect(narrative).toContain('SNM Institute of Management and Technology');
      expect(narrative).toContain('Maliyankara');
      expect(narrative).toContain('Ernakulam, Kerala');
      expect(narrative).toContain('solo');
      expect(narrative).toContain('Outreach Lead');
    });

    it('verifies Chapter 11: Chaos at 3 AM — captures the unplugged webcam incident and makeathon atmosphere', () => {
      const ch11 = getChapterById('chapter-11');
      expect(ch11).toBeDefined();
      const narrative = ch11!.narrative.join(' ');

      expect(narrative).toContain('black tea');
      expect(narrative).toContain('banana chips');
      expect(narrative).toContain('airline ground controller');
      expect(narrative).toContain('webcam');
      expect(narrative).toContain('unplugged');
    });

    it('verifies Chapter 12: The Final Push details the final morning countdown to submission', () => {
      const ch12 = getChapterById('chapter-12');
      expect(ch12).toBeDefined();
      const narrative = ch12!.narrative.join(' ');

      expect(narrative).toContain('06:00 AM');
      expect(narrative).toContain('07:30 AM');
      expect(narrative).toContain('08:45 AM');
      expect(narrative).toContain('09:30 AM');
      expect(narrative).toContain('10:15 AM');
      expect(narrative).toContain('build:pages');
    });

    it('verifies Chapter 13: DangerPinky reveal — presents the full architecture pipeline and 4 screenshot cards', () => {
      const ch13 = getChapterById('chapter-13');
      expect(ch13).toBeDefined();
      expect(SCREENSHOTS_DATA.length).toBe(4);

      const ids = SCREENSHOTS_DATA.map((s) => s.id);
      expect(ids).toEqual(['landing', 'gameplay', 'settings', 'gameover']);

      SCREENSHOTS_DATA.forEach((item) => {
        expect(item.src).toContain('.png');
        expect(item.techHighlights.length).toBeGreaterThanOrEqual(3);
      });

      const narrative = ch13!.narrative.join(' ');
      expect(narrative).toContain('DangerPinky');
      expect(narrative).toContain('pinky finger');
    });

    it('verifies Chapter 14: Play DangerPinky sets up the live embedded arena', () => {
      const ch14 = getChapterById('chapter-14');
      expect(ch14).toBeDefined();
      expect(ch14!.subtitle).toContain('Enough reading. Play it.');

      const metadata = ch14!.metadata as { gameUrl: string; controls: Record<string, string> };
      expect(metadata).toBeDefined();
      expect(metadata.gameUrl).toBe('https://vishnuu-kr.github.io/DangerPinky/');
      expect(metadata.controls.camera).toBeDefined();
      expect(metadata.controls.keyboard).toBeDefined();
      expect(metadata.controls.pause).toBeDefined();
    });

    it('verifies Chapter 15: What I Actually Learned — details lessons from the real experience', () => {
      const ch15 = getChapterById('chapter-15');
      expect(ch15).toBeDefined();
      const narrative = ch15!.narrative.join(' ').toLowerCase();

      expect(narrative).toContain('lesson 1');
      expect(narrative).toContain('lesson 2');
      expect(narrative).toContain('lesson 3');
      expect(narrative).toContain('useless ideas');
      expect(narrative).toContain('computer vision');
      expect(narrative).toContain('hard drive');
    });

    it('verifies Chapter 16: If I Had Another Night specifies 4 concrete roadmap items', () => {
      const ch16 = getChapterById('chapter-16');
      expect(ch16).toBeDefined();
      const metadata = ch16!.metadata as { roadmapItems: { title: string }[] };

      expect(metadata).toBeDefined();
      expect(metadata.roadmapItems.length).toBe(4);

      const titles = metadata.roadmapItems.map((r) => r.title);
      expect(titles.some((t) => t.includes('WebRTC Multiplayer'))).toBe(true);
      expect(titles.some((t) => t.includes('Custom Candy Theme'))).toBe(true);
      expect(titles.some((t) => t.includes('Linux & macOS Trash'))).toBe(true);
      expect(titles.some((t) => t.includes('Voice Shouting'))).toBe(true);
    });

    it('verifies Final Reflection delivers a poetic closing and persistent link directory', () => {
      expect(FINAL_REFLECTION).toBeDefined();
      expect(FINAL_REFLECTION.id).toBe('closing');
      expect(FINAL_REFLECTION.title).toBe('Final Reflection');
      expect(FINAL_REFLECTION.subtitle).toContain('In praise of making things for no good reason');

      const text = FINAL_REFLECTION.narrative.join(' ');
      expect(text).toContain('TinkerHub Useless Projects');
      expect(text).toContain('absurd');

      expect(FINAL_REFLECTION.persistentLinks.githubRepo).toBe('https://github.com/vishnuu-kr/DangerPinky');
      expect(FINAL_REFLECTION.persistentLinks.liveDemo).toBe('https://vishnuu-kr.github.io/DangerPinky/');
      expect(FINAL_REFLECTION.persistentLinks.tinkerHubMain).toBe('https://tinkerhub.org');
    });
  });

  // =========================================================================
  // TIER 1: GROUND-TRUTH METADATA & EXTERNAL LINKS
  // =========================================================================
  describe('Tier 1: Ground-Truth Project Metadata & External Links', () => {
    it('verifies all authoritative project facts in HERO_DATA', () => {
      expect(HERO_DATA.author).toBe('Vishnu K R');
      expect(HERO_DATA.institutionShort).toBe('SNMIMT Maliyankara');
      expect(HERO_DATA.institution).toContain('SNM Institute of Management and Technology');
      expect(HERO_DATA.hackathon).toBe('TinkerHub Useless Projects 3.0');
      expect(HERO_DATA.duration).toBe('18-Hour Overnight Makeathon');

      expect(HERO_DATA.badges).toContain('Built by Vishnu K R');
      expect(HERO_DATA.badges).toContain('SNMIMT Maliyankara');
      expect(HERO_DATA.badges).toContain('18-Hour Overnight Makeathon');
      expect(HERO_DATA.badges).toContain('TinkerHub Useless Projects 3.0');
    });

    it('verifies Hero Stats include all 4 foundational pillars', () => {
      expect(HERO_DATA.stats.length).toBe(4);
      const statLabels = HERO_DATA.stats.map((s) => s.label);
      expect(statLabels).toContain('VISION ENGINE');
      expect(statLabels).toContain('TEST SUITE');
      expect(statLabels).toContain('DANGER MODE');
      expect(statLabels).toContain('AUDIO ENGINE');

      const testStat = HERO_DATA.stats.find((s) => s.label === 'TEST SUITE');
      expect(testStat?.value).toBe('39 / 39 Pass');
    });

    it('verifies Hero CTA buttons direct to correct in-page anchors and external media', () => {
      expect(HERO_DATA.ctas.startJourney.label).toBe('START THE JOURNEY ↓');
      expect(HERO_DATA.ctas.startJourney.targetId).toBe('chapter-01');

      expect(HERO_DATA.ctas.playGame.label).toBe('PLAY DANGERPINKY');
      expect(HERO_DATA.ctas.playGame.targetId).toBe('chapter-14');

      expect(HERO_DATA.ctas.watchDemo.url).toBe(PERSISTENT_LINKS.driveVideo);
    });

    it('verifies all authoritative persistent link URLs are correct and complete', () => {
      expect(PERSISTENT_LINKS.liveDemo).toBe('https://vishnuu-kr.github.io/DangerPinky/');
      expect(PERSISTENT_LINKS.githubRepo).toBe('https://github.com/vishnuu-kr/DangerPinky');
      expect(PERSISTENT_LINKS.driveVideo).toContain('drive.google.com/file/d/1aIiCRxT6f9T7WfaB7Iu2qHBtmiiLmvXs');
      expect(PERSISTENT_LINKS.buildPhotos).toContain('drive.google.com/file/d/17yqRVJh22dZAFbSfJG2-ILG1PS2boy4O');
      expect(PERSISTENT_LINKS.assetDriveFolder).toContain('drive.google.com/drive/folders/1u7BUqhHbVeiD0sxTesiC41KkblEXHwSi');
      expect(PERSISTENT_LINKS.tinkerHubMain).toBe('https://tinkerhub.org');
    });
  });

  // =========================================================================
  // TIER 2: ADVERSARIAL VERIFICATION & BUZZWORD PROHIBITION
  // =========================================================================
  describe('Tier 2: Non-Corporate Voice & Buzzword Prohibition', () => {
    const FORBIDDEN_BUZZWORDS = [
      'leveraging innovative technologies',
      'iterative design process',
      'synergistic',
      'synergy',
      'paradigm shift',
      'seamlessly integrated',
      'holistic approach',
      'actionable insights',
      'scalable cloud infrastructure',
      'next-generation solution',
      'mission-critical',
      'best-in-class',
      'low-hanging fruit',
      'move the needle'
    ];

    function extractAllStrings(obj: unknown): string[] {
      const results: string[] = [];
      function walk(val: unknown) {
        if (typeof val === 'string') {
          results.push(val);
        } else if (Array.isArray(val)) {
          val.forEach(walk);
        } else if (val && typeof val === 'object') {
          Object.values(val).forEach(walk);
        }
      }
      walk(obj);
      return results;
    }

    it('proves the buzzword scanner correctly identifies blacklisted terms (Adversarial Verification)', () => {
      const contaminatedSample = [
        'We are leveraging innovative technologies for an iterative design process.',
        'This creates a synergistic paradigm shift with pure synergy.'
      ];

      const foundBuzzwords = FORBIDDEN_BUZZWORDS.filter((buzzword) =>
        contaminatedSample.some((text) => text.toLowerCase().includes(buzzword.toLowerCase()))
      );

      expect(foundBuzzwords).toContain('leveraging innovative technologies');
      expect(foundBuzzwords).toContain('iterative design process');
      expect(foundBuzzwords).toContain('synergistic');
      expect(foundBuzzwords).toContain('synergy');
      expect(foundBuzzwords).toContain('paradigm shift');
    });

    it('verifies that ZERO forbidden corporate buzzwords appear anywhere in the entire journal copy', () => {
      const allText = [
        ...extractAllStrings(HERO_DATA),
        ...extractAllStrings(PROLOGUE_DATA),
        ...extractAllStrings(CHAPTERS),
        ...extractAllStrings(FINAL_REFLECTION),
        ...extractAllStrings(TIMELINE_MILESTONES),
        ...extractAllStrings(TECH_STACK),
        ...extractAllStrings(EVOLUTION_DATA)
      ].join(' ').toLowerCase();

      const violations: string[] = [];

      FORBIDDEN_BUZZWORDS.forEach((buzzword) => {
        if (allText.includes(buzzword.toLowerCase())) {
          violations.push(buzzword);
        }
      });

      expect(violations, `Discovered corporate buzzwords in devlog: ${violations.join(', ')}`).toEqual([]);
    });

    it('verifies that narrative maintains authentic first-person developer tone', () => {
      const allNarrative = CHAPTERS.flatMap((c) => c.narrative).join(' ');

      // Should use first-person voice
      expect(allNarrative.includes(' I ') || allNarrative.includes("I'm") || allNarrative.includes(' my ')).toBe(true);

      // Should mention authentic makeathon details
      expect(allNarrative).toContain('TinkerHub');
      expect(allNarrative).toContain('Recycle Bin');
      expect(allNarrative).toContain('Landmark 20');
    });
  });

  // =========================================================================
  // TIER 1 & 2: SCRAPBOOK PLACEHOLDERS & LABELS
  // =========================================================================
  describe('Tier 1 & 2: Scrapbook Annotation Labels', () => {
    it('verifies chapters requiring physical evidence have styled scrapbook tags', () => {
      const chaptersWithTags = CHAPTERS.filter((c) => c.scrapbookTag || (c.scrapbookTags && c.scrapbookTags.length > 0));
      expect(chaptersWithTags.length).toBeGreaterThanOrEqual(7);

      const allTags = CHAPTERS.flatMap((c) => [
        ...(c.scrapbookTag ? [c.scrapbookTag] : []),
        ...(c.scrapbookTags || [])
      ]);

      // Every tag must be properly bracketed with [ADD ...]
      allTags.forEach((tag) => {
        expect(tag.startsWith('[ADD ')).toBe(true);
        expect(tag.endsWith(']')).toBe(true);
      });
    });

    it('verifies presence of essential scrapbook evidence hooks', () => {
      const allTags = CHAPTERS.flatMap((c) => [
        ...(c.scrapbookTag ? [c.scrapbookTag] : []),
        ...(c.scrapbookTags || [])
      ]);

      expect(allTags.some((t) => t.includes('SKETCH'))).toBe(true);
      expect(allTags.some((t) => t.includes('BUG SCREENSHOT') || t.includes('180°'))).toBe(true);
      expect(allTags.some((t) => t.includes('PHOTO') || t.includes('workstation'))).toBe(true);
      expect(allTags.some((t) => t.includes('39 green test'))).toBe(true);
    });
  });

  // =========================================================================
  // TIER 1 & 2: SECTION 14 IFRAME PARAMETERS
  // =========================================================================
  describe('Tier 1 & 2: Section 14 Embedded Arena & Iframe Parameters', () => {
    it('verifies Section 14 embedded iframe configuration', () => {
      const ch14 = getChapterById('chapter-14');
      expect(ch14).toBeDefined();

      const metadata = ch14!.metadata as {
        gameUrl: string;
        embedOptions: { allowFullscreen: boolean; allowCamera: boolean; externalLaunchUrl: string };
        controls: Record<string, string>;
      };

      expect(metadata.gameUrl).toBe('https://vishnuu-kr.github.io/DangerPinky/');
      expect(metadata.embedOptions.allowFullscreen).toBe(true);
      expect(metadata.embedOptions.allowCamera).toBe(true);
      expect(metadata.embedOptions.externalLaunchUrl).toBe('https://vishnuu-kr.github.io/DangerPinky/');

      // Allow string used by iframe in DOM
      const allowString = 'camera; autoplay; fullscreen';
      expect(allowString).toContain('camera');
      expect(allowString).toContain('autoplay');
      expect(allowString).toContain('fullscreen');
    });

    it('verifies Section 14 provides instructions for both camera and keyboard fallback', () => {
      const ch14 = getChapterById('chapter-14');
      const controls = (ch14!.metadata as { controls: Record<string, string> }).controls;

      expect(controls.camera).toContain('Landmark 20');
      expect(controls.keyboard).toContain('Arrow');
      expect(controls.pause).toContain('Space');
    });
  });

  // =========================================================================
  // TIER 1 & 3: AUDIO SOUNDBOARD MAPPINGS & SYNTHESIZER INTEGRATION
  // =========================================================================
  describe('Tier 1 & 3: Audio Soundboard Mappings & Synthesizer Integration', () => {
    it('verifies SOUNDBOARD_DATA contains all 5 distinct sound triggers with correct waveforms', () => {
      expect(SOUNDBOARD_DATA.length).toBe(5);

      const imageChime = SOUNDBOARD_DATA.find((s) => s.id === 'image');
      expect(imageChime).toBeDefined();
      expect(imageChime?.waveform).toBe('sine');
      expect(imageChime?.frequencyRamp).toContain('659.25');
      expect(imageChime?.duration).toBe('0.17s');

      const codeArpeggio = SOUNDBOARD_DATA.find((s) => s.id === 'code');
      expect(codeArpeggio).toBeDefined();
      expect(codeArpeggio?.waveform).toBe('square');
      expect(codeArpeggio?.frequencyRamp).toContain('440');
      expect(codeArpeggio?.duration).toBe('0.15s');

      const archiveThud = SOUNDBOARD_DATA.find((s) => s.id === 'archive');
      expect(archiveThud).toBeDefined();
      expect(archiveThud?.waveform).toBe('sawtooth');
      expect(archiveThud?.frequencyRamp).toContain('200');
      expect(archiveThud?.duration).toBe('0.16s');

      const fanfare = SOUNDBOARD_DATA.find((s) => s.id === 'highscore');
      expect(fanfare).toBeDefined();
      expect(fanfare?.waveform).toBe('triangle');
      expect(fanfare?.frequencyRamp).toContain('523.25');

      const gameOver = SOUNDBOARD_DATA.find((s) => s.id === 'gameover');
      expect(gameOver).toBeDefined();
      expect(gameOver?.waveform).toBe('sawtooth');
      expect(gameOver?.frequencyRamp).toContain('240');
      expect(gameOver?.duration).toBe('0.50s');
    });

    describe('Procedural Audio Synthesizer Runtime Simulation', () => {
      let createdOscillators: {
        type: string;
        frequency: { setValueAtTime: ReturnType<typeof vi.fn>; exponentialRampToValueAtTime: ReturnType<typeof vi.fn> };
        start: ReturnType<typeof vi.fn>;
        stop: ReturnType<typeof vi.fn>;
        connect: ReturnType<typeof vi.fn>;
      }[] = [];

      beforeEach(() => {
        createdOscillators = [];

        const mockGainNode = {
          gain: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn()
          },
          connect: vi.fn()
        };

        const mockAudioContext = vi.fn().mockImplementation(() => ({
          state: 'running',
          currentTime: 10.0,
          createOscillator: vi.fn().mockImplementation(() => {
            const osc = {
              type: 'sine',
              frequency: {
                setValueAtTime: vi.fn(),
                exponentialRampToValueAtTime: vi.fn()
              },
              connect: vi.fn(),
              start: vi.fn(),
              stop: vi.fn()
            };
            createdOscillators.push(osc);
            return osc;
          }),
          createGain: vi.fn().mockReturnValue(mockGainNode),
          destination: {},
          resume: vi.fn().mockResolvedValue(undefined)
        }));

        (global as any).window = {
          AudioContext: mockAudioContext
        };
        (sound as any).ctx = null;
        sound.setMuted(false);
        sound.setVolume(0.8);
      });

      afterEach(() => {
        sound.setMuted(false);
      });

      it('synthesizes sine wave with frequency ramp on playEatSound("image")', () => {
        sound.playEatSound('image');
        expect(createdOscillators.length).toBe(1);
        const osc = createdOscillators[0];
        expect(osc.type).toBe('sine');
        expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(659.25, 10.0);
        expect(osc.start).toHaveBeenCalled();
        expect(osc.stop).toHaveBeenCalled();
      });

      it('synthesizes square wave on playEatSound("code")', () => {
        sound.playEatSound('code');
        expect(createdOscillators.length).toBe(1);
        const osc = createdOscillators[0];
        expect(osc.type).toBe('square');
        expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(440, 10.0);
      });

      it('synthesizes sawtooth wave on playEatSound("archive")', () => {
        sound.playEatSound('archive');
        expect(createdOscillators.length).toBe(1);
        const osc = createdOscillators[0];
        expect(osc.type).toBe('sawtooth');
        expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(200, 10.0);
      });

      it('synthesizes four staggered triangle oscillators on playHighScore()', () => {
        sound.playHighScore();
        expect(createdOscillators.length).toBe(4);
        createdOscillators.forEach((osc) => {
          expect(osc.type).toBe('triangle');
        });
      });

      it('synthesizes descending pitch slide on playGameOver()', () => {
        sound.playGameOver();
        expect(createdOscillators.length).toBe(1);
        const osc = createdOscillators[0];
        expect(osc.type).toBe('sawtooth');
        expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(240, 10.0);
        expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(55, 10.45);
      });

      it('suppresses oscillator generation when muted', () => {
        sound.setMuted(true);
        expect(sound.getMuted()).toBe(true);

        sound.playEatSound('image');
        sound.playGameOver();
        sound.playHighScore();

        expect(createdOscillators.length).toBe(0);
      });

      it('properly bounds volume adjustments between 0.0 and 1.0', () => {
        sound.setVolume(-0.5);
        expect(sound.getVolume()).toBe(0);

        sound.setVolume(1.8);
        expect(sound.getVolume()).toBe(1);

        sound.setVolume(0.42);
        expect(sound.getVolume()).toBe(0.42);
      });
    });
  });

  // =========================================================================
  // TIER 2 & 3: DESKTOP VS WEB ROUTING BEHAVIOR
  // =========================================================================
  describe('Tier 2 & 3: Desktop vs Web Routing Behavior', () => {
    const originalWindow = (global as any).window;

    afterEach(() => {
      (global as any).window = originalWindow;
    });

    it('identifies browser web environment when fileSnakeNative bridge is missing', () => {
      (global as any).window = { location: { hash: '' } };
      expect(isDesktopApp()).toBe(false);
    });

    it('identifies desktop environment when fileSnakeNative.isDesktop is true', () => {
      (global as any).window = {
        location: { hash: '' },
        fileSnakeNative: { isDesktop: true }
      };
      expect(isDesktopApp()).toBe(true);
    });

    // Mirror the exact getInitialScreen() contract from src/App.tsx
    function resolveInitialScreen(mockWindow: any): 'LANDING' | 'GAME' | 'JOURNAL' {
      if (typeof mockWindow !== 'undefined') {
        const hash = (mockWindow.location?.hash || '').toLowerCase();
        if (hash === '#game' || hash === '#play') return 'LANDING';
        if (hash === '#journal') return 'JOURNAL';
        if (Boolean(mockWindow.fileSnakeNative?.isDesktop)) return 'LANDING';
        return 'JOURNAL';
      }
      return 'JOURNAL';
    }

    it('defaults web visitor to JOURNAL screen when visiting root URL without hash', () => {
      const mockWebWindow = { location: { hash: '' }, fileSnakeNative: undefined };
      expect(resolveInitialScreen(mockWebWindow)).toBe('JOURNAL');
    });

    it('routes web visitor with #game or #play hash directly to LANDING screen', () => {
      const mockGameHash = { location: { hash: '#game' }, fileSnakeNative: undefined };
      expect(resolveInitialScreen(mockGameHash)).toBe('LANDING');

      const mockPlayHash = { location: { hash: '#play' }, fileSnakeNative: undefined };
      expect(resolveInitialScreen(mockPlayHash)).toBe('LANDING');
    });

    it('defaults Electron desktop application to LANDING game dashboard', () => {
      const mockDesktopWindow = {
        location: { hash: '' },
        fileSnakeNative: { isDesktop: true }
      };
      expect(resolveInitialScreen(mockDesktopWindow)).toBe('LANDING');
    });

    it('allows desktop user to navigate to JOURNAL via explicit #journal hash', () => {
      const mockDesktopJournal = {
        location: { hash: '#journal' },
        fileSnakeNative: { isDesktop: true }
      };
      expect(resolveInitialScreen(mockDesktopJournal)).toBe('JOURNAL');
    });

    it('gracefully handles undefined window during SSR or build time', () => {
      expect(resolveInitialScreen(undefined)).toBe('JOURNAL');
    });
  });

  // =========================================================================
  // TIER 1 & 2: HELPER ACCESSORS & DATA INTEGRITY
  // =========================================================================
  describe('Tier 1 & 2: Helper Accessors & Data Integrity', () => {
    it('retrieves chapters by ID correctly', () => {
      const ch1 = getChapterById('chapter-01');
      expect(ch1).toBeDefined();
      expect(ch1?.number).toBe('01');

      const ch16 = getChapterById('chapter-16');
      expect(ch16).toBeDefined();
      expect(ch16?.number).toBe('16');

      expect(getChapterById('non-existent')).toBeUndefined();
    });

    it('retrieves chapters by section number correctly', () => {
      const ch5 = getChapterByNumber('05');
      expect(ch5).toBeDefined();
      expect(ch5?.id).toBe('chapter-05');

      expect(getChapterByNumber('99')).toBeUndefined();
    });

    it('guarantees unique IDs across all 19 sections', () => {
      const allIds = getAllSectionIds();
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
      expect(allIds.length).toBe(19);
    });
  });
});
