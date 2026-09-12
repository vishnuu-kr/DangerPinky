import path from 'path';
import fs from 'fs';

// System and metadata files that should never be touched or consumed
export const FORBIDDEN_FILE_NAMES = new Set([
  'desktop.ini',
  'thumbs.db',
  '.ds_store',
  'ntuser.dat',
  'ntuser.ini',
  'bootmgr',
  'bootsect.bak',
  'pagefile.sys',
  'swapfile.sys',
  'hiberfil.sys'
]);

// Directories to skip during directory scanning
export const FORBIDDEN_DIRECTORY_NAMES = new Set([
  'node_modules',
  '.git',
  '.vscode',
  '.idea',
  'dist',
  'build',
  '$recycle.bin',
  'system volume information',
  'windows',
  'program files',
  'program files (x86)',
  'appdata'
]);

/**
 * Checks if a filename is a system or hidden file that should be excluded.
 */
export function isSafeUserFile(fileName: string): boolean {
  const lower = fileName.toLowerCase().trim();
  if (lower.startsWith('.')) {
    return false;
  }
  if (FORBIDDEN_FILE_NAMES.has(lower)) {
    return false;
  }
  return true;
}

/**
 * Validates that a target path is strictly contained within an authorized root directory.
 * Resolves symlinks and junctions on both root and target to prevent escaping the sandbox.
 */
export function validatePathContainment(rootDirectory: string, targetPath: string): {
  allowed: boolean;
  canonicalTarget?: string;
  canonicalRoot?: string;
  reason?: string;
} {
  try {
    if (!rootDirectory || !targetPath) {
      return { allowed: false, reason: 'Empty path parameter provided' };
    }

    // Check if root exists
    if (!fs.existsSync(rootDirectory)) {
      return { allowed: false, reason: 'Selected root directory does not exist' };
    }

    // Resolve canonical real path for root
    const canonicalRoot = path.normalize(fs.realpathSync(rootDirectory));

    // Check if target file exists
    if (!fs.existsSync(targetPath)) {
      return { allowed: false, reason: 'Target file does not exist' };
    }

    // Resolve canonical real path for target (follows symlinks/junctions)
    const canonicalTarget = path.normalize(fs.realpathSync(targetPath));

    // Ensure canonicalTarget is a file, not a directory
    const stat = fs.statSync(canonicalTarget);
    if (!stat.isFile()) {
      return { allowed: false, reason: 'Target is not a regular file' };
    }

    // Check filename safety
    const fileName = path.basename(canonicalTarget);
    if (!isSafeUserFile(fileName)) {
      return { allowed: false, reason: 'Target file is a system or hidden file' };
    }

    // Calculate relative path from canonical root to canonical target
    const relative = path.relative(canonicalRoot, canonicalTarget);

    // If relative starts with '..' or is an absolute path (different drive on Windows), it's outside
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      return {
        allowed: false,
        canonicalRoot,
        canonicalTarget,
        reason: 'Path traversal or symlink escape detected: file is outside selected folder'
      };
    }

    // Ensure target is not identical to the root
    if (relative === '' || relative === '.') {
      return { allowed: false, reason: 'Target cannot be the root folder itself' };
    }

    return {
      allowed: true,
      canonicalRoot,
      canonicalTarget
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      allowed: false,
      reason: `Path containment validation error: ${msg}`
    };
  }
}
