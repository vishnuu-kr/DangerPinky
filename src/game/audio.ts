import { FileCategory } from '../types/file';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.7;
  private masterFilter: BiquadFilterNode | null = null;

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
    if (this.ctx && !this.masterFilter && 'createBiquadFilter' in this.ctx) {
      try {
        this.masterFilter = this.ctx.createBiquadFilter();
        this.masterFilter.type = 'lowpass';
        this.masterFilter.frequency.setValueAtTime(20000, this.ctx.currentTime);
        this.masterFilter.connect(this.ctx.destination);
      } catch {}
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

  private bgmInterval: ReturnType<typeof setInterval> | null = null;
  private bgmStep: number = 0;
  private bgmVolume: number = 0.35;
  private isBgmEnabled: boolean = true;
  private isBgmPlaying: boolean = false;
  private currentComboLevel: number = 1;
  private lastHeartbeatTime: number = 0;
  private bgmScale: number[] = [130.81, 164.81, 196.00, 220.00, 261.63, 220.00, 196.00, 164.81];

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
  }

  public setBgmEnabled(enabled: boolean) {
    this.isBgmEnabled = enabled;
    if (!enabled) {
      this.stopBgm();
    }
  }

  public setComboLevel(level: number) {
    this.currentComboLevel = Math.max(1, Math.min(5, level));
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public isBgmActive(): boolean {
    return this.isBgmPlaying;
  }

  private connectDestination(node: AudioNode, pan: number = 0) {
    if (!this.ctx) return;
    const dest = this.masterFilter || this.ctx.destination;
    if (pan !== 0 && 'createStereoPanner' in this.ctx) {
      try {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.ctx.currentTime);
        node.connect(panner);
        panner.connect(dest);
        return;
      } catch {}
    }
    node.connect(dest);
  }

  public setPaused(isPaused: boolean) {
    if (!this.ctx || !this.masterFilter) return;
    try {
      const t = this.ctx.currentTime;
      this.masterFilter.frequency.cancelScheduledValues(t);
      if (isPaused) {
        // Muffle with smooth exponential ramp down to 350Hz ("club bathroom" effect)
        this.masterFilter.frequency.setTargetAtTime(350, t, 0.08);
      } else {
        // Restore crisp full spectrum
        this.masterFilter.frequency.setTargetAtTime(20000, t, 0.06);
      }
    } catch {}
  }

  public startBgm(tickSpeedMs: number = 140) {
    if (!this.isBgmEnabled) return;
    this.isBgmPlaying = true;
    this.initContext();
    this.stopBgmTimer();
    const interval = Math.max(80, Math.min(260, tickSpeedMs));
    this.bgmInterval = setInterval(() => this.playBgmTick(), interval);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    this.stopBgmTimer();
  }

  private stopBgmTimer() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  private playBgmTick() {
    if (!this.ctx || this.isMuted || !this.isBgmEnabled || !this.isBgmPlaying) return;
    try {
      const t = this.ctx.currentTime;
      const freq = this.bgmScale[this.bgmStep % this.bgmScale.length];
      this.bgmStep++;

      // Stem 1: Bassline chiptune arpeggio (triangle wave lowpass 600Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      const vol = 0.038 * this.masterVolume * this.bgmVolume;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      this.connectDestination(gain);

      osc.start(t);
      osc.stop(t + 0.19);

      // Stem 2 (Combo >= 2): Chiptune soprano lead melody (+1 octave square)
      if (this.currentComboLevel >= 2) {
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(freq * 2, t);
        const vol2 = 0.016 * this.masterVolume * this.bgmVolume;
        gain2.gain.setValueAtTime(vol2, t);
        gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        osc2.connect(gain2);
        this.connectDestination(gain2);
        osc2.start(t);
        osc2.stop(t + 0.13);
      }

      // Stem 3 (Combo >= 3): Chiptune percussion snare click
      if (this.currentComboLevel >= 3 && this.bgmStep % 2 === 0) {
        const noiseBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.03), this.ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseData.length; i++) {
          noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseData.length * 0.3));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(2000, t);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.018 * this.masterVolume * this.bgmVolume, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        this.connectDestination(noiseGain);
        noise.start(t);
        noise.stop(t + 0.04);
      }

      // Stem 4 (Combo >= 4): Counter-melody chords (sine +5th)
      if (this.currentComboLevel >= 4) {
        const osc4 = this.ctx.createOscillator();
        const gain4 = this.ctx.createGain();
        osc4.type = 'sine';
        osc4.frequency.setValueAtTime(freq * 1.5, t);
        const vol4 = 0.02 * this.masterVolume * this.bgmVolume;
        gain4.gain.setValueAtTime(vol4, t);
        gain4.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
        osc4.connect(gain4);
        this.connectDestination(gain4);
        osc4.start(t);
        osc4.stop(t + 0.16);
      }

      // Stem 5 (Combo >= 5 - MAX): Hyper-drive vibrato lead
      if (this.currentComboLevel >= 5) {
        const osc5 = this.ctx.createOscillator();
        const gain5 = this.ctx.createGain();
        osc5.type = 'sawtooth';
        osc5.frequency.setValueAtTime(freq * 2.5, t);
        osc5.frequency.linearRampToValueAtTime(freq * 2.5 + 20, t + 0.05);
        osc5.frequency.linearRampToValueAtTime(freq * 2.5 - 15, t + 0.1);
        const vol5 = 0.015 * this.masterVolume * this.bgmVolume;
        gain5.gain.setValueAtTime(vol5, t);
        gain5.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        osc5.connect(gain5);
        this.connectDestination(gain5);
        osc5.start(t);
        osc5.stop(t + 0.15);
      }
    } catch {}
  }

  public playHeartbeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = performance.now();
    if (now - this.lastHeartbeatTime < 550) return;
    this.lastHeartbeatTime = now;

    try {
      const t = this.ctx.currentTime;
      // Lub (First thump)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      const filter1 = this.ctx.createBiquadFilter();

      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(110, t);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(58, t);
      osc1.frequency.exponentialRampToValueAtTime(32, t + 0.08);

      const vol = 0.18 * this.masterVolume;
      gain1.gain.setValueAtTime(vol, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc1.connect(filter1);
      filter1.connect(gain1);
      this.connectDestination(gain1);

      osc1.start(t);
      osc1.stop(t + 0.09);

      // Dub (Second thump)
      const tDub = t + 0.11;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      const filter2 = this.ctx.createBiquadFilter();

      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(120, tDub);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(68, tDub);
      osc2.frequency.exponentialRampToValueAtTime(36, tDub + 0.07);

      gain2.gain.setValueAtTime(vol * 0.75, tDub);
      gain2.gain.exponentialRampToValueAtTime(0.001, tDub + 0.07);

      osc2.connect(filter2);
      filter2.connect(gain2);
      this.connectDestination(gain2);

      osc2.start(tDub);
      osc2.stop(tDub + 0.08);
    } catch {}
  }

  public playCrunchSound(pan: number = 0) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.035);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.frequency.exponentialRampToValueAtTime(350, t + 0.035);

      const gain = this.ctx.createGain();
      const vol = 0.14 * this.masterVolume;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      this.connectDestination(gain, pan);

      noise.start(t);
      noise.stop(t + 0.04);
    } catch {}
  }

  public playPowerUpSound(type: 'TRIM_TAIL' | 'SPEED_BURST' | 'DOUBLE_POINTS') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    this.connectDestination(gain);

    const baseVol = 0.28 * this.masterVolume;
    gain.gain.setValueAtTime(baseVol, t);

    if (type === 'TRIM_TAIL') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.09);
      osc.frequency.exponentialRampToValueAtTime(520, t + 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (type === 'SPEED_BURST') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(1320, t + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.21);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, t);
      osc.frequency.setValueAtTime(1174.66, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.start(t);
      osc.stop(t + 0.23);
    }
  }

  public playEatSound(category: FileCategory, comboLevel: number = 1, pan: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Layer crunchy bite sound with spatial panning
    this.playCrunchSound(pan);

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    this.connectDestination(gain, pan);

    const baseVol = 0.25 * this.masterVolume;
    // Pitch shift higher on combo streaks
    const pitchMult = Math.pow(1.12, Math.min(5, Math.max(1, comboLevel) - 1));

    switch (category) {
      case 'code':
        // 8-bit retro dual jump arpeggio
        osc.type = 'square';
        osc.frequency.setValueAtTime(440 * pitchMult, t);
        osc.frequency.setValueAtTime(880 * pitchMult, t + 0.05);
        gain.gain.setValueAtTime(baseVol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.start(t);
        osc.stop(t + 0.15);
        break;

      case 'image':
        // Crisp bright bell tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25 * pitchMult, t); // E5
        osc.frequency.exponentialRampToValueAtTime(987.77 * pitchMult, t + 0.08); // B5
        gain.gain.setValueAtTime(baseVol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.start(t);
        osc.stop(t + 0.17);
        break;

      case 'audio':
        // Melodic triple chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25 * pitchMult, t); // C5
        osc.frequency.setValueAtTime(659.25 * pitchMult, t + 0.04); // E5
        osc.frequency.setValueAtTime(783.99 * pitchMult, t + 0.08); // G5
        gain.gain.setValueAtTime(baseVol * 1.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.21);
        break;

      case 'video':
        // Warm rich brassy swell
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(329.63 * pitchMult, t); // E4
        osc.frequency.exponentialRampToValueAtTime(440.0 * pitchMult, t + 0.1);
        gain.gain.setValueAtTime(baseVol * 0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.19);
        break;

      case 'archive':
        // Zippy frequency slide
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200 * pitchMult, t);
        osc.frequency.exponentialRampToValueAtTime(600 * pitchMult, t + 0.08);
        gain.gain.setValueAtTime(baseVol * 0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.16);
        break;

      case 'document':
      default:
        // Pleasant typewriter snap chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33 * pitchMult, t); // D5
        osc.frequency.setValueAtTime(880 * pitchMult, t + 0.06); // A5
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
