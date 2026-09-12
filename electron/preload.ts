import { contextBridge, ipcRenderer } from 'electron';
import { FolderSelectionResult, NativeFileOperationResult } from './types';

export interface FileSnakeNativeBridge {
  isDesktop: boolean;
  getPlatform: () => Promise<{ os: string; isDesktop: boolean; realTrashSupported: boolean }>;
  selectFolder: () => Promise<FolderSelectionResult | null>;
  consumeFile: (sessionToken: string, fileId: string) => Promise<NativeFileOperationResult>;
  disableRealMode: () => Promise<{ success: boolean }>;
  openRecycleBin: () => Promise<{ success: boolean; reason?: string }>;
}

const nativeBridge: FileSnakeNativeBridge = {
  isDesktop: true,

  getPlatform: async () => {
    return ipcRenderer.invoke('fs:getPlatform');
  },

  selectFolder: async () => {
    return ipcRenderer.invoke('fs:selectFolder');
  },

  consumeFile: async (sessionToken: string, fileId: string) => {
    return ipcRenderer.invoke('fs:consumeFile', { sessionToken, fileId });
  },

  disableRealMode: async () => {
    return ipcRenderer.invoke('fs:disableRealMode');
  },

  openRecycleBin: async () => {
    return ipcRenderer.invoke('fs:openRecycleBin');
  }
};

contextBridge.exposeInMainWorld('fileSnakeNative', nativeBridge);
