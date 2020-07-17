export function mirror<T extends object> (objA: T, objB: T) {
  for (const prop in objA) {
    // eslint-disable-next-line no-prototype-builtins
    if (objA.hasOwnProperty(prop)) {
      objA[prop] = objB[prop]
    }
  }
}
