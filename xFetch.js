export async function xFetch(url, opts = {}) {

    const { alertErr } = opts.xOpts || {};

    if ((!opts.method || opts.method === 'GET') && opts.body) {
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

        delete opts.body;
    }

    if (opts.body && opts.body.constructor === Object) {
        if (typeof opts.headers !== 'object') {
            opts.headers = {};
        }

        opts = {
            ...opts,
            headers: {
                ...opts.headers,
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify(opts.body),
        }

    }

    try {
        const resp = await fetch(url, opts);
        const { status, statusText } = resp;

        let data = '';
        if (/json/.test(resp.headers.get('Content-Type'))) {
            data = await resp.json();
        } else {
            data = await resp.text();
        }

        if (status >= 400) {
            const err = new Error(statusText);
            for(let key in Object.keys(resp)){
                err[key] = resp[key];
            }
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

        return { data, status, statusText };
    } catch (err) {
        const { statusText, data } = err;
        const errMsg = data || statusText;
        err.message = errMsg;
        if(errMsg){
            if (alertErr) alert(errMsg);
        }
        throw err;
    }
}

export function saveBlob(blob, fileName) {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.dispatchEvent(new MouseEvent('click'));
}