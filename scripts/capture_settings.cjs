const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

app.whenReady().then(async () => {
  try {
    const win = new BrowserWindow({
      width: 1264,
      height: 655,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    await win.loadURL('http://localhost:3000/#game');
    await new Promise(r => setTimeout(r, 2000));

    // 1. Capture Settings Modal
    await win.webContents.executeJavaScript('if (window.__openSettings) { window.__openSettings(); true; } else { false; }');
    await new Promise(r => setTimeout(r, 1200));

    const settingsImg = await win.capturePage();
    const settingsBuffer = settingsImg.toPNG();
    fs.writeFileSync(path.resolve(__dirname, '../public/screenshots/settings.png'), settingsBuffer);
    fs.writeFileSync(path.resolve(__dirname, '../docs/screenshots/settings.png'), settingsBuffer);
    console.log('Saved settings.png');

    // Close settings modal
    await win.webContents.executeJavaScript('if (window.__closeSettings) { window.__closeSettings(); true; } else { false; }');
    await new Promise(r => setTimeout(r, 500));

    // 2. Capture Game Over Modal with High Score & File Audit
    await win.webContents.executeJavaScript('if (window.__triggerGameOver) { window.__triggerGameOver(); true; } else { false; }');
    await new Promise(r => setTimeout(r, 1200));

    const gameoverImg = await win.capturePage();
    const gameoverBuffer = gameoverImg.toPNG();
    fs.writeFileSync(path.resolve(__dirname, '../public/screenshots/gameover.png'), gameoverBuffer);
    fs.writeFileSync(path.resolve(__dirname, '../docs/screenshots/gameover.png'), gameoverBuffer);
    console.log('Saved gameover.png');

    console.log('Successfully captured screenshots!');
    app.exit(0);
  } catch (err) {
    console.error('Error capturing screenshots:', err);
    app.exit(1);
  }
});
