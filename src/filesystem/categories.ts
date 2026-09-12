import { FileCategory } from '../types/file';

const EXTENSION_MAP: Record<string, FileCategory> = {
  // Images
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  webp: 'image',
  gif: 'image',
  svg: 'image',
  bmp: 'image',
  ico: 'image',
  tiff: 'image',
  heic: 'image',
  avif: 'image',

  // Videos
  mp4: 'video',
  mov: 'video',
  mkv: 'video',
  webm: 'video',
  avi: 'video',
  wmv: 'video',
  flv: 'video',
  m4v: 'video',

  // Audio
  mp3: 'audio',
  wav: 'audio',
  flac: 'audio',
  m4a: 'audio',
  ogg: 'audio',
  aac: 'audio',
  wma: 'audio',
  opus: 'audio',
  mid: 'audio',

  // Documents
  pdf: 'document',
  doc: 'document',
  docx: 'document',
  txt: 'document',
  rtf: 'document',
  md: 'document',
  markdown: 'document',
  csv: 'document',
  tsv: 'document',
  xls: 'document',
  xlsx: 'document',
  ppt: 'document',
  pptx: 'document',
  epub: 'document',
  odt: 'document',

  // Code
  js: 'code',
  jsx: 'code',
  ts: 'code',
  tsx: 'code',
  py: 'code',
  java: 'code',
  c: 'code',
  cpp: 'code',
  h: 'code',
  hpp: 'code',
  cs: 'code',
  go: 'code',
  rs: 'code',
  html: 'code',
  css: 'code',
  scss: 'code',
  sass: 'code',
  json: 'code',
  yaml: 'code',
  yml: 'code',
  xml: 'code',
  sh: 'code',
  bash: 'code',
  ps1: 'code',
  sql: 'code',
  php: 'code',
  rb: 'code',
  swift: 'code',
  kt: 'code',
  vue: 'code',
  svelte: 'code',
  lua: 'code',
  r: 'code',

  // Archives
  zip: 'archive',
  tar: 'archive',
  gz: 'archive',
  tgz: 'archive',
  bz2: 'archive',
  '7z': 'archive',
  rar: 'archive',
  xz: 'archive',
  iso: 'archive',
  dmg: 'archive'
};

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase() || '';
}

export function classifyFile(filename: string, mimeType?: string): FileCategory {
  const ext = getFileExtension(filename);
  if (ext && EXTENSION_MAP[ext]) {
    return EXTENSION_MAP[ext];
  }

  // Fallback to mimeType if extension is unknown or missing
  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('text/') || mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('archive')) return 'archive';
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('xml')) return 'code';
  }

  return 'other';
}
