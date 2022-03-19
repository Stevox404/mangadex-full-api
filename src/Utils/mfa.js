/**
 * @todo Add more resolution items e.g. covers etc. so as to standardize at this point
 */


import {
    Manga, Chapter, Author, Cover, Group, User
} from "mangadex-full-api";

import {standardize} from './index';

export async function resolveChapter(chapter, resolutionItems) {
    const reqs = ['manga', 'groups', 'uploader'];
    if (typeof chapter === 'string') {
        chapter = await Chapter.get(chapter);
    } else if (!isMfaObject(chapter, reqs)) {
        chapter = await Chapter.get(chapter.id);
    }
    // todo
    // const _ch = standardize(chapter);
    const _ch = chapter;
    const res = await resolveEntity(_ch, resolutionItems, reqs);
    return res;
}

export async function resolveManga(manga, resolutionItems) {
    const reqs = ['mainCover', 'authors', 'artists'];
    if (typeof manga === 'string') {
        manga = await Manga.get(manga);
    } else if (!isMfaObject(manga, reqs)) {
        manga = await Manga.get(manga.id);
    }
    // todo
    // const _manga = standardize(manga);
    const _manga = manga;
    const res = await resolveEntity(_manga, resolutionItems, reqs);
    return res;
}

function isMfaObject(entity, keys) {
    for (let key of keys) {
        if (!entity[key] || typeof entity[key].resolve !== 'function') return false;
    }
    return true;
}

async function resolveEntity(entity, resolutionItems, srcKeys) {
    const promises = [];
    srcKeys.forEach(key => {
        if (shouldResolve(key)) {
            const item = entity[key];

            if (Array.isArray(item)) {
                promises.push(Promise.allSettled(item.map(resolveItem)));
            } else {
                promises.push(resolveItem(item));
            }
            entity[key] = promises.length - 1;
        }
    });
    const resolved = await Promise.allSettled(promises);
    srcKeys.forEach(key => {
        if (shouldResolve(key)) {
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

    function shouldResolve(item) {
        return typeof resolutionItems === 'object' && resolutionItems[item] !== undefined ?
            resolutionItems[item] : true;
    }

    function resolveItem(item) {
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