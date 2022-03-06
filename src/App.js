import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import Home from './home.js';
import CoursePage from './components/CoursePage.js';
import Professor from './professor.js';
import Room from './room.js';
import Solution from './solution.js';
import { ClassNames } from '@emotion/react';

const DEVELOPMENT_MODE = false;

function App() {
  const [courses, setCourse] = useState([])

  const addCourse = (course) => {
    const id = Math.floor(Math.random() * 10000) + 1

    const newCourse = { id, ...course }
    setCourse([...courses, newCourse])
  }

  const testDB = () => {
    if (window.DB === undefined || DEVELOPMENT_MODE) {
      console.log('Using dummy data')
    }
    else {
      window.DB.send("toMain", "some data");

      window.DB.receive("fromMain", (data) => {
        console.log(data);
        console.log(typeof data)
        console.log(data[0].ClassName)

        for(var i=0; i<data.length; i++) {
          var course = data[i];

          var id = course.ClassId;
          var program = course.ClassName;
          var courseCapacity = course.Capacity;
          var number = course.CourseNumber;

          var newCourse = {program, number};
          setCourse([...courses, newCourse])

        }
      });
    }
  }


  return (
    <Router>
      <div className="App">
        <Home />
        <Routes>
          <Route path='/course' element={<CoursePage onAddCourse={addCourse} courses={courses} />} />
          <Route path='/professor' element={<Professor />} />
          <Route path='/room' element={<Room />} />
          <Route path='/schedule' element={<Solution />} />
        </Routes>

        <button onClick={testDB}>SEND</button>
      </div>
    </Router>
  );
}

export default App;
