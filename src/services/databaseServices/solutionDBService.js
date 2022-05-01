

export function createPlan(solution, professors, courses, rooms) {
    let _payload = {
        request: 'NEW_PLAN'
    }

    window.DB.send("toMain:Modal", _payload);

    window.DB.receive('fromMain:Modal', (data) => {
        if(data.status === 'FAIL'){
            window.alert(data.message + '\n' + data.errorCode);
        }
        else if(data.status === 'SUCCESS'){
            let sectionJson = createSectionsJson(data.id, solution.entry, professors, courses, rooms);

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

function createSectionsJson(planId, solution, professors, courses, rooms) {
    let data = [];

    solution.forEach(section => {
        let temp = {};
        temp.section_num = 0; //Figure how to iterate section number. Maybe do this in python.
        temp.class_num = mapCourses(section.course, courses);
        temp.dept_id = 1;
        temp.room_id = mapRooms(section.room, rooms);
        temp.professor_id = mapProfessors(section.professor, professors);
        temp.plan_id = planId;
        data.push(temp);

    });
    return data;
}

function mapCourses(targetId, allCourses) {
    for(let i=0; i<allCourses.length; i++) {
        if(allCourses[i].id === targetId) {
            return parseInt(allCourses[i].number);
        }
    }
}

function mapProfessors(targetId, allProfessors) {
    for(let i=0; i<allProfessors.length; i++) {
        if(allProfessors[i].id === targetId) {
            return parseInt(allProfessors[i].id);
        }
    }
}

function mapRooms(targetId, allRooms) {
    for(let i=0; i<allRooms.length; i++) {
        if(allRooms[i].id === targetId) {
            return parseInt(allRooms[i].id);
        }
    }
}