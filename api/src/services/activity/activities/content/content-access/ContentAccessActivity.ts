import { ContentAccess } from '../../../../../database/entities/ContentAccess'
import { Activity } from '../../Activity'
import { ActivityType } from '../../types'
import { ContentAccessActions } from '../actions'
import { ContentActivity } from '../ContentActivity'

// export class ContentAccessActivity extends ContentActivity<ContentAccess> {
export class ContentAccessActivity extends Activity {
  constructor(action: string, entity: ContentAccess, actorId: number) {
    super(action)

    this._actorId = actorId
    // this._entityAttributes = ['id']
    // this._entityUpdateAttributes = ['type', 'public']
    // this._entityName = entity
    // this._entityId = entityId
  }

  type(): string {
    return ActivityType.ContentAccess
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

  static public(entity: ContentAccess, actorId: number) {
    return new ContentAccessActivity(ContentAccessActions.Public, entity, actorId).setData(entity)
  }

  static private(entity: ContentAccess, actorId: number) {
    return new ContentAccessActivity(ContentAccessActions.Private, entity, actorId).setData(entity)
  }

  static open(entity: ContentAccess, actorId: number) {
    return new ContentAccessActivity(ContentAccessActions.Open, entity, actorId).setData(entity)
  }

  static restricted(entity: ContentAccess, actorId: number) {
    return new ContentAccessActivity(ContentAccessActions.Restricted, entity, actorId).setData(entity)
  }

  private setData(entity: ContentAccess) {
    this._context = {
      entity
    }

    return this
  }
}