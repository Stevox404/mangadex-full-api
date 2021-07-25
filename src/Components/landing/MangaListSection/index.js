import {
    Button, ButtonGroup, Typography, useMediaQuery
} from '@material-ui/core';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import styled from 'styled-components';
import MangaCard from './MangaCard';
import { Skeleton } from '@material-ui/lab';



/** @param {MangaListSection.propTypes} props */
function MangaListSection(props) {
    const listRef = useRef(null);

    const scrollList = (dir) => {
        /** @type {Element} */
        const el = listRef.current;
        const amt = dir * Number.parseInt(el.clientWidth * .8);
        el.scrollBy({ left: amt });
    }

    const isSm = useMediaQuery(theme => theme.breakpoints.down('sm'))
    const CARD_WIDTH = isSm ? '10.4rem' : '13rem';
    const CARD_HEIGHT = isSm ? '14.4rem' : '18rem';

    const getSkeletonNum = () => {
        /** @type {Element} */
        const el = listRef.current;
        if(!el) return;
        return Number.parseInt(el.clientWidth / (parseFloat(CARD_WIDTH) * 16)) - 1;
    }

    return (
        <Container data-card-width={CARD_WIDTH} data-card-height={CARD_HEIGHT} >
            <header>
                <Button variant='text' >
                    <Typography gutterBottom variant="h6" component="h2" >
                        {props.listName}
                    </Typography>
                </Button>
                <div className='flex-spacer' />
                {props.mangaList &&
                    <ButtonGroup>
                        <Button onClick={e => scrollList(-1)} >
                            <ArrowLeft />
                        </Button>
                        <Button onClick={e => scrollList(1)} >
                            <ArrowRight />
                        </Button>
                    </ButtonGroup>
                }
            </header>
            <div className='list' ref={listRef} >
                {props.mangaList ? props.mangaList.map((manga, idx) => (
                    <MangaCard
                        key={manga.id}
                        id={manga.id}
                        manga={manga}
                        mangaName={manga.name}
                        views={manga.views}
                        rating={manga.rating}
                        updateDate={manga.updateDate}
                        chapterNum={manga.chapterNum}
                        showPopularity={props.showPopularity}
                        showUpdate={props.showUpdate}
                    />
                )) : <>
                    {
                        Array.from(Array(10), (x, idx) => (
                            <Skeleton key={idx} variant="rect" />
                        ))
                    }
                </>}
            </div>
        </Container>
    )
}


const Container = styled.div`
    margin-bottom: 4.8rem;
    >header {
        display: flex;
        align-items: center;
        >.flex-spacer{
            flex: 1;
        }
    }
    >div.list {
        --width: ${p => p['data-card-width']};
        --height: ${p => p['data-card-height']};

        .MuiSkeleton-root {
            height: var(--height, 13rem);
            width: var(--width, 13rem);
        }
        
        --gap: 4.8rem;
        scroll-behavior: smooth;
        /* display: flex; */

        overflow-x: hidden;
        display: grid;
        grid-auto-flow: column;
        gap: calc(var(--gap) / 2);
        margin: 0;
        
        padding-inline: var(--gap);
        scroll-padding-inline: var(--gap);
        padding-block: calc(var(--gap) / 2);
        overscroll-behavior-inline: contain;
        scroll-snap-type: inline mandatory;

        /* display: inline-block; */
        outline-offset: 12px;
        &:focus {
            outline-offset: 7px;
        }
        @media (prefers-reduced-motion: no-preference) {
            & {
                transition: outline-offset .25s ease;
            }
        }
        >* {
            position: relative;
            scroll-snap-align: start;
            &::after {
                content: "";
                position: absolute;

                inline-size: var(--gap);
                block-size: 100%;

                inset-block-start: 0;
                inset-inline-end: calc(var(--gap) * -1);
            }
        }


        /* Hide scrollbar */
        &::-webkit-scrollbar {
            display: none;
        }
        /* Allow natural scrolling on touchscreens */
        @media (hover: none) {
            overflow-x: auto;
        }
    }
`;


MangaListSection.propTypes = {
    listName: PropTypes.string,
    showUpdate: PropTypes.bool,
    showPopularity: PropTypes.bool,
    mangaList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
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
    })),
}

export default MangaListSection

