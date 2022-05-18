const electron = require('electron');
const url = require('url');
const path = require('path');
const shell = require('electron').shell;
const mysql = require('mysql');
const fs = require('fs');
const isDev = require('electron-is-dev');

// Objects coming from electron
const { app, BrowserWindow, Menu, ipcMain, dialog } = electron;

// Module that contains the database object
const DatabaseService = require(path.join(__dirname, 'services/mainDBService.js'));

/**
 * This is the main script of our entire application. This class takes care and displays the main
 * window. In electron terms this is the 'main' class and any other views are the 'renderer' classes.
 * 
 * The main functionality of this class comes from the many different channels that are set up below 
 * that make calls to the database. This is done through a process called IPC or inter process communication.
 * 
 * @authors - Glen, Joe, Sam, Chen, Anshul
 */

// !!! SET process environment. Comment this out if packaging for development!!!
// process.env.NODE_ENV = 'production';

// Global variables for the scope of our app. This represents the main window and any additional windows plus our top menu.
let mainWindow;
let addWindow;
let logInWindow;
let mainMenuTemplate;
let newPlanDialogue;

let receivedCount = 0;

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

    // Child process for Creating new Schedule
    ipcMain.on("toMain:Modal", (event, args) => {
        if(args.request === 'NEW_PLAN') {
            newPlanDialogue = new BrowserWindow({
                parent: mainWindow,
                webPreferences: {
                    nodeIntegration: false,
                    enableRemoteModule: true,
                    contextIsolation: true,
                    preload: path.join(__dirname, 'preload.js')
                },
                width:600,
                height:670,
                resizable: false,
                center: true,
                modal: true,
            })
            newPlanDialogue.loadURL(`file://${path.join(__dirname, '/views/newPlan/plan.html')}`);

            newPlanDialogue.on('close', function () {
                newPlanDialogue = null;
            });
        }
        else if(args.request === 'UPDATE_PLAN') {
            newPlanDialogue = new BrowserWindow({
                parent: mainWindow,
                webPreferences: {
                    nodeIntegration: false,
                    enableRemoteModule: true,
                    contextIsolation: true,
                    preload: path.join(__dirname, 'preload.js')
                },
                width:600,
                height:670,
                resizable: false,
                center: true,
                modal: true,
            })
            let payload = {
                id: args.id,
                name: args.name,
                description: args.description,
                year: args.year,
                semester: args.semester
            }
            
            newPlanDialogue.loadURL(`file://${path.join(__dirname, '/views/updatePlan/plan.html')}`);
            setTimeout(sendContents, 500);
            
            function sendContents() {
                newPlanDialogue.webContents.send('fromMain:ModalElectron', payload);
            }

            
            newPlanDialogue.on('close', function () {
                newPlanDialogue = null;
            });
        }
        else if(args.request === 'NEW_ADMIN') {
            newPlanDialogue = new BrowserWindow({
                parent: mainWindow,
                webPreferences: {
                    nodeIntegration: false,
                    enableRemoteModule: true,
                    contextIsolation: true,
                    preload: path.join(__dirname, 'preload.js')
                },
                width:600,
                height:760,
                resizable: false,
                center: true,
                closable: true
            })
            newPlanDialogue.loadURL(`file://${path.join(__dirname, '/views/newAccount/newAccount.html')}`);

            newPlanDialogue.on('close', function () {
                newPlanDialogue = null;
            });
        }
        else if(args.request === 'CANCEL_PLAN'){
            newPlanDialogue.close();
            console.log("MODAL WINDOW LOG --> " + args.message);

            receivedCount = 0;

            let _payload = {
                status: 'CANCEL',
                message: "Schedule cancelled"
            };
            mainWindow.webContents.send('fromMain:Plan', _payload);
        }
    });
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
    buildMainMenuTemplate();
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);

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
                            shell.openExternal('https://github.com/glennonl');
                        }
                    },
                    {
                        label: 'Joe Heimel',
                        click() {
                            shell.openExternal('https://github.com/josephheimel');
                        }
                    },
                    {
                        label: 'Samuel Swanson',
                        click() {
                            shell.openExternal('https://github.com/SamuelSwanson');
                        },
                    },
                    {
                        label: 'Tianzhi Chen',
                        click() {
                            shell.openExternal('https://github.com/chen2573');
                        }
                    },
                    {
                        label: 'Anshul Bharath',
                        click() {
                            shell.openExternal('https://github.com/anshulBharath');
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
    if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV === 'production') {
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
    addProfPrefChannel();
    addCourseChannel();
    addRoomChannel();
    addTimeChannel();
    addPlanChannel();
    addUpdateAndViewPlanChannel()
    addModalWindows();
    addJsonChannel()
    addAlgorithmChannel();
}

/**
 * This function creates a database channel for Authentication.
 */
function addAuthenticationChannels(){
    // LogIn logic.
    ipcMain.on("toMain:AuthLogIn", (event, args) => {
        if(args.request === 'SIGNIN'){
            DB.authenticateAdmin(args.email, args.password).then((payload) => {
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
        }
        else if(args.request === 'NEW_ACCOUNT'){
            console.log("USER AUTH LOG--> Creating account for: " + args.firstName + ' ' + args.lastName);
            console.log(args);
            DB.createAdminAccount(args.firstName, args.lastName, args.email, args.password).then((payload) => {
                console.log("USER AUTH LOG--> Successfully created account.\n");
                console.log(payload.data);

                let _payload = {
                    result: 'SUCCESS',
                    message: 'New Admin Account created successfully!'
                }
                logInWindow.webContents.send('fromMain:AuthLogIn', _payload);
            }).catch((error) => {
                let _payload = {
                    result: 'FAIL',
                    message: 'Error! Unable to create admin account. Please try again.'
                }
                logInWindow.webContents.send('fromMain:AuthLogIn', _payload);

                console.log('USER AUTH LOG--> Error creating user: ' + error + '\n');
            });
        }
        else if(args.request === 'FORGOT_PASSWORD'){
            DB.resetPassword(args.email).then((payload) => {
                console.log("USER AUTH LOG--> User forgot password"); 

                let _payload = {
                    result: 'Success',
                    message: "Password reset successfully!"
                }
                
                logInWindow.webContents.send('fromMain:AuthLogIn', _payload);
            }).catch((error) => {
                //dialog.showErrorBox('Login Failed', 'Username or password is incorrect');
                let _payload = {
                    result: 'FAIL',
                    message: 'Error reseting password!',
                    error: error
                }

                logInWindow.webContents.send('fromMain:AuthLogIn', _payload);

                console.log('USER AUTH LOG--> Error reseting user: ' + error + '\n');
            });
        }
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
    
            DB.createProfessor(args.firstName, args.lastName, args.teachLoad, args.email).then((payload) => {
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
        else if(args.request === 'UPDATE'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request UPDATE a PROFESSOR")
    
            DB.updateProfessor(args.id, args.firstName, args.lastName, args.teachLoad, args.email).then((payload) => {
                console.log("DATABASE LOG--> Successfully updated PROFESSOR \n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Professor updated successfully!",
                    profId: payload.data.professor_id
                };

                mainWindow.webContents.send('fromMain:Professor', _payload);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR updating PROFESSOR: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to update professor.",
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

            DB.createCourse(args.courseNum, args.deptId, args.courseName, args.capacity, args.credits, args.isLab, args.numSections).then((payload) => {
                console.log("DATABASE LOG--> Successfully created COURSE\n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Course added successfully!",
                    id: payload.data.class_id
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
    
            DB.deleteCourse(args.id).then((payload) => {
                console.log("DATABASE LOG--> Successfully deleted COURSE with course id: " + args.id + "\n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Course deleted successfully!",
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
        else if(args.request === 'UPDATE'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request UPDATE a COURSE")

            DB.updateCourse(args.id, args.number, args.deptId, args.name, args.capacity, args.credits, args.isLab, args.numSections).then((payload) => {
                console.log("DATABASE LOG--> Successfully updated COURSE with course number: " + args.number + "\n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Course updated successfully!",
                };

                mainWindow.webContents.send('fromMain:Course', _payload);
            }).catch((error) => {
                console.log('!!!DATABASE LOG--> ERROR updating COURSE: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to update course.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Course', _payload);
            });
        }

    });
}

/**
 * Adds a channel for professor preferences.
 */
function addProfPrefChannel(){
    ipcMain.on("toMain:Prefs", (event, args) => {

        if(args.request === 'REFRESH_TEACH_PREFS'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request REFRESH all PROF TEACH PREFS")
    
            DB.getTeachPrefs().then((payload) => {
                console.log("DATABASE LOG--> Successfully returned the following CAN TEACH PREFS rows\n" + payload.data + "\n\n");
                mainWindow.webContents.send('fromMain:Prefs', payload.data);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR returning CAN TEACH PREFS: ' + error + + '\n');
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
            console.log(args);
            DB.createRoom(args.roomNumber, args.capacity, args.building).then((payload) => {
                console.log("DATABASE LOG--> Successfully created ROOM\n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Room added successfully!",
                    id: payload.data.room_id
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
        else if(args.request === 'UPDATE'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request UPDATE a ROOM")
    
            DB.updateRoom(args.roomId, args.roomNum, args.capacity, args.building).then((payload) => {
                console.log("DATABASE LOG--> Successfully updated ROOM with room id: " + args.roomId + "\n");

                let _payload = {
                    status: 'SUCCESS',
                    message: "Room updated successfully!",
                    roomId: payload.data.roomId
                };

                mainWindow.webContents.send('fromMain:Room', _payload);
            }).catch((error) => {
                console.log('!!!DATABASE LOG--> ERROR updating room: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to update room.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Room', _payload);
            });
        }

    });
}

/**
 * This function creates a database channel for Times.
 */
 function addTimeChannel(){
    // Get all Courses
    ipcMain.on("toMain:Time", (event, args) => {
        if(args.request === 'REFRESH'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request REFRESH all TIMES")
    
            DB.getTimes().then((payload) => {
                console.log("DATABASE LOG--> Successfully returned the following TIME rows\n" + payload.data + "\n");
                mainWindow.webContents.send('fromMain:Time', payload.data);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR returning TIMES: ' + error + + '\n');
            });
        }
    });
}

const prompt = require('electron-prompt');
/**
 * This function creates a database channel for all modal windows.
 */
function addModalWindows(){
// Get all Rooms
    ipcMain.on("toMain:Modal", (event, args) => {

        if(args.request === 'COURSE_SECTIONS'){
            console.log("MODAL WINDOW LOG --> " + args.message)
            console.log("MODAL WINDOW LOG --> " + "Prompting user for number of sections")
            prompt({
                title: 'Course Sections',
                label: 'Enter number of Courses for ' + args.program + ' ' + args.number ,
                value: 0,
                type: 'select',
                selectOptions: {
                    '0': 0,
                    '1': 1,
                    '2': 2,
                    '3': 3,
                    '4': 4,
                    '5': 5,
                    '6': 6,
                    '7': 7,
                    '8': 8,
                    '9': 9,
                    '10': 10
                }
            }, mainWindow)
            .then((response) => {
                if(response === null || response == 0) {
                    mainWindow.webContents.send('fromMain:Modal', "CANCEL");
                } else {
                    console.log("MODAL WINDOW LOG --> User entered: " + response)
                    mainWindow.webContents.send('fromMain:Modal', response);
                }
            })
        }
        else if(args.request === "ADD_PLAN") {
            newPlanDialogue.close();
            console.log("MODAL WINDOW LOG --> " + args.message)
            console.log("MODAL WINDOW LOG --> " + "Adding plan to database")

            //console.log(args);
            DB.createPlan(args.planName, args.description, args.year, args.semester).then((payload) => {
                console.error('Successfully create PLAN with id: ' + payload.data.plan_id + '\n');
                console.error(payload);
                let _payload = {
                    status: 'SUCCESS',
                    message: "Plan created successfully!",
                    id: payload.data.plan_id
                };
                

                mainWindow.webContents.send('fromMain:Modal', _payload);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR adding PLAN: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to add Plan.",
                    errorCode: error,
                    id: -1
                };

                mainWindow.webContents.send('fromMain:Modal', _payload);
            });
        }
        else if(args.request === "UPDATE_EXISTING_PLAN") {
            newPlanDialogue.close();
            console.log("MODAL WINDOW LOG --> " + args.message)
            console.log("MODAL WINDOW LOG --> " + "Updating plan in database")

            //console.log(args);
            DB.updatePlan(args.id, args.planName, args.description, args.year, args.semester).then((payload) => {
                console.error('DATABASE LOG --> Successfully updated PLAN');
                //console.error(payload);
                let _payload = {
                    status: 'SUCCESS',
                    message: 'Plan updated successfully!',
                    id: payload.data.plan_id
                };
                
                mainWindow.webContents.send('fromMain:Modal', _payload);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR updating PLAN: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to update Plan.",
                    id: -1
                };

                mainWindow.webContents.send('fromMain:Modal', _payload);
            });
        }
    });
}

/**
 * This function creates a database channel for Plans.
 */
 function addPlanChannel(){
    // Get all Rooms
    ipcMain.on("toMain:Plan", (event, args) => {
        if(args.request === 'REFRESH'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request REFRESH all PLANS")
    
            DB.getPlans().then((payload) => {
                console.log("DATABASE LOG--> Successfully returned the following PLAN rows\n" + payload.data + "\n\n");
                mainWindow.webContents.send('fromMain:Plan', payload.data);
            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR returning PLANS: ' + error + + '\n');
            });
        }
        else if(args.request === 'CREATE_MULTIPLE' && receivedCount < 1){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request CREATE MULTIPLE SECTIONS")

            receivedCount++;      
    
            DB.createMultipleSections(args.data).then((payload) => {
                console.log("DATABASE LOG--> Successfully created SECTIONS\n");
                

                let _payload = {
                    status: 'SUCCESS_CREATE',
                    message: "Schedule created successfully!",
                };

                mainWindow.webContents.send('fromMain:Plan', _payload);
                receivedCount = 0;

            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR adding SECTIONS: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to create plan.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Plan', _payload);
            });
        }
        else if(args.request === 'UPDATE_MULTIPLE' && receivedCount < 1){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request UPDATE MULTIPLE SECTIONS")
            console.log(args.data);
            receivedCount++;

            DB.updateMultipleSections(args.planId, args.data).then((payload) => {
                console.log("DATABASE LOG--> Successfully updated SECTIONS for planId: " +args.planId+ "\n");

                let _payload = {
                    status: 'SUCCESS_UPDATE',
                    message: "Schedule updated successfully!",
                };
                mainWindow.webContents.send('fromMain:Plan', _payload);
                receivedCount = 0;

            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR updating SECTIONS: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to update plan.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Plan', _payload);
            });
        }
        else if(args.request === 'DELETE_PLAN'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request DELETE section for plan: "+args.id);

            DB.deletePlan(args.id).then((payload) => {
                console.log("DATABASE LOG --> " + "Successfully deleted plan: "+args.id);
                let _payload = {
                    status: 'SUCCESS',
                    message: "Schedule deleted successfully!",
                };
                mainWindow.webContents.send('fromMain:Plan', _payload);

            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR deleting PLAN: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to delete Schedule.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:Plan', _payload);
            });
        }
    });
}

/**
 * Add a channel specific for updating and creating plans.
 */
function addUpdateAndViewPlanChannel(){
    ipcMain.on("toMain:SecondaryPlan", (event, args) => {
        if(args.request === 'SAVED_PLAN'){
            console.log("DATABASE LOG --> " + args.message)
            console.log("DATABASE LOG --> " + "Making request RETRIEVING SAVED SECTIONS for plan id: " + args.planName)

            DB.getSavedSectionByPlanId(args.planId).then((payload) => {
                console.log("DATABASE LOG--> Successfully retrieved SECTIONS\n");
                let _payload = {
                    status: 'SUCCESS',
                    message: "Plan retrieved successfully!",
                    data: payload.data,
                    planId: args.planId,
                    planName: args.planName,
                    planDescription: args.planDescription,
                    planYear: args.planYear,
                    planSemester: args.planSemester
                };
                mainWindow.webContents.send('fromMain:SecondaryPlan', _payload);

            }).catch((error) => {
                console.error('!!!DATABASE LOG--> ERROR retrieving saved SECTIONS: ' + error + '\n');
                let _payload = {
                    status: 'FAIL',
                    message: "Error! Unable to retrieve plan.",
                    errorCode: error
                };

                mainWindow.webContents.send('fromMain:SecondaryPlan', _payload);
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
    
            executeAlgorithm().then(() => {
                console.log('SOLUTION LOG --> Running algorithm...');
            })
            .catch((error) => {
                console.log('!!!SOLUTION LOG --> ERROR running algorithm: ' + error);
            })
        }

    });
}

/**
 * This function creates a database channel for Algorithms.
 */
 function addJsonChannel(){
    // Get all Programs
    ipcMain.on("toMain:Json", (event, payload) => {
        console.log("JSON LOG --> Creating json")
        console.log(payload.data);

        let tempData = JSON.stringify(payload.data);
        // let tempData = JSON.stringify(testData);
        executeAlgorithm(tempData, payload.courses, payload.rooms, payload.professors, payload.labs, payload.totalSolutions, payload.topSolutions, payload.strict);

        // let fs = require('fs');
        // fs.writeFile(path.join(__dirname, '/services/tempData.json'), tempData, (err, result) => {
        //     if(err) console.log('!!!JSON LOG --> ERROR creating json file', err);
        // });
    });
}

const getExtraFilesPath = () => {
    return path.join(process.resourcesPath, '..'); // go up one directory
};

//const exec = require('child_process').execFile;
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

/**
 * This algorithm execute the python .exe. The path of the exe is different based
 * on wether we have compiled or not. 
 * 
 * @param data - data the was sent from main-algorithm-service.js
 * @param courses - state courses.
 * @param rooms - state rooms.
 * @param professors - state professors.
 * @param labs - state labs.
 * @param totalSolutions - a commanad line argument provided to the exe that defines how many solutions we are searching.
 * @param topSolutions - a command line argument that defines the max solutions we want back.
 * @param strict - a command line argument that defines if the algorithm is strict or not.
 */
async function executeAlgorithm(data, courses, rooms, professors, labs, totalSolutions, topSolutions, strict) {
    let _payload = {
        setCourses: courses,
        setRooms: rooms,
        setProfessors: professors,
        setLabs: labs,
        totalSolutions: totalSolutions,
        topSolutions: topSolutions,
        strict: strict
    }

    if(process.platform == 'darwin'){
        console.log('SOLUTION LOG --> Running Algorithm...');
        let solution;

        if (process.env.NODE_ENV !== 'production'){
            const {stdout} = await execFile(path.join(__dirname, 'services/testPythonScript/mac/csp-ortools.exe'), [totalSolutions,topSolutions, strict, data]);
            console.log('SOLUTION LOG --> Solution:' + stdout);
            solution = JSON.parse(stdout);
        }
        else {
            const {stdout} = await execFile(path.join(process.resourcesPath, 'public/services/testPythonScript/mac/csp-ortools.exe'), [totalSolutions,topSolutions, strict, data]);
            solution = JSON.parse(stdout);
        }

        _payload.data = solution;

        mainWindow.webContents.send('fromMain:Algo', _payload);
    }
    else {
        console.log('SOLUTION LOG --> Running Algorithm...');
        let solution;

        if (process.env.NODE_ENV !== 'production'){
            const {stdout} = await execFile(path.join(__dirname, 'services/testPythonScript/windows/csp-ortools.exe'), [totalSolutions,topSolutions, strict, data]);
            console.log('SOLUTION LOG --> Solution:' + stdout);
            solution = JSON.parse(stdout);
        }
        else {
            const {stdout} = await execFile(path.join(process.resourcesPath, 'public/services/testPythonScript/windows/csp-ortools.exe'), [totalSolutions,topSolutions, strict, data]);
            solution = JSON.parse(stdout);
        }
        _payload.data = solution
        mainWindow.webContents.send('fromMain:Algo', _payload);
    }
    
}