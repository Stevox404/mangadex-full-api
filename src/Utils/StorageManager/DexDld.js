import Dexie from "dexie";
import { Chapter, Manga } from "Libraries/mfa/src/index";
import { Deferred } from "Utils";
import { resolveChapter, resolveManga } from "Utils/mfa";


const db = new Dexie("_dld");
db.version(1).stores({
    _dld_manga: 'id',
    _dld_chapter: 'id',
    _dld_page: 'url,chapterId',
});

db._dld_chapter.toArray().then(v => {
    _downloadedList.push(...v);
});

const _downloadQueue = [];
const _downloadedList = [];
let _downloading = false;
/**@type {ChapterDl} */
let _current = null;


const handler = {
    get(target, key) {
        const val = target[key];
        if (typeof val === 'object') {
            return new Proxy(val, handler);
        } else return val;
    }
}


export class ChapterDl extends EventTarget {
    /**
     * @param {Chapter} chapter 
     */
    constructor(chapter) {
        super();
        this.id = chapter.id;
        this.chapter = chapter;
    }

    #index = null;

    get index() {
        return this.#index;
    }

    /**
     * @return {number} Index in the downloadQueue
     */
    addToQueue() {
        const idx = _downloadQueue.push(this);
        this.#index = idx;
        ChapterDl.beginDownload();
        return this.#index;
    }

