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

  const img = await win.capturePage();
  const artifactDir = 'C:/Users/Vix/.gemini/antigravity/brain/ba221567-f041-4ede-abcd-0e85e7af5f00';
  fs.writeFileSync(path.join(artifactDir, 'landing_new_hero.png'), img.toPNG());
  console.log('✓ Captured landing_new_hero.png');

  server.close();
  app.exit(0);
});
