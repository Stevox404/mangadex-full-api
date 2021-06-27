import { Card as MuiCard, CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core';
import manga404 from 'Assets/images/manga-404.jpg';
import React from 'react';
import styled from 'styled-components';
import PopularityDetails from './PopularityDetails';
import UpdateDetails from './UpdateDetails';
import PropTypes from 'prop-types';
import { useRouter } from 'Utils/shared/flitlib';


/** @param {MangaCard.propTypes} props */
function MangaCard(props) {
    const { changePage } = useRouter();

    /**@param {Event} e */
    const handleClick = (e) => {
        changePage('/manga');
    }

    return (
        <Card>
            <CardActionArea onClick={handleClick} >
                <CardMedia
                    image={manga404}
                    title={props.mangaName}
                >
                    <img
                        src={props.image} loading="lazy"
                        alt={props.mangaName + ' cover'}
                    />
                </CardMedia>
                <CardContent>
                    <Typography gutterBottom component="h3" >
                        {props.mangaName}
                    </Typography>
                    {props.showPopularity &&
                        <PopularityDetails
                            views={props.views} rating={props.rating}
                        />
                    }
                    {props.showUpdate &&
                        <UpdateDetails
                            updateDate={props.updateDate}
                            chapterNum={props.chapterNum}
                        />
                    }
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

const Card = styled(MuiCard)`
    display: inline-block;
    inline-size: 100%;
    inline-size: var(--size, 13rem);
    flex: none;
    .MuiCardMedia-root {
        height: 18rem;
        background-size: 100%;
        img {
            inline-size: 100%;
            block-size: 100%;
            object-fit: cover;
            /* height: 100%;
            width: 100%; */
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

    /* Don't display covers if in data-saver mode */
    @media (prefers-reduced-data: reduce) {
        & {
            min-inline-size: var(--size);
            .MuiCardMedia-root {
                display: none;
            }
        }
    }
`;


MangaCard.defaultProps = {
    showUpdate: true,
    showPopularity: true,
}

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
    showUpdate: PropTypes.bool,
    showPopularity: PropTypes.bool,
}

export default MangaCard

