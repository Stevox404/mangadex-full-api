import { DexDld } from './StorageManager/DexDld';


/**
 * @type {import('mangadex-full-api').Chapter[]}
 */
const downloadQueue = [];
let downloading = false;

/**
 * To be called at start of application. Fetches download queue from local
 * storage and begins processing. Is idempotent.
 */
export function beginDownload() {
    if (downloading) return;
    _downloadNextInQueue();
}

/**
 * @param {import('mangadex-full-api').Chapter} chapter 
 * @return {number} Index in the downloadQueue
 */
export function addChapterToDownloadQueue(chapter) {
    return downloadQueue.push(chapter);
}

/**
 * @return {import('mangadex-full-api').Chapter[]} An array of chapter objects
 *  with some extra properties
 * @todo return immutable reference, Proxy?
 */
export function getDownloadQueue() {
    return downloadQueue;
}

/**
 * @param {number} idx 
 * @return {number} New size of download queue
 */
export function removeChapterFromDownloadQueue(idx) {
    downloadQueue.splice(idx);
    return downloadQueue.length;
}






/** Private **/

function _downloadNextInQueue() {
    const ch = downloadQueue[0];
    if (ch) {
        _downloadChapter(ch);
    } else {
        downloading = false;
    }
}


async function _downloadChapter(chapter) {
    const promises = chapter.pages.map(async pg => {
        const db = new DexDld();
        db.url = pg;
        db.chapter = chapter;
        await db.save();
        // @todo update progressbar
    });
    await Promise.allSettled(promises);
    downloadQueue.shift();
    _downloadNextInQueue();
}