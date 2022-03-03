import {React, useState} from 'react';
import {Popover, Button} from '@mui/material';
import './solution.css';

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

    const open = Boolean(anchorEl);


    //generate items
    const item = <tr className="row">
                    <th scope="row">{time}</th>

                    {<td className="course-container">    {courseEntries.map((entry) => {
                        return <table key={entry.course}><tbody><tr><td>
                                    <Button className="entry-button" variant="text" onClick={handleClickCourse} color="inherit">
                                        {entry.course}
                                    </Button>

                                    <Popover
                                        id={time+entry.course}
                                        open={open && popoverTarget == 'course'}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                                    >
                                        <h2>Course info</h2>
                                    </Popover>
                               </td></tr></tbody></table>})}
                    </td>}

                    {<td className="room-container">      {courseEntries.map((entry) => {
                        return <table key={entry.room}><tbody><tr><td>
                                    <Button className="entry-button" variant="text" onClick={handleClickRoom} color="inherit">
                                        {entry.room}
                                    </Button>

                                    <Popover
                                        id={time+entry.room}
                                        open={open && popoverTarget == 'room'}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                                    >
                                        <h2>Room info</h2>
                                    </Popover>
                                                                                                </td></tr></tbody></table>})}
                    </td>}
                    {<td className="professor-container"> {courseEntries.map((entry) => {
                        return <table key={entry.professor}><tbody><tr><td>
                                    <Button className="entry-button" variant="text" onClick={handleClickProfessor} color="inherit">
                                        {entry.professor}
                                    </Button>

                                    <Popover
                                        id={time+entry.professor}
                                        open={open && popoverTarget == 'professor'}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                                    >
                                        <h2>Professor info</h2>
                                    </Popover>
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

                                
    return (
        <div className="container">

            <div className="schedule-container">
                <table className="schedule">
                    <tbody>
                        <tr className="row">
                            <th scope="col">Time</th>
                            <th scope="col">Course</th>
                            <th scope="col">Room</th>
                            <th scope="col">Professor</th>
                        </tr>

                        <SolutionItem courseEntries={dummyCourseEntries['8:15am - 9:20am']}  time={'8:15am - 9:20am'}/>
                        <SolutionItem courseEntries={dummyCourseEntries['9:35am - 10:40am']} time={'9:35am - 10:40am'}/>
                    </tbody>
                </table>
            </div>


            <div className="menu-container">
                <h2>menubar here</h2>
            </div>
        </div>
    );
}

export default Solution;