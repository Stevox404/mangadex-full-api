import { AppBar, Button, ButtonGroup, Toolbar } from '@material-ui/core';
import { KeyboardArrowDownOutlined } from '@material-ui/icons';
import { SystemAppBar } from 'Components';
import { Manga as MfaManga } from 'mangadex-full-api';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { addNotification } from 'Redux/actions';
import styled from 'styled-components';


function Follows() {
    const [fetching, setFetching] = useState(true);
    const language = useSelector(state => state.language);
    const [feed, setFeed] = useState([]);

    const user = useSelector(state => state.user);
    const loading = useSelector(state => state.pending.length > 0);

    const dispatch = useDispatch();

    const fetchFollows = async () => {
        try {
            const feed = await MfaManga.getFollowedFeed({
                updatedAtSince: moment().subtract(3, 'months'),
                limit: 100,
                translatedLanguage: [language],
                order: {
                    updatedAt: 'desc'
                },
            }, true);
            setFeed(feed);

        } catch (err) {
            if (/TypeError/.test(err.message)) {
                dispatch(addNotification({
                    message: "Check your network connection",
                    group: 'network',
                    persist: true,
                }));
            }
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        fetchFollows();
    }, [])

    useEffect(() => {
        document.title = `Follows - Dexumi`;
    }, []);



    if (!user && !loading) {
        // TODO if loading return loader
        return <Redirect to='/login' />
    }

    return (
        <>
            <SystemAppBar />
            <Wrapper className='page' >
                <AppBar position="sticky" color="default" >
                    <Toolbar>
                        <ButtonGroup >
                            <Button color='primary' variant='contained' >
                                {/* TODO disable hover effects */}
                                Latest Updates
                            </Button>
                            <Button endIcon={<KeyboardArrowDownOutlined/>} >
                                Lists
                            </Button>
                        </ButtonGroup>
                    </Toolbar>
                </AppBar>
                <div id="container">
                    
                </div>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
`;

export default Follows;
