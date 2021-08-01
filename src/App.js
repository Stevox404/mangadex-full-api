import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { login } from 'Redux/actions';
import styled, { css } from 'styled-components';






const LandingPromise = import('Pages/Landing');
const Landing = React.lazy(() => LandingPromise);
const TitlePromise = import('Pages/Title');
const Title = React.lazy(() => TitlePromise);
const LoginPromise = import('Pages/Login');
const Login = React.lazy(() => LoginPromise);
const ChapterPromise = import('Pages/Chapter');
const Chapter = React.lazy(() => ChapterPromise);

function App() {
    const dispatch = useDispatch();
    const firstRender = useSelector(state => state.firstRender);

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
                    <Route path='/login' component={Login} />
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
        position: relative;
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
        &.clear-appBar {
            min-height: calc(100vh - 56px);
            @media (min-width: 0px) and (orientation: landscape) {
                min-height: calc(100vh - 48px);
            }
            @media (min-width: 600px) {
                min-height: calc(100vh - 64px);
            }
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
