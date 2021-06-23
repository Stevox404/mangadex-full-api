import { defaultLocale } from "./Constants";
import './typedef';


class LocalizedString {
    /**
     * @param {string} id The entity id
     * @param {string} key Full object path from the entity root e.g Manga.altTitles.0
     * @param {number} idx Required if registered an array of LocalizedStrings
     */
    constructor(id, key, idx = 0) {
        this.id = id;
        this.key = key;
        this.idx = idx;
    }

    static #localeStore = {}

    /**
     * @param {string} locale 
     * @returns {string} localized string
     */
    toString(locale, idx) {
        locale = locale || defaultLocale;
        idx = Number.isInteger(idx) ? idx: this.idx;
        let entityStore = LocalizedString.#localeStore[this.key][this.id];
        if(Array.isArray(entityStore)){
            entityStore = entityStore[idx];
        }
        return entityStore ? entityStore[locale]: '';
    }

    /**
     * @param {string} id The entity id
     * @param {string} locale The locale for the passed value e.g en, de
     * @param {string} key Full object path from the entity root e.g Manga.altTitles.0
     * @param {LocalizedStringRes|LocalizedStringRes[]} localizedStrings Object of localized strings
     */
    static register(id, key, localizedStrings) {
        if (typeof localizedStrings !== 'object') {
            throw Error(`Expected an object keyed with locales, instead got ${typeof localizedStrings}`);
        }
        LocalizedString.#localeStore[key] = LocalizedString.#localeStore[key] || {};
        LocalizedString.#localeStore[key][id] = LocalizedString.#localeStore[key][id] || {};
        if(Array.isArray(localizedStrings)){
            let val = localizedStrings.map(l => ({...l}));
            LocalizedString.#localeStore[key][id] = val;
        } else {
            LocalizedString.#localeStore[key][id] = {...localizedStrings};
        }
        return new LocalizedString(id, key);
    }

    get allLocales() {
        return LocalizedString.#localeStore[this.key][this.id];
    }
}


export default LocalizedString;



/**
 * @typedef {Object.<string, string>} LocalizedStringRes
 */