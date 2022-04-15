import { sampleProfessors } from '../../utils/sampleData';
const {
    CHANNEL_PROFESSOR_TO_MAIN,
    CHANNEL_PROFESSOR_FROM_MAIN,
    CHANNEL_COURSE_TO_MAIN,
    CHANNEL_COURSE_FROM_MAIN
} = require('../../utils/ipcChannels')


export function createProfessor(professor){
    let _payload = {
        request: 'CREATE',
        message: 'Renderer CREATE Professor',
        firstName: professor.name,
        lastName: professor.name,
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

    // Recieve the results
    window.DB.receive(CHANNEL_COURSE_FROM_MAIN, (payload) => {
        if(payload.status === 'SUCCESS'){
            window.alert(payload.message);
            return payload.profId
        }
        else{
            window.alert(payload.message + '\n' + payload.errorCode);
        }
    });
}

export function deleteCourse(courseNum) {
    let _payload = {
        request: 'DELETE',
        message: 'Renderer DELETE Course',
        classNum: courseNum
    };

    // Send a query to main
    window.DB.send(CHANNEL_COURSE_TO_MAIN, _payload);
    
    return new Promise((resolve, reject) => {
        // Recieve the results
        window.DB.receive(CHANNEL_COURSE_FROM_MAIN, (payload) => {
            if(payload.status === 'SUCCESS') {
                window.alert(payload.message);
                resolve(true);
            } 
            else if(payload.status === 'FAIL') {
                window.alert(payload.message + '\n' + payload.errorCode);
                resolve(false);
            }
        });
    });
}
