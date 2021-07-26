import { IconButton, MenuItem, Toolbar } from '@material-ui/core';
import { MenuOpenOutlined } from '@material-ui/icons';
import Close from '@material-ui/icons/Close';
import ReaderSettings from 'Components/read/ReaderSettings';
import ReadingPane from 'Components/read/ReadingPane';
import SidePane from 'Components/read/SidePane';
import SideDrawer from 'Components/shared/mui-x/SideDrawer';
import SystemAppBar from 'Components/SystemAppBar.js';
import { Manga } from 'mangadex-full-api';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addNotification } from 'Redux/actions';
import { useRouter } from 'Shared/flitlib';
import { Chapter } from 'Shared/mfa/src';
import styled from 'styled-components';

function Read() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    /**@type {[Chapter]} */
    const [chapter, setChapter] = useState();
    const [fetching, setFetching] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [readerSettings, setReaderSettings] = useState({
        showAdvanced: false,
        imageSize: 'fit-width',
        displayMode: 'all',
        readingDir: 'left',
        arrowScrollSize: window.document.body.clientHeight * .8,
        preloadPages: 5,
    });
    const readingPaneRef = useRef(null);
    const language = useSelector(state => state.language);

    const giveReadingPaneFocus = () => {
        /**@type {HTMLDivElement} */
        const el = readingPaneRef.current;
        if (!el) return;
        window.setTimeout(() => el.focus(), 0);
    }

    const toggleDrawer = e => {
        setDrawerOpen(s => !s);
        giveReadingPaneFocus();
    }

    const params = useParams();
    const dispatch = useDispatch();
    const { changePage } = useRouter();


    /**@param {Chapter} chapter */
    const setUpLoadedChapter = async chapter => {
        const pages = await chapter.getReadablePages();
        chapter.pages = pages;
        setChapter(chapter);
        setCurrentPage(params.page - 1);
        giveReadingPaneFocus();
    }

    const fetchChapter = async () => {
        try {
            setFetching(true);
            const chapter = await Chapter.get(params.id, true);
            setUpLoadedChapter(chapter);
        } catch (err) {
            if (/TypeError/.test(err.message)) {
                dispatch(addNotification({
                    message: "Check your network connection and refresh",
                    group: 'network',
                    persist: true
                }));
            }
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        fetchChapter();
    }, []);

    useEffect(() => {
        if (!chapter) return;
        document.title = `${chapter.manga.title}: Ch. ${chapter.chapter} - Dexumi`;
    }, [chapter]);

    const handleReaderSettingChange = e => {
        const key = e.target.name;
        let val = e.target.value;
        if (e.target.type === 'checkbox') {
            val = e.target.checked;
        }
        if (key === 'arrowScrollSize') {
            val = parseFloat(val);
        }
        setReaderSettings(s => ({ ...s, [key]: val }))
    }

    const handlePageChange = (e, pg, noRender) => {
        pg = Number(pg);
        if (pg < 0) return;
        if (pg > chapter?.pages.length) return;
        setCurrentPage(pg);
        changePage(`../${pg + 1}`);
    }


    const closeReaderSettings = _ => {
        setShowSettings(false);
        giveReadingPaneFocus();
    }

    const goToNextChapter = async () => {
        if(!chapter.manga) return;
        let aggVols;
        try {
            aggVols = await chapter.manga.getAggregate([language]);
        } catch (err) {
            return dispatch(addNotification({
                message: "Check your network connection and refresh",
                group: 'network',
                persist: true
            }));
        }
        const vol = aggVols[chapter.volume || 'none'];
        const chIdx = Object.keys(vol.chapters).indexOf(chapter.chapter ?? 'none');
        
        let nextChNum = Object.keys(vol.chapters)[chIdx + 1];
        if(!nextChNum){
            const volIdx = Object.keys(aggVols).indexOf(chapter.volume ?? 'none');
            const nextVolKey = Object.keys(aggVols)[volIdx + 1];
            if(vol === 'none' || !nextVolKey){
                return dispatch(addNotification({
                    message: "There's no next chapter",
                    group: 'no-next-chapter'
                }));
            }
            nextChNum = Object.values(aggVols[nextVolKey].chapters)[0].chapter;            
        }
        goToChapter(nextChNum);
    }

    const goToPrevChapter = async () => {
        if(!chapter.manga) return;
        let aggVols;
        try {
            aggVols = await chapter.manga.getAggregate([language]);
        } catch (err) {
            return dispatch(addNotification({
                message: "Check your network connection and refresh",
                group: 'network',
                persist: true
            }));
        }
        const vol = aggVols[chapter.volume || 'none'];
        const chIdx = Object.keys(vol.chapters).indexOf(chapter.chapter ?? 'none');
        
        let prevChNum = Object.keys(vol.chapters)[chIdx - 1];
        if(!prevChNum){
            const volIdx = Object.keys(aggVols).indexOf(chapter.volume ?? 'none');
            const prevVolKey = Object.keys(aggVols)[volIdx - 1];
            if(vol === 'none' || !prevVolKey){
                return dispatch(addNotification({
                    message: "There's no previous chapter",
                    group: 'no-prev-chapter'
                }));
            }

            const l = Object.values(aggVols[prevVolKey].chapters).length;
            prevChNum = Object.values(aggVols[prevVolKey].chapters)[l - 1].chapter;            

        }
        goToChapter(prevChNum);
    }


    const goToChapter = async (ch, opts = {}) => {
        try {
            setFetching(true);
            const params = {
                chapter: ch,
                manga: chapter.manga.id,
                translatedLanguage: [language],
            }
            if (!opts?.allGroups) {
                params.groups = [chapter.groups[0].id];
            }
            const newChapter = await Chapter.getByQuery(params);
            setUpLoadedChapter(newChapter);
        } catch (err) {
            if(err.message === 'Search returned no results.'){
                if (!opts?.allGroups) {
                    return goToChapter(ch, {allGroups: true});
                }
                dispatch(addNotification({
                    message: 'No chapter found'
                }))
            }
            console.error(err);
        } finally {
            setFetching(false);
        }
    }

    return (
        <>
            {fetching &&
                <SystemAppBar content='none' appBarProps={{ position: 'sticky' }} />
            }
            <Wrapper className='page fill-screen' >
                <div >
                    <IconButton id='menu' onClick={toggleDrawer} >
                        <MenuOpenOutlined data-open={drawerOpen} />
                    </IconButton>
                    <ReadingPane
                        fetching={fetching} chapter={chapter}
                        currentPage={currentPage}
                        onChangePage={handlePageChange}
                        readerSettings={readerSettings}
                        readingPaneRef={readingPaneRef}
                    />
                </div>
                <SidePane
                    open={drawerOpen} onClose={toggleDrawer}
                    currentPage={currentPage} chapter={chapter}
                    onShowSettings={_ => setShowSettings(true)}
                    onNextChapterClick={goToNextChapter}
                    onPrevChapterClick={goToPrevChapter}
                    readerSettings={readerSettings}
                />

                <ReaderSettings
                    open={showSettings} onClose={closeReaderSettings}
                    readerSettings={readerSettings}
                    imageSize={readerSettings.imageSize}
                    displayMode={readerSettings.displayMode}
                    readingDir={readerSettings.readingDir}
                    onChange={handleReaderSettingChange}
                />

            </Wrapper>
        </>
    )
}


const Wrapper = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    > div {
        position: relative;
        overflow: hidden;
        #menu {
            position: absolute;
            top: 0;
            right: 0;
            z-index: ${p => p.theme.zIndex.drawer};
            svg{
                transition: transform 250ms ease-out;
                &[data-open=true] {
                    transform: rotate(180deg);
                }
            }
        }
    }
    #menu {
        position: absolute;
        z-index: 1000;
        /* top: ${({ theme }) => theme.mixins.toolbar.minHeight + 16}px; */
        top: 0px;
        background-color: ${({ theme }) => theme.palette.type === 'light' ?
        theme.palette.grey[100] : theme.palette.grey[900]
    };
        right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
`;


export default Read;
