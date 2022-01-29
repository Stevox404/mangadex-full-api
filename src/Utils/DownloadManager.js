/**
 * @type {import('mangadex-full-api').Chapter[]}
 */
const downloadQueue = [];

/**
 * To be called at start of application. Fetches download queue from local
 * storage and begins processing. Is idempotent.
 */
export function beginDownload() { }

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