import httpRequestContext from 'http-request-context'
import { IContentEntity } from './types'
import { ActivityType } from '../types'
import { ContentActions } from './actions'
import { EntityActivity } from '../EntityActivity'

export abstract class ContentActivity<T extends IContentEntity> extends EntityActivity<T> {
  protected constructor(action: string, entityObject: T, actorId?: number) {
    super(action, entityObject)

    this._actorId = actorId ?? httpRequestContext.get('user').id
    this._spaceId = entityObject.spaceId
  }

  type(): string {
    return ActivityType.Content
  }

  push(): boolean {
    return false
  }

  persist(): boolean {
    return true
  }

  protected contentCreated() {
    this._action = ContentActions.Created
    this._context = {
      entity: this.filterEntityAttributes(this._entity, this._entityAttributes),
    }

    return this
  }

  protected contentUpdated(updatedEntity: T) {
    this._context = {
      updatedAttributes: this.getUpdatedAttributes(this._entity, updatedEntity, this._entityUpdateAttributes),
      entity: this.filterEntityAttributes(this._entity, this._entityAttributes),
      updatedEntity: this.filterEntityAttributes(updatedEntity, this._entityAttributes),
    }

    return this
  }

  protected contentArchived() {
    this._action = ContentActions.Archived
    this._context = {
      entity: this.filterEntityAttributes(this._entity, this._entityAttributes),
    }

    return this
  }

  protected contentRestored() {
    this._action = ContentActions.Archived
    this._context = {
      entity: this.filterEntityAttributes(this._entity, this._entityAttributes),
    }

    return this
  }

  protected contentDeleted() {
    this._action = ContentActions.Archived
    this._context = {
      entity: this.filterEntityAttributes(this._entity, this._entityAttributes),
    }

    return this
  }
}
