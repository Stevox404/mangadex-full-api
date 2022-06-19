import React, { useCallback, useEffect, useRef } from 'react';
import loadingGif from 'Assets/images/loading.gif';
import manga404 from 'Assets/images/manga-404.jpg';

function Img(props, fwRef) {
    const imgRef = useRef(null);

    const setRefs = useCallback((el) => {
        imgRef.current = el;
        if (fwRef) fwRef.current = el;
    }, [])


    useEffect(() => {
        /**@type {HTMLImageElement} */
        const el = imgRef.current;
        if (!el) return;

        el.onerror = _ => {
            el.src = manga404;
            el['data-object-fit'] = el.style.objectFit;
            el.style.objectFit = 'contain';
        }
        return _ => {
            el.onerror = undefined;
        }
    }, []);

    useEffect(() => {
        /**@type {HTMLImageElement} */
        const el = imgRef.current;
        if (!el || !el.src) return;

        let timer = null;
        el.addEventListener('mousedown', setTimeout);
        el.addEventListener('mouseup', clearTimeout);
        el.addEventListener('touchstart', setTimeout);
        el.addEventListener('touchend', clearTimeout);
        return () => {
            clearTimeout();
            el.removeEventListener('mousedown', setTimeout);
            el.removeEventListener('mouseup', clearTimeout);
            el.removeEventListener('touchstart', setTimeout);
            el.removeEventListener('touchend', clearTimeout);
        }
        function setTimeout(ev) {
            timer = window.setTimeout(() => {
                ev.preventDefault();
                ev.stopPropagation();
                reloadImage();
            }, 1000);
        }
        function clearTimeout(ev) {
            if (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            window.clearTimeout(timer);
        }
        function reloadImage() {
            const src = (el['data-src'] || el.src).replace(/#.*$/, '') + `#${Date.now()}`;
            el['data-src'] = src;

            const resetFn = mutStyleResetFn(el);
            el.src = loadingGif;

            const img = new Image();
            img.src = el['data-src'] || el.src;
            img.onload = e => {
                window.setTimeout(() => {
                    resetFn();
                    el.src = e.target.src;
                }, 2000);
            }
            img.onerror = e => {
                resetFn();
                el.src = manga404;
                el.style.objectFit = 'contain';
            }

            function mutStyleResetFn(el) {
                const ogStyle = {
                    width: el.style.width,
                    height: el.style.height,
                    objectFit: el.style.objectFit,
                    backgroundColor: el.style.backgroundColor,
                }
                el.style.width = ogStyle.width || el.width + 'px';
                el.style.height = ogStyle.height || el.height + 'px';
                el.style.objectFit = el['data-object-fit'] || 'contain';
                el.style.backgroundColor = '#ffffff';
                return () => {
                    el.style.width = ogStyle.width;
                    el.style.height = ogStyle.height;
                    el.style.objectFit = ogStyle.objectFit;
                    el.style.backgroundColor = ogStyle.backgroundColor;
                }
            }
        }
    }, [imgRef?.current])


    return (
        <img
            {...props}
            ref={setRefs}
            // ref={(el)=> {imgRef.current = el; fwRef.current = el;}}
        />
    )
}

export default React.forwardRef(Img);