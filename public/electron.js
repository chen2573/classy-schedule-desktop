const electron = require('electron');
const url = require('url');
const path = require('path');
const shell = require('electron').shell;
const mysql = require('mysql');
const fs = require('fs');
const isDev = require('electron-is-dev');

// Objects coming from electron
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    dialog
} = electron;

// Module that contains the database object
const DatabaseService = require(path.join(__dirname, '../src/utils/services/databaseService'));

// !!! SET process environment. Comment this out if packaging for development!!!
//process.env.NODE_ENV = 'production';

// Global variables for the scope of our app. This represents the main window and any additional windows plus our top menu.
let mainWindow;
let addWindow;
let logInWindow;
let mainMenuTemplate;

//This variable is a global variable that keeps track of a user session
let userLoggedIn = false;

// Listen for app to ready
app.on('ready', function () {
    createIPCChannels();

    displayLogInWindow();
});

/**
 * Create the main window for our main process. Most of the application interaction 
 * will be from this window.
 */
function displayMainWindow() {
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
    if(userLoggedIn) {
        mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    }

    // Quit entire application when main process is closed
    mainWindow.on('closed', function () {
        //app.quit();
    });

    // Build menu from template
    buildMainMenuTemplate();
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);
}

/**
 * Create the main window for our main process. Most of the application interaction 
 * will be from this window.
 */
 function displayLogInWindow() {
    // Create new window
    logInWindow = new BrowserWindow({
        // This is to allow node code to run in html
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        width: 600,
        height: 700,
        resizable: false,
        center: true,
        icon: './../src/assets/icons/png/logo-desktop.png'
    });
    if(!userLoggedIn){
        logInWindow.loadURL(`file://${path.join(__dirname, '/views/login/login.html')}`);
    }

    logInWindow.on('close', function () {
        logInWindow = null;
    });
}

/**
 * Builds the top menu that will be used by our electron app.
 */
function buildMainMenuTemplate() {
    // The template that is used for our menu at the top of our application.
    mainMenuTemplate = [{
        label: 'File',
        submenu: [
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
        submenu: [
            {
                label: 'Pages',
                submenu: [
                    {
                        label: 'Professors',
                        click() {
                            
                        }
                    },
                    {
                        label: 'Courses',
                        click() {
                            
                        }
                    },
                    {
                        label: 'Labs',
                        click() {
                            
                        }
                    },
                    {
                        label: 'Rooms',
                        click() {
                            
                        }
                    },
                    {
                        label: 'Schedule',
                        click() {
                            
                        }
                    }
                ]
            },
            {
                label: 'Documentation',
                click() {
                    shell.openExternal('https://github.com/chen2573/CapstoneDesktopDev01#readme');
                }
            }
        ]
    },
    {
        label: 'About',
        submenu: [
            {
                label: 'Visit our Site',
                click() {
                    shell.openExternal('https://github.com/chen2573/CapstoneDesktopDev01#readme');
                }
            },
            {
                label: 'Our Developers',
                submenu: [
                    {
                        label: 'Glennon Langan',
                        click() {

                        }
                    },
                    {
                        label: 'Joe Heimel',
                        click() {

                        }
                    },
                    {
                        label: 'Samuel Swanson',
                        click() {

                        },
                    },
                    {
                        label: 'Tianzhi Chen',
                        click() {

                        }
                    },
                    {
                        label: 'Anshul Bharath',
                        click() {

                        },
                    }
                ]
            }
        ]
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

}



// This is the object that handles all database/API requests
let DB = new DatabaseService();

/**
 * Inter Process Communication is used to communicate to our UI which
 * is our React App. The channels for the IPC channels are set up in public/preload.js.
 */
function createIPCChannels() {
    
    // LogIn logic.
    ipcMain.on("toMain:AuthLogIn", (event, args) => {
        DB.authenticateUser(args.email, args.password).then((payload) => {
            console.log("USER AUTH LOG--> Token:" + payload.data.token);
            if(payload.data.token === 'tokenInvalid'){
                window.alert("Invalid Username or Password");
                console.log("USER AUTH LOG--> User entered incorrect password \n");
            }
            else {
                DB.setAuthenticationToken(payload.data.token);
                console.log("USER AUTH LOG--> User Successfully loggin in:" + DB.getAuthenticationToken() + '\n');
                logInWindow.close();

                userLoggedIn = true;
                displayMainWindow();
            }
        }).catch((error) => {
            //dialog.showErrorBox('Login Failed', 'Username or password is incorrect');
            logInWindow.webContents.send('fromMain:AuthLogIn', error);

            console.log('USER AUTH LOG--> Error authenticating user: ' + error + '\n');
        });
    });

    // Logout Logic and flow.
    ipcMain.on("toMain:AuthLogOut", (event, args) => {

        DB.invalidateToken();
        console.log("USER AUTH LOG--> User has logged out: " + DB.getAuthenticationToken() + '\n');

        userLoggedIn = false;
        displayLogInWindow();
        
        mainWindow.close();

        
    });

    // Get all Programs
    ipcMain.on("toMain:Program", (event, args) => {
        console.log("DATABASE LOG --> " + args)
        console.log("DATABASE LOG --> " + "Making request for all PROGRAMS")

        DB.getPrograms().then((payload) => {
            console.log("DATABASE LOG--> Successfully returned the following rows\n" + payload.data + + '\n');
            mainWindow.webContents.send('fromMain:Program', payload.data);
                
        }).catch((error) => {
            console.log('DATABASE LOG--> ERROR returning Programs: ' + error + + '\n');
        });
    });
}