import { Embed } from '../../../../database/entities/Embed'
import { ContentActivity } from './ContentActivity'
import { ContentActions } from './actions'

export class EmbedActivity extends ContentActivity<Embed> {
  constructor(action: string, entity: Embed, actorId: number) {
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

  static created(entity: Embed, actorId: number) {
    return new EmbedActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: Embed, updatedEntity: Embed, actorId: number) {
    return new EmbedActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: Embed, actorId: number) {
    return new EmbedActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: Embed, actorId: number) {
    return new EmbedActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: Embed, actorId: number) {
    return new EmbedActivity(ContentActions.Deleted, entity, actorId).deleted()
  }
}
