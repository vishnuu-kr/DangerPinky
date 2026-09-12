const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let server;
let serverPort;

function startLocalServer() {
  return new Promise((resolve) => {
    const distDir = path.join(__dirname, '../dist');
    server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      const filePath = path.join(distDir, reqPath);
      
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.wasm': 'application/wasm',
        '.task': 'application/octet-stream',
        '.svg': 'image/svg+xml'
      };
      
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(0, '127.0.0.1', () => {
      serverPort = server.address().port;
      console.log('Local embedded server started on port:', serverPort);
      resolve(serverPort);
    });
  });
}

app.whenReady().then(async () => {
  const port = await startLocalServer();

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'media' || permission === 'camera' || permission === 'video') return callback(true);
    callback(false);
  });
  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    if (permission === 'media' || permission === 'camera' || permission === 'video') return true;
    return false;
  });

  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../dist-electron/preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.webContents.on('console-message', (_e, level, msg) => {
    console.log('[Renderer Log]:', msg);
  });

  await win.loadURL(`http://127.0.0.1:${port}/index.html`);

  const result = await win.webContents.executeJavaScript(`
    (async () => {
      try {
        console.log("Checking MediaPipe initialization on localhost...");
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput').map(d => d.label || d.deviceId);

        let landmarkerResult = null;
        if (typeof window.__getHandLandmarker === 'function') {
          console.log("Calling window.__getHandLandmarker()...");
          const landmarker = await window.__getHandLandmarker();
          console.log("Landmarker loaded successfully!");

          const testCanvas = document.createElement('canvas');
          testCanvas.width = 480;
          testCanvas.height = 360;
          const ctx = testCanvas.getContext('2d');
          ctx.fillStyle = '#111';
          ctx.fillRect(0, 0, 480, 360);

          const det = landmarker.detectForVideo(testCanvas, performance.now());
          console.log("Detection call succeeded, landmarks:", det.landmarks ? det.landmarks.length : 0);
          landmarkerResult = {
            loaded: true,
            detectSucceeded: !!det
          };
        }

        return {
          isSecureContext: window.isSecureContext,
          hasMediaDevices: !!navigator.mediaDevices,
          videoDevices,
          landmarkerResult
        };
      } catch (err) {
        return { error: err.stack || err.message };
      }
    })()
  `);

  console.log('[Localhost Verification Result]:', JSON.stringify(result, null, 2));
  
  server.close();
  app.exit(0);
});
