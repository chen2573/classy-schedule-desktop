import { useState } from "react";
import ReactDOM from 'react-dom';
// import {Link} from 'react-router-dom';

export function room() {

    //const handleSubmit = (event) => {
        //event.preventDefault();
      //  alert(inputs);
    //}

    return (
        <div>
            <h1> Add Room </h1>

            <form>
    <label for="room_building">Building:
        <input type="text" id="room_building" name="room_building"/>
    </label>

    <label for="room_number">Room Number:
        <input type="number" id="room_number" name="room_number"/>
    </label>

    <label for="room_capacity">Room Capacity:
        <input type="number" id="room_capacity" name="room_capacity"/>
    </label>

    <h4>Select Technology in this Room</h4>

    <label for="desktop">Desktop Computers
        <input type="checkbox" id="desktop" name="desktop" value="Desktop"/>
    </label>

    <label for="laptop">Laptop Computers
        <input type="checkbox" id="laptop" name="laptop" value="Laptop"/>
    </label>

    <label for="projector">Projector
        <input type="checkbox" id="projector" name="projector" value="Projector"/> 
    </label>

    <label for="whiteboard">Whiteboard
        <input type="checkbox" id="whiteboard" name="whiteboard" value="Whiteboard"/>
    </label>

    <label for="chalkboard">Chalkboard
        <input type="checkbox" id="chalkboard" name="chalkboard" value="Chalkboard"/>
    </label>

    <h4>Select Time Periods for this Room</h4>

    {/*<table id="time_select_table" cellspacing="0" cellpadding="0" bordercolor="black" border="0" width="100%">
        <tbody>
            
            <tr id="daysofweek">
                <td id="timetable" style="color: Black; border: 1px solid" width="10%">
                    Time
                </td>
                <th style="color: Black; border: 1px solid" width="18%" scope="col">M</th>
                <th style="color: Black; border: 1px solid" width="18%" scope="col">T</th>
                <th style="color: Black; border: 1px solid" width="18%" scope="col">W</th>
                <th style="color: Black; border: 1px solid" width="18%" scope="col">R</th>
                <th style="color: Black; border: 1px solid" width="18%" scope="col">F</th>
            </tr>
            
            <tr>
                <td style="color: Black; border: 1px solid" scope="row">8:15-9:20</td>                
            </tr>
            <tr>
                <td style="color: Black; border: 1px solid" scope="row">9:35-10:40</td>
            </tr>
            <tr>
                <td style="color: Black; border: 1px solid" scope="row">10:55-12:00</td>
            </tr>
            <tr>
                <td style="color: Black; border: 1px solid" scope="row">12:15-1:20</td>
            </tr>
        </tbody>
    </table>*/}
    <input type="submit" />
</form>
        </div>
    );

}

export default room;