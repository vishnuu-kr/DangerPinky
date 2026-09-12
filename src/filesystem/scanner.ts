import { GameFile, DirectoryScanResult, FileCategory } from '../types/file';
import { classifyFile, getFileExtension } from './categories';

// Check if File System Access API is supported
export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

// Recursively traverse a FileSystemDirectoryHandle
async function scanDirectoryHandle(
  dirHandle: FileSystemDirectoryHandle,
  currentPath: string = '',
  maxFiles: number = 500
): Promise<GameFile[]> {
  const files: GameFile[] = [];

  // Async iterator over entries
  // @ts-expect-error - FileSystemDirectoryHandle async iterator
  for await (const entry of dirHandle.values()) {
    if (files.length >= maxFiles) break;

    if (entry.kind === 'file') {
      const fileHandle = entry as FileSystemFileHandle;
      try {
        const file = await fileHandle.getFile();
        const ext = getFileExtension(file.name);
        files.push({
          id: `fs-${file.name}-${file.lastModified}-${files.length}`,
          name: file.name,
          extension: ext,
          category: classifyFile(file.name, file.type),
          size: file.size,
          relativePath: currentPath ? `${currentPath}/${file.name}` : file.name,
          lastModified: file.lastModified
        });
      } catch (err) {
        console.warn(`Could not read metadata for file ${entry.name}`, err);
      }
    } else if (entry.kind === 'directory') {
      // Don't recurse into giant hidden/build dirs
      const skipDirs = ['node_modules', '.git', '.vscode', 'dist', 'build', '.next'];
      if (!skipDirs.includes(entry.name)) {
        try {
          const subFiles = await scanDirectoryHandle(
            entry as FileSystemDirectoryHandle,
            currentPath ? `${currentPath}/${entry.name}` : entry.name,
            maxFiles - files.length
          );
          files.push(...subFiles);
        } catch (err) {
          console.warn(`Could not enter subdirectory ${entry.name}`, err);
        }
      }
    }
  }

  return files;
}

// Pick directory using File System Access API
export async function pickAndScanDirectory(): Promise<DirectoryScanResult> {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser.');
  }

  // Request directory picker with read mode
  // @ts-expect-error - showDirectoryPicker
  const handle: FileSystemDirectoryHandle = await window.showDirectoryPicker({
    mode: 'read'
  });

  const files = await scanDirectoryHandle(handle, '', 500);

  return compileScanResult(handle.name, files);
}

// Scan files from standard input element (fallback)
export function scanFromFileInput(fileList: FileList): DirectoryScanResult {
  const files: GameFile[] = [];

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const path = file.webkitRelativePath || file.name;
    const ext = getFileExtension(file.name);

    files.push({
      id: `input-${file.name}-${file.lastModified}-${i}`,
      name: file.name,
      extension: ext,
      category: classifyFile(file.name, file.type),
      size: file.size,
      relativePath: path,
      lastModified: file.lastModified
    });
  }

  const rootName = fileList.length > 0 && fileList[0].webkitRelativePath
    ? fileList[0].webkitRelativePath.split('/')[0]
    : 'Selected Folder';

  return compileScanResult(rootName, files);
}

// Scan files from Drag and Drop DataTransfer (fallback)
export async function scanFromDropEvent(dataTransfer: DataTransfer): Promise<DirectoryScanResult> {
  const files: GameFile[] = [];
  const items = dataTransfer.items;
  let rootName = 'Dropped Folder';

  if (!items || items.length === 0) {
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      return scanFromFileInput(dataTransfer.files);
    }
    return compileScanResult(rootName, files);
  }

  // Scan entries recursively using webkitGetAsEntry
  async function traverseEntry(entry: FileSystemEntry, path: string = ''): Promise<void> {
    if (files.length >= 500) return;

    if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      await new Promise<void>((resolve) => {
        fileEntry.file(
          (file) => {
            const ext = getFileExtension(file.name);
            files.push({
              id: `drop-${file.name}-${file.lastModified}-${files.length}`,
              name: file.name,
              extension: ext,
              category: classifyFile(file.name, file.type),
              size: file.size,
              relativePath: path ? `${path}/${file.name}` : file.name,
              lastModified: file.lastModified
            });
            resolve();
          },
          () => resolve()
        );
      });
    } else if (entry.isDirectory) {
      const dirEntry = entry as FileSystemDirectoryEntry;
      const skipDirs = ['node_modules', '.git', '.vscode', 'dist', 'build'];
      if (skipDirs.includes(dirEntry.name)) return;

      const reader = dirEntry.createReader();
      const entries = await new Promise<FileSystemEntry[]>((resolve) => {
        reader.readEntries((results) => resolve(results), () => resolve([]));
      });

      for (const child of entries) {
        await traverseEntry(child, path ? `${path}/${dirEntry.name}` : dirEntry.name);
      }
    }
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
    if (entry) {
      if (i === 0 && entry.isDirectory) {
        rootName = entry.name;
      }
      await traverseEntry(entry);
    } else {
      const file = item.getAsFile();
      if (file) {
        const ext = getFileExtension(file.name);
        files.push({
          id: `drop-file-${file.name}-${file.lastModified}-${files.length}`,
          name: file.name,
          extension: ext,
          category: classifyFile(file.name, file.type),
          size: file.size,
          relativePath: file.name,
          lastModified: file.lastModified
        });
      }
    }
  }

  return compileScanResult(rootName, files);
}

function compileScanResult(folderName: string, files: GameFile[]): DirectoryScanResult {
  const categoryCounts: Record<FileCategory, number> = {
    image: 0,
    video: 0,
    audio: 0,
    document: 0,
    code: 0,
    archive: 0,
    other: 0
  };

  let totalSizeBytes = 0;

  for (const f of files) {
    categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
    totalSizeBytes += f.size;
  }

  return {
    folderName: folderName || 'Selected Folder',
    files,
    totalFiles: files.length,
    categoryCounts,
    totalSizeBytes
  };
}
