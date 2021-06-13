import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { Backdrop, Slide } from '@material-ui/core';

function SideDrawer(props) {
    const {
        variant, onClose, anchor, elevation
    } = props;
    const temp = variant === 'temporary';
    const dir = (_ => {
        switch (anchor) {
            case 'right': return 'left';
            case 'top': return 'bottom';
            case 'bottom': return 'top';
            default: return 'right';
        }
    })();

    const open = variant === 'permanent' ? true: props.open;

    return (temp ?
        <Wrapper {...props} >
            <Backdrop open={open} onClick={onClose} />
            <Slide in={open} direction={dir} timeout={450} >
                <SideDrawerContainer 
                    className='uiSideDrawer' elevation={elevation} open={open}
                >
                    {props.children}
                </SideDrawerContainer>
            </Slide>
        </Wrapper> :
        <SideDrawerContainer 
            className='uiSideDrawer' elevation={elevation} open={open}
        >
            {props.children}
        </SideDrawerContainer>
    )
}


/* transition: width .75s ease-out; */
    /* overflow-y: auto; */
const Wrapper = styled.div`
    width: 90%;
    max-width: ${({ maxWidth }) => `${maxWidth}px`};
    position: absolute;
    height: 100%;
    overflow: hidden;
    ${({ anchor, theme }) => css`
        ${anchor}: 0;
        >*:last-child {
            z-index: 1;
            position: absolute;
        }
    `};
    ${({ open }) => !open && css`
        width: 0px;
    `};
    
    .MuiBackdrop-root {
        z-index: 1;
    }
`;

const SideDrawerContainer = styled.div`
    background-color: ${({theme}) => theme.palette.background.paper};
    box-shadow: ${({theme, elevation}) => theme.shadows[elevation]};
    min-width: ${({open}) => open ? '200px': ''};
    width: ${({open}) => open ? 'min-content': '0px'};
    /* min-width: 200px;
    width: min-content; */
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
`;

SideDrawer.defaultProps = {
    variant: 'temporary',
    anchor: 'left',
    maxWidth: 300,
    elevation: 3,
}

SideDrawer.propTypes = {
    open: PropTypes.bool,
    variant: PropTypes.oneOf(['temporary', 'persistent', 'permanent']),
    anchor: PropTypes.oneOf(['left', 'right']),
    onClose: PropTypes.func,
    maxWidth: PropTypes.number,
}


export default SideDrawer;
