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
     const SolutionList = ({plans, setCurrentPage}) => {
        console.log('SolutionList', plans);
        return(
        <div className='container'>
            <h1 className = 'sticky'>Schedules</h1>
            {plans.map((currentSolution, index) => (
                <SolutionItem key={index} plan={currentSolution} plans={plans} setCurrentPage={setCurrentPage}/>
            ))}
        </div>
        );
    }
    
    const navigateToUpdateSolution = (setCurrentPage, id, name, description, year, semester) => () => {
        let _payload = {
            request: 'SAVED_PLAN',
            message: 'Renderer request SAVED PLANS',
            planId: id,
            planName: name,
            planDescription: description,
            planYear: year,
            planSemester: semester
        }

        window.DB.send('toMain:SecondaryPlan', _payload);

        setCurrentPage('UpdateSolution');
    }
    
    /**
     * The component that will display an individual lab. These components will populate the LabList component.
     * @param plans - an individual solution
     */
    const SolutionItem = ({plan, plans, setCurrentPage}) => {
        {/*console.log(plans);*/}
        return(
            <div className= "item">
                <DataViewer id={plan.id} dataState={plans} sx={{position:'absolute'}}>
                    <MoreHorizIcon style= {{float:"right"}}/>
                </DataViewer>
                <div onClick={navigateToUpdateSolution(setCurrentPage, plan.id, plan.name, plan.description, plan.year, plan.semester)}>
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
     const SolutionContent = ({ plans, setCurrentPage}) => {
        return (
            <div className="home">
                <div className='solution-page'>
                    <SolutionList plans={plans} setCurrentPage={setCurrentPage}/>
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
                        <SolutionContent plans={plans} setCurrentPage={setCurrentPage}></SolutionContent>
                    </div>
                    
                    {/* generate schedule button */}
                    <Button variant="contained" sx={{position:'absolute', bottom:'48vh', right:'30vw'}} onClick={()=>{setCurrentPage('AddSolution')}}>
                        <Box>
                            <AddIcon color="secondary"/>
                            <p className="button-text">Optimized Schedule</p>
                        </Box>
                    </Button>

                    <Button variant="contained" sx={{position:'absolute', bottom:'48vh', right:'16vw'}} onClick={()=>{setCurrentPage('CreateSchedule')}}>
                        <Box>
                            <AddIcon color="secondary"/>
                            <p className="button-text">Create Schedule</p>
                        </Box>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SolutionDashboard;