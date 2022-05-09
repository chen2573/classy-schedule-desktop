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
    const [roomScrollState, setRoomScrollState] = useState(0);
    const [courseScrollState, setCourseScrollState] = useState(0);
    const [professorScrollState, setProfessorScrollState] = useState(0);
    const [labsScrollState, setLabsScrollState] = useState(0);

    const [stateCurrentPage, setStateCurrentPage] = useState('');
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
                    setCourseScrollState(document.querySelector('#courseScroll').scrollTop);
                    setCourseSections([...courseSections, course]);
                }
            });
        }else{
            course.elementClassName = "item";
            course.sections = 0;

            let id = course.id;
            setCourseScrollState(document.querySelector('#courseScroll').scrollTop);
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
            setRoomScrollState(document.querySelector('#roomScroll').scrollTop);
            setSelectedRooms([...selectedRooms, room]);
        }else{
            room.elementClassName = "item";

            let id = room.id;
            setRoomScrollState(document.querySelector('#roomScroll').scrollTop);
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
            setProfessorScrollState(document.querySelector('#professorScroll').scrollTop); 
            setSelectedProfessors([...selectedProfessors, professor]); 
        }else{
            professor.elementClassName = "item";

            let id = professor.id;
            setProfessorScrollState(document.querySelector('#professorScroll').scrollTop);
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
            setLabsScrollState(document.querySelector('#labsScroll').scrollTop); 
            setSelectedLabs([...selectedLabs, lab]);
        }else{
            lab.elementClassName = "item";

            let id = lab.id;
            setLabsScrollState(document.querySelector('#labsScroll').scrollTop);
            setSelectedLabs(selectedLabs.filter((remaingLabs) => remaingLabs.id !== id));
        }
    }

    /**
     * This function is called when the Add Schedule button is clicked.
     * This function first checks to make sure it is possible to create an optimized
     * schedule given the data entered by the user
     * This function will reset all the cards to unselected style.
     */
    function createAndRefresh(){ 
        // To run this rn you need to uncomment the second to last line in checkInput()
        const inputCodes = checkInput();
        var alertString = 'You need to adjust your input in the following ways to ' +
                            'be able to produce an optimized schedule.\n'
        if(inputCodes[0]){
            createNewSchedule();
            resetStyles(); 
        }
        else{
            // This block is finding which of the conditions were not satisfied
            // in checkInput() and adding to the alert string to tell the user
            // what they need to change in order to produce an optimized schedule
            if(inputCodes[1] > 0){
                alertString = alertString + 'Increase the teach load, ' +
                'or decrease the sections of courses and labs, by ' + inputCodes[1] + '. ' + 
                'A course section is equivalent to 1 teach load and a lab is 0.5. ' +
                'You can increase the teach load by increasing existing professors ' +
                'teach load or creating more professors.\n'
            }
            
            alert(alertString);
            return;
        }
    }

    /**
     * A zero for an integer in inputCodes means there is no issue with the varible
     * it represents.
     * The codes it represents are as follows
     * inputCodes[1] checks Number of Sections - Total Teach Load
     * If a value is negative it means there needs to be that much more of the item
     * @returns inputCodes, an array of numbers with a boolean in the first position
     */
    function checkInput(){       
        /**
         * This section checks if all the course sections can be taught
         * WORK IN PROGRESS
         */
        const inputCodes = [true, 0];
        var sectionSum = 0;
        var teachLoadSum = 0;
        // This section determines the total number of sections, total teach load
        for(let i  = 0; i < courseSections.length; i++){
            sectionSum = sectionSum + parseInt(courseSections[i].sections);
        }
        sectionSum = sectionSum + selectedLabs.length*0.5

        for(let i  = 0; i < selectedProfessors.length; i++){
            teachLoadSum = teachLoadSum + selectedProfessors[i].teach_load;
        }
        
        inputCodes[1] = sectionSum -  teachLoadSum;
        
        // for loop that determines the boolean value of the flag
        // based on && of all the boolean values in the array
        for(let i = 1; i < inputCodes.length; i++){
            var codeValue = false
            if(inputCodes[i] == 0){
                codeValue = true
            }
            inputCodes[0] = inputCodes[0] && codeValue;
        }


        // inputCodes[0] = true;
        return inputCodes;
    }
    
    /**
     * This function resets all the styles back to unselected state.
     */
    function resetStyles() {
        for(const key in courses){
            courses[key].elementClassName = 'item';
            courses[key].sections = 0;
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
        setStateCurrentPage('schedule');
        AlgoService.createJsonOfSelectedStates(courseSections, selectedRooms, selectedProfessors, selectedLabs, 300, 3);
        setCurrentPage('schedule');
    }


    //======================== AddSolution Components =====================================
    /**
     * This component is a view that lists out individual LabListItems.
     * @param labs - The state of labs that is passed down from App.js
     */
        const LabList = ({labs, onClickLab}) => {
        return(
            <div className='container' id = "labsScroll">
                <h1 className='sticky'>Labs</h1>
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
                <DataViewer id={lab.id} dataState={labs} sx={{position:'absolute'}}>
                    <MoreHorizIcon style= {{float:"right"}}/>
                </DataViewer>
                {/* this needs to change to a location if more than one building is used number is not unique*/}
                <div onClick = {onClickLab(lab)}>
                    <h3>Lab: {lab?.name}</h3>
                    <p><em>Course: {lab?.number}</em></p>
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
                <div className='container' id = "professorScroll">
                    <h1 className = "sticky">Professors</h1>                    
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
                <div className='container' id = "roomScroll">
                    <h1 className='sticky'>Rooms</h1>
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
            <div className='container' id = "courseScroll">
                <h1 className='sticky'>Courses</h1>                
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
        //console.log('LABS', selectedLabs);
        document.querySelector('#roomScroll').scrollTop = roomScrollState;
        document.querySelector('#courseScroll').scrollTop = courseScrollState;
        document.querySelector('#labsScroll').scrollTop = labsScrollState;
        document.querySelector('#professorScroll').scrollTop = professorScrollState;
        window.addEventListener('beforeunload', (event) => {
            // Cancel the event as stated by the standard.
            event.preventDefault();
            
          
            createAndRefresh()
          });
    }, [courseSections, selectedRooms, selectedProfessors, selectedLabs, roomScrollState, courseScrollState, labsScrollState, professorScrollState]);
    /**
     * Resets the UI style when user leaves the page
     */
    // useEffect(() => {
    //     return () => {
    //         if(stateCurrentPage !== 'schedule'){
    //             let choice = window.confirm("You are about to leave this page. Your selections will be lost!");
    //             if(choice){
    //                 resetStyles();
    //             }else{
    //                 setCurrentPage('AddSolution');
    //             }
    //         }
    //     }
    //   }, [stateCurrentPage]);


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