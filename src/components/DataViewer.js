import {useState} from 'react';
import {Box} from '@mui/material';


export function DataViewer ({id, dataState, anchor, open, handleClose})
{
    const displayData = Object.entries(dataState.filter((item) => item.id === id)[0]);  //get data entry by id
    
    return (
        <Popover
                id={time+entry}
                open={open}
                anchorEl={anchor}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
            
            {displayData.map((attribute) => {return <Box>{attribute[0]} {attribute[1]}</Box>})}

        </Popover>
    );

}

export default DataViewer;