import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    TextField, useMediaQuery, InputAdornment, IconButton, Button,
    Menu as MuiMenu, MenuItem, alpha, Avatar
} from '@material-ui/core';
import { Search, Menu as MenuIcon } from '@material-ui/icons';
import styled from 'styled-components';
import { useRouter } from 'flitlib';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Manga } from 'mangadex-full-api';

function AppBarContent(props) {
    const [initVal] = useState(new URLSearchParams(window.location.search).get('query'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

    const { changePage } = useRouter();
    const isXs = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const user = useSelector(state => state.user);

    const searchRef = useRef(null);
    // const {location} = useHistory();
    // useEffect(() => {
    //     const sp = new URLSearchParams(window.location.search);
    //     const q = sp.get('query');
    //     if (q) searchRef.current.value = q;
    // }, []);

    /**
     * @param {KeyboardEvent} e 
     */
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            changePage(`/search?query=${e.target.value}`);
        }
    }

    return (
        <>
            {isXs ?
                <XsContainer>
                    <IconButton color='inherit' onClick={e => setAnchorEl(e.target)} >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        open={!!anchorEl} onClose={() => setAnchorEl(null)}
                        anchorEl={anchorEl}
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
                        size='small' ref={searchRef} fullWidth onKeyUp={handleSearch}
                        defaultValue={initVal}
                        inputProps={{
                            type: 'search',
                            autoComplete: 'search',
                        }}
                        InputProps={{
                            startAdornment: (<InputAdornment position='start' >
                                <Search />
                            </InputAdornment>)
                        }}
                    />

                    <div className="action">
                        {Boolean(user) ?
                            <>
                                <Avatar onClick={e => setUserMenuAnchorEl(e.target)} >
                                    B
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

