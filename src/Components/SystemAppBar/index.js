import {
    alpha,
    AppBar as MuiAppBar, Button, Collapse, Icon, InputAdornment, TextField, Toolbar, Typography, useScrollTrigger
} from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import AppBarContent from './AppBarContent';
import logo from 'Assets/images/placeholder.jpg';
import { useRouter } from 'flitlib';
import PropTypes from 'prop-types';
import { SearchOutlined, TuneOutlined } from '@material-ui/icons';
import SearchFilter from './SearchFilter';

/**@param {SystemAppBar.propTypes} props */
function SystemAppBar(props) {
    const [searchValue, setSearchValue] = useState(new URLSearchParams(window.location.search).get('query'));
    const [showSearch, setShowSearch] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const { changePage } = useRouter();
    const goHome = () => {
        changePage('/');
    }

    /**
     * @param {Event} e 
     */
    const handleSearch = (e) => {
        if (e.key && e.key !== 'Enter') return;
        changePage(`/search?query=${searchValue}`);
    }

    const getContent = () => {
        if (props.content === 'none') return null;
        return <AppBarContent
            handleSearch={handleSearch}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            requestOpenFilter={_ => setFilterOpen(true)}
        />;
    }


    return (
        <>
            <AppBar position='sticky' elevation={0} color={'default'} {...props.appBarProps} >
                <Toolbar>
                    <div id="logo" onClick={goHome} >
                        <img src={logo} />
                        <Typography className='logo' component='span' >
                            Dexumi
                        </Typography>
                    </div>
                    {getContent()}
                </Toolbar>
            </AppBar>
            <StyledCollapse in={showSearch} >
                <AppBar position='sticky' id='search-bar' >
                    <TextField
                        size='small'
                        fullWidth
                        onKeyUp={handleSearch}
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        inputProps={{
                            type: 'search',
                            autoComplete: 'search',
                        }}
                        InputProps={{
                            startAdornment: (<InputAdornment position='start' >
                                <Button
                                    size='large' variant='outlined'
                                    endIcon={<Icon><TuneOutlined /></Icon>}
                                    onClick={_ => setFilterOpen(true)}
                                />
                            </InputAdornment>),
                            endAdornment: (<InputAdornment position='end' >

                                <Button
                                    size='large' variant='outlined'
                                    endIcon={<Icon><SearchOutlined /></Icon>}
                                />
                            </InputAdornment>)
                        }}
                    />
                </AppBar>
            </StyledCollapse>
            <SearchFilter
                open={filterOpen} onClose={_ => setFilterOpen(false)}
            />
        </>
    )
}



const AppBar = styled(MuiAppBar)`
    #logo {
        cursor: pointer;
        display: flex;
        align-items: center;
        color: ${({ theme }) => theme.palette.text.primary};
        >.MuiTypography-root {
            font-size: 2rem;
            font-weight: 700;
            letter-spacing: -.01rem;
            ${({ theme }) => theme.breakpoints.down('xs')} {
                font-size: 1.6rem;
            }
        }
        img {
            height: 36px;
            width: 36px;
            margin-right: 16px;
        }
    }
    #action {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(3, 1fr);
        .MuiButton-text:hover {
            text-decoration: underline;
        }
    }
    && {
        transition: background-color 600ms;
    }
`;

const StyledCollapse = styled(Collapse)`
    #search-bar {
        padding: .1rem .4rem;
        background-color: ${({ theme }) => theme.palette.background.paper};
        display: grid;
        >.MuiTextField-root {
            justify-self: center;
            min-width: 90%;
            .MuiInputBase-root{
                background-color: ${({ theme }) => alpha(theme.palette.background.paper, .3)};
                padding-right: 0;
                padding-left: 0;
                height: 2.8rem;
                .MuiInputAdornment-root {
                    height: 100%;
                    max-height: unset;
                    .MuiButton-root {
                        height: 100%;
                        line-height: unset;
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                    }
                    .MuiButton-endIcon {
                        margin: 0;
                    }
                }
            }
        }
    }

`;

SystemAppBar.propTypes = {
    content: PropTypes.string,
    /**@type {import('@material-ui/core').AppBarProps} */
    appBarProps: PropTypes.object,
}

export default SystemAppBar;

