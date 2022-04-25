import { linkClasses, ListItem, Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, TextField } from '@mui/material'
//import { AsyncTaskManager } from 'builder-util'
import { React, useState } from 'react'
import {FaTimes} from 'react-icons/fa'
import './../../assets/styles/HomePage.css';
import './../../assets/styles/SideNav.css';
import './../../assets/styles/AddPages.css';
import SideNavigation from './../SideNavigation.js';
import TopBar from './../TopBar.js'

const validate = (validateFN, stateSetter) => e => {
    stateSetter(oldValue => validateFN(e.target.value) ? e.target.value : oldValue);
}

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
 * This component represents the form that will be used by the user to enter in new lab data.
 * @param onAddLab - the addSubmit function that is passed down from App.js
 */
const LabAdd = ({onAddLab, courses}) => {
    const [lname, setLName] = useState('')
    const [lcapacity, setLCapacity] = useState('')
    const [lprofessor, setLProfessor] = useState('')
    const [ltech, setLTech] = useState([])
    const [llength, setLLength] = useState('');
    const [ldays, setLDays] = useState('');
    const [ltimes, setLTimes] = useState('');
    const [lcourse, setLCourse] = useState([]);

    // Lab Name must be less than 50 characters and have no numbers
    const validLNameLength = name => name.length < 51;
    const validLNameChar = val => [...val.matchAll(/(^[^0-9]+$)?/g)].some(x => x[0] == val) || val === '';
    const validLName = name => validLNameLength(name) && validLNameChar(name)
    // This function calls passes other functions to validate
    const validateLName = validate(validLName, setLName);

    // Lab Capacity must be a value between 0 and 1000
    const validLCapacity = val => [...val.matchAll(/(1000|[1-9][0-9][0-9]|[1-9][0-9]|[0-9])?/g)].some(x => x[0] == val) || val === '';
    // This function calls passes other functions to validate
    const validateLCapacity = validate(validLCapacity, setLCapacity);

    /**
     * This function handles changes on the Technology dropdown
     * 
     * @param e - onChange event
     */
    const handleTechChange = (e) => {
        const {
          target: { value },
        } = e;
        setLTech(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    /**
     * This function handles unique list items and removal of list items
     * 
     * @param courseInfo - Object containing all relevant course information
     * @returns - newValue with old state and specified course added, or oldValue with specified course removed
     */
    const handleAssociatedCourseClick = courseInfo => e => {
        setLCourse(oldValue => {
            if(oldValue.some(x => JSON.stringify(x) == JSON.stringify(courseInfo))) {
                console.log({oldValue});
                return oldValue.filter(x => JSON.stringify(x) != JSON.stringify(courseInfo));
            }
            const newValue = [courseInfo]
            return newValue;
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        e.target.reset()
        if (!lname) {
            alert('Please enter the lab name')
            return;
        }
        if (!lcapacity) {
            alert('Please enter the student capacity')
            return;
        }
        {
        if (!ltech) {
            alert('Please enter the tech required for this lab')
            return;
        }
        }
        {
        if (!lcourse){
            alert('A lab must be associated with a course. Pick an existing one or create a new one before creating this lab')
            return;
        }
        }

        let elementClassName = 'item';
        onAddLab({lname, lcapacity, ltech, lcourse, elementClassName});
        setLName('');
        setLCapacity('');
        setLTech([]);
        setLCourse([]);
    }
    return (
    <div className = 'container'>
        <h1> Add Lab </h1>
        <form onSubmit={onSubmit}>

            <br></br>

            <Box>
                <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_lab_name" label="Lab Name" variant="outlined" value={lname} onChange={validateLName}/>
            </Box>

            <br></br>

            <Box>
                <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_lab_capacity" label="Lab Capacity" variant="outlined" value={lcapacity} onChange={validateLCapacity}/>
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
                    value={ltech}
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

            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel shrink id="label">Associated Course</InputLabel>
                    <Select
                    labelId="label"
                    id='associated_course_dropdown'
                    notched
                    MenuProps={{sx: {
                        "&& .Mui-selected": {
                          backgroundColor: "#90A4AE"
                        }
                    }}}
                    value={lcourse.map(e => e.name)}
                    label="Associated Course"
                    >
                        {courses.map(p => (
                            <MenuItem 
                                onClick={handleAssociatedCourseClick(p)}
                                key={p.id} 
                                value={p.name}
                            >
                                {p.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <br></br>


            <input type="submit" value='Save Lab' className='btn btn-block'/>
            </form>
        </div>
    );
}



    /**
 * This component is a view that lists out individual LabListItems.
 * @param labs - The state of labs that is passed down from App.js
 */
const LabList = ({labs, onDelete}) => {
    return(
    <div className='container'>
    {labs.map((currentLab, index) => (
        <LabListItem key={index} lab={currentLab} onDelete={onDelete}/>
    ))}
    </div>
    );
}

/**
 * The component that will display an individual lab. These components will populate the LabList component.
 * @param lab - an individual lab
 */
const LabListItem = ({lab, onDelete}) => {
    return(
    <div className='item'>
        <h3>Lab: {lab.lname} <FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(lab.id)} /></h3>
        <p><em>Course: {lab.lcourse[0].name}</em></p>
        {/*What do we want this course part to show
        Maybe the course object that we can pop out?
        */}
    </div>
    );
}

/**
 * This page will have an Add form and list the Labs that have been added and
 * the labs that are in the database.
 * @param onAddLab - the function 'addLab' from App.js that will fire when the LabAddPage is submitted
 * @param labs - the state of labs passed from App.js
 */
 const LabAddPageContent = ({onAddLab, labs, onDelete, courses}) => {
    return (
        <div className="home">
            <div className='element-page'>
                <LabAdd onAddLab={onAddLab} courses={courses}/>
                <LabList onDelete={onDelete} labs={labs}/>
            </div>
        </div>
    );
}

/**
 * The component that will be exported. This page will have an Add form and list the Labs that have been added and
 * the labs that are in the database.
 * @param onAddLab - the function 'addLab' from App.js that will fire when the LabAddPage is submitted
 * @param labs - the state of labs passed from App.js
 */
const LabAddPage = ({onAddLab, labs, onDelete, courses}) => {
    return (
        <div>
            <SideNavigation></SideNavigation>

            <div id="main">
                <div className="main-div">
                    <TopBar></TopBar>

                    <div className="container-home">
                    <LabAddPageContent onAddLab={onAddLab} labs={labs} onDelete={onDelete} courses={courses}></LabAddPageContent>

                    </div>
                </div>
            </div>
        </div>
    );
}
    
    
export default LabAddPage