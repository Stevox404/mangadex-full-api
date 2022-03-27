import {
    Button, ButtonGroup, Icon, Typography, useMediaQuery
} from '@material-ui/core';
import { ArrowLeft, ArrowRight, KeyboardArrowRight } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MangaCard from 'Components/shared/MangaCard';
import { Skeleton } from '@material-ui/lab';



/** @param {MangaListSection.propTypes} props */
function MangaListSection(props) {
    const listRef = useRef(null);
    const lastMangaRef = useRef(null);
    const [isRequestingMoreManga, setIsRequestingMoreManga] = useState(false);
    
    /**
     * @param {IntersectionObserverEntry[]} entries 
     * @param {IntersectionObserver} observer 
     */
    const requestMoreManga = React.useCallback((entries, observer) => {
        for (let entry of entries) {
            if (entry.isIntersecting) {
                setIsRequestingMoreManga(true);
                observer.unobserve(entry.target);
            }
        }
    }, [props]);

    useEffect(() => {
      if(isRequestingMoreManga) {
          props.requestMoreManga(props.mangaList);
      }
    }, [props, isRequestingMoreManga]);
    
    
    const observerRef = useRef(null);

    useEffect(() => {        
        // create observer when list is loaded
        const list = listRef.current;
        if(!list) return;
        let observer = observerRef.current;
        observerRef.current = new IntersectionObserver(requestMoreManga, { root: listRef.current, rootMargin: '0px 640px 0px 0px' })
        return _ => {
            observer.disconnect();
        }
    }, []);

    useEffect(() => {
        // Observe the last manga card
        const lastManga = lastMangaRef.current;
        if(!lastManga || lastManga.getAttribute('_isObserved')) return;
        const observer = observerRef.current;
        observer.observe(lastManga);
        lastManga.setAttribute('_isObserved', true);
        setIsRequestingMoreManga(false);
    // }, [lastMangaRef.current]);
    }, [props.mangaList]);

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
        if (!el) return;
        return Number.parseInt(el.clientWidth / (parseFloat(CARD_WIDTH) * 16)) - 1;
    }

    return (
        <Container data-card-width={CARD_WIDTH} data-card-height={CARD_HEIGHT} >
            <header>
                <Button variant='text' >
                    <Typography variant="h6" component="h2" >
                        {props.listName}
                    </Typography>
                    <KeyboardArrowRight />
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
                {props.mangaList?.length ? props.mangaList.map((manga, idx) => (
                    <MangaCard
                        key={manga.id}
                        manga={manga}
                        showPopularity={props.showPopularity}
                        showUpdate={props.showUpdate}
                        ref={idx === props.mangaList.length - 1 ? lastMangaRef : null}
                    />
                )) : <>
                    {
                        Array.from(Array(10), (x, idx) => (
                            <Skeleton key={idx} variant="rect" />
                        ))
                    }
                </>}
                {isRequestingMoreManga && [
                    <Skeleton key={0} variant="rect" />,
                    <Skeleton key={1} variant="rect" />
                ]}
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
        --card-width: ${p => p['data-card-width']};
        --card-height: ${p => p['data-card-height']};

        .MuiSkeleton-root {
            height: var(--card-height, 13rem);
            width: var(--card-width, 13rem);
        }
        
        --gap: 4.8rem;
        scroll-behavior: smooth;
        /* display: flex; */

        overflow-x: auto;

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
            display: none; /* Chrome, Safari and Opera */
        }
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        
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
    requestMoreManga: PropTypes.func,
    mangaList: PropTypes.arrayOf(PropTypes.object),
}

export default MangaListSection

