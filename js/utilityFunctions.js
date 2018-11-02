function round(given) {
    var result = Math.floor(given * 100)/100;
    return result;
}

function getVal(arr) {
    if (Number.isInteger(arr))
        return arr;
    return parseInt(Math.random()*(arr[1]-(arr[0]-1))+arr[0]);
}