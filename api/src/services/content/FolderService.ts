import { getCustomRepository } from 'typeorm'
import { FolderRepository } from '../../database/repositories/FolderRepository'
import { Folder } from '../../database/entities/Folder'
import { Node } from '../../database/entities/Node'
import { FolderCreateValue, FolderUpdateValue } from '../../values/folder'
import { NodeCreateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { FolderActivity } from '../activity/activities/content'
import { NodeService, NodeContentService } from '../'
import { ServiceFactory } from '../factory/ServiceFactory'

export class FolderService extends NodeContentService {
  private nodeService: NodeService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
  }

  private static instance: FolderService

  static getInstance() {
    if (!FolderService.instance) {
      FolderService.instance = new FolderService()
    }

    return FolderService.instance
  }

  getNodeType(): NodeType {
    return NodeType.Folder
  }

  getFolderRepository(): FolderRepository {
    return getCustomRepository(FolderRepository)
  }

  getById(id: number, options: any = {}): Promise<Folder | undefined> {
    return this.getFolderRepository().getById(id, options)
  }

  async requireById(id: number, options: any = {}): Promise<Folder> {
    const folder = await this.getById(id, options)

    if (!folder) {
      throw clientError('Folder not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return folder
  }

  async create(data: FolderCreateValue): Promise<Node & Folder> {
    const folder = await this.getFolderRepository().save(data.attributes)

    let value = NodeCreateValue.fromObject({
      userId: folder.userId,
      spaceId: folder.spaceId,
      contentId: folder.id,
      title: folder.title,
      type: NodeType.Folder,
    })

    if (data.attributes.parentId) {
      value = value.withParent(data.attributes.parentId).withPosition(0)
    }

    const node = await this.nodeService.create(value)

    await this.notifyActivity(FolderActivity.created(folder, folder.userId))

    return { ...folder, ...node }
  }

  async update(data: FolderUpdateValue, id: number, actorId: number): Promise<Folder> {
    const folder = await this.requireById(id)
    const updatedFolder = await this._update(data, folder, actorId)

    if (folder.title !== updatedFolder.title) {
      await this.nodeContentMediator.contentUpdated(updatedFolder.id, this.getNodeType(), actorId, {
        title: updatedFolder.title,
      })
    }

    return updatedFolder
  }

  async nodeUpdated(node: Node, actorId: number): Promise<void> {
    const folder = await this.getById(node.contentId)

    if (!folder) {
      return
    }

    await this._update(
      FolderUpdateValue.fromObject({
        title: node.title,
      }),
      folder,
      actorId
    )
  }

  private async _update(data: FolderUpdateValue, folder: Folder, actorId: number): Promise<Folder> {
    let updatedFolder = await this.requireById(folder.id)

    Object.assign(updatedFolder, data.attributes)
    updatedFolder = await this.getFolderRepository().save(updatedFolder)

    await this.notifyActivity(FolderActivity.updated(folder, updatedFolder, actorId))

    return updatedFolder
  }

  async archive(id: number, actorId: number): Promise<Folder> {
    let folder = await this.requireById(id, { withDeleted: true })
    this.verifyArchive(folder)

    folder = await this._archive(folder, actorId)
    await this.nodeService.contentArchived(folder.id, this.getNodeType(), actorId)

    return folder
  }

  async nodeArchived(node: Node, actorId: number): Promise<void> {
    const folder = await this.getById(node.contentId)

    if (!folder) {
      return
    }

    await this._archive(folder, actorId)
  }

  private async _archive(folder: Folder, actorId: number): Promise<Folder> {
    folder = await this.getFolderRepository().softRemove(folder)
    await this.notifyActivity(FolderActivity.archived(folder, actorId))

    return folder
  }

  async restore(id: number, actorId: number): Promise<Folder> {
    let folder = await this.requireById(id, { withDeleted: true })
    this.verifyRestore(folder)

    folder = await this._restore(folder, actorId)

    await this.nodeContentMediator.contentRestored(folder.id, this.getNodeType(), actorId)
    return folder
  }

  async nodeRestored(node: Node, actorId: number): Promise<void> {
    const folder = await this.getById(node.contentId, { withDeleted: true })

    if (!folder) {
      return
    }

    await this._restore(folder, actorId)
  }

  private async _restore(folder: Folder, actorId: number): Promise<Folder> {
    folder = await this.getFolderRepository().recover(folder)
    await this.notifyActivity(FolderActivity.restored(folder, actorId))

    return folder
  }

  async remove(id: number, actorId: number): Promise<Folder> {
    let folder = await this.requireById(id, { withDeleted: true })
    // this.verifyRemove(folder)

    folder = await this._remove(folder, actorId)
    await this.nodeContentMediator.contentRemoved(id, this.getNodeType(), actorId)

    return folder
  }

  async nodeRemoved(node: Node, actorId: number): Promise<void> {
    const folder = await this.getById(node.contentId, { withDeleted: true })

    if (folder) {
      await this._remove(folder, actorId)
    }
  }

  private async _remove(folder: Folder, actorId: number): Promise<Folder> {
    await this.notifyActivity(FolderActivity.deleted(folder, actorId))
    return this.getFolderRepository().remove(folder)
  }

  private verifyArchive(folder: Folder): void {
    if (folder.deletedAt !== null) {
      throw clientError('Can not archive folder', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRestore(folder: Folder) {
    if (folder.deletedAt === null) {
      throw clientError('Can not restore folder', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRemove(folder: Folder): void {
    if (folder.deletedAt === null) {
      throw clientError('Can not delete folder', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }
}
