const electron = require('electron');
const url = require('url');
const path = require('path');
const shell = require('electron').shell;
const mysql = require('mysql');
const fs = require('fs');
const isDev = require('electron-is-dev');
const {
    ipcRenderer
} = require('electron');

// Objects coming from electron
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

// !!! SET process environment. Comment this out if packaging for development!!!
//process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for app to ready
app.on('ready', function () {
    createMainWindow();
});

function createMainWindow() {
    // Create new window
    mainWindow = new BrowserWindow({
        // This is to allow node code to run in html
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        width: 1281,
        height: 800,
        minWidth: 1281,
        minHeight: 800,
        icon: './../src/assets/icons/png/logo-desktop.png'
    });

    // Load main.html into window
    // This syntax is just //__dirname/mainWindow.html
    // __dirname gets the relative path of THIS file (main.js)
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    // Quit entire application when main process is closed
    mainWindow.on('closed', function () {
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);
}

// Handle create add window 

function createAddWindow() {
    addWindow = new BrowserWindow({
        // This is to allow node code to run in html
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        parent: mainWindow,
        modal: true
    });

    // Load main.html into window
    // This syntax is just //__dirname/mainWindow.html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Garbage collection handle
    addWindow.on('close', function () {
        addWindow = null;
    });
}

// Create menu template
const mainMenuTemplate = [{
        label: 'File',
        submenu: [{
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q', // Adds hotkey of Q
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Help',
        submenu: [{
            label: 'About',
            click() {
                shell.openExternal('https://github.com/chen2573/CapstoneDesktopDev01#readme');
            }

        }]
    }

];

// If mac, add empty object to menu template
if (process.platform == 'dawrwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [{
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I', // Adds hotkey of I
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}

// ============ Inter Process Communication ==============
ipcMain.on("toMain:Program", (event, args) => {
    console.log('Main recieved Program info', args);
    queryDatabase(args).then((data) => {
        mainWindow.webContents.send('fromMain:Program', data)
    });
});

ipcMain.on("toMain:Course", (event, args) => {
    console.log('Main recieved Course info', args);
    queryDatabase(args).then((data) => {
        mainWindow.webContents.send('fromMain:Course', data)
    });
});

// ============ DataBase functions ======================== 
const connectToSever = () => {
    return new Promise((resolve, reject) => {
        var config = {
            host: 'capstonedb01.mysql.database.azure.com',
            user: 'desktopteam',
            password: 'desktoppass',
            database: 'classyschedule',
            port: 3306,
            //ssl: {ca: fs.readFileSync(path.join(__dirname, 'DBCertificate', 'DigiCertGlobalRootCA.crt.pem'))}
        };

        const conn = new mysql.createConnection(config);

        conn.connect(
            function (err) {
                if (err) {
                    console.log("!!! Cannot connect !!! Error:");
                    reject(err)
                } else {
                    resolve(conn)
                }
            });
    })

}

function queryDatabase(query) {
    return new Promise((resolve, reject) => {
        connectToSever().then(conn => {
            conn.query(query, function (err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })

        })
    })
}