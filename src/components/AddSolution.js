import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, TextField, Button,Typography } from '@mui/material';
//import { AsyncTaskManager } from 'builder-util';
import { React, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './../assets/styles/HomePage.css';
import './../assets/styles/SideNav.css';
import './../assets/styles/AddPages.css';
import SideNavigation from './SideNavigation.js';
import TopBar from './TopBar.js';


    /**
 * This component is a view that lists out individual LabListItems.
 * @param labs - The state of labs that is passed down from App.js
 */
     const LabList = ({labs}) => {
        return(
        <div className='container'>
        <h1>Labs</h1>
        {labs.map((currentLab, index) => (
            <LabListItem key={index} lab={currentLab}/>
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
            <h3>Lab: {lab.lname}</h3>
            <p><em>Course: {lab.lcourse[0].name}</em></p>
            {/*What do we want this course part to show
            Maybe the course object that we can pop out?
            */}
        </div>
        );
    }
    
    /**
     * This page will have an Add form and list the Labs that have been added and
     * the labs that are in the database.
     * @param onAddLab - the function 'addLab' from App.js that will fire when the LabAddPage is submitted
     * @param labs - the state of labs passed from App.js
     */
     const LabAddPageContent = ({ labs }) => {
        return (
            <div className="home">
                <div className='element-page'>
                    <LabList labs={labs}/>
                </div>
            </div>
        );
    }
/**
 * This component is a view that lists out individual ProfessorListItems.
 * 
 * @param professors - The state of professors that is passed down from App.js
 * @param onDelete   - Handler function that deletes an individual item from the list
 * @returns          - React component that lists viewable professor components
 */
 const ProfessorList = ({professors}) => {
    return (
      <div className='container'>
        <h1>Professors</h1>
      {professors.map((currentProfessor, index) => (
        <ProfessorListItem key={index} professor={currentProfessor}/>
      ))}
      </div>
    );
  }
   
   
  /**
   * The component that will display an individual professor. These components will populate the ProfessorList component.
   * 
   * @param professor - An individual professor
   * @param onDelete  - Handler function that deletes an individual item from the list
   * @returns         - React component that displays a single professor component
   */
  const ProfessorListItem = ({professor}) => {
    return (
      <div className='item'>
        <h3>{professor.name}</h3>
        {/* This stuff in the paragraph tag will become popover*/}
        <p>Program: {professor.program}<br></br></p>
      </div>
    );
  }
  
  /**
   * This page will have an Add form and list the Professors that have been added and
   * the professors that are in the database.
   * 
   * @param onAddProfessor - The function 'addProfessor' from App.js that will fire when the ProfessorAddPage is submitted
   * @param professors     - The state of professors passed from App.js
   * @param onDelete       - Handler function that deletes an individual item from the list
   * @param courses        - State variable containing course objects
   * @param programs       - State variable containing program objects
   */
   const ProfessorAddPageContent = ({professors}) => {
    return (
      <div className="home">
        <div className='element-page'>
          <ProfessorList professors={professors}/> 
        </div>
      </div>
    );
  }

/**
 * This component is a view that lists out individual RoomListItems.
 * @param rooms - The state of rooms that is passed down from App.js
 */
     const RoomList = ({ rooms }) => {
        return(
        <div className='container'>
        <h1>Rooms</h1>
        {rooms.map((currentRoom, index) => (
            <RoomListItem key={index} room={currentRoom}/>
        ))}
        </div>
        );
    }
    
    /**
     * The component that will display an individual room. These components will populate the RoomList component.
     * @param room - an individual room
     */
    const RoomListItem = ({ room }) => {
        return(
        <div className='item'>
            {/* this needs to change to a location if more than one building is used number is not unique*/}
            <h3>Room: {room.rnumber} </h3>
            <p><em>Building: </em> {room.rbuilding}<br />
            <em>Tech: </em>{room.rtech}</p>
            {/*Do we want to add a subheader like the video*/}
        </div>
        );
    }
    
    /**
     * This page will have an Add form and list the Rooms that have been added and
     * the rooms that are in the database.
     * @param onAddRoom - the function 'addRoom' from App.js that will fire when the RoomAddPage is submitted
     * @param rooms - the state of rooms passed from App.js
     */
     const RoomAddPageContent = ({ rooms }) => {
        return (
          <div className="home">
              <div className='element-page'>
                  <RoomList rooms={rooms}/>
              </div>
          </div>
        );
    }
/**
 * This component is a view that lists out individual CourseListItems.
 * @param courses - The state of courses that is passed down from App.js
 * @param onDelete - The delete function that is passed down from App.js
 * @returns - The component that is a view listing out the CourseListItems
 */
 const CourseList = ({ courses}) => {
    return (
        <div className='container'>
            <h1>Courses</h1>
            {courses.map((currentCourse, index) => (
                <CourseListItem key={index} course={currentCourse}/>
            ))}
        </div>
    );
}


/**
 * The component that will display an individual course. These components will populate the CourseList component.
 * @param course - an individual course
 * @param onDelete - The delete function that is passed down from App.js
 * @returns - The component displaying an individual course.
 */
const CourseListItem = ({ course }) => {
    return (
        <div className='item'>
            <h3>{course.program} {course.number}</h3>
            {/* This stuff in the paragraph tag will become popover*/}
            <p><em>Class ID</em> : {course.courseID} <br />
                <em>Course Name</em> : {course.name}<br />
                <em>Credits</em> : {course.credits}<br />
                <em>Capacity</em> : {course.capacity}<br />
                <em>Tech: </em>{course.tech}</p>
        </div>
    );
}

/**
 * This page will have an Add form and list the Courses that have been added and
 * the courses that are in the database.
 * @param onAddCourse - the function 'addCourse' from App.js that will fire when the CourseAddPage is submitted
 * @param courses - the state of courses passed from App.js
 * @param onDelete - the function 'onDelete' from App.js that will fire when the onclick happens
 * @param programs - the state of programs passed from App.js
 * @returns - The exported component
 */
 const CourseAddPageContent = ({ courses }) => {
    return (
        <div className="home">
            <div className='element-page'>
                <CourseList courses={courses} />
            </div>
        </div>
    );
}

/**
 * The component that will be exported. This page will have an Add form and list the Courses that have been added and
 * the courses that are in the database.
 * @param onAddCourse - the function 'addCourse' from App.js that will fire when the CourseAddPage is submitted
 * @param courses - the state of courses passed from App.js
 * @param onDelete - the function 'onDelete' from App.js that will fire when the onclick happens
 * @param programs - the state of programs passed from App.js
 * @returns - The exported component
 */
const AddSolution = ({ courses, rooms, professors, labs, setCurrentPage}) => {
    return (
        <div>
            <SideNavigation></SideNavigation>

            <div id="main">
                <div className="main-div">
                    <TopBar></TopBar>

                    <div className="container-home">
                        <CourseAddPageContent courses={courses} ></CourseAddPageContent>
                        <RoomAddPageContent  rooms={rooms} ></RoomAddPageContent>
                        <ProfessorAddPageContent professors={professors} ></ProfessorAddPageContent>
                        <LabAddPageContent labs={labs} ></LabAddPageContent>
                    </div>
                    
                    {/* generate schedule button */}
                    <Button variant="contained" sx={{position:'absolute', bottom:'12vh', right:'2.5vw'}} onClick={()=>{setCurrentPage('schedule')}}>
                        <Typography variant="text" color="secondary">Generate Schedule</Typography>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AddSolution;