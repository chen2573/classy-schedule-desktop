import React from 'react'
import CourseListItem from './CourseListItem'

const CourseList = ({courses}) => {
  return (
    <div className='container'>
    {courses.map((currentCourse, index) => (
        <CourseListItem key={index} course={currentCourse}/>
    ))}
    </div>
  )
}

export default CourseList