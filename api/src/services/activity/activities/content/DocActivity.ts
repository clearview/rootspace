import { Doc } from '../../../../database/entities/Doc'
import { ContentActivity, IContentActivity } from '.'
import { ContentActions } from './actions'

export class DocActivity extends ContentActivity<Doc> {
  constructor(action: string, entity: Doc, actorId?: number) {
    super(action, entity, actorId)

    this._filterEntityAttributes = ['id', 'title']
    this._notifyUpdatedAttributes = ['id', 'title', 'content']

    this._handler = 'DocActivityHandler'
  }

  getEntityName(): string {
    return 'Doc'
  }

  getTablename(): string {
    return 'docs'
  }

  static created(entity: Doc, actorId?: number): IContentActivity {
    return new DocActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: Doc, updatedEntity: Doc, actorId?: number) {
    return new DocActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: Doc, actorId?: number): IContentActivity {
    return new DocActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: Doc, actorId?: number): IContentActivity {
    return new DocActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: Doc, actorId?: number): IContentActivity {
    return new DocActivity(ContentActions.Deleted, entity, actorId).deleted()
  }
}
