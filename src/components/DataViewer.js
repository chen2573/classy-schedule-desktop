import React, {useState} from 'react';
import {Box, Popover, Typography} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';


export function DataViewer ({id, dataState, sx, children})
{
    var displayData = [];   //set display data to empty in case item is not found
    if (dataState.filter((item) => item.id === id)[0] != undefined) {displayData = Object.entries(dataState.filter((item) => item.id === id)[0]);}  //get data entry by id
    
    return (
        //wrapper to bind popover state   
        <PopupState variant="popover">
        {(popupState) => (
            <React.Fragment>
                {/* bind children wrapped within the DataViewer tag to trigger, and style according to the sx prop*/}
                <Box {...bindTrigger(popupState)} sx={{sx}}>{children}</Box>


                {/* popover box with all data info */}
                <Popover
                        id={id}
                        {...bindMenu(popupState)}
                        anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                        transformOrigin={{vertical: 'bottom', horizontal: 'left'}}
                >
                    
                    {displayData.map((attribute) =>
                        {
                            //map each attribute of displayData to strings
                            return <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                        <Typography sx={{fontWeight: 'bold', textTransform: 'uppercase', marginLeft:'1em', marginRight:'1.5em'}}>{attribute[0]}</Typography>
                                        <Typography sx={{marginLeft:'1.5em', marginRight:'1em'}}>{attribute[1]}</Typography>
                                    </Box>

                        })}

                </Popover>
        
        </React.Fragment>
        )}
    </PopupState>
    );

}

export default DataViewer;