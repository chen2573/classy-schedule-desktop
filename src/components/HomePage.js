import React from 'react';
import './../assets/styles/HomePage.css';
import './../assets/styles/SideNav.css';
import { NotificationsNone, Settings} from '@mui/icons-material';
import {Button, Typography} from '@mui/material';
import DataViewer from './DataViewer.js';

/**
 * Create a topbar for the application that includes a Name, logo, and profile image.
 * @returns the TopBar component.
 */
const TopBar = ({openNav}) => {
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
                    <div className="topBarIconContainer">
                        <Settings/>
                    </div>
                    <a href="#"><img onClick={openNav} src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ffree-profile-pics.com%2Fprofile-pictures%2F01262014%2Fdownload%2Fyoda-profile-picture-512x512.png&f=1&nofb=1" alt="" className="topAvatar"/></a>
                </div>
            </div>
        </div>
    )
}

/**
 * This component builds and returns the boxes that displays info on the current state on the homepage.
 * @param courses - the courses state.
 * @param labs - the labs state.
 * @param professors - the professors state.
 * @param rooms - the rooms state.
 */
const ComponentsInfo = ({courses, labs, professors, rooms}) => {
    return (
        <div className="featured">
            <div className="featuredItem">
                <span className="featuredTitle">Courses</span>
                <div className="featuredInfo">
                    <span className="featuredValue">{courses.length}</span>
                </div>

            </div>
            <div className="featuredItem">
                <span className="featuredTitle">Labs</span>
                <div className="featuredInfo">
                    <span className="featuredValue">{labs.length}</span>
                </div>
            </div>
            <div className="featuredItem">
                <span className="featuredTitle">Professors</span>
                <div className="featuredInfo">
                    <span className="featuredValue">{professors.length}</span>
                </div>
            </div>
            <div className="featuredItem">
                <span className="featuredTitle">Rooms</span>
                <div className="featuredInfo">
                    <span className="featuredValue">{rooms.length}</span>
                </div>
            </div>
        </div>
    )

}

/**
 * This component creates and styles the dashboard.
 */
const Dashboard = ({courses, labs, professors, rooms}) => {
    return (
        <div className="home">
            <ComponentsInfo courses={courses} labs={labs} professors={professors} rooms={rooms}/>
        </div>
    )
}

/**
 * The main component that will be exported by this class.
 */
const HomePageContent = ({courses, labs, professors, rooms, openNav}) => {
    
    return (
        
    <div className="main-div">
        <TopBar openNav={openNav}></TopBar>
        <br />
        <br />
        <div className="container-top-text">
            <h4> Hello User, here are your latest stats...</h4>
        </div>
        <div className="container-home">
            <Dashboard courses={courses} labs={labs} professors={professors} rooms={rooms}/>
        </div>
    </div>
    );
}

/* Set the width of the side navigation to 250px and the right margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
  }
  
  /* Set the width of the side navigation to 0 and the right margin of the page content to 0, and the background color of body to white */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.body.style.backgroundColor = "white";
  }

/**
 * The main component that will be exported by this class.
 */
 export const HomePage = ({courses, labs, professors, rooms}) => {
     
     return (
         
     <div>
         <div id="mySidenav" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" onClick={closeNav}>&times;</a>
            <a class="link-pages" href="#">Account</a>
            <a class="link-pages" href="#">Services</a>
            <a class="link-pages" href="#">Contact</a>
            <br />
            <br />
            <a class="link-pages logout" href="#"><strong>Logout</strong></a>
        </div>
         

         <div id="main">
            <HomePageContent courses={courses} labs={labs} professors={professors} rooms={rooms} openNav={openNav}></HomePageContent>
         </div>
         
     </div>
     );
 }

export default HomePage;