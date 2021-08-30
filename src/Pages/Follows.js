import { 
    AppBar, Button, ButtonGroup, Toolbar, Menu, MenuItem, ListItemIcon
} from '@material-ui/core';
import { 
    KeyboardArrowDownOutlined, DeleteOutlined, ChromeReaderModeOutlined,
    BookmarkOutlined, HourglassFullOutlined, LibraryAddCheckOutlined
} from '@material-ui/icons';
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
    const [listAnchorEl, setListAnchorEl] = useState(null);
    const [selectedTab, setSelectedTab] = useState('feed');
    const [selectedList, setSelectedList] = useState(null);

    const user = useSelector(state => state.user);
    const loading = useSelector(state => state.pending.length > 0);

    const dispatch = useDispatch();

    const fetchFollows = async () => {
        try {
            const feed = await MfaManga.getFollowedFeed({
                updatedAtSince: moment().subtract(3, 'months').format('YYYY-MM-DDThh:mm:ss'),
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

    const selectList = e => {
        setSelectedList(e.currentTarget.textContent);
        setSelectedTab('lists');
        setListAnchorEl(null);
    }

    const getButtonProps = btn => {
        if(btn === selectedTab){
            return ({
                color: 'primary',
                variant: 'contained',
                className: 'selected',
            });
        }
        return {};
    }

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
                            <Button
                                onClick={_ => setSelectedTab('feed')}
                                {...getButtonProps('feed')} 
                            >
                                Latest Updates
                            </Button>
                            <Button 
                                {...getButtonProps('lists')} 
                                endIcon={<KeyboardArrowDownOutlined/>}
                                onClick={e => setListAnchorEl(e.currentTarget)} 
                            >
                                {(selectedTab === 'lists') ? selectedList: 'Lists'}
                            </Button>
                            <Button 
                                {...getButtonProps('customLists')} 
                                onClick={_ => setSelectedTab('customLists')}
                                disabled endIcon={<KeyboardArrowDownOutlined/>} 
                            >
                                Custom Lists
                            </Button>
                        </ButtonGroup>
                    </Toolbar>
                </AppBar>
                <div id="container">
                    
                </div>
                <Menu
                    anchorEl={listAnchorEl} open={!!listAnchorEl}
                    onClose={e => setListAnchorEl(null)} value='Reading'
                    getContentAnchorEl={null} anchorOrigin={{
                        vertical: 'bottom', horizontal: 'left'
                    }}
                >
                    {[{
                        label: 'Reading', icon: <ChromeReaderModeOutlined/>
                    }, {
                        label: 'Plan to Read', icon: <BookmarkOutlined/>
                    }, {
                        label: 'On Hold', icon: <HourglassFullOutlined/>
                    }, {
                        label: 'Completed', icon: <LibraryAddCheckOutlined/>
                    }, {
                        label: 'Dropped', icon: <DeleteOutlined/>
                    }].map(el => (
                        <MenuItem 
                            value={el.label} selected={selectedList === el.label} 
                            onClick={selectList}
                        >
                            <ListItemIcon>
                                {el.icon}
                            </ListItemIcon>
                            {el.label}
                        </MenuItem>
                    ))}
                </Menu>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
`;

export default Follows;
