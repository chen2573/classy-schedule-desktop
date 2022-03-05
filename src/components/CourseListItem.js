import React from 'react'

const CourseListItem = ({course}) => {
  return (
    <div className='item'>
        <h3>{course.program} {course.number}</h3>
        <p>TODO</p>
    </div>
  )
}

export default CourseListItem