import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    TextField, useMediaQuery, InputAdornment, IconButton, Button,
    Menu as MuiMenu, MenuItem, alpha, Avatar
} from '@material-ui/core';
import { Search, Menu as MenuIcon } from '@material-ui/icons';
import styled from 'styled-components';
import { useRouter } from 'flitlib';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
                        type='search' autoComplete='search' size='small' fullWidth
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
                                    <MenuItem component={Link} to='/follows' >
                                        Follows
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

