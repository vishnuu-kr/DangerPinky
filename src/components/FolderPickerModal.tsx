import React, { useState, useRef } from 'react';
import { FolderOpen, Upload, Sparkles, Check, X, ShieldCheck, FileCheck } from 'lucide-react';
import { GameFile, DirectoryScanResult } from '../types/file';
import {
  pickAndScanDirectory,
  scanFromFileInput,
  scanFromDropEvent,
  isFileSystemAccessSupported
} from '../filesystem/scanner';
import { getDemoFiles } from '../filesystem/demoFiles';
import { CATEGORY_THEMES } from '../game/constants';
import { formatFileSize } from '../utils/formatters';

interface FolderPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesSelected: (files: GameFile[], folderName: string) => void;
  currentFiles: GameFile[];
  currentFolderName: string;
}

export const FolderPickerModal: React.FC<FolderPickerModalProps> = ({
  isOpen,
  onClose,
  onFilesSelected,
  currentFiles,
  currentFolderName
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<DirectoryScanResult | null>(() => {
    if (currentFiles.length > 0) {
      return {
        folderName: currentFolderName || 'Current Folder',
        files: currentFiles,
        totalFiles: currentFiles.length,
        categoryCounts: {
          image: currentFiles.filter((f) => f.category === 'image').length,
          video: currentFiles.filter((f) => f.category === 'video').length,
          audio: currentFiles.filter((f) => f.category === 'audio').length,
          document: currentFiles.filter((f) => f.category === 'document').length,
          code: currentFiles.filter((f) => f.category === 'code').length,
          archive: currentFiles.filter((f) => f.category === 'archive').length,
          other: currentFiles.filter((f) => f.category === 'other').length
        },
        totalSizeBytes: currentFiles.reduce((acc, f) => acc + f.size, 0)
      };
    }
    return null;
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePickDirectory = async () => {
    try {
      setIsScanning(true);
      setErrorMsg(null);
      const result = await pickAndScanDirectory();
      if (result.files.length === 0) {
        setErrorMsg('No playable files found. Choose another folder or use demo mode.');
        setScanResult(null);
      } else {
        setScanResult(result);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Folder selection was cancelled or failed';
      if (!msg.includes('abort') && !msg.includes('cancelled')) {
        setErrorMsg(msg);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleUseDemo = () => {
    const demoFiles = getDemoFiles();
    const result: DirectoryScanResult = {
      folderName: 'Demo Showcase Folder',
      files: demoFiles,
      totalFiles: demoFiles.length,
      categoryCounts: {
        image: demoFiles.filter((f) => f.category === 'image').length,
        video: demoFiles.filter((f) => f.category === 'video').length,
        audio: demoFiles.filter((f) => f.category === 'audio').length,
        document: demoFiles.filter((f) => f.category === 'document').length,
        code: demoFiles.filter((f) => f.category === 'code').length,
        archive: demoFiles.filter((f) => f.category === 'archive').length,
        other: demoFiles.filter((f) => f.category === 'other').length
      },
      totalSizeBytes: demoFiles.reduce((acc, f) => acc + f.size, 0)
    };
    setScanResult(result);
    setErrorMsg(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg(null);

    try {
      setIsScanning(true);
      const result = await scanFromDropEvent(e.dataTransfer);
      if (result.files.length === 0) {
        setErrorMsg('No playable files found. Choose another folder or use demo mode.');
        setScanResult(null);
      } else {
        setScanResult(result);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to read dropped files');
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirm = () => {
    if (scanResult && scanResult.files.length > 0) {
      onFilesSelected(scanResult.files, scanResult.folderName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl card-candy-pink p-5 sm:p-7 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-pink-500/30">
          <div className="flex items-center gap-3">
            <div className="btn-candy-pink w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center p-0 shrink-0 shadow-md">
              <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
                <h2 className="text-lg sm:text-xl font-black font-game text-white tracking-wide uppercase drop-shadow flex items-center gap-2">
                  <span>Choose Snake Food</span>
                  <span className="btn-candy-green px-2.5 py-0.5 rounded-full text-[10px] font-game font-black">
                    Read Only
                  </span>
                </h2>
              </div>
              <p className="text-xs text-pink-200/90 font-medium font-game">
                Select a folder with pictures, code, docs or music
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-candy-pill p-2 rounded-xl text-slate-200 hover:text-white cursor-pointer"
            aria-label="Close folder picker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`p-6 sm:p-7 rounded-2xl border-3 border-dashed transition-all flex flex-col items-center justify-center text-center ${
            isDragging
              ? 'border-pink-300 bg-pink-500/20 shadow-lg scale-[1.01]'
              : 'border-pink-500/40 bg-slate-950/80 hover:border-pink-400/70 shadow-inner'
          }`}
        >
          <Upload className={`w-9 h-9 mb-2 ${isDragging ? 'text-white animate-bounce' : 'text-pink-400'}`} />
          <p className="text-sm font-black font-game text-white mb-0.5">
            Drag & Drop Any Folder Here
          </p>
          <p className="text-xs text-pink-200/80 font-game mb-4">
            Subfolders will be recursively scanned for files
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {isFileSystemAccessSupported() && (
              <button
                onClick={handlePickDirectory}
                disabled={isScanning}
                className="btn-candy-pink px-5 py-2.5 rounded-full font-game font-black text-xs cursor-pointer shadow-md flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                <span>{isScanning ? 'Scanning...' : 'Browse Directory'}</span>
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-candy-pill px-4 py-2.5 rounded-full font-game font-bold text-xs text-slate-200 hover:text-white cursor-pointer"
            >
              Select Folder Files
            </button>

            <button
              onClick={handleUseDemo}
              className="btn-candy-gold px-4 py-2.5 rounded-full font-game font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-950" />
              <span>Use Demo Files</span>
            </button>
          </div>

          {/* Hidden input for webkitdirectory */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            // @ts-expect-error - webkitdirectory
            webkitdirectory=""
            directory=""
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const res = scanFromFileInput(e.target.files);
                if (res.files.length === 0) {
                  setErrorMsg('No playable files found. Choose another folder or use demo mode.');
                  setScanResult(null);
                } else {
                  setErrorMsg(null);
                  setScanResult(res);
                }
              }
            }}
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 text-rose-200 text-xs text-center font-game font-bold">
            {errorMsg}
          </div>
        )}

        {/* Scanned Files Summary Card */}
        {scanResult && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-pink-500/30 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-black font-game text-white truncate max-w-[240px]">
                  {scanResult.folderName}
                </span>
              </div>
              <span className="text-xs text-pink-300 font-mono font-bold">
                {scanResult.totalFiles} files ({formatFileSize(scanResult.totalSizeBytes)})
              </span>
            </div>

            {/* Category distribution badges */}
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(scanResult.categoryCounts) as import('../types/file').FileCategory[]).map((cat) => {
                const count = scanResult.categoryCounts[cat];
                if (count === 0) return null;
                const theme = CATEGORY_THEMES[cat];
                return (
                  <span
                    key={cat}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-black font-game border ${theme.badgeClass} flex items-center gap-1.5`}
                  >
                    <span>{theme.label}:</span>
                    <span className="font-mono font-bold">{count}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-pink-500/20 text-[11px] text-pink-200/80 font-game">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Files are never uploaded or altered in Demo Mode. Only lightweight metadata (name, type, size) is loaded.</span>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-pink-500/30">
          <button
            onClick={onClose}
            className="btn-candy-pill px-5 py-2.5 rounded-full font-game font-bold text-xs sm:text-sm text-slate-200 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!scanResult || scanResult.files.length === 0}
            className="btn-candy-green px-7 py-2.5 rounded-full font-game font-black text-xs sm:text-sm text-white shadow-lg cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none group"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Apply & Ready</span>
          </button>
        </div>
      </div>
    </div>
  );
};
