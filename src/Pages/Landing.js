import {
    AppBar, Button, Card, CardContent, IconButton, Toolbar, Typography,
    useMediaQuery, Hidden
} from '@material-ui/core';
import heroImg from 'Assets/images/hero-img.jpg';
import AppBarContent from 'Components/SystemAppBar.js/AppBarContent';
import MangaListSection from 'Components/landing/MangaListSection';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Manga } from 'mangadex-full-api';
import { KeyboardArrowLeftOutlined, KeyboardArrowRightOutlined } from '@material-ui/icons';
import Featured from 'Components/landing/Featured';
import moment from 'moment';
import { addNotification } from 'Redux/actions';
import { useDispatch } from 'react-redux';
import SystemAppBar from 'Components/SystemAppBar.js';

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
            const m = await Manga.search({
                createdAtSince: moment().subtract(1, 'year').subtract(7, 'days').format('YYYY-MM-DDThh:mm:ss'),
                limit: 15
            }, true);
            setNewestManga(m);
        } catch (err) {
            if (/TypeError/.test(err.message)) {
                dispatch(addNotification({
                    message: "Check your network connection",
                    group: 'network',
                    persist: true
                }));
            }
        }
    }
    
    const getRecentManga = async () => {
        try {
            const m = await Manga.search({
                updatedAtSince: moment().subtract(1, 'year').subtract(7, 'days').format('YYYY-MM-DDThh:mm:ss'),
                limit: 15
            }, true);
            setRecentManga(m);
        } catch (err) {
            if(err.name === 'APIRequestError'){
                addNotification('Could not fetch mangas. Please check your network');
            }
        }
    }
    
    const getMangaList = () => {
        const mangas = [];
        for (let i = 0; i < 14; i++) {
            mangas.push({
                // title: 'How My Overly Cautious Classmate became OP in Another World!',
                title: i % 2 ?'Naruto' : 'How My Overly Cautious Classmate became OP in Another World!',
                // image: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Nabarinoo.jpg',
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
                        <MangaListSection
                            listName='Top rated'
                            mangaList={getMangaList()}
                            showUpdate={false}
                        />
                        <MangaListSection
                            listName='Recently Updated'
                            mangaList={recentManga}
                            showPopularity={false}
                        />
                        <MangaListSection
                            listName='Newly Added'
                            mangaList={newestManga}
                            showPopularity={false}
                            showUpdate={false}
                        />
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