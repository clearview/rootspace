import { getCustomRepository } from 'typeorm'
import { StorageRepository } from '../../../database/repositories/StorageRepository'
import { Storage } from '../../../database/entities/Storage'
import { Node } from '../../../database/entities/Node'
import { StorageCreateValue, StorageUpdateValue } from './values'
import { NodeCreateValue } from '../node/values'
import { NodeType } from '../../../root/constants'
import { clientError, HttpErrName, HttpStatusCode } from '../../../response/errors'
import { StorageActivity } from '../../activity/activities/content'
import { NodeService, NodeContentService } from '../..'
import { ServiceFactory } from '../../factory/ServiceFactory'

export class StorageService extends NodeContentService {
  private nodeService: NodeService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
  }

  private static instance: StorageService

  static getInstance() {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }

    return StorageService.instance
  }

  getNodeType(): string {
    return NodeType.Storage
  }

  getStorageRepository(): StorageRepository {
    return getCustomRepository(StorageRepository)
  }

  getById(id: number, options: any = {}): Promise<Storage | undefined> {
    return this.getStorageRepository().getById(id, options)
  }

  getByIdWithUploads(id: number, options: any = {}): Promise<Storage | undefined> {
    return this.getStorageRepository().getByIdWithUploads(id, options)
  }

  async requireById(id: number, options: any = {}): Promise<Storage> {
    const storage = await this.getById(id, options)

    if (!storage) {
      throw clientError('Storage not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return storage
  }

  async create(data: StorageCreateValue): Promise<Storage> {
    const storage = await this.getStorageRepository().save(data.attributes)

    let value = NodeCreateValue.fromObject({
      userId: storage.userId,
      spaceId: storage.spaceId,
      contentId: storage.id,
      title: storage.title,
      type: this.getNodeType(),
    })

    if (data.attributes.parentId) {
      value = value.withParent(data.attributes.parentId).withPosition(0)
    }

    const node = await this.nodeService.create(value)

    await this.notifyActivity(StorageActivity.created(storage, storage.userId))

    return Object.assign(storage, { node })
  }

  async update(data: StorageUpdateValue, id: number, actorId: number): Promise<Storage> {
    const storage = await this.requireById(id)
    const updatedStorage = await this._update(data, storage, actorId)

    if (storage.title !== updatedStorage.title) {
      await this.nodeContentMediator.contentUpdated(updatedStorage.id, this.getNodeType(), actorId, {
        title: updatedStorage.title,
      })
    }

    return updatedStorage
  }

  async nodeUpdated(node: Node, actorId: number): Promise<void> {
    const storage = await this.getById(node.contentId)

    if (!storage) {
      return
    }

    await this._update(
      StorageUpdateValue.fromObject({
        title: node.title,
      }),
      storage,
      actorId
    )
  }

  private async _update(data: StorageUpdateValue, storage: Storage, actorId: number): Promise<Storage> {
    let updatedStorage = await this.requireById(storage.id)

    Object.assign(updatedStorage, data.attributes)
    updatedStorage = await this.getStorageRepository().save(updatedStorage)

    await this.notifyActivity(StorageActivity.updated(storage, updatedStorage, actorId))

    return updatedStorage
  }

  async archive(id: number, actorId: number): Promise<Storage> {
    let storage = await this.requireById(id, { withDeleted: true })
    this.verifyArchive(storage)

    storage = await this._archive(storage, actorId)
    await this.nodeService.contentArchived(storage.id, this.getNodeType(), actorId)

    return storage
  }

  async nodeArchived(node: Node, actorId: number): Promise<void> {
    const storage = await this.getById(node.contentId)

    if (!storage) {
      return
    }

    await this._archive(storage, actorId)
  }

  private async _archive(storage: Storage, actorId: number): Promise<Storage> {
    storage = await this.getStorageRepository().softRemove(storage)
    await this.notifyActivity(StorageActivity.archived(storage, actorId))

    return storage
  }

  async restore(id: number, actorId: number): Promise<Storage> {
    let storage = await this.requireById(id, { withDeleted: true })
    this.verifyRestore(storage)

    storage = await this._restore(storage, actorId)

    await this.nodeContentMediator.contentRestored(storage.id, this.getNodeType(), actorId)
    return storage
  }

  async nodeRestored(node: Node, actorId: number): Promise<void> {
    const storage = await this.getById(node.contentId, { withDeleted: true })

    if (!storage) {
      return
    }

    await this._restore(storage, actorId)
  }

  private async _restore(storage: Storage, actorId: number): Promise<Storage> {
    storage = await this.getStorageRepository().recover(storage)
    await this.notifyActivity(StorageActivity.restored(storage, actorId))

    return storage
  }

  async remove(id: number, actorId: number): Promise<Storage> {
    let storage = await this.requireById(id, { withDeleted: true })
    // this.verifyRemove(folder)

    storage = await this._remove(storage, actorId)
    await this.nodeContentMediator.contentRemoved(id, this.getNodeType(), actorId)

    return storage
  }

  async nodeRemoved(node: Node, actorId: number): Promise<void> {
    const storage = await this.getById(node.contentId, { withDeleted: true })

    if (storage) {
      await this._remove(storage, actorId)
    }
  }

  private async _remove(storage: Storage, actorId: number): Promise<Storage> {
    await this.notifyActivity(StorageActivity.deleted(storage, actorId))
    return this.getStorageRepository().remove(storage)
  }

  private verifyArchive(storage: Storage): void {
    if (storage.deletedAt !== null) {
      throw clientError('Can not archive storage', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRestore(storage: Storage) {
    if (storage.deletedAt === null) {
      throw clientError('Can not restore storage', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRemove(storage: Storage): void {
    if (storage.deletedAt === null) {
      throw clientError('Can not delete storage', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }
}
