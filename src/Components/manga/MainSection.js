import {
    Typography
} from '@material-ui/core';
import { StarOutlined, VisibilityOutlined } from '@material-ui/icons';
import coverSample from 'Assets/images/manga-cover.jpg';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { abbreviateNumber } from 'Utils';

/** @param {MainSection.propTypes} props */
function MainSection(props) {
    return (
        <Container>
            <img src={props.cover} />
            <div id="info">
                <header>
                    <Typography variant='h3' component='h1' >
                        {props.title}
                    </Typography>
                </header>
                <div id='details' >
                    <Typography color='textSecondary' >
                        {props.chaptersNum} Chapters | {props.authorName}
                    </Typography>
                    <Typography id='popularity' color='textSecondary' >
                        <div>
                            <StarOutlined id='star' /> {props.rating}
                        </div>
                        <div>
                            <VisibilityOutlined /> {
                                abbreviateNumber(props.views || 0)
                            }
                        </div>
                    </Typography>
                </div>
                <div id='details' >
                    <Typography color='textSecondary' variant='body2' >
                        {props.genres?.join(', ')}
                    </Typography>
                </div>
                <div id='summary' >
                    <Typography>
                        {props.description}
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
    padding: 0 3rem 3rem;
    >img {
        height: 440px;
        width: 280px;
        margin-top: -128px;
        border-radius: 5px;
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
        }
        #summary {
            margin-top: 1.6rem;
        }
    }
`;

MainSection.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    chaptersNum: PropTypes.number.isRequired,
    genres: PropTypes.arrayOf(PropTypes.string),
    views: PropTypes.number,
    rating: PropTypes.number,
}

export default MainSection

