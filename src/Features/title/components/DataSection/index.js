import {
    AppBar, IconButton, List, ListItem, ListItemText, Paper, Tab, TablePagination, Tabs
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { SettingsOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChapterListSettings from './ChapterListSettings';
import InfoTab from './InfoTab';
import moment from 'moment';
import { useRouter } from 'flitlib';
import { useDispatch, useSelector } from 'react-redux'
import { Manga as MfaManga } from 'mangadex-full-api';
import { addNotification } from 'Redux/actions';



/** @param {DataSection.propTypes} props */
function DataSection(props) {
    const [tabIndex, setTabIndex] = useState(1);
    const [chapterSettingsOpen, setChapterSettingsOpen] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [groups, setGroups] = useState({});
    const [chapterPage, setChapterPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { changePage } = useRouter();
    const language = useSelector(state => state.language);
    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    const [chapterSettings, setChapterSettings] = useState({
        sortOrder: 'chapter-desc',
        group: 'all',
        displayDate: 'updatedAt',
        grouped: false,
    });


    const fetchChapters = async _ => {
        if (!props.manga) return;
        try {
            setFetching(true);
            /**@type {MfaManga} */
            const manga = props.manga;
            const sort = chapterSettings.sortOrder.split('-');
            const params = {
                order: {
                    [sort[0]]: sort[1]
                },
                limit: Infinity,
                translatedLanguage: [language]
            }
            if(settings.dataSaverMode){
                params.limit = rowsPerPage;
                params.offset = chapterPage * rowsPerPage;
            }

            const chapters = await manga.getFeed(params, true);
            setChapters(chapters);
        } catch (err) {
            dispatch(addNotification({
                message: "Check your network connection and refresh",
                group: 'network',
                persist: true
            }))
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        if(settings.dataSaverMode) return;
        fetchChapters();
    }, [chapterPage, rowsPerPage]);

    useEffect(() => {
        fetchChapters();
    }, [chapterSettings]);

    const handleTabChange = (e, idx) => {
        setTabIndex(idx);
    }

    const showChapterSettings = (e) => {
        setChapterSettingsOpen(true);
    }

    const handleChapterClick = (e, chapter) => {
        changePage(`/chapter/${chapter.id}/1`);
    }

    /**
     * @param {import('react').MouseEvent} e 
     * @param {number} page 
     */
    const handleChangePage = (e, page) => {
        setChapterPage(page);
    }


    /**
     * @param {import('react').ChangeEvent} e 
     */
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(e.target.value);
    }

    // Put here so no re-render on tab change
    const chapterList = React.useMemo(() => {
        const groups = {};

        const list = chapters.reduce((acc, c, idx) => {
            groups[c.groups[0].id] = c.groups[0].name;
            if (chapterSettings.group !== 'all' && chapterSettings.group !== c.groups[0].id) {
                return acc;
            }

            const getChapterText = () => {
                let txt = c.chapter === null ? 'One-Shot' : `Chapter ${c.chapter}`;
                if (c.title) {
                    txt += `: ${c.title}`;
                }
                return txt;
            }
            acc[acc.length] = (
                <ListItem key={c.id} button onClick={e => handleChapterClick(e, c)} >
                    <ListItemText
                        primary={getChapterText()}
                        secondary={c.groups[0].name || c.uploader.username}
                    />
                    <ListItemText
                        primary={moment(c[chapterSettings.displayDate]).fromNow()}
                        primaryTypographyProps={{
                            variant: 'subtitle1',
                        }}
                    />
                </ListItem>);
            return acc;
        }, [])

        setGroups(groups);

        return list;
    }, [language, props.manga, chapterSettings, chapters]);

    const getTabPanel = () => {
        switch (tabIndex) {
            case 0: return <InfoTab manga={props.manga} />;
            case 1: {
                if (fetching) {
                    return (
                        <ChapterTab>
                            {Array.from(Array(10), (e, idx) => (
                                <Skeleton key={idx} variant="rect" height={64} />
                            ))}
                        </ChapterTab>
                    );
                }
                return (
                    <ChapterTab>
                        {chapterList}
                        <TablePagination
                            component="div"
                            count={100}
                            page={chapterPage}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}                          
                        />
                    </ChapterTab>
                );
            }
            default: break;
        }
    }

    const getTabActions = () => {
        switch (tabIndex) {
            case 1: return <>
                <IconButton onClick={showChapterSettings} >
                    <SettingsOutlined />
                </IconButton>
            </>;
            default: break;
        }
    }


    const handleChapterSettingChange = e => {
        const key = e.target.name;
        const val = e.target.value;
        setChapterSettings(s => ({ ...s, [key]: val }));
    }

    if (!props.manga) return null; // todo show loading

    return (
        <Container square>
            <AppBar position="sticky" color="default" >
                <Tabs
                    value={tabIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleTabChange}
                >
                    <Tab label="Info" />
                    <Tab label="Chapters" />
                    <Tab label="Gallery" />
                </Tabs>
                <div id="actions">
                    {getTabActions()}
                </div>
            </AppBar>
            <div className='tab-panel' >
                {getTabPanel()}
            </div>

            <ChapterListSettings
                open={chapterSettingsOpen} onClose={_ => setChapterSettingsOpen(false)}
                sortOrder={chapterSettings.sortOrder}
                group={chapterSettings.group}
                displayDate={chapterSettings.displayDate}
                grouped={chapterSettings.grouped}
                onChange={handleChapterSettingChange}
                groups={groups}
            />
        </Container>
    )
}


const ChapterTab = styled(List)`
    .MuiListItem-root {
        display: grid;
        grid-template-columns: 1fr auto;
        &[data-read="true"] {
            &:not(:hover){
                background-color: ${p => p.theme.palette.background.default};
            }
            .MuiTypography-root {
                color: ${p => p.theme.palette.text.secondary};
            }
        }
    }
    .MuiSkeleton-root {
        margin-bottom: .4rem;
    }
`;

const Container = styled(Paper)`
    .tab-panel {
        min-height: 50vh;
        /* max-height: 100vh;
        overflow-y: auto; */
        margin-bottom: 4.8rem;
    }
    #actions {
        position: absolute;
        top: 0;
        right: 0;
    }
`;



DataSection.propTypes = {
    manga: PropTypes.object,
}

export default DataSection;

