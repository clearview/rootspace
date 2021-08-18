import { ContentAccess } from '../../../../../database/entities/ContentAccess'
import { ActivityType } from '../../types'
import { ContentAccessActions } from '../actions'
import { ContentActivity } from '../ContentActivity'

export class ContentAccessActivity extends ContentActivity<ContentAccess> {
  constructor(action: string, entity: ContentAccess, actorId: number) {
    super(action, entity, actorId)

    this._actorId = actorId
    this._entityAttributes = ['id']
    this._entityUpdateAttributes = ['type', 'public']
  }

  getEntityName(): string {
    return 'ContentAccess'
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

  static public(entity: ContentAccess, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Public, entity, actorId).setData(newAccess)
  }

  static private(entity: ContentAccess, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Private, entity, actorId).setData(newAccess)
  }

  static open(entity: ContentAccess, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Open, entity, actorId).setData(newAccess)
  }

  static restricted(entity: ContentAccess, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Restricted, entity, actorId).setData(newAccess)
  }

  private setData(entity: ContentAccess) {
    this._context = {
      entity
    }

    return this
  }
}