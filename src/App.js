import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import HomePage from './components/HomePage.js';
import CoursePage from './components/CourseAddPage.js';
import LabPage from './components/LabAddPage.js';
import ProfessorPage from './components/ProfessorAddPage.js';
import RoomPage from './components/RoomAddPage.js'
import SolutionPage from './components/SolutionPage.js';
import MenuBar from './components/Menubar.js';
import { createTheme, ThemeProvider } from '@mui/material';
import { sampleCourses, samplePrograms, sampleLabs, sampleProfessors, sampleRooms, sampleSolution } from './utils/sampleData';
import * as DBFunction from './services/databaseServices/UIDatabaseService';

import varValueConvert from 'cross-env/src/variable';
import LabAddPage from './components/LabAddPage';
import SolutionGenerate from './components/AddSolution';
import AddSolution from './components/AddSolution.js';
import SolutionDashboard from './components/SolutionDashboard';

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
 * Constants we will use to make our database queries.
 */
const {
  FETCH_TABLE_INFO,
  FETCH_ALL_PROGRAM_DATA,
  FETCH_ALL_COURSE_DATA,
  FETCH_ALL_PROFESSOR_DATA,
  FETCH_ALL_ROOM_DATA,
  FETCH_ALL_LAB_DATA
} = require('./utils/queries');

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
  CHANNEL_LAB_FROM_MAIN
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
  const [solutions, setSolutions] = useState([]);

  /**
   * Adds a course. This method is passed down through the components.
   * @param course - the course that will be added. 
   */
  const addCourse = (course) => {
    //BUG: Database has changed their scheme for departments, so adding courses
    // in non-dev mode will cause problems.
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
      var programId = programIdArray[0].programId;
    }

    const newCourse = { programId, ...course }
    console.log(newCourse);
    setCourses([...courses, newCourse]);

    if (!USE_DATABASE) {
      
      //let query = createSqlQuery('Add', newCourse.programId, newCourse.number, newCourse.name, newCourse.credits, newCourse.capacity);
      //window.DB.send(CHANNEL_COURSE_TO_MAIN, query);
    }
  };

  /**
   * Deletes a course. This method is passed down through the components.
   * @param id - the id of the course that is being deleted 
   */
  const deleteCourse = (id) => {
    console.log(id);
    setCourses(courses.filter((course) => course.id !== id));
  };

  /**
   * Adds a professor to the local state or to the DB if in production.
   * @param professor - the professor object that is being added. 
   */
  const addProfessor = (professor) => {
    let id;
    let newProfessor;
    
    if(USE_DATABASE){
      id = DBFunction.createProfessor(professor);
      newProfessor = { id, ...professor }
    }
    else{
      id = Math.floor(Math.random() * 10000) + 1;
      newProfessor = { id, ...professor }
    }
    setProfessors([...professors, newProfessor]);
  };

  /**
   * Deletes a professor from the local state or from the DB if in production.
   * @param id - the professor id that is being deleted. 
   */
  const deleteProfessor = (id) => {
    getLatestProfessors();

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
   * Adds a room to the local state or to the DB if in production.
   * @param room - the room object that is being added. 
   */
  const addRoom = (room) => {
    const id = Math.floor(Math.random() * 10000) + 1;

    const newRoom = { id, ...room }
    setRooms([...rooms, newRoom]);
  };

  /**
   * Deletes a room from the local state or from the DB if in production.
   * @param id - the room id that is being deleted. 
   */
  const deleteRoom = (id) => {
    console.log('delete', id);
    setRooms(rooms.filter((room) => room.id !== id));
  };

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

  /**
   * Gets the latest data for all the states and refreshes the cooresponding states.
   */
   const updateAllStates = () => {
    getLatestPrograms();
    getLatestCourses();
    getLatestProfessors();
    getLatestRooms();
    getLatestLabs();
    getLatestSolutions();
  };

  /**
   * Gets the latest data for programs.
   */
   const getLatestSolutions = () => {
    // Clears up the currently stored data and gets new data in the following code.
    // There was a bug where with every refresh, we would get duplicate state.
    //setCourses('')
    let stateSolutions = [];

    if (window.DB === undefined && USE_DATABASE) {
      console.log('Using sample data');

      sampleSolution.map((solution) => {
        let name = solution.name;
        let course = solution.course;
        let professor = solution.professor;
        let time = solution.time;
        let room = solution.room;
        const id = Math.floor(Math.random() * 10000) + 1

        let newSolution = { id, name, course, professor, time, room };
        stateSolutions.push(newSolution);
      });
      setSolutions(stateSolutions);
    }
    // else {
    //   //console.log(FETCH_ALL_PROGRAM_DATA);
    //   // Send a query to main
    //   window.DB.send(CHANNEL_PROGRAM_TO_MAIN, "Request for PROGRAMS from RENDERER"); // Add constants

    //   // Recieve the results
    //   window.DB.receive(CHANNEL_PROGRAM_FROM_MAIN, (dataRows) => {
    //     //console.log(dataRows);

    //     dataRows.map((program) => {
    //       let programId = program.dept_id;
    //       let programName = program.dept_name;
    //       const id = Math.floor(Math.random() * 10000) + 1;

    //       let newProgram = { id, programId, programName };
    //       statePrograms.push(newProgram);
    //     });
    //     setPrograms(statePrograms);
    //   });
    // }
  }
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

  /**
   * Gets the latest data for courses.
   */
  const getLatestCourses = () => {
    // Clears up the currently stored data and gets new data in the following code.
    // There was a bug where with every refresh, we would get duplicate state.
    //setCourses('')
    let stateCourses = [];

    if (window.DB === undefined || USE_DATABASE) {
      console.log('Using sample data');

      sampleCourses.map((course) => {
        let courseID = course.courseID;
        let program = course.program;
        let capacity = course.capacity;
        let number = course.number;
        let name = course.name;
        let credits = course.credits;
        let id = Math.floor(Math.random() * 10000) + 1;

        var newCourse = { id, program, number, name, courseID, credits, capacity };
        stateCourses.push(newCourse);
      });
      setCourses(stateCourses);
    }
    else {
      //console.log(FETCH_ALL_COURSE_DATA);
      // Send a query to main
      window.DB.send(CHANNEL_COURSE_TO_MAIN, FETCH_ALL_COURSE_DATA); // Add constants

      // Recieve the results
      window.DB.receive(CHANNEL_COURSE_FROM_MAIN, (dataRows) => {
        //console.log(dataRows);
        //console.log(typeof dataRows);

        dataRows.map((data) => {
          let courseID = data.ClassID;
          let program = data.dept_id;
          let capacity = data.Capacity;
          let number = data.class_num;
          let credits = data.credits;
          let name = data.class_name;
          const id = Math.floor(Math.random() * 10000) + 1


          let newCourse = { program, number, name, courseID, credits, capacity }; //This needs to be the same as onAddCourse() in CourseAddPage.js

          stateCourses.push(newCourse);
        });
        setCourses(stateCourses);
      });
    }
  }

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
        let name = prof.name;
        let teach_load = prof.teach_load;
        let time_block = prof.time_block;
        let can_teach = prof.can_teach;
        let want_teach = prof.want_teach;
        const id = Math.floor(Math.random() * 10000) + 1;

        let newProfessor = { id, program, name, teach_load, time_block, can_teach, want_teach };
        stateProfessors.push(newProfessor);
      });
      setProfessors(stateProfessors);
    }
    else {
      var _payload = {
        request: 'REFRESH',
        message: 'Renderer REFRESH for Professors',
      }

      // Send a query to main
      window.DB.send(CHANNEL_PROFESSOR_TO_MAIN, _payload);

      // Recieve the results
      window.DB.receive(CHANNEL_PROFESSOR_FROM_MAIN, (dataRows) => {

          dataRows.map((data) => {
              let id = data.professor_id
              let name = data.first_name;
              //let name = data.last_name;
              let teach_load = data.teach_load;
              let time_block = '';
              let can_teach = ''; 
              let want_teach = '';

              let newProf = { id, name, teach_load, time_block, can_teach, want_teach };
              stateProfessors.push(newProf);
          });

          setProfessors(stateProfessors);
      });
    }
    
  }
  
  /**
   * Get the latest room data.
   */
  const getLatestRooms = () => {

    let stateRooms = [];

    // Update when DB team has implemented tables
    if (window.DB === undefined || USE_DATABASE || true) {
      console.log('Using sample data');

      sampleRooms.map((room) => {
        let rbuilding = room.rbuilding;
        let rnumber = room.rnumber;
        let rcapacity = room.rcapacity;
        let rtech = room.rtech;
        let id = Math.floor(Math.random() * 10000) + 1;

        var newRoom = { id, rbuilding, rnumber, rcapacity, rtech, };
        stateRooms.push(newRoom);
      })
      setRooms(stateRooms);
    }
    else {
      console.log(FETCH_ALL_ROOM_DATA);

      window.DB.send("toMain", FETCH_ALL_ROOM_DATA);

      window.DB.receive("fromMain", (dataRows) => {
        console.log(dataRows);
        console.log(typeof dataRows);

        dataRows.map((data) => {
          let rbuilding = data.rbuilding;
          let rnumber = data.rnumber;
          let rcapacity = data.rcapacity;
          let rtech = data.rtech;
          const id = Math.floor(Math.random() * 10000) + 1

          let newRoom = { rnumber };

          stateRooms.push(newRoom);
        });
        setRooms(stateRooms);
      });
    }
  }

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
        let id = Math.floor(Math.random() * 10000) + 1;

        var newLab = { id, lname, lcapacity, ltech, lcourse};
        stateLabs.push(newLab);
      })
      setLabs(stateLabs);
    }
    else {
      console.log(FETCH_ALL_LAB_DATA);

      window.DB.send("toMain", FETCH_ALL_LAB_DATA);

      window.DB.receive("fromMain", (dataRows) => {
        console.log(dataRows);
        console.log(typeof dataRows);

        dataRows.map((data) => {
          let lname = data.lname;
          let lcapacity = data.lcapacity;
          let ltech = data.ltech;
          let lcourse = data.lcourse;
          const id = Math.floor(Math.random() * 10000) + 1

          let newLab = { lname };

          stateLabs.push(newLab);
        });
        setLabs(stateLabs);
      });
    }
  }
  
  /**
  * Gets the latest data for all entities when a new page is loaded. 
  * The useEffect method runs the updateAllStates method once a page is refreshed.
  */
  useEffect(updateAllStates, []);

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
      return <CoursePage onDelete={deleteCourse} onAddCourse={addCourse} courses={courses} programs={programs}/>
    }
    else if (currentPage === 'lab')
    {
      return <LabPage onDelete={deleteLab} onAddLab={addLab} labs={labs} courses={courses}/>;
    }
    else if (currentPage === 'professor')
    {
      return <ProfessorPage onDelete={deleteProfessor} onAddProfessor={addProfessor} professors={professors} courses={courses} programs={programs}/>;
    }
    else if (currentPage === 'room')
    {
      return <RoomPage onDelete={deleteRoom} onAddRoom={addRoom} rooms={rooms}/>;
    }
    else if (currentPage === 'schedule')
    {
      return <SolutionPage professors={[]} courses={[]} rooms={[]}/>;
    }
    else if(currentPage === 'AddSolution')
    {
      return <AddSolution courses={courses} rooms={rooms} professors={professors} labs={labs} setCurrentPage={setCurrentPage}/>;
    }
    else if(currentPage === 'SolutionDashboard')
    {
      return <SolutionDashboard solutions = {solutions} setCurrentPage={setCurrentPage}/>;
    }
    else
    {
      return <HomePage courses={courses} labs= {labs} professors={professors} rooms={rooms}/>;
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
