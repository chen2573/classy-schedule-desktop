/**
 * This service was created to act as a bridge between the main UI application and electron.
 * These function send requests to different channels in the electron app, which then call
 * the main-db-service to make api calls.
 * 
 * @author Anshul Bharath
 */
const {
    CHANNEL_PROFESSOR_TO_MAIN,
    CHANNEL_PROFESSOR_FROM_MAIN,
    CHANNEL_COURSE_TO_MAIN,
    CHANNEL_COURSE_FROM_MAIN,
    CHANNEL_ROOM_TO_MAIN,
    CHANNEL_ROOM_FROM_MAIN
} = require('../../utils/ipcChannels')


/**
 * Creates a professor object in the database.
 * @param professor - professor object to be created.
 * @returns a promise that resolves the status.
 */
export function createProfessor(professor){
    let _payload = {
        request: 'CREATE',
        message: 'Renderer CREATE Professor',
        firstName: professor.firstName,
        lastName: professor.lastName,
        teachLoad: professor.teachLoad,
        email: professor.email
    };
    
    // Send a query to main
    window.DB.send(CHANNEL_PROFESSOR_TO_MAIN, _payload);

    return new Promise((resolve, reject) => {
        // Recieve the results
        window.DB.receive(CHANNEL_PROFESSOR_FROM_MAIN, (payload) => {
            if(payload.status === 'SUCCESS'){
                window.alert(payload.message);
                resolve(payload.profId)
            }
            else{
                window.alert(payload.message + '\n' + payload.errorCode);
                resolve(payload.status);
            }
        });
    });
}

/**
 * Updates the professor in the database.
 * @param professor - the professor object being updated. 
 * @returns a promise that resolves the result.
 */
export function updateProfessor(professor){
    let _payload = {
        request: 'UPDATE',
        message: 'Renderer UPDATE Professor',
        id: professor.id,
        firstName: professor.firstName,
        lastName: professor.lastName,
        teachLoad: professor.teachLoad,
        email: professor.email
    };
    
    // Send a query to main
    window.DB.send(CHANNEL_PROFESSOR_TO_MAIN, _payload);

    // Recieve the results
    return new Promise((resolve, reject) => {
        window.DB.receive(CHANNEL_PROFESSOR_FROM_MAIN, (payload) => {
            if(payload.status === 'SUCCESS'){
                window.alert(payload.message);
                resolve(true);
            }
            else{
                window.alert(payload.message + '\n' + payload.errorCode);
                resolve(false);
            }
        });
    });
}

/**
 * Deletes a professor from the database.
 * @param professorId - the id of the professor to be deleted.
 */
export function deleteProfessor(professorId) {
    let _payload = {
        request: 'DELETE',
        message: 'Renderer DELETE Professor',
        profId: professorId
    };

    // Send a query to main
    window.DB.send(CHANNEL_PROFESSOR_TO_MAIN, _payload);
    
    return new Promise((resolve, reject) => {
        // Recieve the results
        window.DB.receive(CHANNEL_PROFESSOR_FROM_MAIN, (payload) => {
            console.log(payload);
            if(payload.status === 'SUCCESS') {
                window.alert(payload.message);
                resolve(true);
            } 
            else if(payload.status === 'FAIL') {
                window.alert(payload.message + '\n' + payload.errorCode);
                resolve(false);
            }
            else {
                reject('Professor still being processed. Please wait to delete')
            }
        });
    });
}

/**
 * Creates a course object in the database.
 * @param course - a course object to be created.
 * @param programId - the program of the course.
 */
export function createCourse(course, programId){
    let _payload = {
        request: 'CREATE',
        message: 'Renderer CREATE Course',
        courseNum: course.number,
        deptId: programId,
        courseName: course.name,
        capacity: course.capacity,
        credits: course.credits,
        isLab: course.lab,
        numSections: course.sections
    }; 
    
    // Send a query to main
    window.DB.send(CHANNEL_COURSE_TO_MAIN, _payload);

    return new Promise((resolve, reject) => {
        // Recieve the results
        window.DB.receive(CHANNEL_COURSE_FROM_MAIN, (payload) => {
            if(payload.status === 'SUCCESS'){
                window.alert(payload.message);
                resolve(payload.id);
            }
            else{
                window.alert(payload.message + '\n' + payload.errorCode);
                resolve(-1);
            }
        });
    });

}

