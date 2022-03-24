import {
    Typography
} from '@material-ui/core';
import { StarOutlined, Bookmark } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { abbreviateNumber } from 'Utils';

/** @param {MainSection.propTypes} props */
function MainSection(props) {
    if (props.fetching) {
        return (
            <Container>
                <div className="main-cover">
                    <Skeleton variant='rect' />
                </div>
                <div id='info' >
                    <div id='details' >
                        <Skeleton />
                        <Skeleton />
                    </div>
                    <div id='details' >
                        <Skeleton />
                    </div>
                    <div id='summary' >
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <img className='main-cover' src={props.manga?.mainCover?.image512} />
            <div id="info">
                <header>
                    <Typography variant='h3' component='h1' >
                        {props.manga?.title}
                    </Typography>
                </header>
                <div id='details' >
                    <Typography color='textSecondary' >
                        {props.manga?.chapterCount} Chapters | {props.manga?.authors?.[0]?.name}
                    </Typography>
                    <Typography component='div' id='popularity' color='textSecondary' >
                        <div>
                            <StarOutlined id='star' /> {Math.round(props.manga?.rating) || '--'}
                        </div>
                        <div>
                            <Bookmark /> {
                                abbreviateNumber(props.manga?.follows || 0)
                            }
                        </div>
                    </Typography>
                </div>
                <div id='details' >
                    <Typography color='textSecondary' variant='body2' >
                        {props.manga?.genres?.join(', ')}
                    </Typography>
                </div>
                <div id='summary' >
                    <Typography>
                        {props.manga?.description}
                    </Typography>
                </div>
            </div>
        </Container>
    )
}

const Container = styled.main`
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 3rem;
    padding: 0 3rem;
    >.main-cover {
        position: sticky;
        top: 0;
        margin-bottom: 2rem;
        height: 440px;
        width: 280px;
        margin-top: -128px;
        border-radius: 5px;
        background-color: ${({theme}) => theme.palette.background.default};
        object-fit: cover;
        > .MuiSkeleton-root {
            height: 100%;
            width: 100%;
        }
    }
    #info {
        #details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            #popularity{
                display: grid;
                align-items: center;
                grid-template-columns: auto auto;
                gap: 2.4rem;
                >* {
                    display: grid;
                    align-items: center;
                    grid-template-columns: auto auto;
                    gap: .24rem;
                }
                .MuiSvgIcon-root {
                    color: ${({ theme }) => theme.palette.text.primary};
                }
            }

            .MuiSkeleton-root {
                width: 8rem;
                height: 2.8rem;
            }
        }
        #summary {
            margin-top: 1.6rem;
            .MuiTypography-root {
                white-space: pre-line;
            }
            .MuiSkeleton-root {
                width: 100%;
                height: 2.8rem;
            }
        }
    }
`;

MainSection.propTypes = {
    manga: PropTypes.object,
    fetching: PropTypes.bool,
}

export default MainSection

