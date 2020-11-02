import { Embed } from '../../../../database/entities/Embed'
import { ContentActivity, IContentActivity } from '.'
import { ContentActions } from './actions'

export class EmbedActivity extends ContentActivity<Embed> {
  constructor(action: string, entity: Embed, actorId?: number) {
    super(action, entity, actorId)

    this._filterEntityAttributes = ['id', 'title']
    this._notifyUpdatedAttributes = ['id', 'title', 'content']
  }

  getEntityName(): string {
    return 'Embed'
  }

  static created(entity: Embed, actorId?: number): IContentActivity {
    return new EmbedActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: Embed, updatedEntity: Embed, actorId?: number) {
    return new EmbedActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: Embed, actorId?: number): IContentActivity {
    return new EmbedActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: Embed, actorId?: number): IContentActivity {
    return new EmbedActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: Embed, actorId?: number): IContentActivity {
    return new EmbedActivity(ContentActions.Deleted, entity, actorId).deleted()
  }
}
