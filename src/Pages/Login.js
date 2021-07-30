import React, { useState } from 'react';
import styled from 'styled-components';
import {
    AppBar, Button, Checkbox, FormControlLabel, TextField, Toolbar, Typography, useScrollTrigger
} from '@material-ui/core';
import logo from 'Assets/images/placeholder.jpg';
import { useRouter } from 'flitlib';
import SystemAppBar from 'Components/SystemAppBar.js';
import GenericDialog from 'Components/shared/mui-x/GenericDialog';
import { useValidator } from 'flitlib';
import { login } from 'Redux/actions';
import { useDispatch } from 'react-redux';

function Login() {
    const [showForgotDialog, setShowForgotDialog] = useState(false);
    const { values, setValue } = useValidator();

    const dispatch = useDispatch();

    const { changePage } = useRouter();
    const goHome = () => {
        changePage('/');
    }
    

    const handleForgot = e => {
        setShowForgotDialog(true);
    }

    const handleLogin = async e => {
        e.preventDefault();
        await dispatch(login(values));
        setValue({ password: '' });
        goHome();
    }

    return (
        <>
            <SystemAppBar content='none' appBarProps={{ color: 'transparent', position: 'absolute' }} />
            <Wrapper className='page fill-screen' >
                <form id="content" onSubmit={handleLogin} >
                    <Typography variant='h4' component='h1' >LOGIN</Typography>
                    <TextField
                        label='Username' name='username' autoComplete='username'
                        autoFocus fullWidth value={values.username} onChange={setValue}
                    />
                    <TextField
                        label='Password' name='password' type='password'
                        fullWidth value={values.password} onChange={setValue}
                    />
                    <div id='extras' >
                        <FormControlLabel
                            name='remenber'
                            control={<Checkbox color="primary" />}
                            label="Remember me"
                            labelPlacement="start"
                            disabled
                        />
                        <Button variant='text' color='secondary' onClick={handleForgot} >
                            Forgot Password
                        </Button>
                    </div>
                    <Button
                        variant='contained' color='primary' type='submit'
                        size='large'
                    >
                        Login
                    </Button>
                </form>
                <Dialog
                    title='Forgot Passord?' open={showForgotDialog}
                    onClose={_ => setShowForgotDialog(false)}
                    showCloseButton hideDialogActions
                >
                    <Typography>
                        Just relax and try to remember your password
                    </Typography>
                </Dialog>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    display: grid;
    justify-content: center;
    padding-top: calc(100vh - 30rem);
    #content {
        max-width: 640px;
        width: 100vw;
        padding: 3rm;
        display: grid;
        row-gap: 1rem;
        align-content: flex-start;
        justify-items: flex-start;
        div#extras {
            width: 100%;
            display: grid;
            grid-template-columns: auto auto;
            align-items: center;
            justify-content: space-between;
            >.MuiFormControlLabel-root{
                margin: 0;
            }
        }

        >button {
            justify-self: flex-end;
        }

    }
    ${p => p.theme.breakpoints.down('xs')} {
        padding-top: 5.6rem;
        #content {
            width: 90vw;
            padding: 0;
            div#extras {
                grid-template-columns: auto;
                justify-items: flex-start;
            }
        }
    }
`;


/** @type {GenericDialog} */
const Dialog = styled(GenericDialog)`
    .MuiDialogTitle-root {
        padding: .8rem;
    }
    .MuiDialogContent-root {
        padding: 1.6rem;
        text-align: center;
    }
`;


export default Login;
