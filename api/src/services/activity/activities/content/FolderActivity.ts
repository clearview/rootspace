import { Folder } from '../../../../database/entities/Folder'
import { ContentActivity } from './ContentActivity'
import { ContentActions } from './actions'

export class FolderActivity extends ContentActivity<Folder> {
  constructor(action: string, entity: Folder, actorId: number) {
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

  static created(entity: Folder, actorId: number) {
    return new FolderActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: Folder, updatedEntity: Folder, actorId: number) {
    return new FolderActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: Folder, actorId: number) {
    return new FolderActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: Folder, actorId: number) {
    return new FolderActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: Folder, actorId: number) {
    return new FolderActivity(ContentActions.Deleted, entity, actorId).deleted()
  }
}
