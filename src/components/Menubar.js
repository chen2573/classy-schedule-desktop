import {useState} from 'react';
import './../assets/styles/Menubar.css';
import {Link} from 'react-router-dom';
import {AppBar, Button, Box, Typography} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import ScienceIcon from '@mui/icons-material/Science';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export function MenuBar ({setCurrentPage})
{
    return (
        <AppBar position="fixed" sx={{ top: 'auto', bottom: 0}} color="primary">
            <Box sx={{display: 'flex', justifyContent: 'space-evenly', borderRadius: 1}}>
                <Box></Box>

                <Button variant="text" onClick={()=>{setCurrentPage('home')}}>
                    <Box>
                        <HomeIcon color="secondary" size="large"/>
                        <p className="button-text">Home</p>
                    </Box>
                </Button>
                <Button variant="text" onClick={()=>{setCurrentPage('professor')}}>
                    <Box>
                        <PersonIcon color="secondary" size="large"/>
                        <p className="button-text">Professors</p>
                    </Box>
                </Button>
                <Button variant="text" onClick={()=>{setCurrentPage('course')}}>
                    <Box>
                        <ClassIcon color="secondary"/>
                        <p className="button-text">Courses</p>
                    </Box>
                </Button>
                <Button variant="text" onClick={()=>{setCurrentPage('lab')}}>
                    <Box>
                        <ScienceIcon color="secondary"/>
                        <p className="button-text">Labs</p>
                    </Box>
                </Button>
                <Button variant="text" onClick={()=>{setCurrentPage('room')}}>
                    <Box>
                        <MeetingRoomIcon color="secondary"/>
                        <p className="button-text">Rooms</p>
                    </Box>
                </Button>
                <Button variant="text" onClick={()=>{setCurrentPage('schedule')}}>
                    <Box>
                        <CalendarTodayIcon color="secondary"/>
                        <p className="button-text">Schedule</p>
                    </Box>
                </Button>

                <Box></Box>
            </Box>
        </AppBar>
    );
}

export default MenuBar;