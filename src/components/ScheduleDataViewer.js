import React, {useState} from 'react';
import {Box, Popover, Typography} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';


/**
 * This is a universal component for viewing data items within the data states.
 * It wraps the component that will trigger the popover (probably a button). When
 * any of the children wrapped inside are clicked they trigger the popover.
 * 
 * For example,
 * <DataViewer id={1} dataState={courses} sx={{}}>
        <Button></Button>
    </DataViewer>
    will find the item in courses that has an id of 1 and display all attributes in it when Button is clicked.
 * @param id unique identifier/primary key to locate item in the state
 * @param state data state where the item is located
 * @param sx MUI styling prop to style the component where the child is wrapped in
 * @param children automatically passed prop when wrapping elements in this component
 */
export function ScheduleDataViewer ({id, dataState, sx, children})
{
    var displayData = [];   //set display data to empty in case item is not found
    if (dataState.filter((item) => item.id === id)[0] != undefined)
    {
        displayData = Object.entries(dataState.filter((item) => item.id === id)[0]);
    }  //get data entry by id
    
    //wrapper to bind popover state   
    return (
        <PopupState variant="popover">
        {(popupState) => (
            <React.Fragment>
                {/* bind children wrapped within the DataViewer tag to trigger, and style according to the sx prop*/}
                <Box {...bindTrigger(popupState)} sx={{sx}}>{children}</Box>


                {/* popover box with all data info */}
                <Popover
                        id={id}
                        {...bindMenu(popupState)}
                        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                        transformOrigin={{vertical: 'top', horizontal: 'left'}}
                >
                    
                    {displayData.map((attribute) =>
                        {
                            {/*need to remove comment here to get rid of id*/}
                            {/*attribute[0] != 'id' &&*/}
                        if(attribute[0] != 'elementClassName'){
                            //map each attribute of displayData to strings
                            return <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                        <Typography sx={{fontWeight: 'bold', textTransform: 'uppercase', marginLeft:'1em', marginRight:'1.5em'}}>{attribute[0]}</Typography>
                                        <Typography sx={{marginLeft:'1.5em', marginRight:'1em'}}>{attribute[1]}</Typography>
                                    </Box>
                            }

                        })}

                </Popover>
        
        </React.Fragment>
        )}
    </PopupState>
    );

}

export default ScheduleDataViewer;