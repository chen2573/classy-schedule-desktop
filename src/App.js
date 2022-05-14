import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import HomePage from './components/HomePage.js';
import CoursePage from './components/addPages/CourseAddPage.js';
import ProfessorPage from './components/addPages/ProfessorAddPage.js';
import RoomPage from './components/addPages/RoomAddPage.js'
import SolutionPage from './components/schedulePages/SolutionPage.js';
import MenuBar from './components/Menubar.js';
import { createTheme, ThemeProvider } from '@mui/material';
import { sampleCourses, samplePrograms, sampleLabs, sampleProfessors, sampleRooms, samplePlans } from './utils/sampleData';
import * as DBFunction from './services/databaseServices/appDBService';

import AddSolution from './components/schedulePages/AddSolution.js';
import SolutionDashboard from './components/schedulePages/SolutionDashboard';
import CreateSolutionPage from './components/schedulePages/CreateSolutionPage';
import ViewSolution from './components/schedulePages/ViewSolution';

/**
 * Toggle to get data from database or use sample data.
 * true - gets data from sample data.
 * false - gets data from database.
 * !!Note!! If you are looking at the the localhost verion of our app through browser, it
 * will always use sample data.
 * 
 */
const USE_DATABASE = true; // Change to true when you want to debug with dummy data.

/**
 * Constants used for ipc channels.
 */
const {
  CHANNEL_PROGRAM_TO_MAIN,
  CHANNEL_PROGRAM_FROM_MAIN,
  CHANNEL_COURSE_TO_MAIN,
  CHANNEL_COURSE_FROM_MAIN,
  CHANNEL_PROFESSOR_TO_MAIN,
  CHANNEL_PROFESSOR_FROM_MAIN,
  CHANNEL_ROOM_TO_MAIN,
  CHANNEL_ROOM_FROM_MAIN,
  CHANNEL_LAB_TO_MAIN,
  CHANNEL_LAB_FROM_MAIN,
  CHANNEL_PLAN_TO_MAIN,
  CHANNEL_PLAN_FROM_MAIN
} = require('./utils/ipcChannels')
//#endregion

/**
 * This function is the highest level of our application. It is used as a component and mounted to
 * index.js found in public/index.js. All of our database functions are found here and are used by
 * other components.
 * @returns the entire ClassySchedule application as a component.
 */
