import LocalizedString from "Mangadex/LocalizedString";
import '../typedef';

const { xFetch } = require("Utils/shared/flitlib");
const { url } = require('../index')

class Manga {
    /**
     * @param {MangaResponse} manga
     */
    constructor(manga) {
        let data = manga.data;
        if(!data || data.type !== 'manga'){
            throw Error('This is not a valid Manga type');
        }
        let attr = data.attributes;
        this.id = data.id;
        this.title = LocalizedString.register(data.id, 'Manga.title', attr.title);
        this.altTitles = LocalizedString.register(data.id, 'Manga.altTitles', attr.altTitles);
    }

    /**
     * 
     * @param {SearchParams} params 
     * @returns 
     */
    static async search(params) {
        const {data, status, statusText} = await xFetch(`${url}/manga`, {
            body: params
        });
        const {limit, offset, total, results = []} = data;
        var mangas = results.map(r => new Manga(r));
        console.debug(mangas);
        return mangas;
    }
}

export default Manga;


/**
 * @typedef {Object} SearchParams
 * @property {number} limit [0..100]
 * @property {number} offset
 * @property {string} title
 * @property {UUID[]} authors
 * @property {UUID[]} artists
 * @property {number} year Year of release
 * @property {UUID[]} includedTags
 * @property {'AND'|'OR'} [includedTagsMode='AND']
 * @property {UUID[]} excludedTags
 * @property {'AND'|'OR'} [excludedTagsMode='OR']
 * @property {('ongoing'|'completed'|'hiatus'|'cancelled')[]} status
 * @property {string[]} originalLanguage
 * @property {('shounen'|'shoujo'|'josei'|'seinen'|'none')[]} publicationDemographic
 * @property {UUID[]} ids
 * @property {('safe'|'suggestive'|'erotica'|'pornographic'|'none')[]} [contentRating=["none","safe","suggestive","erotica"]]
 * @property {string} createdAtSince Format YYYY-MM-DDTHH:MM:SS
 * @property {string} updatedAtSince Format YYYY-MM-DDTHH:MM:SS
 * @property {{
 *  createdAt:('asc'|'desc'),
 *  updatedAt:('asc'|'desc'),
 * }} order
 * @property {string[]} includes
 * 
 */