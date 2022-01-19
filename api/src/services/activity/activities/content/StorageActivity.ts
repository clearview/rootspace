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

  static uploadFile(entity: Storage, actorId: number, upload: Upload) {
    return new StorageActivity(UserStorageActions.Upload_File, entity, actorId).userUploadFile(upload)
  }

  static deleteFile(entity: Storage, actorId: number, upload: Upload) {
    return new StorageActivity(UserStorageActions.Delete_File, entity, actorId).userDeleteFile(upload)
  }

  static renameFile(entity: Storage, actorId: number, upload: Upload, oldFilename: string) {
    return new StorageActivity(UserStorageActions.Rename_File, entity, actorId).userRenameFile(upload, oldFilename)
  }

  private userUploadFile(upload: Upload) {
    this._context = {
      entity: this._filterEntityAttributes(this._entity, this._entityAttributes),
      file: upload,
      filename: upload.filename,
      actorId: this._actorId,
      spaceId: this._spaceId
    }

    return this
  }

  private userDeleteFile(upload: Upload) {
    this._context = {
      entity: this._filterEntityAttributes(this._entity, this._entityAttributes),
      file: upload,
      filename: upload.filename,
      actorId: this._actorId,
      spaceId: this._spaceId
    }

    return this
  }

  private userRenameFile(upload: Upload, oldFilename: string) {
    this._context = {
      entity: this._filterEntityAttributes(this._entity, this._entityAttributes),
      file: upload,
      fromName: oldFilename,
      toName: upload.name,
      actorId: this._actorId,
      spaceId: this._spaceId
    }

    return this
  }
}
