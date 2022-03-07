import {React, useState} from 'react';
import {Popover, Button} from '@mui/material';
import './solution.css';

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
                                
    return (
        <div className="table-container">

            <div className="schedule-container">
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
            </div>
        </div>
    );
}

export default Solution;