export const counter = (count = 10, cb) => {
    const arr = [];
    for (let i = 0; i < count; i++){
        arr[i] = cb(i);
    }
    return arr;
}