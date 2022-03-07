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
  const deleteCourse = (id) => {
    //const id = Math.floor(Math.random() * 10000) + 1

    //const newCourse = { id, ...course }
    //setCourses([...courses, newCourse])
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
          var capacity = data.Capacity;
          var number = data.CourseNumber;
          var name = data.ClassName;

          var newCourse = {program, number, name, courseID, capacity}; //This needs to be the same as onAddCourse() in CourseAddPage.js
          setCourses([...courses, newCourse])
        })
      });
    }
  }


  //menubar states
  const [currentPage, setCurrentPage] = useState('home');
  const handleCurrentPageUpdate = (newPage) => {setCurrentPage(newPage);} //handle current page updates from child


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
