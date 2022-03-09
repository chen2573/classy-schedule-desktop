import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import Home from './home.js';
import CoursePage from './components/CourseAddPage.js';
import ProfessorPage from './components/ProfessorAddPage.js';
import RoomPage from './components/RoomAddPage.js'
//import Room from './room.js';
import Solution from './components/Solution.js';
import MenuBar from './components/Menubar.js';
import {createTheme, ThemeProvider} from '@mui/material';
import {sampleCourses, samplePrograms, sampleProfessors, sampleRooms} from './utils/sampleData';

/**
 * Toggle to get data from database or use sample data.
 * true - gets data from sample data.
 * false - gets data from database.
 * **Note** If you are looking at the the localhost verion of our app, it
 * will always use sample data.
 */
const DEVELOPMENT_MODE = true; // Change to true when you want to debug with dummy data.

/**
 * Constants we will use to make our database queries.
 */
const {
  FETCH_ALL_COURSE_DATA,
  FETCH_ALL_PROFESSOR_DATA,
  FETCH_ALL_ROOM_DATA
} = require('./utils/queries');


function App() {
  const [programs, setPrograms] = useState([]); //This has to be an Array for some reason.
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [rooms, setRooms] = useState([]);


  const addCourse = (course) => {
    const id = Math.floor(Math.random() * 10000) + 1;

    const newCourse = { id, ...course }
    setCourses([...courses, newCourse]);
  };
  
  const deleteCourse = (id) => {
    console.log(id);
    setCourses(courses.filter((course) => course.id !== id));
  };
  
 
  const addProfessor = (professor) => {
    const id = Math.floor(Math.random() * 10000) + 1;

    const newProfessor = { id, ...professor }
    setProfessors([...professors, newProfessor]);
  };

  const deleteProfessor = (id) => {
    console.log('delete',id);
    setProfessors(professors.filter((professor) => professor.id !== id));
  };

  const addRoom = (room) => {
    const id = Math.floor(Math.random() * 10000) + 1;

    const newRoom = { id, ...room }
    setRooms([...rooms, newRoom]);
  };

  const deleteRoom = (id) => {
    console.log('delete',id);
    setProfessors(rooms.filter((room) => room.id !== id));
  };

    /**
   * Gets the latest data for all entities when a new page is loaded.
   */
  useEffect(updateAllStates,[]);

  function updateAllStates() {
    getLatestCourses();
    getLatestProfessors();
    getLatestRooms();
  };

  /**
   * Gets the latest data for courses.
   */
  function getLatestCourses() {
      // Clears up the currently stored data and gets new data in the following code.
      // There was a bug where with every refresh, we would get duplicate state.
      //setCourses('')
      setPrograms('');

      let stateCourses = [];

      if (window.DB === undefined || DEVELOPMENT_MODE) {
        console.log('Using sample data');

        sampleCourses.map((course) => {
            let courseID = course.courseID;
            let program = course.program;
            let capacity = course.capacity;
            let number = course.number;
            let name = course.name;
            let id = Math.floor(Math.random() * 10000) + 1;

            var newCourse = {id, program, number, name, courseID, capacity};
            stateCourses.push(newCourse);
        })
        setCourses(stateCourses);
        setPrograms(samplePrograms);
      }
      else {
        console.log(FETCH_ALL_COURSE_DATA);
        // Send a query to main
        window.DB.send("toMain", FETCH_ALL_COURSE_DATA); // Add constants

        // Recieve the results
        window.DB.receive("fromMain", (dataRows) => {
          console.log(dataRows);
          console.log(typeof dataRows);

          dataRows.map( (data) => {
            let courseID = data.ClassID;
            let program = data.department;
            let department = data.department;
            let capacity = data.Capacity;
            let number = data.CourseNumber;
            let name = data.ClassName;
            const id = Math.floor(Math.random() * 10000) + 1

            let newCourse = {program, number, name, courseID, capacity}; //This needs to be the same as onAddCourse() in CourseAddPage.js

            stateCourses.push(newCourse);
          });
          setCourses(stateCourses);
          setPrograms(samplePrograms);
        });
      }
  }
  
  /**
   * Gets the latest data for professors.
   */
   function getLatestProfessors() {

    let stateProfessors = [];

    // Database team has to fix their tables.
    if (window.DB === undefined || DEVELOPMENT_MODE || true) {
      console.log('Using sample data');

      sampleProfessors.map((prof) => {
          let name = prof.name;
          let department = prof.department;
          const id = Math.floor(Math.random() * 10000) + 1;

          let newProfessor = {id, name, department};
          stateProfessors.push(newProfessor);
      });
      setProfessors(stateProfessors);
    }
    else {
      
      // Send a query to main
      window.DB.send("toMain", FETCH_ALL_PROFESSOR_DATA);

      // Recieve the results
      window.DB.receive("fromMain", (dataRows) => {
        console.log(dataRows);

        dataRows.map( (data) => {
          let name = data.ProfessorName;
          let department = '';
          const id = Math.floor(Math.random() * 10000) + 1;

          let newProf = {id, name, department};
          stateProfessors.push(newProf);
          
          
        });
        setProfessors(stateProfessors);
      });
    }
}

function getLatestRooms() {

  let stateRooms = [];

  if (window.DB === undefined || DEVELOPMENT_MODE) {
    console.log('Using sample data');

    sampleRooms.map((room) => {
      let rbuilding = room.rbuilding;
      let rnumber = room.rnumber;
      let rcapacity = room.rcapacity;
      let rtech = room.rtech;
        let id = Math.floor(Math.random() * 10000) + 1;

        var newRoom = {id, rbuilding, rnumber, rcapacity, rtech,};
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

      dataRows.map( (data) => {
        let rbuilding = data.rbuilding;
        let rnumber = data.rnumber;
        let rcapacity = data.rcapacity;
        let rtech = data.rtech;
        const id = Math.floor(Math.random() * 10000) + 1

        let newRoom = {rnumber}; 

        stateRooms.push(newRoom);
      });
      setCourses(stateRooms);
    });
  }
}
  //global styling
  const theme = createTheme({
    palette: {primary: {main: "#90a4ae", dark:'#546e7a'}, secondary: {main: "#ffffff", dark:'#cfd8dc'}}
  });

  return (
    <ThemeProvider theme={theme}>
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/course' element={<CoursePage onDelete={deleteCourse} onAddCourse={addCourse} courses={courses} programs={programs}/>} />
          <Route path='/professor' element={<ProfessorPage onDelete={deleteProfessor} onAddProfessor={addProfessor} professors={professors} />} />
          <Route path='/room' element={<RoomPage onDelete={deleteRoom} onAddRoom={addRoom} rooms={rooms} />} />
          <Route path='/schedule' element={<Solution professors={professors} courses={courses} rooms={null}/>} />
        </Routes>

        <button >SEND</button>
      </div>

      <div className='menu-container'><MenuBar/></div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
