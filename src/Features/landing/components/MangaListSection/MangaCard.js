import { Card as MuiCard, CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core';
import manga404 from 'Assets/images/manga-404.jpg';
import loadingGif from 'Assets/images/loading.gif';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PopularityDetails from './PopularityDetails';
import UpdateDetails from './UpdateDetails';
import PropTypes from 'prop-types';
import { useRouter } from 'flitlib';
import { Link } from 'react-router-dom';
import { Manga } from 'mangadex-full-api';




/** 
 * @param {MangaCard.propTypes} props
 * @todo handleEmptyList
 */
function MangaCard(props) {
    const [cover, setCover] = useState();
    const { changePage } = useRouter();

    const coverImgRef = useRef(null);
    useEffect(() => {
        if (!props.manga) return;
        // TODO wait till in viewport margin
        fetchCover();
    }, [props.manga]);

    const fetchCover = async _ => {
        /**@type {import('mangadex-full-api').Manga} */
        const manga = props.manga;
        let cover = props.manga.mainCover.image256;
        if (!cover) {
            const mainCover = await manga.mainCover.resolve();
            cover = mainCover.image256;
        }

        const img = new Image();
        img.src = cover;
        img.onload = e => {
            /**@type {HTMLImageElement} */
            const el = coverImgRef.current;
            if (!el) return;
            el.src = e.target.src;
        }
        img.onerror = e => {
            /**@type {HTMLImageElement} */
            const el = coverImgRef.current;
            if (!el) return;
            el.src = '';
        }
    }

    /**@param {Event} e */
    const handleClick = (e) => {
        /**@todo Use nicer url */
        changePage(`/title/${props.manga.id}`);
    }
    const onCoverError = (e) => {
        /**@type {HTMLImageElement} */
        const el = coverImgRef.current;
        el.src = '';
    }

    return (
        <Card component={Link} to={`/title/${props.manga.id}`} >
            <CardActionArea onClick={handleClick} >
                <CardMedia
                    image={manga404}
                    title={props.manga.title}
                >
                    <img
                        src={loadingGif} loading="lazy" ref={coverImgRef}
                        alt={props.manga.title + ' cover'}
                        onError={onCoverError}
                    />
                </CardMedia>
                <CardContent>
                    <Typography gutterBottom component="h3" >
                        {props.manga.title}
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
    width: var(--width, 13rem);
    flex: none;
    position: relative;
    .MuiCardMedia-root {
        height: var(--height, 13rem);
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
        --card-color: ${({ theme }) => theme.palette.background.paper};
        padding: .4rem;
        position: absolute;
        bottom: 0;
        /* background-color: ${({ theme }) => theme.palette.background.paper}aa; */
        background: linear-gradient(rgba(255, 255, 255, 0), var(--card-color) 30%);
        width: 100%;
        .MuiTypography-body1 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
        }
    }

    &:hover {
        .MuiCardContent-root {
            .MuiTypography-body1 {
                overflow: unset;
                text-overflow: unset;
                white-space: unset;
            }
        }
    }

    /* Don't display covers if in data-saver mode */
    @media (prefers-reduced-data: reduce) {
        & {
            min-width: var(--width);
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
    id: PropTypes.string,
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

