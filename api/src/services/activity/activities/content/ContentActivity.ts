import { IContentEntity } from './types'
import { ActivityType } from '../types'
import { ContentActions } from './actions'
import { EntityActivity } from '../EntityActivity'

export abstract class ContentActivity<T extends IContentEntity> extends EntityActivity<T> {
  protected constructor(action: string, entityObject: T, actorId: number) {
    super(action, entityObject)

    this._actorId = actorId
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

  created() {
    this._action = ContentActions.Created
    this._buildContext()
    return this
  }

  updated(updatedEntity: T) {
    this._action = ContentActions.Updated
    this._buildUpdateContext(updatedEntity)
    return this
  }

  archived() {
    this._action = ContentActions.Archived
    this._buildContext()
    return this
  }

  restored() {
    this._action = ContentActions.Restored
    this._buildContext()
    return this
  }

  deleted() {
    this._action = ContentActions.Deleted
    this._buildContext()
    return this
  }
}
