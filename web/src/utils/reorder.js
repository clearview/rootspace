export function getNextPosition(length, considerLast) {
    if (considerLast === void 0) { considerLast = 0; }
    var DISTANCE = 1000;
    var estimate = (length + 1) * DISTANCE;
    if (estimate < considerLast) {
        return considerLast + DISTANCE;
    }
    return estimate;
}
export function getReorderIndex(oldIndex, newIndex) {
    if (newIndex < oldIndex) {
        return [newIndex - 1, newIndex];
    }
    else {
        return [newIndex, newIndex + 1];
    }
}
export function getReorderPosition(prev, next) {
    return (prev + next) / 2;
}
//# sourceMappingURL=reorder.js.map