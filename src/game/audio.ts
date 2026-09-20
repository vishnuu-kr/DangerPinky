import { FileCategory } from '../types/file';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.7;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMute = localStorage.getItem('dangerpinky_sound_muted');
        if (savedMute !== null) {
          this.isMuted = JSON.parse(savedMute);
        }
        const savedVol = localStorage.getItem('dangerpinky_sound_volume');
        if (savedVol !== null) {
          this.masterVolume = JSON.parse(savedVol);
        }
      } catch {}
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dangerpinky_sound_muted', JSON.stringify(muted));
      } catch {}
    }
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dangerpinky_sound_volume', JSON.stringify(this.masterVolume));
      } catch {}
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public playEatSound(category: FileCategory) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const baseVol = 0.25 * this.masterVolume;

    switch (category) {
      case 'code':
        // 8-bit retro dual jump arpeggio
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(880, t + 0.05);
        gain.gain.setValueAtTime(baseVol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.start(t);
        osc.stop(t + 0.15);
        break;

      case 'image':
        // Crisp bright bell tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, t); // E5
        osc.frequency.exponentialRampToValueAtTime(987.77, t + 0.08); // B5
        gain.gain.setValueAtTime(baseVol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.start(t);
        osc.stop(t + 0.17);
        break;

      case 'audio':
        // Melodic triple chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, t); // C5
        osc.frequency.setValueAtTime(659.25, t + 0.04); // E5
        osc.frequency.setValueAtTime(783.99, t + 0.08); // G5
        gain.gain.setValueAtTime(baseVol * 1.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.21);
        break;

      case 'video':
        // Warm rich brassy swell
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(329.63, t); // E4
        osc.frequency.exponentialRampToValueAtTime(440.0, t + 0.1);
        gain.gain.setValueAtTime(baseVol * 0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.19);
        break;

      case 'archive':
        // Zippy frequency slide
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.08);
        gain.gain.setValueAtTime(baseVol * 0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.16);
        break;

      case 'document':
      default:
        // Pleasant typewriter snap chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, t); // D5
        osc.frequency.setValueAtTime(880, t + 0.06); // A5
        gain.gain.setValueAtTime(baseVol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.16);
        break;
    }
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.45);

    const baseVol = 0.35 * this.masterVolume;
    gain.gain.setValueAtTime(baseVol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  public playCountdown(isGo: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    const freq = isGo ? 880 : 440;
    osc.frequency.setValueAtTime(freq, t);

    const baseVol = 0.2 * this.masterVolume;
    gain.gain.setValueAtTime(baseVol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isGo ? 0.3 : 0.12));

    osc.start(t);
    osc.stop(t + (isGo ? 0.31 : 0.13));
  }

  public playHighScore() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const t0 = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = t0 + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      const baseVol = 0.25 * this.masterVolume;
      gain.gain.setValueAtTime(baseVol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  public playGestureTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.04);

    const baseVol = 0.08 * this.masterVolume;
    gain.gain.setValueAtTime(baseVol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  public playPageTurn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      // Layer 1: Quick initial finger-rustle attack (high freq, short)
      const rushBufferSize = Math.floor(this.ctx.sampleRate * 0.04);
      const rushBuffer = this.ctx.createBuffer(1, rushBufferSize, this.ctx.sampleRate);
      const rushData = rushBuffer.getChannelData(0);
      for (let i = 0; i < rushBufferSize; i++) {
        rushData[i] = (Math.random() * 2 - 1) * (1 - i / rushBufferSize);
      }
      const rushNoise = this.ctx.createBufferSource();
      rushNoise.buffer = rushBuffer;

      const rushFilter = this.ctx.createBiquadFilter();
      rushFilter.type = 'highpass';
      rushFilter.frequency.setValueAtTime(2200, t);

      const rushGain = this.ctx.createGain();
      const rushVol = 0.07 * this.masterVolume;
      rushGain.gain.setValueAtTime(0.001, t);
      rushGain.gain.linearRampToValueAtTime(rushVol, t + 0.008);
      rushGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

      rushNoise.connect(rushFilter);
      rushFilter.connect(rushGain);
      rushGain.connect(this.ctx.destination);

      rushNoise.start(t);
      rushNoise.stop(t + 0.04);

      // Layer 2: Main paper swish (bandpass, longer, slightly pitched down)
      const swishBufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const swishBuffer = this.ctx.createBuffer(1, swishBufferSize, this.ctx.sampleRate);
      const swishData = swishBuffer.getChannelData(0);
      for (let i = 0; i < swishBufferSize; i++) {
        swishData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / swishBufferSize, 1.4);
      }

      const swishNoise = this.ctx.createBufferSource();
      swishNoise.buffer = swishBuffer;

      const swishFilter = this.ctx.createBiquadFilter();
      swishFilter.type = 'bandpass';
      swishFilter.frequency.setValueAtTime(800, t + 0.01);
      swishFilter.frequency.exponentialRampToValueAtTime(280, t + 0.18);
      swishFilter.Q.setValueAtTime(2.2, t + 0.01);

      const swishGain = this.ctx.createGain();
      const swishVol = 0.11 * this.masterVolume;
      swishGain.gain.setValueAtTime(0.003, t + 0.01);
      swishGain.gain.linearRampToValueAtTime(swishVol, t + 0.035);
      swishGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      swishNoise.connect(swishFilter);
      swishFilter.connect(swishGain);
      swishGain.connect(this.ctx.destination);

      swishNoise.start(t + 0.01);
      swishNoise.stop(t + 0.19);
    } catch {
      // Graceful fallback if Web Audio is restricted
    }
  }
}

export const sound = new SoundSynthesizer();
