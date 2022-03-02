'use strict';
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
let mainWindow;

let dev = false

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {dev = true;}

if (process.platform === 'win32')
{
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

function createWindow()
{
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  let indexPath;

  if (dev && process.argv.indexOf('--noDevServer') === -1)
  {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  }
  else
  {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    if (dev)
    {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', function() {mainWindow = null});
}


//create window when ready
app.on('ready', createWindow);
app.on('activate', () => {if (mainWindow === null) {createWindow()}});

//quit app when window is closed
app.on('window-all-closed', () => {if (process.platform !== 'darwin') {app.quit()}});
