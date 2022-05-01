import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, TextField, Button,Typography, Input } from '@mui/material';
//import { AsyncTaskManager } from 'builder-util';
import { React, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './../../assets/styles/HomePage.css';
import './../../assets/styles/SideNav.css';
import './../../assets/styles/AddPages.css';
import SideNavigation from '../SideNavigation.js';
import TopBar from '../TopBar.js';
import DataViewer from '../DataViewer';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import * as AlgoService from './../../services/algorithmServices/mainAlgorithmService';

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
    const [courseSections, setCourseSections] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [selectedProfessors, setSelectedProfessors] = useState([]);
    const [selectedLabs, setSelectedLabs] = useState([]);
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
            
            window.DB.send(CHANNEL_MODAL_TO_MAIN, _payload);
            window.DB.receive(CHANNEL_MODAL_FROM_MAIN, (response) => {
                if(response === "CANCEL"){
                    console.log('User cancelled')
                }
                else {
                    course.elementClassName = "item-selected"; 
                    console.log(response);
                    course.sections = response;
                    
                    setCourseSections([...courseSections, course]);
                }
            });
        }else{
            course.elementClassName = "item";
            course.sections = 0;

            let id = course.id;
            setCourseSections(courseSections.filter((remaingCourses) => remaingCourses.id !== id));
        }
    }

    /**
     * Selects a room to add for creating schedule. This function changes the background color
     * and adds it to the state variable holding rooms.
     * @param room - the room that was clicked
     */
    const selectRooms = (room) => () => {
        if(room.elementClassName === "item"){
            room.elementClassName = "item-selected";
            setSelectedRooms([...selectedRooms, room]); 
        }else{
            room.elementClassName = "item";

            let id = room.id;
            setSelectedRooms(selectedRooms.filter((remaingRooms) => remaingRooms.id !== id));
        }
    }

    /**
     * Selects a professor to add for creating schedule. This function changes the background color
     * and adds it to the state variable holding professors.
     * @param professor - the professor that was clicked
     */
    const selectProfessors = (professor) => () => {
        //console.log(professor)
        if(professor.elementClassName === "item"){
            professor.elementClassName = "item-selected"; 
            setSelectedProfessors([...selectedProfessors, professor]); 
        }else{
            professor.elementClassName = "item";

            let id = professor.id;
            setSelectedProfessors(selectedProfessors.filter((remaingProfs) => remaingProfs.id !== id));
        }
    }

    /**
     * Selects a lab to add for creating schedule. This function changes the background color
     * and adds it to the state variable holding labs.
     * @param lab - the lab that was clicked
     */
    const selectLabs = (lab) => () => {
        //console.log(lab)
        if(lab.elementClassName === "item"){
            lab.elementClassName = "item-selected"; 
            setSelectedLabs([...selectedLabs, lab]);
        }else{
            lab.elementClassName = "item";

            let id = lab.id;
            setSelectedLabs(selectedLabs.filter((remaingLabs) => remaingLabs.id !== id));
        }
    }

    /**
     * This function is called when the Add Schedule button is clicked.
     * This function will reset all the cards to unselected style.
     */
    function createAndRefresh(){
        resetStyles();    
        createNewSchedule();
    }
    
    /**
     * This function resets all the styles back to unselected state.
     */
    function resetStyles() {
        for(const key in courses){
            courses[key].elementClassName = 'item';
            //courses[key].sections = 0;
        }

        for(const key in rooms){
            rooms[key].elementClassName = 'item';
        }

        for(const key in professors){
            professors[key].elementClassName = 'item';
        }

        for(const key in labs){
            labs[key].elementClassName = 'item';
        }
    }

    /**
     * Sends the selected values from this state to the algorithm service. The algo service will create
     * a json from the variables and run the scheduling algorithm. The current page will then move to the solution viewer page.
     */
    function createNewSchedule(){
        AlgoService.createJsonOfSelectedStates(courseSections, selectedRooms, selectedProfessors, selectedLabs);
        setCurrentPage('schedule');
    }


    //======================== AddSolution Components =====================================
    /**
     * This component is a view that lists out individual LabListItems.
     * @param labs - The state of labs that is passed down from App.js
     */
        const LabList = ({labs, onClickLab}) => {
        return(
        <div className='container'>
        <h1>Labs</h1>
        {labs.map((currentLab, index) => (
            <LabListItem key={index} lab={currentLab} onClickLab={onClickLab} labs={labs}/>
        ))}
        </div>
        );
    }
    
    /**
     * The component that will display an individual lab. These components will populate the LabList component.
     * @param lab - an individual lab
     */
    const LabListItem = ({lab, onClickLab, labs}) => {
        return(
            <div className={lab.elementClassName}>
                {/*<DataViewer id={lab.id} dataState={labs} sx={{position:'absolute'}}>
                    <MoreHorizIcon style= {{float:"right"}}/>
        </DataViewer>*/}
                {/* this needs to change to a location if more than one building is used number is not unique*/}
                <div onClick = {onClickLab(lab)}>
                    <h3>Lab: {lab.lname}</h3>
                    <p><em>Course: {lab.lcourse[0].name}</em></p>
                </div>
            </div>

        );
    }
    
    /**
     * This page will have a list of Labs that have been added and
     * the labs that are in the database.
     * @param labs - the state of labs passed from App.js
     */
     const LabAddPageContent = ({ labs, onClickLab}) => {
        return (
            <div className="home">
                <div className='element-page'>
                    <LabList labs={labs} onClickLab={onClickLab}/>
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
    const ProfessorList = ({professors, onClickProfessor}) => {
        return (
        <div className='container'>
            <h1>Professors</h1>
        {professors.map((currentProfessor, index) => (
            <ProfessorListItem key={index} professor={currentProfessor} onClickProfessor={onClickProfessor} professors={professors}/>
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
    const ProfessorListItem = ({professor, onClickProfessor, professors}) => {
        return (
            <div className={professor.elementClassName}>
                <DataViewer id={professor.id} dataState={professors} sx={{position:'absolute'}}>
                    <MoreHorizIcon style= {{float:"right"}}/>
                </DataViewer>
                {/* this needs to change to a location if more than one building is used number is not unique*/}
                <div onClick = {onClickProfessor(professor)}>
                    <h3>{professor.firstName} {professor.lastName}</h3>
                </div>
            </div>
        );
    }
  
    /**
     * This page will have a list of the Professors that have been added and
     * the professors that are in the database.
     * 
     * @param professors     - The state of professors passed from App.js
     */
    const ProfessorAddPageContent = ({professors, onClickProfessor}) => {
        return (
        <div className="home">
            <div className='element-page'>
            <ProfessorList professors={professors} onClickProfessor={onClickProfessor}/> 
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
                <RoomListItem key={index} room={currentRoom} onClickRoom={onClickRoom} rooms={rooms}/>
            ))}
            </div>
            );
    }

    /**
     * The component that will display an individual room. These components will populate the RoomList component.
     * @param room - an individual room
     */
    const RoomListItem = ({ room, onClickRoom, rooms }) => {
        return(
        <div className={room.elementClassName}>
            <DataViewer id={room.id} dataState={rooms} sx={{position:'absolute'}}>
                <MoreHorizIcon style= {{float:"right"}}/>
            </DataViewer>
            {/* this needs to change to a location if more than one building is used number is not unique*/}
            <div onClick = {onClickRoom(room)}>
                <br></br>
                <h3>{room.building} {room.number} </h3>
            </div>
            
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
                <div className={course.elementClassName} id={course.id} >
                    <DataViewer id={course.id} dataState={courses} sx={{position:'absolute'}}>
                        <MoreHorizIcon style= {{float:"right"}}/>
                    </DataViewer>
                    <div onClick={onClickCourse(course)}>
                        <h3>{course.program} {course.number}</h3>
                        {/* This stuff in the paragraph tag will become popover*/}
                        <p><em>Course Name</em> : {course.name}<br /></p>
                    </div>
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

    useEffect(() => {
        //console.log('STATE REFRESH');
        //console.log('=============');
        //console.log('COURSES', courseSections);
        //console.log('ROOMS', selectedRooms);
        //console.log('PROFS', selectedProfessors);
        //console.log('LABS', selectedLabs)
        window.addEventListener('beforeunload', (event) => {
            // Cancel the event as stated by the standard.
            event.preventDefault();
            
          
            createAndRefresh()
          });
    }, [courseSections, selectedRooms, selectedProfessors, selectedLabs]);


    return (
        <div>
            <SideNavigation></SideNavigation>

            <div id="main">
                <div className="main-div">
                    <TopBar></TopBar>

                    <div className="container-home">
                        <CourseAddPageContent courses={courses} onClickCourse={addSectionsForClass} ></CourseAddPageContent>
                        <RoomAddPageContent  rooms={rooms} onClickRoom={selectRooms}></RoomAddPageContent>
                        <ProfessorAddPageContent professors={professors} onClickProfessor={selectProfessors}></ProfessorAddPageContent>
                        <LabAddPageContent labs={labs} onClickLab={selectLabs}></LabAddPageContent>
                    </div>
                    
                    {/* generate schedule button */}
                    <Button variant="contained" sx={{position:'absolute', bottom:'12vh', right:'2.5vw'}} onClick={createAndRefresh}>
                        <Typography variant="text" color="secondary">Generate Schedule</Typography>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AddSolution;