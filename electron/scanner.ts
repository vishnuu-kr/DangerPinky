import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { isSafeUserFile, FORBIDDEN_DIRECTORY_NAMES } from './securityValidator';
import { OpaqueNativeGameFile, StoredSessionFile } from './types';

const EXTENSION_MAP: Record<string, OpaqueNativeGameFile['category']> = {
  // Images
  jpg: 'image', jpeg: 'image', png: 'image', webp: 'image', gif: 'image',
  svg: 'image', bmp: 'image', ico: 'image', tiff: 'image', heic: 'image', avif: 'image',
  // Videos
  mp4: 'video', mov: 'video', mkv: 'video', webm: 'video', avi: 'video',
  wmv: 'video', flv: 'video', m4v: 'video',
  // Audio
  mp3: 'audio', wav: 'audio', flac: 'audio', m4a: 'audio', ogg: 'audio',
  aac: 'audio', wma: 'audio', opus: 'audio', mid: 'audio',
  // Documents
  pdf: 'document', doc: 'document', docx: 'document', txt: 'document',
  rtf: 'document', md: 'document', markdown: 'document', csv: 'document',
  tsv: 'document', xls: 'document', xlsx: 'document', ppt: 'document',
  pptx: 'document', epub: 'document', odt: 'document',
  // Code
  js: 'code', jsx: 'code', ts: 'code', tsx: 'code', py: 'code', java: 'code',
  c: 'code', cpp: 'code', h: 'code', hpp: 'code', cs: 'code', go: 'code',
  rs: 'code', html: 'code', css: 'code', scss: 'code', sass: 'code',
  json: 'code', yaml: 'code', yml: 'code', xml: 'code', sh: 'code',
  bash: 'code', ps1: 'code', sql: 'code', php: 'code', rb: 'code',
  swift: 'code', kt: 'code', vue: 'code', svelte: 'code', lua: 'code', r: 'code',
  // Archives
  zip: 'archive', tar: 'archive', gz: 'archive', tgz: 'archive', bz2: 'archive',
  '7z': 'archive', rar: 'archive', xz: 'archive', iso: 'archive', dmg: 'archive'
};

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase() || '';
}

export function classifyFile(filename: string): OpaqueNativeGameFile['category'] {
  const ext = getFileExtension(filename);
  if (ext && EXTENSION_MAP[ext]) {
    return EXTENSION_MAP[ext];
  }
  return 'other';
}

/**
 * Scans a folder recursively up to maxFiles, enforcing path boundaries and excluding system files.
 */
export function scanNativeDirectory(
  rootDirectory: string,
  maxFiles: number = 500
): {
  storedFiles: StoredSessionFile[];
  opaqueFiles: OpaqueNativeGameFile[];
} {
  const canonicalRoot = path.normalize(fs.realpathSync(rootDirectory));
  const storedFiles: StoredSessionFile[] = [];
  const opaqueFiles: OpaqueNativeGameFile[] = [];

  function walk(currentDir: string, relativeDir: string) {
    if (storedFiles.length >= maxFiles) return;

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (storedFiles.length >= maxFiles) break;

      const entryName = entry.name;
      const fullPath = path.join(currentDir, entryName);
      const relativePath = relativeDir ? path.join(relativeDir, entryName) : entryName;

      if (entry.isDirectory()) {
        const lowerDir = entryName.toLowerCase();
        if (lowerDir.startsWith('.') || FORBIDDEN_DIRECTORY_NAMES.has(lowerDir)) {
          continue;
        }

        try {
          // Verify directory canonical realpath is inside canonical root (no symlink escape)
          const canonicalDir = path.normalize(fs.realpathSync(fullPath));
          const rel = path.relative(canonicalRoot, canonicalDir);
          if (rel.startsWith('..') || path.isAbsolute(rel)) {
            continue; // Skip symlinked directory outside root
          }
          walk(fullPath, relativePath);
        } catch {
          continue;
        }
      } else if (entry.isFile()) {
        if (!isSafeUserFile(entryName)) {
          continue;
        }

        try {
          // Verify file canonical realpath is inside canonical root
          const canonicalFile = path.normalize(fs.realpathSync(fullPath));
          const rel = path.relative(canonicalRoot, canonicalFile);
          if (rel.startsWith('..') || path.isAbsolute(rel)) {
            continue; // Skip symlinked file pointing outside root
          }

          const stat = fs.statSync(canonicalFile);
          if (!stat.isFile()) continue;

          // Generate opaque ID
          const id = `f-${crypto.randomBytes(8).toString('hex')}`;
          const ext = getFileExtension(entryName);
          const category = classifyFile(entryName);

          const stored: StoredSessionFile = {
            id,
            name: entryName,
            absolutePath: canonicalFile,
            extension: ext,
            category,
            size: stat.size,
            relativePath: relativePath.replace(/\\/g, '/')
          };

          const opaque: OpaqueNativeGameFile = {
            id,
            name: entryName,
            extension: ext,
            category,
            size: stat.size,
            relativePath: relativePath.replace(/\\/g, '/')
          };

          storedFiles.push(stored);
          opaqueFiles.push(opaque);
        } catch {
          continue;
        }
      }
    }
  }

  walk(canonicalRoot, '');

  return { storedFiles, opaqueFiles };
}
