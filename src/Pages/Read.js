import { IconButton, MenuItem, Toolbar } from '@material-ui/core';
import { MenuOpenOutlined } from '@material-ui/icons';
import Close from '@material-ui/icons/Close';
import ReadingPane from 'Components/read/ReadingPane';
import SidePane from 'Components/read/SidePane';
import SideDrawer from 'Components/shared/mui-x/SideDrawer';
import React, { useState } from 'react';
import styled from 'styled-components';

function Read() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = e => {
        setDrawerOpen(s => !s);
    }
    return (
        <Wrapper className='page fill-screen' >
            <div >
                <IconButton id='menu' onClick={toggleDrawer} >
                    <MenuOpenOutlined data-open={drawerOpen} />
                </IconButton>
                <ReadingPane />
            </div>
            <SidePane open={drawerOpen} onClose={toggleDrawer} />
        </Wrapper>
    )
}


const Wrapper = styled.div`
    display: flex;
    > div:first-child {
        position: relative;
        width: 100%;
        svg{
            transition: transform 250ms ease-out;
            &[data-open=true] {
                transform: rotate(180deg);
            }
        }
    }
    #menu {
        position: absolute;
        z-index: 1000;
        /* top: ${({ theme }) => theme.mixins.toolbar.minHeight + 16}px; */
        top: 0px;
        background-color: ${({ theme }) => theme.palette.type === 'light' ?
            theme.palette.grey[100] : theme.palette.grey[900]
        };
        right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
`;


export default Read;
