/**
 * ProfessorAddPage is responsible for creating an html div that allows the user to create new professor objects.
 * It will also store the entered information as state.
 * 
 * Bugs:
 *    - None :)
 * 
 * @author Joseph Heimel
 */

import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput, TextField } from '@mui/material';
import { React, useState } from 'react';
import {FaTimes} from 'react-icons/fa';
 

// Styling
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

/**
 * 
 * @param validateFN 
 * @param stateSetter 
 * @returns 
 */
const validate = (validateFN, stateSetter) => e => {
  stateSetter(oldValue => validateFN(e.target.value) ? e.target.value : oldValue);
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
  const [program, setProgram] = useState('');
  const [name, setName] = useState('');
  const [teach_load, setTeachLoad] = useState('6');
  const [time_block, setTimeBlock] = useState('');
  const [can_teach, setCanTeach] = useState([]);
  const [want_teach, setWantTeach] = useState([]);

  /**
   * 
   * @param value 
   * @returns 
   */
  const validTeachingLoad = value => (new Array(21).fill(true).map((e, i) => `${i}`).concat("")).includes(value);
  //
  const validateTeachLoad = validate(validTeachingLoad, setTeachLoad);
   
  /**
   * 
   * @param name 
   * @returns 
   */
  const validNameChars = name => name.split('').every(c => new Array(26).fill(true).map((e, i) => String.fromCharCode(i  + 97)).concat(new Array(26).fill(true).map((e, i) => String.fromCharCode(i  + 97)).map(x => x.toUpperCase())).concat(' ').includes(c));
  /**
   * 
   * @param name 
   * @returns 
   */
  const validNameLength = name => name.length < 31;
  //
  const validName = name => validNameChars(name) && validNameLength(name);
  //
  const validateName = validate(validName, setName);

  /**
   * 
   * @param courseInfo 
   * @returns 
   */
  const handleCanClick = courseInfo => e => {
    setCanTeach(oldValue => {
      if(oldValue.some(x => JSON.stringify(x) == JSON.stringify(courseInfo))) {
        console.log({oldValue});

        return oldValue.filter(x => JSON.stringify(x) != JSON.stringify(courseInfo));
      }
      const newValue = [...oldValue, courseInfo]
      return newValue;
    })
  }

  /**
   * This function handles unique list items and removal of list items
   * 
   * @param courseInfo - Object containing all relevant course information
   * @returns - newValue with old state and specified course added, or oldValue with specified course removed
   */
  const handleWantClick = courseInfo => e => {
    setWantTeach(oldValue => {
      if(oldValue.some(x => JSON.stringify(x) == JSON.stringify(courseInfo))) {
        return oldValue.filter(x => JSON.stringify(x) != JSON.stringify(courseInfo));
      }
      const newValue = [...oldValue, courseInfo]
      return newValue;
    })
  }
 

 

  /**
   * 
   * @param e - event object
   * @returns
   */
  const onSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    if (!program) {
      alert('Please enter a program');
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
 
       
 
    onAddProfessor({program, name});
 
    setProgram('');
    setName('');
    setTeachLoad('6');
    setCanTeach([]);
    setWantTeach([]);
    setTimeBlock('');
  }
 
 
  return (
    <div className='container'>
      <h2>Add A Professor</h2>
      <form onSubmit={onSubmit}>

        <br></br>

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="label">Program</InputLabel>
            <Select
              labelId="label"
              id='program_dropdown'
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
          <TextField fullWidth id="enter_name" label="Professor Name" variant="outlined" value={name} onChange={validateName}/>
        </Box>
        
        <br></br>

        <Box>
          <TextField fullWidth id="enter_teach_load" label="Teach Load" variant="outlined" value={teach_load} onChange={validateTeachLoad}/>
        </Box>

        <br></br>

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="label">Preferred Time Block</InputLabel>
            <Select
              labelId="label"
              id='time_block_dropdown'
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
            <InputLabel id="label">Courses Professor Can Teach</InputLabel>
            <Select
              labelId="label"
              id='can_teach_dropdown'
              multiple
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
                  onClick={handleCanClick(p)}
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
                  onClick={handleWantClick(p)}
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
      <p>Program: {professor.program}<br></br></p>
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