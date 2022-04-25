
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
 * This function will create a json object that will be sent as input to our algorithm.
 * Got help from this stack overflow: https://stackoverflow.com/questions/65015651/how-to-create-a-json-object-using-javascript
 * @param courses - courses that have been selected for the algorithm.
 * @param courses - rooms that have been selected for the algorithm. 
 * @param professors - professors that have been selected for the algorithm. 
 * @param labs - labs that have been selected for the algorithm.  
 */
export function createScheduleFromData(courses, rooms, professors, labs){
    //console.log(courses);
    //The main object that will be returned back;
    let jsonObject = {};

    jsonObject.rooms = [];
    jsonObject.courses = [];
    jsonObject.labs = [];
    jsonObject.professors = [];
    jsonObject.times = [];

    //Add all rooms
    for(const key in rooms) {
        let tempRoom = {};
        
        tempRoom.id = rooms[key].id;
        tempRoom.name = rooms[key].rbuilding + ' ' + rooms[key].rnumber;
        tempRoom.capacity = rooms[key].rcapacity;
        tempRoom.tech = [];

        jsonObject.rooms.push(tempRoom);
    }

    //Add all courses
    for(const key in courses) {
        let tempCourse = {};
        
        tempCourse.id = courses[key].id;
        tempCourse.capacity = courses[key].capacity;
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
        tempProfessor.name = professors[key].firstName + ' ' + professors[key].lastName;
        tempProfessor.canTeach = [];
        tempProfessor.courseLoad = professors[key].teach_load;


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

    //Add temp times for now.
    let temp1 = {};
    temp1.id = 1;
    temp1.time = "MWF 8:15am";
    temp1.timeBlock = "morning";
    jsonObject.times.push(temp1);

    let temp2 = {};
    temp2.id = 2;
    temp2.time = "TR 1:30pm";
    temp2.timeBlock = "afternoon";
    jsonObject.times.push(temp2);

    let temp3 = {};
    temp3.id = 3;
    temp3.time = "MWF 10:55am";
    temp3.timeBlock = "morning";
    jsonObject.times.push(temp3);

    //Sends data to electron to run algorithm
    window.DB.send('toMain:Json', jsonObject);

    return jsonObject;
}