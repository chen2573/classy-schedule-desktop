/**
 * CreateSolutionPage handles when you want to add a solution manually.
 * This page appears when you click create schedule on solution dashboard.
 * 
 * Bugs:
 *    - None currently known
 *
 * @authors Samuel Swanson, Anshul Bharath, Tianzhi Chen, 
 *          Joseph Heimel, Glennon Langan
 */
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Button, Tabs, Tab, Box, Typography, CircularProgress, 
        FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import DataViewer from '../DataViewer.js';
import './../../assets/styles/Solution.css';

import * as SolutionService from '../../services/databaseServices/solutionDBService.js'

//const payload.data = require("../../utils/solution.json");




/**
 * automatically populates solutions items
 * 
 * @param courseEntries courses assigned to a time slot by the GenerateSolutions component
 * @param time the time slot
 * @returns a table row item containing all courses entry in a time slot
 */
const SolutionItem = ({courseEntries, time, professors, courses, rooms, editMode, onAddEditSection, onDeleteEditSection, solutionNumber, onChangeDropDown}) =>
{

    const TimeDisplay = ({time, editMode, solutionNumber, onAddEditSection}) => {
        if(!editMode) {
            return <th scope = "row">{time}</th>
        }
        else {
            return <><th scope = "row">
                        {time} 
                        <br></br> 
                        <div class = "tooltip" onClick = {() => onAddEditSection(time, solutionNumber)}>
                            <AddCircleSharpIcon></AddCircleSharpIcon>
                            <span class = "tooltiptext">Add Section</span> 
                        </div>
                    </th></>
        }
    }

    const DeleteColumnElement = ({entries}) => {
        return (entries.map((entry) =>
        {
            return(
            <table ><tbody><tr  ><td>
                <div className = "tooltip checkbox-div" onClick = {() => onDeleteEditSection(solutionNumber, entry.id)}>
                <DeleteIcon size = "large" inputProps = {{ 'aria-label': 'controlled' }}/>
                    <span className = "tooltiptext">Delete Section</span> 
                </div>    
            </td></tr></tbody></table>)
            
                
        }))

    }

    const DeleteColumn = ({entries, editMode}) => {
        if(editMode) {
            return (
                <td className = "delete-row-container">
                    <DeleteColumnElement entries = {entries}></DeleteColumnElement>
                </td>
            )
        }
        else {
            return <></>
        }
    }

    const item = <tr key = {time} className="row">
                    <TimeDisplay time = {time} editMode = {editMode} onAddEditSection = {onAddEditSection} solutionNumber = {solutionNumber}></TimeDisplay>

                    {<td className = "course-container">
                        {courseEntries.map((entry) =>
                            {
                                //get course name
                                var name;
                                if (courses.filter((item) => item.id === entry.course)[0] !== undefined)
                                {
                                    name = Object.entries(courses.filter((item) => item.id === entry.course)[0]);
                                    //console.log('Name', name);
                                    name = name[1][1] + " " + name[2][1];
                                }

                                //return table entry
                                if(!editMode){
                                    return <table key = {entry.course}><tbody><tr key = {entry.course} ><td>
                                                <DataViewer id = {entry.course} dataState = {courses} sx = {{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                                                    <Button className = "entry-button" variant = "text"color = "inherit">
                                                        {name}
                                                    </Button>
                                                </DataViewer>
                                        </td></tr></tbody></table>
                                }
                                else {


                                    return <table key = {entry.course}><tbody><tr key = {entry.course} ><td>
                                    <FormControl fullWidth>
                                        <InputLabel shrink id = "label">Course</InputLabel>
                                        <Select
                                        labelId = "label"
                                        id = 'course_dropdown'
                                        notched
                                        MenuProps = {{sx: {
                                            "&& .Mui-selected": {
                                            backgroundColor: "#90A4AE"
                                            }
                                        }}}
                                        value = {entry.course}
                                        label = "Course Name"
                                        onChange = {(e) => onChangeDropDown(solutionNumber, entry.id, e.target.value, 'COURSE')}
                                        >
                                        {courses.map(course => (
                                            <MenuItem 
                                            key = {course.id} 
                                            value = {course.id}
                                            >
                                            <b>{course.program} {course.number}</b>: <i>{course.name}</i>
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    </td></tr></tbody></table>
                                }
                            })
                        }
                    </td>}

                    {<td className="room-container">
                        {courseEntries.map((entry) =>
                            {
                                //get room name
                                var name;
                                if (rooms.filter((item) => item.id === entry.room)[0] !== undefined)
                                {
                                    name = Object.entries(rooms.filter((item) => item.id === entry.room)[0]);
                                    //console.log('Name', name);
                                    name = name[1][1] + " " + name[2][1];
                                }

                                //return table entry
                                if(!editMode){
                                    return <table key = {entry.room}><tbody><tr key = {entry.room} ><td>
                                                <DataViewer id = {entry.room} dataState = {rooms} sx = {{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                                                    <Button className = "entry-button" variant = "text"color = "inherit">
                                                        {name}
                                                    </Button>
                                                </DataViewer>
                                        </td></tr></tbody></table>
                                }
                                else {
                                    return <table key = {entry.room}><tbody><tr key = {entry.room} ><td>
                                    <FormControl fullWidth>
                                        <InputLabel shrink id = "label">Room</InputLabel>
                                        <Select
                                        labelId = "room-label"
                                        id = 'room_dropdown'
                                        notched
                                        MenuProps = {{sx: {
                                            "&& .Mui-selected": {
                                            backgroundColor: "#90A4AE"
                                            }
                                        }}}
                                        value = {entry.room}
                                        label = "Room"
                                        onChange = {(e) => onChangeDropDown(solutionNumber, entry.id, e.target.value, 'ROOM')}
                                        >
                                        {rooms.map(room => (
                                            <MenuItem 
                                            key = {room.id} 
                                            value = {room.id}
                                            >
                                            <b>{room.building}</b> {room.number}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    </td></tr></tbody></table>
                                }
                            })
                        }
                    </td>}

                    {<td className="professor-container">
                        {courseEntries.map((entry) =>
                            {
                                //get professor name
                                var name;
                                if (professors.filter((item) => item.id === entry.professor)[0] !== undefined)
                                {
                                    name = Object.entries(professors.filter((item) => item.id === entry.professor)[0]);
                                    name = name[1][1];
                                }

                                //return table entry
                                if(!editMode){
                                    return <table key = {entry.professor}><tbody><tr key = {entry.professor} ><td>
                                                <DataViewer id = {entry.professor} dataState = {professors} sx = {{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                                                    <Button className = "entry-button" variant = "text"color = "inherit">
                                                        {name}
                                                    </Button>
                                                </DataViewer>
                                        </td></tr></tbody></table>
                                }
                                else {
                                    return <table key = {entry.professor}><tbody><tr key = {entry.professor} ><td>
                                    <FormControl fullWidth>
                                        <InputLabel shrink id = "label">Professor</InputLabel>
                                        <Select
                                        labelId = "prof-label"
                                        id = 'prof_dropdown'
                                        notched
                                        MenuProps = {{sx: {
                                            "&& .Mui-selected": {
                                            backgroundColor: "#90A4AE"
                                            }
                                        }}}
                                        value = {entry.professor}
                                        label = "Professor"
                                        onChange = {(e) => onChangeDropDown(solutionNumber, entry.id, e.target.value, 'PROF')}
                                        >
                                        {professors.map(professor => (
                                            <MenuItem 
                                            key = {professor.id} 
                                            value = {professor.id}
                                            >
                                            <b>{professor.firstName} {professor.lastName}</b>
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    </td></tr></tbody></table>
                                }
                                
                            })
                        }

                    </td>}
                    
                    <DeleteColumn entries = {courseEntries} editMode = {editMode}></DeleteColumn>

                </tr>;


    return item;
}


/**
 * This is the main component of the page. It returns the whole solutions page
 * it calls GenerateSolutions and populates the solutions table within each of the
 * weekdays.
 * 
 * @param professors professors state
 * @param courses courses state
 * @param rooms rooms state
 * @returns the solutions page
 */
export function CreateSolutionPage ({professors, courses, rooms, times, programs, setCurrentPage})
{  
    const [tempSolutionEntries, setTempSolutionEntries] = useState();
    const [editSolutionEntries, setEditSolutionEntries] = useState([]);
    const [scrollState, setScrollState] = useState(0);
    const [index, setIndex] = useState(0);

    const [isAlgoCalculating, setIsAlgoCalculating]= useState(true);
    const [editMode, setEditMode] = useState(false);


    if(isAlgoCalculating) {
        const solutionEntries = [];
        solutionEntries.push({"solutionNum": 0, "entry": []});

        let mainArray = JSON.parse(JSON.stringify(solutionEntries));
        let editArray = JSON.parse(JSON.stringify(solutionEntries));

        setTempSolutionEntries(mainArray);
        setEditSolutionEntries(editArray);

        setIsAlgoCalculating(false);
    }


    //get solutions items sorted by time so we can display
    //them chronologically in the table
    const getTimes = (solution) =>
    {
        let solutionTimes = [];
        //console.log(solution);

        for (let time of times)
        {
            solutionTimes.push({"id":time.id, "time": time.time, "entries":[]});
        }//get all entries in times

        for (let solutionTime of solutionTimes)
        {
            for (let entry of solution)
            {
                if (entry.time === solutionTime.id)
                {
                    solutionTime.entries.push(entry);
                }
            }
        }
        //console.log(solutionTimes)
        return solutionTimes;
    }

    function mapTimeStringToId(timeString) {
        for(let i=0; i<times.length; i++){
            if(times[i].time === timeString){
                return times[i].id;
            }
        }
    }


    //tab states and functions


    function a11yProps(index) {return {id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}`,}}

    const [page, setPage] = useState(0);
    const handleChange = (event, newPage) => {setPage(newPage); setIndex(newPage);};

    /**
     * This is an individual tabpanel page
     * 
     * @param props 
     * @returns a tabpannel page with elements wrapped inside
     */
    function TabPanel(props)
    {
        //load props and children wrapped within TabPanel
        const { children, value, index, ...other } = props;     
      
        return (
          <div
            className = "tab-pannel-container"
            role = "tabpanel"
            hidden={value !== index}
            id = {`simple-tabpanel-${index}`}
            aria-labelledby = {`simple-tab-${index}`}
            {...other}
          >
            {value === index && (<Box sx = {{ p: 3 }}>{children}</Box>)}
          </div>
        );
    }

    //====== Edit Flow Functions ===============
    function editSolution() {
        setEditMode(true);
    }

    function saveEdits() {
        let newArray = JSON.parse(JSON.stringify(editSolutionEntries));
        let areAllDropDownsValid = checkForMissingValues(newArray);

        if(areAllDropDownsValid){
            setTempSolutionEntries(newArray);
            setEditMode(false);
        }
    }

    function checkForMissingValues(array) {
        let entryArrays = array[page].entry;

        for(let i=0; i<entryArrays.length; i++){
            if(entryArrays[i].course === -1){
                window.alert('Invalid Input.\nPlease select a Course!');
                return false;
            }
            if(entryArrays[i].room === -1){
                window.alert('Invalid Input.\nPlease select a Room!');
                return false;
            }
            if(entryArrays[i].professor === -1){
                window.alert('Invalid Input.\nPlease select a Professor!');
                return false;
            }
        }
        return true;
    }

    function cancelEdits() {
        let newArray = JSON.parse(JSON.stringify(tempSolutionEntries));

        setEditSolutionEntries(newArray);
        setEditMode(false);
    }
    //===========================================



    const EditButtons = () => {
        if(!editMode) {
            return (
                <Button variant = "contained"
                    onClick = {editSolution}
                    sx = {{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                    <Typography variant="text" color="secondary">Edit Solution</Typography>
                </Button>
            )
        }
        else {
            return (
                <div>
                    <Button variant = "contained"
                        onClick = {saveEdits}
                        sx = {{position:'absolute', bottom:'12vh', left:'13.5vw'}}>
                        <Typography variant = "text" color="secondary">Save Edits</Typography>
                    </Button>
                    <Button variant="contained"
                        onClick={cancelEdits}
                        sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                        <Typography variant="text" color = "secondary">Cancel Edits</Typography>
                    </Button>
                </div>
            )
        }
    }
      
    TabPanel.propTypes = {children: PropTypes.node, index: PropTypes.number.isRequired, value: PropTypes.number.isRequired};

    //================ Saving Schedule Functions ==============================
    const saveSchedule = (solution,setCurrentPage) => () => {
        SolutionService.createPlan(solution, professors, courses, rooms, programs).then((data) => {
            if(data === 1){
                window.alert('Schedule created successfully!');
                setCurrentPage('SolutionDashboard');
            }
            else if(data === 2){
                return;
            }
            else if(data === -1) {
                window.alert('Error! Unable to create schedule.')
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const TableHeaders = () => {
        if(!editMode) {
            return (
            <tr className="row">
                <th scope="col">Time</th>
                <th scope="col">Course</th>
                <th scope="col">Room</th>
                <th scope="col">Professor</th>
            </tr>
            )
        }
        else {
            return ( 
                <tr className="row">
                    <th scope="col">Time</th>
                    <th scope="col">Course</th>
                    <th scope="col">Room</th>
                    <th scope="col">Professor</th>
                    <th scope="col">Delete</th>
                </tr>
            )
        }
    }

    //====== Edit Funcitonality Functions ======================
    /**
     * This function is attached to the add symbol in the Time column. 
     * This function is designed to add a section into a specified time slot. 
     * With the help of the helper function we are able to do this.
     * 
     * https://www.youtube.com/watch?v=0iNDB-2fg8A&ab_channel=WebDevJunkie 
     * This video helped me solve the issue of the parent component 
     * not rendering when I wanted it to.
     * 
     * @param timeString - the string found in the time object
     * @param solutionNumber - the solution number we are working with
     */
    function addEditSection(timeString, solutionNumber){
        let tempSolutions = editSolutionEntries;
        setScrollState(document.querySelector('#simple-tabpanel-'+index).scrollTop);
        setEditSolutionEntries([...helperAddEditSection(timeString, solutionNumber, tempSolutions)]);
    }

    /**
     * This function is a helper function for the add button. 
     * It returns a new array with an added object for the specified time slot.
     * 
     * @param timeString - the time period to add the section
     * @param solutionNumber - the solution number we are working with.
     * @param tempSolutions = a soft copy of the state variable of edit solutions.
     * @returns a new array with modified object
     */
    function helperAddEditSection(timeString, solutionNumber, tempSolutions){
        let timeId = mapTimeStringToId(timeString);

        const id = Math.floor(Math.random() * 10000) + 1;

        let newEntry = {
            id: id,
            professor: -1,
            course: -1,
            time: timeId,
            room: -1
        }

        let tempEntryArray = tempSolutions[solutionNumber].entry
        tempEntryArray.push(newEntry);

        tempSolutions[solutionNumber].entry = tempEntryArray;
        return tempSolutions;
    }

    /**
     * This function deletes a section by id.
     * 
     * @param solutionNumber - the solution number we are working with
     * @param entryId - the id of the section that is being deleted.
     */
    function deleteEditSection(solutionNumber, entryId){
        let tempSolutions = editSolutionEntries;
        
        setEditSolutionEntries([...helperDeleteEditSection(0, tempSolutions, entryId)]);
    }

    /**
     * This function deletes the section that is specified.
     * 
     * @param solutionNumber - the solution number we are working with.
     * @param tempSolutions - the a soft copy of the edit state.
     * @param entryId - the id of the section we are working with
     * @returns a new edit state with changed values.
     */
    function helperDeleteEditSection(solutionNumber, tempSolutions, entryId) {

        let entryArray = tempSolutions[solutionNumber].entry
        let tempEntryArray = entryArray.filter((entry) => entry.id !== entryId);

        tempSolutions[solutionNumber].entry = tempEntryArray;

        return tempSolutions;
    }

    /**
     * This function updates the value being stored in the dropdown. 
     * This function runs when a value is changed for any dropdown.
     * 
     * @param solutionNumber - the solution that number we are working with.
     * @param entryId - the id of the section that is being changed.
     * @param newValue - the value of the dropdown that is being changed.
     * @param valueChanging - specifies which type of dropdown is changing (COURSE, ROOM, PROF)
     */
    function setNewDropValue(solutionNumber, entryId, newValue, valueChanging) {
            let tempSolutions = editSolutionEntries;
            setEditSolutionEntries([...helperNewDropValue(solutionNumber, tempSolutions, entryId, newValue, valueChanging)]);
    }

    /**
     * This is a helper function that create the new array with the modified values.
     * 
     * @param solutionNumber - the solution number that we are working with.
     * @param tempSolutions - a soft copy of the edit state.
     * @param entryId - the id of the 
     * @param newValue 
     * @param valueChanging  
     */
    function helperNewDropValue(solutionNumber, tempSolutions, entryId, newValue, valueChanging) {
        if(valueChanging === 'COURSE'){
            let entryArray = tempSolutions[solutionNumber].entry;
            let time = getTimeOfSection(entryArray, entryId);

            let entriesFromSameTime = getEntriesByTime(entryArray, time);
            let conflictExists = doesConflictExist(entriesFromSameTime, 'course', newValue);

            let sectionNumber = 0;
            for(let i=0; i<entryArray.length; i++){
                if(entryArray[i].course === newValue){
                    sectionNumber++;
                }
            }

            let ret;
            let newArray = entryArray.map((temp) => {
                if(temp.id === entryId){
                    if(conflictExists){
                        ret = {id: entryId, professor: temp.professor, course: -1, time: temp.time, room: temp.room, sectionNum: temp.sectionNum}
                    }
                    else {
                        ret = {id: entryId, professor: temp.professor, course: newValue, time: temp.time, room: temp.room, sectionNum: sectionNumber}
                    }
                    return ret;
                }
                else{
                    return temp;
                }
            });
            
            tempSolutions[solutionNumber].entry = newArray;
            return tempSolutions;
        }
        else if(valueChanging === 'ROOM'){
            let entryArray = tempSolutions[solutionNumber].entry;
            let time = getTimeOfSection(entryArray, entryId);

            let entriesFromSameTime = getEntriesByTime(entryArray, time);
            let conflictExists = doesConflictExist(entriesFromSameTime, 'room', newValue);

            let ret;
            let newArray = entryArray.map((temp) => {
                if(temp.id === entryId){
                    if(conflictExists){
                        ret = {id: entryId, professor: temp.professor, course: temp.course, time: temp.time, room: -1, sectionNum: temp.sectionNum}
                    }
                    else {
                        ret = {id: entryId, professor: temp.professor, course: temp.course, time: temp.time, room: newValue, sectionNum: temp.sectionNum}
                    }
                    return ret;
                }
                else{
                    return temp;
                }
            });
            
            tempSolutions[solutionNumber].entry = newArray;
            return tempSolutions;
        }
        else if(valueChanging === 'PROF'){
            let entryArray = tempSolutions[solutionNumber].entry;
            let time = getTimeOfSection(entryArray, entryId);

            let entriesFromSameTime = getEntriesByTime(entryArray, time);
            let conflictExists = doesConflictExist(entriesFromSameTime, 'professor', newValue);

            let ret;
            let newArray = entryArray.map((temp) => {
                if(temp.id === entryId){
                    if(conflictExists){
                        ret = {id: entryId, professor: -1, course: temp.course, time: temp.time, room: temp.room, sectionNum: temp.sectionNum}
                    }
                    else {
                        ret = {id: entryId, professor: newValue, course: temp.course, time: temp.time, room: temp.room, sectionNum: temp.sectionNum}
                    }
                    return ret;
                }
                else{
                    return temp;
                }
            });
            
            tempSolutions[solutionNumber].entry = newArray;
            return tempSolutions;
        }
    }

    /**
     * This function returns the time id of the entryId.
     * 
     * @param entryArray - The entry array of this solution number.
     * @param entryId - the entryId we are looking for
     * @returns the time id for this entryId
     */
    function getTimeOfSection(entryArray, entryId){
        let time;
        
        for(let i=0; i<entryArray.length; i++){
            if(entryArray[i].id === entryId){
                time = entryArray[i].time;
                return time;
            }
        }
    }
    
    /**
     * Gets all the entries by a given time.
     * 
     * @param entryArray - all the entries in this solution.
     * @param time - the time we are searching for.
     * @returns an array of all the entries for a given time.
     */
    function getEntriesByTime(entryArray, time) {
        let listOfEntriesSameTime = [];

        for(let i=0; i<entryArray.length; i++){
            if(entryArray[i].time === time){
                listOfEntriesSameTime.push(entryArray[i]);
            }
        }
        return listOfEntriesSameTime;
    }

    /**
     * Checks to see if the new drop down value has a conflict with existing values.
     * 
     * @param entriesFromSameTime - an array of entries from the same time.
     * @param element - a string value of the element we are checking.
     * @param newValue - the new value that is being changed by the dropdown.
     * @returns true if a conflict exists and false otherwise.     */
    function doesConflictExist(entriesFromSameTime, element, newValue) {
        for(let i=0; i<entriesFromSameTime.length; i++){
            if(entriesFromSameTime[i][element] === newValue) {
                if(element === 'professor'){
                    window.alert('Error! There may be a conflict with this Professor.');
                    return true;
                }
                else if(element === 'room'){
                    window.alert('Error! There may be a conflict with this Room.');
                    return true;
                }
                else if(element === 'course'){
                    window.alert('Error! There may be a conflict with this course.');
                    return true;
                }
            }
        }
        return false;
    }

    const SolutionItemDisplay = ({solutionTimes, solutionNumber}) => {
        return solutionTimes.map((solutionTime) => 
        {   
            return <SolutionItem courseEntries={solutionTime.entries}
                                time={solutionTime.time}
                                professors={professors}
                                courses={courses}
                                rooms={rooms}
                                editMode = {editMode}
                                solutionNumber = {solutionNumber}
                                onAddEditSection = {addEditSection}
                                onDeleteEditSection = {deleteEditSection}
                                onChangeDropDown = {setNewDropValue}/>
        })
    }

    const SolutionTabs = () => {

        if(!editMode){
            return tempSolutionEntries?.map((solution) =>
            {
                let solutionTimes = getTimes(solution.entry);
                return <TabPanel value = {page} index = {solution.solutionNum}>
                            <table className = "schedule">
                                <tbody>
                                    <TableHeaders></TableHeaders>

                                    <SolutionItemDisplay solutionTimes = {solutionTimes} solutionNumber = {solution.solutionNum}></SolutionItemDisplay>

                                </tbody>
                            </table>
                            <EditButtons></EditButtons>

                            <Button variant = "contained" 
                                onClick = {saveSchedule(solution,setCurrentPage)}
                                sx = {{position:'absolute', bottom:'12vh', right:'2.5vw'}}>
                                <Typography variant = "text" color="secondary">Save Schedule</Typography>
                            </Button>
                        </TabPanel>;
            })
        }
        else {
            return editSolutionEntries?.map((solution) =>
            {
                let solutionTimes = getTimes(solution.entry);

                return <TabPanel value = {page} index = {solution.solutionNum}>
                            <table className="schedule">
                                <tbody>
                                    <TableHeaders></TableHeaders>

                                    <SolutionItemDisplay solutionTimes = {solutionTimes} solutionNumber = {solution.solutionNum}></SolutionItemDisplay>

                                </tbody>
                            </table>
                            <EditButtons></EditButtons>

                        </TabPanel>;
            })
        }
    }


    useEffect(() => {
        if(document.querySelector('#simple-tabpanel-'+index) !== null){
            document.querySelector('#simple-tabpanel-'+index).scrollTop = scrollState;
        }
        console.log('USEEffect EDIT',editSolutionEntries);
        console.log('USEEffect MAIN', tempSolutionEntries);
    }, [tempSolutionEntries, editSolutionEntries, scrollState]);

    if(isAlgoCalculating){
        return(
            <Box sx = {{ 
                alignItems: 'center',
                justifyContent: 'center',}}>
                <h4>Calculating your Schedule</h4> <br />
                <CircularProgress />
            </Box>
        );
    }
    else {

        return (
            <div className = "solutions-container">
                <Box sx = {{ width: '100%'}}>
                    <Typography variant = "h5" sx = {{marginTop:'2vh', lineHeight:'2vh', marginLeft:'2.5vw', color:'primary.dark'}}>Schedule</Typography>
                    <hr/>
                </Box>

                <div className = "schedule-container">
                    {/* Tabs */}
                    <Tabs value = {page} onChange = {handleChange} aria-label = "basic tabs example">
                        {tempSolutionEntries?.map((solution) =>
                        {
                            const tabName = "Solution " + (solution.solutionNum + 1);
                            return <Tab label = {tabName} {...a11yProps(solution.solutionNum)} />;
                        }) }
                    </Tabs>

                    

                    {/* Tab panels switched based on Tabs.
                        They display different schedule solutions */}
                    <SolutionTabs></SolutionTabs>
                </div>
            </div>
        );
    }
}

export default CreateSolutionPage;