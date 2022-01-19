
export async function resolveChapter(chapter, resolutionItems) {    
    const reqs = ['manga', 'groups', 'uploader'];
    const res = await resolveEntity(chapter, resolutionItems, reqs);
    return res;
}

export async function resolveManga(manga, resolutionItems) {    
    const reqs = ['mainCover', 'authors', 'artists'];
    const res = await resolveEntity(manga, resolutionItems, reqs);
    return res;
}


async function resolveEntity(src, resolutionItems, srcKeys) {
    const promises = [];
    srcKeys.forEach(r => {
        if(req(r)) {
            const item = src[r];
            if(Array.isArray(item)) {
                promises.push(Promise.allSettled(item.map(i =>
                    i.resolve()
                )));
            } else {
                promises.push(src[r].resolve());
            }
            src[r] = promises.length - 1;
        }
    });
    const resolved = await Promise.allSettled(promises);
    srcKeys.forEach(r => {
        if(req(r)) {
            var item = resolved[src[r]].value;
            if(Array.isArray(item)) {
                src[r] = item.map(i => i.value);
            } else {
                src[r] = item;
            }
        }
    });

    return src;

    function req(item){
        return typeof resolutionItems === 'object' ? resolutionItems[item]: true;
    }
}