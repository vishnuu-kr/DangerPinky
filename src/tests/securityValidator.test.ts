import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { validatePathContainment, isSafeUserFile } from '../../electron/securityValidator';

describe('Security Validator & Path Containment', () => {
  let tempSandboxDir: string;
  let insideFile: string;
  let outsideFile: string;
  let subDir: string;
  let nestedInsideFile: string;

  beforeAll(() => {
    // Create temporary test directories for sandbox testing
    tempSandboxDir = fs.mkdtempSync(path.join(os.tmpdir(), 'filesnake-security-test-'));
    insideFile = path.join(tempSandboxDir, 'safe_file.txt');
    fs.writeFileSync(insideFile, 'safe inside file content');

    subDir = path.join(tempSandboxDir, 'subfolder');
    fs.mkdirSync(subDir);
    nestedInsideFile = path.join(subDir, 'nested_safe.pdf');
    fs.writeFileSync(nestedInsideFile, 'nested safe content');

    // Create outside file in parent of tempSandboxDir
    outsideFile = path.join(os.tmpdir(), `filesnake-outside-${Date.now()}.txt`);
    fs.writeFileSync(outsideFile, 'dangerous outside content');
  });

  afterAll(() => {
    try {
      if (fs.existsSync(insideFile)) fs.unlinkSync(insideFile);
      if (fs.existsSync(nestedInsideFile)) fs.unlinkSync(nestedInsideFile);
      if (fs.existsSync(subDir)) fs.rmdirSync(subDir);
      if (fs.existsSync(tempSandboxDir)) fs.rmdirSync(tempSandboxDir);
      if (fs.existsSync(outsideFile)) fs.unlinkSync(outsideFile);
    } catch {
      // Ignore cleanup error
    }
  });

  it('allows files located directly inside the selected folder', () => {
    const result = validatePathContainment(tempSandboxDir, insideFile);
    expect(result.allowed).toBe(true);
    expect(result.canonicalTarget).toBeDefined();
  });

  it('allows files in subdirectories within the selected folder', () => {
    const result = validatePathContainment(tempSandboxDir, nestedInsideFile);
    expect(result.allowed).toBe(true);
    expect(result.canonicalTarget).toBeDefined();
  });

  it('strictly BLOCKS files located outside the selected folder', () => {
    const result = validatePathContainment(tempSandboxDir, outsideFile);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('outside selected folder');
  });

  it('strictly BLOCKS path traversal attempts using ../', () => {
    const traversalPath = path.join(tempSandboxDir, '..', path.basename(outsideFile));
    const result = validatePathContainment(tempSandboxDir, traversalPath);
    expect(result.allowed).toBe(false);
  });

  it('strictly BLOCKS system and hidden files', () => {
    expect(isSafeUserFile('.git')).toBe(false);
    expect(isSafeUserFile('.DS_Store')).toBe(false);
    expect(isSafeUserFile('desktop.ini')).toBe(false);
    expect(isSafeUserFile('Thumbs.db')).toBe(false);
    expect(isSafeUserFile('ntuser.dat')).toBe(false);

    expect(isSafeUserFile('photo.jpg')).toBe(true);
    expect(isSafeUserFile('report.pdf')).toBe(true);
    expect(isSafeUserFile('script.py')).toBe(true);
  });

  it('rejects targets that do not exist', () => {
    const nonExistent = path.join(tempSandboxDir, 'ghost_file.txt');
    const result = validatePathContainment(tempSandboxDir, nonExistent);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('does not exist');
  });

  it('rejects directories as target files', () => {
    const result = validatePathContainment(tempSandboxDir, subDir);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('not a regular file');
  });
});
