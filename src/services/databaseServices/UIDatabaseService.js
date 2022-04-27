import { sampleProfessors } from '../../utils/sampleData';
const {
    CHANNEL_PROFESSOR_TO_MAIN,
    CHANNEL_PROFESSOR_FROM_MAIN,
    CHANNEL_COURSE_TO_MAIN,
    CHANNEL_COURSE_FROM_MAIN,
    CHANNEL_ROOM_TO_MAIN,
    CHANNEL_ROOM_FROM_MAIN
} = require('../../utils/ipcChannels')


export function createProfessor(professor){
    let _payload = {
        request: 'CREATE',
        message: 'Renderer CREATE Professor',
        firstName: professor.firstName,
        lastName: professor.lastName,
        teachLoad: professor.teach_load
    };
    
    // Send a query to main
    window.DB.send(CHANNEL_PROFESSOR_TO_MAIN, _payload);

    // Recieve the results
    window.DB.receive(CHANNEL_PROFESSOR_FROM_MAIN, (payload) => {
        if(payload.status === 'SUCCESS'){
            window.alert(payload.message);
            return payload.profId
        }
        else{
            window.alert(payload.message + '\n' + payload.errorCode);
        }
    });
}

export function updateProfessor(professor){
    let _payload = {
        request: 'UPDATE',
        message: 'Renderer UPDATE Professor',
        id: professor.id,
        firstName: professor.firstName,
        lastName: professor.lastName,
        teachLoad: professor.teach_load
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

export function createCourse(course, programId){
    let _payload = {
        request: 'CREATE',
        message: 'Renderer CREATE Course',
        courseNum: course.number,
        deptId: programId,
        courseName: course.name,
        capacity: course.capacity,
        credits: course.credits
    }; 
    
    // Send a query to main
    window.DB.send(CHANNEL_COURSE_TO_MAIN, _payload);

    return new Promise((resolve, reject) => {
        // Recieve the results
        window.DB.receive(CHANNEL_COURSE_FROM_MAIN, (payload) => {
            if(payload.status === 'SUCCESS'){
                window.alert(payload.message);
                resolve(payload.status);
            }
            else{
                window.alert(payload.message + '\n' + payload.errorCode);
                resolve(payload.status);
            }
        });
    });

}

export function deleteCourse(courseNum, departmentId) {
    let _payload = {
        request: 'DELETE',
        message: 'Renderer DELETE Course',
        classNum: courseNum,
        deptId: departmentId
    };

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

export function createRoom(room){
    let _payload = {
        request: 'CREATE',
        message: 'Renderer CREATE Room',
        roomNumber: room.rnumber,
        capacity: room.rcapacity,
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
