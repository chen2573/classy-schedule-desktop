
export function runAlgorithm(){
    let _payload = {
        request: 'RUN',
        message: 'Renderer RUN Algorithm',
    };
    
    // Send a query to main
    window.DB.send("toMain:Algo", _payload);

    // Recieve the results
    window.DB.receive("fromMain:Algo", (payload) => {
        if(payload.status === 'SUCCESS'){
            window.alert(payload.message);
        }
        else{
            window.alert(payload.message + '\n' + payload.errorCode);
        }
    });
}

/**
 * This function will create a json object that will be used as input to our algorithm.
 * @param courses - courses that have been selected for the algorithm.
 * @param courses - rooms that have been selected for the algorithm. 
 * @param professors - professors that have been selected for the algorithm. 
 * @param labs - labs that have been selected for the algorithm.  
 */
export function createJsonData(courses, rooms, professors, labs){
    //console.log(courses);
    //The main object that will be returned back;
    let jsonObject = {};

    jsonObject.rooms = [];
    jsonObject.courses = [];
    jsonObject.labs = [];
    jsonObject.professors = [];

    //Add all rooms
    for(const key in rooms) {
        let tempRoom = {};
        
        tempRoom.id = rooms[key].id;
        tempRoom.capacity = rooms[key].rcapacity;
        tempRoom.number = rooms[key].rnumber;

        jsonObject.rooms.push(tempRoom);
    }

    //Add all courses
    for(const key in courses) {
        let tempCourse = {};
        
        tempCourse.id = courses[key].id;
        tempCourse.capacity = courses[key].rcapacity;
        tempCourse.name = courses[key].name;
        tempCourse.department = courses[key].program;
        tempCourse.number = courses[key].number;
        tempCourse.credits = courses[key].credits;
        tempCourse.sections = courses[key].sections;

        jsonObject.courses.push(tempCourse);
    }

    //Add all Professors
    for(const key in professors) {
        let tempProfessor = {};
        
        tempProfessor.id = professors[key].id;
        tempProfessor.firstName = professors[key].firstName;
        tempProfessor.lastName = professors[key].lastName;
        tempProfessor.teachLoad = professors[key].teach_load;


        jsonObject.professors.push(tempProfessor);
    }
    
    //Add all labs
    for(const key in labs) {
        let tempLab = {};
        
        tempLab.id = labs[key].id;
        tempLab.name = labs[key].lname;
        tempLab.capacity = labs[key].lcapacity;

        jsonObject.labs.push(tempLab);
    }

    return jsonObject;
}