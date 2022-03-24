import {
    IconButton, List, ListItem, ListItemSecondaryAction, ListItemText,
    TablePagination, ListItemIcon
} from '@material-ui/core';
import {
    CloudDownloadOutlined, VisibilityOutlined, OpenInNewOutlined, VisibilityOffOutlined
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { markChapterAsRead } from 'Utils/index';
import { ChapterDl } from 'Utils/StorageManager/DexDld';

function ChaptersTab(props) {
    const language = useSelector(state => state.language);
    const [groups, setGroups] = useState({});

    useEffect(() => {
        props.onLoadGroups(groups);    
    }, [groups]);
    

    const changeChapterReadStatus = (e, c) => {
        e.stopPropagation();
        markChapterAsRead(c);
    }

    const downloadChapter = (e, c) => {
        e.stopPropagation();
        const cDl = new ChapterDl(c);
        cDl.addToQueue();
    }

    const chapterList = React.useMemo(() => {
        const _groups = {};

        const list = props.chapters.reduce((acc, c, idx) => {
            const chapterGroups = {};
            for (let group of (c.groups || [])) {
                if (!_groups[group.id]) _groups[group.id] = group;
                chapterGroups[group.id] = group;
            }
            if (props.chapterSettings.group !== 'all' && !chapterGroups[props.chapterSettings.group]) {
                return acc;
            }

            const getChapterText = () => {
                let txt = c.chapter === null ? 'One-Shot' : `Chapter ${c.chapter}`;
                if (c.title) {
                    txt += `: ${c.title}`;
                }

                if (c.isExternal) {
                    txt = <>
                        <OpenInNewOutlined />
                        {txt}
                    </>
                }

                return txt;
            }
            acc[acc.length] = (
                <ListItem
                    key={c.id} data-read={props.readership?.[c.id]} button
                    onClick={e => props.handleChapterClick(e, c)}
                >
                    <ListItemIcon className='read-status' onClick={e => changeChapterReadStatus(e, c)} >
                        <IconButton edge="start" aria-label="actions">
                            {props.readership?.[c.id] ?
                                <VisibilityOffOutlined /> :
                                <VisibilityOutlined />
                            }
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText
                        primary={getChapterText()} className='chapter-name'
                        secondary={c.groups[0]?.name || c.uploader.username}
                    />
                    <ListItemText
                        primary={moment(c[props.chapterSettings.displayDate]).fromNow()}
                        primaryTypographyProps={{
                            variant: 'subtitle1',
                        }}
                    />
                    <IconButton
                        edge="end" aria-label="actions"
                        onClick={e => downloadChapter(e, c)}
                    >
                        <CloudDownloadOutlined />
                    </IconButton>
                </ListItem>);
            return acc;
        }, [])

        setGroups(_groups)

        return list;
    }, [language, props.manga, props.chapterSettings, props.chapters]);

    return (
        <Wrapper>
            {props.fetching ? Array.from(Array(10), (e, idx) => (
                <Skeleton key={idx} variant="rect" height={64} />
            )) :
                <>
                    {chapterList}
                    {props.chapterSettings.paginated &&
                        <TablePagination
                            component="div"
                            count={props.totalChapterCount}
                            page={props.chapterPage}
                            onPageChange={props.handleChangePage}
                            rowsPerPage={props.rowsPerPage}
                            onRowsPerPageChange={props.handleChangeRowsPerPage}
                        />
                    }
                </>
            }
        </Wrapper>
    );
}


const Wrapper = styled(List)`
    .MuiListItem-root {
        
        /* display: grid;
        grid-template-columns: 1fr auto; */
        .chapter-name {
            flex: 3;
            .MuiTypography-root {
                display: flex;
                align-items: center;
                svg {
                    font-size: 1.2rem;
                    margin-right: .2rem;    
                }
            }
        }
        
        &[data-read="true"] {
            &:not(:hover){
                background-color: ${p => p.theme.palette.background.default};
            }
            .MuiTypography-root {
                color: ${p => p.theme.palette.text.secondary};
            }
            svg {
                fill: ${p => p.theme.palette.text.disabled};
            } 
        }
    }
    .MuiSkeleton-root {
        margin-bottom: .4rem;
    }
`;




Wrapper.propTypes = {
    fetching: PropTypes.bool,
    chapters: PropTypes.array,
    readership: PropTypes.object,
    totalChapterCount: PropTypes.number,
    chapterPage: PropTypes.number,
    rowsPerPage: PropTypes.number,
    chapterSettings: PropTypes.object,
    handleChangePage: PropTypes.func,
    handleChangeRowsPerPage: PropTypes.func,
    onGroupsChange: PropTypes.func,
    handleChapterClick: PropTypes.func,
}

export default ChaptersTab;
