export type FileCategory = 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'document' 
  | 'code' 
  | 'archive' 
  | 'other';

export interface GameFile {
  id: string;
  name: string;
  extension: string;
  category: FileCategory;
  size: number;
  relativePath?: string;
  lastModified?: number;
  isRealFile?: boolean;
}

export type FileOperationResult =
  | { success: true; fileId: string; fileName: string }
  | { success: false; fileId: string; fileName: string; reason: string };

export interface DirectoryScanResult {
  folderName: string;
  files: GameFile[];
  totalFiles: number;
  categoryCounts: Record<FileCategory, number>;
  totalSizeBytes: number;
  sessionToken?: string;
  isRealFolder?: boolean;
}

export interface CategoryTheme {
  label: string;
  color: string;           // Hex color for canvas rendering
  badgeClass: string;      // Tailwind class for badge background
  borderClass: string;     // Tailwind border
  textClass: string;       // Tailwind text
  iconName: string;        // Icon identifier
}
