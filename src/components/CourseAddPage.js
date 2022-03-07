import { React, useState } from 'react'

/**
 * This component represents the form that will be used by the user to enter in new course data.
 * @param onAddCourse - the addSubmit function that is passed down from App.js
 */
const CourseAdd = ({onAddCourse}) => {
  const [program, setProgram] = useState('')
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [credits, setCredits] = useState('')
  const [capacity, setCapacity] = useState('')
  const [length, setLength] = useState('')
  const [days, setDays] = useState('')
  const [tech, setTech] = useState('')
  const [lab, setLab] = useState(false)

  const onSubmit = (e) => {
      e.preventDefault()

      if (!program) {
          alert('Please enter a progrom')
          return
      }
      if (!number) {
          alert('Please enter the course number')
          return
      }
      // if (!name) {
      //     alert('Please enter a course name')
      //     return
      // }
      // if (!credits) {
      //     alert('Please enter the number of credits')
      //     return
      // }
      // if (!capacity) {
      //     alert('Please enter the course capacity')
      //     return
      // }
      // if (!length) {
      //     alert('Please enter a course meeting time')
      //     return
      // }
      // if (!days) {
      //     alert('Please enter the days the course will be meeting')
      //     return
      // }
      // if (!tech) {
      //     alert('Please enter the tecnology the course will need')
      //     return
      // }

      onAddCourse({program,number})

      setProgram('')
      setNumber('')
  }

  return (
      <div className='container'>
          <h2>Add A Class</h2>
          <form onSubmit={onSubmit}>
              <div className='form-control'>
                  <label>Program</label>
                  <select onChange={(e) => setProgram(e.target.value)}>
                      <option value=""></option>
                      <option value="stat">STAT</option>
                      <option value="cisc">CISC</option>
                      <option value="cisc">Math</option>
                  </select>
              </div>

              <div className='form-control'>
                  <label>Course Number</label>
                  <input type="number" placeholder='Enter course number' value={number} onChange={(e) => setNumber(e.target.value)}/>
              </div>

              <div className='form-control'>
                  <label>Course Name</label>
                  <input type="text" placeholder='Enter course name' value={name} onChange={(e) => setName(e.target.value)}/>
              </div>

              <div className='form-control'>
                  <label>Credits</label>
                  <input type="number" placeholder='Enter # of credits' value={credits} onChange={(e) => setCredits(e.target.value)}/>
              </div>
              
              <div className='form-control'>
                  <label>Student Capacity</label>
                  <input type="number" placeholder='Enter capacity of students' value={capacity} onChange={(e) => setCapacity(e.target.value)}/>
              </div>

              <div className='form-control'>
                  <label>Meeting Length</label>
                  <input type="number" placeholder='Enter length of course' value={length} onChange={(e) => setLength(e.target.value)}/>
              </div>

              {/* <h4>Course days</h4>

              <label for="monday">Monday
                  <input type="checkbox" id="monday" name="monday" value="monday" />
              </label>

              <label for="tuesday">Tuesday
                  <input type="checkbox" id="tuesday" name="tuesday" value="tuesday" />
              </label>

              <label for="wednesday">Wednesday
                  <input type="checkbox" id="wednesday" name="wednesday" value="wednesday" />
              </label>

              <label for="thursday">Thursday
                  <input type="checkbox" id="thursday" name="thursday" value="thursday" />
              </label>

              <label for="friday">Friday
                  <input type="checkbox" id="friday" name="cfriday" value="friday" />
              </label>

              <h4>Select Technology Needed for this Course</h4>

              <label for="desktop">Desktop Computers
                  <input type="checkbox" id="desktop" name="desktop" value="Desktop" />
              </label>

              <label for="laptop">Laptop Computers
                  <input type="checkbox" id="laptop" name="laptop" value="Laptop"/>
              </label>

              <label for="projector">Projector
                  <input type="checkbox" id="projector" name="projector" value="Projector"/>
              </label>

              <label for="whiteboard">Whiteboard
                  <input type="checkbox" id="whiteboard" name="whiteboard" value="Whiteboard" />
              </label>

              <label for="chalkboard">Chalkboard
                  <input type="checkbox" id="chalkboard" name="chalkboard" value="Chalkboard" />
              </label>

              <h4>Lab Attached</h4>

              <label for="lab">Lab Required
                  <select name="lab" id="lab">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                  </select>
              </label><br></br> */}
              <input type="submit" value='Save Course' className='btn btn-block'/>
          </form>
      </div>
  );
}

/**
 * This component is a view that lists out individual CourseListItems.
 * @param courses - The state of courses that is passed down from App.js
 */
const CourseList = ({courses}) => {
  return (
    <div className='container'>
    {courses.map((currentCourse, index) => (
        <CourseListItem key={index} course={currentCourse}/>
    ))}
    </div>
  )
}


/**
 * The component that will display an individual course. These components will populate the CourseList component.
 * @param course - an individual course
 */
const CourseListItem = ({course}) => {
  return (
    <div className='item'>
        <h3>{course.program} {course.number}</h3>
        <p>TODO</p>
    </div>
  )
}

/**
 * The that will be exported. This page will have an Add form and list the Courses that have been added and
 * the courses that are in the database.
 * @param onAddCourse - the function 'addCourse' from App.js that will fire when the CourseAddPage is submitted
 * @param courses - the state of courses passed from App.js
 */
const CourseAddPage = ({onAddCourse, courses}) => {
  return (
    <div>
        <div className='element-page'>
            <CourseAdd onAddCourse={onAddCourse}/>
            <CourseList courses={courses}/>
        </div>
    </div>
  )
}

export default CourseAddPage