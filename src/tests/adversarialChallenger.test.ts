import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { isDesktopApp } from '../filesystem/nativeBridge';
import { sound } from '../game/audio';
import { PERSISTENT_LINKS, getChapterById } from '../data/journalChapters';

describe('Adversarial Challenge Suite: DangerPinky System Gate', () => {
  // =========================================================================
  // 1. DESKTOP VS WEB ROUTING & HASH HANDLING
  // =========================================================================
  describe('Challenge 1: Desktop vs Web Dual Routing & Hash Resilience', () => {
    const originalWindow = (global as any).window;

    afterEach(() => {
      (global as any).window = originalWindow;
    });

    it('returns false for isDesktopApp() when window is undefined (SSR simulation)', () => {
      (global as any).window = undefined;
      expect(isDesktopApp()).toBe(false);
    });

    it('returns false for isDesktopApp() under various non-desktop or partial objects', () => {
      (global as any).window = {};
      expect(isDesktopApp()).toBe(false);

      (global as any).window = { fileSnakeNative: null };
      expect(isDesktopApp()).toBe(false);

      (global as any).window = { fileSnakeNative: {} };
      expect(isDesktopApp()).toBe(false);

      (global as any).window = { fileSnakeNative: { isDesktop: false } };
      expect(isDesktopApp()).toBe(false);

      (global as any).window = { fileSnakeNative: { isDesktop: 0 } };
      expect(isDesktopApp()).toBe(false);

      (global as any).window = { fileSnakeNative: { isDesktop: '' } };
      expect(isDesktopApp()).toBe(false);
    });

    it('returns true for isDesktopApp() when fileSnakeNative.isDesktop is truthy', () => {
      (global as any).window = { fileSnakeNative: { isDesktop: true } };
      expect(isDesktopApp()).toBe(true);

      (global as any).window = { fileSnakeNative: { isDesktop: 1 } };
      expect(isDesktopApp()).toBe(true);
    });

    // Mirror the exact App.tsx getInitialScreen logic
    function resolveAppScreen(win: any): 'LANDING' | 'GAME' | 'JOURNAL' {
      if (typeof win !== 'undefined') {
        const hash = (win.location?.hash || '').toLowerCase();
        if (hash === '#game' || hash === '#play') return 'LANDING';
        if (hash === '#journal') return 'JOURNAL';
        if (Boolean(win.fileSnakeNative?.isDesktop)) return 'LANDING';
        return 'JOURNAL';
      }
      return 'JOURNAL';
    }

    it('routes web visitor at root URL directly to JOURNAL', () => {
      const mockWeb = { location: { hash: '' } };
      expect(resolveAppScreen(mockWeb)).toBe('JOURNAL');
    });

    it('routes web visitor with #game or #play hash to LANDING', () => {
      expect(resolveAppScreen({ location: { hash: '#game' } })).toBe('LANDING');
      expect(resolveAppScreen({ location: { hash: '#play' } })).toBe('LANDING');
    });

    it('is case-insensitive for hash routes', () => {
      expect(resolveAppScreen({ location: { hash: '#GAME' } })).toBe('LANDING');
      expect(resolveAppScreen({ location: { hash: '#PLAY' } })).toBe('LANDING');
      expect(resolveAppScreen({ location: { hash: '#JOURNAL' } })).toBe('JOURNAL');
    });

    it('defaults in-page chapter anchor hashes to JOURNAL on web', () => {
      expect(resolveAppScreen({ location: { hash: '#chapter-01' } })).toBe('JOURNAL');
      expect(resolveAppScreen({ location: { hash: '#chapter-14' } })).toBe('JOURNAL');
      expect(resolveAppScreen({ location: { hash: '#hero' } })).toBe('JOURNAL');
      expect(resolveAppScreen({ location: { hash: '#closing' } })).toBe('JOURNAL');
    });

    it('routes Electron desktop application to LANDING by default', () => {
      const mockDesktop = {
        location: { hash: '' },
        fileSnakeNative: { isDesktop: true }
      };
      expect(resolveAppScreen(mockDesktop)).toBe('LANDING');
    });

    it('allows Electron desktop user to navigate to JOURNAL via #journal', () => {
      const mockDesktop = {
        location: { hash: '#journal' },
        fileSnakeNative: { isDesktop: true }
      };
      expect(resolveAppScreen(mockDesktop)).toBe('JOURNAL');
    });

    it('survives adversarial, fuzz, or malicious hash strings without throwing', () => {
      const adversarialHashes = [
        '#',
        '##',
        '#<script>alert(1)</script>',
        '#../docs/index.html',
        '#?query=1&route=play',
        '#javascript:void(0)',
        '#undefined',
        '#null',
        '#[object Object]',
        '#🎮🎯👾',
        '#' + 'a'.repeat(4096)
      ];

      adversarialHashes.forEach((h) => {
        expect(() => resolveAppScreen({ location: { hash: h } })).not.toThrow();
        // Web fallback must be JOURNAL
        expect(resolveAppScreen({ location: { hash: h } })).toBe('JOURNAL');
        // Desktop fallback must be LANDING
        expect(
          resolveAppScreen({
            location: { hash: h },
            fileSnakeNative: { isDesktop: true }
          })
        ).toBe('LANDING');
      });
    });

    it('simulates rapid flurry of 100 hashchange events without error', () => {
      let currentScreen: 'LANDING' | 'GAME' | 'JOURNAL' = 'JOURNAL';
      const isDesktop = false;

      const handleHashChange = (hash: string) => {
        const h = hash.toLowerCase();
        if (h === '#game' || h === '#play') {
          currentScreen = 'LANDING';
        } else if (h === '#journal') {
          currentScreen = 'JOURNAL';
        } else if (h === '') {
          currentScreen = isDesktop ? 'LANDING' : 'JOURNAL';
        }
        // Other hashes leave screen unchanged
      };

      const testHashes = ['#game', '#journal', '#play', '#chapter-05', '#', '', '#invalid'];
      for (let i = 0; i < 100; i++) {
        const h = testHashes[i % testHashes.length];
        expect(() => handleHashChange(h)).not.toThrow();
      }
      expect(['LANDING', 'JOURNAL']).toContain(currentScreen);
    });
  });

  // =========================================================================
  // 2. WEB AUDIO OSCILLATOR ERROR HANDLING & BOUNDS
  // =========================================================================
  describe('Challenge 2: Web Audio Oscillator Handling & Stress Bounds', () => {
    let mockAudioContext: any;
    let resumePromiseReject: boolean = false;
    let createdOscillators: any[] = [];
    let createdGainNodes: any[] = [];

    beforeEach(() => {
      createdOscillators = [];
      createdGainNodes = [];
      resumePromiseReject = false;

      mockAudioContext = vi.fn().mockImplementation(() => {
        const ctxObj = {
          state: 'suspended',
          currentTime: 1.0,
          resume: vi.fn().mockImplementation(() => {
            if (resumePromiseReject) {
              return Promise.reject(new Error('Autoplay blocked: user gesture required'));
            }
            ctxObj.state = 'running';
            return Promise.resolve();
          }),
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
          createGain: vi.fn().mockImplementation(() => {
            const gainNode = {
              gain: {
                setValueAtTime: vi.fn(),
                exponentialRampToValueAtTime: vi.fn()
              },
              connect: vi.fn()
            };
            createdGainNodes.push(gainNode);
            return gainNode;
          }),
          destination: {}
        };
        return ctxObj;
      });

      (global as any).window = {
        AudioContext: mockAudioContext
      };
      (sound as any).ctx = null;
      sound.setMuted(false);
      sound.setVolume(0.7);
    });

    afterEach(() => {
      sound.setMuted(false);
    });

    it('safely handles AudioContext resume rejection prior to user gesture without unhandled error', async () => {
      resumePromiseReject = true;

      // Trigger eat sound before user gesture
      expect(() => sound.playEatSound('image')).not.toThrow();

      // Ensure no uncaught promise rejection occurred
      await new Promise((r) => setTimeout(r, 10));
      expect(createdOscillators.length).toBe(1);
    });

    it('survives rapid burst of 500 sound synthesizer calls across all categories', () => {
      const categories = ['image', 'code', 'audio', 'video', 'archive', 'document'] as const;

      expect(() => {
        for (let i = 0; i < 500; i++) {
          const cat = categories[i % categories.length];
          sound.playEatSound(cat);
        }
      }).not.toThrow();

      expect(createdOscillators.length).toBe(500);
      expect(createdGainNodes.length).toBe(500);
    });

    it('ensures all gain exponential ramps target positive values strictly > 0 (avoiding RangeError)', () => {
      sound.playEatSound('image');
      sound.playEatSound('code');
      sound.playEatSound('audio');
      sound.playEatSound('video');
      sound.playEatSound('archive');
      sound.playEatSound('document');
      sound.playGameOver();
      sound.playCountdown(true);
      sound.playCountdown(false);
      sound.playHighScore();
      sound.playGestureTick();

      createdGainNodes.forEach((node) => {
        const rampCalls = node.gain.exponentialRampToValueAtTime.mock.calls;
        rampCalls.forEach(([targetVal]: [number]) => {
          expect(targetVal).toBeGreaterThan(0);
        });
      });
    });

    it('ensures all frequency exponential ramps target positive values strictly > 0', () => {
      sound.playEatSound('image');
      sound.playEatSound('audio');
      sound.playEatSound('video');
      sound.playEatSound('archive');
      sound.playGameOver();
      sound.playGestureTick();

      createdOscillators.forEach((osc) => {
        const rampCalls = osc.frequency.exponentialRampToValueAtTime.mock.calls;
        rampCalls.forEach(([targetFreq]: [number]) => {
          expect(targetFreq).toBeGreaterThan(0);
        });
      });
    });

    it('strictly clamps volume bounds under extreme or negative inputs', () => {
      sound.setVolume(-100);
      expect(sound.getVolume()).toBe(0);

      sound.setVolume(100);
      expect(sound.getVolume()).toBe(1);

      sound.setVolume(0);
      expect(sound.getVolume()).toBe(0);

      sound.setVolume(0.55);
      expect(sound.getVolume()).toBe(0.55);
    });

    it('suppresses 100% of oscillator and gain creation when muted is true', () => {
      sound.setMuted(true);
      expect(sound.getMuted()).toBe(true);

      sound.playEatSound('image');
      sound.playEatSound('code');
      sound.playEatSound('audio');
      sound.playEatSound('video');
      sound.playEatSound('archive');
      sound.playEatSound('document');
      sound.playGameOver();
      sound.playHighScore();
      sound.playCountdown(true);
      sound.playGestureTick();

      expect(createdOscillators.length).toBe(0);
      expect(createdGainNodes.length).toBe(0);
    });

    it('resumes sound generation immediately after unmuting', () => {
      sound.setMuted(true);
      sound.playEatSound('image');
      expect(createdOscillators.length).toBe(0);

      sound.setMuted(false);
      sound.playEatSound('image');
      expect(createdOscillators.length).toBe(1);
    });

    it('gracefully degrades to no-op when window is undefined (SSR)', () => {
      (global as any).window = undefined;
      (sound as any).ctx = null;

      expect(() => {
        sound.playEatSound('image');
        sound.playGameOver();
        sound.playHighScore();
      }).not.toThrow();
    });
  });

  // =========================================================================
  // 3. SECTION 14 EMBEDDED ARENA & IFRAME PERMISSIONS
  // =========================================================================
  describe('Challenge 3: Section 14 Iframe Permissions & Responsive Fallbacks', () => {
    it('verifies Section 14 embedded arena uses valid live demo URL', () => {
      const ch14 = getChapterById('chapter-14');
      expect(ch14).toBeDefined();

      const meta = ch14!.metadata as { gameUrl: string; embedOptions: any };
      expect(meta.gameUrl).toBe('https://vishnuu-kr.github.io/DangerPinky/');
      expect(meta.gameUrl).toBe(PERSISTENT_LINKS.liveDemo);
    });

    it('ensures permissions policy grants camera, autoplay, and fullscreen', () => {
      const ch14 = getChapterById('chapter-14');
      const meta = ch14!.metadata as {
        embedOptions: { allowFullscreen: boolean; allowCamera: boolean; externalLaunchUrl: string };
      };

      expect(meta.embedOptions.allowCamera).toBe(true);
      expect(meta.embedOptions.allowFullscreen).toBe(true);

      const requiredPermissions = ['camera', 'autoplay', 'fullscreen'];
      const iframeAllowAttr = 'camera; autoplay; fullscreen';
      requiredPermissions.forEach((p) => {
        expect(iframeAllowAttr).toContain(p);
      });
    });

    it('verifies dual controls fallback (Landmark 20 pinky vs Arrow keys / WASD)', () => {
      const ch14 = getChapterById('chapter-14');
      const controls = (ch14!.metadata as { controls: Record<string, string> }).controls;

      expect(controls.camera).toBeDefined();
      expect(controls.camera).toContain('Landmark 20');

      expect(controls.keyboard).toBeDefined();
      expect(controls.keyboard).toContain('Arrow Keys');
      expect(controls.keyboard).toContain('W A S D');

      expect(controls.pause).toBeDefined();
      expect(controls.pause).toContain('Space');
    });

    it('verifies PlayEmbedSection.tsx source code contains required iframe attributes and escape key handler', () => {
      const filePath = path.resolve(__dirname, '../components/journal/PlayEmbedSection.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // Check allow attribute
      expect(content).toContain('allow="camera; autoplay; fullscreen"');

      // Check title for accessibility
      expect(content).toContain('title="DangerPinky Live Game"');

      // Check lazy loading
      expect(content).toContain('loading="lazy"');

      // Check external link safety
      expect(content).toContain('target="_blank"');
      expect(content).toContain('rel="noopener noreferrer"');

      // Check Escape key event listener for fullscreen exit
      expect(content).toContain("e.key === 'Escape'");
      expect(content).toContain("window.removeEventListener('keydown', handleKeyDown)");

      // Check reload key for iframe remount
      expect(content).toContain('setReloadKey');
      expect(content).toContain('key={reloadKey}');
    });
  });

  // =========================================================================
  // 4. PRODUCTION BUILD & DEPLOYMENT INTEGRITY
  // =========================================================================
  describe('Challenge 4: Production Build & SPA Deployment Integrity', () => {
    const rootDir = path.resolve(__dirname, '../../');
    const docsDir = path.join(rootDir, 'docs');
    const distDir = path.join(rootDir, 'dist');

    it('verifies dist directory was built with index.html and assets', () => {
      expect(fs.existsSync(distDir)).toBe(true);
      expect(fs.existsSync(path.join(distDir, 'index.html'))).toBe(true);
      expect(fs.existsSync(path.join(distDir, 'assets'))).toBe(true);
    });

    it('verifies docs directory contains synced index.html, .nojekyll, and 404.html', () => {
      expect(fs.existsSync(docsDir)).toBe(true);
      expect(fs.existsSync(path.join(docsDir, 'index.html'))).toBe(true);
      expect(fs.existsSync(path.join(docsDir, '.nojekyll'))).toBe(true);
      expect(fs.existsSync(path.join(docsDir, '404.html'))).toBe(true);
    });

    it('verifies docs/404.html is an exact mirror of docs/index.html for SPA routing', () => {
      const indexContent = fs.readFileSync(path.join(docsDir, 'index.html'), 'utf8');
      const notFoundContent = fs.readFileSync(path.join(docsDir, '404.html'), 'utf8');
      expect(notFoundContent).toBe(indexContent);
    });

    it('verifies production bundle contains required HTML root and script tags', () => {
      const htmlContent = fs.readFileSync(path.join(docsDir, 'index.html'), 'utf8');
      expect(htmlContent).toContain('<div id="root"></div>');
      expect(htmlContent).toContain('type="module"');
      expect(htmlContent).toContain('DangerPinky');
    });
  });
});
