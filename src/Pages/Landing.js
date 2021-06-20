import {
    AppBar, Toolbar,
    Typography
} from '@material-ui/core';
import heroImg from 'Assets/images/hero-img.jpg';
import AppBarContent from 'Components/SystemAppBar.js/AppBarContent';
import MangaListSection from 'Components/home/MangaListSection';
import React, { useEffect } from 'react';
import styled from 'styled-components';

function Landing() {
    useEffect(() => {
        const oldTitle = document.title;
        document.title = 'Mangapi';
        return () => document.title = oldTitle;
    }, []);

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
            <div id="spacer" />
            <div className='content' >
                <div>
                    <MangaListSection
                        listName='Featured'
                        mangaList={getMangaList()}
                    />
                    <MangaListSection
                        listName='Top rated'
                        mangaList={getMangaList()}
                    />
                    <MangaListSection
                        listName='Recently Updated'
                        mangaList={getMangaList()}
                    />
                    <MangaListSection
                        listName='Newly Added'
                        mangaList={getMangaList()}
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