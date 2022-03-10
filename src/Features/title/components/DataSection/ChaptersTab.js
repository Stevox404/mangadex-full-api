import {
    IconButton, List, ListItem, ListItemSecondaryAction, ListItemText,
    TablePagination, ListItemIcon
} from '@material-ui/core';
import {
    CloudDownloadOutlined, VisibilityOutlined, OpenInNewOutlined
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ChapterDl } from 'Utils/StorageManager/DexDld';

function ChaptersTab(props) {
    const language = useSelector(state => state.language);

    const changeChapterReadStatus = (e, c) => {
        e.stopPropagation();
        // TODO
    }

    const downloadChapter = (e, c) => {
        e.stopPropagation();
        const cDl = new ChapterDl(c);
        cDl.addToQueue();
        console.log(ChapterDl.queue);
        // TODO
    }

    const chapterList = React.useMemo(() => {
        const groups = {};

        const list = props.chapters.reduce((acc, c, idx) => {
            groups[c.groups[0].id] = c.groups[0].name;
            if (props.chapterSettings.group !== 'all' && props.chapterSettings.group !== c.groups[0].id) {
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
                <ListItem key={c.id} button onClick={e => props.handleChapterClick(e, c)} >
                    <ListItemIcon onClick={e => changeChapterReadStatus(e, c)} >
                        <IconButton edge="start" aria-label="actions">
                            <VisibilityOutlined />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText
                        primary={getChapterText()} className='chapter-name'
                        secondary={c.groups[0].name || c.uploader.username}
                    />
                    <ListItemText
                        primary={moment(c[props.chapterSettings.displayDate]).fromNow()}
                        primaryTypographyProps={{
                            variant: 'subtitle1',
                        }}
                    />
                    <ListItemSecondaryAction>
                        <IconButton
                            edge="end" aria-label="actions"
                            onClick={e => downloadChapter(e, c)}
                        >
                            <CloudDownloadOutlined />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>);
            return acc;
        }, [])

        props.onLoadGroups(groups);

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
        }
    }
    .MuiSkeleton-root {
        margin-bottom: .4rem;
    }
`;




Wrapper.propTypes = {
    fetching: PropTypes.bool,
    chapters: PropTypes.array,
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
