import {
    AppBar as MuiAppBar, Toolbar, Typography, useScrollTrigger
} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import AppBarContent from './AppBarContent';
import logo from 'Assets/images/placeholder.jpg';
import { useRouter } from 'Utils/shared/flitlib';
import PropTypes from 'prop-types';

/**@param {SystemAppBar.propTypes} props */
function SystemAppBar(props) {
    // TODO find when scroll
    // const scrolled = useScrollTrigger({
    //     threshold: 10,
    //     target: document.getElementsByClassName('page')[0],
    //     disableHysteresis: true
    // });
    
    const {changePage} = useRouter();
    const goHome = () => {
        changePage('/');
    }
    
    const getContent = () => {
        if(props.content === 'none') return null;
        return <AppBarContent />;
    }
    
    
    return (
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

SystemAppBar.propTypes = {
    content: PropTypes.string,
    /**@type {import('@material-ui/core').AppBarProps} */
    appBarProps:PropTypes.object,
}

export default SystemAppBar;

