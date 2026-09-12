import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction } from '../types/game';

interface TouchControlsProps {
  onDirection: (dir: Direction) => void;
  enabled: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onDirection, enabled }) => {
  if (!enabled) return null;

  return (
    <div className="flex flex-col items-center justify-center my-4 select-none touch-none">
      <div className="grid grid-cols-3 gap-2.5 w-48">
        <div />
        <button
          onClick={() => onDirection('UP')}
          onTouchStart={(e) => {
            e.preventDefault();
            onDirection('UP');
          }}
          className="btn-candy-pink h-14 rounded-2xl flex items-center justify-center text-white cursor-pointer shadow-lg active:scale-95"
          aria-label="Up"
        >
          <ArrowUp className="w-7 h-7 stroke-[2.5]" />
        </button>
        <div />

        <button
          onClick={() => onDirection('LEFT')}
          onTouchStart={(e) => {
            e.preventDefault();
            onDirection('LEFT');
          }}
          className="btn-candy-pink h-14 rounded-2xl flex items-center justify-center text-white cursor-pointer shadow-lg active:scale-95"
          aria-label="Left"
        >
          <ArrowLeft className="w-7 h-7 stroke-[2.5]" />
        </button>

        <button
          onClick={() => onDirection('DOWN')}
          onTouchStart={(e) => {
            e.preventDefault();
            onDirection('DOWN');
          }}
          className="btn-candy-pink h-14 rounded-2xl flex items-center justify-center text-white cursor-pointer shadow-lg active:scale-95"
          aria-label="Down"
        >
          <ArrowDown className="w-7 h-7 stroke-[2.5]" />
        </button>

        <button
          onClick={() => onDirection('RIGHT')}
          onTouchStart={(e) => {
            e.preventDefault();
            onDirection('RIGHT');
          }}
          className="btn-candy-pink h-14 rounded-2xl flex items-center justify-center text-white cursor-pointer shadow-lg active:scale-95"
          aria-label="Right"
        >
          <ArrowRight className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
