import { Manga } from "mangadex-full-api";

export async function resolveChapter(chapter, resolutionItems) {    
    const reqs = ['manga', 'groups', 'uploader'];
    const res = await resolveEntity(chapter, resolutionItems, reqs);
    return res;
}

export async function resolveManga(manga, resolutionItems) {    
    const reqs = ['mainCover', 'authors', 'artists'];
    if(typeof manga === 'string') manga = await Manga.get(manga);
    const res = await resolveEntity(manga, resolutionItems, reqs);
    return res;
}


async function resolveEntity(entity, resolutionItems, srcKeys) {
    const promises = [];
    srcKeys.forEach(key => {
        if(shouldResolve(key)) {
            const property = entity[key];
            const resolveProperty = prop => {
                if(!prop) {
                    return Promise.resolve(prop);
                } else if(!prop.id) {
                    throw new Error('Cannot resolve property without id');
                } else if(!prop.type) {
                    return Promise.resolve(prop);
                } else {
                    return prop.resolve();
                }
            }

            if(Array.isArray(property)) {
                promises.push(Promise.allSettled(property.map(resolveProperty)));
            } else {
                promises.push(resolveProperty(property));
            }
            entity[key] = promises.length - 1;
        }
    });
    const resolved = await Promise.allSettled(promises);
    srcKeys.forEach(key => {
        if(shouldResolve(key)) {
            const res = resolved[entity[key]];
            if(res.status === 'rejected' || !res.value){
                return entity[key] = null;
            }
            
            var propVal = res.value;
            if(Array.isArray(propVal)) {
                entity[key] = propVal.map(i => i.value);
            } else {
                entity[key] = propVal;
            }
        }
    });

    return entity;

    function shouldResolve(item){
        return typeof resolutionItems === 'object' && resolutionItems[item] !== undefined ?
            resolutionItems[item]: true;
    }
}