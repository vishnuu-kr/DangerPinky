import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Activity } from 'lucide-react';
import { sound } from '../../game/audio';
import { SOUNDBOARD_DATA, SoundboardItem } from '../../data/journalChapters';

interface AudioSoundboardProps {
  compact?: boolean;
}

export const AudioSoundboard: React.FC<AudioSoundboardProps> = ({ compact = false }) => {
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(sound.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  const handleTrigger = (item: SoundboardItem) => {
    setActiveSoundId(item.id);

    // Trigger corresponding method on sound synthesizer
    switch (item.id) {
      case 'image':
        sound.playEatSound('image');
        break;
      case 'code':
        sound.playEatSound('code');
        break;
      case 'archive':
        sound.playEatSound('archive');
        break;
      case 'highscore':
        sound.playHighScore();
        break;
      case 'gameover':
        sound.playGameOver();
        break;
      default:
        sound.playEatSound('document');
        break;
    }

    setTimeout(() => {
      setActiveSoundId((current) => (current === item.id ? null : current));
    }, 600);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    sound.setMuted(nextMute);
    setIsMuted(nextMute);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVol = parseFloat(e.target.value);
    sound.setVolume(nextVol);
    setVolume(nextVol);
    if (isMuted && nextVol > 0) {
      sound.setMuted(false);
      setIsMuted(false);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const index = parseInt(e.key, 10) - 1;
      if (index >= 0 && index < SOUNDBOARD_DATA.length) {
        handleTrigger(SOUNDBOARD_DATA[index]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const waveformColors: Record<string, { badge: string; ring: string; text: string }> = {
    sine: {
      badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      ring: 'ring-pink-500/50',
      text: 'text-pink-400'
    },
    square: {
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      ring: 'ring-cyan-500/50',
      text: 'text-cyan-400'
    },
    sawtooth: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      ring: 'ring-amber-500/50',
      text: 'text-amber-400'
    },
    triangle: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      ring: 'ring-emerald-500/50',
      text: 'text-emerald-400'
    }
  };

  if (compact) {
    return (
      <div className="bg-slate-950/90 border border-pink-500/30 rounded-xl p-2.5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-[10px] font-mono font-bold text-pink-300 uppercase tracking-wider">
              Procedural Audio Oscillators
            </span>
            <span className="text-[9px] font-mono text-slate-500 hidden sm:inline">· 0 MP3 files · Real math</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleMute}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer transition-colors"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-14 accent-pink-500 cursor-pointer h-1 bg-slate-800 rounded"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {SOUNDBOARD_DATA.map((item) => {
            const isPlaying = activeSoundId === item.id;
            const styling = waveformColors[item.waveform] || waveformColors.sine;
            return (
              <button
                key={item.id}
                onClick={() => handleTrigger(item)}
                className={`p-1.5 rounded-lg border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between group relative ${
                  isPlaying
                    ? 'bg-pink-600/30 border-pink-400 shadow-[0_0_12px_rgba(255,59,148,0.5)] -translate-y-0.5'
                    : 'bg-slate-900/70 border-slate-800 hover:border-pink-500/40 hover:bg-slate-850'
                }`}
              >
                {item.keyboardLabel && (
                  <span className="absolute top-1 right-1 text-[7.5px] font-mono text-slate-500 bg-slate-950/80 border border-slate-800 px-0.5 rounded leading-none">
                    {item.keyboardLabel}
                  </span>
                )}
                <span className="text-base select-none group-hover:scale-110 transition-transform">{item.emoji}</span>
                <span className="text-[9.5px] font-mono font-bold text-white truncate max-w-full mt-0.5">{item.name}</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-[7.5px] font-mono uppercase px-1 py-0.2 rounded border font-semibold ${styling.badge}`}>
                    {item.waveform}
                  </span>
                  {isPlaying && (
                    <span className="flex items-end gap-0.5 h-2">
                      <span className="w-0.5 bg-pink-400 animate-pulse h-1.5" />
                      <span className="w-0.5 bg-amber-400 animate-bounce h-2" />
                      <span className="w-0.5 bg-emerald-400 animate-pulse h-1" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border-2 border-pink-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background audio wave ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Volume / Mute Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-mono font-bold text-pink-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>PROCEDURAL SOUNDBOARD</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-game font-bold text-white flex items-center gap-2">
            <span>Web Audio Oscillator Synthesis</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Zero external MP3 / WAV files. Pure math synthesized live via browser AudioContext.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800">
          <button
            onClick={handleToggleMute}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isMuted ? 'text-rose-400 bg-rose-500/20' : 'text-slate-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 sm:w-28 accent-pink-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
            <span className="text-[11px] font-mono text-slate-400 w-7">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Trigger Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-6 mb-6">
        {SOUNDBOARD_DATA.map((item) => {
          const isPlaying = activeSoundId === item.id;
          const styling = waveformColors[item.waveform] || waveformColors.sine;

          return (
            <button
              key={item.id}
              onClick={() => handleTrigger(item)}
              className={`relative text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group overflow-hidden ${
                isPlaying
                  ? `bg-slate-850 border-pink-400 shadow-[0_0_24px_rgba(255,59,148,0.4)] -translate-y-1 ${styling.ring}`
                  : 'bg-slate-950/70 border-slate-800 hover:border-pink-500/40 hover:bg-slate-900/80 hover:-translate-y-0.5'
              }`}
            >
              {/* Top Row: Emoji, Name, Waveform Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl select-none group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                    {item.keyboardLabel && (
                      <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-900 border border-slate-800 px-1 py-0.5 rounded">
                        {item.keyboardLabel}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isPlaying && (
                      <span className="flex items-end gap-0.5 h-3">
                        <span className="w-1 bg-pink-400 animate-bounce h-2" />
                        <span className="w-1 bg-amber-400 animate-pulse h-3" />
                        <span className="w-1 bg-emerald-400 animate-bounce h-2.5" />
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${styling.badge}`}
                    >
                      {item.waveform}
                    </span>
                  </div>
                </div>

                <div className="font-game font-bold text-sm text-white group-hover:text-pink-300 transition-colors">
                  {item.name}
                </div>

                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {item.fileCategory}
                </div>
              </div>

              {/* Technical Acoustic Specs */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-[10px] font-mono text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">PITCH:</span>
                  <span className={styling.text}>{item.frequencyRamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">LENGTH:</span>
                  <span className="text-slate-300">{item.duration}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans line-clamp-2 mt-1.5 leading-tight">
                  {item.description}
                </div>
              </div>

              {/* Active Sound Indicator Overlay */}
              {isPlaying && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Synthesis Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Real-time Web Audio API Oscillators: Sine • Square • Sawtooth • Triangle</span>
        </div>
        <div className="text-slate-500">
          Source code: <code className="text-pink-300">src/game/audio.ts</code>
        </div>
      </div>
    </div>
  );
};
