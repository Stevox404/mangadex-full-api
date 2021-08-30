import {
    AppBar, IconButton, List, Paper, Tab, Tabs
} from '@material-ui/core';
import { SettingsOutlined } from '@material-ui/icons';
import { useRouter } from 'flitlib';
import { Manga as MfaManga } from 'mangadex-full-api';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from 'Redux/actions';
import styled from 'styled-components';
import ChapterListSettings from './ChapterListSettings';
import InfoTab from './InfoTab';
import ChaptersTab from './ChaptersTab';


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
            if (chapterSettings.paginated) {
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
        fetchChapters();
    }, [props.manga]);

    useEffect(() => {
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

    const setLoadedGroups = g => {
        // TODO is there a better way to get groups besides going through all chapters??
        // Currently loads all chapters in first render
        // Won't work if first render is paginated
        if (groups && Object.keys(groups).length) return;
        setGroups(g);
    }

    const MemoizedChaptersTab = React.useMemo(_ => {
        return (
            <ChaptersTab
                fetching={fetching}
                manga={props.manga}
                chapters={chapters}
                totalChapterCount={100}
                page={chapterPage}
                chapterSettings={chapterSettings}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onLoadGroups={setLoadedGroups}
                handleChapterClick={handleChapterClick}
            />
        );
    }, [fetching, chapters, chapterPage, chapterSettings, rowsPerPage]);

    const getTabPanel = () => {
        switch (tabIndex) {
            case 0: return <InfoTab manga={props.manga} />;
            case 1:
                return MemoizedChaptersTab
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
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
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
                paginated={chapterSettings.paginated}
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

