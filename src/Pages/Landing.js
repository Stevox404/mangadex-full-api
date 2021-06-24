import {
    AppBar, Button, Card, CardContent, IconButton, Toolbar,
    Typography
} from '@material-ui/core';
import heroImg from 'Assets/images/hero-img.jpg';
import AppBarContent from 'Components/SystemAppBar.js/AppBarContent';
import MangaListSection from 'Components/home/MangaListSection';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Manga } from 'mangadex-full-api';
import { KeyboardArrowLeftOutlined, KeyboardArrowRightOutlined } from '@material-ui/icons';

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
            <div id="featured">
                <IconButton >
                    <KeyboardArrowLeftOutlined />
                </IconButton>
                <div id='card-box' >
                    <Card variant='outlined' >
                        <CardContent>
                            <div id='pos'>
                                <div className='current' />
                                <div />
                                <div />
                            </div>
                            <Typography variant='subtitle1' >Featured Manga</Typography>
                            <Typography variant='h3' gutterBottom >Naruto</Typography>
                            <Typography variant='body2' gutterBottom >
                                This is the story of Naruto Uzumaki, 
                                a young ninja who seeks recognition from 
                                his peers and dreams of becoming the Hokage, 
                                the leader of his village. The story is 
                                told in two parts – the first set in Naruto's 
                                pre-teen years, and the second in his teens.
                            </Typography>
                            <Button variant='contained' color='primary' >
                                Read Now
                            </Button>
                        </CardContent>

                    </Card>
                </div>
                <IconButton>
                    <KeyboardArrowRightOutlined />
                </IconButton>
            </div>
            <div className='content' >
                <div>
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

    #featured {
        height: 45vh;
        min-height: 420px;
        width: 100%;
        background-image: url(${'https://upload.wikimedia.org/wikipedia/en/c/c9/Nabarinoo.jpg'});
        background-size: cover;
        background-position: center;
        display: grid;
        align-items: center;
        padding: 1rem 1.6rem;
        grid-template-columns: auto 1fr auto;
        gap: 1rem;
        .MuiIconButton-root {
            background-color: ${({theme}) => theme.palette.primary.main};
        }
        #card-box {
            flex: 1;
            display: grid;
            justify-content: flex-start;
            .MuiCard-root {
                background-color: ${({theme}) => theme.palette.background.paper}cc;
                width: 40%;
                .MuiCardContent-root{
                    display: grid;
                    #pos {
                        justify-self: flex-end;
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: .4rem;
                        div {
                            width: .5rem;
                            height: .5rem;
                            border: 1px solid ${({theme}) => theme.palette.primary.main};
                            /* border: 1px solid #fff; */
                            border-radius: 50%;
                            &.current {
                                background-color: ${({theme}) => theme.palette.primary.main};
                            }
                        }

                    }
                    .MuiTypography-subtitle1 {
                        margin-bottom: -.4rem;
                    }
                    .MuiButton-root {
                        justify-self: flex-end;
                    }
                }
            }
        }
    }
    .content {
        padding: 2rem 3rem;
        ${({ theme }) => theme.breakpoints.down('sm')} {
            padding: 2rem 1.2rem;
        }

    }
`;




export default Landing;