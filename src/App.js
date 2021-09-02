import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { login } from 'Redux/actions';
import styled, { css } from 'styled-components';


const Landing = React.lazy(() => import('Pages/Landing'));
const Title = React.lazy(() => import('Pages/Title'));
const Login = React.lazy(() => import('Pages/Login'));
const Chapter = React.lazy(() => import('Pages/Chapter'));
const Follows = React.lazy(() => import('Pages/Follows'));
const Settings = React.lazy(() => import('Pages/Settings'));

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(login());
    }, []);

    return (
        <Wrapper className="App">
            <Suspense fallback={<div />} >
                {/* <SystemAppBar /> */}
                <Switch>
                    <Route path='/' exact component={Landing} />
                    <Route path='/title/:id' component={Title} />
                    <Route path='/chapter/:id/:page' component={Chapter} />
                    <Route path='/follows' component={Follows} />
                    <Route path='/login' component={Login} />
                    <Route path='/(profile|downloads|settings)' component={Settings} />
                </Switch>
            </Suspense>
        </Wrapper>
    );
}


const Wrapper = styled.div`
    background-color: ${({ theme }) => theme.palette.background.default};
    height: 100%;
    
    >div.page {
        height: 100vh;
        overflow-y: auto;
        /* position: relative; */
        &.clear-appBar {
            height: calc(100vh - 56px);
            ${p => p.theme.breakpoints.up('xs') + '  and (orientation: landscape)'} {
                height: calc(100vh - 48px);
            }
            ${p => p.theme.breakpoints.up('sm')} {
                height: calc(100vh - 64px);
            }
        }
    }
    .fill-screen {
        min-height: 100vh;
        /* &.clear-appBar {
            min-height: calc(100vh - 56px);
            @media (min-width: 0px) and (orientation: landscape) {
                min-height: calc(100vh - 48px);
            }
            @media (min-width: 600px) {
                min-height: calc(100vh - 64px);
            }
        } */
    }

    .clear-appBar {
        min-height: calc(100% - 56px);
        @media (min-width: 0px) and (orientation: landscape) {
            min-height: calc(100% - 48px);
        }
        @media (min-width: 600px) {
            min-height: calc(100% - 64px);
        }
    }

    .MuiTooltip-tooltip {
        font-size: ${p => p.theme.typography.body2.fontSize};
    }
    
    #toolbar-spacer {
        ${({ theme }) => theme.mixins.toolbar}
    }
    a {
        text-decoration: none;
        font-size: .9em;
    }
    ${({ theme }) => theme.palette.type === 'dark' && css`
        a {
            color: ${({ theme }) => theme.palette.info.light};
        }
        img {
            filter: brightness(.8) contrast(1.2);
        }
    `}
`;


export default App;
