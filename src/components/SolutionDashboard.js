import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, TextField, Button,Typography } from '@mui/material';
//import { AsyncTaskManager } from 'builder-util';
import { React, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './../assets/styles/HomePage.css';
import './../assets/styles/SideNav.css';
import './../assets/styles/AddPages.css';
import SideNavigation from './SideNavigation.js';
import TopBar from './TopBar.js';
    /**
 * This component is a view that lists out individual LabListItems.
 * @param solutions - The state of solutions that are passed down from App.js
 */
     const SolutionList = ({solutions}) => {
        return(
        <div className='container'>
            <h1>Solutions</h1>
            {solutions.map((currentSolution, index) => (
                <SolutionItem key={index} solutions={currentSolution}/>
            ))}
        </div>
        );
    }
    
    /**
     * The component that will display an individual lab. These components will populate the LabList component.
     * @param solutions - an individual solution
     */
    const SolutionItem = ({solutions}) => {
        return(
        <div className='item'>
            <h3>{solutions.name}</h3>
            {/*What do we want this course part to show
            Maybe the course object that we can pop out?
            */}
        </div>
        );
    }
    
    /**
     * This page will have a list of Labs that have been added and
     * the labs that are in the database.
     * @param solutions - the state of solutions passed from App.js
     */
     const SolutionContent = ({ solutions }) => {
        return (
            <div className="home">
                <div className='element-page'>
                    <SolutionList solutions={solutions}/>
                </div>
            </div>
        );
    }
const SolutionDashboard = ({solutions, setCurrentPage}) => {
    return (
        <div>
            <SideNavigation></SideNavigation>

            <div id="main">
                <div className="main-div">
                    <TopBar></TopBar>

                    <div className="container-home">
                        <SolutionContent solutions={solutions}></SolutionContent>
                    </div>
                    
                    {/* generate schedule button */}
                    <Button variant="contained" sx={{position:'absolute', bottom:'12vh', right:'2.5vw'}} onClick={()=>{setCurrentPage('AddSolution')}}>
                        <Typography variant="text" color="secondary">Add Schedule</Typography>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SolutionDashboard;