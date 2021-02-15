export const filterEntityAttributes = function<T>(entity: T, filter: String[]): Partial<T> {
  const filtered: Partial<T> = {}

  for (const attribute in entity) {
    if (entity.hasOwnProperty(attribute) && filter.includes(attribute)) {
      filtered[attribute] = entity[attribute]
    }
  }

  return filtered
}

export const getUpdatedAttributes = function<T>(entity1: T, entity2: T, filter: string[]): string[] {
  const attributes = []

  for (const attribute in entity1) {
    if (!filter.includes(attribute)) {
      continue
    }

    if (!entity1.hasOwnProperty(attribute) || !entity2.hasOwnProperty(attribute)) {
      continue
    }

    const value1 = entity1[attribute]
    const value2 = entity2[attribute]

    if (isDateValue(value1) || isDateValue(value2)) {
      if (compareDates(value1, value2) === false) {
        attributes.push(attribute)
      }

      continue
    }

    if (value1 !== value2) {
      attributes.push(attribute)
    }
  }

  return attributes
}

const isDateValue = function(value: any): boolean {
  if (value === null) {
    return false
  }

  if (value.constructor.name !== 'Date') {
    return false
  }

  return true
}

const compareDates = function(value1: any, value2: any): boolean {
  if (value1 === null && value2 === null) {
    return true
  }

  if (value1 === null || value2 === null) {
    return false
  }

  const date1: Date = value1 as any
  const date2: Date = value2 as any

  if (date1.getTime() !== date2.getTime()) {
    return false
  }

  return true
}
