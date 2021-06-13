import { Card as MuiCard, CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core';
import manga404 from 'Assets/images/manga-404.jpg';
import React from 'react';
import styled from 'styled-components';
import PopularityDetails from './PopularityDetails';
import UpdateDetails from './UpdateDetails';
import PropTypes from 'prop-types';


/** @param {MangaCard.propTypes} props */
function MangaCard(props) {
    return (
        <Card>
            <CardActionArea>
                <CardMedia
                    image={manga404}
                    title={props.mangaName}
                >
                    <img src={props.image} />
                </CardMedia>
                <CardContent>
                    <Typography gutterBottom component="h3" >
                        {props.mangaName}
                    </Typography>
                    <PopularityDetails
                        views={props.views} rating={props.rating}
                    />
                    <UpdateDetails
                        updateDate={props.updateDate}
                        chapterNum={props.chapterNum}
                    />
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

const Card = styled(MuiCard)`
    width: 13rem;
    flex: none;
    .MuiCardMedia-root {
        height: 18rem;
        background-size: 100%;
        img {
            height: 100%;
            width: 100%;
        }
    }
    .MuiCardContent-root {
        padding: .4rem;
    }
    ${({ theme }) => theme.breakpoints.down('sm')} {
        width: 10.4rem;
        .MuiCardMedia-root {
            height: 14.4rem;
        }
    }
`;


MangaCard.propTypes = {
    mangaName: PropTypes.string,
    image: PropTypes.string,
    views: PropTypes.number,
    rating: PropTypes.number,
    updateDate: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.string, PropTypes.number,
    ]),
    chapterNum: PropTypes.oneOfType([
        PropTypes.string, PropTypes.number,
    ]),
}

export default MangaCard

