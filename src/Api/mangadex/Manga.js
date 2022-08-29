import { xFetch } from "Libraries/flitlib";
import { DEFAULT_LANG, MANGADEX_BASEURL } from "./Constants";
import { UrlBuilder } from "./Network";

export class Manga {
    constructor(args) {
        if (typeof args === 'string') {
            this.id = args;
        } else if (typeof args === 'object') {
            this.#apply(args);
        } else {
            throw new Error('Could not create manga object: ', args);
        }
    }

    set resolved(v) { null };

    async resolve({ force = false, include = [] }) {
        if (this.resolved) {
            let shouldResolve = force;
            // If include, check if already exist
            if (!shouldResolve) return false;
        }
        if (!force && this.resolved) return false;
        const manga = await this.get(this.id, { include });
        this.#apply(manga);
        this.resolved = true;
    }

    serialize() {
        return {
            id: this.id,
            aggregate: this.aggregate,
            actualChapterCount: this.actualChapterCount,
            altTitles: this.altTitles,
            artists: this.artists,
            authors: this.authors,
            chapterCount: this.chapterCount,
            contentRating: this.contentRating,
            covers: this.covers,
            createdAt: this.createdAt,
            description: this.description,
            follows: this.follows,
            isLocked: this.isLocked,
            lastChapter: this.lastChapter,
            lastVolume: this.lastVolume,
            links: this.links,
            localizedAltTitles: this.localizedAltTitles,
            localizedDescription: this.localizedDescription,
            localizedTitle: this.localizedTitle,
            originalLanguage: this.originalLanguage,
            publicationDemographic: this.publicationDemographic,
            rating: this.rating,
            readChapterIds: this.readChapterIds,
            readingStatus: this.readingStatus,
            relatedManga: this.relatedManga,
            statistics: this.statistics,
            status: this.status,
            tags: this.tags,
            title: this.title,
            updatedAt: this.updatedAt,
            volumeCount: this.volumeCount,
            version: this.version,
            year: this.year,
        }
    }

    #apply(obj) {
        for (let [key, val] of Object.entries(obj)) {
            obj[key] = val;
        }
    }

    static async get(id, { include = [], only = [] } = {}) {
        const res = await xFetch(`${MANGADEX_BASEURL}/manga/${id}`);
        const stdResp = Manga.#standardizeApiResponse(res.data);
        return new Manga(stdResp);
    }

    static async search(searchParameters = {}, { include = [], only = [] } = {}) {
        const url = new UrlBuilder(`/manga`);
        url.appendQueryParams(searchParameters);
        const res = await xFetch(url.toString());
        const stdResp = Manga.#standardizeApiResponse(res.data);
        return new Manga(stdResp);
    }

    static random(args) {
    }

    static #standardizeApiResponse(resData) {
        const { data } = resData;
        const attr = data.attributes;
        const id = data.id;
        const title = attr.title[DEFAULT_LANG] || Object.values(attr.title)[0];
        const description = attr.description[DEFAULT_LANG] || Object.values(attr.description)[0];

        // Get artists, authors, cover art and related manga from resData.relationships

        const manga = { ...attr, id, title, description };
        return manga;
    }
}

