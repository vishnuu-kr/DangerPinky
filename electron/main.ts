import { app, BrowserWindow, ipcMain, dialog, shell, session } from 'electron';
import path from 'path';
import fs from 'fs';
import http from 'http';
import crypto from 'crypto';
import { validatePathContainment } from './securityValidator';
import { scanNativeDirectory } from './scanner';
import { ActiveSession, StoredSessionFile, FolderSelectionResult, NativeFileOperationResult } from './types';

// Enable camera/media device access in Electron
app.commandLine.appendSwitch('enable-experimental-web-platform-features');
app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure', 'file://');
app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('enable-features', 'MediaStream');

let mainWindow: BrowserWindow | null = null;
let activeSession: ActiveSession | null = null;
let localServer: http.Server | null = null;
let localServerPort: number = 0;

function startEmbeddedServer(): Promise<number> {
  return new Promise((resolve) => {
    const distDir = path.join(__dirname, '../dist');
    const mimeTypes: Record<string, string> = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.wasm': 'application/wasm',
      '.task': 'application/octet-stream',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon'
    };

    localServer = http.createServer((req, res) => {
      let reqPath = req.url ? req.url.split('?')[0] : '/';
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

      const filePath = path.normalize(path.join(distDir, reqPath));
      if (!filePath.startsWith(distDir) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.statusCode = 404;
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('Access-Control-Allow-Origin', '*');
      fs.createReadStream(filePath).pipe(res);
    });

    localServer.listen(0, '127.0.0.1', () => {
      const addr = localServer?.address();
      if (addr && typeof addr === 'object') {
        localServerPort = addr.port;
        console.log(`[Main] Embedded local server running on http://127.0.0.1:${localServerPort}`);
        resolve(localServerPort);
      } else {
        resolve(3000);
      }
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 900,
    minWidth: 800,
    minHeight: 650,
    backgroundColor: '#0e1710',
    title: 'FileSnake V4 — Real Filesystem & Recycle Bin Integration',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true
    }
  });

  // Enable F12 to toggle DevTools
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow?.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  // Log renderer errors to main console
  mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    const levelStr = level === 3 ? 'ERROR' : level === 2 ? 'WARN' : 'INFO';
    console.log(`[Renderer ${levelStr}] ${message} (${sourceId}:${line})`);
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDesc, validatedURL) => {
    console.error(`[Main] Page failed to load: ${validatedURL} [${errorCode}: ${errorDesc}]`);
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else if (localServerPort > 0) {
    mainWindow.loadURL(`http://127.0.0.1:${localServerPort}/index.html`);
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    activeSession = null;
  });
}

// ---------------------------------------------------------
// IPC Handlers: Filesystem Sandbox & OS Trash Operations
// ---------------------------------------------------------

// Check native platform capabilities
ipcMain.handle('fs:getPlatform', async () => {
  return {
    os: process.platform,
    isDesktop: true,
    realTrashSupported: true
  };
});

// Select folder via native OS dialog and scan safely
ipcMain.handle('fs:selectFolder', async (): Promise<FolderSelectionResult | null> => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Folder for FileSnake (Real File Mode)',
    properties: ['openDirectory', 'dontAddToRecent'],
    buttonLabel: 'Select Folder for Food'
  });

  if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
    return null;
  }

  const selectedPath = path.normalize(result.filePaths[0]);
  if (!fs.existsSync(selectedPath)) {
    throw new Error('Selected directory does not exist');
  }

  const canonicalRoot = path.normalize(fs.realpathSync(selectedPath));
  const folderName = path.basename(canonicalRoot) || 'Selected Folder';

  // Scan directory with strict containment and exclusion rules
  const { storedFiles, opaqueFiles } = scanNativeDirectory(canonicalRoot, 500);

  // Generate unique ephemeral session token
  const sessionToken = crypto.randomBytes(16).toString('hex');
  const sessionFilesMap = new Map<string, StoredSessionFile>();
  let totalSizeBytes = 0;

  for (const file of storedFiles) {
    sessionFilesMap.set(file.id, file);
    totalSizeBytes += file.size;
  }

  // Bind active session
  activeSession = {
    token: sessionToken,
    folderName,
    folderPath: selectedPath,
    canonicalRoot,
    createdAt: Date.now(),
    files: sessionFilesMap
  };

  return {
    sessionToken,
    folderName,
    files: opaqueFiles,
    totalFiles: opaqueFiles.length,
    totalSizeBytes
  };
});

