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
import DataViewer from '../DataViewer';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
    /**
 * This component is a view that lists out individual LabListItems.
 * @param plans - The state of plans that are passed down from App.js
 */
     const SolutionList = ({plans}) => {
        console.log('SolutionList', plans);
        return(
        <div className='container'>
            <h1>Schedules</h1>
            {plans.map((currentSolution, index) => (
                <SolutionItem key={index} plan={currentSolution} plans={plans}/>
            ))}
        </div>
        );
    }
    
    /**
     * The component that will display an individual lab. These components will populate the LabList component.
     * @param plans - an individual solution
     */
    const SolutionItem = ({plan, plans}) => {
        {/*console.log(plans);*/}
        return(
            <div className= "item">
                <DataViewer id={plan.id} dataState={plans} sx={{position:'absolute'}}>
                    <MoreHorizIcon style= {{float:"right"}}/>
                </DataViewer>
                <div>
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                </div>
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