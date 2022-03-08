import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './assets/styles/App.css';
import Home from './home.js';
import CoursePage from './components/CourseAddPage.js';
import ProfessorPage from './components/ProfessorAddPage.js';
import Room from './room.js';
import Solution from './components/Solution.js';
import MenuBar from './components/Menubar.js';
import {createTheme, ThemeProvider} from '@mui/material';
import {sampleCourses, samplePrograms} from './utils/sampleData'

const DEVELOPMENT_MODE = true; // Change to true when you want to debug with dummy data.


function App() {
  const [programs, setPrograms] = useState([]) //This has to be an Array for some reason.
  const [courses, setCourses] = useState([])
  const [professors, setProfessors] = useState([])


  const addCourse = (course) => {
    const id = Math.floor(Math.random() * 10000) + 1

    const newCourse = { id, ...course }
    setCourses([...courses, newCourse])
  }
  
  const deleteCourse = (id) => {
    console.log(id);
    setCourses(courses.filter((course) => course.id !== id))
  }
  
 
  const addProfessor = (professor) => {
    const id = Math.floor(Math.random() * 10000) + 1

    const newProfessor = { id, ...professor }
    setProfessors([...professors, newProfessor])
  }

  const deleteProfessor = (id) => {
    console.log('delete',id)
  }

    /**
   * Initial refresh of course data from both database and sample data.
   */
  useEffect(() => {
      // Clears up the currently stored data and gets new data in the following code.
      // There was a bug where with every refresh, we would get duplicate state.
      //setCourses('')
      setPrograms('')

      if (window.DB === undefined || DEVELOPMENT_MODE) {
        console.log('Using dummy data')

        console.log(typeof sampleCourses)
        console.log(sampleCourses)

        for (let key in sampleCourses){
            let courseID = sampleCourses[key].courseID;
            let program = sampleCourses[key].program;
            let capacity = sampleCourses[key].capacity;
            let number = sampleCourses[key].number;
            let name = sampleCourses[key].name;
            let id = Math.floor(Math.random() * 10000) + 1

            var newCourse = {id, program, number, name, courseID, capacity};
            setCourses([...courses, newCourse])
        }
        
        // sampleCourses.forEach(data => {
        //   var courseID = data["courseID"];
        //   var program = data["program"];
        //   var capacity = data["capacity"];
        //   var number = data["number"];
        //   var name = data["name"];
        //   const id = Math.floor(Math.random() * 10000) + 1

        //   const newCourse = {id, program, number, name, courseID, capacity}; //This needs to be the same as onAddCourse() in CourseAddPage.js
        //   setCourses([...courses, newCourse])
        // })
        setPrograms(samplePrograms)
      }
      else {
        // Send a query to main
        window.DB.send("toMain", "some data");

        // Recieve the results
        window.DB.receive("fromMain", (dataRows) => {
          console.log(dataRows);
          console.log(typeof dataRows);

          dataRows.forEach(data => {
            var courseID = data.ClassID;
            var program = data.department;
            var department = data.department;
            var capacity = data.Capacity;
            var number = data.CourseNumber;
            var name = data.ClassName;
            const id = Math.floor(Math.random() * 10000) + 1

            var newCourse = {program, number, name, courseID, capacity}; //This needs to be the same as onAddCourse() in CourseAddPage.js
            var newProfessor = {department, name};
            setCourses([...courses, newCourse])
            setProfessors([...professors, newProfessor])
          })
          setPrograms(samplePrograms)
        });
      }
  }, [])


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
          <Route path='/room' element={<Room />} />
          <Route path='/schedule' element={<Solution />} />
        </Routes>

        <button >SEND</button>
      </div>

      <div className='menu-container'><MenuBar/></div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
