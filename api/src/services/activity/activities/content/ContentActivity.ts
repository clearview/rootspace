import httpRequestContext from 'http-request-context'
import { IContentEntity } from './types'
import { ActivityType } from '../types'
import { Activity, IActivity } from '../Activity'
import { IContentActivityData } from './ContentActivityData'
import * as Util from '../util'
import { ContentActions } from './actions'

export interface IContentActivity extends IActivity {
  getEntityName(): string
}

export abstract class ContentActivity<T extends IContentEntity> extends Activity implements IContentActivity {
  protected _entityObject: T
  protected _entityAttributes = []
  protected _entityUpdateAttributes = []

  protected constructor(entity: T, actorId?: number) {
    super()

    this._entityObject = entity
    this._actorId = actorId ?? httpRequestContext.get('user').id
    this._spaceId = entity.spaceId
    this._entityId = entity.id
    this._entity = this.getEntityName()
  }

  abstract getEntityName(): string

  type(): string {
    return ActivityType.Content
  }

  getType(): string {
    return ActivityType.Content
  }

  created(): ContentActivity<T> {
    this._action = ContentActions.Created
    this._context = {
      entity: Util.filterEntityAttributes<T>(this._entityObject, this._entityAttributes),
    }

    return this
  }

  updated(updatedEntity: T) {
    this._action = ContentActions.Updated

    console.log(this._entityAttributes)

    this._context = {
      updatedAttributes: Util.getUpdatedAttributes<T>(this._entityObject, updatedEntity, this._entityAttributes),
      entity: Util.filterEntityAttributes<T>(this._entityObject, this._entityAttributes),
      updatedEntity: Util.filterEntityAttributes(updatedEntity, this._entityUpdateAttributes),
    }

    return this
  }

  archived() {
    this._action = ContentActions.Archived
    this._context = {
      entity: Util.filterEntityAttributes<T>(this._entityObject, this._entityAttributes),
    }

    return this
  }

  restored() {
    this._action = ContentActions.Archived
    this._context = {
      entity: Util.filterEntityAttributes<T>(this._entityObject, this._entityAttributes),
    }

    return this
  }

  deleted() {
    this._action = ContentActions.Archived
    this._context = {
      entity: Util.filterEntityAttributes<T>(this._entityObject, this._entityAttributes),
    }

    return this
  }
}
