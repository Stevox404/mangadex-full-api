import {
    AppBar, IconButton, List, ListItem, ListItemText, Paper, Tab, Tabs
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { SettingsOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import ChapterListSettings from './ChapterListSettings';
import InfoTab from './InfoTab';
import moment from 'moment';
import { useRouter } from 'Utils/shared/flitlib';
import { useSelector } from 'react-redux'
import { Manga as MfaManga } from 'mangadex-full-api';



/** @param {DataSection.propTypes} props */
function DataSection(props) {
    const [tabIndex, setTabIndex] = useState(1);
    const [chapterSettingsOpen, setChapterSettingsOpen] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [chapterSortOrder, setChapterSortOrder] = useState();

    const { changePage } = useRouter();
    const language = useSelector(state => state.language);

    const [chapterSettings, setChapterSettings] = useState({
        sortOrder: 'chapter-desc',
        group: 'all',
        displayDate: 'updatedAt',
        grouped: false,
    });


    const fetchChapters = async (sortOrder = 'chapter-desc') => {
        if (!props.manga) return;
        setFetching(true);
        /**@type {MfaManga} */
        const manga = props.manga;
        const sort = sortOrder.split('-');
        const chapters = await manga.getFeed({
            order: {
                [sort[0]]: sort[1]
            },
            limit: Infinity,
        }, true);
        setChapters(chapters);
        setChapterSortOrder(sortOrder);
        setFetching(false);
    }

    const handleTabChange = (e, idx) => {
        setTabIndex(idx);
    }

    const showChapterSettings = (e) => {
        setChapterSettingsOpen(true);
    }

    const handleChapterClick = e => {
        changePage('/read');
    }

    // Put here so no re-render on tab change
    const chapterList = React.useMemo(() => {
        if (chapterSettings.sortOrder !== chapterSortOrder) {
            fetchChapters(chapterSettings.sortOrder);
            return [];
        }

        return chapters.reduce((acc, c, idx) => {
            acc[acc.length] = (
                <ListItem key={c.id} button onClick={handleChapterClick} >
                    <ListItemText
                        primary={`Chapter ${c.chapter}: ${c.title}`}
                        secondary={c.uploaderName}
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
    }, [language, props.manga.id, chapterSettings, chapterSortOrder, chapters]);

    const getTabPanel = () => {
        switch (tabIndex) {
            case 0: return <InfoTab manga={props.manga} />;
            case 1: {
                if (true || fetching) {
                    return (
                        <ChapterTab>
                            <Skeleton variant="rect" height={118} />
                        </ChapterTab>
                    );
                }
                return <ChapterTab> {chapterList} </ChapterTab>;
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
        setChapterSettings(s => ({ ...s, [key]: val }))
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
            />
        </Container>
    )
}


const ChapterTab = styled(List)`
    .MuiListItem-root {
        display: grid;
        grid-template-columns: 1fr auto;
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

