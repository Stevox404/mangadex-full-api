export const storageTypes = {
    CONFIGS: 'configs',
    BLOBS: 'blobs',
}
Object.freeze(storageTypes);

export function getStorage(type){
    if(type === storageTypes.CONFIGS) return window.localStorage;
    if(type === storageTypes.BLOBS) {
        // TODO Find best storage and check support
        return ({
            /**
             * @param {string} key
             * @return {string} value
             */
            getItem: function (key) {  
            },
            /**
             * @param {string} key
             * @param {string} value
             */
            setItem: function (key, value) { 
            },
            /**
             * @param {string} key
             */
            removeItem: function (key) {  
            },
            /**
             * @param {string} key
             */
            clear: function (key) {  
            },
        })
    }
}