function App() {
  const [programs, setPrograms] = useState([]); //This has to be an Array for some reason.
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [labs, setLabs] = useState([]);
  const [times, setTimes] = useState([]);
  const [plans, setPlans] = useState([]);

  /**
   * Gets the latest data for all the states and refreshes the cooresponding states.
   * This function is used in the useEffect method.
   */
  const updateAllStates = () => {
    getLatestPrograms();
    getLatestCoursesLabs();
    getLatestProfessors();
    getLatestRooms();
    getLatestTimes();
    //getLatestLabs();
    getLatestPlans();
    //getLatestProfessorTeachPreferences()
  };

//================= PROGRAM/DEPARTMENT Functions ====================== 
/**
 * Gets the latest data for programs.
 */
  const getLatestPrograms = () => {
    // Clears up the currently stored data and gets new data in the following code.
    // There was a bug where with every refresh, we would get duplicate state.
    //setCourses('')
    let statePrograms = [];

    if (window.DB === undefined && USE_DATABASE) {
      console.log('Using sample data');

      samplePrograms.map((program) => {
        let programId = program.id;
        let programName = program.name;
        const id = Math.floor(Math.random() * 10000) + 1

        let newProgram = { id, programId, programName };
        statePrograms.push(newProgram);
      });
      setPrograms(statePrograms);
    }
    else {
      var _payload = {
        request: 'REFRESH',
        message: 'Request for PROGRAMS from RENDERER',
      };
      //console.log(FETCH_ALL_PROGRAM_DATA);
      // Send a query to main
      window.DB.send(CHANNEL_PROGRAM_TO_MAIN, _payload); // Add constants

      // Recieve the results
      window.DB.receive(CHANNEL_PROGRAM_FROM_MAIN, (dataRows) => {
        //console.log(dataRows);

        dataRows.map((program) => {
          let programId = program.dept_id;
          let programName = program.dept_name;
          const id = Math.floor(Math.random() * 10000) + 1;

          let newProgram = { id, programId, programName };
          statePrograms.push(newProgram);
        });
        setPrograms(statePrograms);
      });
    }
  }

  //================= COURSE Functions =================================
  /**
 * Gets the latest data for courses.
 */
  const getLatestCoursesLabs = () => {
    // Clears up the currently stored data and gets new data in the following code.
    // There was a bug where with every refresh, we would get duplicate state.
    //setCourses('')
    let stateCourses = [];
    let stateLabs = [];

    if (window.DB === undefined || !USE_DATABASE) {
      console.log('Using sample data');

      sampleCourses.map((course) => {
        let courseID = course.courseID;
        let program = course.program;
        let capacity = course.capacity;
        let number = course.number;
        let name = course.name;
        let credits = course.credits;
        let id = Math.floor(Math.random() * 10000) + 1;
        let elementClassName = "item";
        let sections = 0;

        var newCourse = { id, program, number, name, credits, capacity, elementClassName, sections };
        stateCourses.push(newCourse);
      });
      setCourses(stateCourses);
    }
    else {
      let _payload = {
        request: 'REFRESH',
        message: 'Renderer REFRESH for Courses',
      }

      // Send a query to main
      window.DB.send(CHANNEL_COURSE_TO_MAIN, _payload); // Add constants

      // Recieve the results
      window.DB.receive(CHANNEL_COURSE_FROM_MAIN, (dataRows) => {
        dataRows.map((data) => {
          //console.log(data);

          let id = data.class_id;
          let number = data.class_num;
          let program = data.dept_name;
          let capacity = data.capacity;
          let credits = data.credits;

          let name = data.class_name;

          let elementClassName = "item";
          let sections = 0; //data.num_sections
          let lab = data.is_lab;
          let deptId = data.dept_id;

          //const id = Math.floor(Math.random() * 10000) + 1;

          let newCourse = { id, program, number, name, credits, capacity, lab, elementClassName, sections }; //This needs to be the same as onAddCourse() in CourseAddPage.js

          if(!lab){
            stateCourses.push(newCourse);
          }
          else{
            stateLabs.push(newCourse);
          }
        });
        setCourses(stateCourses);
        setLabs(stateLabs);
      });
    }
  }

  /**
   * This function maps two numbers a and b to always be the same single number.
   * This is to map a unique department with course.
   * @returns int
   */
  function cantorPairing(a, b) {
    return (a + b) * (a + b + 1) / 2 + a;
  }

  /**
   * Adds a course. This method is passed down through the components.
   * @param course - the course that will be added. 
   */
  const addCourse = (course) => {
    let id;
    let newCourse;
    let programId;

    if(USE_DATABASE){
      //id = Math.floor(Math.random() * 10000) + 1;
      
      let programIdArray = programs.filter((program) => {
        if (program.programName === course.program) {
          return program.programId;
        }
      });
      console.log(programIdArray)
      if (programIdArray.length === 0){
        window.alert('Uh-oh! There is a bug here. We are working on it :)');
      }
      else {
        programId = programIdArray[0].programId;
      }
      console.log(programId);
      console.log(parseInt(course.number));
      id = cantorPairing(programId, parseInt(course.number));

      DBFunction.createCourse(course, programId).then((id) => {
        if(id != -1){
          newCourse = { id, ...course }
          setCourses([...courses, newCourse]);
        }
      }); 
    }
    else{
      id = Math.floor(Math.random() * 10000) + 1;
      newCourse = { id, ...course }
      setCourses([...courses, newCourse]);
    }
  };

  /**
   * Deletes a course. This method is passed down through the components.
   * @param id - the id of the course that is being deleted 
   */
  const deleteCourse = (id) => {
    // Confirm with user if they want to delete. This will be permenant.
    let deletedResponse = window.confirm("Are you sure you want to remove this Course?\n This will be permanent.");

    if(deletedResponse){
      //delete from database
      DBFunction.deleteCourse(id).then((shouldDeleteFromUI) => {
        if(shouldDeleteFromUI){
          //delete from UI
          setCourses(courses.filter((course) => course.id !== id));
        }
      }).catch((error) => {
        window.alert(error);
      });
    }
  };

  /**
   * Edits a course based on new information.
   * @param course - the new state course. 
   */
  const editCourse = (course) => {
    let tempCourse = courses;
    let tempPrograms = programs;

    let programName = getDepartmentName(tempCourse, course.id);
    let programId = getDepartmentId(tempPrograms, programName);

    DBFunction.updateCourse(course, programId).then(result => {
      let id = course.id;
      let stateCourses = [];

      if (result) {
        courses.map(curCourse => {
          if (curCourse.id === id) {
            stateCourses.push(course);
          } else {
            stateCourses.push(curCourse);
          }
        })
        setCourses(stateCourses);
      }
    });   
  }

/**
 * This is a helper function to get the Course name given a course id.
 * @param courseList - a list of temp course objects to iterate over
 * @param targetID - the id of the the course to search for.
 * @returns the name of the program that is specified.
 */
  function getCourseNumber(courseList, targetID) {
    for(const key in courseList) {
      if(courseList[key].id === targetID){
        return courseList[key].number;
      }
    }
  }

/**
 * This is a helper function to get the Department name given a course id.
 * @param courseList - a list of temp course objects to iterate over
 * @param targetID - the id of the the course to search for.
 * @returns the name of the program that is specified.
 */
  function getDepartmentName(courseList, targetID) {
    for(const key in courseList) {
      if(courseList[key].id === targetID){
        return courseList[key].program;
      }
    }
  }

  /**
 * This is a helper function to get the department ID given a course id.
 * @param courseList - a list of temp course objects to iterate over
 * @param targetName - the name of the the department to search for.
 * @returns the name of the program that is specified.
 */
  function getDepartmentId(programList, targetName) {
    for(const key in programList) {
      if(programList[key].programName === targetName){
        return programList[key].programId;
      }
    }
  }

  //================= PROFESSOR Functions =================================
  /**
 * Gets the latest data for professors.
 */
  const getLatestProfessors = () => {

    let stateProfessors = [];

    // Database team has to fix their tables.
    if (window.DB === undefined || !USE_DATABASE) {
      console.log('Using sample Professor data');

      sampleProfessors.map((prof) => {
        let program = prof.program;
        let firstName = prof.firstName;
        let lastName = prof.lastName;
        let teach_load = prof.teach_load;
        let time_block = prof.time_block;
        let can_teach = prof.can_teach;
        let want_teach = prof.want_teach;
        let elementClassName = 'item';
        
        const id = Math.floor(Math.random() * 10000) + 1;

        let newProfessor = { id, program, firstName, lastName, teach_load, time_block, can_teach, want_teach, elementClassName};
        stateProfessors.push(newProfessor);
      });
      setProfessors(stateProfessors);
    }
    else {
      let _payload = {
        request: 'REFRESH',
        message: 'Renderer REFRESH for Professors',
      }

      // Send a query to main
      window.DB.send(CHANNEL_PROFESSOR_TO_MAIN, _payload);

      // Recieve the results
      window.DB.receive(CHANNEL_PROFESSOR_FROM_MAIN, (dataRows) => {

          dataRows.map((data) => {
            //console.log(data);
              let id = data.professor_id
              let firstName = data.first_name;
              let lastName = data.last_name;
              let teach_load = data.teach_load;
              let email = data.user_email;
              let time_block = '';
              let can_teach = []; 
              let want_teach = [];
              let elementClassName = 'item';

              let newProf = { id, firstName, lastName, email, teach_load, time_block, can_teach, want_teach, elementClassName };
              stateProfessors.push(newProf);
          });

          setProfessors(stateProfessors);

          getLatestProfessorTeachPreferences();
      });
    }
    
  }

  /**
 * Gets the latest data for professors.
 */
  const getLatestProfessorTeachPreferences = () => {

      let stateTeachPreferences = [];
  
      
      let _payload = {
        request: 'REFRESH_TEACH_PREFS',
        message: 'Renderer REFRESH for Professors Teach Preferences',
      }

      // Send a query to main
      window.DB.send('toMain:Prefs', _payload);

      // Recieve the results
      window.DB.receive('fromMain:Prefs', (dataRows) => {
          let tempProfessorsWithPreferences = [];
          let profsIdsWithPrefs = [];
          
          dataRows.map((data) => {
            //console.log(data);
            tempProfessorsWithPreferences.push(mapTeachPrefsToProfessor(data.prof_id, data.class_preferences));
            profsIdsWithPrefs.push(data.prof_id);
          });

          //console.log(tempProfessorsWithPreferences);

          tempProfessorsWithPreferences.push.apply(tempProfessorsWithPreferences, getProfessorWithNoPreferences(profsIdsWithPrefs));
          setProfessors(tempProfessorsWithPreferences);
          //console.log(tempProfessorsWithPreferences);
      });
  }

  /**
   * This function maps teacher preferences to the professor id that is provided.
   * @param profId - the id of the professor we are mapping.
   * @param preferences - all the preferences that come from the db.
   */
  function mapTeachPrefsToProfessor(profId, preferences){
    let tempProfessors = professors;
    let canTeach = [];
    let wantTeach = [];

    for(let i=0; i<preferences.length; i++){
      if(preferences[i].can_teach){
        canTeach.push(preferences[i].class_id);
      }
      if(preferences[i].prefer_to_teach){
        wantTeach.push(preferences[i].class_id);
      }
    }

    for(const key in tempProfessors) {
      if(tempProfessors[key].id === profId){
        tempProfessors[key].can_teach = canTeach;
        tempProfessors[key].want_teach = wantTeach;

        return tempProfessors[key];
      }
    }
  }

  /**
   * This function returns an array of all the teachers that do not have any preferences saved to the DB.
   * @param professorIdWithPrefs - a list of the professor ids that already have preferences added.
   * @returns 
   */
  function getProfessorWithNoPreferences(professorIdWithPrefs) {
    let tempProfessors = professors;
    let retProfs = [];

    for(const key in tempProfessors) {
      let index = professorIdWithPrefs.indexOf(tempProfessors[key].id);

      if(index === -1){
        retProfs.push(tempProfessors[key]);
      }
    }

    return retProfs;
  }

  /**
   * Adds a professor to the local state or to the DB if in production.
   * @param professor - the professor object that is being added. 
   */
  const addProfessor = (professor) => {
    let id;
    let newProfessor;
  
    if(USE_DATABASE){
      id = DBFunction.createProfessor(professor).then((response) => {
        let id = response;
        newProfessor = { id, ...professor };
        setProfessors([...professors, newProfessor]);
      });
    }
    else{
      id = Math.floor(Math.random() * 10000) + 1;
      newProfessor = { id, ...professor }
      setProfessors([...professors, newProfessor]);
    }
    
  };

  /**
   * Deletes a professor from the local state or from the DB if in production.
   * @param id - the professor id that is being deleted. 
   */
  const deleteProfessor = (id) => {
    // Confirm with user if they want to delete. This will be permenant.
    let deletedResponse = window.confirm("Are you sure you want to remove this Professor?\n This will be permanent.");

    if(deletedResponse){
      //delete from database
      DBFunction.deleteProfessor(id).then((shouldDeleteFromUI) => {
        console.log(shouldDeleteFromUI);
        if(shouldDeleteFromUI){
          //delete from UI
          setProfessors(professors.filter((professor) => professor.id !== id));
        }
      }).catch((error) => {
        window.alert(error);
      });
    }
  };

  /**
   * Updates an existing professor.
   * @param professor - the new professor information. 
   */
  const editProfessor = (professor) => {
      DBFunction.updateProfessor(professor).then(result => {

        let id = professor.id;
        let stateProfessors = [];

        if (result) {
          professors.map(curProf => {
            if (curProf.id === id) {
              stateProfessors.push(professor);
            } else {
              stateProfessors.push(curProf);
            }
          })
          setProfessors(stateProfessors);
        }
      });      
  }

  //================= ROOM Functions =================================
  /**
   * Get the latest room data.
   */
  const getLatestRooms = () => {

    let stateRooms = [];

    // Update when DB team has implemented tables
    if (window.DB === undefined || !USE_DATABASE) {
      console.log('Using sample data');

      sampleRooms.map((room) => {
        let building = room.rbuilding;
        let number = room.rnumber;
        let capacity = room.rcapacity;
        let tech = room.rtech; 
        let id = Math.floor(Math.random() * 10000) + 1;
        let elementClassName = "item";

        let newRoom = { id, building, number, capacity, tech, elementClassName};
        stateRooms.push(newRoom);
      })
      setRooms(stateRooms);
    }
    else {
      let _payload = {
        request: 'REFRESH',
        message: 'Renderer REFRESH for Rooms',
      }

      window.DB.send(CHANNEL_ROOM_TO_MAIN, _payload);

      window.DB.receive(CHANNEL_ROOM_FROM_MAIN, (dataRows) => {
        dataRows.map((data) => {
          let id = data.room_id;
          let building = data.building_name;
          let number = data.room_num;
          let capacity = data.capacity;                              // Implement checking for tech from database
          let elementClassName = "item";

          let newRoom = { id, building, number, capacity, elementClassName};

          stateRooms.push(newRoom);
        });
        setRooms(stateRooms);
      });
    }
  }

  /**
   * Adds a room to the local state or to the DB if in production.
   * @param room - the room object that is being added. 
   */
  const addRoom = (room) => {
    let id;
    let newRoom;
    console.log(room);
    
    if(USE_DATABASE){
      DBFunction.createRoom(room).then((response) => {
        id = response;
        newRoom = { id, ...room }
        setRooms([...rooms, newRoom]);
      });
    } 
    else{
      id = Math.floor(Math.random() * 10000) + 1;
      newRoom= { id, ...room }
      setRooms([...rooms, newRoom]);
    }
    
  };

  /**
   * Deletes a room from the local state or from the DB if in production.
   * @param id - the room id that is being deleted. 
   */
  const deleteRoom = (id) => {
    console.log(id);
    console.log(rooms);
    // Confirm with user if they want to delete. This will be permenant.
    let deletedResponse = window.confirm("Are you sure you want to remove this Room?\n This will be permanent.");

    if(deletedResponse){
      //delete from database
      DBFunction.deleteRoom(id).then((shouldDeleteFromUI) => {
        if(shouldDeleteFromUI){
          //delete from UI
          setRooms(rooms.filter((room) => room.id !== id));
        }
      }).catch((error) => {
        window.alert(error);
      });
    }
  };

  //================= LAB Functions =================================
    /**
   * Get the latest lab data.
   */
  const getLatestLabs = () => {

    let stateLabs = [];

    // Update when DB team has implemented tables
    if (window.DB === undefined || USE_DATABASE || true) {
      console.log('Using sample data');

      sampleLabs.map((lab) => {
        let lname = lab.lname;
        let lcapacity = lab.lcapacity;
        let ltech = lab.ltech;
        let lcourse = lab.lcourse;
        let elementClassName = 'item';
        let id = Math.floor(Math.random() * 10000) + 1;

        var newLab = { id, lname, lcapacity, ltech, lcourse, elementClassName};
        stateLabs.push(newLab);
      })
      setLabs(stateLabs);
    }
    else {
      // console.log(FETCH_ALL_LAB_DATA);

      // window.DB.send("toMain", FETCH_ALL_LAB_DATA);

      // window.DB.receive("fromMain", (dataRows) => {
      //   console.log(dataRows);
      //   console.log(typeof dataRows);

      //   dataRows.map((data) => {
      //     let lname = data.lname;
      //     let lcapacity = data.lcapacity;
      //     let ltech = data.ltech;
      //     let lcourse = data.lcourse;
      //     const id = Math.floor(Math.random() * 10000) + 1

      //     let newLab = { lname };

      //     stateLabs.push(newLab);
      //   });
      //   setLabs(stateLabs);
      // });
    }
  }

  /**
   * Adds a lab to the local state or to the DB if in production.
   * @param lab - the lab object that is being added. 
   */
  const addLab = (lab) => {
    const id = Math.floor(Math.random() * 10000) + 1;

    const newLab = { id, ...lab }
    setLabs([...labs, newLab]);
  };

  /**
   * Deletes a lab from the local state or from the DB if in production.
   * @param id - the lab id that is being deleted. 
   */
  const deleteLab = (id) => {
    console.log('delete', id);
    setLabs(labs.filter((lab) => lab.id !== id));
  };

  //=============== TIME Function ==========================
  const getLatestTimes = () => {
    // Clears up the currently stored data and gets new data in the following code.
    // There was a bug where with every refresh, we would get duplicate state.
    //setCourses('')
    let stateTimes = [];
    //console.log(sampleSolution);
    if (window.DB === undefined || !USE_DATABASE) {
      console.log('Using sample data');

    }
    else {
      let _payload = {
        request: 'REFRESH',
        message: 'Renderer REFRESH for Times',
      }

      // Send a query to main
      window.DB.send('toMain:Time', _payload);

      // Recieve the results
      window.DB.receive('fromMain:Time', (dataRows) => {
        //console.log(dataRows)
        //console.log("PLANS: ", dataRows);
          dataRows.map((data) => {
              let id = data.id; 
              let time = data.time;
              let partOfDay = data.partOfDay;

              let newTime = { id, time, partOfDay};
              stateTimes.push(newTime);
          });

          setTimes(stateTimes);
      });
    }
  }

    /**
   * Updates an existing room.
   * @param professor - the new room information. 
   */
  const editRoom = (room) => {
    DBFunction.updateRoom(room).then(result => {

      let id = room.id;
      let stateRooms = [];

      if (result) {
        rooms.map(curRoom => {
          if (curRoom.id === id) {
            stateRooms.push(room);
          } else {
            stateRooms.push(curRoom);
          }
        })
        setRooms(stateRooms);
      }
    });      
  }

  //================= SOLUTION Functions =================================
  /**
   * Gets the latest data for programs.
   */
   const getLatestPlans = () => {
    // Clears up the currently stored data and gets new data in the following code.
    // There was a bug where with every refresh, we would get duplicate state.
    //setCourses('')
    let statePlans = [];
    //console.log(sampleSolution);
    if (window.DB === undefined || !USE_DATABASE) {
      console.log('Using sample data');

      samplePlans.map((solution) => {
        console.log(samplePlans);
        let name = solution.name;
        let data = solution.data;
        const id = Math.floor(Math.random() * 10000) + 1
        let newSolution = { id, name, data };
        statePlans.push(newSolution);
      });
      setPlans(statePlans);
    }
    else {
      let _payload = {
        request: 'REFRESH',
        message: 'Renderer REFRESH for Plans',
      }

      // Send a query to main
      window.DB.send(CHANNEL_PLAN_TO_MAIN, _payload);

      // Recieve the results
      window.DB.receive(CHANNEL_PLAN_FROM_MAIN, (dataRows) => {
        //console.log(dataRows)
        //console.log("PLANS: ", dataRows);
          dataRows.map((data) => {
              let id = data.plan_id
              let name = data.plan_name;
              let description = data.plan_description;
              let year = data.semester_year;
              let semester = data.semester_num; 

              let newPlan= { id, name, description, year, semester};
              statePlans.push(newPlan);
          });

          setPlans(statePlans);
      });
    }
  }

  /**
  * Gets the latest data for all entities when a new page is loaded. 
  * The useEffect method runs the updateAllStates method once a page is refreshed.
  */
  useEffect(updateAllStates, []); 
  
  //================= THEME and PAGE NAVIGATION =================================
  /**
   * global styling
   * This variable controls the color styling of all the MUI components
   * It can be updated to control other styling elements if needed
   * */
  const theme = createTheme({
    palette: { primary: { main: "#90a4ae", dark: '#546e7a' }, secondary: { main: "#ffffff", dark: '#cfd8dc' } }
  });

  /**
   * conditionally render pages based on the currentPage state
   * currentPage is updated by the Menubar
   */
  const [currentPage, setCurrentPage] = useState(''); //state holding the current page
  const routePages = (currentPage) =>
  {
    if (currentPage === 'course')
    {
      return <CoursePage onDelete={deleteCourse} onAddCourse={addCourse} onEditCourse={editCourse} courses={courses} programs={programs}/>
    }
    else if (currentPage === 'professor')
    {
      return <ProfessorPage onDelete={deleteProfessor} onAddProfessor={addProfessor} onEditProfessor={editProfessor} professors={professors} courses={courses} programs={programs}/>;
    }
    else if (currentPage === 'room')
    {
      return <RoomPage onDelete={deleteRoom} onEditRoom={editRoom} onAddRoom={addRoom} rooms={rooms}/>;
    }
    else if (currentPage === 'schedule')
    {
      return <SolutionPage professors={professors} courses={courses} rooms={rooms} times={times} programs={programs}/>;
    }
    else if(currentPage === 'AddSolution')
    {
      return <AddSolution courses={courses} rooms={rooms} professors={professors} labs={labs} setCurrentPage={setCurrentPage} times={times}/>;
    }
    else if(currentPage === 'CreateSchedule')
    {
      return <CreateSolutionPage professors={professors} courses={courses} rooms={rooms} times={times} programs={programs} setCurrentPage={setCurrentPage}/>;
    }
    else if (currentPage === 'UpdateSolution')
    {
      return <ViewSolution professors={professors} courses={courses} rooms={rooms} times={times} programs={programs} setCurrentPage={setCurrentPage}/>;
    }
    else if(currentPage === 'SolutionDashboard')
    {
      return <SolutionDashboard plans = {plans} setCurrentPage={setCurrentPage} getLatestPlans={getLatestPlans}/>;
    }
    else
    {
      return <HomePage courses={courses} labs= {labs} professors={professors} rooms={rooms} setCurrentPage={setCurrentPage} plans={plans} getLatestPlans={getLatestPlans}/>;
    }
  }

  
  return (
    <ThemeProvider theme={theme}>
        <div className="App">
          {routePages(currentPage)}
        </div>

        <div className='menu-container'><MenuBar setCurrentPage={setCurrentPage}/></div>
    </ThemeProvider>
  );
}

export default App;
