import {react, useState} from 'react';
import PropTypes from 'prop-types';
import {Popover, Button, Tabs, Tab, Box, Typography} from '@mui/material';
import './assets/styles/solution.css';

const PopoverItem = ({anchor, popoverTarget, open, handleClose, time, entry}) =>
{
    var popoverContent;  //content within popover element

    //for future updates, popoverContent can be set to elements that are fetched according to popoverTarget
    if (popoverTarget == 'course')
    {
        popoverContent = <h2>Course info</h2>;
    }
    else if (popoverTarget == 'room')
    {
        popoverContent = <h2>Room info</h2>;
    }
    else
    {
        popoverContent = <h2>Professor info</h2>;
    }


    return <Popover
                id={time+entry}
                open={open}
                anchorEl={anchor}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                {popoverContent}
            </Popover>;
}

const SolutionItem = ({courseEntries, time}) =>
{
    //handle table items click event
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverTarget, setPopoverTarget] = useState(null);

    const handleClickCourse = (event) =>
    {
        setAnchorEl(event.currentTarget);
        setPopoverTarget('course');
    };
    const handleClickRoom = (event) =>
    {
        setAnchorEl(event.currentTarget);
        setPopoverTarget('room');
    };
    const handleClickProfessor = (event) =>
    {
        setAnchorEl(event.currentTarget);
        setPopoverTarget('professor');
    };
    const handleClose = () => {setAnchorEl(null);};



    //generate items
    const item = <tr key={time} className="row">
                    <th scope="row">{time}</th>


                    {<PopoverItem anchor={anchorEl} popoverTarget={popoverTarget} open={Boolean(anchorEl)} handleClose={handleClose} time={time} entry={"blah"}/>}


                    {<td className="course-container">    {courseEntries.map((entry) => {
                        return <table key={entry.course}><tbody><tr key={entry.course} ><td>
                                    <Button className="entry-button" variant="text" onClick={handleClickCourse} color="inherit">
                                        {entry.course}
                                    </Button>
                               </td></tr></tbody></table>})}
                    </td>}

                    {<td className="room-container">      {courseEntries.map((entry) => {
                        return <table key={entry.room}><tbody><tr><td>
                                    <Button className="entry-button" variant="text" onClick={handleClickRoom} color="inherit">
                                        {entry.room}
                                    </Button>
                                                                                                </td></tr></tbody></table>})}
                    </td>}
                    {<td className="professor-container"> {courseEntries.map((entry) => {
                        return <table key={entry.professor}><tbody><tr><td>
                                    <Button className="entry-button" variant="text" onClick={handleClickProfessor} color="inherit">
                                        {entry.professor}
                                    </Button>
                               </td></tr></tbody></table>})} </td>}
                </tr>;


    return item;
}

export function Solution ()
{
    const dummyCourseEntries = {"8:15am - 9:20am": [{course:"CISC 131", room:"OSS 432", professor:"Dr. Hardt"},
                                                    {course:"CISC 480", room:"OSS 415", professor:"Dr. Sawin"}],
                                "9:35am - 10:40am":[{course:"CISC 230", room:"OSS 432", professor:"Dr. Hardt"},
                                                    {course:"CISC 130", room:"OSS 431", professor:"Dr. Yilek"},
                                                    {course:"CISC 420", room:"OSS 429", professor:"Dr. Marrinan"}],
                                };
    const keys = Object.keys(dummyCourseEntries);


    //tab states and functions
    function a11yProps(index) {return {id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}`,}}
    
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {setValue(newValue);};

    function TabPanel(props)
    {
        const { children, value, index, ...other } = props;
      
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
    
                                
    return (
        <div className="solutions-container">

            <Box sx={{ width: '100%'}}>
                <Typography variant="h5" sx={{marginTop:'2vh', lineHeight:'2vh', marginLeft:'2.5vw', color:'primary.dark'}}>Schedule</Typography>
                <hr/>
            </Box>

            <div className="schedule-container">
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Monday-Wednesday-Friday" {...a11yProps(0)} />
                <Tab label="Monday-Wednesday" {...a11yProps(1)} />
                <Tab label="Tuesday-Thursday" {...a11yProps(2)} />
            </Tabs>


            <TabPanel value={value} index={0}>
                <table className="schedule">
                    <tbody>
                        <tr className="row">
                            <th scope="col">Time</th>
                            <th scope="col">Course</th>
                            <th scope="col">Room</th>
                            <th scope="col">Professor</th>
                        </tr>

                        {keys.map((key) => {return <SolutionItem courseEntries={dummyCourseEntries[key]} time={key}/>})}
                    </tbody>
                </table>

                <h1>MWF</h1>
                <h1>MWF</h1>
                <h1>MWF</h1>
                <h1>MWF</h1>
                <h1>MWF</h1>
                <h1>MWF</h1>
                <h1>MWF</h1>
                <h1>MWF</h1>
                <h1>MWF</h1>
                <h1>MWF</h1>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <table className="schedule">
                    <tbody>
                        <tr className="row">
                            <th scope="col">Time</th>
                            <th scope="col">Course</th>
                            <th scope="col">Room</th>
                            <th scope="col">Professor</th>
                        </tr>

                        {keys.map((key) => {return <SolutionItem courseEntries={dummyCourseEntries[key]} time={key}/>})}
                    </tbody>
                </table>

                <h1>MW</h1>
            </TabPanel>

            <TabPanel value={value} index={2}>
                <table className="schedule">
                    <tbody>
                        <tr className="row">
                            <th scope="col">Time</th>
                            <th scope="col">Course</th>
                            <th scope="col">Room</th>
                            <th scope="col">Professor</th>
                        </tr>

                        {keys.map((key) => {return <SolutionItem courseEntries={dummyCourseEntries[key]} time={key}/>})}
                    </tbody>
                </table>

                <h1>TR</h1>
            </TabPanel>

            <Button variant="contained" sx={{position:'absolute', bottom:'15vh', right:'2.5vw'}}>
                <Typography variant="text" color="secondary">Generate Schedule</Typography>
            </Button>
            </div>
        </div>
    );
}

export default Solution;