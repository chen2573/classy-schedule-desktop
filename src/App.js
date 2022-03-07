import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import Home from './home.js';
import CoursePage from './components/CourseAddPage.js';
import Professor from './professor.js';
import Room from './room.js';
import Solution from './solution.js';
import MenuBar from './components/Menubar.js';
import {createTheme, ThemeProvider} from '@mui/material';

const DEVELOPMENT_MODE = false; // Change to true when you want to debug with dummy data.

function App() {
  const [courses, setCourses] = useState([])
  

  const addCourse = (course) => {
    const id = Math.floor(Math.random() * 10000) + 1

    const newCourse = { id, ...course }
    setCourses([...courses, newCourse])
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
          var id = data.ClassId;
          var program = data.ClassName;
          var courseCapacity = data.Capacity;
          var number = data.CourseNumber;

          var newCourse = {program, number}; //This needs to be the same as onAddCourse() in CourseAddPage.js
          setCourses([...courses, newCourse])
        })
      });
    }
  }


  //global styling
  const theme = createTheme({
    palette: {primary: {main: "#90a4ae"}, secondary: {main: "#ffffff"}}
  });

  return (
    <ThemeProvider theme={theme}>
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/course' element={<CoursePage onAddCourse={addCourse} courses={courses} />} />
          <Route path='/professor' element={<Professor />} />
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
