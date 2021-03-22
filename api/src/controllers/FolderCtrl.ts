import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { FolderService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { validateFolderCreate, validateFolderUpdate } from '../validation/folder'
import { FolderCreateValue, FolderUpdateValue } from '../values/folder'
import { ForbiddenError } from '@casl/ability'
import { Actions } from '../middleware/AuthMiddleware'

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
    const id = Number(req.params.id)
    const data = req.body.data

    await validateFolderUpdate(data)

    const folder = await this.folderService.requireById(id)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Update, folder)

    const value = FolderUpdateValue.fromObject(data)

    const result = await this.folderService.update(value, id, req.user.id)
    res.send(this.responseData(result))
  }

  async archive(req: Request, res: Response) {
    const id = Number(req.params.id)

    const folder = await this.folderService.requireById(id)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, folder)

    const result = await this.folderService.archive(id, req.user.id)
    res.send(this.responseData(result))
  }

  async restore(req: Request, res: Response) {
    const id = Number(req.params.id)

    const folder = await this.folderService.requireById(id)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, folder)

    const result = await this.folderService.restore(id, req.user.id)

    res.send(this.responseData(result))
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id)

    const folder = await this.folderService.requireById(id)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, folder)

    const resutl = await this.folderService.remove(id, req.user.id)
    res.send(this.responseData(resutl))
  }
}
