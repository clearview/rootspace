export function getNextPosition (length: number, considerLast = 0) {
  const DISTANCE = 1000
  const estimate = (length + 1) * DISTANCE
  if (estimate < considerLast) {
    return considerLast + DISTANCE
  }
  return estimate
}

export function getReorderIndex (oldIndex: number, newIndex: number) {
  if (newIndex < oldIndex) {
    return [newIndex - 1, newIndex]
  } else {
    return [newIndex, newIndex + 1]
  }
}

export function getReorderPosition (prev: number, next: number) {
  return (prev + next) / 2
}
