import { Skeleton } from '@material-ui/lab';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

/**@param {ReadingPane.propTypes} props */
function ReadingPane(props) {
    const imgBoxRef = useRef(null);
    const prePg = useRef([]);
    const [observedEl, setObservedEl] = useState();

    /**
     * @param {IntersectionObserverEntry[]} entries 
     * @param {IntersectionObserver} observer 
     */
    const handlePageEnter = (entries, observer) => {
        for (let i = 0, l = entries.length; i < l; i++) {
            const entry = entries[i];
            if (entry.isIntersecting && (
                entry.boundingClientRect.top > entry.rootBounds.top ||
                entry.boundingClientRect.bottom < entry.rootBounds.bottom
            )) {
                /**@type {HTMLDivElement} */
                const el = entry.target;
                setObservedEl(el);
                const pg = el.getAttribute('data-page');
                props.onChangePage(undefined, pg, true);
                break;
            }
        }
    }

    const [observer] = useState(
        new IntersectionObserver(handlePageEnter, { threshold: .1 })
    );


    useEffect(() => {
        if (!props.chapter) return;
        /**@type {HTMLDivElement} */
        const imgBox = imgBoxRef.current;
        if (!imgBox) return;
        if (
            props.readerSettings.displayMode === 'all' ||
            props.readerSettings.displayMode === 'webcomic'
        ) {
            const pg = imgBox.querySelector(`#page-${props.currentPage}`);
            if (!pg) return;
            if (observedEl?.id === `page-${props.currentPage}`) return;
            pg.scrollIntoView();
        }
    }, [props.currentPage, props.readerSettings.displayMode, imgBoxRef.current, props.chapter]);

    /**@param {import('react').SyntheticEvent} e */
    const handlePageNav = e => {
        let skipNum = 1, dir = 1;
        if (e.nativeEvent instanceof KeyboardEvent) {
            if (e.code === 'ArrowRight') {
                dir = 1;
            } else if (e.code === 'ArrowLeft') {
                dir = -1;
            } else {
                return;
            }
        } else {
            return;
        }

        if (props.readerSettings.readingDir == 'left') {
            dir *= -1;
        }

        /**@type {HTMLDivElement} */
        const imgBox = imgBoxRef.current;
        if (
            props.readerSettings.displayMode !== 'all' &&
            props.readerSettings.displayMode !== 'webcomic' &&
            imgBox
        ) {
            imgBox.style.scrollBehavior = 'unset';
            if (dir > 0) {
                imgBox.scrollTo(0, 0);
            } else {
                imgBox.scrollTo(0, imgBox.scrollHeight);
            }
            window.setTimeout(() => {
                imgBox.style.scrollBehavior = 'smooth';
            }, 0)
        }
        const newPage = Number(props.currentPage) + (dir * skipNum)
        props.onChangePage(e, newPage);
    }

    /**@param {import('react').SyntheticEvent} e */
    const handlePageScroll = e => {
        let dist = props.readerSettings.arrowScrollSize;
        if (e.nativeEvent instanceof KeyboardEvent) {
            if (e.code === 'ArrowUp') {
                dist *= -1;
            } else if (e.code === 'ArrowDown') {
                dist *= 1
            } else {
                return;
            }
        } else {
            return;
        }
        /**@type {HTMLDivElement} */
        const container = e.target;
        if(container.scrollTop === 0 && dist < 0) return;
        if(container.scrollTop === container.scrollHeight && dist > 0) return;
        window.setTimeout(() => {
            container.scrollBy(0, dist);
        }, 0);
    }

    /**@param {KeyboardEvent} e */
    const handleKeyPress = e => {
        handlePageNav(e);
        handlePageScroll(e);
    }

    const preload = () => {
        if (props.fetcing || !props.chapter) {
            return;
        }
        // If at end of chapter, preload next chapter
        const l = props.readerSettings.preloadPages;
        for (let i = 0; i < l; i++) {
            const img = new Image();
            img.src = props.chapter.pages[i + props.currentPage];
            prePg.current[i] = img;
        }
    }

    const getPageImages = () => {
        if (props.fetcing || !props.chapter) {
            return <Skeleton variant='rect' />;
        }
        if (props.readerSettings.displayMode === 'single') {
            preload();
            return <img
                id={`page-${props.currentPage}`} data-page={props.currentPage}
                src={props.chapter.pages[props.currentPage]}
                alt={`page ${props.currentPage}`}
            />
        }
        if (props.readerSettings.displayMode === 'double') {
            preload();
            let pg1, pg2;
            if (!props.currentPage % 2) {
                pg1 = props.currentPage;
                pg2 = props.currentPage + 1;
            } else {
                pg1 = props.currentPage - 1;
                pg2 = props.currentPage;
            }

            if (props.readerSettings.readingDir == 'left') {
                const tmp = pg1;
                pg1 = pg2;
                pg2 = tmp;
            }

            return <>
                <img
                    id={`page-${pg1}`} data-page={pg1} alt={`page ${pg1}`}
                    src={props.chapter.pages[pg1]}
                />
                <img
                    id={`page-${pg2}`} data-page={pg2} alt={`page ${pg2}`}
                    src={props.chapter.pages[pg2]}
                />
            </>
        }
        return props.chapter.pages.map((p, idx) =>
            <img
                key={p} id={`page-${idx}`} src={p} alt={`page ${idx}`}
                data-page={idx} ref={el => el && observer.observe(el)}
            />
        )
    }

    const setPaneRefs = ref => {
        imgBoxRef.current = ref;
        props.readingPaneRef.current = ref;
    }

    return (
        <Wrapper
            data-image-size={props.readerSettings.imageSize}
            data-display-mode={props.readerSettings.displayMode}
            onKeyDown={handleKeyPress} tabIndex='0' autoFocus
            ref={setPaneRefs}
        >
            {getPageImages()}
        </Wrapper>
    )
}



const Wrapper = styled.div`
    width: 100%;
    max-width: 100%;
    display: grid;
    justify-items: center;
    margin: 0 auto;
    overflow: auto;
    height: 100%;
    scroll-behavior: smooth;
    /* transition: width 50ms ease-out 0ms; */
    gap: 2rem;
    ${p => {
        switch (p['data-display-mode']) {
            case 'double': return css`
                grid-template-columns: auto auto;
                align-items: center;
            `;
            case 'webcomic': return css`
                gap: 0;
            `;
        }
    }}

    .MuiSkeleton-root {
        width: 90%;
        height: 100%;
    }
    img {
        display: grid;
        justify-content: center;
        width: auto;
        height: auto;
        ${p => {
        switch (p['data-image-size']) {
            case 'fit-width': return css`
                max-width: 100%;
            `;
            case 'fit-height': return css`
                    max-height: 100vh;
            `;
        }
    }}
    }
`;




ReadingPane.defaultProps = {
    readerSettings: {
        displayMode: 'all',
        imageSize: 'fit-width',
        arrowScrollSize: 420,
        preloadPages: 5,
    },
}

ReadingPane.propTypes = {
    chapter: PropTypes.object,
    currentPage: PropTypes.number,
    readerSettings: PropTypes.shape({
        displayMode: PropTypes.string,
        imageSize: PropTypes.string,
        arrowScrollSize: PropTypes.number,
        preloadPages: PropTypes.number,
    }),
    readingPaneRef: PropTypes.object,
}

export default ReadingPane;

