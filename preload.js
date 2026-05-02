const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  close: () => ipcRenderer.send('close'),
  minimize: () => ipcRenderer.send('minimize'),
  toggleClickThrough: () => ipcRenderer.send('toggle-click-through'),
  resize: (delta) => ipcRenderer.send('resize', delta),
  onClickThroughChanged: (cb) =>
    ipcRenderer.on('click-through-changed', (_e, v) => cb(v)),
});
