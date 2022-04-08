import React from 'react';
import './../assets/styles/HomePage.css';
import './../assets/styles/SideNav.css';
import { NotificationsNone} from '@mui/icons-material';
import {Button, Typography} from '@mui/material';
import DataViewer from './DataViewer.js';
import SideNavigation from './SideNavigation.js';
import TopBar from './TopBar.js'

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
const HomePageContent = ({courses, labs, professors, rooms}) => {
    
    return (
        
    <div className="main-div">
        <TopBar></TopBar>
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

/**
 * The main component that will be exported by this class.
 */
 export const HomePage = ({courses, labs, professors, rooms}) => {
     
     return (
         
     <div>
         <SideNavigation></SideNavigation>
         
         <div id="main">
            <HomePageContent courses={courses} labs={labs} professors={professors} rooms={rooms}></HomePageContent>
         </div>
         
     </div>
     );
 }

export default HomePage;