const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let server;

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
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.wasm': 'application/wasm',
        '.task': 'application/octet-stream',
        '.svg': 'image/svg+xml',
        '.png': 'image/png'
      };
      
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(0, '127.0.0.1', () => {
      resolve(server.address().port);
    });
  });
}

app.whenReady().then(async () => {
  const port = await startLocalServer();
  const win = new BrowserWindow({
    width: 1280,
    height: 960,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../dist-electron/preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  await win.loadURL(`http://127.0.0.1:${port}/index.html`);
  await new Promise((r) => setTimeout(r, 1200));

  // 1. Click "Play Demo" to enter game screen
  await win.webContents.executeJavaScript(`
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.toLowerCase().includes('play demo'));
    if (btn) {
      console.log("Found Play Demo button, clicking...");
      btn.click();
    } else {
      console.error("Play Demo button not found!");
    }
  `);
  await new Promise((r) => setTimeout(r, 1200));

  // 2. Open Settings Modal
  await win.webContents.executeJavaScript(`
    const settingsBtn = document.querySelector('button[aria-label="Settings"]');
    if (settingsBtn) {
      console.log("Found Settings button, clicking...");
      settingsBtn.click();
    } else {
      console.error("Settings button not found!");
    }
  `);
  await new Promise((r) => setTimeout(r, 600));

  // 3. Verify settings modal element in DOM
  const modalFound = await win.webContents.executeJavaScript(`
    (() => {
      const el = document.getElementById('settings-modal');
      return {
        exists: !!el,
        htmlSnippet: el ? el.innerText.slice(0, 150) : null
      };
    })()
  `);
  console.log('Settings Modal Element:', JSON.stringify(modalFound, null, 2));

  // Wait for compositor frame paint
  await win.webContents.executeJavaScript(`new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
  await new Promise((r) => setTimeout(r, 1000));

  // 4. Capture screenshot of Candy Settings Modal NOW while it is open
  const settingsImg = await win.capturePage();
  const artifactDir = 'C:/Users/Vix/.gemini/antigravity/brain/ba221567-f041-4ede-abcd-0e85e7af5f00';
  fs.writeFileSync(path.join(artifactDir, 'candy_settings_modal.png'), settingsImg.toPNG());
  console.log('✓ Captured candy_settings_modal.png artifact');

  // 5. Close settings by clicking SAVE & CLOSE
  await win.webContents.executeJavaScript(`
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('SAVE & CLOSE'));
    if (closeBtn) {
      console.log("Clicking SAVE & CLOSE...");
      closeBtn.click();
    }
  `);
  await new Promise((r) => setTimeout(r, 3500)); // wait for countdown to finish and game to start

  // 6. Capture board with 16x16 grid, snake, and fruit badge
  const boardImg = await win.capturePage();
  fs.writeFileSync(path.join(artifactDir, 'board_16x16_fruit_badge.png'), boardImg.toPNG());
  console.log('✓ Captured board_16x16_fruit_badge.png artifact');

  // 7. Verify Engine Speed across modes
  const speedCheck = await win.webContents.executeJavaScript(`
    (() => {
      if (!window.__gameEngine) return null;
      const engine = window.__gameEngine;
      const initialSpeed = engine.getCurrentTickSpeed();
      
      // Update config to CHILL
      engine.updateConfig({ ...engine.config, difficulty: 'CHILL' });
      const chillSpeed = engine.getCurrentTickSpeed();
      
      // Update config to FAST
      engine.updateConfig({ ...engine.config, difficulty: 'FAST' });
      const fastSpeed = engine.getCurrentTickSpeed();

      // Update config to CLASSIC
      engine.updateConfig({ ...engine.config, difficulty: 'CLASSIC' });
      const classicSpeed = engine.getCurrentTickSpeed();

      return {
        initialSpeed,
        chillSpeed,
        classicSpeed,
        fastSpeed,
        speedChangesWorking: (chillSpeed === 200 && classicSpeed === 140 && fastSpeed === 85)
      };
    })()
  `);

  console.log('Engine Speed Dynamic Calculation:', JSON.stringify(speedCheck, null, 2));

  server.close();
  app.exit(0);
});
