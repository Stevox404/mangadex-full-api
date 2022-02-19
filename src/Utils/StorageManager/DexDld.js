import Dexie from "dexie";
import moment from "moment";
import { resolveChapter, resolveManga } from "Utils/mfa";

const db = new Dexie("_dld");
db.version(1).stores({
    _dld_manga: 'id',
    _dld_chapter: 'id',
    _dld_page: 'url',
});

export const DexDld = db._dld_page.defineClass({
    chapter: Object,
    url: String,
});

DexDld.prototype.save = function () {
    return new Promise(async (resolve) => {
        if (!this.chapter) throw new Error('Save Failed. Record has no chapter.');
        if (!this.url) throw new Error('Save Failed. Record has no url.');
        this.date = new Date();
        this.chapterId = this.chapter.id;
        
        // @todo cache this check
        var ch = await db._dld_chapter.get(this.chapterId);
        if (!ch) await saveChapter(this.chapter);

        delete this.chapter;

        const image = new Image();
        image.src = this.url;
        image.onload = async e => {
            this.image = image;
            await db._dld_page.put(this);
            resolve();
        };
        image.onerror = e => {
            this.error = true;
            await db._dld_page.put(this);
            resolve();
        };
    });
}

DexDld.getChapter = function () { }

DexDld.getManga = function () { }




/* Private */

async function saveChapter(chapter) {
    var manga = await db._dld_manga.get(chapter.manga.id);
    if (!manga) {
        const _manga = resolveManga(chapter.manga);
        await db._dld_manga.put(_manga);
    }
    const _chapter = resolveChapter(chapter, {manga: false});
    _chapter.mangaId = chapter.manga.id;
    delete chapter.manga;
    await db._dld_chapter.put(_chapter);
}