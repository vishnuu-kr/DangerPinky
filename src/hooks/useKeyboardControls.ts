import { useEffect, useRef } from 'react';
import { Direction } from '../types/game';

export function useKeyboardControls(
  onDirectionChange: (dir: Direction) => void,
  onTogglePause?: () => void,
  enabled: boolean = true
) {
  const onDirectionChangeRef = useRef(onDirectionChange);
  onDirectionChangeRef.current = onDirectionChange;

  const onTogglePauseRef = useRef(onTogglePause);
  onTogglePauseRef.current = onTogglePause;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting form input fields
      const target = e.target as HTMLElement;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();
      const code = e.code;

      // UP: ArrowUp, W, KeyW
      if (key === 'arrowup' || key === 'w' || code === 'ArrowUp' || code === 'KeyW') {
        e.preventDefault();
        onDirectionChangeRef.current('UP');
        return;
      }

      // DOWN: ArrowDown, S, KeyS
      if (key === 'arrowdown' || key === 's' || code === 'ArrowDown' || code === 'KeyS') {
        e.preventDefault();
        onDirectionChangeRef.current('DOWN');
        return;
      }

      // LEFT: ArrowLeft, A, KeyA
      if (key === 'arrowleft' || key === 'a' || code === 'ArrowLeft' || code === 'KeyA') {
        e.preventDefault();
        onDirectionChangeRef.current('LEFT');
        return;
      }

      // RIGHT: ArrowRight, D, KeyD
      if (key === 'arrowright' || key === 'd' || code === 'ArrowRight' || code === 'KeyD') {
        e.preventDefault();
        onDirectionChangeRef.current('RIGHT');
        return;
      }

      // PAUSE: Space, Escape
      if (key === ' ' || key === 'spacebar' || key === 'escape' || code === 'Space' || code === 'Escape') {
        e.preventDefault();
        if (onTogglePauseRef.current) {
          onTogglePauseRef.current();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
