export interface OpaqueNativeGameFile {
  id: string;
  name: string;
  extension: string;
  category: 'image' | 'video' | 'audio' | 'document' | 'code' | 'archive' | 'other';
  size: number;
  relativePath: string;
}

export interface FolderSelectionResult {
  sessionToken: string;
  folderName: string;
  files: OpaqueNativeGameFile[];
  totalFiles: number;
  totalSizeBytes: number;
}

export type NativeFileOperationResult =
  | { success: true; fileId: string; fileName: string }
  | { success: false; fileId: string; fileName: string; reason: string };

export interface StoredSessionFile {
  id: string;
  name: string;
  absolutePath: string;
  extension: string;
  category: OpaqueNativeGameFile['category'];
  size: number;
  relativePath: string;
}

export interface ActiveSession {
  token: string;
  folderName: string;
  folderPath: string;
  canonicalRoot: string;
  createdAt: number;
  files: Map<string, StoredSessionFile>;
}
