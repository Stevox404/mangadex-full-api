import {
    AppBar, Button, IconButton, Menu as MuiMenu, MenuItem, Toolbar, 
    Typography, useMediaQuery
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons'
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'Utils/shared/flitlib';
import heroImg from 'Assets/images/hero-img.jpg';

function Landing() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { changePage } = useRouter();

    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {
        document.title = 'Web App';
    }, []);

    return (
        <Wrapper>
            <AppBar position='fixed' elevation={4} >
                <Toolbar>
                    <div id="logo">
                        <Typography className='logo' component='span' >
                            WEB APP
                        </Typography>
                    </div>
                    <div className='appbar-spacer' />
                    {isSmallScreen ?
                        <IconButton color='inherit' onClick={e => setAnchorEl(e.target)} >
                            <MenuIcon />
                        </IconButton> :
                        <div id='action' >
                            <a href='#about' >
                                <Button size='large' color='inherit' variant='text' >
                                    About Us
                                </Button>
                            </a>
                            <a href='#contact-us' >
                                <Button size='large' color='inherit' variant='text' >
                                    Contact
                                </Button>
                            </a>
                            <Button
                                size='large' color='inherit' variant='outlined'
                                onClick={e => changePage('/login')}
                            >
                                Login
                            </Button>
                        </div>
                    }
                </Toolbar>
            </AppBar>
            <div id="spacer" />
            <div id='landing' className='page' >
                <div className="screen content">
                    <Typography variant='h1' >
                        DEVELOPING THE WORLD OF TOMORROW
                    </Typography>
                    <Typography id='info' variant='h6' >
                        Our mission: To design the apps that make
                        the dreams of tomorrow today's reality.
                    </Typography>
                    <div id='action' >
                        <a href='#about' >
                            <Button variant='contained' disableElevation color='secondary' >
                                Learn More
                            </Button>
                        </a>
                        <a href='#contact-us' >
                            <Button color='inherit' variant='outlined' >
                                Contact Us
                            </Button>
                        </a>
                    </div>
                </div>
            </div>

            <Menu
                open={!!anchorEl} onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
                onClick={e => {
                    if (!e.target.disabled) {
                        setAnchorEl(null);
                    }
                }}
            >
                <a href='#about' >
                    <MenuItem>
                        About Us
                    </MenuItem>
                </a>
                <a href='#contact-us' >
                    <MenuItem>
                        Contact
                    </MenuItem>
                </a>
                <MenuItem onClick={e => changePage('/login')} >
                    Login
                </MenuItem>
            </Menu>
        </Wrapper>
    )
}


const Wrapper = styled.div`
    width: 100%;
    background: rgb(33,61,83);
    background: linear-gradient(180deg, rgba(13,71,161,1) 0%, rgba(72,56,103,1) 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    a {
        color: inherit;
        text-decoration: none;
    }  
    .MuiAppBar-root {
        #logo {
            cursor: pointer;
            display: flex;
            align-items: center;
            >.MuiTypography-root {
                font-size: 2rem;
                font-weight: 700;
                letter-spacing: -.01rem;
                @media screen and (max-width: 720px) {
                    font-size: 1.6rem;
                }
            }
            img {
                height: 48px;
                width: 48px;
                margin-right: 16px;
            }
        }
        .appbar-spacer {
            flex: 1;
        }
        #action {
            display: grid;
            gap: 10px;
            grid-template-columns: repeat(3, 1fr);
            .MuiButton-text:hover {
                text-decoration: underline;
            }
        }
    }

    #landing {
        width: 100%;
        flex: 1;
        .content {
            padding: 0 56px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
            @media screen and (max-width: 720px) {
                padding-left: 16px;   
                padding-right: 16px;   
            }

            &.screen {
                min-height: 100vh;
            } 

            &:first-child {
                background: linear-gradient(#0007, #0007), url(${heroImg}) 80% 80% no-repeat;
                background-size: 100% 100%;
                padding-top: 10vh;
                >img {
                    width: 150px;
                    filter: drop-shadow(0 1px);
                    color: black;
                }
                #info {
                    margin-top: 1.5rem;
                    max-width: 750px;
                }
                #action {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 15px;
                    justify-content: center;
                    align-items: center;
                    margin-top: auto;
                    margin-bottom: 9.6rem;
                    .MuiButton-root {
                        border-radius: 24px;
                    }
                }
            }
        }
    }
`;




const Menu = styled(MuiMenu)`
    a {
        color: inherit;
        text-decoration: none;
    }  
    .MuiMenuItem-root {
        min-width: 150px;
    }
`;

export default Landing;