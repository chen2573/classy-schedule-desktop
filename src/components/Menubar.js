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
import AddIcon from '@mui/icons-material/Add';


/**
 * This is a menubar component for switching pages
 * @param setCurrentPage function to set the currentPage state in parent that controls the current page
 * @returns a menubar for page switching
 */
export function MenuBar ({setCurrentPage})
{
    //return list of buttons for navigating to different pages
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

                <Button variant="text" onClick={()=>{setCurrentPage('SolutionDashboard')}}>
                    <Box>
                        <CalendarTodayIcon color="secondary"/>
                        <p className="button-text">Schedule Dashboard</p>
                    </Box>
                </Button>

                
                <Box></Box>
            </Box>
        </AppBar>
    );
}

export default MenuBar;