import { SystemAppBar } from 'Components';
import { MangaListSection } from 'Features/landing';
import { Featured } from 'Features/landing';
import { Manga } from 'mangadex-full-api';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from 'Redux/actions';
import styled from 'styled-components';
import { DexCache } from 'Utils/StorageManager';

const recentCache = new DexCache();
recentCache.name = 'recent';

const newestCache = new DexCache();
newestCache.name = 'newest';

function Landing() {
    const [recentManga, setRecentManga] = useState();
    const [newestManga, setNewestManga] = useState();

    useEffect(() => {
        document.title = 'Dexumi';
        getRecentManga();
        getNewestManga();
        // Manga.search({ limit: 2 });
    }, []);

    const dispatch = useDispatch();


    const getNewestManga = async () => {
        try {
            let m //= await recentCache.fetch();
            if (!m) {
                m = await Manga.search({
                    order: {
                        createdAt: 'desc'
                    },
                    createdAtSince: moment().subtract(1, 'month').format('YYYY-MM-DDThh:mm:ss'),
                    limit: 40
                });
                // recentCache.data = m;
                // recentCache.save();
            }
            setNewestManga(m);
        } catch (err) {
            if (/TypeError/.test(err.message)) {
                dispatch(addNotification({
                    message: "Check your network connection",
                    group: 'network',
                    persist: true
                }));
            } else {
                throw err;
            }
        }
    }

    const getRecentManga = async () => {
        try {
            let m //= await newestCache.fetch();
            if (!m) {
                const m = await Manga.search({
                    order: {
                        updatedAt: 'desc'
                    },
                    updatedAtSince: moment().subtract(1, 'month').format('YYYY-MM-DDThh:mm:ss'),
                    limit: 40
                });
            }
            // newestCache.data = m;
            // newestCache.save();
            setRecentManga(m);
        } catch (err) {
            if (err.name === 'APIRequestError') {
                addNotification('Could not fetch mangas. Please check your network');
            } else {
                throw err;
            }
        }
    }

    const getMangaList = () => {
        const mangas = [];
        for (let i = 0; i < 14; i++) {
            mangas.push({
                id: `id_${i}`,
                title: i % 2 ? 'Naruto' : 'How My Overly Cautious Classmate became OP in Another World!',
                mainCover: {
                    image256: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Nabarinoop.jpg',
                },
                views: Math.random() * (5000 - 1000) + 1000,
                rating: Math.random() * (5 - 1) + 1,
                updateDate: new Date() - (Math.random() * 86400000),
                chapterNum: Math.random() * (200 - 5) + 5,
            });
        }

        return mangas;
    }

    return (
        <>
            <SystemAppBar />
            <Wrapper className='page fill-screen'>
                <Featured />
                <div className='content' >
                    <div>
                        {/* <MangaListSection
                            listName='Top rated'
                            mangaList={getMangaList()}
                            showUpdate={false}
                        /> */}
                        <MangaListSection
                            listName='Recently Updated'
                            mangaList={recentManga}
                            showPopularity={false}
                            showUpdate={false}
                        />
                        <MangaListSection
                            listName='Newly Added'
                            mangaList={newestManga}
                            showPopularity={false}
                            showUpdate={false}
                        />
                        {/* <MangaListSection
                            listName='Recommended for You'
                            mangaList={newestManga}
                            showPopularity={true}
                            showUpdate={false}
                        /> */}
                    </div>
                </div>
            </Wrapper>
        </>
    )
}


const Wrapper = styled.div`
    width: 100%;
    overflow-y: auto;
    a {
        color: inherit;
        text-decoration: none;
    }

    .content {
        padding: 2rem 3rem;
        ${({ theme }) => theme.breakpoints.down('sm')} {
            padding: 2rem 1.2rem;
        }

    }
`;




export default Landing;