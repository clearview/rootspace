import { Folder } from '../../../../database/entities/Folder'
import { ContentActivity, IContentActivity } from './ContentActivity'
import { ContentActions } from './actions'

export class FolderActivity extends ContentActivity<Folder> {
  constructor(action: string, entity: Folder, actorId?: number) {
    super(action, entity, actorId)

    this._filterEntityAttributes = ['id', 'title']
    this._notifyUpdatedAttributes = ['title']
  }

  getEntityName(): string {
    return 'Folder'
  }

  static created(entity: Folder, actorId?: number): IContentActivity {
    return new FolderActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: Folder, updatedEntity: Folder, actorId?: number) {
    return new FolderActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: Folder, actorId?: number): IContentActivity {
    return new FolderActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: Folder, actorId?: number): IContentActivity {
    return new FolderActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: Folder, actorId?: number): IContentActivity {
    return new FolderActivity(ContentActions.Deleted, entity, actorId).deleted()
  }
}
