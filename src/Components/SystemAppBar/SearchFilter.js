import React from 'react';
import MuiXDialog from 'Components/shared/mui-x/GenericDialog';
import styled from 'styled-components';
import PropTypes from 'prop-types';


function SearchFilter() {
    return (
        <Dialog
            open={props.open} breakpoint='sm' maxWidth='sm' fullWidth
            hideDialogActions showCloseButton onClose={props.onClose}
            disableBackdropClick={false}
        >
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


SearchFilter.propTypes = {
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


export default SearchFilter;