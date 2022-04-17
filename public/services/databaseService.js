const axios = require("axios");
const API_BASE = 'https://capstonedbapi.azurewebsites.net/'

class DatabaseService {
    constructor() {
        this.authenticationToken = 'tokenInvalid';
    }
    
    authenticateUser(user, pass) {
        return axios({
            method: 'POST',
            url: API_BASE + 'user-management/authenticate',
            data: {
                'username': user,
                'password': pass
            }
        });
    }

    setAuthenticationToken(token) {
        this.authenticationToken = token;
    }

    getAuthenticationToken() {
        return this.authenticationToken;
    }

    invalidateToken() {
        this.authenticationToken = 'tokenInvalid';
    }

    // ====== Program Methods ==============
    /**
     * Gets the lates programs
     * @returns programs
     */
    getPrograms() {
        return axios({
            method: 'GET',
            url: API_BASE + 'department-management/departments',
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }

    /**
     * Adds a new program.
     * @param deptName - the name of the new department to be added.  
     */
    createProgram(deptName) {
        return axios({
            method: 'POST',
            url: API_BASE + 'department-management/departments/create',
            data: {
                'dept_name': deptName
            },
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }

    /**
     * Deletes a department
     * @param deptName - the name of the department to be deleted
     * @returns 
     */
    deleteProgram(deptName) {
        return axios({
            method: 'POST',
            url: API_BASE + 'department-management/departments/delete',
            data: {
                'dept_name': deptName
            },
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }

    // ======== Course Methods ==============
    /**
     * Get the latest courses
     * @returns courses - all courses 
     */
    getCourses() {
        return axios({
            method: 'GET',
            url: API_BASE + 'class-management/classes',
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }

    /**
     * Adds a new course
     * @param courseNum - the course number Ex. 131, 230, 231
     * @param deptId - the id associated with department
     * @param courseName - name of the course
     * @param capacity - capacity of the course
     * @param credits - number of credits the course 
     */
     createCourse(courseNum, deptId, courseName, capacity, credits) {
        return axios({
            method: 'POST',
            url: API_BASE + 'class-management/classes/create',
            data: {
                'class_num': courseNum,
                'dept_id': deptId,
                'class_name': courseName,
                'capacity': capacity,
                'credits': credits
            },
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }

    /**
     * Deletes the course with the specified course name and number.
     * @param classNum - the number of the course to be deleted.
     */
    deleteCourse(classNum) {
        return axios({
            method: 'DELETE',
            url: API_BASE + 'class-management/classes/delete/' + classNum,
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }

    // ======== Professor methods ===========
    /**
     * Get the latest professors
     * @returns professors - all professors 
     */
    getProfessors() {
        return axios({
            method: 'GET',
            url: API_BASE + 'professor-management/professors',
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }

    /**
     * Create a new professor.
     * @param firstName - professor first name.
     * @param lastName - professor last name.
     * @param teachLoad - professor teach load.
     * @returns 
     */
    createProfessor(firstName, lastName, teachLoad) {
        return axios({
            method: 'POST',
            url: API_BASE + 'professor-management/professors/create',
            data: {
                'first_name': firstName,
                'last_name': lastName,
                'teach_load': teachLoad
            },
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }

    /**
     * Deletes the professor with the specified ID.
     * @param profId - the ID of the professor that will be deleted. 
     */
    deleteProfessor(profId) {
        return axios({
            method: 'DELETE',
            url: API_BASE + 'professor-management/professors/delete/' + profId,
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    } 

    // ======== Room methods ===========
    /**
     * Gets the latest rooms.
     */
    getRooms() {
        return axios({
            method: 'GET',
            url: API_BASE + 'room-management/rooms',
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }

    /**
     * Adds a new room.
     * @param roomNum - the number of the room being added.
     * @param capacity - the capacity of the room being added.
     */
    createRoom(roomNum, capacity) {
        return axios({
            method: 'POST',
            url: API_BASE + 'room-management/rooms/create',
            data: {
                'room_num': roomNum,
                'capacity': capacity
            },
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }

    /**
     * Deletes a room
     * @param roomId - the id of the room being deleted. 
     */
    deleteRoom(roomId) {
        return axios({
            method: 'DELETE',
            url: API_BASE + 'room-management/rooms/delete/'+roomId,
            headers: {
                'accept': 'application/json',
                Authorization: this.authenticationToken
            }
        });
    }
}

/**
 * Exports the entire DataBaseService class, having access to all its functions.
 */
module.exports = DatabaseService;