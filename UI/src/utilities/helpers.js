export const groupBy = (array, callback) => {
    return array.reduce((result, item) => {
        const key = callback(item);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
        return result;
    }, {});
}

export const associateBy = (array, callback) => {
    return array.reduce((result, item) => {
        const key = callback(item);
        result[key] = item;
        return result;
    }, {});
}
