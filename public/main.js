const electron = require('electron');
const url = require('url');
const path = require('path');
const shell = require('electron').shell;

// Objects coming from electron
const {app, BrowserWindow, Menu, ipcMain} = electron;

// !!! SET process environment. Comment this out if packaging for development!!!
//process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for app to ready
app.on('ready', function() 
{
    // Create new window
    mainWindow = new BrowserWindow(
    {
        // This is to allow node code to run in html
        webPreferences: 
        {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 1000,
        height: 800
    });

    // Load main.html into window
    // This syntax is just //__dirname/mainWindow.html
    // __dirname gets the relative path of THIS file (main.js)
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../src/home.html'),
        protocol:'file:',
        slashes: true
    }));

    // Quit entire application when main process is closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle create add window 

function createAddWindow() {
    addWindow = new BrowserWindow({
        // This is to allow node code to run in html
        webPreferences: 
        {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 300,
        height: 200,
        title:'Add Shopping List Item',
        parent: mainWindow,
        modal: true
    });

    // Load main.html into window
    // This syntax is just //__dirname/mainWindow.html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol:'file:',
        slashes: true
    }));

    // Garbage collection handle
    addWindow.on('close', function(){
        addWindow = null;
    });
}

// Catch item.add
ipcMain.on('item:add', function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu: [
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                type: 'separator'
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q', // Adds hotkey of Q
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label:'Help',
        submenu: [
            {
                label: 'About',
                click() {
                    shell.openExternal('https://github.com/chen2573/CapstoneDesktopDev01#readme');
                }

            }
        ]
    }
    
];

// If mac, add empty object to menu template
if(process.platform == 'dawrwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I', // Adds hotkey of I
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}