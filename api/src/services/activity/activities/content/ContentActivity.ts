import httpRequestContext from 'http-request-context'
import { IContentEntity, IContentActivity } from '.'
import { IContentActivityData } from './types'

export abstract class ContentActivity<T extends IContentEntity> implements IContentActivity {
  protected _action: string
  protected _entity: T
  protected _actorId: number
  protected _context: any

  protected _filterEntityAttributes = []
  protected _notifyUpdatedAttributes = []

  protected _handler: any

  protected constructor(action: string, entity: T, actorId?: number) {
    this._action = action
    this._entity = entity

    this._actorId = actorId ?? httpRequestContext.get('user').id
  }

  abstract getEntityName(): string
  abstract getTablename(): string

  getType(): string {
    return 'content'
  }

  toObject(): IContentActivityData {
    return {
      actorId: this._actorId,
      spaceId: this._entity.spaceId,
      entityId: this._entity.id,
      entity: this.getEntityName(),
      action: this._action,
      type: this.getType(),
      tableName: this.getTablename(),
      context: this._context,
      handler: this._handler,
    }
  }

  protected created(): IContentActivity {
    this._context = {
      entity: this.filterEntityAttributes(this._entity),
    }

    return this
  }

  protected updated(updatedEntity: T): ContentActivity<T> {
    this._context = {
      updatedAttributes: this.notifyUpdatedAttributes(this._entity, updatedEntity),
      entity: this.filterEntityAttributes(this._entity),
      updatedEntity: this.filterEntityAttributes(updatedEntity),
    }

    return this
  }

  protected archived(): ContentActivity<T> {
    this._context = {
      entity: this.filterEntityAttributes(this._entity),
    }

    return this
  }

  protected restored(): ContentActivity<T> {
    this._context = {
      entity: this.filterEntityAttributes(this._entity),
    }

    return this
  }

  protected deleted(): ContentActivity<T> {
    this._context = {
      entity: this.filterEntityAttributes(this._entity),
    }

    return this
  }

  protected filterEntityAttributes(entity: T): Partial<T> {
    const filtered: Partial<T> = {}

    for (const attribute in entity) {
      if (entity.hasOwnProperty(attribute) && this._filterEntityAttributes.includes(attribute)) {
        filtered[attribute] = entity[attribute]
      }
    }

    return filtered
  }

  protected notifyUpdatedAttributes(entity1: T, entity2: T): string[] {
    const attributes = []

    for (const key in entity1) {
      if (!this._notifyUpdatedAttributes.includes(key)) {
        continue
      }

      if (!entity1.hasOwnProperty(key) || !entity2.hasOwnProperty(key)) {
        continue
      }

      if (entity1[key].constructor.name === 'Date') {
        const date1: Date = entity1[key] as any
        const date2: Date = entity2[key] as any

        if (date1.getTime() !== date2.getTime()) {
          attributes.push(key)
        }

        continue
      }

      if (entity1[key] !== entity2[key]) {
        attributes.push(key)
      }
    }

    return attributes
  }
}
