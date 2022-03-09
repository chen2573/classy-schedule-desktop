import { ListItem } from '@mui/material'
//import { AsyncTaskManager } from 'builder-util'
import { React, useState } from 'react'
import {FaTimes} from 'react-icons/fa'

/**
 * This component represents the form that will be used by the user to enter in new room data.
 * @param onAddRoom - the addSubmit function that is passed down from App.js
 */

const RoomAdd = ({onAddRoom}) => {
    const [rbuilding, setRBuilding] = useState('')
    const [rnumber, setRNumber] = useState('')
    const [rcapacity, setRCapacity] = useState('')
    const [rtech, setRTech] = useState('')
    const [rtime, setRTime] = useState('')
    const [rclasstime, setRClassTime] = useState('')
    const onSubmit = (e) => {
        e.preventDefault()
        e.target.reset()
        if (!rbuilding) {
            alert('Please enter a three letter building code')
            return;
        }
        if (!rnumber) {
            alert('Please enter the room number')
            return;
        }
        if (!rcapacity) {
            alert('Please enter the student capacity')
            return;
        }
        if (!rtech) {
          alert('Please enter the tech requirements')
          return;
        }

        onAddRoom({rbuilding, rnumber, rcapacity, rtech});
        setRBuilding('');
        setRNumber('');
        setRCapacity('');
        setRTech('');
    }
    return (
    <div className = 'container'>
        <h1> Add Room </h1>

        <form onSubmit={onSubmit}>
        <div className='formcontrol'>
            <label> Building:</label>
                <input type="text" placeholder="Enter Three Character Code for the Building" value={rbuilding} 
                onChange={(e)=> setRBuilding(e.target.value)}/>
        </div>
        <div classname='formcontrol'>
            <label>Room Number:</label>
                <input type="number" placeholder="Enter the Room Number" value={rnumber} 
                onChange={(e)=> setRNumber(e.target.value)}/>
        </div>
        <div classname='formcontrol'>
            <label>Room Capacity:</label>
                <input type="number" placeholder= "Enter the Room Capacity" value={rcapacity} 
                onChange={(e)=> setRCapacity(e.target.value)}/>
        </div>
        <h4>Select Technology in this Room</h4>
        <div classname='formcontrol'>
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
        </div>
        <input type="submit" value='Save Room'/>
        </form>
    </div>
    );
}
    /**
 * This component is a view that lists out individual RoomListItems.
 * @param rooms - The state of rooms that is passed down from App.js
 */
const RoomList = ({rooms, onDelete}) => {
    return(
    <div className='container'>
    {rooms.map((currentRoom, index) => (
        <RoomListItem key={index} room={currentRoom} onDelete={onDelete}/>
    ))}
    </div>
    );
}

/**
 * The component that will display an individual room. These components will populate the RoomList component.
 * @param room - an individual room
 */
const RoomListItem = ({room, onDelete}) => {
    return(
    <div className='item'>
        {/* this needs to change to a location if more than one building is used number is not unique*/}
        <h3>{room.rnumber} <FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(room.id)} /></h3>
        {/*Do we want to add a subheader like the video*/}
    </div>
    );
}
/**
 * The that will be exported. This page will have an Add form and list the Rooms that have been added and
 * the rooms that are in the database.
 * @param onAddRoom - the function 'addRoom' from App.js that will fire when the RoomAddPage is submitted
 * @param rooms - the state of rooms passed from App.js
 */
 const RoomAddPage = ({onAddRoom, rooms, onDelete}) => {
    return (
      <div>
          <div className='element-page'>
              <RoomAdd onAddRoom={onAddRoom}/>
              <RoomList onDelete={onDelete} rooms={rooms}/>
          </div>
      </div>
    );
  }


export default RoomAddPage