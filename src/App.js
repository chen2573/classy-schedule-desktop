import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import Home from './home.js';
import Course from './course.js';
import Professor from './professor.js';
import Room from './room.js';
import Solution from './solution.js';


function App() {
  return (
    <Router>
      <div className="App">
        <Home/>
        <Routes>
          <Route path='/course' element={<Course/>} />
          <Route path='/professor' element={<Professor/>} />
          <Route path='/room' element={<Room/>} />
          <Route path='/schedule' element={<Solution/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
