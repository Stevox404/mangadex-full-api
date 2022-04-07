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
    const [topManga, setTopManga] = useState(null);
    const [hotManga, setHotManga] = useState(null);

    useEffect(() => {
        document.title = 'Dexumi';
        addToList('newest');
        addToList('recent');
        addToList('top');
        addToList('hot');
    }, []);

    const dispatch = useDispatch();


    const addToList = async (listType) => {
        const searchProps = {
            order: {
                createdAt: 'desc'
            },
            limit: 7,            
        };
        let currentList, fn;
        if (listType === 'newest') {
            searchProps['createdAtSince'] = moment().subtract(1, 'month').format('YYYY-MM-DDThh:mm:ss');
            searchProps['order'] = {
                createdAt: 'desc'
            };
            fn = setNewestManga;
            currentList = newestManga;
        } else if (listType === 'hot') {
            searchProps['updatedAtSince'] = moment().subtract(1, 'day').format('YYYY-MM-DDThh:mm:ss');
            searchProps['order'] = {
                followedCount: 'desc',
            };
            fn = setHotManga;
            currentList = hotManga;
        } else if (listType === 'top') {
            searchProps['order'] = {
                followedCount: 'desc'
            };
            fn = setTopManga;
            currentList = topManga;
        } else {
            searchProps['updatedAtSince'] = moment().subtract(1, 'month').format('YYYY-MM-DDThh:mm:ss');
            searchProps['order'] = {
                updatedAt: 'desc'
            };
            fn = setRecentManga;
            currentList = recentManga;
        }
        
        const list = currentList ? [...currentList]: [];

        const cache = new DexCache();
        cache.name = listType;
        cache.validFor = moment.duration(3, 'h');

        if (!list.length) {
            // If the list is empty, page was just loaded.
            // Check cache and if has data, load that and return

            let cachedList = await cache.fetch();
            if (cachedList) {
                // return listType === 'newest' ? setNewestManga(cachedList): setRecentManga(cachedList);
                return fn(cachedList);
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
            // listType === 'newest' ? setNewestManga(newList): setRecentManga(newList);
            fn(newList);
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
                            listName='Hot'
                            mangaList={hotManga}
                            showUpdate={true}
                            requestMoreManga={_ => {
                                return addToList('hot');
                            }}
                        />
                        <MangaListSection
                            listName='Top rated'
                            mangaList={topManga}
                            showPopularity={true}
                            showUpdate={true}
                            requestMoreManga={_ => {
                                return addToList('top');
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