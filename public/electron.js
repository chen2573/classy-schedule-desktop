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
const DatabaseService = require(path.join(__dirname, 'services/databaseService.js'));

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
 * 
 * This function adds creates and adds all the channels needed for communcication with the React App.
 * This communication is mostly used Database API calls.
 */
function createIPCChannels() {
    addAuthenticationChannels();
    addProgramChannel();
    addProfessorChannel();
    addCourseChannel();
    addRoomChannel();
    addAlgorithmChannel();
}

/**
 * This function creates a database channel for Authentication.
 */
function addAuthenticationChannels(){
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
}

/**
 * This function creates a database channel for Programs.
 */
function addProgramChannel(){
    // Get all Programs
    ipcMain.on("toMain:Program", (event, args) => {
        if(args.request === 'REFRESH'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request REFRESH all PROGRAMS")
    
            DB.getPrograms().then((payload) => {
                console.log('DATABASE LOG--> Successfully returned the following PROGRAM rows\n' + payload.data + '\n');
                mainWindow.webContents.send('fromMain:Program', payload.data);
                    
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR returning PROGRAMS: ' + error + + '\n');
            });
        }

    });
}

/**
 * This function creates a database channel for Professors.
 */
function addProfessorChannel(){
    // Get all Professors
    ipcMain.on("toMain:Professor", (event, args) => {

        if(args.request === 'REFRESH'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request REFRESH all PROFESSORS")
    
            DB.getProfessors().then((payload) => {
                console.log("DATABASE LOG--> Successfully returned the following PROFESSOR rows\n" + payload.data + "\n\n");
                mainWindow.webContents.send('fromMain:Professor', payload.data);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR returning PROFESSORS: ' + error + + '\n');
            });
        }
        else if(args.request === 'CREATE'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request CREATE a PROFESSOR")
    
            DB.createProfessor(args.firstName, args.lastName, args.teachLoad).then((payload) => {
                console.log("DATABASE LOG--> Successfully added PROFESSOR \n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Professor added successfully!",
                    profId: payload.data.professor_id
                };

                mainWindow.webContents.send('fromMain:Professor', _payload);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR adding PROFESSOR: ' + error + + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to add professor.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Professor', _payload);
            });
        }
        else if(args.request === 'DELETE'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request DELETE a PROFESSOR")
    
            DB.deleteProfessor(args.profId).then((payload) => {
                console.log("DATABASE LOG--> Successfully deleted PROFESSOR with profId: " + args.profId + "\n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Professor deleted successfully!",
                    profId: payload.data.professor_id
                };

                mainWindow.webContents.send('fromMain:Professor', _payload);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR deleting PROFESSOR: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to delete professor.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Professor', _payload);
            });
        }

    });
}

/**
 * This function creates a database channel for Courses.
 */
function addCourseChannel(){
    // Get all Courses
    ipcMain.on("toMain:Course", (event, args) => {

        if(args.request === 'REFRESH'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request REFRESH all COURSES")
    
            DB.getCourses().then((payload) => {
                console.log("DATABASE LOG--> Successfully returned the following COURSE rows\n" + payload.data + "\n");
                mainWindow.webContents.send('fromMain:Course', payload.data);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR returning COURSES: ' + error + + '\n');
            });
        }
        else if(args.request === 'CREATE'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request CREATE a COURSE")

            DB.createCourse(args.courseNum, args.deptId, args.courseName, args.capacity, args.credits).then((payload) => {
                console.log("DATABASE LOG--> Successfully created COURSE\n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Course added successfully!",
                };
                mainWindow.webContents.send('fromMain:Course', _payload);

            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR adding COURSE: ' + error + + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to add course.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Course', _payload);
            });
        }
        else if(args.request === 'DELETE'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request DELETE a COURSE")
    
            DB.deleteCourse(args.classNum, args.deptId).then((payload) => {
                console.log("DATABASE LOG--> Successfully deleted COURSE with course number: " + args.classNum + "\n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Course deleted successfully!",
                    courseNum: payload.data.classNum
                };

                mainWindow.webContents.send('fromMain:Course', _payload);
            }).catch((error) => {
                console.log('!!!DATABASE LOG--> ERROR deleting COURSE: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to delete course.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Course', _payload);
            });
        }

    });
}

/**
 * This function creates a database channel for Rooms.
 */
function addRoomChannel(){
    // Get all Rooms
    ipcMain.on("toMain:Room", (event, args) => {

        if(args.request === 'REFRESH'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request REFRESH all ROOMS")
    
            DB.getRooms().then((payload) => {
                console.log("DATABASE LOG--> Successfully returned the following ROOM rows\n" + payload.data + "\n\n");
                mainWindow.webContents.send('fromMain:Room', payload.data);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR returning ROOMS: ' + error + + '\n');
            });
        }
        else if(args.request === 'CREATE'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request CREATE a ROOM")

            DB.createRoom(args.roomNumber, args.capacity).then((payload) => {
                console.log("DATABASE LOG--> Successfully created ROOM\n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Room added successfully!",
                };
                mainWindow.webContents.send('fromMain:Room', _payload);

            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR adding ROOM: ' + error + + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to add room.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Room', _payload);
            });
        }
        else if(args.request === 'DELETE'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request DELETE a ROOM")
    
            DB.deleteRoom(args.roomId).then((payload) => {
                console.log("DATABASE LOG--> Successfully deleted ROOM with room id: " + args.roomId + "\n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Room deleted successfully!",
                    roomId: payload.data.roomId
                };

                mainWindow.webContents.send('fromMain:Room', _payload);
            }).catch((error) => {
                console.log('!!!DATABASE LOG--> ERROR deleting room: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to delete room.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Room', _payload);
            });
        }

    });
}

/**
 * This function creates a database channel for Algorithms.
 */
 function addAlgorithmChannel(){
    // Get all Programs
    ipcMain.on("toMain:Algo", (event, args) => {
        if(args.request === 'RUN'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request RUN ALGORITHM")
    
            executeAlgorithm();
        }

    });
}

//const exec = require('child_process').execFile;
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
async function executeAlgorithm() {

    if(process.platform == 'darwin'){
        const {stdout} = await execFile(path.join(__dirname, 'services/testPythonScript/mac/CSP-selective2.exe'), []);
        console.log(stdout);
    }
    else {
        const {stdout} = await execFile(path.join(__dirname, 'services/testPythonScript/win/CSP-selective2.exe'), []);
        console.log(stdout);
    }
    
}