// Move file to OS Trash / Recycle Bin with strict containment checks
ipcMain.handle(
  'fs:consumeFile',
  async (_event, args: { sessionToken: string; fileId: string }): Promise<NativeFileOperationResult> => {
    const { sessionToken, fileId } = args || {};

    // 1. Session verification
    if (!activeSession || activeSession.token !== sessionToken) {
      return {
        success: false,
        fileId: fileId || '',
        fileName: '',
        reason: 'Real file session is inactive or token mismatch'
      };
    }

    // 2. File record lookup
    const fileRecord = activeSession.files.get(fileId);
    if (!fileRecord) {
      return {
        success: false,
        fileId,
        fileName: '',
        reason: 'File not found in active session'
      };
    }

    const fileName = fileRecord.name;
    const targetPath = fileRecord.absolutePath;

    // 3. Check if file still exists on disk before attempting operation
    if (!fs.existsSync(targetPath)) {
      activeSession.files.delete(fileId);
      return {
        success: false,
        fileId,
        fileName,
        reason: 'File no longer exists at original location'
      };
    }

    // 4. Strict path containment and symlink/junction validation
    const containment = validatePathContainment(activeSession.canonicalRoot, targetPath);
    if (!containment.allowed || !containment.canonicalTarget) {
      return {
        success: false,
        fileId,
        fileName,
        reason: containment.reason || 'Security containment check failed'
      };
    }

    // 5. Execute OS native Recycle Bin / Trash operation
    try {
      // shell.trashItem moves the file to the OS Recycle Bin on Windows, macOS, and Linux
      await shell.trashItem(containment.canonicalTarget);

      // Remove from session map so it cannot be consumed again
      activeSession.files.delete(fileId);

      return {
        success: true,
        fileId,
        fileName
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        fileId,
        fileName,
        reason: `OS Trash error: ${errMsg} (File may be locked by another application)`
      };
    }
  }
);

// Emergency stop: revoke real file mode immediately
ipcMain.handle('fs:disableRealMode', async () => {
  activeSession = null;
  return { success: true };
});

// Helper: Open OS Recycle Bin / Trash for user to view / restore files
ipcMain.handle('fs:openRecycleBin', async () => {
  try {
    if (process.platform === 'win32') {
      await shell.openPath('shell:RecycleBinFolder');
      return { success: true };
    } else if (process.platform === 'darwin') {
      const homeDir = app.getPath('home');
      await shell.openPath(path.join(homeDir, '.Trash'));
      return { success: true };
    }
    return { success: false, reason: 'Unsupported OS for shortcut' };
  } catch (err: unknown) {
    return { success: false, reason: String(err) };
  }
});

// ---------------------------------------------------------
// Application Lifecycle
// ---------------------------------------------------------

app.whenReady().then(async () => {
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'media' || permission === 'camera' || permission === 'video') {
      callback(true); // Grant camera access for Pinky Tracking
      return;
    }
    callback(false);
  });

  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    if (permission === 'media' || permission === 'camera' || permission === 'video') {
      return true;
    }
    return false;
  });

  if (!process.env.VITE_DEV_SERVER_URL) {
    try {
      localServerPort = await startEmbeddedServer();
    } catch (e) {
      console.error('[Main] Failed to start embedded server, falling back to file protocol:', e);
    }
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  activeSession = null;
  if (localServer) {
    localServer.close();
    localServer = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
