const { contextBridge } = require("electron");
window.ipcRenderer = require('electron').ipcRenderer;

/**
 * This function is a preload script to set up IPC channels.
 * 
 * This creates a context bridge between electron and our react app. This allows our electron app
 * to know about our React UI without the React UI know the inner workings of the IPC. 
 * 
 * This will Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object.
 * 
 * To add a new channelyou have to add the string to the 'validChannels' and add a constant to src/utils/ipcChannels.js.
 */
contextBridge.exposeInMainWorld(
    "DB", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ['toMain:Course', 'toMain:Professor', 'toMain:Room', 'toMain:Program', 'toMain:AuthLogIn', 'toMain:AuthLogOut', 'toMain:Plan', 'toMain:Modal', 'toMain:Algo'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ['fromMain:Course', 'fromMain:Professor', 'fromMain:Room', 'fromMain:Program', 'fromMain:AuthLogIn', 'fromMain:AuthLogOut', 'fromMain:Plan', 'fromMain:Modal', 'fromMain:Algo'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.once(channel, (event, ...args) => func(...args));
            }
        }
    }
);