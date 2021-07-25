import { IconButton, MenuItem, Toolbar } from '@material-ui/core';
import { MenuOpenOutlined } from '@material-ui/icons';
import Close from '@material-ui/icons/Close';
import ReaderSettings from 'Components/read/ReaderSettings';
import ReadingPane from 'Components/read/ReadingPane';
import SidePane from 'Components/read/SidePane';
import SideDrawer from 'Components/shared/mui-x/SideDrawer';
import SystemAppBar from 'Components/SystemAppBar.js';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addNotification } from 'Redux/actions';
import { useRouter } from 'Shared/flitlib';
import { Chapter } from 'Shared/mfa/src';
import styled from 'styled-components';

function Read() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [chapter, setChapter] = useState();
    const [fetching, setFetching] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [readerSettings, setReaderSettings] = useState({
        showAdvanced: false,
        imageSize: 'fit-width',
        displayMode: 'all',
        readingDir: 'right',
        arrowScrollSize: Math.min(window.document.body.clientHeight * .8, 420),
        preloadPages: 5,
    })

    const toggleDrawer = e => {
        setDrawerOpen(s => !s);
    }

    const params = useParams();
    const dispatch = useDispatch();
    const {changePage} = useRouter();

    const fetchChapter = async () => {
        try {
            setFetching(true);
            const chapter = await Chapter.get(params.id, true);
            const pages = await chapter.getReadablePages();
            chapter.pages = pages;
            console.debug(chapter);
            setChapter(chapter);
            setCurrentPage(params.page - 1);
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

    const handleReaderSettingChange = e => {
        const key = e.target.name;
        let val = e.target.value;
        if(e.target.type === 'checkbox'){
            val = e.target.checked;
        }
        if(key === 'arrowScrollSize'){
            val = parseFloat(val);
        }
        setReaderSettings(s => ({ ...s, [key]: val }))
    }

    const handlePageChange = (e, pg, noRender) => {
        pg = Number(pg);
        if(pg < 0) return;
        if(pg > chapter?.pages.length) return;
        setCurrentPage(pg);
        changePage(`../${pg + 1}`);
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
                    />
                </div>
                <SidePane
                    open={drawerOpen} onClose={toggleDrawer}
                    currentPage={currentPage} chapter={chapter}
                    onShowSettings={_ => setShowSettings(true)}
                />

                <ReaderSettings
                    open={showSettings} onClose={_ => setShowSettings(false)}
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
