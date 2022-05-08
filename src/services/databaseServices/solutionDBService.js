

/**
 * This function creates a plan in the database. This function will invoke a modular window to popup
 * in order for the user to enter in Plan information. Only once we create a plan, we can map our sections
 * to the plan with the createSectionsJson function.
 * 
 * @param solution - the solution that is generated from our different schedule pages. 
 * Format w dummy values=> {id: 3814, professor: 68, course: 7723, time: 10, room: 4, sectionNum: 1}
 * @param professors - the state professors
 * @param courses - the state courses.
 * @param rooms - the state times.
 */
export function createPlan(solution, professors, courses, rooms, programs) {
    let _payload = {
        request: 'NEW_PLAN'
    }

    window.DB.send("toMain:Modal", _payload);

    window.DB.receive('fromMain:Modal', (data) => {
        if(data.status === 'FAIL'){
            window.alert(data.message + '\n' + data.errorCode);
        }
        else if(data.status === 'SUCCESS'){
            let sectionJson = createSectionsJson(data.id, solution.entry, professors, courses, rooms, programs);

            let _payload = {
                request: 'CREATE_MULTIPLE',
                message: 'Renderer sending json of sections.',
                data: sectionJson
            }
            window.DB.send("toMain:Plan", _payload);

        }
        else {
            window.alert('An unexpected error occured.');
        } 
    });

    return new Promise((resolve, reject) => {
        window.DB.receive('fromMain:Plan', (data) => {
            if(data.status === 'SUCCESS') {
                window.alert(data.message);
                resolve(1);
            }
            else {
                resolve(-1);
            }
        });
    });
}

/**
 * This function update a plan in the database. This function will invoke a modular window to popup
 * in order for the user to update Plan information. Only once we update the plan, we can map our new sections
 * to the plan with the createSectionsJson function.
 * 
 * @param solution - the solution that is generated from our different schedule pages. 
 * Format w dummy values=> {id: 3814, professor: 68, course: 7723, time: 10, room: 4, sectionNum: 1}
 * @param professors - the state professors
 * @param courses - the state courses.
 * @param rooms - the state times.
 */
 export function updatePlan(planId, planName, planDescription, planYear, planSemester, solution, professors, courses, rooms, programs) {
    let _payload = {
        request: 'UPDATE_PLAN',
        id: planId,
        name: planName,
        description: planDescription,
        year: planYear,
        semester: planSemester
    }

    window.DB.send("toMain:Modal", _payload);

    window.DB.receive('fromMain:Modal', (data) => {
        if(data.status === 'FAIL'){
            window.alert(data.message);
        }
        else if(data.status === 'SUCCESS'){
            let sectionJson = createSectionsJson(planId, solution.entry, professors, courses, rooms, programs);

            let _payload = {
                request: 'UPDATE_MULTIPLE',
                message: 'Renderer sending json of sections.',
                planId: planId,
                data: sectionJson
            }
            window.DB.send("toMain:Plan", _payload);

        }
        else {
            window.alert('An unexpected error occured.');
        } 
    });

    return new Promise((resolve, reject) => {
        window.DB.receive('fromMain:Plan', (data) => {
            if(data.status === 'SUCCESS') {
                window.alert(data.message);
                resolve(1);
            }
            else {
                resolve(-1);
            }
        });
    });
}

/**
 * 
 * @param planId - the plan id that was generated from a DB call.
 * @param solution - the solution generated from a schedule page.
 * @param professors - state professors
 * @param courses - state courses.
 * @param rooms - state rooms.
 * @param programs - state programs.
 * @returns a json that has been formated to send to the database.
 */
function createSectionsJson(planId, solution, professors, courses, rooms, programs) {
    let data = [];

    solution.forEach(section => {
        let temp = {};
        temp.section_num = parseInt(section.sectionNum);
        temp.class_num = mapCourses(section.course, courses);
        temp.dept_id = mapPrograms(section.course, courses, programs)
        temp.room_id = mapRooms(section.room, rooms);
        temp.professor_id = mapProfessors(section.professor, professors);
        temp.plan_id = planId;
        temp.section_time_slot_id = parseInt(section.time);
        data.push(temp);
    });
    return data;
}

/**
 * This function gets the course number for the course id that we provide.
 * 
 * @param targetId - the id of the courses we are looking for.
 * @param allCourses - state courses.
 * @returns the courses number for the course we specified.
 */
function mapCourses(targetId, allCourses) {
    for(let i=0; i<allCourses.length; i++) {
        if(allCourses[i].id === targetId) {
            return parseInt(allCourses[i].number);
        }
    }
}

/**
 * This function is uneccessary, but is there for consistency.
 * 
 * @param targetId - the id that we are looking for.
 * @param allProfessors - state professors
 * @returns an int of the professor id.
 */
function mapProfessors(targetId, allProfessors) {
    for(let i=0; i<allProfessors.length; i++) {
        if(allProfessors[i].id === targetId) {
            return parseInt(allProfessors[i].id);
        }
    }
}

/**
 * This function is uneccessary, but is there for consistency.
 * 
 * @param targetId - the id that we are looking for.
 * @param allRooms - state rooms
 * @returns an int of the room id.
 */
function mapRooms(targetId, allRooms) {
    for(let i=0; i<allRooms.length; i++) {
        if(allRooms[i].id === targetId) {
            return parseInt(allRooms[i].id);
        }
    }
}

/**
 * This function gets the department id of the course id we have provided.
 * 
 * @param targetId - the target id of course we are looking for.
 * @param allCourses - state courses.
 * @param allPrograms - state programs.
 * @returns the department id.
 */
function mapPrograms(targetId, allCourses, allPrograms) {
    let name;
    for(let i=0; i<allCourses.length; i++) {
        if(allCourses[i].id === targetId) {
            name = allCourses[i].program;
        }
    }

    for(let i=0; i<allPrograms.length; i++) {
        if(allPrograms[i].programName === name) {
            return parseInt(allPrograms[i].programId);
        }
    }
}