import { ListItem } from '@mui/material';
//import { AsyncTaskManager } from 'builder-util';
import { React, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * This component populates and returns a list of programs from the database.
 * @param programs - The programs that were passed down from App.js for the DB
 * @returns - The List of programs in the DB
 */
const ProgramSelectItems = ({ programs }) => {
    let programsList = programs.map(p => {
        return (<option key={p.id} value={p.programName}>{p.programName}</option>);
    });

    return (
        <>
            {programsList}
        </>
    );
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
    const [tech, setTech] = useState('');
    const [courseID, setCourseID] = useState('');

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
        if (!courseID) {
            alert('Please enter the course ID');
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

        onAddCourse({program, number, name, courseID, credits, capacity, tech, length});

        setCapacity('');
        setProgram('');
        setNumber('');
        setName('');
        setCourseID('');
        setCredits('');
        setLength('');
        setTech('');
    }

    return (
        <div className='container'>
            <h2>Add A Class</h2>
            <form onSubmit={onSubmit}>
                <div className='form-control'>
                    <label>Program</label>
                    <select onChange={(e) => setProgram(e.target.value)}>
                        <option value=""></option>
                        <ProgramSelectItems programs={programs} />
                    </select>
                </div>

                <div className='form-control'>
                    <label>Course ID</label>
                    <input type="number" placeholder='Enter course ID' value={courseID} onChange={(e) => setCourseID(e.target.value)} />
                </div>

                <div className='form-control'>
                    <label>Course Number</label>
                    <input type="number" placeholder='Enter course number' value={number} onChange={(e) => setNumber(e.target.value)} />
                </div>

                <div className='form-control'>
                    <label>Course Name</label>
                    <input type="text" placeholder='Enter course name' value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className='form-control'>
                    <label>Credits</label>
                    <input type="number" placeholder='Enter # of credits' value={credits} onChange={(e) => setCredits(e.target.value)} />
                </div>

                <div className='form-control'>
                    <label>Student Capacity</label>
                    <input type="number" placeholder='Enter capacity of students' value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                </div>

                <div className='form-control'>
                    <label>Meeting Length</label>
                    <input type="number" placeholder='Enter length of course' value={length} onChange={(e) => setLength(e.target.value)} />
                </div>
                <h4>Select Technology Required for this Lab</h4>
                <div className='form-control'>
                    <select multiple={true} onChange={(e) => setTech([...e.target.selectedOptions].map(option => option.value+" "))}>
                        <option >Desktop Computers</option>
                        <option >Laptop Computers</option>
                        <option >Projector</option>
                        <option >Whiteboard</option>
                        <option >Chalkboard</option>
                        <option >Robots</option>
                        <option >Zoom peripherals</option>
                        <option >Instrucor Computer</option>
                        <option >Net Controls</option>
                    </select>       
                </div>
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
                    onDelete={onDelete} />
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
const CourseListItem = ({ course, onDelete }) => {
    return (
        <div className='item'>
            <h3>{course.program} {course.number}<FaTimes style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDelete(course.id)} /></h3>
            {/* This stuff in the paragraph tag will become popover*/}
            <p><em>Class ID</em> : {course.courseID} <br />
                <em>Course Name</em> : {course.name}<br />
                <em>Credits</em> : {course.credits}<br />
                <em>Capacity</em> : {course.capacity}<br />
                <em>Tech: </em>{course.tech}</p>
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
            <div className='element-page'>
                <CourseAdd onAddCourse={onAddCourse} programs={programs} />
                <CourseList onDelete={onDelete} courses={courses} />
            </div>
        </div>
    );
}

export default CourseAddPage;