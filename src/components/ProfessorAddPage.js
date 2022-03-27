/**
 * ProfessorAddPage is responsible for creating an html div that allows the user to create new professor objects.
 * It will also store the entered information as state.
 * 
 * Bugs:
 *  - Getting an error about unique ids, canTeachList needs to be restructured to allow passing objects (redux store)
 *  - Find a way to set the default value of teach load to 6
 * 
 * @author Joseph Heimel
 */


import { React, useState } from 'react';
import {FaTimes} from 'react-icons/fa';


/**
 * Creates a mapped list of course names to be used dynamically on the html page
 * 
 * @param courses - State variable containing course objects
 * @returns - Mapped list of course names
 */
const CreateCourseList = ({ courses }) => {
  let canTeachList = courses.map(p => {
      return (<option key={p.id} value={p.id}>{p.name}</option>);
  });

  return (
      <>
          {canTeachList}
      </>
  );
}

/**
 * Creates a mapped list of program/department names to be used dynamically on the html page
 * 
 * @param programs - state variable containing program objects
 * @returns - Mapped list of program names
 */
const ProgramSelectItems = ({ programs }) => {
  let programsList = programs.map(p => {
      return (<option key={p.id} value={p.programName}>{p.programName}</option>);
  });

  return (
      <>
          {programsList}
      </>
  );
}

/**
 * This component represents the form that will be used by the user to enter in new professor data.
 * 
 * @param onAddProfessor - The addSubmit function that is passed down from App.js
 * @param courses - State variable containing course objects
 * @param programs - State variable containing program objects
 * @returns - React component div used to enter and submit professor information
 */
const ProfessorAdd = ({onAddProfessor, courses, programs}) => {
  const [department, setDepartment] = useState('');
  const [name, setName] = useState('');
  const [teach_load, setTeachLoad] = useState('');
  const [time_block, setTimeBlock] = useState('');
  const [can_teach, setCanTeach] = useState([]);
  const [want_teach, setWantTeach] = useState([]);

  const onSubmit = (e) => {
      e.preventDefault();
      e.target.reset();
      if (!department) {
          alert('Please enter a department');
          return;
      }
      if (!name) {
          alert('Please enter a professor name');
          return;
      }
      if (!teach_load) {
          alert('Please enter desired teach load');
        return;
      }
      if (!time_block) {
          alert('Please enter a meeting time');
          return;
      }
      if (!can_teach) {
          alert('text');
          return;
      }
      if (!want_teach) {
        alert('text');
        return;
      }

      

      onAddProfessor({department, name});

      setDepartment('');
      setName('');
      setTeachLoad('');
  }


  return (
      <div className='container'>
          <h2>Add A Professor</h2>
          <form onSubmit={onSubmit}>
              <div className='form-control'>
                  <label>Department</label>
                  <select onChange={(e) => setDepartment(e.target.value)}>
                      <option value=""></option>
                      <ProgramSelectItems programs={programs} />
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
                  <label>Preferred Time Block</label>
                  <select onChange={(e) => setTimeBlock(e.target.value)}>
                    <option value=""></option>
                    <option value="mwf_morning">MWF Morning</option>
                    <option value="mwf_afternoon">MWF Afternoon</option>
                    <option value="mwf_night">MWF Night</option>
                    <option value="tr_morning">TR Morning</option>
                    <option value="tr_afternoon">TR Afternoon</option>
                    <option value="tr_night">TR Night</option>
                  </select>
              </div>

              <div className='form-control'>
                  <label>Courses Professor Can Teach</label>
                  <select multiple={true} onChange={(e) => setCanTeach([...e.target.selectedOptions].map(option => 
                    {
                      return (<option key={option.key} value={option.value}>{option.value}</option>);
                    }))}>

                    <CreateCourseList courses={courses} />
                  </select>
              </div>

              <div className='form-control'>
                  <label>Courses Professor Want to Teach</label>
                  <select multiple={true} onChange={(e) => setWantTeach([...e.target.selectedOptions].map(option => option.value))}>
                    {can_teach}
                  </select>
              </div>

              <input type="submit" value='Save Professor' className='btn btn-block'/>
          </form>
      </div>
  );
}


/**
 * This component is a view that lists out individual ProfessorListItems.
 * 
 * @param professors - The state of professors that is passed down from App.js
 * @param onDelete - Handler function that deletes an individual item from the list
 * @returns - React component that lists viewable professor components
 */
const ProfessorList = ({professors, onDelete}) => {
  return (
    <div className='container'>
    {professors.map((currentProfessor, index) => (
        <ProfessorListItem key={index} professor={currentProfessor}
        onDelete={onDelete}/>
    ))}
    </div>
  );
}


/**
 * The component that will display an individual professor. These components will populate the ProfessorList component.
 * 
 * @param professor - An individual professor
 * @param onDelete - Handler function that deletes an individual item from the list
 * @returns - React component that displays a single professor component
 */
const ProfessorListItem = ({professor, onDelete}) => {
  return (
    <div className='item'>
        <h3>{professor.name} <FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(professor.id)} /></h3>
        {/* This stuff in the paragraph tag will become popover*/}
        <p>Department: {professor.department}<br></br></p>
    </div>
  );
}

/**
 * The that will be exported. This page will have an Add form and list the Professors that have been added and
 * the professors that are in the database.
 * 
 * @param onAddProfessor - The function 'addProfessor' from App.js that will fire when the ProfessorAddPage is submitted
 * @param professors - The state of professors passed from App.js
 * @param onDelete - Handler function that deletes an individual item from the list
 * @param courses - State variable containing course objects
 * @param programs - State variable containing program objects
 */
const ProfessorAddPage = ({onAddProfessor, professors, onDelete, courses, programs}) => {
  return (
    <div>
        <div className='element-page'>
            <ProfessorAdd onAddProfessor={onAddProfessor} courses={courses} programs={programs}/>
            <ProfessorList onDelete={onDelete} professors={professors}/>
            
        </div>
    </div>
  );
}

export default ProfessorAddPage;