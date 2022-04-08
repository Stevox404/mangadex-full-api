import {
    IconButton, List, ListItem, ListItemSecondaryAction, ListItemText,
    TablePagination, ListItemIcon
} from '@material-ui/core';
import {
    CloudDownloadOutlined, VisibilityOutlined, OpenInNewOutlined, VisibilityOffOutlined, CancelOutlined, DeleteForeverOutlined
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

    const changeChapterReadStatus = (e, c) => {
        e.stopPropagation();
        markChapterAsRead(c);
    }

    const downloadChapter = (e, c) => {
        e.stopPropagation();
        const cDl = new ChapterDl(c);
        cDl.addToQueue();
    }

    const getDownloadButton = (c) => {
        var state = c ? ChapterDl.getChapterDownloadState(c.id) : ChapterDl.downloadStates.NOT_DOWNLOADED;
        if (state === ChapterDl.downloadStates.NOT_DOWNLOADED) {
            return (
                <IconButton
                    edge="end" aria-label="actions"
                    onClick={e => downloadChapter(e, c)}
                >
                    <CloudDownloadOutlined />
                </IconButton>
            );
        } else if (state === ChapterDl.downloadStates.DOWNLOADING) {
            return (
                <IconButton
                    edge="end" aria-label="actions"
                >
                    <CancelOutlined />
                </IconButton>
            );
        } else if (state === ChapterDl.downloadStates.DOWNLOADED) {
            return (
                <IconButton
                    edge="end" aria-label="actions"
                >
                    <DeleteForeverOutlined />
                </IconButton>
            );
        } else if (state === ChapterDl.downloadStates.PENDING) {
            return (
                <IconButton
                    edge="end" aria-label="actions"
                >
                    <CancelOutlined />
                </IconButton>
            );
        }
    }

    const chapterList = props.chapters?.reduce((acc, c, idx) => {
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
                {getDownloadButton(c)}
            </ListItem>);
        return acc;
    }, []);


    return (
        <Wrapper>
            {props.fetching ? Array.from(Array(10), (e, idx) => (
                <Skeleton key={idx} variant="rect" height={64} />
            )) :
                <>
                    {chapterList}
                </>
            }
            {props.totalChapterCount &&
                <TablePagination
                    component="div"
                    count={props.totalChapterCount}
                    page={props.page}
                    onPageChange={props.onPageChange}
                    rowsPerPage={props.rowsPerPage}
                    onRowsPerPageChange={props.onRowsPerPageChange}
                    showLastButton={true}
                />
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




ChaptersTab.propTypes = {
    fetching: PropTypes.bool,
    chapters: PropTypes.array,
    readership: PropTypes.object,
    totalChapterCount: PropTypes.number,
    chapterPage: PropTypes.number,
    rowsPerPage: PropTypes.number,
    chapterSettings: PropTypes.object,
    handleChangePage: PropTypes.func,
    handleChangeRowsPerPage: PropTypes.func,
    handleChapterClick: PropTypes.func,
}

export default ChaptersTab;
