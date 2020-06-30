export function getNextPosition (length: number) {
  const DISTANCE = 1000
  return length * DISTANCE
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
