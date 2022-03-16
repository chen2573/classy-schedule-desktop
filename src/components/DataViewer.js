import React, {useState} from 'react';
import {Box, Popover, Typography} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';


export function DataViewer ({id, dataState, sx, children})
{
    var displayData = ['No data to display'];
    if (dataState.filter((item) => item.id === id)[0] != undefined) {displayData = Object.entries(dataState.filter((item) => item.id === id)[0]);}  //get data entry by id
    
    return (
        
        <PopupState variant="popover">
        {(popupState) => (
            <React.Fragment>
                <Box {...bindTrigger(popupState)} sx={{sx}}>{children}</Box>

                <Popover
                        id={id}
                        {...bindMenu(popupState)}
                        anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                        transformOrigin={{vertical: 'bottom', horizontal: 'left'}}
                >
                    
                    {displayData.map((attribute) =>
                        {
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