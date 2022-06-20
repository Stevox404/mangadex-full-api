import {
    Button, Card, CardContent, IconButton, Typography,
    useMediaQuery
} from '@material-ui/core';
import { KeyboardArrowLeftOutlined, KeyboardArrowRightOutlined } from '@material-ui/icons';
import Img from 'Components/shared/Img';
import { useRouter } from 'flitlib';
import { Manga, Cover } from 'mangadex-full-api';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addNotification } from 'Redux/actions';
import styled from 'styled-components';
import { DexCache } from 'Utils/StorageManager';

const recentCache = new DexCache();
recentCache.name = 'recent';

function Featured(props) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    /**@type {Array<Manga[], Function>} */
    const [ftManga, setFtManga] = useState([]);
    const [loadingImg, setLoadingImg] = useState(true);
    const { changePage } = useRouter();
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        try {
            fetchFeaturedManga();
        } catch (err) {
            if (err.name === 'APIRequestError') {
                addNotification({
                    message: "Check your network connection and refresh",
                    group: 'network',
                    persist: true
                });
            }
        }
    }, []);

    const fetchFeaturedManga = async () => {
        setFetching(true);
        const fts = [];
        try {
            const ft = JSON.parse(window.localStorage.getItem('featured'));
            const ftIds = ft.ids;
            if (!ftIds.length) throw new Error('No featured manga in storage');
            const ftDate = ft.date;
            if (!ftIds || new Date(ftDate).toDateString() !== new Date().toDateString()) throw new Error();
            const promises = ftIds.map(async id => {
                const manga = await Manga.get(id);
                manga.mainCover = await Cover.get(manga.mainCover.id);
                return manga;
            });
            fts.push(...(await Promise.all(promises)));
        } catch (err) {
            const ftCount = 3;
            const ftPromises = [];
            for (let idx = 0; idx < ftCount; idx++) {
                ftPromises.push(Manga.getRandom().catch(err => console.debug(err)));
            }
            const mangas = await Promise.all(ftPromises);
            const ftIds = [];
            mangas.forEach(async m => {
                ftIds.push(m.id);
                m.mainCover = await Cover.get(m.mainCover.id);
            });
            fts.push(...mangas);
            window.localStorage.setItem('featured', JSON.stringify({
                ids: ftIds,
                date: Date.now()
            }));
        }
        setFetching(false);
        setFtManga(fts);
    }

    const shiftSelectedIndex = (dir = 1) => {
        setLoadingImg(true);
        const ftCount = ftManga.length;
        // Handle wrap-around
        let idx = selectedIndex + dir;
        if (idx >= ftCount) idx = 0;
        else if (idx < 0) idx = ftCount - 1;
        setSelectedIndex(idx);
    }

    const isUnderMdSize = useMediaQuery(theme => theme.breakpoints.down('md'));

    return (
        <Container selectedIndex={selectedIndex} >
            <div id='img-box' className={loadingImg ? 'loading' : ''} >
                <Img
                    src={ftManga[selectedIndex]?.mainCover.imageSource} alt="Cover" className='bg'
                    onLoad={_ => {
                        setLoadingImg(false);
                    }}
                />
                <Img
                    src={ftManga[selectedIndex]?.mainCover.imageSource} alt="Cover" className='main'
                    onLoad={_ => {
                        setLoadingImg(false);
                    }}
                />
            </div>
            {Boolean(ftManga?.length) &&
                <IconButton onClick={_ => shiftSelectedIndex(-1)} >
                    <KeyboardArrowLeftOutlined />
                </IconButton>
            }
            <div id='card-box' >
                <Card variant='outlined' >
                    <CardContent >
                        <div id='pos'>
                            {ftManga.map((f, idx) => <div key={idx} />)}
                        </div>
                        <Typography variant='subtitle1' >Featured Manga</Typography>
                        <Typography variant='h3' gutterBottom >
                            {ftManga[selectedIndex]?.title}
                        </Typography>
                        {!isUnderMdSize &&
                            <Typography variant='body2' gutterBottom >
                                {ftManga[selectedIndex]?.description}
                            </Typography>
                        }
                        <Button
                            variant='contained' color='primary'
                            component={Link} to={`/title/${ftManga[selectedIndex]?.id}`}
                            size={isUnderMdSize ? 'small' : 'medium'} disabled={fetching}
                        >
                            Read Now
                        </Button>
                    </CardContent>
                </Card>
            </div>
            {Boolean(ftManga?.length) &&
                <IconButton onClick={_ => shiftSelectedIndex(1)} >
                    <KeyboardArrowRightOutlined />
                </IconButton>
            }
        </Container>
    )
}


const Container = styled.div`
    height: 45vh;
    min-height: 420px;
    width: 100%;
    background-size: cover;
    background-position: right 20%;
    display: grid;
    align-items: center;
    padding: 1rem 1.6rem;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-content: center;
    position: relative;

    >div#img-box{
        position: absolute;
        width: 100%;
        height: 100%;
        &.loading {
            filter: brightness(.4);
        }
        >img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: right 30%;
            &.bg{
                filter: blur(8px);
            }
            &.main{
                position: absolute;
                top: 0;
                right: 0;
                object-fit: contain;
                height: 110%;
                object-position: 70% 20%;
            }
        }
    }
    
    .MuiIconButton-root {
        background-color: ${({ theme }) => theme.palette.primary.main};
        z-index: 1;
        &:hover {
            background-color: ${({ theme }) => theme.palette.primary.dark};
        }
    }
    #card-box {
        flex: 1;
        display: grid;
        justify-content: flex-start;
        z-index: 1;
        .MuiCard-root {
            --card-color: ${({ theme }) => theme.palette.background.paper}cc;
            background-color: var(--card-color);
            /* width: 40%; */
            width: 460px;
            .MuiCardContent-root{
                display: grid;
                #pos {
                    justify-self: flex-end;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: .4rem;
                    div{
                        width: .5rem;
                        height: .5rem;
                        border: 1px solid ${({ theme }) => theme.palette.primary.main};
                        /* border: 1px solid #fff; */
                        border-radius: 50%;
                        &:nth-child(${({ selectedIndex }) => selectedIndex + 1}) {
                            background-color: ${({ theme }) => theme.palette.primary.main};
                        }
                    }
                }
                .MuiTypography-h3 {
                    font-size: 2rem;
                }
                .MuiTypography-subtitle1 {
                    margin-bottom: -.4rem;
                }

                &.overflow {
                }
                
                
                .MuiTypography-body2 {
                    line-height: 1.2;
                    overflow: hidden;
                    position: relative;
                    max-height: calc(1.2rem * 8.4);
                    &::after {
                        content: "";
                        text-align: right;
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        width: 70%;
                        height: 1.2em;
                        /* background: linear-gradient(to right, rgba(255, 255, 255, 0), var(--card-color) 40%); */
                    }
                }
                .MuiButton-root {
                    justify-self: flex-end;
                }
            }
        }
    }

    ${({ theme }) => theme.breakpoints.down('md')}{
        grid-template-columns: auto auto;
        justify-content: space-between;
        >div#img-box{
           >img.main{
                height: 100%;
            }
        }
        #card-box {
            position: absolute;
            bottom: 0;
            width: 100%;
            justify-content: stretch;
            .MuiCard-root {
                width: 100%;
                .MuiCardContent-root .MuiTypography-h3 {
                    font-size: 1.5rem;
                }
            }
        }
    }
`;

Featured.propTypes = {

}

export default Featured;
