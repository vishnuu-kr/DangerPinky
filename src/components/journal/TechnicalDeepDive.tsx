import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export type ProofBadgeType =
  | 'FOUND THIS IN THE REPO'
  | 'THIS WAS THE FIRST VERSION'
  | 'I LEFT THIS BROKEN FOR WAY TOO LONG'
  | 'THIS IS THE FIX';

interface TechnicalDeepDiveProps {
  title: string;
  badge?: ProofBadgeType | string;
  formula?: string;
  codeSnippet?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const TechnicalDeepDive: React.FC<TechnicalDeepDiveProps> = ({
  title,
  badge,
  formula,
  codeSnippet,
  children,
  defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`technical-deep-dive-box rounded-xl border border-pink-500/25 bg-slate-950/90 overflow-hidden shadow-lg ${className}`}>
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50"
        aria-expanded={isOpen}
      >
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {badge && (
            <span className="shrink-0 font-mono text-[9px] font-bold tracking-[0.18em] uppercase px-2 py-0.5 border border-amber-500/50 rounded text-amber-400 bg-amber-500/[0.08]">
              ◆ {badge}
            </span>
          )}
          <span className="deep-dive-title font-mono text-xs font-bold text-pink-300 group-hover:text-pink-200 transition-colors truncate">
            {title}
          </span>
        </div>
        <div className="shrink-0 ml-2 p-1 rounded text-slate-500 group-hover:text-pink-400 transition-colors">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-pink-500/15">
          {/* Formula */}
          {formula && (
            <div>
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">FORMULA</div>
              <pre className="bg-slate-950 border border-pink-500/20 rounded-lg p-3 font-mono text-[11px] text-pink-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {formula}
              </pre>
            </div>
          )}

          {/* Prose explanation */}
          <div className="deep-dive-prose text-[11px] font-sans text-slate-300 leading-relaxed space-y-1.5">
            {children}
          </div>

          {/* Code Snippet */}
          {codeSnippet && (
            <div>
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">CODE</div>
              <pre className="terminal-block text-[10px] leading-tight whitespace-pre-wrap break-all max-h-36 overflow-y-auto custom-page-scrollbar">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
