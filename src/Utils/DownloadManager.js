import { Chapter } from 'mangadex-full-api';
/**
 * @type {import('mangadex-full-api').Chapter[]}
 */
const downloadQueue = [];

/**
 * To be called at start of application. Fetches download queue from local
 * storage and begins processing. Is idempotent.
 */
export function beginDownload() {
    if (downloadQueue.length) return;
    let q = window.localStorage.getItem('dexumiDownloadQueue')
    if (q) q = JSON.parse(q);
    downloadQueue.push(...q);
    for (let ch of downloadQueue) {
        if (!ch.isExternal) {
            if (!ch.getReadablePages) {
                ch = await Chapter.get(ch.id);
            }
            /**@TODO get cover as well  */
            /**@TODO handle datasaver mode  */
            const savePr = [];
            for(let pg of await ch.getReadablePages()){
                savePr.push(getChapterPageDataUrl(ch, pg))
            }
            const saveRes = await Promise.allSettled(savePr);
        } else {/**Chapter not on mangadex */}
        downloadQueue.shift();
        updateQueueInLocalStorage();
    }

    function getChapterPageDataUrl(chapter, pageUrl){
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = pageUrl;
            img.crossOrigin = 'anonymous';
            img.addEventListener('load', function () {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = this.width;
                canvas.height = this.height;
                context.drawImage(this, 0, 0, this.width, this.height);
                /** @todo web db allows blobs so maybe no encoding/decoding? */
                const dataUrl = canvas.toDataURL('image/png');
                resolve(dataUrl);
            });
            img.addEventListener('error', function (ev) {
                reject(ev.error);
            });
        });
    }
}

/**
 * @param {import('mangadex-full-api').Chapter} chapter 
 * @return {boolean} Success
 */
export function addChapterToDownloadQueue(chapter) {

    return false;
}

/**
 * @return {import('mangadex-full-api').Chapter[]} An array of chapter objects
 *  with some extra properties
 */
export function getDownloadQueue() {
    return [];
}

/**
 * @param {string} chapterId 
 * @return {boolean} Success
 */
export function removeChapterFromDownloadQueue(chapterId) {
    return false;
}

/**
 * @param {string} chapterId
 * @param {number} newIndex
 * @return {boolean} Success
 */
export function reorderDownloadQueue(chapterId, newIndex) {
    return false;
}


function updateQueueInLocalStorage() {
    window.localStorage.setItem('dexumiDownloadQueue', JSON.stringify(downloadQueue));
}