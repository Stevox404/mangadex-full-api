// TODO

/**
 * @param {import('mangadex-full-api').Chapter} chapter
 */
const resolveChapter = (
    chapter, items = { 
        manga: true, groups: true, uploader: true 
    }, errorCb
) => {
    return new Promise(async (resolve) => {
        const [mangaPr, uploaderPr, ...groupsPr] = await Promise.allSettled([
            chapter.manga.resolve(),
            chapter.uploader.resolve(),
            ...chapter.groups(g => g.resolve())
        ]);

        if (mangaPr.status === 'fulfilled') {
            let manga = mangaPr.value;
            manga.mainCover = await manga.mainCover.resolve();
            chapter.manga = manga;
        }

        chapter.groups = [];
        if (groupsPr.status === 'fulfilled') {
            chapter.groups = [groupsPr.value];
        }

        if (uploaderPr.status === 'fulfilled') {
            chapter.uploader = uploaderPr.value;
        }

        resolve(chapter);
    })
}