/**
 * @typedef {RequestInfo} OptsObject
 
 */

/**
 * Wrapper over Fetch API
 * @param {string} url 
 * @param {RequestInfo} opts 
 * @param {{
    *  alertErr: boolean
    * }} opts.xOpts - Some extra options for xFetch
    */
export async function xFetch(url, opts = {}) {
    const { method = 'GET', xOpts } = opts || {};

    if ((method === 'GET') && opts.body) {
        const searchParams = new URLSearchParams();
        if (opts.body.constructor === FormData) {
            for (let [key, val] of opts.body) {
                searchParams.append(key, val);
            }
        } else {
            for (let param in opts.body) {
                searchParams.append(param, opts.body[param]);
            }
        }

        const search = new URL(`${/^\//.test(url) ? window.location.origin : ''}${url}`).search;
        url = `${url}${search ? '&' : '?'}${searchParams}`

        opts.body = undefined;
    }

    if (opts.body && opts.body.constructor === Object) {
        opts.headers = opts.headers || {};
        opts.headers["Content-Type"] = "Application/JSON";
        opts.body = JSON.stringify(opts.body);
    }


    try {
        /** @type {Response} */
        const resp = await fetch(url, opts);
        const { status, statusText } = resp;

        /** @type {*} Transformed response data */
        let data;
        if (/json/.test(resp.headers.get('Content-Type'))) {
            data = await resp.json();
        } else {
            data = await resp.text();
        }

        if (status >= 400) {
            const err = new Error(statusText);
            for (let key in Object.keys(resp)) {
                err[key] = resp[key];
            }
            err.status = status;
            err.statusText = statusText;
            err.data = data;
            throw err;
        }


        const cd = resp.headers.get('Content-Disposition');
        if (/attachment/.test(cd)) {
            const filename = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1];
            if (filename) {
                const blob = await resp.blob();
                return saveBlob(blob, filename.replace(/["]/g, ''));
            }
        }

        return { ...resp, data, status, statusText };
    } catch (err) {
        if(err instanceof TypeError){
            const appErr = new Error("Please check your Internet connection");
            appErr.name = "Network Error";
            throw appErr;
        }
        const { statusText, data } = err;
        const errMsg = data || statusText;
        err.message = errMsg;
        if (errMsg) {
            const { alertErr = false } = xOpts || {};
            if (alertErr) alert(errMsg);
        }
        throw err;
    }
}


/**
 * Trigger a download link click.
 * @param {Blob} blob 
 * @param {string} fileName 
 */
export function saveBlob(blob, fileName) {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.dispatchEvent(new MouseEvent('click'));
}