import coverSample from 'Assets/images/manga-cover.jpg';
import DataSection from 'Components/manga/DataSection';
import MainSection from 'Components/manga/MainSection';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Manga as MfaManga } from 'mangadex-full-api';
import { getLocalizedString } from 'Utils';
import { useSelector } from 'react-redux';


function Manga() {
    const params = useParams();
    const [manga, setManga] = useState();
    const [fetching, setFetching] = useState(true);
    const language = useSelector(state => state.language);
    const [chaptersNum, setChaptersNum] = useState('--');

    const fetchManga = async () => {
        const id = params.id;
        const manga = await MfaManga.get(id, true);
        // const chapters = await manga.getFeed({
        //     order: {chapter: 'asc'},
        //     limit: Infinity,
        //     translatedLanguage: language,
        // });
        manga.getAggregate().then(agg => {
            let lastCh = 0;
            for(let vol of Object.values(agg)){
                const chKeys = Object.keys(vol.chapters);
                const lCh = Number(chKeys[chKeys.length - 1]);
                if(lCh > lastCh) lastCh = lCh;
            }
            setChaptersNum(lastCh);
        });
        
        manga.tags.forEach(t => {
            // Genre, format, content, themes,
            const val = getLocalizedString(t.localizedName);
            if(Array.isArray(manga[t.group])){
                manga[t.group].push(val);
            } else {
                manga[t.group] = [val];
            }
        })
        setManga(manga);
        setFetching(false);
    }

    useEffect(() => {
        fetchManga();
    }, [])

    useEffect(() => {
        if(!manga) return;
        document.title = `${manga.title} - Dexumi`;
    }, [manga]);

    // sample data
    const getChapters = () => {

        const arr = [];
        let i = 10;
        while (--i > -1) {
            const d = 11 - i;
            arr.push({
                id: String(i),
                title: 'One-shot',
                chapter: String(i),
                uploaderName: 'Fairyland Scans',
                updatedAt: Date.now() - (Math.random() * (86400000 * d - 86400000 * (d - 1)) + 86400000 * (d - 1)),
            });
        }
        return arr;
    }

    return (
        <Wrapper className='page fill-screen' data-main-cover={manga?.mainCover.imageSource} >
            <div id='hero-img' />
            <div className='content' >
                <MainSection
                    title={manga?.title}
                    cover={manga?.mainCover.image512}
                    chaptersNum={chaptersNum}
                    rating={'--'}
                    views={'--'}
                    authorName={manga?.authors?.[0]?.name}
                    genres={manga?.genres}
                    description={manga?.description}
                />
                <DataSection
                    manga={manga}
                />
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    #hero-img {
        /* height: 170px; */
        height: 240px;
        background-image: linear-gradient(#000a, #0005), url(${p => p['data-main-cover']});
        background-size: cover;
        background-position: 0 25%;
        background-attachment: fixed;
    }
    .content {
        padding: 3rem;
        padding-top: 1rem;
        ${({ theme }) => theme.breakpoints.down('sm')} {
            padding: 1rem 0;
        }
    }
`;

export default Manga;
