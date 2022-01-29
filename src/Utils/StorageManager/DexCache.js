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
    validTo: Date, // Date or `moment` object
    validFor: Number, // Number(ms) or `moment` Duration. Takes precedence over valid To
});

DexCache.prototype.save = function () {
    if (!this.name) throw new Error('Save Failed. Cache has no name.');
    const date = new Date().toLocaleDateString();
    this.date = date;
    this.createdAt = new Date();
    
    if(this.validFor) {
        const eol = moment().add(this.validFor);
        if(eol.isValid()) this.destroyAt = eol.toDate();
    } else if (this.validTo) {
        const eol = moment(this.validTo);
        if(eol.isValid()) this.destroyAt = eol.toDate();
    }
    
    if(!this.destroyAt) {
        this.destroyAt = moment('24:00', 'hh:mm').toDate();    
    }

    const obj = this;
    return db.transaction('rw', db._cache, async function () {
        await db._cache.delete(obj.name);
        await db._cache.put(obj);
    });
}

DexCache.prototype.fetch = async function () {
    if (!this.name) throw new Error('Fetch Failed. Cache has no name.');
    const res = await db._cache.get(this.name);
    let destroyAt = res?.destroyAt;
    
    if(process.env.NODE_ENV == 'development'){
        if(this.validFor) {
            const eol = moment().add(this.validFor);
            if(eol.isValid()) destroyAt = eol.toDate();
        } else if (this.validTo) {
            const eol = moment(this.validTo);
            if(eol.isValid()) destroyAt = eol.toDate();
        }
    }
    
    if(res && destroyAt && moment(destroyAt) < moment()) {
        await db._cache.delete(this.name);
        return null;
    }
    return res ? res.data : null;
}

