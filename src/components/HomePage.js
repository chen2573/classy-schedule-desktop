/**
 * HomePage displays the number of created objects as well as
 * created plans and allows the user to click on those components
 * to navigate to the respective pages
 *
 * Bugs:
 *    - None currently known
 *
 * @authors TBD
 */
import {React,useEffect} from 'react';
import './../assets/styles/HomePage.css';
import './../assets/styles/SideNav.css';
import { NotificationsNone} from '@mui/icons-material';
import {Button, Typography, Grid, styled, Paper} from '@mui/material';
import DataViewer from './DataViewer.js';
import SideNavigation from './SideNavigation.js';
import TopBar from './TopBar.js'


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
/**
 * This component builds and returns the boxes that displays info on the current state on the homepage.
 * @param courses - the courses state.
 * @param labs - the labs state.
 * @param professors - the professors state.
 * @param rooms - the rooms state.
 * @param setCurrentPage - function to change displayed page
 * @returns - React component that displays number of created objects
 *            and ability to navigate to add pages
 */
const ComponentsInfo = ({courses, labs, professors, rooms, setCurrentPage}) => {
    return (
        <Grid container spacing = {2}>
            <Grid item xs = {6}>
                <Item className="featuredItem" onClick={()=>{setCurrentPage('course')}}>
                    <span className="featuredTitle">Courses</span>
                    <div className="featuredInfo">
                        <span className="featuredValue">{courses.length}</span>
                    </div>
                </Item>

            </Grid>
            <Grid item xs = {6}>
            <Item className="featuredItem">
                <span className="featuredTitle">Labs</span>
                <div className="featuredInfo">
                    <span className="featuredValue">{labs.length}</span>
                </div>
            </Item>
            </Grid>
            <Grid item xs = {6}>
            <Item className="featuredItem" onClick={()=>{setCurrentPage('professor')}}>
                <span className="featuredTitle">Professors</span>
                <div className="featuredInfo">
                    <span className="featuredValue">{professors.length}</span>
                </div>
            </Item>

            </Grid>
            <Grid item xs = {6}>
            <Item className="featuredItem" onClick={()=>{setCurrentPage('room')}}>
                    <span className="featuredTitle">Rooms</span>
                    <div className="featuredInfo">
                        <span className="featuredValue">{rooms.length}</span>
                    </div>
            </Item>              
            </Grid>
        </Grid>
    )

}

/**
 * This function displays the information of created objects and plans
 * @param courses - state of create course objects
 * @param labs - state of created lab objects
 * @param professors - state of created professor objects
 * @param rooms - state of created room objects
 * @param setCurrentPage - function that changes displayed page
 * @param plans - state of created plan objects
 * @returns - Component that has both ComponentsInfo and SolutionContent
 */
const Dashboard = ({courses, labs, professors, 
    rooms, setCurrentPage, plans}) => {
    return (
        <div className="home">
            <Grid container spacing = {0}>
                <Grid item xs = {6}>
                    <SolutionContent plans={plans} 
                    setCurrentPage={setCurrentPage}></SolutionContent>
                </Grid>
                <Grid item xs = {6}>
                        <ComponentsInfo courses={courses} labs={labs} 
                        professors={professors} rooms={rooms} setCurrentPage={setCurrentPage}/>   
                </Grid>
            </Grid>
        </div>
    )
}

/**
 * This function combines the dashboard and top bar
 * @param courses - state of create course objects
 * @param labs - state of created lab objects
 * @param professors - state of created professor objects
 * @param rooms - state of created room objects
 * @param setCurrentPage - function that changes displayed page
 * @param plans - state of created plan objects
 * @returns - Page that has the dashboard along with top bar
 */
const HomePageContent = ({courses, labs, professors, 
    rooms, setCurrentPage, plans}) => {
    
    return (
        
    <div className="main-div">
        <TopBar></TopBar>
        <br />
        <br />
        <div className="container-top-text">
            <h4> Hello User, here are your latest stats...</h4>
        </div>
        <div className="container-home">
            <Dashboard courses={courses} labs={labs} professors={professors} 
            rooms={rooms} setCurrentPage={setCurrentPage} plans={plans}/>
        </div>
    </div>
    );
}

/**
* The component that will display an individual plan. These components will 
* populate the PlanList component.
* @param plan - an individual solution
* @return - React component of a created plan 
*/
const SolutionItem = ({plan}) => {
    {/*console.log(plans);*/}
    return(
        <div className= "item">
            <div>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
            </div>
        </div>
    );
}

/**
* This component is a view that lists out individual PlanListItems.
* @param plans - The state of plans that are passed down from App.js
* @param setCurrentPage - function that changes the displayed page
* @returns - React component of created plan objects as SolutionItems
*/
const SolutionList = ({plans, setCurrentPage}) => {
    console.log('SolutionList', plans);
    return(
        <div className='container-home-plan' 
        onClick={()=>{setCurrentPage('SolutionDashboard')}}>
            <h1 className = 'sticky'>Schedules</h1>
            {plans.map((currentSolution, index) => (
                <SolutionItem key={index} plan={currentSolution} plans={plans}/>
            ))}
        </div>
    );
}

/**
* This page will have a list of plans that have been added and
* the plans that are in the database.
* @param plans - the state of plans passed from App.js
* @param setCurrentPage - function that changes displayed page
* @return - styled SolutionList for the dashboard
*/
const SolutionContent = ({ plans, setCurrentPage }) => {
    return (
            <div className='home-plan-style'>
                <SolutionList plans={plans} setCurrentPage={setCurrentPage}/>
            </div>
    );
}

/**
 * This function is what is being exported by the page and contains the
 * created components of this file to be displayed
 * @param courses - state of create course objects
 * @param labs - state of created lab objects
 * @param professors - state of created professor objects
 * @param rooms - state of created room objects
 * @param setCurrentPage - function that changes displayed page
 * @param plans - state of created plan objects
 * @param getLastestPlans - function that loads the latest plans from database
 * @returns - Component that has both ComponentsInfo and SolutionContent
 */
 export const HomePage = ({courses, labs, professors, rooms, setCurrentPage, 
    plans, getLatestPlans}) => {
     
    //This makes sure when we reload this page, we get the latest plans.
    useEffect(getLatestPlans, []);

     return (
         
     <div>
        <SideNavigation></SideNavigation>
            <div id="main">
                <HomePageContent courses={courses} labs={labs} professors={professors} 
                rooms={rooms} setCurrentPage={setCurrentPage} plans={plans}></HomePageContent>
            </div>
         
     </div>
     );
 }

export default HomePage;