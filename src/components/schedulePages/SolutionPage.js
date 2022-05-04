import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Popover, Button, Tabs, Tab, Box, Typography, TextField, CircularProgress, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import DataViewer from './../DataViewer.js';
import './../../assets/styles/Solution.css';

import * as SolutionService from '../../services/databaseServices/solutionDBService.js'
import * as AlgoService from './../../services/algorithmServices/mainAlgorithmService';
//const payload.data = require("../../utils/solution.json");


/**
 * automatically populates solutions items
 * @param courseEntries courses assigned to a time slot by the GenerateSolutions component
 * @param time the time slot
 * @returns a table row item containing all courses entry in a time slot
 */
const SolutionItem = ({courseEntries, time, professors, courses, rooms, editMode}) =>
{
    //console.log(courses);
    //console.log(courseEntries);
    //populate items in the time slot row 
    const item = <tr key={time} className="row">
                    <th scope="row">{time}</th>

                    {<td className="course-container">
                        {courseEntries.map((entry) =>
                            {
                                //get course name
                                var name;
                                if (courses.filter((item) => item.id === entry.course)[0] != undefined)
                                {
                                    name = Object.entries(courses.filter((item) => item.id === entry.course)[0]);
                                    console.log('Name', name);
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
    const [isAlgoCalculating, setIsAlgoCalculating]= useState(true);

    const [editMode, setEditMode] = useState(false);

    function updateNumSolutions(num)
    {
        setNumSolutions(num);
    }

    function updateTopSolutions(num) {
        setTopSolutions(num);
    }

    function getNewSolution() {
        setIsAlgoCalculating(true);
        AlgoService.createJsonOfSelectedStates(selectedCourses, selectedRooms, selectedProfessors, selectedLabs, 300, 2);
    }

    //dummy data
    // professors = 
    // [
    //     {
    //         "id": 1,
    //         "name": "Dr. Hardt",
    //         "canTeach": [],
    //         "courseLoad": "16"
    //     },

    //     {
    //         "id": 2,
    //         "name": "Dr. Marrinan",
    //         "canTeach": [],
    //         "courseLoad": "8"
    //     }
    // ];

    // courses = 
    // [
    //     {
    //         "id": 1,
    //         "name": "data",
    //         "credits": "4",
    //         "capacity": "23",
    //         "sections": "2"
    //     },
    //     {
    //         "id": 2,
    //         "name": "capstone",
    //         "credits": "4",
    //         "capacity": "20",
    //         "sections": "1"
    //     }
    // ];

    // rooms = 
    // [
    //     {
    //         "id": 1,
    //         "name": "room 1",
    //         "capacity": "22",
    //         "tech": []
    //     },

    //     {
    //         "id": 2,
    //         "name": "room 2",
    //         "capacity": "25",
    //         "tech": []
    //     }
    // ];

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
        console.log(solutionEntries);
        //setTempState([]);
        setTempSolutionEntries(solutionEntries);
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

    function editSolution() {
        setEditMode(true);
    }

    function saveEdits() {
        setEditMode(false);
    }

    function EditButtons() {
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
                <Button variant="contained"
                    onClick={saveEdits}
                    sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                    <Typography variant="text" color="secondary">Save Edits</Typography>
                </Button>
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

    
    useEffect(() => {
        //console.log(tempSolutionEntries);
    }, [tempSolutionEntries]); 
    
    if(isAlgoCalculating){
        return(
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',}}>
                Calculating your Schedule
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
                        {console.log('Solution', tempSolutionEntries)}
                        {tempSolutionEntries?.map((solution) =>
                        {
                            const tabName = "Solution " + (solution.solutionNum + 1);
                            return <Tab label={tabName} {...a11yProps(solution.solutionNum)} />;
                        }) }
                    </Tabs>

                    

                    {/* Tab panels switched based on Tabs.
                        They display different schedule solutions */}
                    {tempSolutionEntries?.map((solution) =>
                        {
                            console.log(solution);
                            let solutionTimes = getTimes(solution.entry);
                            console.log(solutionTimes);
                            return <TabPanel value={page} index={solution.solutionNum}>
                                        <table className="schedule">
                                            <tbody>
                                                <tr className="row">
                                                    <th scope="col">Time</th>
                                                    <th scope="col">Course</th>
                                                    <th scope="col">Room</th>
                                                    <th scope="col">Professor</th>
                                                </tr>

                                                {solutionTimes.map((solutionTime) =>
                                                    {
                                                        return <SolutionItem courseEntries={solutionTime.entries}
                                                                            time={solutionTime.time}
                                                                            professors={professors}
                                                                            courses={courses}
                                                                            rooms={rooms}
                                                                            editMode = {editMode}
                                                                />
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <EditButtons></EditButtons>

                                        <Button variant="contained" 
                                            onClick={saveSchedule(solution)}
                                            sx={{position:'absolute', bottom:'12vh', right:'2.5vw'}}>
                                            <Typography variant="text" color="secondary">Save Solution</Typography>
                                        </Button>
                                    </TabPanel>;
                        }
                    )}

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