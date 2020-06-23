export * from './xFetch';
export * from './hooks';

export const counter = (count = 10, cb) => {
    const arr = [];
    for (let i = 0; i < count; i++){
        arr[i] = cb(i);
    }
    return arr;
}

export const sleep = time => {
    return new Promise(resolve => {
        window.setTimeout(resolve, time);
    });
}