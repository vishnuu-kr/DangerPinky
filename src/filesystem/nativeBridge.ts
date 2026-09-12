import { DirectoryScanResult, FileOperationResult, GameFile } from '../types/file';

// Declaration for window.fileSnakeNative exposed via preload script
declare global {
  interface Window {
    fileSnakeNative?: {
      isDesktop: boolean;
      getPlatform: () => Promise<{ os: string; isDesktop: boolean; realTrashSupported: boolean }>;
      selectFolder: () => Promise<{
        sessionToken: string;
        folderName: string;
        files: GameFile[];
        totalFiles: number;
        totalSizeBytes: number;
      } | null>;
      consumeFile: (sessionToken: string, fileId: string) => Promise<FileOperationResult>;
      disableRealMode: () => Promise<{ success: boolean }>;
      openRecycleBin: () => Promise<{ success: boolean; reason?: string }>;
    };
  }
}

/**
 * Checks if the application is running inside the native desktop application (Electron).
 */
export function isDesktopApp(): boolean {
  return typeof window !== 'undefined' && Boolean(window.fileSnakeNative?.isDesktop);
}

/**
 * Returns native platform information.
 */
export async function getNativePlatform(): Promise<{
  os: string;
  isDesktop: boolean;
  realTrashSupported: boolean;
}> {
  if (isDesktopApp() && window.fileSnakeNative) {
    return window.fileSnakeNative.getPlatform();
  }
  return {
    os: 'browser',
    isDesktop: false,
    realTrashSupported: false
  };
}

/**
 * Triggers the native folder picker dialog and returns the scanned directory result.
 */
export async function pickNativeDirectory(): Promise<DirectoryScanResult | null> {
  if (!isDesktopApp() || !window.fileSnakeNative) {
    throw new Error('Native filesystem operations are only available in the FileSnake desktop app.');
  }

  const result = await window.fileSnakeNative.selectFolder();
  if (!result) return null;

  const categoryCounts: Record<import('../types/file').FileCategory, number> = {
    image: 0,
    video: 0,
    audio: 0,
    document: 0,
    code: 0,
    archive: 0,
    other: 0
  };

  const markedFiles = result.files.map((f) => {
    categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
    return {
      ...f,
      isRealFile: true
    };
  });

  return {
    folderName: result.folderName,
    files: markedFiles,
    totalFiles: result.totalFiles,
    categoryCounts,
    totalSizeBytes: result.totalSizeBytes,
    sessionToken: result.sessionToken,
    isRealFolder: true
  };
}

/**
 * Requests the native bridge to move a file from the active session to the OS Recycle Bin / Trash.
 */
export async function consumeNativeFile(
  sessionToken: string,
  fileId: string
): Promise<FileOperationResult> {
  if (!isDesktopApp() || !window.fileSnakeNative) {
    return {
      success: false,
      fileId,
      fileName: '',
      reason: 'Native desktop bridge is not available in browser mode'
    };
  }

  try {
    return await window.fileSnakeNative.consumeFile(sessionToken, fileId);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      fileId,
      fileName: '',
      reason: `Bridge execution error: ${msg}`
    };
  }
}

/**
 * Disables Real File Mode and resets native session state.
 */
export async function disableNativeRealMode(): Promise<void> {
  if (isDesktopApp() && window.fileSnakeNative) {
    try {
      await window.fileSnakeNative.disableRealMode();
    } catch (err) {
      console.warn('Error disabling real mode in native bridge:', err);
    }
  }
}

/**
 * Opens the OS Recycle Bin / Trash for easy recovery verification.
 */
export async function openOSRecycleBin(): Promise<boolean> {
  if (isDesktopApp() && window.fileSnakeNative) {
    const res = await window.fileSnakeNative.openRecycleBin();
    return res.success;
  }
  return false;
}
