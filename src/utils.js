export const combineArrays = (a, b, c) => {
    const ret = [];
    for (let i = 0; i < a.length; i++) {
        ret.push(`${a[i]},${b[i]},${c[i]}`);
    }
    return ret;
}

export const deconstructArray = (arr) => {
    const names = [];
    const serves = [];
    const cals = [];
    for (const a of arr) {
        const [name, cal, serve] = a.split(",");
        names.push(name);
        cals.push(cal);
        serves.push(serve);
    }
    return {names, serves, cals};
}