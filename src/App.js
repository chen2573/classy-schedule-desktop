import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import Home from './home.js';
import Course from './components/Course.js';
import Professor from './professor.js';
import Room from './room.js';
import Solution from './solution.js';



function App() {
   const [courses, setCourse] = useState([])

   const addCourse = (course) => {
       const id = Math.floor(Math.random() * 10000) + 1

        const newCourse = { id, ...course}
        setCourse([...courses, newCourse])
   }
  
    return (
    <Router>
      <div className="App">
        <Home/>
        <Routes>
          <Route path='/course' element={<Course onAddCourse={addCourse}/>} />
          <Route path='/professor' element={<Professor/>} />
          <Route path='/room' element={<Room/>} />
          <Route path='/schedule' element={<Solution/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
