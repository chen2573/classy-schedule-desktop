/**
 * ProfessorAddPage is responsible for creating an html div that allows the user to create new professor objects.
 * It will also store the entered information as state.
 * 
 * Style Guide Issues:
 *    - camelCase variable names?
 *    - spaces around equals sign
 * 
 * Bugs:
 *    - None :)
 * 
 * @author Joseph Heimel
 */

 import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, TextField } from '@mui/material';
 import { React, useState, memo, useReducer, useEffect } from 'react';
 import {FaTimes, FaPencilAlt} from 'react-icons/fa';
 
 import './../../assets/styles/HomePage.css';
 import './../../assets/styles/SideNav.css';
 import './../../assets/styles/AddPages.css';
 import SideNavigation from './../SideNavigation.js';
 import TopBar from './../TopBar.js'
 
  /**
  * The component that will be exported. This page will have an Add form and list the Professors that have been added and
  * the professors that are in the database.
  * 
  * @param onAddProfessor - The function 'addProfessor' from App.js that will fire when the ProfessorAddPage is submitted
  * @param professors     - The state of professors passed from App.js
  * @param onDelete       - Handler function that deletes an individual item from the list
  * @param courses        - State variable containing course objects
  * @param programs       - State variable containing program objects
  */
   const ProfessorAddPage = ({onAddProfessor, professors, onDelete, courses, programs}) => {

    const [profEditedId, setProfEditedId] = useState(null);
    const [editedProfessor, setEditedProfessor] = useState(null);
    const onEdit = profId => e => {
      setProfEditedId(profId);
      setEditedProfessor(profId === null ? null : professors.find(p => p.id === profId));
      console.log({profId})
    }

    // Styling
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      sx: {
        "&& .Mui-selected": {
          backgroundColor: "#90A4AE"
        }
      },
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      }
    };
    
    /**
      * This function works in tandem to other validating functions
      * This updates state with the passed state setter iff the passed validate function returns true
      * 
      * @param validateFN  - Validating function
      * @param stateSetter - State updating function
      */
    const validate = (validateFN, stateSetter) => e => {
      stateSetter(oldValue => validateFN(e.target.value) ? e.target.value : oldValue);
    }
      
    /**
      * This component represents the form that will be used by the user to enter in new professor data.
      * 
      * @param onAddProfessor - The addSubmit function that is passed down from App.js
      * @param courses        - State variable containing course objects
      * @param programs       - State variable containing program objects
      * @returns              - React component div used to enter and submit professor information
      */
    const ProfessorAdd = ({onAddProfessor, courses, programs}) => {
      const [program, setProgram] = useState('');
      const [firstName, setFirstName] = useState(profEditedId === null ? '' : editedProfessor.firstName);
      const [lastName, setLastName] = useState(profEditedId === null ? '' : editedProfessor.lastName);
      const [teach_load, setTeachLoad] = useState(profEditedId === null ? '6' : editedProfessor.teach_load);
      const [time_block, setTimeBlock] = useState(profEditedId === null ? '' : editedProfessor.time_block);
      const [can_teach, setCanTeach] = useState(profEditedId === null ? [] : editedProfessor.can_teach);
      const [want_teach, setWantTeach] = useState(profEditedId === null ? [] : editedProfessor.want_teach);
    
    
    
                            // Input Validation
      /**
        * This function enforces that the input is an int 0-20, with a .5, and an empty string
        * 
        * The comment included function only handles ints 0-20
        * //const validTeachingLoad = value => (new Array(21).fill(true).map((e, i) => `${i}`)              ).includes(value);
        *              This addition to the above function accounts for an empty string   ->   .concat("")
        * 
        * @param val - Input value
        * @returns   - True if the input is valid, otherwise false
        */
      const validTeachingLoad = val => [...val.matchAll(/(1[0-9]|20|[0-9])?(\.[5]{0,1})?/g)].some(x => x[0] == val) || val === '';
    
      // This function calls passes other functions to validate
      const validateTeachLoad = validate(validTeachingLoad, setTeachLoad);
        
      /**
        * This function enforces that the input is alphanumeric lower or upper case or ' '
        * @param name - Input value
        * @returns    - True if the input is valid, otherwise false
        */
      const validNameChars = name => name.split('').every(c => new Array(26).fill(true).map((e, i) => String.fromCharCode(i  + 97)).concat(new Array(26).fill(true).map((e, i) => String.fromCharCode(i  + 97)).map(x => x.toUpperCase())).concat(' ').includes(c));
      
      /**
        *  This function enforces that the input is less than 30 characters
        * @param name - Input value
        * @returns    - True if the input is valid, otherwise false
        */
      const validNameLength = name => name.length < 31;
      
      // This function combines two different validate functions
      const validName = name => validNameChars(name) && validNameLength(name);
      
      // This function calls passes other functions to validate
      const validateFirstName = validate(validName, setFirstName);
    
      // This function calls passes other functions to validate
      const validateLastName = validate(validName, setLastName);
    
    
    
    
      /**
        * This function handles addition of unique list items and removal of present list items
        * The imbedded stateSetter updates the state object in one of these ways
        * 
        * @param courseInfo  - Object containing all relevant course information
        * @param stateSetter - State updating function
        */
      const handleClick = (courseInfo, stateSetter) => e => {
        stateSetter(oldValue => {
          if(oldValue.some(x => JSON.stringify(x) == JSON.stringify(courseInfo))) {
            console.log({oldValue});
    
            return oldValue.filter(x => JSON.stringify(x) != JSON.stringify(courseInfo));
          }
          const newValue = [...oldValue, courseInfo]
          return newValue;
        })
      }
      
    
    
      /**
        * This function alerts the user if they are missing necessary data,
        * if all necessary data is present, it passes the data and resets to default
        * 
        * @param e - Event object
        * @returns - Alert to user
        */
      const onSubmit = (e) => {
        e.preventDefault();
        e.target.reset();
        if (!program) {
          alert('Please enter a program');
          return;
        }
        if (!firstName) {
          alert('Please enter a professor name');
          return;
        }
        if (!lastName) {
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
      
            
        let elementClassName = 'item';

        if(profEditedId === null){
          onAddProfessor({program, firstName, lastName, teach_load, time_block, can_teach, want_teach, elementClassName});
        } else {
          //onEditProfessor({program, firstName, lastName, teach_load, time_block, can_teach, want_teach, elementClassName});
          console.log("Call to onEditProfessor function happens here.")
        }
      
        setProgram('');
        setFirstName('');
        setLastName('');
        setTeachLoad('6');
        setCanTeach([]);
        setWantTeach([]);
        setTimeBlock('');
      }
      
      
      return (
        <div className='container'>
          <h2>{profEditedId !== null ? "Edit" : "Add"} A Professor</h2>
          <form onSubmit={onSubmit}>
    
            <br></br>
    
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel shrink id="label">Program</InputLabel>
                <Select
                  labelId="label"
                  id='program_dropdown'
                  notched
                  MenuProps={{sx: {
                    "&& .Mui-selected": {
                      backgroundColor: "#90A4AE"
                    }
                  }}}
                  value={program}
                  label="Program"
                  onChange={(e) => setProgram(e.target.value)}
                >
                  {programs.map(p => (
                    <MenuItem 
                      key={p.id} 
                      value={p.programName}
                    >
                      {p.programName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
    
    
            <br></br>
                
            <Box>
              <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_name" label="First Name" variant="outlined" value={firstName} onChange={validateFirstName}/>
            </Box>
            
            <br></br>
    
            <Box>
              <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_name" label="Last Name" variant="outlined" value={lastName} onChange={validateLastName}/>
            </Box>
    
            <br></br>
    
            <Box>
              <TextField InputLabelProps={{ shrink: true }} fullWidth id="enter_teach_load" label="Teach Load" variant="outlined" value={teach_load} onChange={validateTeachLoad}/>
            </Box>
    
            <br></br>
    
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel shrink id="label">Preferred Time Block</InputLabel>
                <Select
                  labelId="label"
                  id='time_block_dropdown'
                  notched
                  MenuProps={{sx: {
                    "&& .Mui-selected": {
                      backgroundColor: '#90A4AE'
                    }
                  }}}
                  value={time_block}
                  label="Preferred Time Block"
                  onChange={(e) => setTimeBlock(e.target.value)}
                >
                  <MenuItem value="mwf_morning">MWF Morning</MenuItem>
                  <MenuItem value="mwf_afternoon">MWF Afternoon</MenuItem>
                  <MenuItem value="mwf_night">MWF Night</MenuItem>
                  <MenuItem value="tr_morning">TR Morning</MenuItem>
                  <MenuItem value="tr_afternoon">TR Afternoon</MenuItem>
                  <MenuItem value="tr_night">TR Night</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <br></br>
    
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel shrink id="label">Courses Professor Can Teach</InputLabel>
                <Select
                  labelId="label"
                  id='can_teach_dropdown'
                  multiple
                  notched
                  value={can_teach.map(e => e.name)}
                  label="Courses Professor Can Teach"
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
                      onClick={handleClick(p, setCanTeach)}
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
                <InputLabel shrink id="label">Courses Professor Want to Teach</InputLabel>
                <Select
                  labelId="label"
                  id='want_teach_dropdown'
                  multiple
                  notched
                  value={want_teach.map(e => e.name)}
                  label="Courses Professor Want to Teach"
                  input={<OutlinedInput id="select-multiple-chip" label="Courses Professor Want to Teach" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {can_teach.map(p => (
                    <MenuItem 
                      onClick={handleClick(p, setWantTeach)}
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
    
            {profEditedId === null ? <input type="submit" value='Save Professor' className='btn btn-block'/> 
            : <input type="submit" value='Save Edits' className='btn btn-block'/>}
          </form>
        </div>
      );
    }
      
    /**
      * This component is a view that lists out individual ProfessorListItems.
      * 
      * @param professors - The state of professors that is passed down from App.js
      * @param onDelete   - Handler function that deletes an individual item from the list
      * @returns          - React component that lists viewable professor components
      */
    const ProfessorList = ({professors, onDelete, onEdit}) => {
      return (
        <div className='container'>
        {professors.map((currentProfessor, index) => (
          <ProfessorListItem key={index} professor={currentProfessor}
          onDelete={onDelete} onEdit={onEdit}/>
        ))}
        </div>
      );
    }
      
      
    /**
      * The component that will display an individual professor. These components will populate the ProfessorList component.
      * 
      * @param professor - An individual professor
      * @param onDelete  - Handler function that deletes an individual item from the list
      * @returns         - React component that displays a single professor component
      */
    const ProfessorListItem = ({professor, onDelete, onEdit}) => {
      return (
        <div className='item'>
          <h3>{professor.firstName} {professor.lastName} <FaPencilAlt style={{color:'#90A4AE', cursor: 'pointer'}} onClick={onEdit(professor.id)}/><FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(professor.id)} /></h3>
          {/* This stuff in the paragraph tag will become popover*/}
          <p>Program: {professor.program}<br></br></p>
        </div>
      );
    }
    
    /**
      * This page will have an Add form and list the Professors that have been added and
      * the professors that are in the database.
      * 
      * @param onAddProfessor - The function 'addProfessor' from App.js that will fire when the ProfessorAddPage is submitted
      * @param professors     - The state of professors passed from App.js
      * @param onDelete       - Handler function that deletes an individual item from the list
      * @param courses        - State variable containing course objects
      * @param programs       - State variable containing program objects
      */
      const ProfessorAddPageContent = ({onAddProfessor, professors, onDelete, courses, programs}) => {
    
      //onEditProfessor={onEditProfessor} - not implemented
    
    
    
      return (
        <div className="home">
          <div className='element-page'>
            <ProfessorAdd onAddProfessor={onAddProfessor} courses={courses} programs={programs}/>
            <ProfessorList onDelete={onDelete} professors={professors.filter(p => p.id !== profEditedId)} onEdit={onEdit}/> 
          </div>
        </div>
      );
    }
 
    useEffect(() => {

    }, [profEditedId])

   return (
     <div>
       <SideNavigation></SideNavigation>
 
       <div id="main">
           <div className="main-div">
               <TopBar></TopBar>
 
               <div className="container-home">
                 <ProfessorAddPageContent onAddProfessor={onAddProfessor} professors={professors} onDelete={onDelete} courses={courses} programs={programs}></ProfessorAddPageContent>
               </div>
           </div>
       </div>
     </div>
   );
 }
 
 export default ProfessorAddPage;