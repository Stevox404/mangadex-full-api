import {
    MenuItem, Select, Typography, FormControlLabel, Checkbox, TextField, InputAdornment
} from '@material-ui/core';
import MuiXDialog from 'Components/shared/mui-x/GenericDialog';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';


function ReaderSettings(props) {
    return (
        <Dialog
            open={props.open} breakpoint='sm' maxWidth='sm' fullWidth
            hideDialogActions showCloseButton onClose={props.onClose}
            disableBackdropClick={false}
            title={
                <>
                    <Typography variant='h6' >Settings</Typography>
                    <FormControlLabel
                        value={props.readerSettings.showAdvanced}
                        onChange={props.onChange}
                        name='showAdvanced'
                        control={<Checkbox color="secondary" checked={props.readerSettings.showAdvanced} />}
                        label="Show Advanced Controls"
                        labelPlacement="start"
                    />
                </>
            }
        >
            <Typography id="img-size-lbl" component='label'>Image Size:</Typography>
            <Select
                labelId="img-size-lbl"
                value={props.readerSettings.imageSize}
                onChange={props.onChange}
                name='imageSize'
            >
                <MenuItem value='fit-width' >Fit Width</MenuItem>
                <MenuItem value='fit-height' >Fit Height</MenuItem>
                <MenuItem value='original' >Original</MenuItem>
            </Select>

            <Typography id="display-mode-lbl" component='label'>Display Mode:</Typography>
            <Select
                labelId="display-mode-lbl"
                value={props.readerSettings.displayMode}
                onChange={props.onChange}
                name='displayMode'
            >
                <MenuItem value='single' >Single Page</MenuItem>
                <MenuItem value='double' >Double Page</MenuItem>
                <MenuItem value='all' >All Pages</MenuItem>
                <MenuItem value='webcomic' >Webcomic</MenuItem>
            </Select>

            <Typography id="read-dir-lbl" component='label'>Reading Direction:</Typography>
            <Select
                labelId="read-dir-lbl"
                value={props.readerSettings.readingDir}
                onChange={props.onChange}
                name='readingDir'
            >
                <MenuItem value='right' >Left to Right</MenuItem>
                <MenuItem value='left' >Right to Left</MenuItem>
            </Select>

            <FormControlLabel
                value={props.readerSettings.mouseClickNav}
                onChange={props.onChange}
                name='mouseClickNav'
                control={<Checkbox color="primary" checked={props.readerSettings.mouseClickNav} />}
                label="Mouse Click Navigation"
                labelPlacement="start"
                className='full-width'
            />
            
            {props.readerSettings.showAdvanced && <>
                <TextField
                    label='Arrow Scroll Distance'
                    value={props.readerSettings.arrowScrollSize}
                    onChange={props.onChange}
                    type='number'
                    name='arrowScrollSize'
                    InputProps={{
                        endAdornment: <InputAdornment position="end">px</InputAdornment>
                    }}
                />
                <TextField
                    label='Preload Pages'
                    value={props.readerSettings.preloadPages}
                    onChange={props.onChange}
                    type='number'
                    name='preloadPages'
                    helperText='Set to -1 to preload full chapter'
                    inputProps={{
                        min: -1
                    }}
                />
            </>}
        </Dialog>
    )
}


/**@type {MuiXDialog} */
const Dialog = styled(MuiXDialog)`
    .MuiDialogTitle-root {
        display: flex;
        align-items: center;
    }
    .MuiDialogContent-root {
        display: grid;
        grid-template-columns: 1fr auto;
        justify-content: space-between;
        row-gap: 2rem;
        column-gap: 1rem;
        .full-width {
            grid-column: 1/3;
        }
        .MuiFormControlLabel-root {
            margin: 0;
            justify-self: flex-start;
        }
    }
`;


ReaderSettings.propTypes = {
    open: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    readerSettings: PropTypes.shape({
        displayMode: PropTypes.string,
        imageSize: PropTypes.string,
        readingDir: PropTypes.string,
        arrowScrollSize: PropTypes.number,
        preloadPages: PropTypes.number,
    }),
}

export default ReaderSettings;