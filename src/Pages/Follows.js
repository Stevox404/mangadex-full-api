import {
    AppBar, Button, ButtonGroup, Toolbar, Menu, MenuItem, ListItemIcon,
    Typography, Divider, ListItem
} from '@material-ui/core';
import {
    KeyboardArrowDownOutlined, DeleteOutlined, ChromeReaderModeOutlined,
    BookmarkOutlined, HourglassFullOutlined, LibraryAddCheckOutlined
} from '@material-ui/icons';
import { SystemAppBar } from 'Components';
import { FollowsList } from 'Features/follows';
import { Manga as MfaManga } from 'mangadex-full-api';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { addNotification } from 'Redux/actions';
import styled from 'styled-components';
import Dexie from 'dexie';
import { DexCache } from 'Utils/StorageManager';
import { standardize } from 'Utils/Standardize';

const cache = new DexCache();
cache.name = 'follows';

function Follows() {
    const [fetching, setFetching] = useState(true);
    const language = useSelector(state => state.language);
    /**@type {[import "mangadex-full-api".Chapter[]]} */
    const [feed, setFeed] = useState([]);
    const [listAnchorEl, setListAnchorEl] = useState(null);
    const [selectedTab, setSelectedTab] = useState('feed');
    const [selectedList, setSelectedList] = useState(null);


    const user = useSelector(state => state.user);
    const loading = useSelector(state => state.pending.length > 0);

    const dispatch = useDispatch();

    const fetchFollows = async () => {
        setFetching(true);
        try {
            let follows = await cache.fetch();
            if (!follows) {
                const feed = await MfaManga.getFollowedFeed({
                    updatedAtSince: moment().subtract(2, 'months').format('YYYY-MM-DDThh:mm:ss'),
                    translatedLanguage: [language],
                    order: {
                        updatedAt: 'desc'
                    },
                });
                const resolvedFeed = await Promise.all(feed.map(f => resolveChapter(f)));

                follows = resolvedFeed.map(standardize);

                // Add show more button. Fetch in groups of 10?
                cache.data = follows;
                cache.save();
            }
            setFeed(follows);
        } catch (err) {
            if (/TypeError/.test(err.message)) {
                dispatch(addNotification({
                    message: "Check your network connection",
                    group: 'network',
                    persist: true,
                }));
            } else {
                throw err;
            }
        } finally {
            setFetching(false);
        }
    }

    /**@param {import('mangadex-full-api').Chapter} chapter */
    const resolveChapter = chapter => {
        return new Promise(async (resolve) => {
            const [mangaPr, groupPr, uploaderPr] = await Promise.allSettled([
                chapter.manga.resolve(),
                chapter.groups[0]?.resolve(),
                chapter.uploader.resolve()
            ]);

            if (mangaPr.status === 'fulfilled') {
                let manga = mangaPr.value;
                manga.mainCover = await manga.mainCover.resolve();
                chapter.manga = manga;
            }

            chapter.groups = [];
            if (groupPr.status === 'fulfilled') {
                chapter.groups = [groupPr.value];
            }

            if (uploaderPr.status === 'fulfilled') {
                chapter.uploader = uploaderPr.value;
            }

            resolve(chapter);
        })
    }

    useEffect(() => {
        fetchFollows();
    }, [])

    useEffect(() => {
        document.title = `Follows - Dexumi`;
    }, []);


    const lists = [{
        label: 'Reading', icon: <ChromeReaderModeOutlined />
    }, {
        label: 'Plan to Read', icon: <BookmarkOutlined />
    }, {
        label: 'On Hold', icon: <HourglassFullOutlined />
    }, {
        label: 'Completed', icon: <LibraryAddCheckOutlined />
    }, {
        label: 'Dropped', icon: <DeleteOutlined />
    }];

    const selectList = e => {
        setSelectedList(e.currentTarget.textContent);
        setSelectedTab('lists');
        setListAnchorEl(null);
    }

    const getButtonProps = btn => {
        if (btn === selectedTab) {
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
            <Wrapper className='page clear-appBar' >
                <AppBar position="sticky" color="default" >
                    <Toolbar>
                        <ButtonGroup >
                            <Button
                                onClick={_ => {
                                    setSelectedTab('feed');
                                    setSelectedList(null);
                                }}
                                {...getButtonProps('feed')}
                            >
                                Latest Updates
                            </Button>
                            <Button
                                {...getButtonProps('lists')}
                                endIcon={<KeyboardArrowDownOutlined />}
                                onClick={e => setListAnchorEl(e.currentTarget)}
                            >
                                {(selectedTab === 'lists') ? selectedList : 'Lists'}
                            </Button>
                            <Button
                                {...getButtonProps('customLists')}
                                onClick={_ => {
                                    setSelectedTab('customLists');
                                    setSelectedList(null);
                                }}
                                disabled endIcon={<KeyboardArrowDownOutlined />}
                            >
                                Custom Lists
                            </Button>
                        </ButtonGroup>
                    </Toolbar>
                </AppBar>
                <div id="container" className='clear-appBar' >
                    <FollowsList
                        feed={feed} fetching={fetching}
                    />
                    <Button variant='outlined' size='large' >
                        Fetch More
                    </Button>
                </div>
                <Menu
                    anchorEl={listAnchorEl} open={!!listAnchorEl}
                    onClose={e => setListAnchorEl(null)} value='Reading'
                    getContentAnchorEl={null} anchorOrigin={{
                        vertical: 'bottom', horizontal: 'left'
                    }}
                >
                    {lists.map(el => (
                        <MenuItem
                            value={el.label} selected={selectedList === el.label}
                            onClick={selectList} key={el.label}
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
    #container {
        display: grid;
        grid-template-columns: 1fr;

        .MuiButton-root {
            display: none;
            margin: 2rem auto;
            width: 50%;
            min-width: 12rem;
            justify-self: center;
        }
    }
`;

export default Follows;
