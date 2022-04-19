/***
 * This is where all our sample data is housed.
 */

/**
 * Sample Data for Courses. Feel free to add and adjust
 */
export const sampleCourses = [
    {
        "program": "CISC",
        "number": 131,
        "name": "Intro to Programming",
        "courseID": 1234,
        "credits": 4,
        "capacity": 20
    },
    {
        "program": "CISC",
        "number": 230,
        "name": "Object Oriented Programming",
        "courseID": 1233,
        "credits": 4,
        "capacity": 20
    },
    {
        "program": "STAT",
        "number": 200,
        "name": "Statistics",
        "courseID": 1232,
        "credits": 4,
        "capacity": 20
    },
    {
        "program": "STAT",
        "number": 440,
        "name": "Data Mining",
        "courseID": 1234,
        "credits": 4,
        "capacity": 20
    }
]

export const samplePrograms = [
    {
        "id": 1,
        "name": "STAT"
    },
    {
        "id": 2,
        "name": "MATH"
    },
    {
        "id": 3,
        "name": "GEO"
    },
    {
        "id": 4,
        "name": "MUSC"
    }
]
/**
 * Sample data for labs.
 */
export const sampleLabs = [
    {
        "lname": "Intro to Programming",
        "lcourse": [{
            "program": "CISC",
            "number": 131,
            "name": "Intro to Programming",
            "courseID": 1234,
            "credits": 4,
            "capacity": 20
        }]
    }
]

/**
 * Sample data for professors.
 */
export const sampleProfessors = [
    {
        "name": "Jason Sawin",
        "program": "CISC"
    },
    {
        "name": "Sarah Miracle",
        "program": "CISC"
    },
    {
        "name": "Amelia McNamara",
        "program": "STAT"
    }
]

/**
 * Sample data for rooms.
 */
export const sampleRooms = [
    {
        "rnumber": "432",
        "rbuilding": "OSS"
    },
    {
        "rnumber": "415",
        "rbuilding": "OSS"
    },
    {
        "rnumber": "420",
        "rbuilding": "OSS"
    }  
]
export const sampleSolution = [
        {
            "name": "solution1",
            "data":[
                {
                    "professor": 1,
                    "course": 2,
                    "time": 1,
                    "room": 1
                }, 
                {
                    "professor": 1,
                    "course": 1,
                    "time": 2,
                    "room": 1
                }
            ]
        },
        {
            "name": "solution2",
            "data":[
                {
                    "professor": 1,
                    "course": 2,
                    "time": 1,
                    "room": 1
                }, 
                {
                    "professor": 1,
                    "course": 1,
                    "time": 2,
                    "room": 1
                }
            ]
        }


    
]