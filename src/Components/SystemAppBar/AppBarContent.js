import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    TextField, useMediaQuery, InputAdornment, IconButton, Button,
    Menu as MuiMenu, MenuItem, alpha, Avatar, Icon
} from '@material-ui/core';
import { Search, Menu as MenuIcon, TuneOutlined } from '@material-ui/icons';
import styled from 'styled-components';
import { useRouter } from 'flitlib';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Manga } from 'mangadex-full-api';
import { ToggleButton } from '@material-ui/lab';

function AppBarContent(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

    const { changePage } = useRouter();
    const isXs = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const user = useSelector(state => state.user);


    return (
        <>
            {isXs ?
                <XsContainer>
                    <ToggleButton
                        selected={props.showSearch}
                        onClick={_ => props.setShowSearch(state => !state)}
                    >
                        <Search color='action' />
                    </ToggleButton>
                    <IconButton color='inherit' onClick={e => setAnchorEl(e.target)} >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        open={!!anchorEl} onClose={() => setAnchorEl(null)}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom', horizontal: 'right'
                        }}
                        getContentAnchorEl={null}
                        onClick={e => {
                            if (!e.target.disabled) {
                                setAnchorEl(null);
                            }
                        }}
                    >
                        <MenuItem onClick={e => changePage('/login')} >
                            Login
                        </MenuItem>
                    </Menu>
                </XsContainer> :
                <Container >
                    <TextField
                        size='small' fullWidth
                        onKeyUp={props.handleSearch}
                        defaultValue={props.initSearchValue}
                        inputProps={{
                            type: 'search',
                            autoComplete: 'search',
                        }}
                        InputProps={{
                            startAdornment: (<InputAdornment position='start' >
                                <Search />
                            </InputAdornment>),
                            endAdornment: (<InputAdornment position='end' >
                                <Button size='large' variant='outlined' endIcon={<TuneOutlined />} >
                                    <span id='text' >
                                        Filter
                                    </span>
                                </Button>
                            </InputAdornment>)
                        }}
                    />

                    <div className="action">
                        {Boolean(user) ?
                            <>
                                <Avatar onClick={e => setUserMenuAnchorEl(e.target)} >
                                    {user.username[0]}
                                </Avatar>
                                <Menu
                                    open={!!userMenuAnchorEl} onClose={() => setUserMenuAnchorEl(null)}
                                    anchorEl={userMenuAnchorEl} anchorOrigin={{
                                        vertical: 'bottom', horizontal: 'right'
                                    }}
                                    getContentAnchorEl={null}
                                    onKeyDown={e => e.code === 'Enter' || e.code === 'Space' &&
                                        !e.target.disabled && setUserMenuAnchorEl(null)
                                    }
                                    onClick={e => !e.target.disabled &&
                                        setUserMenuAnchorEl(null)
                                    }
                                >
                                    <MenuItem component={Link} to='/library/follows' >
                                        Library
                                    </MenuItem>
                                    <MenuItem component={Link} to='/profile' >
                                        Profile
                                    </MenuItem>
                                    <MenuItem>
                                        About
                                    </MenuItem>
                                    <MenuItem>
                                        Log out
                                    </MenuItem>
                                </Menu>
                            </> :
                            <>
                                <Button
                                    size='large' color='primary' variant='text'
                                    onClick={e => changePage('/login')}
                                >
                                    Login
                                </Button>
                            </>
                        }
                    </div>
                </Container>
            }
        </>
    )
}




const XsContainer = styled.div`
    flex: 1;
    display: grid;
    justify-items: flex-end;
    grid-template-columns: 1fr auto auto;
    >.MuiToggleButton-root {
        border: none;
    }
`;

const Container = styled.div`
    margin-left: ${({ theme }) => theme.spacing(2)}px;
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr repeat(2, auto);
    flex: 1;
    >.MuiTextField-root {
        justify-self: center;
        max-width: 600px;
        .MuiInputBase-root{
            background-color: ${({ theme }) => alpha(theme.palette.background.paper, .3)};
            padding-right: 0;
            .MuiInputAdornment-root {
                height: 100%;
                max-height: unset;
                .MuiButton-root {
                    height: 100%;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }
            }
        }
    }
    >div.action {
        margin-left: ${({ theme }) => theme.spacing(2)}px;
        .MuiAvatar-root {
            cursor: pointer;
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

AppBarContent.propTypes = {

}

export default AppBarContent

