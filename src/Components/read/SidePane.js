import { Button, Divider, IconButton, MenuItem, TextField, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { AspectRatio, CommentOutlined, KeyboardArrowLeftOutlined, KeyboardArrowRightOutlined, Settings } from '@material-ui/icons';
import Close from '@material-ui/icons/Close';
import SideDrawer from 'Components/shared/mui-x/SideDrawer';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Flag from 'react-world-flags';

/**@param {SidePane.propTypes} props */
function SidePane(props) {
    const getChapterNumText = () => {
        if (!props.chapter) return 'Ch';
        let txt = '';
        if (props.chapter.volume) txt += `Vol ${props.chapter.volume} `;
        if (props.chapter.chapter) txt += `Ch ${props.chapter.chapter}`;
        return txt;
    }

    const changeChapter = e => {
        if (!props.chapter) return;
        let dir = e.target.getAttribute('data-btn-side') === 'left' ? -1 : 1;
        // if (props.readerSettings.readingDir === 'left') dir *= -1;

        if (dir > 1) {
            props.onNextChapterClick();
        } else props.onPrevChapterClick();
    }

    return (
        <Container
            open={props.open} anchor='right' onClose={props.onClose}
            variant='permanent' maxWidth={'300px'}
        >
            <div id="drawer">
                <div id="title">
                    <Flag code={'jp'} height={16} />
                    <Typography id='title' color='secondary' variant='h6' >
                        {props.chapter?.manga.title}
                    </Typography>
                </div>
                <Divider />
                {props.chapter?.title &&
                    <Typography id='chapter-title' >
                        {props.chapter.title}
                    </Typography>
                }
                <div id='chapter' >
                    <IconButton data-btn-side='left' onClick={changeChapter} >
                        <KeyboardArrowLeftOutlined />
                    </IconButton>
                    <TextField size='small' readOnly value={getChapterNumText()} />
                    <IconButton data-btn-side='right' onClick={changeChapter} >
                        <KeyboardArrowRightOutlined />
                    </IconButton>
                </div>
                <Divider />
                <div id='scanlator' >
                    <Flag code={'us'} height={16} />
                    <Typography variant='subtitle1' >
                        {props.chapter?.groups[0].name}
                    </Typography>
                </div>
                <Divider />
                <div id="actions">
                    <Button variant='outlined' onClick={props.onShowSettings} >
                        <Settings />
                        Settings
                    </Button>
                    <div>
                        <Tooltip title='Zen Mode' >
                            <Button variant='outlined' >
                                <AspectRatio />
                            </Button>
                        </Tooltip>
                        <Tooltip title='Comments' >
                            <Button variant='outlined' >
                                <CommentOutlined />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <Divider />
            </div>
        </Container>
    )
}

const Container = styled(SideDrawer)`
    #drawer {
        height: 100%;
        overflow-y: auto;
        margin-bottom: 4rem;

        > * {
            padding-left: .8rem;
            padding-right: .8rem;
        }
        #title {
            display: grid;
            width: 100%;
            grid-template-columns: auto auto;
            justify-content: center;
            align-items: center;
            column-gap: .4rem;
            .MuiTypography-root {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        #chapter-title {
            text-align: center;
        }
        .MuiDivider-root {
            margin: .6rem 0;
        }
        #chapter {
            display: flex;
            align-items: center;
            .MuiTextField-root {
                flex: 1;
                pointer-events: none;
            }
        }
        #scanlator {
            display: flex;
            align-items: center;
            .MuiTypography-root {
                font-weight: bold;
                margin-left: .4rem;
            }
        }
        #actions {
            display: flex;
            flex-direction: column;
            gap: .4rem;
            > div {
                display: flex;
                gap: .4rem;
                > * {
                    flex: 1;
                }
            }
        }

    }
`;

SidePane.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onShowSettings: PropTypes.func.isRequired,
    chapter: PropTypes.object,
    readerSettings: PropTypes.object,
    onNextChapterClick: PropTypes.func.isRequired,
    onPrevChapterClick: PropTypes.func.isRequired,
}

export default SidePane;

