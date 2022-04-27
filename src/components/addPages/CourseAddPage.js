import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, TextField } from '@mui/material';
//import { AsyncTaskManager } from 'builder-util';
import { React, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './../../assets/styles/HomePage.css';
import './../../assets/styles/SideNav.css';
import './../../assets/styles/AddPages.css';
import SideNavigation from './../SideNavigation.js';
import TopBar from './../TopBar.js'
import DataViewer from '../DataViewer';



// Styling
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    sx: {
        "&& .Mui-selected": {
            backgroundColor: "#90A4AE"
        }
    },
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    }
};

/**
 * This function works in tandem to other validating functions
 * This updates state with the passed state setter iff the passed validate function returns true
 * 
 * @param validateFN  - Validating function
 * @param stateSetter - State updating function
 */
 const validate = (validateFN, stateSetter) => e => {
    stateSetter(oldValue => validateFN(e.target.value) ? e.target.value : oldValue);
  }

/**
 * This component represents the form that will be used by the user to enter in new course data.
 * @param onAddCourse - the addSubmit function that is passed down from App.js
 * @param programs - the programs that is passed down from App.js
 * @returns - the component that represents the form that will be used by the user to enter in new course data.
 */
const CourseAdd = ({ onAddCourse, programs }) => {
    const [program, setProgram] = useState('');
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [credits, setCredits] = useState('');
    const [capacity, setCapacity] = useState('');
    const [length, setLength] = useState('');
    const [tech, setTech] = useState([]);

    // Course Name must be less than 50 characters and have no numbers
    const validNameLength = name => name.length < 51;
    const validNameChar = val => [...val.matchAll(/(^[^0-9]+$)?/g)].some(x => x[0] == val) || val === '';
    const validName = name => validNameLength(name) && validNameChar(name)
    // This function calls passes other functions to validate
    const validateName = validate(validName, setName);

    // Course Number must be a value between 100 and 999
    // FIX LOWER BOUND
    const validNumber = val => [...val.matchAll(/([1-9][0-9][0-9]|[1-9][0-9]|[1-9])?/g)].some(x => x[0] == val) || val === '';
    // This function calls passes other functions to validate
    const validateNumber = validate(validNumber, setNumber);

    // Credits must be a integer between 0 and 4
    const validCredits = val => [...val.matchAll(/([0-4])?/g)].some(x => x[0] == val) || val === '';
    // This function calls passes other functions to validate
    const validateCredits = validate(validCredits, setCredits);

    // Course Capacity must be a value between 0 and 1000
    const validCapacity = val => [...val.matchAll(/(1000|[1-9][0-9][0-9]|[1-9][0-9]|[0-9])?/g)].some(x => x[0] == val) || val === '';
    // This function calls passes other functions to validate
    const validateCapacity = validate(validCapacity, setCapacity);

    // Meeting Length (I'm not sure what constraints are for this)
    const validLength = val => [...val.matchAll(/(200|1[0-9][0-9]|[1-9][0-9]|[1-9])?/g)].some(x => x[0] == val) || val === '';
    // This function calls passes other functions to validate
    const validateLength = validate(validLength, setLength);

    /**
     * This function handles changes on the Technology dropdown
     * 
     * @param e - onChange event
     */
    const handleTechChange = (e) => {
        const {
            target: { value },
        } = e;
        setTech(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const onSubmit = (e) => {
        e.preventDefault();
        e.target.reset();

        if (!program) {
            alert('Please enter a program');
            return;
        }
        if (!number) {
            alert('Please enter the course number');
            return;
        }
        if (!name) {
            alert('Please enter a course name');
            return;
        }
        if (!credits) {
            alert('Please enter the number of credits');
            return;
        }
        if (!capacity) {
            alert('Please enter the course capacity');
            return;
        }
        if (!tech) {
            alert('Please enter the technology the course will need');
            return;
        }
        if (!length) {
            alert('Please enter the meeting length for the course');
            return;
        }

        onAddCourse({program, number, name, credits, capacity, tech, length});

        setCapacity('');
        setProgram('');
        setNumber('');
        setName('');
        setCredits('');
        setLength('');
        setTech([]);
    }

    return (
        <div className='container'>
            <h2>Add A Class</h2>
            <form onSubmit={onSubmit}>

                <br></br>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel shrink id="label">Program</InputLabel>
                        <Select
                        labelId="label"
                        id='program_dropdown'
                        notched
                        MenuProps={{sx: {
                            "&& .Mui-selected": {
                              backgroundColor: "#90A4AE"
                            }
                        }}}
                        value={program}
                        label="Program"
                        onChange={(e) => setProgram(e.target.value)}
                        >
                        {programs.map(p => (
                            <MenuItem 
                            key={p.id} 
                            value={p.programName}
                            >
                            {p.programName}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Box>

                <br></br>

                <br></br>

                <Box>
                    <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_course_number" label="Course Number" variant="outlined" value={number} onChange={validateNumber}/>
                </Box>

                <br></br>

                <Box>
                    <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_course_name" label="Course Name" variant="outlined" value={name} onChange={validateName}/>
                </Box>

                <br></br>

                <Box>
                    <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_number_of_credits" label="Credits" variant="outlined" value={credits} onChange={validateCredits}/>
                </Box>

                <br></br>

                <Box>
                    <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_student_capacity" label="Student Capacity" variant="outlined" value={capacity} onChange={validateCapacity}/>
                </Box>

                <br></br>

                <Box>
                    <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_meeting_length" label="Meeting Length" variant="outlined" value={length} onChange={validateLength}/>
                </Box>

                <br></br>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel shrink id="label">Required Technology</InputLabel>
                        <Select
                        labelId="label"
                        id='technology_dropdown'
                        multiple
                        notched
                        onChange={handleTechChange}
                        value={tech}
                        label="Required Technology"
                        input={<OutlinedInput id="select-multiple-chip" label="Required Technology" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                        >
                            <MenuItem value="Desktop Computers" >Desktop Computers</MenuItem>
                            <MenuItem value="Laptop Computers" >Laptop Computers</MenuItem>
                            <MenuItem value="Projector" >Projector</MenuItem>
                            <MenuItem value="Whiteboard" >Whiteboard</MenuItem>
                            <MenuItem value="Chalkboard" >Chalkboard</MenuItem>
                            <MenuItem value="Robots" >Robots</MenuItem>
                            <MenuItem value="Zoom peripherals" >Zoom peripherals</MenuItem>
                            <MenuItem value="Instructor Computer" >Instructor Computer</MenuItem>
                            <MenuItem value="Net Controls" >Net Controls</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <br></br>

                <input type="submit" value='Save Course' className='btn btn-block' />
            </form>
        </div>
    );
}

/**
 * This component is a view that lists out individual CourseListItems.
 * @param courses - The state of courses that is passed down from App.js
 * @param onDelete - The delete function that is passed down from App.js
 * @returns - The component that is a view listing out the CourseListItems
 */
const CourseList = ({ courses, onDelete }) => {
    return (
        <div className='container'>
            {courses.map((currentCourse, index) => (
                <CourseListItem key={index} course={currentCourse}
                    onDelete={onDelete} courses={courses} />
            ))}
        </div>
    );
}


/**
 * The component that will display an individual course. These components will populate the CourseList component.
 * @param course - an individual course
 * @param onDelete - The delete function that is passed down from App.js
 * @returns - The component displaying an individual course.
 */
const CourseListItem = ({ course, onDelete, courses }) => {
    return (
        <div className='item'>
        <FaTimes style={{color: 'red', cursor: 'pointer', float:"right"}} onClick={() => onDelete(course.id)}/>
        <DataViewer id={course.id} dataState={courses} sx={{position:'absolute'}}>
             <h3>{course.program} {course.number}</h3>
            {/* This stuff in the paragraph tag will become popover*/}
            <p><em>Course Name</em> : {course.name}<br /></p>
        </DataViewer>
        </div>
    );
}

/**
 * This page will have an Add form and list the Courses that have been added and
 * the courses that are in the database.
 * @param onAddCourse - the function 'addCourse' from App.js that will fire when the CourseAddPage is submitted
 * @param courses - the state of courses passed from App.js
 * @param onDelete - the function 'onDelete' from App.js that will fire when the onclick happens
 * @param programs - the state of programs passed from App.js
 * @returns - The exported component
 */
 const CourseAddPageContent = ({ onAddCourse, courses, onDelete, programs }) => {
    return (
        <div className="home">
            <div className='element-page'>
                <CourseAdd onAddCourse={onAddCourse} programs={programs} />
                <CourseList onDelete={onDelete} courses={courses} />
            </div>
        </div>
    );
}

/**
 * The component that will be exported. This page will have an Add form and list the Courses that have been added and
 * the courses that are in the database.
 * @param onAddCourse - the function 'addCourse' from App.js that will fire when the CourseAddPage is submitted
 * @param courses - the state of courses passed from App.js
 * @param onDelete - the function 'onDelete' from App.js that will fire when the onclick happens
 * @param programs - the state of programs passed from App.js
 * @returns - The exported component
 */
const CourseAddPage = ({ onAddCourse, courses, onDelete, programs }) => {
    return (
        <div>
            <SideNavigation></SideNavigation>

            <div id="main">
                <div className="main-div">
                    <TopBar></TopBar>

                    <div className="container-home">
                    <CourseAddPageContent onAddCourse={onAddCourse} courses={courses} onDelete={onDelete} programs={programs}></CourseAddPageContent>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseAddPage;