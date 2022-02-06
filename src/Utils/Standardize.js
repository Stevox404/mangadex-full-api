import {
    Author, Chapter, Cover, Group, List, Manga, User
} from "mangadex-full-api";

export function standardize(obj) {
    let std;
    if (obj instanceof Author) {
        std = stdAuthor(obj);
    }
    if (obj instanceof Chapter) {
        std = stdChapter(obj);
    }
    if (obj instanceof Cover) {
        std = stdCover(obj);
    }
    if (obj instanceof Group) {
        std = stdGroup(obj);
    }
    if (obj instanceof List) {
        std = stdList(obj);
    }
    if (obj instanceof Manga) {
        std = stdManga(obj);
    }
    if (obj instanceof User) {
        std = stdUser(obj);
    }

    return std;
    // return JSON.parse(JSON.stringify(std));
    // return JSON.stringify(std);
}

function clean(obj) {
    const res = {};
    for(let [k,v] of Object.entries(obj)){
        if(v !== undefined) res[k] = v;
    }
    return res;
}


function stdAuthor(obj) {
    if (!obj) return obj;
    return clean({
        id: obj.id,
        biography: obj.biography,
        createdAt: obj.createdAt,
        imageUrl: obj.imageUrl,
        manga: obj.manga?.map(stdManga),
        name: obj.name,
        updatedAt: obj.updatedAt,
    })
}

function stdChapter(obj) {
    if (!obj) return obj;
    return clean({
        id: obj.id,
        chapter: obj.chapter,
        createdAt: obj.createdAt,
        externalUrl: obj.externalUrl,
        groups: obj.groups?.map(stdGroup),
        isExternal: obj.isExternal,
        manga: stdManga(obj.manga),
        pages: obj.pages,
        pageNames: obj.pageNames,
        publishAt: obj.publishAt,
        saverPageNames: obj.saverPageNames,
        title: obj.title,
        translatedLanguage: obj.translatedLanguage,
        updatedAt: obj.updatedAt,
        uploader: stdUser(obj.uploader),
        volume: obj.volume,
    })
}

function stdCover(obj) {
    if (!obj) return obj;
    return clean({
        id: obj.id,
        createdAt: obj.createdAt,
        description: obj.description,
        image256: obj.image256,
        image512: obj.image512,
        imageSource: obj.imageSource,
        manga: stdManga(obj.manga),
        updatedAt: obj.updatedAt,
        uploader: stdUser(obj.uploader),
        volume: obj.volume,
    })
}

function stdGroup(obj) {
    if (!obj) return obj;
    return clean({
        id: obj.id,
        contactEmail: obj.contactEmail,
        createdAt: obj.createdAt,
        description: obj.description,
        discord: obj.discord,
        focusedLanguages: obj.focusedLanguages,
        inactive: obj.inactive,
        ircChannel: obj.ircChannel,
        ircServer: obj.ircServer,
        leader: stdUser(obj.leader),
        locked: obj.locked,
        members: obj.members?.map(stdUser),
        name: obj.name,
        official: obj.official,
        publishDelay: obj.publishDelay,
        twitter: obj.twitter,
        updatedAt: obj.updatedAt,
        verified: obj.verified,
        website: obj.website,
    })
}

function stdList(obj) {
    if (!obj) return obj;
    return clean({
        id: obj.id,
        manga: stdManga(obj.manga),
        name: obj.name,
        owner: stdUser(obj.owner),
        public: obj.public,
        version: obj.version,
        visibility: obj.visibility,
    })
}

function stdManga(obj) {
    if (!obj) return obj;
    return clean({
        id: obj.id,
        altTitles: obj.altTitles,
        artists: obj.artists?.map(stdAuthor),
        authors: obj.authors?.map(stdAuthor),
        contentRating: obj.contentRating,
        createdAt: obj.createdAt,
        description: obj.description,
        isLocked: obj.isLocked,
        lastChapter: obj.lastChapter,
        lastVolume: obj.lastVolume,
        links: obj.links,
        localizedAltTitles: obj.localizedAltTitles,
        localizedDescription: obj.localizedDescription,
        localizedTitle: obj.localizedTitle,
        mainCover: stdCover(obj.mainCover),
        originalLanguage: obj.originalLanguage,
        publicationDemographic: obj.publicationDemographic,
        relatedManga: obj.relatedManga ? Object.entries(obj.relatedManga).reduce((acc, [k, v]) => {
            acc[k] = v?.map(stdManga);
            return acc;
        }, {}): obj.relatedManga,
        status: obj.status,
        tags: obj.tags,
        title: obj.title,
        updatedAt: obj.updatedAt,
        version: obj.version,
        year: obj.year,
    })
}

function stdUser(obj) {
    if (!obj) return obj;
    return clean({
        id: obj.id,
        groups: obj.groups?.map(stdGroup),
        roles: obj.roles,
        username: obj.username,
    })
}