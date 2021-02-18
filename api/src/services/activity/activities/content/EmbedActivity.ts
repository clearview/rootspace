import { Embed } from '../../../../database/entities/Embed'
import { ContentActivity } from './ContentActivity'
import { ContentActions } from './actions'

export class EmbedActivity extends ContentActivity<Embed> {
  constructor(action: string, entity: Embed, actorId?: number) {
    super(action, entity, actorId)

    this._entityAttributes = ['id', 'title']
    this._entityUpdateAttributes = ['id', 'title', 'content']
  }

  getEntityName(): string {
    return 'Embed'
  }

  handler(): string | null {
    return null
  }

  static created(entity: Embed, actorId?: number) {
    return new EmbedActivity(ContentActions.Created, entity, actorId).contentCreated()
  }

  static updated(entity: Embed, updatedEntity: Embed, actorId?: number) {
    return new EmbedActivity(ContentActions.Updated, entity, actorId).contentUpdated(updatedEntity)
  }

  static archived(entity: Embed, actorId?: number) {
    return new EmbedActivity(ContentActions.Archived, entity, actorId).contentArchived()
  }

  static restored(entity: Embed, actorId?: number) {
    return new EmbedActivity(ContentActions.Restored, entity, actorId).contentRestored()
  }

  static deleted(entity: Embed, actorId?: number) {
    return new EmbedActivity(ContentActions.Deleted, entity, actorId).contentDeleted()
  }
}
