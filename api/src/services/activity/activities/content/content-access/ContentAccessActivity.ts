import { ContentAccess } from '../../../../../database/entities/ContentAccess'
import { ContentEntity } from '../../../../../root/types'
import { ContentEntityName } from '../../../../../shared/constants'
import { ContentAccessUpdateAttributes } from '../../../../content-access/values/types'
import { ActivityType } from '../../types'
import { ContentAccessActions } from '../actions'
import { ContentActivity } from '../ContentActivity'

export class ContentAccessActivity extends ContentActivity<ContentEntity> {
  constructor(action: string, entity: ContentEntity, actorId: number, entityType: string) {
    super(action, entity, actorId)

    this._actorId = actorId
    this._entityAttributes = ['id']
    this._entityUpdateAttributes = ['type', 'public']
    this._entityName = entityType
  }

  getEntityName(): string {
    return this._entityName
  }

  type(): string {
    return ActivityType.Content
  }

  handler(): string | null {
    return null
  }

  push(): boolean {
    return true
  }

  persist(): boolean {
    return true
  }

  static public(entity: ContentEntity, actorId: number, newAccess: ContentAccess & ContentAccessUpdateAttributes) {
    return new ContentAccessActivity(ContentAccessActions.Public, entity, actorId, entity.constructor.name).setData(newAccess)
  }

  static private(entity: ContentEntity, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Private, entity, actorId, entity.constructor.name).setData(newAccess)
  }

  static open(entity: ContentEntity, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Open, entity, actorId, entity.constructor.name).setData(newAccess)
  }

  static restricted(entity: ContentEntity, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Restricted, entity, actorId, entity.constructor.name).setData(newAccess)
  }

  private setData(entity: ContentAccess & ContentAccessUpdateAttributes) {
    this._context = {
      entity
    }

    return this
  }
}