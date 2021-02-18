import { Activity } from './Activity'
import { IContentEntity } from './content/types'

export abstract class EntityActivity<T extends IContentEntity> extends Activity {
  protected _entityObject: T
  protected _entityAttributes = []
  protected _entityUpdateAttributes = []

  constructor(action: string, _entityObject: T) {
    super(action)

    this._entityObject = _entityObject
    this._entityId = _entityObject.id
    this._entity = this.getEntityName()
  }

  abstract getEntityName(): string

  filterEntityAttributes(entity: T, filter: string[]): Partial<T> {
    const filtered: Partial<T> = {}

    for (const attribute of filter) {
      if (entity.hasOwnProperty(attribute)) {
        filtered[attribute] = entity[attribute]
      }
    }

    return filtered
  }

  getUpdatedAttributes(entity1: T, entity2: T, filter: string[]): string[] {
    const attributes = []

    for (const attribute of filter) {
      if (!entity1.hasOwnProperty(attribute) || !entity2.hasOwnProperty(attribute)) {
        continue
      }

      const value1 = entity1[attribute]
      const value2 = entity2[attribute]

      if (this.isDateValue(value1) || this.isDateValue(value2)) {
        if (this.compareDates(value1, value2) === false) {
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

  isDateValue = (value: any): boolean => {
    if (value === null) {
      return false
    }

    if (value.constructor.name !== 'Date') {
      return false
    }

    return true
  }

  compareDates = (value1: any, value2: any): boolean => {
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
}
