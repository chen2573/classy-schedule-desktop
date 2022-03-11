const { contextBridge } = require("electron");
window.ipcRenderer = require('electron').ipcRenderer;

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "DB", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ['toMain:Course', 'toMain:Professor', 'toMain:Room', 'toMain:Program'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ['fromMain:Course', 'fromMain:Professor', 'fromMain:Room', 'fromMain:Program'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.once(channel, (event, ...args) => func(...args));
            }
        }
    }
);