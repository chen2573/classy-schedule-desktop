import React from 'react'
import CourseAdd from './CourseAdd.js';
import CourseList from './CourseList.js';

const CoursePage = ({onAddCourse, courses}) => {
  return (
    <div>
        <div className='element-page'>
            <CourseAdd onAddCourse={onAddCourse}/>
            <CourseList courses={courses}/>
        </div>
    </div>
  )
}

export default CoursePage