/**
 * Deletes a course object in the database.
 * @param courseId - the id of the course being deleted.
 */
export function deleteCourse(courseId) {
    let _payload = {
        request: 'DELETE',
        message: 'Renderer DELETE Course',
        id: courseId
    };
    console.log(_payload)

    // Send a query to main
    window.DB.send(CHANNEL_COURSE_TO_MAIN, _payload);
    
    return new Promise((resolve, reject) => {
        // Recieve the results
        window.DB.receive(CHANNEL_COURSE_FROM_MAIN, (data) => {
            if(data.status === 'SUCCESS') {
                window.alert(data.message);
                resolve(true);
            } 
            else if(data.status === 'FAIL') {
                window.alert(data.message + '\n' + data.errorCode);
                resolve(false);
            }
        });
    });
}

/**
 * Updates a course in the database.
 * @param course - the course object being updated.
 * @param programId - the program of the course being udpated
 */
export function updateCourse(course, programId) {
    let _payload = {
        request: 'UPDATE',
        message: 'Renderer UPDATE Course',
        id: course.id,
        number: course.number,
        deptId: programId,
        name: course.name,
        capacity: course.capacity,
        credits: course.capacity,
        isLab: course.lab,
        numSections: course.sections
    };
    
    // Send a query to main
    window.DB.send(CHANNEL_COURSE_TO_MAIN, _payload);

    // Recieve the results
    return new Promise((resolve, reject) => {
        window.DB.receive(CHANNEL_COURSE_FROM_MAIN, (payload) => {
            if(payload.status === 'SUCCESS'){
                window.alert(payload.message);
                resolve(true);
            }
            else{
                window.alert(payload.message + '\n' + payload.errorCode);
                resolve(false);
            }
        });
    });
}

/**
 * Creates a new room.
 * @param room - the new room object to be added.
 */
export function createRoom(room){
    let _payload = {
        request: 'CREATE',
        message: 'Renderer CREATE Room',
        roomNumber: room.number,
        capacity: room.capacity,
        building: room.building
    };
    
    // Send a query to main
    window.DB.send(CHANNEL_ROOM_TO_MAIN, _payload);

    return new Promise((resolve, reject) => {
        // Recieve the results
        window.DB.receive(CHANNEL_ROOM_FROM_MAIN, (payload) => {
            if(payload.status === 'SUCCESS'){
                window.alert(payload.message);
                resolve(payload.id);
            }
            else{
                window.alert(payload.message + '\n' + payload.errorCode);
                resolve(payload.status);
            }
        });
    });
}

/**
 * Deletes a room.
 * @param roomId - the id of the room being deleted.
 */
export function deleteRoom(roomId) {
    let _payload = {
        request: 'DELETE',
        message: 'Renderer DELETE Room',
        roomId: roomId
    };

    // Send a query to main
    window.DB.send(CHANNEL_ROOM_TO_MAIN, _payload);
    
    return new Promise((resolve, reject) => {
        // Recieve the results
        window.DB.receive(CHANNEL_ROOM_FROM_MAIN, (payload) => {
            if(payload.status === 'SUCCESS') {
                window.alert(payload.message);
                resolve(true);
            } 
            else if(payload.status === 'FAIL') {
                window.alert(payload.message + '\n' + payload.errorCode);
                resolve(false);
            }
            else {
                reject('Room still being processed. Please wait to delete')
            }
        });
    });
}

/**
 * Updates a room object.
 * @param room - the room being updated.
 */
export function updateRoom(room) {
    let _payload = {
        request: 'UPDATE',
        message: 'Renderer UPDATE Room',
        roomId: room.id,
        roomNum: room.number,
        capacity: room.capacity,
        building: room.building
    };

    // Send a query to main
    window.DB.send(CHANNEL_ROOM_TO_MAIN, _payload);
    
    return new Promise((resolve, reject) => {
        // Recieve the results
        window.DB.receive(CHANNEL_ROOM_FROM_MAIN, (payload) => {
            if(payload.status === 'SUCCESS') {
                window.alert(payload.message);
                resolve(true);
            } 
            else if(payload.status === 'FAIL') {
                window.alert(payload.message + '\n' + payload.errorCode);
                resolve(false);
            }
            else {
                reject('Room still being processed. Please wait to delete')
            }
        });
    });
}
