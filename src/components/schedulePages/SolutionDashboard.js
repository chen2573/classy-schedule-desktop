import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, TextField, Button,Typography } from '@mui/material';
//import { AsyncTaskManager } from 'builder-util';
import { React, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './../../assets/styles/HomePage.css';
import './../../assets/styles/SideNav.css';
import './../../assets/styles/AddPages.css';
import SideNavigation from './../SideNavigation.js';
import TopBar from './../TopBar.js';
import AddIcon from '@mui/icons-material/Add';
    /**
 * This component is a view that lists out individual LabListItems.
 * @param plans - The state of plans that are passed down from App.js
 */
     const SolutionList = ({plans}) => {
        console.log('SolutionList', plans);
        return(
        <div className='container'>
            <h1>plans</h1>
            {plans.map((currentSolution, index) => (
                <SolutionItem key={index} plan={currentSolution}/>
            ))}
        </div>
        );
    }
    
    /**
     * The component that will display an individual lab. These components will populate the LabList component.
     * @param plans - an individual solution
     */
    const SolutionItem = ({plan}) => {
        {/*console.log(plans);*/}
        return(
        <div className='item'>
            <h3>{plan.planName}</h3>
            <p>{plan.planDescription}</p>
            {/*What do we want this course part to show
            Maybe the course object that we can pop out?
            */}
        </div>
        );
    }
    
    /**
     * This page will have a list of Labs that have been added and
     * the labs that are in the database.
     * @param plans - the state of plans passed from App.js
     */
     const SolutionContent = ({ plans }) => {
        return (
            <div className="home">
                <div className='solution-page'>
                    <SolutionList plans={plans}/>
                </div>
            </div>
        );
    }
const SolutionDashboard = ({plans, setCurrentPage}) => {
    return (
        <div>
            <SideNavigation></SideNavigation>

            <div id="main">
                <div className="main-div">
                    <TopBar></TopBar>

                    <div className="container-home">
                        <SolutionContent plans={plans}></SolutionContent>
                    </div>
                    
                    {/* generate schedule button */}
                    <Button variant="contained" sx={{position:'absolute', bottom:'48vh', right:'24vw'}} onClick={()=>{setCurrentPage('AddSolution')}}>
                        <Box>
                            <AddIcon color="secondary"/>
                            <p className="button-text">Add Schedule</p>
                        </Box>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SolutionDashboard;