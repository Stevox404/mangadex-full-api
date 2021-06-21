import React, { useRef, useState } from 'react';
import pageImg from 'Assets/images/manga-sample.jpg';
import styled from 'styled-components';
import SideDrawer from 'Components/shared/mui-x/SideDrawer';
import { Drawer, IconButton, MenuItem, Toolbar } from '@material-ui/core';
import { MenuOpenOutlined, KeyboardArrowLeftOutlined } from '@material-ui/icons';
import Close from '@material-ui/icons/Close';

function Read() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const container = useRef(window.document.getElementsByClassName('page')[0]);
    // const container = useRef(null);

    const toggleDrawer = e => {
        setDrawerOpen(s => !s);
    }
    return (
        <Wrapper className='page fill-screen' >
            <IconButton id='menu' onClick={toggleDrawer} >
                <MenuOpenOutlined />
            </IconButton>
            <div id='read-pane' >
                <img src={pageImg} />
            </div>
            <Drawer
                // container={container.current} open={drawerOpen}
                open={drawerOpen} data-open={drawerOpen}
                anchor='right' disablePortal onClose={toggleDrawer}
                variant='persistent' 
                // elevation={0} 
                // variant='permanent' elevation={0}
            >
                <Toolbar>
                    <IconButton onClick={toggleDrawer} >
                        <Close />
                    </IconButton>
                </Toolbar>
                <div id="drawer">
                    <MenuItem>Foo</MenuItem>
                    <MenuItem>Bar</MenuItem>
                </div>
            </Drawer>
        </Wrapper>
    )
}


const Wrapper = styled.div`
    display: flex;
    #menu {
        position: absolute;
        z-index: 1000;
        top: ${({ theme }) => theme.mixins.toolbar.minHeight + 16}px;
        background-color: ${({ theme }) => theme.palette.type === 'light' ?
        theme.palette.grey[100] : theme.palette.grey[900]
    };
        right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        /* left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0; */
    }
    #read-pane {
        width: 100%;
        display: grid;
        justify-items: center;
        margin: 0 auto;
        overflow: auto;
        height: 100%;
        transition: width 50ms ease-out 0ms;
        img {
        }
    }
    .MuiDrawer-root {
        .MuiDrawer-paper {
            .MuiToolbar-root {
                display: flex;
                justify-content: flex-end;
            }
            max-width: 340px;
            position: relative;
        }
        
        &.MuiDrawer-docked {
            max-width: 340px;
            width: 0;
            transition: width 50ms ease-out 0ms;
            .MuiDrawer-paper {
                animation: none;
            }
            &[data-open=true] {
                width: 75vw;
                .MuiDrawer-paper {
                    width: 75vw;
                }
            }
        }
    }
`;

export default Read;
