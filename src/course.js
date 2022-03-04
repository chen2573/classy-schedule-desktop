import { useState } from "react";
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';

export function course() {

    //const handleSubmit = (event) => {
        //event.preventDefault();
      //  alert(inputs);
    //}

    return (
        <div>
            <h1> Add Class </h1>

            <form>


                <label for="program">Program
                    <select name="program" id="program">
                        <option value="stat">STAT</option>
                        <option value="cisc">CISC</option>
                    </select>
                </label>

                <label for="course_number">Course Number:
                    <input type="number" id="course_number" name="course_number" />
                </label>

                <label for="course_Name">Course Name:
                    <input type="text" id="course_name" name="course_name" />
                </label>

                <label for="course_credits">Credits:
                    <input type="number" id="course_credits" name="course_credits" />
                </label>
                
                <label for="student_capacity">Student Capacity:
                    <input type="number" id="student_capacity" name="student_capacity" />
                </label>

                <label for="meeting_length">Meeting Length:
                    <input type="number" id="meeting_length" name="meeting_length" />
                </label>

                <h4>Course days</h4>

                <label for="monday">Monday
                    <input type="checkbox" id="monday" name="monday" value="monday" />
                </label>

                <label for="tuesday">Tuesday
                    <input type="checkbox" id="tuesday" name="tuesday" value="tuesday" />
                </label>

                <label for="wednesday">Wednesday
                    <input type="checkbox" id="wednesday" name="wednesday" value="wednesday" />
                </label>

                <label for="thursday">Thursday
                    <input type="checkbox" id="thursday" name="thursday" value="thursday" />
                </label>

                <label for="friday">Friday
                    <input type="checkbox" id="friday" name="cfriday" value="friday" />
                </label>

                <h4>Select Technology Needed for this Course</h4>

                <label for="desktop">Desktop Computers
                    <input type="checkbox" id="desktop" name="desktop" value="Desktop" />
                </label>

                <label for="laptop">Laptop Computers
                    <input type="checkbox" id="laptop" name="laptop" value="Laptop"/>
                </label>

                <label for="projector">Projector
                    <input type="checkbox" id="projector" name="projector" value="Projector"/>
                </label>

                <label for="whiteboard">Whiteboard
                    <input type="checkbox" id="whiteboard" name="whiteboard" value="Whiteboard" />
                </label>

                <label for="chalkboard">Chalkboard
                    <input type="checkbox" id="chalkboard" name="chalkboard" value="Chalkboard" />
                </label>

                <h4>Lab Attached</h4>

                <label for="lab">Lab Required
                    <select name="lab" id="lab">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </label><br></br>
                <input type="submit" />
            </form><br></br>
        </div>
    );

}

export default course;
