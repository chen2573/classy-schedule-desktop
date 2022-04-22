import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, TextField, Button,Typography, Input } from '@mui/material';
//import { AsyncTaskManager } from 'builder-util';
import { React, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './../../assets/styles/HomePage.css';
import './../../assets/styles/SideNav.css';
import './../../assets/styles/AddPages.css';
import SideNavigation from '../SideNavigation.js';
import TopBar from '../TopBar.js';

import * as AlgoFunction from './../../services/algorithmServices/mainAlgorithmService';

const {
    CHANNEL_MODAL_FROM_MAIN,
    CHANNEL_MODAL_TO_MAIN
} = require('./../../utils/ipcChannels')

/**
 * The component that will be exported. This page will 4 lists of the Courses, professors, rooms, and labs that have been added and
 * that are in the database.
 * @param courses - the state of courses passed from App.js
 * @param rooms - the state of rooms passed from App.js
 * @param professors - the state of professors passed from App.js
 * @param labs - the state of labs passed from App.js
 * @param setCurrentPage - the function passed to redirect to the solution page
 * @returns - The exported component
 */
const AddSolution = ({ courses, rooms, professors, labs, setCurrentPage}) => {
    /**
    * State variables to send to the algorithm
    */
    const [sections, setSections] = useState([]);
    const [tempState, setTempState] = useState([]);
    const colorIsRed = true;

    //======================== Algorithm Calculation Functions ===========================
    /**
     * This function runs when a course is selected. The number of sections of the course will 
     * be determined by user input. 
     * 
     * There has to be an extra => so that this function can run on a onClick.
     * https://stackoverflow.com/questions/63960506/react-pass-value-to-onclick-function
     * 
     * @param course - a course that is being selected 
     * @returns 
     */
    const addSectionsForClass = (course) => () => {
        let _payload = {
            request: 'COURSE_SECTIONS',
            program: course.program,
            number: course.number,
            message: 'Renderer PROMPT for Course Sections'
        }

        if(course.elementClassName === "item"){
            course.elementClassName = "item-selected"; 
            window.DB.send(CHANNEL_MODAL_TO_MAIN, _payload);
            window.DB.receive(CHANNEL_MODAL_FROM_MAIN, (response) => {
               console.log(response);
               course.sections = response;
               setTempState([]);
            });
        }else{
            course.elementClassName = "item";
            course.sections = 0;
        }
        console.log(sections);
        setSections([...sections, course]);
    }
    const selectRooms = (room) => () => {
        if(room.elementClassName === "item"){
            room.elementClassName = "item-selected"; 
        }else{
            room.elementClassName = "item";
        }
        setTempState([]);
    }
    function createNewSchedule(){
        AlgoFunction.runAlgorithm();
        //setCurrentPage('schedule');
    }

    //======================== AddSolution Components =====================================
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
    const LabListItem = ({lab}) => {
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
     * This page will have a list of Labs that have been added and
     * the labs that are in the database.
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
     * This page will have a list of the Professors that have been added and
     * the professors that are in the database.
     * 
     * @param professors     - The state of professors passed from App.js
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
        const RoomList = ({ rooms, onClickRoom }) => {
            return(
            <div className='container'>
            <h1>Rooms</h1>
            {rooms.map((currentRoom, index) => (
                <RoomListItem key={index} room={currentRoom} onClickRoom={onClickRoom}/>
            ))}
            </div>
            );
    }

    /**
     * The component that will display an individual room. These components will populate the RoomList component.
     * @param room - an individual room
     */
    const RoomListItem = ({ room, onClickRoom }) => {
        return(
        <div className={room.elementClassName} onClick = {onClickRoom(room)}>
            {/* this needs to change to a location if more than one building is used number is not unique*/}
            <h3>Room: {room.rnumber} </h3>
            <p><em>Building: </em> {room.rbuilding}<br />
            <em>Tech: </em>{room.rtech}</p>
            
            {/*Do we want to add a subheader like the video*/}
        </div>
        );
    }
    
    /**
     * This page will have a list of the Rooms that have been added and
     * the rooms that are in the database.
     * @param rooms - the state of rooms passed from App.js
     */
     const RoomAddPageContent = ({ rooms, onClickRoom }) => {
        return (
          <div className="home">
              <div className='element-page'>
                  <RoomList rooms={rooms} onClickRoom={onClickRoom}/>
              </div>
          </div>
        );
    }

    /**
     * This component is a view that lists out individual CourseListItems.
     * @param courses - The state of courses that is passed down from App.js
     * @returns - The component that is a view listing out the CourseListItems
     */
    const CourseList = ({ courses, onClickCourse }) => {
        return (
            <div className='container'>
                <h1>Courses</h1>
                {courses.map((currentCourse, index) => (
                    <CourseListItem key={index} course={currentCourse} onClickCourse={onClickCourse}/>
                ))}
            </div>
        );
    }


    /**
     * The component that will display an individual course. These components will populate the CourseList component.
     * @param course - an individual course
     * @returns - The component displaying an individual course.
     */
    const CourseListItem = ({ course, onClickCourse}) => {
        //addSectionsForClass(course)
        return (
            <div className={course.elementClassName} id={course.id} onClick={onClickCourse(course)}>
                <h3>{course.program} {course.number}</h3>
                {/* This stuff in the paragraph tag will become popover*/}
                <p><em>Class ID</em> : {course.courseID} <br />
                    <em>Course Name</em> : {course.name}<br />
                    <em>Credits</em> : {course.credits}<br />
                    <em>Capacity</em> : {course.capacity}<br />
                    <em>Tech: </em>{course.tech}<br />
                    <em>Sections</em>: {course.sections}</p>
            </div>
        );
    }

    /**
     * This page will have a list of the Courses that have been added and
     * the courses that are in the database.
     * @param courses - the state of courses passed from App.js
     * @returns - The exported component
     */
    const CourseAddPageContent = ({ courses, onClickCourse }) => {
        return (
            <div className="home">
                <div className='element-page'>
                    <CourseList courses={courses} onClickCourse={onClickCourse}/>
                </div>
            </div>
        );
    }


    return (
        <div>
            <SideNavigation></SideNavigation>

            <div id="main">
                <div className="main-div">
                    <TopBar></TopBar>

                    <div className="container-home">
                        <CourseAddPageContent courses={courses} onClickCourse={addSectionsForClass} ></CourseAddPageContent>
                        <RoomAddPageContent  rooms={rooms} onClickRoom={selectRooms}></RoomAddPageContent>
                        <ProfessorAddPageContent professors={professors} ></ProfessorAddPageContent>
                        <LabAddPageContent labs={labs} ></LabAddPageContent>
                    </div>
                    
                    {/* generate schedule button */}
                    <Button variant="contained" sx={{position:'absolute', bottom:'12vh', right:'2.5vw'}} onClick={createNewSchedule}>
                        <Typography variant="text" color="secondary">Generate Schedule</Typography>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AddSolution;