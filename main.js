const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require('electron');
const path = require('path');

let win;
let clickThrough = false;

function createWindow() {
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
  const size = 280;

  win = new BrowserWindow({
    width: size,
    height: size,
    x: sw - size - 40,
    y: sh - size - 40,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: true,
    alwaysOnTop: true,
    hasShadow: false,
    roundedCorners: false,
    thickFrame: false,
    minWidth: 120,
    minHeight: 120,
    maxWidth: 800,
    maxHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAspectRatio(1);
  win.loadFile('index.html');
}

function setClickThrough(enabled) {
  if (!win) return;
  clickThrough = enabled;
  win.setIgnoreMouseEvents(enabled, { forward: true });
  win.webContents.send('click-through-changed', enabled);
}

app.whenReady().then(() => {
  createWindow();

  // Ctrl+Shift+C toggles click-through (so the camera can't intercept clicks
  // while you're presenting, and you can disable it again from anywhere).
  globalShortcut.register('CommandOrControl+Shift+C', () => setClickThrough(!clickThrough));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => app.quit());

ipcMain.on('close', () => win?.close());
ipcMain.on('minimize', () => win?.minimize());
ipcMain.on('toggle-click-through', () => setClickThrough(!clickThrough));
ipcMain.on('resize', (_e, delta) => {
  if (!win) return;
  const [w] = win.getSize();
  const next = Math.max(120, Math.min(800, w + delta));
  win.setSize(next, next);
});
