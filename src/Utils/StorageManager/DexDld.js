import Dexie from "dexie";
import { Manga, Chapter } from "Libraries/mfa/src/index";
import { resolveChapter, resolveManga } from "Utils/mfa";


const db = new Dexie("_dld");
db.version(1).stores({
    _dld_manga: 'id',
    _dld_chapter: 'id',
    _dld_page: 'url',
});


const _downloadQueue = [];
let _downloading = false;
let _current = null;


const handler = {
    get(target, key) {
        const val = target[key];
        if (typeof val === 'object') {
            return new Proxy(val, handler);
        } else return val;
    }
}


export class DexDld {
    /**
     * @param {Chapter} chapter 
     */
    constructor(chapter) {
        this.chapter = chapter;
    }

    #index = null;

    /**
     * @return {Chapter[]} A read-only array of chapter objects
     */
    get queue() {
        return new Proxy(_downloadQueue, handler);
    }

    get index() {
        return this.#index;
    }

    /**
     * @param {Chapter} chapter 
     * @return {number} Index in the downloadQueue
     */
    addToQueue() {
        const idx = _downloadQueue.push(this.chapter);
        this.#index = idx;
        return this.#index;
    }

    /**
     * @param {number} idx 
     * @return {number} New size of download queue
     */
    removeFromQueue() {
        if (this.#index == null) throw new Error('Not in queue');
        _downloadQueue.splice(idx, 1);
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
        const ch = _downloadQueue.splice(idx, 1);
        _downloadQueue.splice(idx - 1, 0, ch);
        return idx - 1;
    }

    /**
     * Moves the chapter lower in the download queue (higher index)
     */
    moveDown() {
        if (this.#index == null) throw new Error('Not in queue');

        const idx = this.#index;
        if (idx === _downloadQueue.length - 1) return _downloadQueue.length - 1;
        const ch = _downloadQueue.splice(idx, 1);
        _downloadQueue.splice(idx + 1, 0, ch);
        return idx + 1;
    }

    /**
     * Moves the chapter to the top of the download queue (will be downloaded first)
     */
    moveToTop() {
        if (this.#index == null) throw new Error('Not in queue');

        const idx = this.#index;
        if (idx === 0) return 0;
        const ch = _downloadQueue.splice(idx, 1);
        _downloadQueue.splice(0, 0, ch);
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
        const ch = _downloadQueue.splice(idx, 1);
        _downloadQueue.splice(last, 0, ch);
        return last;
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
        return _current?.id;
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
        DexDld.beginDownload();
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

}







/* Private */

const DexPage = db._dld_page.defineClass({
    chapter: Object,
    url: String,
});

DexPage.prototype.download = function() {
    if (!_downloading) return;

    return new Promise(async (resolve) => {
        if (!this.chapter) throw new Error('Save Failed. Record has no chapter.');
        if (!this.url) throw new Error('Save Failed. Record has no url.');
        
        this.date = new Date();
        this.chapterId = this.chapter.id;

        // @todo cache this check
        var ch = await db._dld_chapter.get(this.chapterId);
        if (!ch) await _saveChapterDetails(this.chapter);

        delete this.chapter;

        const image = new Image();
        image.src = this.url;
        image.onload = async e => {
            this.image = image;
            await db._dld_page.put(this);
            resolve();
        };
        image.onerror = async e => {
            this.error = true;
            await db._dld_page.put(this);
            resolve();
        };
    });
}




async function _saveChapterDetails(chapter) {
    var manga = await db._dld_manga.get(chapter.manga.id);
    if (!manga) {
        const _manga = resolveManga(chapter.manga);
        await db._dld_manga.put(_manga);
    }
    const _chapter = resolveChapter(chapter, { manga: false });
    _chapter.mangaId = chapter.manga.id;
    delete chapter.manga;
    await db._dld_chapter.put(_chapter);
}

function _downloadNextInQueue() {
    if (!_downloading) return;

    const ch = _downloadQueue[0];
    if (ch) {
        _downloadChapter(ch);
    } else {
        _downloading = false;
    }
}

async function _downloadChapter(chapter) {
    _current = chapter;

    const promises = chapter.pages.map(pg => {
        const page = new DexPage();
        page.chapter = chapter;
        page.url = pg;
        return page.download();
    });
    await Promise.allSettled(promises);
    const ch = _downloadQueue[0];
    if (ch === _current) {
        _downloadQueue.shift();
    } else {
        const idx = _downloadQueue.findIndex(dCh => dCh.id === ch.id);
        _downloadQueue.splice(idx, 1);
    }
    
    _downloadNextInQueue();
}