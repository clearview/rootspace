export function mirror(objA, objB) {
    for (var prop in objA) {
        // eslint-disable-next-line no-prototype-builtins
        if (objA.hasOwnProperty(prop)) {
            objA[prop] = objB[prop];
        }
    }
}
//# sourceMappingURL=object.js.map