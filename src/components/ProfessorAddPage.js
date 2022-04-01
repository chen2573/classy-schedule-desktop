/**
 * ProfessorAddPage is responsible for creating an html div that allows the user to create new professor objects.
 * It will also store the entered information as state.
 * 
 * Bugs:
 *  - Find a way to set the default value of teach load to 6
 *  - Build object from menu item to pass to next menu
 * 
 * @author Joseph Heimel
 */

 import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput } from '@mui/material';
 import { React, useState } from 'react';
 import {FaTimes} from 'react-icons/fa';
 
 
 /**
  * Creates a mapped list of program/department names to be used dynamically on the html page
  * 
  * @param programs - state variable containing program objects
  * @returns - Mapped list of program names
  */
 const ProgramSelectItems = ({ programs }) => {
   let programsList = programs.map(p => {
       return (<option key={p.id} value={p.programName}>{p.programName}</option>);
   });
 
   return (
       <>
           {programsList}
       </>
   );
 }
 
 /**
  * This component represents the form that will be used by the user to enter in new professor data.
  * 
  * @param onAddProfessor - The addSubmit function that is passed down from App.js
  * @param courses - State variable containing course objects
  * @param programs - State variable containing program objects
  * @returns - React component div used to enter and submit professor information
  */
 const ProfessorAdd = ({onAddProfessor, courses, programs}) => {
   const [department, setDepartment] = useState('');
   const [name, setName] = useState('');
   const [teach_load, setTeachLoad] = useState('');
   const [time_block, setTimeBlock] = useState('');
   const [can_teach, setCanTeach] = useState([]);
   const [want_teach, setWantTeach] = useState([]);
 
   const ITEM_HEIGHT = 48;
   const ITEM_PADDING_TOP = 8;
   const MenuProps = {
     PaperProps: {
       style: {
         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
         width: 250,
       },
     },
   };
 
   const handleCanChange = (e) => {
     const {
       target: { value },
     } = e;
     setCanTeach(
       // On autofill we get a stringified value.
       typeof value === 'string' ? value.split(',') : value,
     );
   };
 
   const handleWantChange = (e) => {
     const {
       target: { value },
     } = e;
     setWantTeach(
       // On autofill we get a stringified value.
       typeof value === 'string' ? value.split(',') : value,
     );
   };
 
   const onSubmit = (e) => {
       e.preventDefault();
       e.target.reset();
       if (!department) {
           alert('Please enter a department');
           return;
       }
       if (!name) {
           alert('Please enter a professor name');
           return;
       }
       if (!teach_load) {
           alert('Please enter desired teach load');
         return;
       }
       if (!time_block) {
           alert('Please enter a meeting time');
           return;
       }
       if (!can_teach) {
           alert('text');
           return;
       }
       if (!want_teach) {
         alert('text');
         return;
       }
 
       
 
       onAddProfessor({department, name});
 
       setDepartment('');
       setName('');
       setTeachLoad('');
   }
 
 
   return (
       <div className='container'>
           <h2>Add A Professor</h2>
           <form onSubmit={onSubmit}>
               <div className='form-control'>
                   <label>Department</label>
                   <select onChange={(e) => setDepartment(e.target.value)}>
                       <option value=""></option>
                       <ProgramSelectItems programs={programs} />
                   </select>
               </div>
 
               <div className='form-control'>
                   <label>Professor Name</label>
                   <input type="text" placeholder='Enter professor name' value={name} onChange={(e) => setName(e.target.value)}/>
               </div>
 
               <div className='form-control'>
                   <label>Teach Load</label>
                   <input type="number" placeholder='Enter desired teach load' value={teach_load} onChange={(e) => setTeachLoad(e.target.value)}/>
               </div>
 
               <div className='form-control'>
                   <label>Preferred Time Block</label>
                   <select onChange={(e) => setTimeBlock(e.target.value)}>
                     <option value=""></option>
                     <option value="mwf_morning">MWF Morning</option>
                     <option value="mwf_afternoon">MWF Afternoon</option>
                     <option value="mwf_night">MWF Night</option>
                     <option value="tr_morning">TR Morning</option>
                     <option value="tr_afternoon">TR Afternoon</option>
                     <option value="tr_night">TR Night</option>
                   </select>
               </div>
 
               <Box sx={{ minWidth: 120 }}>
                 <FormControl fullWidth>
                   <InputLabel id="label">Courses Professor Can Teach</InputLabel>
                     <Select
                       labelId="label"
                       id='can_teach_dropdown'
                       multiple
                       value={can_teach}
                       label="Courses Professor Can Teach"
                       onChange={handleCanChange}
                       input={<OutlinedInput id="select-multiple-chip" label="Courses Professor Can Teach" />}
                       renderValue={(selected) => (
                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                           {selected.map((value) => (
                             <Chip key={value} label={value} />
                           ))}
                         </Box>
                       )}
                       MenuProps={MenuProps}
                     >
                     {courses.map(p => (
                       <MenuItem 
                         key={p.id} 
                         value={p.name}
                       >
                         {p.name}
                       </MenuItem>
                     ))}
                   </Select>
                 </FormControl>
               </Box>
 
               <br></br>
               
               <Box sx={{ minWidth: 120 }}>
                 <FormControl fullWidth>
                   <InputLabel id="label">Courses Professor Want to Teach</InputLabel>
                     <Select
                       labelId="label"
                       id='want_teach_dropdown'
                       multiple
                       value={want_teach}
                       label="Courses Professor Want to Teach"
                       onChange={handleWantChange}
                     >
                     {can_teach.map(p => (
                       <MenuItem 
                         key={p.key} 
                         value={p.value}
                       >
                         {p.key}
                       </MenuItem>
                     ))}
                   </Select>
                 </FormControl>
               </Box>
 
               <input type="submit" value='Save Professor' className='btn btn-block'/>
           </form>
       </div>
   );
 }
 
 
 /**
  * This component is a view that lists out individual ProfessorListItems.
  * 
  * @param professors - The state of professors that is passed down from App.js
  * @param onDelete - Handler function that deletes an individual item from the list
  * @returns - React component that lists viewable professor components
  */
 const ProfessorList = ({professors, onDelete}) => {
   return (
     <div className='container'>
     {professors.map((currentProfessor, index) => (
         <ProfessorListItem key={index} professor={currentProfessor}
         onDelete={onDelete}/>
     ))}
     </div>
   );
 }
 
 
 /**
  * The component that will display an individual professor. These components will populate the ProfessorList component.
  * 
  * @param professor - An individual professor
  * @param onDelete - Handler function that deletes an individual item from the list
  * @returns - React component that displays a single professor component
  */
 const ProfessorListItem = ({professor, onDelete}) => {
   return (
     <div className='item'>
         <h3>{professor.name} <FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(professor.id)} /></h3>
         {/* This stuff in the paragraph tag will become popover*/}
         <p>Department: {professor.department}<br></br></p>
     </div>
   );
 }
 
 /**
  * The that will be exported. This page will have an Add form and list the Professors that have been added and
  * the professors that are in the database.
  * 
  * @param onAddProfessor - The function 'addProfessor' from App.js that will fire when the ProfessorAddPage is submitted
  * @param professors - The state of professors passed from App.js
  * @param onDelete - Handler function that deletes an individual item from the list
  * @param courses - State variable containing course objects
  * @param programs - State variable containing program objects
  */
 const ProfessorAddPage = ({onAddProfessor, professors, onDelete, courses, programs}) => {
   return (
     <div>
         <div className='element-page'>
             <ProfessorAdd onAddProfessor={onAddProfessor} courses={courses} programs={programs}/>
             <ProfessorList onDelete={onDelete} professors={professors}/>
             
         </div>
     </div>
   );
 }
 
 export default ProfessorAddPage;