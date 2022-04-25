import React from 'react'
import './../assets/styles/HomePage.css';
import './../assets/styles/SideNav.css';
import { NotificationsNone} from '@mui/icons-material';


/* Set the width of the side navigation to 250px and the right margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
}

/**
 * Create a topbar for the application that includes a Name, logo, and profile image.
 * @returns the TopBar component.
 */
 const TopBar = () => {
    return (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span className="logo">ClassySchedule</span>
                </div>
                <div className="topRight">
                    <div className="topBarIconContainer">
                        <NotificationsNone/>
                        <span className="topIconBadge">2</span>
                    </div>
                    <a href="#"><img onClick={openNav} src="https://pm1.narvii.com/7443/6cd967b9b43e84a408cf5ba385e4d9bc55e3fd9ar1-2048-2048v2_hq.jpg" alt="" className="topAvatar"/></a>
                </div>
            </div>
        </div>
    )
}

export default TopBar