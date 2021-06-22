import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { Backdrop, Paper, Slide } from '@material-ui/core';

/**@param {SideDrawer.propTypes} props */
function SideDrawer(props) {
    const {
        variant, onClose, anchor, elevation, paperProps, maxWidth, ...extraProps
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
    const anchorCN = (_ => {
        switch (anchor) {
            case 'right': return 'uiSideDrawer-paperAnchorRight';
            case 'top': return 'uiSideDrawer-paperAnchorTop';
            case 'bottom': return 'uiSideDrawer-paperAnchorBottom';
            default: return 'uiSideDrawer-paperAnchorLeft';
        }
    })();


    return (temp ?
        <Wrapper 
            className={`uiSideDrawer-root uiSideDrawer-modal ${props.className || ''}`}
            anchor={anchor} {...extraProps}
        >
            <Backdrop open={props.open} onClick={onClose} />
            <Slide in={props.open} direction={dir} timeout={200} >
                <SideDrawerContainer
                    className={`uiSideDrawer-paper ${anchorCN}`} open={props.open}
                    elevation={elevation} maxWidth={maxWidth}
                    {...paperProps}
                >
                    {props.children}
                </SideDrawerContainer>
            </Slide>
        </Wrapper> :
        <Slide in={props.open} direction={dir} timeout={200} >
            <SideDrawerContainer
                className={`uiSideDrawer-root uiSideDrawer-docked uiSideDrawer-paper ${anchorCN} ${props.className || ''}`} 
                elevation={elevation} open={props.open} maxWidth={maxWidth} {...paperProps}
            >
                {props.children}
            </SideDrawerContainer>
        </Slide>
    )
}


/* transition: width .75s ease-out; */
/* overflow-y: auto; */
const Wrapper = styled.div`
    width: 90%;
    position: absolute;
    height: 100%;
    overflow: hidden;
    z-index: ${({ theme }) => theme.zIndex.drawer};
    ${({ anchor, theme }) => css`
        ${anchor}: 0;
        >*:last-child {
            ${anchor}: 0;
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

const SideDrawerContainer = styled(Paper)`
    width: ${({ open }) => open ? '100%' : '0px'};
    max-width: ${({ maxWidth }) => `${Number.parseInt(maxWidth)}px`};
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    z-index: ${({ theme }) => theme.zIndex.drawer};
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
    maxWidth: PropTypes.oneOfType([
        PropTypes.number, PropTypes.string,
    ]),
}


export default SideDrawer;
