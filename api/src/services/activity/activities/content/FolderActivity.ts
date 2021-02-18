import { Folder } from '../../../../database/entities/Folder'
import { ContentActivity } from './ContentActivity'
import { ContentActions } from './actions'

export class FolderActivity extends ContentActivity<Folder> {
  constructor(action: string, entity: Folder, actorId?: number) {
    super(action, entity, actorId)

    this._entityAttributes = ['id', 'title']
    this._entityUpdateAttributes = ['title']
  }

  getEntityName(): string {
    return 'Folder'
  }

  handler(): string | null {
    return null
  }

  static created(entity: Folder, actorId?: number) {
    return new FolderActivity(ContentActions.Created, entity, actorId).contentCreated()
  }

  static updated(entity: Folder, updatedEntity: Folder, actorId?: number) {
    return new FolderActivity(ContentActions.Updated, entity, actorId).contentUpdated(updatedEntity)
  }

  static archived(entity: Folder, actorId?: number) {
    return new FolderActivity(ContentActions.Archived, entity, actorId).contentArchived()
  }

  static restored(entity: Folder, actorId?: number) {
    return new FolderActivity(ContentActions.Restored, entity, actorId).contentRestored()
  }

  static deleted(entity: Folder, actorId?: number) {
    return new FolderActivity(ContentActions.Deleted, entity, actorId).contentDeleted()
  }
}
