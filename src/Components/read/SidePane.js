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
    return (
        <Container
            open={props.open} anchor='right' onClose={props.onClose}
            variant='permanent' maxWidth={'300px'}
        >
            <div id="drawer">
                <div id="title">
                    <Flag code={'jp'} height={16} />
                    <Typography id='title' color='secondary' variant='h6' >
                        Naruto
                    </Typography>
                </div>
                <Divider />
                <div id='chapter' >
                    <IconButton>
                        <KeyboardArrowLeftOutlined />
                    </IconButton>
                    <TextField size='small' readOnly value={'Vol 1 Ch 1'} />
                    <IconButton>
                        <KeyboardArrowRightOutlined />
                    </IconButton>
                </div>
                <Divider />
                <div id='scanlator' >
                    <Flag code={'us'} height={16} />
                    <Typography variant='subtitle1' >
                        Musunde Scans
                    </Typography>
                </div>
                <Divider />
                    <div id="actions">
                        <Button variant='outlined' >
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
            display: flex;
            justify-content: center;
            align-items: center;
            gap: .4rem;
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
    onClose: PropTypes.func,
    title: PropTypes.string,
}

export default SidePane;

