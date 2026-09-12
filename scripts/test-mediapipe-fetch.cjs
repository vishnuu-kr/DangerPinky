const { app, BrowserWindow } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('enable-experimental-web-platform-features');
app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure', 'file://');
app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('enable-features', 'MediaStream');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../dist-electron/preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  win.webContents.on('console-message', (_e, level, msg) => {
    console.log('[Renderer Log]:', msg);
  });

  await win.loadFile(path.join(__dirname, '../dist/index.html'));

  const result = await win.webContents.executeJavaScript(`
    (async () => {
      try {
        console.log("Checking MediaPipe initialization in renderer...");
        if (typeof window.__getHandLandmarker === 'function') {
          const landmarker = await window.__getHandLandmarker();
          return { loaded: true, landmarkerAvailable: !!landmarker };
        }
        return { loaded: true, landmarkerAvailable: false };
      } catch (err) {
        return { error: err.stack || err.message };
      }
    })()
  `);

  console.log('Result:', JSON.stringify(result, null, 2));
  app.exit(0);
});
