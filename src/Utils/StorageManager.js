export const storageTypes = {
    CONFIGS: 'configs',
    BLOBS: 'blobs',
}
Object.freeze(storageTypes);

export const storageKeys = {
    DOWNLOAD_QUEUE: 'dexumiDownloadQueue',
    DOWNLOADED_MANGA_IDS: 'downloadedMangaIds',
}
Object.freeze(storageKeys);

export function getStorage(type){
    if(type === storageTypes.CONFIGS) return window.localStorage;
    if(type === storageTypes.BLOBS) {
        // TODO Find best storage and check support
        var storage = window.localStorage;
        return ({
            /**
             * @param {string} key
             * @return {any} value
             */
            getItem: function (key) {
                storage.getItem;
            },
            /**
             * @param {string} key
             * @param {any} value
             */
            setItem: function (key, value) { 
                storage.setItem;
            },
            /**
             * @param {string} key
             */
            removeItem: function (key) {  
                storage.removeItem;
            },
            /**
             * @param {string} key
             */
            clear: function (key) {  
                storage.clear;
            },
        })
    }
}