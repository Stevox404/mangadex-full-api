import { Chapter } from 'mangadex-full-api';
import { DexCache } from './StorageManager/DexCache';

export function abbreviateNumber(value) {
    if(value === '--') return value;
    var newValue = Number.parseInt(value);
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b","t"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}

export function getLocalizedString(localizedObj = {}, locale = 'en'){
    if(!localizedObj.availableLocales?.length){
        return '';
    }
    if(!localizedObj.availableLocales.includes(locale)){
        locale = 'en';
    }
    return localizedObj[locale];
}

export function markChapterAsRead(chapter, isRead = true) {
    const id = typeof chapter === 'string' ? chapter: chapter.id;
    Chapter.changeReadMarker(id, isRead);
    DexCache.clear('readership');
}

export * from './theme';
export * from './mfa';
export * from './Standardize';
export * from './socket';
export * from './StorageManager';