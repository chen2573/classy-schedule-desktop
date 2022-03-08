import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './assets/styles/App.css';
import Home from './home.js';
import CoursePage from './components/CourseAddPage.js';
import ProfessorPage from './components/ProfessorAddPage.js';
import Room from './room.js';
import Solution from './components/Solution.js';
import MenuBar from './components/Menubar.js';
import {createTheme, ThemeProvider} from '@mui/material';

const DEVELOPMENT_MODE = false; // Change to true when you want to debug with dummy data.

function App() {
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
  const testDBQuery = () => {
    if (window.DB === undefined || DEVELOPMENT_MODE) {
      console.log('Using dummy data')
    }
    else {
      // Send a query to main
      window.DB.send("toMain", "some data");

      // Recieve the results
      window.DB.receive("fromMain", (dataRows) => {
        console.log(dataRows);

        dataRows.forEach(data => {
          var courseID = data.ClassID;
          var program = data.department;
          var department = data.department;
          var capacity = data.Capacity;
          var number = data.CourseNumber;
          var name = data.ClassName;

          var newCourse = {program, number, name, courseID, capacity}; //This needs to be the same as onAddCourse() in CourseAddPage.js
          var newProfessor = {department, name};
          setCourses([...courses, newCourse])
          setProfessors([...professors, newProfessor])
        })
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
          <Route path='/course' element={<CoursePage onDelete={deleteCourse} onAddCourse={addCourse} courses={courses} />} />
          <Route path='/professor' element={<ProfessorPage onDelete={deleteProfessor} onAddProfessor={addProfessor} professors={professors} />} />
          <Route path='/room' element={<Room />} />
          <Route path='/schedule' element={<Solution />} />
        </Routes>

        <button onClick={testDBQuery}>SEND</button>
      </div>

      <div className='menu-container'><MenuBar/></div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
