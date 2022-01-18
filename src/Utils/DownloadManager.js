import { Chapter, Cover, Manga } from 'mangadex-full-api';
import { getStorage, storageKeys, storageTypes } from './StorageManager';
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
    let q = getStorage(storageTypes.CONFIGS).getItem(storageKeys.DOWNLOAD_QUEUE);
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
                savePr.push(getImageDataUrl(ch, pg))
            }
            const saveRes = await Promise.allSettled(savePr);
            /**@type {import('mangadex-full-api').Manga} */
            const manga = await ch.manga.resolve();
            /**@type {import('mangadex-full-api').Cover} */
            const cover = getImageDataUrl(await manga.mainCover.resolve());
            const dexCover = await getImageDataUrl(cover.image512);
            /**@type {import('mangadex-full-api').Author} */
            const author = await manga.authors[0].resolve();
            const dexPages = saveRes.map(res => res.value);
            let dIds = [];
            try {
                dIds = JSON.parse(getStorage(storageTypes.CONFIGS).getItem(storageKeys.DOWNLOADED_MANGA_IDS));
            } catch (err) { }
            dIds.push(ch.id);
            const store = getStorage(storageTypes.BLOBS).getItem(ch.id);
            /**@type {import('mangadex-full-api').Manga} */
            const manga;
            getStorage(storageTypes.BLOBS).setItem(ch.id, {
                title: ch.manga,
                mainCover: dexCover,
                // downloadedChaptersNum,
                authorName: author.name,
                genres,
                description,
                chapterNameText,
                groupName,
                updateDate,
                dexPages
            });
            store
            


        } else {/**Chapter not on mangadex */}
        downloadQueue.shift();
        updateQueueInLocalStorage();
    }

    function getImageDataUrl(imgUrl){
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imgUrl;
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