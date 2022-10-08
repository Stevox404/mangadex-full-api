'use strict';

// Internal
import * as Util from './util.js';
import LocalizedString from './internal/localizedstring.js';
import APIRequestError from './internal/requesterror.js';

import Tag from './internal/tag.js';
import Manga from './structure/manga.js';
import Author from './structure/author.js';
import Chapter from './structure/chapter.js';
import Group from './structure/group.js';
import User from './structure/user.js';
import List from './structure/list.js';
import Cover from './structure/cover.js';

import AuthUtil from './auth.js';
import Relationship from './internal/relationship.js';


// Export
export { Tag, Manga, Author, Chapter, Group, User, List, Cover }

/**
 * Converts old (pre v5, numeric ids) Mangadex ids to v5 ids.
 * Any invalid legacy ids will be skipped by Mangadex when remapping, so
 * call this function for each individual id if this is an issue.
 * @param {'group'|'manga'|'chapter'|'tag'} type Type of id 
 * @param {...Number|Number[]} ids Array of ids to convert
 * @returns {Promise<String[]>}
 */
export async function convertLegacyId(type, ...ids) {
    if (ids.length === 0) throw new Error('Invalid Argument(s)');
    ids = ids.flat();
    let res = await Util.apiRequest('/legacy/mapping', 'POST', { type: type, ids: ids });
    if (!(res.data instanceof Array)) throw new APIRequestError('The API did not respond with an array when it was expected to', APIRequestError.INVALID_RESPONSE);
    return res.data.map(e => e.attributes.newId);
}

/**
 * Sets the global locaization for LocalizedStrings.
 * Uses 2-letter Mangadex region codes.
 * @param {String} newLocale
 */
export function setGlobalLocale(newLocale) {
    if (typeof newLocale !== 'string' || newLocale.length !== 2) throw new Error('Invalid Locale Code.');
    LocalizedString.locale = newLocale;
};


/**
 * Required for authorization
 * https://api.mangadex.org/docs.html#operation/post-auth-login
 * @param {String} username 
 * @param {String} password 
 * @param {String} [cacheLocation] File location (or localStorage key for browsers) to store the persistent token IN PLAIN TEXT
 * @returns {Promise<void>}
 */
export function login(username, password, cacheLocation) {
    return AuthUtil.login(username, password, cacheLocation);
}

// Register class types to bypass circular references
Relationship.registerType('author', Author);
Relationship.registerType('artist', Author);
Relationship.registerType('manga', Manga);
Relationship.registerType('chapter', Chapter);
Relationship.registerType('scanlation_group', Group);
Relationship.registerType('user', User);
Relationship.registerType('leader', User);
Relationship.registerType('member', User);
Relationship.registerType('custom_list', List);
Relationship.registerType('cover_art', Cover);

/**
 * A shortcut for resolving all relationships in an array
 * @template T
 * @param {Array<Relationship<T>>} relationshipArray
 * @returns {Promise<Array<T>>}
 */
export function resolveArray(relationshipArray) {
    return Relationship.resolveAll(relationshipArray);
}

let _proxy;
/**
 * Sets a proxy through which all requests will be routed
 * @param {{
 *  url: string,
 *  port: string,
 * }} proxy
 * @return {boolean}
 */
export function setProxy(proxy) {
    _proxy = {
        url: proxy.url,
        port: proxy.port,
    }
    return true;
}

/**
 * Returns the set proxy or null if unset
 * @return {{url:string, port:string}|null} Set Proxy
 */
export function getProxy() {
    return _proxy;
}