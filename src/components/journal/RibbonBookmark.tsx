import React, { useState } from 'react';
import { Bookmark, X } from 'lucide-react';
import { CHAPTERS, PROLOGUE_DATA, FINAL_REFLECTION } from '../../data/journalChapters';

interface RibbonBookmarkProps {
  currentSectionId: string;
  onSelectSection: (id: string) => void;
}

export const RibbonBookmark: React.FC<RibbonBookmarkProps> = ({
  currentSectionId,
  onSelectSection
}) => {
  const [open, setOpen] = useState(false);

  const entries = [
    { id: 'hero', number: 'COVER', title: 'Hardcover Front', tag: 'START' },
    { id: PROLOGUE_DATA.id, number: '00', title: PROLOGUE_DATA.title, tag: PROLOGUE_DATA.tag },
    ...CHAPTERS.map((ch) => ({
      id: ch.id,
      number: ch.number,
      title: ch.title,
      tag: ch.tag
    })),
    { id: FINAL_REFLECTION.id, number: 'END', title: FINAL_REFLECTION.title, tag: FINAL_REFLECTION.tag }
  ];

  return (
    <>
      {/* Visual hanging satin ribbon physically anchored to top edge of book */}
      <div
        onClick={() => setOpen(!open)}
        className="absolute -top-3 right-8 sm:right-14 z-30 book-ribbon group cursor-pointer"
        title="Silk Bookmark Ribbon — Click for Table of Contents"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white/80 group-hover:text-white transition-colors">
          <Bookmark className="w-3.5 h-3.5 fill-white/60" />
        </div>
      </div>

      {/* Slide-out bookmark Table of Contents Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-[#0a0f1d] border-l border-slate-800 h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-pink-400 fill-pink-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Logbook Table of Contents
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {entries.map((item, idx) => {
                  const isActive = currentSectionId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectSection(item.id);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-pink-600/20 text-pink-200 border border-pink-500/40 font-bold'
                          : 'text-slate-300 hover:bg-slate-900/80 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <span className="text-[10px] text-slate-500 w-8 shrink-0">
                          {item.number}
                        </span>
                        <span className="truncate">{item.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        p. {idx * 2 + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 text-center">
              18 Hours at Useless Projects 3.0 • Vishnu K R
            </div>
          </div>
        </div>
      )}
    </>
  );
};
