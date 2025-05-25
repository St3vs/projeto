const { contextBridge, ipcRenderer } = require('electron');

// Exponha APIs seguras para o renderer
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (msg) => ipcRenderer.send('message', msg),
  onMessage: (callback) => ipcRenderer.on('message', (event, data) => callback(data)),
  // você pode expor mais APIs aqui conforme precisar
});