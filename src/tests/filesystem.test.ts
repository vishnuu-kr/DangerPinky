import { describe, it, expect } from 'vitest';
import { classifyFile, getFileExtension } from '../filesystem/categories';
import { getDemoFiles } from '../filesystem/demoFiles';
import { formatFileSize, formatDuration } from '../utils/formatters';

describe('Filesystem & Categorization', () => {
  it('correctly extracts file extensions', () => {
    expect(getFileExtension('photo.jpg')).toBe('jpg');
    expect(getFileExtension('ARCHIVE.ZIP')).toBe('zip');
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
    expect(getFileExtension('Dockerfile')).toBe('');
  });

  it('classifies filenames into correct categories', () => {
    expect(classifyFile('snapshot.png')).toBe('image');
    expect(classifyFile('movie.mp4')).toBe('video');
    expect(classifyFile('song.flac')).toBe('audio');
    expect(classifyFile('document.pdf')).toBe('document');
    expect(classifyFile('notes.docx')).toBe('document');
    expect(classifyFile('index.tsx')).toBe('code');
    expect(classifyFile('script.py')).toBe('code');
    expect(classifyFile('bundle.zip')).toBe('archive');
    expect(classifyFile('binary.dat')).toBe('other');
  });

  it('falls back to mimeType when extension is missing or unusual', () => {
    expect(classifyFile('unknown_blob', 'image/webp')).toBe('image');
    expect(classifyFile('audio_stream', 'audio/ogg')).toBe('audio');
    expect(classifyFile('video_stream', 'video/mp4')).toBe('video');
  });

  it('generates a rich library of demo files with all categories', () => {
    const demoFiles = getDemoFiles();
    expect(demoFiles.length).toBeGreaterThanOrEqual(20);

    const categories = new Set(demoFiles.map((f) => f.category));
    expect(categories.has('image')).toBe(true);
    expect(categories.has('video')).toBe(true);
    expect(categories.has('audio')).toBe(true);
    expect(categories.has('document')).toBe(true);
    expect(categories.has('code')).toBe(true);
    expect(categories.has('archive')).toBe(true);
  });

  it('formats byte sizes cleanly', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1024 * 1024 * 4.5)).toBe('4.5 MB');
    expect(formatFileSize(1024 * 1024 * 1024 * 2)).toBe('2.0 GB');
  });

  it('formats durations in mm:ss format', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(45)).toBe('00:45');
    expect(formatDuration(95)).toBe('01:35');
    expect(formatDuration(3600)).toBe('60:00');
  });
});
