
/**
 * @typedef {Object} MangaResponse
 * @property {'ok'|'error'} result
 * @property {MangaResEntity} data
 * @property relationship
 */

/**
 * @typedef {Object} MangaResEntity
 * @property {string} id
 * @property {'manga'} type
 * @property {MangaResAttributes} attributes
 */

/**
 * @typedef {Object} MangaResAttributes
 * @property {LocalizedStringRes} title
 * @property {LocalizedStringRes[]} altTitles
 * @property {LocalizedStringRes} description
 * @property {boolean} isLocked
 * @property {string} originalLanguage
 * @property {string} [lastVolume]
 * @property {string} [lastChapter]
 * @property {string} [publicationDemographic]
 * @property {string} [status]
 * @property {number} [year]
 * @property {string} [contentRating]
 * @property {Tag[]} tags
 * @property {number} version
 * @property {string} createdAt
 * @property {string} updatedAt
 */


/**
 * @typedef {Object} MangaResRelationship
 * @property {string} id
 * @property {string} type
 * @property {Object} attributes Contains attributes of entity of given type if Reference Expansion is applied
 */



/**
 * @typedef {Object.<string, string>} LocalizedStringRes
 */



/**
 * @typedef {Object} Tag
 * @property {string} id
 * @property {'tag'} type
 * @property {TagAttributes} attributes
 */
/**
 * @typedef {Object} TagAttributes
 * @property {LocalizedStringRes} name
 * @property {LocalizedStringRes} description
 * @property {string} group
 * @property {number} version
 */


/**
 * @typedef {string} UUID
 */