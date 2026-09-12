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
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.webContents.on('console-message', (_e, level, msg) => {
    console.log('[Renderer Log]:', msg);
  });

  const html = `<!DOCTYPE html>
  <html>
  <body>
    <script>
      (async () => {
        try {
          const path = require('path');
          const visionTasks = require('@mediapipe/tasks-vision');
          console.log("Tasks vision required:", Object.keys(visionTasks));
          
          const wasmPath = path.resolve(__dirname, '../public/wasm');
          console.log("Local wasmPath:", wasmPath);
          
          console.log("1. Calling FilesetResolver.forVisionTasks...");
          const vision = await visionTasks.FilesetResolver.forVisionTasks('file:///' + wasmPath.replace(/\\\\/g, '/'));
          console.log("FilesetResolver success:", !!vision);
          
          const modelPath = path.resolve(__dirname, '../public/models/hand_landmarker.task');
          console.log("Local modelPath:", modelPath);
          
          console.log("2. Calling HandLandmarker.createFromOptions with GPU...");
          try {
            const landmarkerGPU = await visionTasks.HandLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: 'file:///' + modelPath.replace(/\\\\/g, '/'),
                delegate: 'GPU'
              },
              runningMode: 'VIDEO',
              numHands: 1
            });
            console.log("SUCCESS with GPU delegate!");
          } catch (gpuErr) {
            console.warn("GPU delegate failed:", gpuErr.message);
            console.log("Retrying with CPU delegate...");
            const landmarkerCPU = await visionTasks.HandLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: 'file:///' + modelPath.replace(/\\\\/g, '/'),
                delegate: 'CPU'
              },
              runningMode: 'VIDEO',
              numHands: 1
            });
            console.log("SUCCESS with CPU delegate!");
          }
          
          window.success = true;
        } catch (e) {
          console.error("FATAL ERROR in landmarker test:", e.stack || e.message);
        }
      })();
    </script>
  </body>
  </html>`;

  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

  setTimeout(() => {
    app.quit();
  }, 6000);
});
