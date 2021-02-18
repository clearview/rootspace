import { Link } from '../../../../database/entities/Link'
import { ContentActions } from './actions'
import { ContentActivity } from './ContentActivity'

export class LinkActivity extends ContentActivity<Link> {
  constructor(action: string, link: Link, actorId?: number) {
    super(action, link, actorId)

    this._entityAttributes = ['id', 'title', 'value']
    this._entityUpdateAttributes = ['title', 'value']
  }

  getEntityName(): string {
    return 'Link'
  }

  handler(): string | null {
    return null
  }

  static created(entity: Link, actorId?: number) {
    return new LinkActivity(ContentActions.Created, entity, actorId).contentCreated()
  }

  static updated(entity: Link, updatedEntity: Link, actorId?: number) {
    return new LinkActivity(ContentActions.Updated, entity, actorId).contentUpdated(updatedEntity)
  }

  static archived(entity: Link, actorId?: number) {
    return new LinkActivity(ContentActions.Archived, entity, actorId).contentArchived()
  }

  static restored(entity: Link, actorId?: number) {
    return new LinkActivity(ContentActions.Restored, entity, actorId).contentRestored()
  }

  static deleted(entity: Link, actorId?: number) {
    return new LinkActivity(ContentActions.Deleted, entity, actorId).contentDeleted()
  }
}
