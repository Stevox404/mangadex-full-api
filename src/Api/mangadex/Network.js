import { MANGADEX_BASEURL } from "./Constants";

export class UrlBuilder {
    constructor (endpoint) {
        this.url = new URL(`${MANGADEX_BASEURL}${endpoint}`);
    }

    appendQueryParams(queryParams) {
        const params = this.url.searchParams;
        for (let [key, value] of Object.entries(queryParams)) {
            if (value instanceof Array) value.forEach(elem => params.append(`${key}[]`, elem));
            else if (typeof value === 'object') Object.entries(value).forEach(([k, v]) => params.set(`${key}[${k}]`, v));
            else params.set(key, value);
        }
    }

    toString() {
        return this.url.toString();
    }
}