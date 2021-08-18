import { ContentAccess } from '../../../../../database/entities/ContentAccess'
import { Doc } from '../../../../../database/entities/Doc'
import { Activity } from '../../Activity'
import { ActivityType } from '../../types'
import { ContentAccessActions } from '../actions'
import { ContentActivity } from '../ContentActivity'

export class ContentAccessActivity extends ContentActivity<Doc> {
  constructor(action: string, entity: Doc, actorId: number) {
    super(action, entity, actorId)

    this._actorId = actorId
    this._entityAttributes = ['id']
    this._entityUpdateAttributes = ['type', 'public']
  }

  getEntityName(): string {
    return 'Doc'
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

  static public(entity: Doc, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Public, entity, actorId).setData(newAccess)
  }

  static private(entity: Doc, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Private, entity, actorId).setData(newAccess)
  }

  static open(entity: Doc, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Open, entity, actorId).setData(newAccess)
  }

  static restricted(entity: Doc, actorId: number, newAccess: ContentAccess) {
    return new ContentAccessActivity(ContentAccessActions.Restricted, entity, actorId).setData(newAccess)
  }

  private setData(entity: ContentAccess) {
    this._context = {
      entity
    }

    return this
  }
}