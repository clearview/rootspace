import { Link } from '../../../../database/entities/Link'
import { ContentActivity, IContentActivity } from '.'
import { ContentActions } from './actions'

export class LinkActivity extends ContentActivity<Link> {
  constructor(action: string, entity: Link, actorId?: number) {
    super(action, entity, actorId)

    this._filterEntityAttributes = ['id', 'title', 'value']
    this._notifyUpdatedAttributes = ['title', 'value']
  }

  getEntityName(): string {
    return 'Link'
  }

  getTablename(): string {
    return 'links'
  }

  static created(entity: Link, actorId?: number): IContentActivity {
    return new LinkActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: Link, updatedEntity: Link, actorId?: number) {
    return new LinkActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: Link, actorId?: number): IContentActivity {
    return new LinkActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: Link, actorId?: number): IContentActivity {
    return new LinkActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: Link, actorId?: number): IContentActivity {
    return new LinkActivity(ContentActions.Deleted, entity, actorId).deleted()
  }
}
