import React from 'react';
import styled from 'styled-components';
import {
    AppBar, Button, Checkbox, FormControlLabel, TextField, Toolbar, Typography, useScrollTrigger
} from '@material-ui/core';
import logo from 'Assets/images/placeholder.jpg';
import { useRouter } from 'flitlib';
import SystemAppBar from 'Components/SystemAppBar.js';

function Login() {

    const { changePage } = useRouter();
    const goHome = () => {
        changePage('/');
    }

    return (
        <>
            <SystemAppBar content='none' appBarProps={{color: 'transparent'}} />
            <Wrapper className='page fill-screen' >
                <form id="content">
                    <Typography variant='h4' component='h1' >LOGIN</Typography>
                    <TextField
                        label='Email' name='email' autoComplete='email'
                        autoFocus fullWidth
                    />
                    <TextField
                        label='Password' name='password' type='password'
                        fullWidth
                    />
                    <FormControlLabel
                        name='remenber'
                        control={<Checkbox color="primary" />}
                        label="Remember me"
                        labelPlacement="start"
                        disabled
                    />
                    <Button variant='contained' color='primary' type='submit' size='large' >
                        Login
                    </Button>
                </form>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    display: grid;
    justify-content: center;
    padding-top: 5.6rem;
    #content {
        max-width: 640px;
        width: 100vw;
        padding: 3rm;
        display: grid;
        row-gap: 1rem;
        align-content: flex-start;
        justify-items: flex-start;
        button {
            justify-self: flex-end;
        }
    }
`;

export default Login;
