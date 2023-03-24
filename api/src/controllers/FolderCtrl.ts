import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { FolderService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import {
  validateFolderCreate,
  validateFolderUpdate,
  FolderCreateValue,
  FolderUpdateValue,
} from '../services/content/folder'

export class FolderCtrl extends BaseCtrl {
  private folderService: FolderService

  constructor() {
    super()
    this.folderService = ServiceFactory.getInstance().getFolderService()
  }

  async create(req: Request, res: Response) {
    const data = req.body.data
    await validateFolderCreate(data)

    this.isSpaceMember(req, data.spaceId)

    const value = FolderCreateValue.fromObjectAndUserId(data, Number(req.user.id))
    const result = await this.folderService.create(value)

    res.send(this.responseData(result))
  }

  async update(req: Request, res: Response) {
    const data = req.body.data
    await validateFolderUpdate(data)

    const folder = await this.folderService.requireById(Number(req.params.id))
    this.isSpaceMember(req, folder.spaceId)

    const value = FolderUpdateValue.fromObject(data)
    const result = await this.folderService.update(value, folder.id, req.user.id)

    res.send(this.responseData(result))
  }

  async archive(req: Request, res: Response) {
    const folder = await this.folderService.requireById(Number(req.params.id))
    this.isSpaceMember(req, folder.spaceId)

    const result = await this.folderService.archive(folder.id, req.user.id)
    res.send(this.responseData(result))
  }

  async restore(req: Request, res: Response) {
    const folder = await this.folderService.requireById(Number(req.params.id))
    this.isSpaceMember(req, folder.spaceId)

    const result = await this.folderService.restore(folder.id, req.user.id)
    res.send(this.responseData(result))
  }

  async delete(req: Request, res: Response) {
    const folder = await this.folderService.requireById(Number(req.params.id))
    this.isSpaceMember(req, folder.spaceId)

    const resutl = await this.folderService.remove(folder.id, req.user.id)
    res.send(this.responseData(resutl))
  }
}
