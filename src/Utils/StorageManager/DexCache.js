import Dexie from "dexie";
import moment from "moment";

const db = new Dexie("_cache");
db.version(1).stores({
    _cache: 'name'
});

db.open().catch(async err => {
    console.warn(err);
    db.close();
    await db.delete();
    db.version(1).stores({
        _cache: 'name'
    });
});

export const DexCache = db._cache.defineClass({
    date: String,
    name: String,
    data: Object,
    validTo: Date, // Date or moment() object
    validFor: Number, // Number(ms) or `moment.duration() Duration. Takes precedence over valid To
});

DexCache.prototype.save = async function () {
    if (!this.name) throw new Error('Save Failed. Cache has no name.');
    const date = new Date().toLocaleDateString();
    this.date = date;
    if(this.validFor) {
        if (this.validFor.toDate) {
            this.validFor = this.validFor.toDate();
        } else {
            this.validFor = Number(this.validFor);
        }
    }

    if(this.validTo) {
        if (this.validTo.toDate) {
            this.validTo = this.validTo.toDate();
        } else {
            this.validTo = Date(this.validTo);
        }
    }
    
    this.createdAt = new Date();
    this.destroyAt = getEol(this);
    
    if(!this.destroyAt) {
        this.destroyAt = moment('24:00', 'hh:mm').toDate();    
    }

    const cache = this;
    return db.transaction('rw', db._cache, async function () {
        await cache.clear();
        await db._cache.put(cache);
    });
}

DexCache.prototype.fetch = async function () {
    if (!this.name) throw new Error('Fetch Failed. Cache has no name.');
    const res = await db._cache.get(this.name);

    const cacheInvalid = res && res.destroyAt && moment(res.destroyAt) < moment();
    const cacheInconsistent = () => res && (!moment(res.validFor).isSame(moment(this.validFor)) &&
        !moment(res.validTo).isSame(moment(this.validTo)))
        
    if(cacheInvalid || cacheInconsistent()) {
        await this.clear();
        return null;
    }
    return res ? res.data : null;
}

DexCache.prototype.clear = function () {
    if (!this.name) throw new Error('Clear Failed. Cache has no name.');
    return db._cache.delete(this.name);
}

DexCache.clear = async function (name) {
    if (!name) throw new Error('Invalid argument.');
    return db._cache.delete(name);
}

DexCache.delete = async function () {
    db.close();
    await db.delete();
    db.version(1).stores({
        _cache: 'name'
    });
}

function getEol(cache) {
    let eol;
    if(cache.validFor) {
        eol = moment().add(cache.validFor);
    } else if (cache.validTo) {
        eol = moment(cache.validTo);
    }
    if(eol && eol.isValid()) return eol.toDate();
    return null;
}