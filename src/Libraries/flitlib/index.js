export * from './xFetch';
export * from './hooks';

export const counter = (count = 10, cb) => {
    const arr = [];
    for (let i = 0; i < count; i++){
        arr[i] = cb(i);
    }
    return arr;
}

/** Promise resolves after @param time (ms) 
 * @param {Number} time
*/
export const sleep = time => {
    return new Promise(resolve => {
        window.setTimeout(resolve, time);
    });
}


export function dataURItoFile(dataURI, filename = 'file') {
    const blob = dataURItoBlob(dataURI);
    const mimeMatch = /^\w+:(.+?);/.exec(dataURI);
    const mimeString = mimeMatch && mimeMatch[1];

    return new File([blob], filename, { type: mimeString });
}

export function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    const uriSplitArr = dataURI.split(',');
    if (uriSplitArr[0].indexOf('base64') >= 0)
        byteString = atob(uriSplitArr[1]);
    else
        byteString = unescape(uriSplitArr[1]);

    // separate out the mime component
    const mimeMatch = /^\w+:(.+?);/.exec(dataURI);
    const mimeString = mimeMatch && mimeMatch[1];


    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

export function throttle(func, timeFrame) {
    var lastTime = 0;
    return function () {
        var now = new Date();
        if (now - lastTime >= timeFrame) {
            func();
            lastTime = now;
        }
    };
}

export function formatMoney(amount = 0, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        amount = String(amount || '').replace(/,/g, '');
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};
