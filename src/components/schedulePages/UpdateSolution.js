import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Popover, Button, Tabs, Tab, Box, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import DataViewer from './../DataViewer.js';
import './../../assets/styles/Solution.css';

import * as SolutionService from '../../services/databaseServices/solutionDBService.js'
//const solutionData = require("../../utils/solution.json");


/**
 * automatically populates solutions items
 * @param courseEntries courses assigned to a time slot by the GenerateSolutions component
 * @param time the time slot
 * @returns a table row item containing all courses entry in a time slot
 */
const SolutionItem = ({courseEntries, time, professors, courses, rooms}) =>
{
    function getCantorPairing(a, b){
        return (a + b) * (a + b + 1) / 2 + a;
    }
    
    //console.log(courses);
    console.log('Solution Entries', courseEntries);
    //populate items in the time slot row 
    const item = <tr key={time} className="row">
                    <th scope="row">{time}</th>

                    {<td className="course-container">
                        {courseEntries.map((entry) =>
                            {
                                //get course name
                                var name;
                                let courseId = getCantorPairing(entry.dept_id, entry.class_num);
                                if (courses.filter((item) => item.id === courseId)[0] != undefined)
                                {
                                    name = Object.entries(courses.filter((item) => item.id === courseId)[0]);
                                    console.log('Name', name);
                                    name = name[1][1] + " " + name[2][1];
                                }

                                //return table entry
                                return <table key={courseId}><tbody><tr key={courseId} ><td>
                                            <DataViewer id={courseId} dataState={courses} sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                                                <Button className="entry-button" variant="text"color="inherit">
                                                    {name}
                                                </Button>
                                            </DataViewer>
                                    </td></tr></tbody></table>
                            })
                        }
                    </td>}

                    {<td className="room-container">
                        {courseEntries.map((entry) =>
                            {
                                //get room name
                                var name;
                                if (rooms.filter((item) => item.id === entry.room_id)[0] != undefined)
                                {
                                    name = Object.entries(rooms.filter((item) => item.id === entry.room_id)[0]);
                                    //console.log('Name', name);
                                    name = name[1][1] + " " + name[2][1];
                                }

                                //return table entry
                                return <table key={entry.room_id}><tbody><tr key={entry.room_id} ><td>
                                            <DataViewer id={entry.room_id} dataState={rooms} sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                                                <Button className="entry-button" variant="text"color="inherit">
                                                    {name}
                                                </Button>
                                            </DataViewer>
                                    </td></tr></tbody></table>
                                })
                        }
                    </td>}

                    {<td className="professor-container">
                        {courseEntries.map((entry) =>
                            {
                                //get professor name
                                var name;
                                if (professors.filter((item) => item.id === entry.professor_id)[0] != undefined)
                                {
                                    name = Object.entries(professors.filter((item) => item.id === entry.professor_id)[0]);
                                    name = name[1][1];
                                }

                                //return table entry
                                return <table key={entry.professor_id}><tbody><tr key={entry.professor_id} ><td>
                                            <DataViewer id={entry.professor_id} dataState={professors} sx={{position:'absolute', bottom:'12vh', left:'2.5vw'}}>
                                                <Button className="entry-button" variant="text"color="inherit">
                                                    {name}
                                                </Button>
                                            </DataViewer>
                                    </td></tr></tbody></table>
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
export function UpdateSolution ({professors, courses, rooms, times})
{  
    const [tempState, setTempState] = useState([]);
    const [tempSolutionEntries, setTempSolutionEntries] = useState();
    
    const dummyData = [
        {
            "section_id": 36,
            "section_num": 0,
            "class_num": 124,
            "dept_id": 1,
            "room_id": 49,
            "professor_id": 51,
            'time_slot_id': 1,
            "plan_id": 41
          },
          {
            "section_id": 37,
            "section_num": 0,
            "class_num": 101,
            "dept_id": 1,
            "room_id": 47,
            "professor_id": 57,
            'time_slot_id': 2,
            "plan_id": 41
          },
          {
            "section_id": 38,
            "section_num": 0,
            "class_num": 123,
            "dept_id": 1,
            "room_id": 33,
            "professor_id": 59,
            'time_slot_id': 4,
            "plan_id": 41
          }
    ]

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
    window.DB.receive('fromMain:SecondaryPlan', (payload) => {
        console.log(payload);
        //solutionEntries.push({"solutionName": payload.planName, "entry": payload.data});
        solutionEntries.push({"solutionName": payload.planName, "entry": dummyData});

        setTempSolutionEntries(solutionEntries);
    });

    // for (let i=0; i<solutionData.length; i++)
    // {
    //     if (i > 10) {break;}
    //     solutionEntries.push({"solutionNum": i, "entry": solutionData[i]});
        
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
                if (entry.time_slot_id == solutionTime.id)
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
    }, []);   

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
                        const tabName = solution.solutionName;
                        return <Tab label={tabName} {...a11yProps(0)} />;
                    }) }
                </Tabs>

                

                {/* Tab panels switched based on Tabs.
                    They display different schedule solutions */}
                {tempSolutionEntries?.map((solution) =>
                    {
                        console.log(solution);
                        let solutionTimes = getTimes(solution.entry);
                        console.log(solutionTimes);
                        return <TabPanel value={page} index={0}>
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
                                                    console.log(solutionTime);
                                                    return <SolutionItem courseEntries={solutionTime.entries}
                                                                         time={solutionTime.time}
                                                                         professors={professors}
                                                                         courses={courses}
                                                                         rooms={rooms}
                                                            />
                                                })
                                            }
                                        </tbody>
                                    </table>

                                    <Button variant="contained" 
                                        sx={{position:'absolute', bottom:'12vh', right:'17vw'}}>
                                        <Typography variant="text" color="secondary">Update Existing</Typography>
                                    </Button>

                                    <Button variant="contained" 
                                        onClick={saveSchedule(solution)}
                                        sx={{position:'absolute', bottom:'12vh', right:'2.5vw'}}>
                                        <Typography variant="text" color="secondary">Save As New Plan</Typography>
                                    </Button>
                                </TabPanel>;
                    }
                )}

                {/*{/* generate schedule button }
                <Button variant="contained" sx={{position:'absolute', bottom:'12vh', right:'2.5vw'}}>
                    <Typography variant="text" color="secondary">Generate Schedule</Typography>
                </Button>*/}

            </div>
        </div>
    );
}

export default UpdateSolution;