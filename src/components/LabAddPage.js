import { linkClasses, ListItem } from '@mui/material'
//import { AsyncTaskManager } from 'builder-util'
import { React, useState } from 'react'
import {FaTimes} from 'react-icons/fa'

/**
 * 
 * @param courses - 
 */
const CreateAsscoCourse = ({ courses }) => {
    let associatedCourse = courses.map(l => {
        return (<option key={l.id} value={l.name}>{l.name}</option>);
    });
  
    return (
        <>
            {associatedCourse}
        </>
    );
  }
/**
 * This component represents the form that will be used by the user to enter in new lab data.
 * @param onAddLab - the addSubmit function that is passed down from App.js
 */
const LabAdd = ({onAddLab, courses}) => {
    const [lname, setLName] = useState('')
    const [lcapacity, setLCapacity] = useState('')
    const [lprofessor, setLProfessor] = useState('')
    const [ltech, setLTech] = useState('')
    const [llength, setLLength] = useState('');
    const [ldays, setLDays] = useState('');
    const [ltimes, setLTimes] = useState('');
    const [lcourse, setLCourse] = useState('');
    const onSubmit = (e) => {
        e.preventDefault()
        e.target.reset()
        if (!lname) {
            alert('Please enter the lab name')
            return;
        }
        if (!lcapacity) {
            alert('Please enter the student capacity')
            return;
        }
        {/*
        UNCOMMENT ONCE CHECKBOX FORM IS FIXED - GLENN
        if (!ltech) {
            alert('Please enter the tech required for this lab')
            return;
        }
        */}
        {/*
        UNCOMMENT ONCE COURSE ASSOCIATION IS DETERMINED - GLENN
        if (!lcourse){
            alert('A lab must be associated with a course. Pick an existing one or create a new one before creating this lab')
            return;
        }
        */}

        onAddLab({lname, lcapacity, ltech, lcourse});
        setLName('');
        setLCapacity('');
        setLTech('');
        setLCourse('');
    }
    return (
    <div className = 'container'>
        <h1> Add Lab </h1>
        <form onSubmit={onSubmit}>
            <div className='form-control'>
            <label> Name:</label>
                <input type="text" placeholder="Enter the name of the Lab" value={lname} 
                onChange={(e)=> setLName(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>Lab Capacity:</label>
                    <input type="number" placeholder= "Enter the Lab Capacity" value={lcapacity} 
                    onChange={(e)=> setLCapacity(e.target.value)}/>
            </div>
            <h4>Select Technology Required for this Lab</h4>
            <div className='form-control'>
                <select multiple={true} onChange={(e) => setLTech([...e.target.selectedOptions].map(option => option.value))}>
                    <option >Desktop Computers</option>
                    <option >Laptop Computers</option>
                    <option >Projector</option>
                    <option >Whiteboard</option>
                    <option >Chalkboard</option>
                    <option >Robots</option>
                    <option >Zoom peripherals</option>
                    <option >Instrucor Computer</option>
                    <option >Net Controls</option>

                </select>       
            </div>
            <div className='form-control'>
                <label>Associated Course:</label>
                <select onChange={(e) => setLCourse([...e.target.selectedOptions].map(option => 
                    {
                      return (<option key={option.key} value={option.value}>{option.value}</option>);
                    }))}>

                    <CreateAsscoCourse courses={courses} />
                  </select>
            </div>
            <input type="submit" value='Save Lab' className='btn btn-block'/>
            </form>
        </div>
    );
}
    /**
 * This component is a view that lists out individual LabListItems.
 * @param labs - The state of labs that is passed down from App.js
 */
const LabList = ({labs, onDelete}) => {
    return(
    <div className='container'>
    {labs.map((currentLab, index) => (
        <LabListItem key={index} lab={currentLab} onDelete={onDelete}/>
    ))}
    </div>
    );
}

/**
 * The component that will display an individual lab. These components will populate the LabList component.
 * @param lab - an individual lab
 */
const LabListItem = ({lab, onDelete}) => {
    return(
    <div className='item'>
        <h3>Lab: {lab.lname} <FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(lab.id)} /></h3>
        <p><em>Course: {lab.lcourse}</em></p>
        {/*What do we want this course part to show
        Maybe the course object that we can pop out?
        */}
    </div>
    );
}

 
    /**
     * The that will be exported. This page will have an Add form and list the Labs that have been added and
     * the labs that are in the database.
     * @param onAddLab - the function 'addLab' from App.js that will fire when the LabAddPage is submitted
     * @param labs - the state of labs passed from App.js
     */
     const LabAddPage = ({onAddLab, labs, onDelete, courses}) => {
        return (
          <div>
              <div className='element-page'>
                  <LabAdd onAddLab={onAddLab} courses={courses}/>
                  <LabList onDelete={onDelete} labs={labs}/>
              </div>
          </div>
        );
      }
    
    
    export default LabAddPage