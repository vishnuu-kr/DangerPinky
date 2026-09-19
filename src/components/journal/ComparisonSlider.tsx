import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, Terminal, Check, X } from 'lucide-react';
import { BEFORE_AFTER_COMPARISON } from '../../data/journalChapters';

export const ComparisonSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    updatePosition(e.clientX);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updatePosition(e.touches[0].clientX);
    }
  };

  return (
    <div className="bg-slate-900/85 border border-pink-500/30 rounded-2xl p-3 sm:p-4 backdrop-blur-xl shadow-xl my-1">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] font-mono font-bold text-pink-300 mb-1">
            <span>INTERACTIVE VISUAL AUDIT</span>
          </div>
          <h3 className="text-sm sm:text-base font-game font-bold text-white leading-snug">
            Early Prototype (v0.1) vs Final Release (v1.0)
          </h3>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Drag the slider horizontally to compare visual fidelity.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-[10.5px] font-mono shrink-0">
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            09:30 PM (v0.1)
          </span>
          <span className="flex items-center gap-1 text-pink-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            10:45 AM (v1.0)
          </span>
        </div>
      </div>

      {/* Interactive Visual Comparison Box */}
      <div
        ref={containerRef}
        className="relative aspect-[16/10] max-h-[220px] w-full rounded-xl overflow-hidden border border-slate-800 select-none cursor-ew-resize bg-black"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onClick={(e) => updatePosition(e.clientX)}
      >
        {/* RIGHT LAYER: AFTER (Final Candy Game) - Full Width Background */}
        <div className="absolute inset-0 bg-[#09110b] flex flex-col items-center justify-center p-6 text-center">
          {/* Simulated Candy Game Board */}
          <div className="w-full max-w-md bg-[#3f7223] rounded-2xl border-4 border-[#335919] p-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-game font-bold text-white mb-2">
              <span className="text-pink-300">SCORE: 1,420 🎯</span>
              <span className="text-amber-300">HIGH: 2,850 👑</span>
            </div>

            <div className="relative aspect-[4/3] bg-[#294c16] rounded-xl flex items-center justify-center overflow-hidden border border-emerald-900/50">
              {/* Pink Glossy Snake */}
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-pink-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px]">
                  👀
                </div>
                <div className="w-5 h-5 rounded-full bg-pink-400 shadow-md" />
                <div className="w-4 h-4 rounded-full bg-pink-400/90 shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-full bg-pink-300/80" />
              </div>

              {/* 3D Radial Fruits */}
              <div className="absolute top-4 right-6 w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-300 shadow-[0_0_12px_rgba(255,59,148,0.6)] flex items-center justify-center text-xs">
                🍒
              </div>
              <div className="absolute bottom-5 left-8 w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-lime-400 shadow-md flex items-center justify-center text-xs">
                🍉
              </div>

              {/* Pinky Vision HUD in corner */}
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-950/85 border border-pink-500/40 text-[9px] font-mono text-pink-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Landmark 20 Locked</span>
              </div>
            </div>
          </div>

          {/* Right Tag */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-pink-500/90 text-white font-game font-bold text-xs shadow-lg backdrop-blur-md">
            FINAL POLISH (10:45 AM)
          </div>
        </div>

        {/* LEFT LAYER: BEFORE (Raw Prototype v0.1) - Clipped by Slider */}
        <div
          className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 text-center border-r-2 border-white"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          {/* Simulated Raw Terminal Canvas */}
          <div className="w-full max-w-md bg-black border-2 border-green-500/60 p-4 font-mono text-left shadow-2xl">
            <div className="text-green-500 text-xs mb-2 flex items-center justify-between">
              <span>CANVAS_TEST_0.1 [FPS: 28.4]</span>
              <span className="text-red-400">JITTER: ±14px</span>
            </div>

            <div className="relative aspect-[4/3] bg-black border border-green-800 flex flex-col justify-between p-3">
              {/* Raw green block snake */}
              <div className="flex items-center gap-0.5">
                <div className="w-4 h-4 bg-green-500 border border-green-300" />
                <div className="w-4 h-4 bg-green-600" />
                <div className="w-4 h-4 bg-green-700" />
              </div>

              {/* Raw text file items */}
              <div className="text-[11px] text-green-400">
                [FILE] resume_draft_2.docx (RAW TEXT STRING)
              </div>

              <div className="text-[10px] text-yellow-500">
                &gt; RAW CAM X: 341.22 | Y: 189.04 (UNSMOOTHED)
              </div>
            </div>
          </div>

          {/* Left Tag */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700 font-mono text-xs shadow-lg backdrop-blur-md">
            EARLY PROTOTYPE (09:30 PM)
          </div>
        </div>

        {/* Center Draggable Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Center Handle Knob */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-pink-500 border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-xs select-none">
            ↔
          </div>
        </div>
      </div>

      {/* Technical Spec Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2.5">
        {/* Before Specs */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 mb-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span>v0.1 RAW PROTOTYPE ({BEFORE_AFTER_COMPARISON.before.timestamp})</span>
          </div>
          <ul className="space-y-1 text-[11px] font-sans text-slate-400">
            {BEFORE_AFTER_COMPARISON.before.specs.map((spec, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <X className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* After Specs */}
        <div className="bg-slate-950/70 border border-pink-500/30 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-pink-300 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>v1.0 FINAL RELEASE ({BEFORE_AFTER_COMPARISON.after.timestamp})</span>
          </div>
          <ul className="space-y-1 text-[11px] font-sans text-slate-300">
            {BEFORE_AFTER_COMPARISON.after.specs.map((spec, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200 line-clamp-1">{spec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