    /**
     * @return {number} New size of download queue
     */
    removeFromQueue() {
        if (this.#index == null) throw new Error('Not in queue');
        _downloadQueue.splice(this.#index, 1);
        return _downloadQueue.length;
    }

    /**
     * Deletes chapter from queue (as well as any progress if currently downloading)
     */
    cancel() {
        if (this.#index == null) throw new Error('Not in queue');
    }

    /**
     * Moves the chapter higher in the download queue (lower index)
     */
    moveUp() {
        if (this.#index == null) throw new Error('Not in queue');

        const idx = this.#index;
        if (idx === 0) return 0;
        const cDl = _downloadQueue.splice(idx, 1);
        _downloadQueue.splice(idx - 1, 0, cDl);
        return idx - 1;
    }

    /**
     * Moves the chapter lower in the download queue (higher index)
     */
    moveDown() {
        if (this.#index == null) throw new Error('Not in queue');

        const idx = this.#index;
        if (idx === _downloadQueue.length - 1) return _downloadQueue.length - 1;
        const cDl = _downloadQueue.splice(idx, 1);
        _downloadQueue.splice(idx + 1, 0, cDl);
        return idx + 1;
    }

    /**
     * Moves the chapter to the top of the download queue (will be downloaded first)
     */
    moveToTop() {
        if (this.#index == null) throw new Error('Not in queue');

        const idx = this.#index;
        if (idx === 0) return 0;
        const cDl = _downloadQueue.splice(idx, 1);
        _downloadQueue.splice(0, 0, cDl);
        return 0;
    }

    /**
     * Moves the chapter to the bottom of the download queue (will be downloaded last)
     */
    moveToTop() {
        if (this.#index == null) throw new Error('Not in queue');

        const idx = this.#index;
        const last = _downloadQueue.length - 1;
        if (idx === last) return last;
        const cDl = _downloadQueue.splice(idx, 1);
        _downloadQueue.splice(last, 0, cDl);
        return last;
    }

    getChapterDownloadState() {
        return ChapterDl.getChapterDownloadState(this.chapter.id);
    }

    async cancel() {
        await ChapterDl.cancelDownload(this.chapter.id);
    }

    async delete() {
        await ChapterDl.deleteChapter(this.chapter.id);
    }



    static requestCancelDownload = () => { };

    /**
     * @return {Chapter[]} A read-only array of chapter objects
     */
    static get queue() {
        return new Proxy(_downloadQueue, handler);
    }

    /**
     * To be called at start of application. Fetches download queue from local
     * storage and begins processing. Is idempotent.
     * 
     * @returns {string|null} The id of the chapter being downloaded
     */
    static beginDownload() {
        if (!_downloading) {
            _downloading = true;
            _downloadNextInQueue();
        }
        return _current?.chapter.id;
    }

    /**
     * Pause the download process
     */
    static pause() {
        _downloading = false;
    }

    /**
     * Resumes the download process.
     * Not `beginDownload()`
     */
    static resume() {
        ChapterDl.beginDownload();
    }

    static downloadStates = {
        DOWNLOADED: Symbol('DOWNLOADED'),
        NOT_DOWNLOADED: Symbol('NOT_DOWNLOADED'),
        PENDING: Symbol('PENDING'),
        DOWNLOADING: Symbol('DOWNLOADING'),
    }

    /**
     * Get the download status of the chapter
     * @param {string} chapterId 
     */
    static getChapterDownloadState(chapterId) {
        if (_downloadedList.some(ch => ch.id == chapterId)) {
            return ChapterDl.downloadStates.DOWNLOADED;
        } else if (_current?.chapter.id == chapterId) {
            return ChapterDl.downloadStates.DOWNLOADING;
        } else if (_downloadQueue.some(ch => ch.id == chapterId)) {
            return ChapterDl.downloadStates.PENDING;
        } else {
            return ChapterDl.downloadStates.NOT_DOWNLOADED;
        }
    }

    /**
     * Get downloaded manga details
     * @param {string?} id 
     * @returns {Promise<Manga|Manga[]>}
     */
    static getManga(id) {
        if (id) {
            return db._dld_manga.get(id);
        } else {
            return db._dld_manga.toArray();
        }
    }

    /**
     * Get downloaded manga chapter
     * @param {string} id 
     * @returns {Promise<Chapter>}
     */
    static async getChapter(id) {
        const chapter = await db._dld_chapter.get(id);
        const manga = await db._dld_manga.get(chapter.mangaId);
        const pages = await db._dld_page;
        return ({
            ...chapter,
            manga,
            pages
        });
    }

    static async cancelDownload(id) {
        const idx = _downloadQueue.findIndex(ch => ch.id == id);
        if (idx > -1) {
            _downloadQueue.splice(idx, 1);
            return true;
        } else {
            await ChapterDl.requestCancelDownload();
            return true;
        }
    }

    static async deleteChapter(id) {
        await db._dld_page.where('chapterId').equals(id).delete();
        return db._dld_chapter.delete(id);
    }

}







/* Private */

const DexPage = db._dld_page.defineClass({
    chapter: Object,
    url: String,
    pageNum: Number,
});

DexPage.prototype.download = function () {
    if (!_downloading) return;

    return new Promise(async (resolve, reject) => {
        try {
            if (!this.chapter) throw new Error('Save Failed. Record has no chapter.');
            if (!this.url) throw new Error('Save Failed. Record has no url.');

            this.date = new Date();
            this.chapterId = this.chapter.id;
            var chapter = this.chapter;

            // @todo cache this check
            var ch = await db._dld_chapter.get(this.chapterId);
            if (!ch) await _saveChapterDetails(this.chapter);

            const totalPages = chapter.pageUrls.length;

            delete this.chapter;

            // Use fetch instead of img to get the blob, helper func
            fetch(this.url).then(function (response) {
                return response.blob();
            }).then(async blob => {
                this.imageBlob = blob;
                await db._dld_page.put(this);

                const progressEvent = new CustomEvent('start', {
                    detail: {
                        chapter,
                        page: this.pageNum,
                        total: totalPages,
                    }
                });
                _current.dispatchEvent(progressEvent);
                ChapterDl.emit("progress", {
                    chapter: ch
                });
                resolve();
                // myImage.src = URL.createObjectURL(blob);
            }).catch(async err => {
                this.error = true;
                await db._dld_page.put(this);

                const progressEvent = new CustomEvent('start', {
                    detail: {
                        chapter,
                        page: this.pageNum,
                        total: totalPages,
                        error: err,
                        hasError: true,
                    }
                });
                _current.dispatchEvent(progressEvent);
                resolve();
            });
        } catch (err) {
            reject(err);
        }
    });
}




async function _saveChapterDetails(chapter) {
    const id = chapter.mangaId || chapter.manga?.id;
    if (!id) throw new Error('Chapter has no manga');

    let manga = await db._dld_manga.get(id);
    if (!manga) {
        const _manga = await resolveManga(chapter.manga);
        manga = _manga;
        await db._dld_manga.put(_manga);
    }
    const _chapter = await resolveChapter(chapter, {
        manga: false,
    });
    _chapter.mangaId = manga.id;
    delete chapter.manga;
    await db._dld_chapter.put(_chapter);
}

function _downloadNextInQueue() {
    if (!_downloading) return;

    const cDl = _downloadQueue[0];
    if (cDl) {
        _downloadChapter(cDl);
    } else {
        _downloading = false;
    }
}

/**
 * @param {ChapterDl} cDl 
 */
async function _downloadChapter(cDl) {
    _current = cDl;
    let chapter = await resolveChapter(cDl.chapter, {
        pageUrls: true
    });

    const startEvent = new CustomEvent('start', {
        detail: {
            chapter
        }
    });
    cDl.dispatchEvent(startEvent);

    let isDownloadCancelled = false;
    ChapterDl.requestCancelDownload = () => {
        isDownloadCancelled = new Deferred();
    }

    const pages = chapter.pageUrls;
    for (const pg of pages) {
        if (isDownloadCancelled) break;

        const page = new DexPage();
        page.chapter = chapter;
        page.url = pg;
        try {
            await page.download();
        } catch (err) {
            console.error(err);
        }
    }

    if (isDownloadCancelled) {
        await ChapterDl.deleteChapter(chapter.id);
        isDownloadCancelled.resolve();
        ChapterDl.requestCancelDownload = () => { };
    } else {
        const endEvent = new CustomEvent('end', {
            detail: {
                chapter
            }
        });
        cDl.dispatchEvent(endEvent);
    }




    const pCDl = _downloadQueue[0];
    if (pCDl === _current) {
        _downloadQueue.shift();
    } else {
        const idx = _downloadQueue.indexOf(cDl);
        _downloadQueue.splice(idx, 1);
    }

    _downloadNextInQueue();
}