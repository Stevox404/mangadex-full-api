import {
    AppBar, Button, Card, CardContent, IconButton, Toolbar, Typography,
    useMediaQuery, Hidden
} from '@material-ui/core';
import heroImg from 'Assets/images/hero-img.jpg';
import AppBarContent from 'Components/SystemAppBar.js/AppBarContent';
import MangaListSection from 'Components/landing/MangaListSection';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Manga } from 'mangadex-full-api';
import { KeyboardArrowLeftOutlined, KeyboardArrowRightOutlined } from '@material-ui/icons';
import Featured from 'Components/landing/Featured';

function Landing() {
    useEffect(() => {
        const oldTitle = document.title;
        document.title = 'Mangapi';
        test();
        // Manga.search({ limit: 2 });
        return () => document.title = oldTitle;
    }, []);
    
    const test = async () => {
        // Manga.getRandom()
        // const m = await Manga.search({  });
        // console.debug(m);
    }


    const getMangaList = () => {
        const mangas = [];
        for (let i = 0; i < 14; i++) {
            mangas.push({
                name: 'Nabarinoo',
                image: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Nabarinoo.jpg',
                views: Math.random() * (5000 - 1000) + 1000,
                rating: Math.random() * (5 - 1) + 1,
                updateDate: new Date() - (Math.random() * 86400000),
                chapterNum: Math.random() * (200 - 5) + 5,
            });
        }

        return mangas;
    }

    return (
        <Wrapper className='page fill-screen'>
            {/* <div id="spacer" /> */}
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
                        mangaList={getMangaList()}
                        showPopularity={false}
                    />
                    <MangaListSection
                        listName='Newly Added'
                        mangaList={getMangaList()}
                        showPopularity={false}
                        showUpdate={false}
                    />
                </div>
            </div>
        </Wrapper>
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