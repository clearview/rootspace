import { Entity } from '../../../root/types'
import { Activity } from './Activity'

export abstract class EntityActivity<T extends Entity> extends Activity {
  protected _entity: T
  protected _entityAttributes = []
  protected _entityUpdateAttributes = []

  constructor(action: string, _entityObject: T) {
    super(action)

    this._entity = _entityObject
    this._entityId = _entityObject.id
    this._entityName = this.getEntityName()
  }

  abstract getEntityName(): string

  entity(): T {
    return this._entity
  }
  protected _buildContext() {
    this._context = {
      entity: this._filterEntityAttributes(this._entity, this._entityAttributes),
    }
  }

  protected _buildUpdateContext(updatedEntity: T) {
    this._context = {
      updatedAttributes: this._getUpdatedAttributes(this._entity, updatedEntity, this._entityUpdateAttributes),
      entity: this._filterEntityAttributes(this._entity, this._entityAttributes),
      updatedEntity: this._filterEntityAttributes(updatedEntity, this._entityAttributes),
    }
  }

  protected _filterEntityAttributes(entity: T, filter: string[]): Partial<T> {
    const filtered: Partial<T> = {}

    for (const attribute of filter) {
      if (entity.hasOwnProperty(attribute)) {
        filtered[attribute] = entity[attribute]
      }
    }

    return filtered
  }

  protected _getUpdatedAttributes(entity1: T, entity2: T, filter: string[]): string[] {
    const attributes = []

    for (const attribute of filter) {
      if (!entity1.hasOwnProperty(attribute) || !entity2.hasOwnProperty(attribute)) {
        continue
      }

      const value1 = entity1[attribute]
      const value2 = entity2[attribute]

      if (this._isDateValue(value1) || this._isDateValue(value2)) {
        if (this._compareDates(value1, value2) === false) {
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

  protected _isDateValue = (value: any): boolean => {
    if (value === null) {
      return false
    }

    if (value.constructor.name !== 'Date') {
      return false
    }

    return true
  }

  protected _compareDates = (value1: any, value2: any): boolean => {
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
