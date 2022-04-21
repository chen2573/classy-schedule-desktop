import { ListItem, Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, TextField  } from '@mui/material'
//import { AsyncTaskManager } from 'builder-util'
import { React, useState } from 'react'
import {FaTimes} from 'react-icons/fa'
import './../../assets/styles/HomePage.css';
import './../../assets/styles/SideNav.css';
import './../../assets/styles/AddPages.css';
import SideNavigation from './../SideNavigation.js';
import TopBar from './../TopBar.js'
 


// Styling
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    sx: {
        "&& .Mui-selected": {
            backgroundColor: "#92afdb"
        }
    },
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    }
};


const validate = (validateFN, stateSetter) => e => {
    stateSetter(oldValue => validateFN(e.target.value) ? e.target.value : oldValue);
}
/**
 * This component represents the form that will be used by the user to enter in new room data.
 * @param onAddRoom - the addSubmit function that is passed down from App.js
 */

const RoomAdd = ({onAddRoom}) => {
    const [rbuilding, setRBuilding] = useState('')
    const [rnumber, setRNumber] = useState('')
    const [rcapacity, setRCapacity] = useState('')
    const [rtech, setRTech] = useState([])
    const [rtime, setRTime] = useState('')
    const [rclasstime, setRClassTime] = useState('')

    // Building Code must be all uppercase 3 letter code
    const validRBuilding = val => [...val.matchAll(/([A-Z][A-Z][A-Z]|[A-Z][A-Z]|[A-Z])?/g)].some(x => x[0] == val) || val === '';
    // This function calls passes other functions to validate
    const validateRBuilidng = validate(validRBuilding, setRBuilding);
    
    // Room number must be a value between 100 and 999
    // FIX LOWER BOUND
    const validRNumber = val => [...val.matchAll(/([1-9][0-9][0-9]|[1-9][0-9]|[1-9])?/g)].some(x => x[0] == val) || val === '';
    // This function calls passes other functions to validate
    const validateRNumber = validate(validRNumber, setRNumber);

    // Room Capacity must be a value between 5 and 300
    // FIX FOR THE LOWER BOUND OF 5
    const validRCapacity = val => [...val.matchAll(/(1[0-9][0-9]|2[0-9][0-9]|300|[1-9][0-9]|[1-9])?/g)].some(x => x[0] == val) || val === '';
    // This function calls passes other functions to validate
    const validateRCapacity = validate(validRCapacity, setRCapacity);

    /**
     * This function handles changes on the Technology dropdown
     * 
     * @param e - onChange event
     */
    const handleTechChange = (e) => {
        const {
            target: { value },
        } = e;
        setRTech(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const onSubmit = (e) => {
        e.preventDefault()
        e.target.reset()
        //UNCOMMENT ONCE BUILDING IS ADDED AGAIN - Anshul
        /*if (!rbuilding) {
            alert('Please enter a three letter building code')
            return;
        }*/
        if (!rnumber) {
            alert('Please enter the room number')
            return;
        }
        if (!rcapacity) {
            alert('Please enter the student capacity')
            return;
        }
        {/*
        UNCOMMENT ONCE CHECKBOX FORM IS FIXED - GLENN
        if (!rtech) {
          alert('Please enter the tech requirements')
          return;
        }
        */}

        onAddRoom({rbuilding, rnumber, rcapacity, rtech});
        setRBuilding('');
        setRNumber('');
        setRCapacity('');
        setRTech([]);
        

        
    }
    return (
    <div className = 'container'>
        <h1> Add Room </h1>
        <form onSubmit={onSubmit}>



            <br></br>

            <Box>
                <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_room_number" label="Room Number" variant="outlined" value={rnumber} onChange={validateRNumber}/>
            </Box>

            <br></br>

            <Box>
                <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_room_capacity" label="Room Capacity" variant="outlined" value={rcapacity} onChange={validateRCapacity}/>
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
                    value={rtech}
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
            
            <input type="submit" value='Save Room' className='btn btn-block'/>
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
        <h3>Room: {room.rnumber} <FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(room.id)} /></h3>
        <p><em>Building: </em> {room.rbuilding}<br />
        <em>Tech: </em>{room.rtech}</p>
        {/*Do we want to add a subheader like the video*/}
    </div>
    );
}

/**
 * This page will have an Add form and list the Rooms that have been added and
 * the rooms that are in the database.
 * @param onAddRoom - the function 'addRoom' from App.js that will fire when the RoomAddPage is submitted
 * @param rooms - the state of rooms passed from App.js
 */
 const RoomAddPageContent = ({onAddRoom, rooms, onDelete}) => {
    return (
      <div className="home">
          <div className='element-page'>
              <RoomAdd onAddRoom={onAddRoom}/>
              <RoomList onDelete={onDelete} rooms={rooms}/>
          </div>
      </div>
    );
}

/**
 * The component that will be exported. This page will have an Add form and list the Rooms that have been added and
 * the rooms that are in the database.
 * @param onAddRoom - the function 'addRoom' from App.js that will fire when the RoomAddPage is submitted
 * @param rooms - the state of rooms passed from App.js
 */
 const RoomAddPage = ({onAddRoom, rooms, onDelete}) => {
    return (
    <div>
        <SideNavigation></SideNavigation>
  
        <div id="main">
            <div className="main-div">
                <TopBar></TopBar>
  
                <div className="container-home">
                  <RoomAddPageContent onAddRoom={onAddRoom} rooms={rooms} onDelete={onDelete} ></RoomAddPageContent>
                </div>
            </div>
        </div>
      </div>
    );
}


export default RoomAddPage