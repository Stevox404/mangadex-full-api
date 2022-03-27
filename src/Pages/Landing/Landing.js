import { SystemAppBar } from 'Components';
import { MangaListSection, Featured } from './components';
import { Manga } from 'mangadex-full-api';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from 'Redux/actions';
import styled from 'styled-components';
import { resolveManga } from 'Utils/mfa';
import { DexCache } from 'Utils/StorageManager';

function Landing() {
    const [recentManga, setRecentManga] = useState(null);
    const [newestManga, setNewestManga] = useState(null);

    useEffect(() => {
        document.title = 'Dexumi';
        addToList('newest');
        addToList('recent');
    }, []);

    const dispatch = useDispatch();


    const addToList = async (listType) => {
        const searchProps = {
            order: {
                createdAt: 'desc'
            },
            limit: 10,            
        };
        if (listType === 'newest') {
            searchProps['createdAtSince'] = moment().subtract(1, 'month').format('YYYY-MM-DDThh:mm:ss');
        } else if (listType === 'recent') {
            searchProps['updatedAtSince'] = moment().subtract(1, 'month').format('YYYY-MM-DDThh:mm:ss');
        }
        
        const currentList = listType === 'newest' ? newestManga: recentManga;
        const list = currentList ? [...currentList]: [];
        console.log({list, newestManga, recentManga});

        const cache = new DexCache();
        cache.name = listType;
        cache.validFor = moment.duration(3, 'h');

        if (!list.length) {
            // If the list is empty, page was just loaded.
            // Check cache and if has data, load that and return

            let cachedList = await cache.fetch();
            if (cachedList) {
                return listType === 'newest' ? setNewestManga(cachedList): setRecentManga(cachedList);
            }
        }


        // else load the next list starting from offset        
        searchProps.offset = list.length + 1;
        
        try {
            let fetchedManga = await Manga.search(searchProps);
            fetchedManga = await Promise.all(fetchedManga.map(m =>
                resolveManga(m, { mainCover: true })
            ));
            const newList = [...list, ...fetchedManga];
            cache.data = newList;
            cache.save();
            listType === 'newest' ? setNewestManga(newList): setRecentManga(newList);
        } catch (err) {
            if (/TypeError/.test(err.message)) {
                dispatch(addNotification({
                    message: "Check your network connection",
                    group: 'network',
                    persist: true
                }));
            } else {
                console.error(err);
            }
        }
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
                            showPopularity={true}
                            showUpdate={true}
                            requestMoreManga={_ => {
                                return addToList('recent');
                            }}
                        />
                        <MangaListSection
                            listName='Newly Added'
                            mangaList={newestManga}
                            showPopularity={false}
                            showUpdate={false}
                            requestMoreManga={_ => {
                                return addToList('newest');
                            }}
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