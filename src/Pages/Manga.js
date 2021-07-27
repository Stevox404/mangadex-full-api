import coverSample from 'Assets/images/manga-cover.jpg';
import DataSection from 'Components/manga/DataSection';
import MainSection from 'Components/manga/MainSection';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Manga as MfaManga } from 'mangadex-full-api';
import { getLocalizedString } from 'Utils';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from 'Redux/actions';
import SystemAppBar from 'Components/SystemAppBar.js';


function Manga() {
    const params = useParams();
    const [manga, setManga] = useState();
    const [fetching, setFetching] = useState(true);
    const language = useSelector(state => state.language);
    const [chaptersNum, setChaptersNum] = useState('--');

    const dispatch = useDispatch();

    const fetchManga = async () => {
        try {
            const id = params.id;
            const manga = await MfaManga.get(id, true);
            // const chapters = await manga.getFeed({
            //     order: {chapter: 'asc'},
            //     limit: Infinity,
            //     translatedLanguage: language,
            // });
            manga.getAggregate().then(agg => {
                let lastCh = 0;
                for (let vol of Object.values(agg)) {
                    const chKeys = Object.keys(vol.chapters);
                    const lCh = Number(chKeys[chKeys.length - 1]);
                    if (lCh > lastCh) lastCh = lCh;
                }
                setChaptersNum(lastCh);
            });

            manga.tags.forEach(t => {
                // Genre, format, content, themes,
                const val = getLocalizedString(t.localizedName);
                if (Array.isArray(manga[t.group])) {
                    manga[t.group].push(val);
                } else {
                    manga[t.group] = [val];
                }
            })
            setManga(manga);
        } catch (err) {
            if (/TypeError/.test(err.message)) {
                dispatch(addNotification({
                    message: "Check your network connection",
                    group: 'network',
                    persist: true,
                    showDismissAsIcon: true
                }));
            }
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        fetchManga();
    }, [])

    useEffect(() => {
        if (!manga) return;
        document.title = `${manga.title} - Dexumi`;
    }, [manga]);


    return (
        <>
            <SystemAppBar />
            <Wrapper className='page fill-screen' data-main-cover={manga?.mainCover.imageSource} >
                <div id='hero-img' />
                <div className='content' >
                    <MainSection
                        fetching={fetching}
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
        </>
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
