const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,
  nodeIntegration: false
}
  });

function resizeVLC() {
  if (process.platform === 'darwin') {
    exec(`osascript ${path.join(__dirname, 'resize_vlc.applescript')}`, (err) => {
      if (err) console.error('Error resizing VLC:', err.message);
    });
  } else if (process.platform === 'win32') {
    exec(`powershell -ExecutionPolicy Bypass -File "${path.join(__dirname, 'resize_vlc.ps1')}"`, (err) => {
      if (err) console.error('Error resizing VLC:', err.message);
    });
  }
}

  

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
