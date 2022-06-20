import { StarBorderOutlined, StarHalfOutlined, StarOutlined } from '@material-ui/icons';
import { Chapter } from 'mangadex-full-api';
import { DexCache } from './StorageManager/DexCache';

export function abbreviateNumber(value) {
    if (value === '--') return value;
    var newValue = Number.parseInt(value);
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b", "t"];
        var suffixNum = Math.floor(("" + value).length / 3);
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
        newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
}

export function getLocalizedString(localizedObj = {}, locale = 'en') {
    if (!localizedObj.availableLocales?.length) {
        return '';
    }
    if (!localizedObj.availableLocales.includes(locale)) {
        locale = 'en';
    }
    return localizedObj[locale];
}

export function markChapterAsRead(chapter, isRead = true) {
    const id = typeof chapter === 'string' ? chapter : chapter.id;
    Chapter.changeReadMarker(id, isRead);
    DexCache.clear('readership');
    DexCache.clear('manga-readership');
}

export const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}

export function Deferred() {
    var self = this;
    this.promise = new Promise(function (resolve, reject) {
        self.reject = reject
        self.resolve = resolve
    })
}

export function isOnline() {
    return navigator.onLine;
}

export function fetchBlobUrl(url) {
    const link = `https://api.allorigins.win/raw?url=${url}`;
    return fetch(link)
        .then(res => res.blob())
        .then(blob => URL.createObjectURL(blob));
}

export function getEntityImageSrc(entity, defaultKey = 'image512') {
    let src;
    if(!isOnline()) {
        src = entity?.imageBlobUrl;
    }
    src = src || entity?.[defaultKey];
    return src;
}

export const getStars = (rating, total = 10) => {
    const STAR_NUM = 5;
    
    const stars = [];
    const ct = Math.round(rating)/(total/STAR_NUM);
    if(Number.isNaN(ct)) return stars;

    const full = Math.min(STAR_NUM, Number.parseInt(ct));
    const hasHalf = ct % 1 !== 0;
    const empty = Math.max(0,
        STAR_NUM - (Number.parseInt(ct) + Number(hasHalf))
    );
    for (let i = 0; i < full; i++) {
        stars.push(<StarOutlined key={`f${i}`} />);
    }
    if (hasHalf) stars.push(<StarHalfOutlined key={`h`} />);
    for (let i = 0; i < empty; i++) {
        stars.push(<StarBorderOutlined key={`e${i}`} />);
    }
    return stars;
}

export * from './theme';
export * from './mfa';
export * from './hooks';
export * from './Standardize';
export * from './socket';
export * from './StorageManager';