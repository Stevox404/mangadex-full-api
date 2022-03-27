/**
 * @todo Add more resolution items e.g. covers etc. so as to standardize at this point
 */


import {
    Manga, Chapter, Author, Cover, Group, User
} from "mangadex-full-api";

import { standardize } from './index';
import { DexCache } from "./StorageManager/DexCache";

export async function resolveChapter(chapter, resolutionItems) {
    const reqs = {
        manga: true,
        groups: true,
        uploader: true
    };
    if (typeof chapter === 'string') {
        chapter = await Chapter.get(chapter);
    } else if (!isMfaObject(chapter, reqs)) {
        chapter = await Chapter.get(chapter.id);
    }
    // todo
    // const _ch = standardize(chapter);
    const _ch = chapter;
    const res = await resolveEntity(_ch, resolutionItems, reqs);
    return standardize(res);
}

export async function resolveManga(manga, resolutionItems) {
    const reqs = {
        mainCover: true,
        statistics: true,
        authors: false,
        artists: false,
        aggregate: false,
        covers: false,
        readChapterIds: false,
        readingStatus: false,
    };
    if (typeof manga === 'string') {
        manga = await Manga.get(manga);
    } else if (!isMfaObject(manga, reqs)) {
        manga = await Manga.get(manga.id);
    }
    // todo
    // const _manga = standardize(manga);
    const _manga = manga;
    const res = await resolveEntity(_manga, resolutionItems, reqs);
    if (shouldResolve('aggregate', resolutionItems, reqs)) {
        let ct = 0;
        for (let volName of Object.keys(res.aggregate)) {
            const vol = res.aggregate[volName];
            ct += Object.keys(vol.chapters).length;
        }
        res.chapterCount = ct;
        res.volumeCount = Object.keys(res.aggregate).length;
    }

    if (shouldResolve('statistics', resolutionItems, reqs)) {
        res.follows = res.statistics.follows;
        res.rating = res.statistics.rating.average;        
    }

    return standardize(res);
}

function isMfaObject(entity, reqs) {
    for (let key of Object.keys(reqs)) {
        if (!reqs[key]) continue;
        if (!entity[key] || typeof entity[key].resolve !== 'function') return false;
    }
    return true;
}

async function resolveEntity(entity, resolutionItems, reqs) {
    const promises = [];
    const srcKeys = Object.keys(reqs);
    srcKeys.forEach(key => {
        if (shouldResolve(key, resolutionItems, reqs)) {
            const item = entity[key];

            if (Array.isArray(item)) {
                promises.push(Promise.allSettled(item.map(i => resolveItem(i, { entity, key }))));
            } else {
                promises.push(resolveItem(item, { entity, key }));
            }
            entity[key] = promises.length - 1;
        }
    });
    const resolved = await Promise.allSettled(promises);
    srcKeys.forEach(key => {
        if (shouldResolve(key, resolutionItems, reqs)) {
            const res = resolved[entity[key]];
            if (res.status === 'rejected' || !res.value) {
                return entity[key] = null;
            }

            var itemVal = res.value;
            if (Array.isArray(itemVal)) {
                entity[key] = itemVal.map(i => i.value);
            } else {
                entity[key] = itemVal;
            }
        }
    });

    return entity;


    function resolveItem(item, { entity, key }) {
        switch (key) {
            case 'aggregate':
                return Manga.getAggregate(entity.id);
            case 'statistics':
                return Manga.getStatistics(entity.id);
            case 'covers':
                return Manga.getCovers(entity.id);
            case 'readChapterIds': {
                return new Promise(async (resolve, reject) => {
                    try {
                        const readCache = new DexCache();
                        readCache.name = 'manga-readership';
                        let readership = await readCache.fetch();
                        if (!readership || readCache.getMeta('mangaId') !== entity.id) {
                            readership = await Manga.getReadChapterIds(entity.id);
                            readership = readership.reduce((agg, chId) => {
                                agg[chId] = true
                                return agg;
                            }, {});
                            readCache.data = readership;
                            readCache.setMeta('mangaId', entity.id);
                            readCache.save();
                        }
                        resolve(readership);
                    } catch (err) {
                        reject(err);
                    }
                });
            }
            case 'readingStatus':
                return Manga.getReadingStatus(entity.id);
        }


        if (!item) {
            return Promise.resolve(item);
        } else if (!item.id) {
            throw new Error('Cannot resolve property without id');
        } else if (!item.type) {
            return Promise.resolve(item);
        } else {
            switch (item.type) {
                case 'artist':
                case 'author':
                    return Author.get(item.id);
                case 'cover_art':
                    return Cover.get(item.id);
                case 'scanlation_group':
                    return Group.get(item.id);
                case 'manga':
                    return Manga.get(item.id);
                case 'user':
                    return User.get(item.id);
            }
        }
    }
}

function shouldResolve(key, resolutionItems, reqs) {
    const def = reqs[key];
    return typeof resolutionItems === 'object' && resolutionItems[key] !== undefined ?
        resolutionItems[key] : def;
}