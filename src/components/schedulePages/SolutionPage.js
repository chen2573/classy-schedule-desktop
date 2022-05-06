import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Popover, Button, Tabs, Tab, Box, Typography, TextField, CircularProgress, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaTimes, FaPencilAlt} from 'react-icons/fa';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import DataViewer from './../DataViewer.js';
import './../../assets/styles/Solution.css';

import * as SolutionService from '../../services/databaseServices/solutionDBService.js'
import * as AlgoService from './../../services/algorithmServices/mainAlgorithmService';
import { TempleHinduSharp } from '@mui/icons-material';
//const payload.data = require("../../utils/solution.json");




/**
 * automatically populates solutions items
 * @param courseEntries courses assigned to a time slot by the GenerateSolutions component
 * @param time the time slot
 * @returns a table row item containing all courses entry in a time slot
 */
const SolutionItem = ({courseEntries, time, professors, courses, rooms, editMode, onAddEditSection, onDeleteEditSection, solutionNumber}) =>
{
    console.log("Entries", courseEntries);
    //console.log("Item", solutionNumber);

    const TimeDisplay = ({time, editMode, solutionNumber, onAddEditSection}) => {
        if(!editMode) {
            return <th scope="row">{time}</th>
        }
        else {
            return <><th scope="row">
                        {time} 
                        <br></br> 
                        <div class="tooltip" onClick={() => onAddEditSection(time, solutionNumber)}>
                            <AddCircleSharpIcon></AddCircleSharpIcon>
                            <span class="tooltiptext">Add Section</span> 
                        </div>
                    </th></>
        }
    }

    const DeleteColumnElement = ({entries}) => {
        return (entries.map((entry) =>
        {
            return(
            <table ><tbody><tr  ><td>
                <div className="tooltip checkbox-div" onClick={() => onDeleteEditSection(time, solutionNumber, entry.id)}>
                <DeleteIcon size="large" inputProps={{ 'aria-label': 'controlled' }}/>
                    <span className="tooltiptext">Delete Section</span> 
                </div>    
            </td></tr></tbody></table>)
            
                
        }))

    }

    const DeleteColumn = ({entries, editMode}) => {
        if(editMode) {
            return (
                <td className="delete-row-container">
                    <DeleteColumnElement entries={entries}></DeleteColumnElement>
                </td>
            )
        }
        else {
            return <></>
        }
    }

    //console.log(courses);
    //console.log(courseEntries);
    //populate items in the time slot row 
    const item = <tr key={time} className="row">
                    <TimeDisplay time={time} editMode={editMode} onAddEditSection={onAddEditSection} solutionNumber={solutionNumber}></TimeDisplay>

                    {<td className="course-container">
                        {courseEntries.map((entry) =>
                            {
                                //get course name
                                var name;
                                if (courses.filter((item) => item.id === entry.course)[0] != undefined)
                                {
                                    name = Object.entries(courses.filter((item) => item.id === entry.course)[0]);
                                    //console.log('Name', name);
                                    name = name[1][1] + " " + name[2][1];
                                }

                                //return table entry
                                if(!editMode){
                                    return <table key={entry.course}><tbody><tr key={entry.course} ><td>
                                                <DataViewer id={entry.course} dataState={courses} sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                                                    <Button className="entry-button" variant="text"color="inherit">
                                                        {name}
                                                    </Button>
                                                </DataViewer>
                                        </td></tr></tbody></table>
                                }
                                else {
                                    return <table key={entry.course}><tbody><tr key={entry.course} ><td>
                                    <FormControl fullWidth>
                                        <InputLabel shrink id="label">Course</InputLabel>
                                        <Select
                                        labelId="label"
                                        id='course_dropdown'
                                        notched
                                        MenuProps={{sx: {
                                            "&& .Mui-selected": {
                                            backgroundColor: "#90A4AE"
                                            }
                                        }}}
                                        value={entry.course}
                                        label="Course Name"
                                        onChange={(e) => console.log(e.target.value)}
                                        >
                                        {courses.map(course => (
                                            <MenuItem 
                                            key={course.id} 
                                            value={course.id}
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
                                if (rooms.filter((item) => item.id === entry.room)[0] != undefined)
                                {
                                    name = Object.entries(rooms.filter((item) => item.id === entry.room)[0]);
                                    //console.log('Name', name);
                                    name = name[1][1] + " " + name[2][1];
                                }

                                //return table entry
                                if(!editMode){
                                    return <table key={entry.room}><tbody><tr key={entry.room} ><td>
                                                <DataViewer id={entry.room} dataState={rooms} sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                                                    <Button className="entry-button" variant="text"color="inherit">
                                                        {name}
                                                    </Button>
                                                </DataViewer>
                                        </td></tr></tbody></table>
                                }
                                else {
                                    return <table key={entry.room}><tbody><tr key={entry.room} ><td>
                                    <FormControl fullWidth>
                                        <InputLabel shrink id="label">Room</InputLabel>
                                        <Select
                                        labelId="room-label"
                                        id='room_dropdown'
                                        notched
                                        MenuProps={{sx: {
                                            "&& .Mui-selected": {
                                            backgroundColor: "#90A4AE"
                                            }
                                        }}}
                                        value={entry.room}
                                        label="Room"
                                        onChange={(e) => console.log(e.target.value)}
                                        >
                                        {rooms.map(room => (
                                            <MenuItem 
                                            key={room.id} 
                                            value={room.id}
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
                                if (professors.filter((item) => item.id === entry.professor)[0] != undefined)
                                {
                                    name = Object.entries(professors.filter((item) => item.id === entry.professor)[0]);
                                    name = name[1][1];
                                }

                                //return table entry
                                if(!editMode){
                                    return <table key={entry.professor}><tbody><tr key={entry.professor} ><td>
                                                <DataViewer id={entry.professor} dataState={professors} sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                                                    <Button className="entry-button" variant="text"color="inherit">
                                                        {name}
                                                    </Button>
                                                </DataViewer>
                                        </td></tr></tbody></table>
                                }
                                else {
                                    return <table key={entry.professor}><tbody><tr key={entry.professor} ><td>
                                    <FormControl fullWidth>
                                        <InputLabel shrink id="label">Professor</InputLabel>
                                        <Select
                                        labelId="prof-label"
                                        id='prof_dropdown'
                                        notched
                                        MenuProps={{sx: {
                                            "&& .Mui-selected": {
                                            backgroundColor: "#90A4AE"
                                            }
                                        }}}
                                        value={entry.professor}
                                        label="Professor"
                                        onChange={(e) => console.log(e.target.value)}
                                        >
                                        {professors.map(professor => (
                                            <MenuItem 
                                            key={professor.id} 
                                            value={professor.id}
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
                    
                    <DeleteColumn entries={courseEntries} editMode={editMode}></DeleteColumn>

                </tr>;


    return item;
}


/**
 * This is the main component of the page. It returns the whole solutions page
 * it calls GenerateSolutions and populates the solutions table within each of the
 * weekdays.
 * @param professors professors state
 * @param courses courses state
 * @param rooms rooms state
 * @returns the solutions page
 */
export function SolutionPage ({professors, courses, rooms, times})
{  
    const [tempState, setTempState] = useState([]);
    const [tempSolutionEntries, setTempSolutionEntries] = useState();
    const [numSolutions, setNumSolutions] = useState(300);
    const [topSolutions, setTopSolutions] = useState(3);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [selectedProfessors, setSelectedProfessors] = useState([]);
    const [selectedLabs, setSelectedLabs] = useState([]);
    const [editSolutionEntries, setEditSolutionEntries] = useState(tempSolutionEntries);

    const [isAlgoCalculating, setIsAlgoCalculating]= useState(true);
    const [editMode, setEditMode] = useState(false);


    function getNewSolution() {
        setIsAlgoCalculating(true);
        AlgoService.createJsonOfSelectedStates(selectedCourses, selectedRooms, selectedProfessors, selectedLabs, 300, 2);
    }

    times = 
    [
        {
            "id": 1,
            "time": "MWF 8:15am",
            "partOfDay": "morning"
        },

        {
            "id": 2,
            "time": "TR 1:30pm",
            "partOfDay": "afternoon"
        }
        ,
        {
            "id": 3,
            "time": "MWF 10:55am",
            "partOfDay": "morning"
        },
        {
            "id": 4,
            "time": "TR 12:00pm",
            "partOfDay": "afternoon"
        }
    ];
    
    const solutionEntries = [];
    window.DB.receive('fromMain:Algo', (payload) => {
        //get solutions entries
        //console.log(payload.data);
        for (let i=0; i<payload.data.length; i++)
        {
            if (i > 10) {break;}
            if(payload.data[i] != null){
                solutionEntries.push({"solutionNum": i, "entry": payload.data[i]});
            }
        }
        //console.log(solutionEntries);
        //setTempState([]);
        setTempSolutionEntries(solutionEntries);
        setEditSolutionEntries(solutionEntries);

        setSelectedCourses(payload.setCourses);
        setSelectedProfessors(payload.setProfessors);
        setSelectedRooms(payload.setRooms);
        setSelectedLabs(payload.setLabs);

        setIsAlgoCalculating(false);
    });

    // for (let i=0; i<payload.data.length; i++)
    // {
    //     if (i > 10) {break;}
    //     solutionEntries.push({"solutionNum": i, "entry": payload.data[i]});
        
    // }



    //get solutions items sorted by time so we can display them chronologically in the table
    const getTimes = (solution) =>
    {
        let solutionTimes = [];
        console.log(solution);

        for (let time of times)
        {
            solutionTimes.push({"id":time.id, "time": time.time, "entries":[]});
        }//get all entries in times

        for (let solutionTime of solutionTimes)
        {
            for (let entry of solution)
            {
                if (entry.time == solutionTime.id)
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
            if(times[i].time == timeString){
                return times[i].id;
            }
        }
    }


    //tab states and functions


    function a11yProps(index) {return {id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}`,}}

    const [page, setPage] = useState(0);
    const handleChange = (event, newPage) => {setPage(newPage);};

    /**
     * This is an individual tabpanel page
     * @param props 
     * @returns a tabpannel page with elements wrapped inside
     */
    function TabPanel(props)
    {
        const { children, value, index, ...other } = props;     //load props and children wrapped within TabPanel
      
        return (
          <div
            className="tab-pannel-container"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (<Box sx={{ p: 3 }}>{children}</Box>)}
          </div>
        );
    }

    //====== Edit Flow Functions ===============
    function editSolution() {
        setEditMode(true);
    }

    function saveEdits() {
        setTempSolutionEntries(editSolutionEntries);
        setEditMode(false);
    }

    function cancelEdits() {
        setEditSolutionEntries(tempSolutionEntries);
        setEditMode(false);
    }
    //===========================================



    const EditButtons = () => {
        if(!editMode) {
            return (
                <Button variant="contained"
                    onClick={editSolution}
                    sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                    <Typography variant="text" color="secondary">Edit Solution</Typography>
                </Button>
            )
        }
        else {
            return (
                <div>
                    <Button variant="contained"
                        onClick={saveEdits}
                        sx={{position:'absolute', bottom:'12vh', left:'13.5vw'}}>
                        <Typography variant="text" color="secondary">Save Edits</Typography>
                    </Button>
                    <Button variant="contained"
                        onClick={cancelEdits}
                        sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                        <Typography variant="text" color="secondary">Cancel Edits</Typography>
                    </Button>
                </div>
            )
        }
    }
      
    TabPanel.propTypes = {children: PropTypes.node, index: PropTypes.number.isRequired, value: PropTypes.number.isRequired};

    //================ Saving Schedule Functions ==============================
    const saveSchedule = (solution) => () => {
        SolutionService.createPlan(solution, professors, courses, rooms).then((data) => {
            //SolutionService.saveScheduleToPlan()
            console.log(data);
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
     * This function is attached to the add symbol in the Time column. This function is designed to add a section into
     * a specified time slot. With the help with the helper function we are able to do this.
     * 
     * https://www.youtube.com/watch?v=0iNDB-2fg8A&ab_channel=WebDevJunkie 
     * This video helped me solve the issue of the parent component not rendering when I wanted it to.
     * @param timeString - the string found in the time object
     * @param solutionNumber - the solution number we are working with
     */
    function addEditSection(timeString, solutionNumber){
        let tempSolutions = editSolutionEntries;
        
        setEditSolutionEntries([...helperAddEditSection(timeString, solutionNumber, tempSolutions)]);
        //console.log('Temp', tempSolutions);
    }

    /**
     * 
     * @param timeString - the time period to add the section
     * @param solutionNumber - the solution number we are working with.
     * @param tempSolutions = a soft copy of the state variable of edit solutions.
     * @returns 
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
        /**
         * Desired structure =>
         * temp = [{..}, {..}] =>
         * temp[0] = {solutionNum: 0, entry:Array(2)}
         * temp[0].entry[0] = {professor: 51, course: 7876, time: 4, room: 6}
         * 
         * temp[solutionNumber].entry.push(newEntry)
         */
        let tempEntryArray = tempSolutions[solutionNumber].entry
        tempEntryArray.push(newEntry);

        tempSolutions[solutionNumber].entry = tempEntryArray;
        return tempSolutions;
    }

    function deleteEditSection(timeString, solutionNumber, entryId){
        let tempSolutions = editSolutionEntries;
        console.log(tempSolutions);
        
        setEditSolutionEntries([...helperDeleteEditSection(timeString, solutionNumber, tempSolutions, entryId)]);
        //console.log('Temp', tempSolutions);
    }

    function helperDeleteEditSection(timeString, solutionNumber, tempSolutions, entryId) {

        let entryArray = tempSolutions[solutionNumber].entry
        let tempEntryArray = entryArray.filter((entry) => entry.id != entryId);

        tempSolutions[solutionNumber].entry = tempEntryArray;

        return tempSolutions;
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
                                onDeleteEditSection = {deleteEditSection}/>
        })
    }

    const SolutionTabs = () => {

        if(!editMode){
            return tempSolutionEntries?.map((solution) =>
            {
                //console.log('tempSolutionEntries', tempSolutionEntries);
                //console.log(solution);
                let solutionTimes = getTimes(solution.entry);
                console.log(solutionTimes);
                return <TabPanel value={page} index={solution.solutionNum}>
                            <table className="schedule">
                                <tbody>
                                    <TableHeaders></TableHeaders>

                                    <SolutionItemDisplay solutionTimes={solutionTimes} solutionNumber={solution.solutionNum}></SolutionItemDisplay>

                                </tbody>
                            </table>
                            <EditButtons></EditButtons>

                            <Button variant="contained" 
                                onClick={saveSchedule(solution)}
                                sx={{position:'absolute', bottom:'12vh', right:'2.5vw'}}>
                                <Typography variant="text" color="secondary">Save Solution</Typography>
                            </Button>
                        </TabPanel>;
            })
        }
        else {
            return editSolutionEntries?.map((solution) =>
            {
                console.log('EDITSolutionEntries', editSolutionEntries);
                //console.log(solution);
                let solutionTimes = getTimes(solution.entry);
                //console.log(solutionTimes);
                return <TabPanel value={page} index={solution.solutionNum}>
                            <table className="schedule">
                                <tbody>
                                    <TableHeaders></TableHeaders>

                                    <SolutionItemDisplay solutionTimes={solutionTimes} solutionNumber={solution.solutionNum}></SolutionItemDisplay>

                                </tbody>
                            </table>
                            <EditButtons></EditButtons>

                        </TabPanel>;
            })
        }
    }


    useEffect(() => {
        console.log('USEEffect',editSolutionEntries);
    }, [tempSolutionEntries, editSolutionEntries]);

    if(isAlgoCalculating){
        return(
            <Box sx={{ 
                alignItems: 'center',
                justifyContent: 'center',}}>
                <h4>Calculating your Schedule</h4> <br />
                <CircularProgress />
            </Box>
        );
    }
    else {
        return (
            <div className="solutions-container">
                <Box sx={{ width: '100%'}}>
                    <Typography variant="h5" sx={{marginTop:'2vh', lineHeight:'2vh', marginLeft:'2.5vw', color:'primary.dark'}}>Schedule</Typography>
                    <hr/>
                </Box>

                <div className="schedule-container">
                    {/* Tabs */}
                    <Tabs value={page} onChange={handleChange} aria-label="basic tabs example">
                        {/*console.log('Solution', tempSolutionEntries)*/}
                        {tempSolutionEntries?.map((solution) =>
                        {
                            const tabName = "Solution " + (solution.solutionNum + 1);
                            return <Tab label={tabName} {...a11yProps(solution.solutionNum)} />;
                        }) }
                    </Tabs>

                    

                    {/* Tab panels switched based on Tabs.
                        They display different schedule solutions */}
                    <SolutionTabs></SolutionTabs>

                    {/* settings 
                    <PopupState variant="popover">
                        {(popupState) => (
                            <React.Fragment>
                                <Button variant="contained"
                                        {...bindTrigger(popupState)} 
                                        sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                                    <Typography variant="text" color="secondary">Settings</Typography>
                                </Button>

                                <Popover {...bindMenu(popupState)}
                                    anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                                    transformOrigin={{vertical: 'bottom', horizontal: 'left'}}
                                    sx={{width:"15%"}}>
                                    <Box>
                                        <TextField InputLabelProps={{ shrink: true }} fullWidth id="Number of Solutions Considered"
                                                label="Number of Solutions Considered" variant="outlined"
                                                value={numSolutions}
                                                sx={{margin:"5%", width:"90%"}}/>

                                        <TextField InputLabelProps={{ shrink: true }} fullWidth id="Top Solutions Returned"
                                                label="Top Solutions Returned" variant="outlined"
                                                value={topSolutions}
                                                sx={{margin:"5%", width:"90%"}}/>

                                    <Button variant="contained" onClick={getNewSolution}>
                                        <Typography variant="text" color="secondary">Update Settings</Typography>
                                    </Button>

                                    </Box>
                                        
                                </Popover>
                            </React.Fragment>
                        )}
                    </PopupState>*/}
                </div>
            </div>
        );
    }
}

export default SolutionPage;