import {
    Button, ButtonGroup, Typography
} from '@material-ui/core';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import styled from 'styled-components';
import MangaCard from './MangaCard';


/** @param {MangaListSection.propTypes} props */
function MangaListSection(props) {
    const listRef = useRef(null);

    const scrollList = (dir) => {
        /** @type {Element} */
        const el = listRef.current;
        const mangaCardSize = 13; // TODO extract to theme var
        const margin = 2.4;
        const size = (mangaCardSize + margin) * 16;
        const num = Number.parseInt(el.clientWidth / size);
        const amt = dir * size * num;
        console.debug({size, num, amt});
        el.scrollBy({ left: amt });
    }

    return (
        <Container>
            <header>
                <Button variant='text' >
                    <Typography gutterBottom variant="h6" component="h2" >
                        {props.listName}
                    </Typography>
                </Button>
                <div className='flex-spacer' />
                <ButtonGroup>
                    <Button onClick={e => scrollList(-1)} >
                        <ArrowLeft />
                    </Button>
                    <Button onClick={e => scrollList(1)} >
                        <ArrowRight />
                    </Button>
                </ButtonGroup>
            </header>
            <div className='list' ref={listRef} >
                {props.mangaList?.map((manga, idx) => (
                    <MangaCard
                        key={idx} // TODO unique id
                        mangaName={manga.name}
                        image={manga.image}
                        views={manga.views}
                        rating={manga.rating}
                        updateDate={manga.updateDate}
                        chapterNum={manga.chapterNum}
                    />
                ))}
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
        scroll-behavior: smooth;
        display: flex;
        overflow-x: hidden;
        &::-webkit-scrollbar {
            display: none;
        }
        @media (hover: none) {
            overflow-x: auto;
        }
        >* {
            margin-right: 2.4rem;
        }
    }
`;


MangaListSection.propTypes = {
    listName: PropTypes.string,
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

