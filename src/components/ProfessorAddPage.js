import { ListItem } from '@mui/material'
//import { AsyncTaskManager } from 'builder-util'
import { React, useState } from 'react'
import {FaTimes} from 'react-icons/fa'

/**
 * This component represents the form that will be used by the user to enter in new professor data.
 * @param onAddProfessor - the addSubmit function that is passed down from App.js
 */
const ProfessorAdd = ({onAddProfessor}) => {
  const [department, setDepartment] = useState('')
  const [name, setName] = useState('')
  const [teach_load, setTeachLoad] = useState('')
  const [length, setLength] = useState('')
  const [days, setDays] = useState('')

  const onSubmit = (e) => {
      e.preventDefault()

      if (!department) {
          alert('Please enter a progrom')
          return
      }
      if (!name) {
          alert('Please enter a professor name')
          return
      }
      if (!teach_load) {
          alert('Please enter desired teach load')
        return
      }
      // if (!length) {
      //     alert('Please enter a meeting time')
      //     return
      // }
      // if (!days) {
      //     alert('Please enter the days the will be meeting')
      //     return
      // }


      onAddProfessor({department,name})

      setDepartment('')
      setName('')
      // Find a way to set the default value of teach load to 6
  }


  return (
      <div className='container'>
          <h2>Add A Professor</h2>
          <form onSubmit={onSubmit}>
              <div className='form-control'>
                  <label>Department</label>
                  <select onChange={(e) => setDepartment(e.target.value)}>
                      <option value=""></option>
                      <option value="cisc">CISC</option>
                      <option value="stat">STAT</option>
                      <option value="math">MATH</option>
                  </select>
              </div>

              <div className='form-control'>
                  <label>Professor Name</label>
                  <input type="text" placeholder='Enter professor name' value={name} onChange={(e) => setName(e.target.value)}/>
              </div>

              <div className='form-control'>
                  <label>Teach Load</label>
                  <input type="number" placeholder='Enter desired teach load' value={teach_load} onChange={(e) => setTeachLoad(e.target.value)}/>
              </div>

              <div className='form-control'>
                  <label>Meeting Length</label>
                  <input type="number" placeholder='Enter length of professor' value={length} onChange={(e) => setLength(e.target.value)}/>
              </div>
              <input type="submit" value='Save Professor' className='btn btn-block'/>
          </form>
      </div>
  );
}

/**
 * This component is a view that lists out individual ProfessorListItems.
 * @param professors - The state of professors that is passed down from App.js
 */
const ProfessorList = ({professors, onDelete}) => {
  return (
    <div className='container'>
    {professors.map((currentProfessor, index) => (
        <ProfessorListItem key={index} professor={currentProfessor}
        onDelete={onDelete}/>
    ))}
    </div>
  )
}


/**
 * The component that will display an individual professor. These components will populate the ProfessorList component.
 * @param professor - an individual professor
 */
const ProfessorListItem = ({professor, onDelete}) => {
  return (
    <div className='item'>
        <h3>{professor.name} <FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(professor.id)} /></h3>
        {/* This stuff in the paragraph tag will become popover*/}
        <p>Department: {professor.department}<br></br></p>
    </div>
  )
}

/**
 * The that will be exported. This page will have an Add form and list the Professors that have been added and
 * the professors that are in the database.
 * @param onAddProfessor - the function 'addProfessor' from App.js that will fire when the ProfessorAddPage is submitted
 * @param professors - the state of professors passed from App.js
 */
const ProfessorAddPage = ({onAddProfessor, professors, onDelete}) => {
  return (
    <div>
        <div className='element-page'>
            <ProfessorAdd onAddProfessor={onAddProfessor}/>
            <ProfessorList onDelete={onDelete} professors={professors}/>
        </div>
    </div>
  )
}

export default ProfessorAddPage