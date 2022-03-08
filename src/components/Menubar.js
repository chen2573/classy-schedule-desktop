import {useState} from 'react';
import './../assets/styles/Menubar.css';
import {Link} from 'react-router-dom';
import {AppBar, Button, Box} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export function MenuBar ()
{
    return (
        <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }} color="primary">
            <Box sx={{display: 'flex', justifyContent: 'space-evenly', borderRadius: 1}}>
                <Box></Box>

                <Button variant="text">
                    <Link className="link" to='/'>
                        <HomeIcon color="secondary" size="large"/>
                        <p>Home</p>
                        </Link>
                </Button>
                <Button variant="text"> 
                    <Link className="link" to='/professor'>
                        <PersonIcon color="secondary" size="large"/>
                        <p>Professors</p>
                        </Link>
                </Button>
                <Button variant="text"> 
                    <Link className="link" to='/course'>
                        <ClassIcon color="secondary"/>
                        <p>Courses</p>
                    </Link>
                </Button>
                <Button variant="text"> 
                    <Link className="link" to='/room'>
                        <MeetingRoomIcon color="secondary"/>
                        <p>Rooms</p>
                    </Link>
                </Button>
                <Button variant="text"> 
                    <Link className="link" to='/schedule'>
                        <CalendarTodayIcon color="secondary"/>
                        <p>Schedule</p>
                    </Link>
                </Button>

                <Box></Box>
            </Box>
        </AppBar>
    );
}

export default MenuBar;