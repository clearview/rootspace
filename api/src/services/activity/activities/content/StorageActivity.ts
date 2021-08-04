import { Storage } from '../../../../database/entities/Storage'
import { ContentActivity } from './ContentActivity'
import { ContentActions, UserStorageActions } from './actions'
import { Upload } from '../../../../database/entities/Upload'

export class StorageActivity extends ContentActivity<Storage> {
  constructor(action: string, entity: Storage, actorId: number) {
    super(action, entity, actorId)

    this._entityAttributes = ['id', 'title']
    this._entityUpdateAttributes = ['title']
  }

  getEntityName(): string {
    return 'Storage'
  }

  handler(): string | null {
    return null
  }

  static created(entity: Storage, actorId: number) {
    return new StorageActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: Storage, updatedEntity: Storage, actorId: number) {
    return new StorageActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: Storage, actorId: number) {
    return new StorageActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: Storage, actorId: number) {
    return new StorageActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: Storage, actorId: number) {
    return new StorageActivity(ContentActions.Deleted, entity, actorId).deleted()
  }

  static upload(entity: Storage, actorId: number, upload: Upload) {
    return new StorageActivity(UserStorageActions.Upload_File, entity, actorId).userUpload(upload)
  }

  static deleteFile(entity: Storage, actorId: number, upload: Upload) {
    return new StorageActivity(UserStorageActions.Delete_File, entity, actorId).userDeleteFile(upload)
  }

  private userUpload(upload: Upload) {
    this._context = {
      files: upload
    }

    return this
  }

  private userDeleteFile(upload: Upload) {
    this._context = {
      files: upload
    }

    return this
  }
}
