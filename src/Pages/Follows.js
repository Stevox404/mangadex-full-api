import {
    AppBar, Button, ButtonGroup, Toolbar, Menu, MenuItem, ListItemIcon,
    Typography, Divider, ListItem
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
    /**@type {[import "mangadex-full-api".Chapter[]]} */
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
                limit: 10,
                translatedLanguage: [language],
                order: {
                    updatedAt: 'desc'
                },
            });
            const resolvedFeed = await Promise.all(feed.map(f => resolveChapter(f)));
            // Add show more button. Fetch in groups of 10?
            setFeed(f => f.concat(resolvedFeed));
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

    const getUpdatesList = () => {
        let currentTitleId;
        let currentTitleCoverEl;
        let titleChapters = [];
        const list = feed.reduce((acc, title) => {
            if (currentTitleId !== title.manga.id) {
                if (currentTitleId) {
                    acc.push(
                        <>
                            <div className='titleUpdate' key={currentTitleId + title.chapter} >
                                {currentTitleCoverEl}
                                <div className="chapters">
                                    {titleChapters}
                                </div>
                            </div>
                            <Divider key={currentTitleId + title.chapter + 'divider'} />
                        </>
                    );
                }

                currentTitleId = title.manga.id;
                currentTitleCoverEl = (
                    <div className="cover">
                        <img src={title.manga.mainCover.image256} alt={title.manga.title + ' cover'} />
                        <Typography variant='body2'>
                            {title.manga.title}
                        </Typography>
                    </div>
                );
                titleChapters = [<ListItem button className='chapter' key={title.chapter}>
                    <Typography variant='body2' >
                        {title.volume ? `Vol. ${title.volume} ` : ''}
                        {title.chapter ? `Ch. ${title.chapter} ` : ''}
                        {title.title ? ` - ${title.title}` : ''}
                    </Typography>
                    <Typography variant='body2' >
                        {title.groups[0]?.name || ''}
                    </Typography>
                    <Typography variant='body2' >
                        {title.uploader.name || ''}
                    </Typography>
                    <Typography variant='body2' >
                        {moment(title.updatedAt).fromNow() || ''}
                    </Typography>
                </ListItem>];
            } else {
                titleChapters.push(<ListItem button className='chapter' key={title.chapter}>
                    <Typography variant='body2' >
                        {title.volume ? `Vol. ${title.volume} ` : ''}
                        {title.chapter ? `Ch. ${title.chapter} ` : ''}
                        {title.title ? ` - ${title.title}` : ''}
                    </Typography>
                    <Typography variant='body2' >
                        {title.groups[0]?.name || ''}
                    </Typography>
                    <Typography variant='body2' >
                        {title.uploader.name || ''}
                    </Typography>
                    <Typography variant='body2' >
                        {moment(title.updatedAt).fromNow() || ''}
                    </Typography>
                </ListItem>);
            }

            return acc;
        }, []);

        list.push(
            <div className='titleUpdate' key={currentTitleId} >
                {currentTitleCoverEl}
                <div className="chapters">
                    {titleChapters}
                </div>
            </div>
        );

        return list;
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
                                onClick={_ => setSelectedTab('feed')}
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
                                onClick={_ => setSelectedTab('customLists')}
                                disabled endIcon={<KeyboardArrowDownOutlined />}
                            >
                                Custom Lists
                            </Button>
                        </ButtonGroup>
                    </Toolbar>
                </AppBar>
                <div id="container" className='clear-appBar' >
                    {getUpdatesList()}
                </div>
                <Menu
                    anchorEl={listAnchorEl} open={!!listAnchorEl}
                    onClose={e => setListAnchorEl(null)} value='Reading'
                    getContentAnchorEl={null} anchorOrigin={{
                        vertical: 'bottom', horizontal: 'left'
                    }}
                >
                    {[{
                        label: 'Reading', icon: <ChromeReaderModeOutlined />
                    }, {
                        label: 'Plan to Read', icon: <BookmarkOutlined />
                    }, {
                        label: 'On Hold', icon: <HourglassFullOutlined />
                    }, {
                        label: 'Completed', icon: <LibraryAddCheckOutlined />
                    }, {
                        label: 'Dropped', icon: <DeleteOutlined />
                    }].map(el => (
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
    /* #container {
        min-height: calc(100% - 56px);
        @media (min-width: 0px) and (orientation: landscape) {
            min-height: calc(100% - 48px);
        }
        @media (min-width: 600px) {
            min-height: calc(100% - 64px);
        }
    } */
    .titleUpdate {
        display: grid;
        grid-template-columns: 200px 1fr;
        padding: 0.8rem 0;
        .cover {
            display: grid;
            justify-content: center;
            justify-items: center;
            text-align: center;
            img {
                height: 180px;
                margin-bottom: .8rem;
            }
        }
        .chapters {
            display: grid;
            align-content: flex-start;
            align-items: flex-start;
            .chapter {
                display: grid;
                grid-template-columns: 2fr 1fr .5fr .5fr;
            }
        }
    }
`;

export default Follows;
