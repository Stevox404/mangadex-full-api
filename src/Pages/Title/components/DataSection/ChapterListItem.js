import { IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { CancelOutlined, CloudDownloadOutlined, DeleteForeverOutlined, OpenInNewOutlined, VisibilityOffOutlined, VisibilityOutlined } from '@material-ui/icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ChapterDl } from 'Utils';
import { markChapterAsRead } from 'Utils/index';

export function ChapterListItem(props) {
    const {
        chapter, ...otherProps
    } = props;

    const [downloadState, setDownloadState] = useState(ChapterDl.downloadStates.NOT_DOWNLOADED);

    useEffect(() => {
        if (!chapter) return;
        const state = ChapterDl.getChapterDownloadState(chapter.id)
        setDownloadState(state);
    }, [chapter]);

    const downloadChapter = (e, c) => {
        setDownloadState(ChapterDl.downloadStates.DOWNLOADING);
        e.stopPropagation();
        const cDl = new ChapterDl(c);
        cDl.addToQueue();

        const onEnd = (event) => {
            const dlChapter = event.detail.chapter;
            if (dlChapter.id !== chapter.id) return;
            setDownloadState(ChapterDl.downloadStates.DOWNLOADED);
            cDl.removeEventListener('end', onEnd);
        }
        cDl.addEventListener('end', onEnd)
    }


    const changeChapterReadStatus = (e, c) => {
        e.stopPropagation();
        markChapterAsRead(c);
    }

    const getChapterText = (c) => {
        if (!c) return '';
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

    const getDownloadButton = (c) => {
        if (downloadState === ChapterDl.downloadStates.DOWNLOADING) {
            return (
                <IconButton
                    edge="end" aria-label="actions"
                >
                    <CancelOutlined />
                </IconButton>
            );
        } else if (downloadState === ChapterDl.downloadStates.DOWNLOADED) {
            return (
                <IconButton
                    edge="end" aria-label="actions"
                >
                    <DeleteForeverOutlined />
                </IconButton>
            );
        } else if (downloadState === ChapterDl.downloadStates.PENDING) {
            return (
                <IconButton
                    edge="end" aria-label="actions"
                >
                    <CancelOutlined />
                </IconButton>
            );
        } else {
            return (
                <IconButton
                    edge="end" aria-label="actions"
                    onClick={e => downloadChapter(e, c)}
                >
                    <CloudDownloadOutlined />
                </IconButton>
            );
        }
    }

    return <StyledLiatItem
        key={chapter.id} data-read={otherProps.readership?.[chapter.id]} button
        onClick={e => otherProps.handleChapterClick(e, chapter)}
    >
        <ListItemIcon className='read-status' onClick={e => changeChapterReadStatus(e, chapter)}>
            <IconButton edge="start" aria-label="actions">
                {otherProps.readership?.[chapter.id] ?
                    <VisibilityOffOutlined /> :
                    <VisibilityOutlined />}
            </IconButton>
        </ListItemIcon>
        <ListItemText
            primary={getChapterText(chapter)} className='chapter-name'
            secondary={chapter.groups[0]?.name || chapter.uploader.username} />
        <ListItemText
            primary={moment(chapter[otherProps.chapterSettings.displayDate]).fromNow()}
            primaryTypographyProps={{
                variant: 'subtitle1'
            }} />
        {getDownloadButton(chapter)}
    </StyledLiatItem>;
}


const StyledLiatItem = styled(ListItem)`
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
`;