import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { login } from 'Redux/actions';
import styled from 'styled-components';


const LandingPromise = import('Pages/Landing');
const Landing = React.lazy(() => LandingPromise);
const LoginPromise = import('Pages/Login');
const Login = React.lazy(() => LoginPromise);

function App() {
    const dispatch = useDispatch();
    const { firstRender } = useSelector(state => state);
    
    useEffect(() => {
        if(firstRender){
            dispatch(login());
        }
    }, []);

    return (
        <Wrapper className="App">
            <Suspense fallback={<div />} >
                <Switch>
                    <Route path='/' exact component={Landing} />
                    <Route path='/login' component={Login} />
                    <Route path='/user' component={UserRouter} />
                </Switch>
            </Suspense>
        </Wrapper>
    );
}


const UserRouter = props => {
    const {match} = props;

    const {user, firstRender} = useSelector(state => state);
    const loading = useSelector(state => state.pending.length > 0);
    
    if (!user) {
        if (firstRender || loading) {
            return 'Loading...';
        } else {
            return (
                <Redirect to='/login' />
            )
        }
    }
    
    return (
        <Switch >
            <Route path={`${match.url}/`} component={Landing} />
        </Switch>
    );
}



const Wrapper = styled.div`
    background-color: ${({ theme }) => theme.palette.background.default};
    /* >div:first-child { */
    >div.page {
        height: 100%;
        overflow-y: auto;
    }
    .MuiTooltip-tooltip {
        font-size: ${({theme}) => theme.typography.body2.fontSize};
    }
    #spacer {
        ${({ theme }) => theme.mixins.toolbar}
    }
`;


export default App;
