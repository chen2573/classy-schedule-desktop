/**
 * CourseAddPage is responsible for creating an html div that allows the user to
 * create new course objects. 
 * It will also store the entered information as state.
 *
 * Courses can either be classes or labs Labs if course.lab is true Class if
 * course.lab is false
 *
 * Bugs:
 *    - None currently known
 *
 * @authors TBD
 */
import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, 
    TextField, Checkbox, FormControlLabel, Grid} from '@mui/material';
//import { AsyncTaskManager } from 'builder-util';
import { React, useState, useEffect } from 'react';
import { FaTimes, FaPencilAlt} from 'react-icons/fa';
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
            backgroundColor: "#D0D9DD"
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
 * The component that will be exported. This page will have an Add form and list
 * the Courses that have been added and the courses that are in the database.
 * @param onAddCourse - the function 'addCourse' from App.js that will fire when
 *                      the CourseAddPage is submitted
 * @param onEditCourse - the function 'editCourse' from APP.js that will fire
 *                       when the edit icon is clicked
 * @param courses - the state of courses passed from App.js
 * @param onDelete - the function 'onDelete' from App.js that will fire when the
 *                   onclick happens
 * @param programs - the state of programs passed from App.js
 * @returns - The exported component
 */
const CourseAddPage = ({ onAddCourse, onEditCourse, 
    courses, onDelete, programs }) => {

    // Edit functionality state management
    const [courseEditedId, setCourseEditedId] = useState(null);
    const [editedCourse, setEditedCourse] = useState(null);
    const [refresh, setRefresh] = useState('');

    const onEdit = courseId => e => {
        setCourseEditedId(courseId);
        setEditedCourse(courseId === 
            null ? null : courses.find(p => p.id === courseId));
        console.log({courseId})
    }

    const resetState = () => {
        setEditedCourse(null);
        setCourseEditedId(null);
        setRefresh('Refresh');
    }

    /**
     * This function works in tandem to other validating functions
     * This updates state with the passed state setter if 
     * the passed validate function returns true
     * 
     * @param validateFN  - Validating function
     * @param stateSetter - State updating function
     */
    const validate = (validateFN, stateSetter) => e => {
        stateSetter(oldValue => validateFN(e.target.value) ? e.target.value : oldValue);
    }

    /**
     * This component represents the form that will be used by the user to enter
     * in new course data.
     * @param onAddCourse - the addSubmit function that is passed down from
     *                      App.js
     * @param onEditCourse - function passed down from App.js
     * @param programs - the programs that is passed down from App.js
     * @returns - the component that represents the form that will be used by
     *            the user to enter in new course data.
     */
    const CourseAdd = ({ onAddCourse, onEditCourse, programs }) => {
        const [program, setProgram] = useState(courseEditedId === 
            null ? '' : editedCourse.program);
        const [number, setNumber] = useState(courseEditedId === 
            null ? '' : editedCourse.number);
        const [name, setName] = useState(courseEditedId === 
            null ? '' : editedCourse.name);
        const [credits, setCredits] = useState(courseEditedId === 
            null ? '' : editedCourse.credits);
        const [capacity, setCapacity] = useState(courseEditedId === 
            null ? '' : editedCourse.capacity);
        //const [length, setLength] = useState(courseEditedId === 
        //  null ? '' : editedCourse.length);
        // const [tech, setTech] = useState(courseEditedId === 
        //  null ? [] : editedCourse.tech);
        const [lab, setLab] = useState(courseEditedId === 
            null ? false : editedCourse.lab);
        //const [lcourse, setLCourse] = useState(courseEditedId === 
        //  null ? [] : editedCourse.lcourse);

        /**
         * Makes sure name is 50 characters or less
         * @param name - Input value
         * @returns boolean - true if the length of name is 50 characters or less
         */
        const validNameLength = name => name.length < 51;
        /**
         * Makes sure there is no numbers in name
         * @param val - Input value
         * @returns boolean - true if no numbers
         */
        const validNameChar = val => [...val.matchAll(/(^[^0-9]+$)?/g)].some
        (x => x[0] == val) || val === '';
        /**
         * Makes sure name satisfies both length and character constraints
         * @param name - Input value
         * @returns boolean - true if both functions return true
         */
        const validName = name => validNameLength(name) && validNameChar(name)
        // This function calls passes other functions to validate
        const validateName = validate(validName, setName);

        /**
         * Makes sure course number is no more than three digits
         * @param val - Input value
         * @returns boolean - true if positive integer less than 1000
         */
        const validNumber = val => 
        [...val.matchAll(/([1-9][0-9][0-9]|[1-9][0-9]|[1-9])?/g)].some
        (x => x[0] == val) || val === '';
        // This function calls passes other functions to validate
        const validateNumber = validate(validNumber, setNumber);

        /**
         * Makes sure in range of 0-4
         * @param val - Input value
         * @returns boolean - true if integer inclusive between 0 and 4
         */
        const validCredits = val => 
        [...val.matchAll(/([0-4])?/g)].some(x => x[0] == val) || val === '';
        // This function calls passes other functions to validate
        const validateCredits = validate(validCredits, setCredits);

        /**
         * Makes sure capacity is between 0-1000
         * @param val - Input value
         * @returns boolean - true if val is inclusive between 0 and 1000
         */
        const validCapacity = val => 
        [...val.matchAll(/(1000|[1-9][0-9][0-9]|[1-9][0-9]|[0-9])?/g)].some
        (x => x[0] == val) || val === '';
        // This function calls passes other functions to validate
        const validateCapacity = validate(validCapacity, setCapacity);

        /**
         * Makes sure meeting length is positive integer, max of 200
         * @param val - Input value
         * @returns boolean - true if positive integer of 200 or less
         */
        const validLength = val => 
        [...val.matchAll(/(200|1[0-9][0-9]|[1-9][0-9]|[1-9])?/g)].some
        (x => x[0] == val) || val === '';
        // This function calls passes other functions to validate
        //const validateLength = validate(validLength, setLength);


        /**
        * This function alerts the user if they are missing necessary data,
        * if all necessary data is present, it passes the data and resets to default
        * 
        * @param e - Event object
        * @returns - Alert to user
        */
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

            let elementClassName = 'item';
            let sections = 0;

            // This section determines whether a course will be edited
            // or if a course can be created
            if(courseEditedId === null){
                onAddCourse({program, number, name, credits, 
                    capacity, lab, elementClassName, sections}); // Implement checking for length and tech from database
            } else {
                let id = courseEditedId;
                onEditCourse({id, program, number, name, credits, 
                    capacity, lab, elementClassName, sections});
                resetState();
            }

            setCapacity('');
            setProgram('');
            setNumber('');
            setName('');
            setCredits('');
            // setLength('');
            //setLab(false);
            //setLCourse('');
        }

        return (
            <div className='body-container'>
                
                <h2>{courseEditedId !== null ? "Edit" : "Add"} A Class</h2>
                <form onSubmit={onSubmit}>

                    <br></br>

                    <Grid container spacing = {2}>
    
                        <Grid item xs = {6}>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel shrink id="label">Program</InputLabel>
                                    <Select
                                    labelId="label"
                                    id='program_dropdown'
                                    notched
                                    MenuProps={{sx: {
                                        "&& .Mui-selected": {
                                        backgroundColor: "#D0D9DD"
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
                        </Grid>

                        <Grid item xs = {6}>
                            <Box>
                                <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_course_number" label="Course Number" variant="outlined" value={number} onChange={validateNumber}/>
                            </Box>
                        </Grid>

                        <Grid item xs = {6}>
                            <Box>
                                <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_course_name" label="Course Name" variant="outlined" value={name} onChange={validateName}/>
                            </Box>
                        </Grid>

                        <Grid item xs = {6}>
                            <Box>
                                <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_number_of_credits" label="Credits" variant="outlined" value={credits} onChange={validateCredits}/>
                            </Box>
                        </Grid>

                        <Grid item xs = {6}>
                            <Box>
                                <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_student_capacity" label="Student Capacity" variant="outlined" value={capacity} onChange={validateCapacity}/>
                            </Box>
                        </Grid>

                        {/*<Grid item xs = {6}>
                            <Box>
                                <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_meeting_length" label="Meeting Length" variant="outlined" value={length} onChange={validateLength}/>
                            </Box>
                        </Grid>

                        <Grid item xs = {6}>
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
                                        </Grid>*/}

                    
                        <Grid item xs = {6}>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <FormControlLabel control={<Checkbox />} checked={lab} label = "Lab" labelPlacement='end' onChange={(e) => setLab(e.target.checked)}/>
                                </FormControl>
                            </Box>
                        </Grid>

                    </Grid>

                    <br></br>

                    {courseEditedId === null ? <input type="submit" value='Save Course' className='btn btn-block'/> 
                    : <><input type="submit" value='Save Edits' className='btn btn-block'/><br /> 
                    <input type="button" value="Cancel Edits" className='btn btn-block' onClick={resetState}/></> }
                </form>
            </div>
        );
    }

    /**
     * This component is a view that lists out individual CourseListItems.
     * @param courses - The state of courses that is passed down from App.js
     * @param onDelete - The delete function that is passed down from App.js
     * @param onEdit - The edit function that is passed down from App.js
     * @returns - The component that is a view listing out the CourseListItems
     */
    const CourseList = ({ courses, onDelete, onEdit }) => {
        return (
            <div className='container'>
                {courses.map((currentCourse, index) => (
                    <CourseListItem key={index} course={currentCourse}
                        onDelete={onDelete} onEdit={onEdit} courses={courses} />
                ))}
            </div>
        );
    }


    /**
     * The component that will display an individual course. These components 
     * will populate the CourseList component.
     * @param course - an individual course
     * @param onDelete - The delete function that is passed down from App.js
     * @param courses - the state of courses that is passed down from App.js
     *                  a collection of created course objects
     * @returns - The component displaying an individual course.
     */
    const CourseListItem = ({ course, onDelete, courses, onEdit }) => {
        return (
            <div className='item'>
            <FaTimes style={{color: 'red', cursor: 'pointer', float:"right"}} onClick={() => onDelete(course.id)}/>
            <FaPencilAlt style={{color:'#90A4AE', cursor: 'pointer', float: "right", clear: "right"}} onClick={onEdit(course.id)}/>
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
     * @param onAddCourse - the function 'addCourse' from App.js that will fire 
     *                      when the CourseAddPage is submitted
     * @param onEditCourse - the function 'editCourse' from App.jas that will fire when
     *                       the edit icon is clicked on an existing course
     * @param courses - the state of courses passed from App.js
     * @param onDelete - the function 'onDelete' from App.js that will fire when the onclick happens
     * @param programs - the state of programs passed from App.js
     * @returns - The exported component
     */
    const CourseAddPageContent = ({ onAddCourse, onEditCourse, courses, onDelete, programs }) => {
        return (
            <div className="home">
                <div className='element-page'>
                    <CourseAdd onAddCourse={onAddCourse} onEditCourse={onEditCourse} programs={programs} />
                    <CourseList onDelete={onDelete} courses={courses} onEdit={onEdit}/>
                </div>
            </div>
        );
    }

    useEffect(() => {

    }, [courseEditedId, refresh])

    return (
        <div>
            <SideNavigation></SideNavigation>

            <div id="main">
                <div className="main-div">
                    <TopBar></TopBar>

                    <div className="container-home">
                    <CourseAddPageContent onAddCourse={onAddCourse} onEditCourse={onEditCourse} courses={courses} onDelete={onDelete} programs={programs}></CourseAddPageContent>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseAddPage;