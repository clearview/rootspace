import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { StorageService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { validateStorageCreate, validateStorageUpdate } from '../validation/storage'
import { StorageCreateValue, StorageUpdateValue } from '../values/storage'
import { ForbiddenError } from '@casl/ability'
import { Actions } from '../middleware/AuthMiddleware'

export class StorageCtrl extends BaseCtrl {
  private storageService: StorageService

  constructor() {
    super()
    this.storageService = ServiceFactory.getInstance().getStorageService()
  }

  async create(req: Request, res: Response) {
    const data = req.body.data
    await validateStorageCreate(data)

    this.isSpaceMember(req, data.spaceId)

    const value = StorageCreateValue.fromObjectAndUserId(data, Number(req.user.id))

    const result = await this.storageService.create(value)
    res.send(this.responseData(result))
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id)
    const data = req.body.data

    await validateStorageUpdate(data)

    const storage = await this.storageService.requireById(id)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Update, storage)

    const value = StorageUpdateValue.fromObject(data)

    const result = await this.storageService.update(value, id, req.user.id)
    res.send(this.responseData(result))
  }

  async archive(req: Request, res: Response) {
    const id = Number(req.params.id)

    const storage = await this.storageService.requireById(id)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, storage)

    const result = await this.storageService.archive(id, req.user.id)
    res.send(this.responseData(result))
  }

  async restore(req: Request, res: Response) {
    const id = Number(req.params.id)

    const storage = await this.storageService.requireById(id, {withDeleted: true})
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, storage)

    const result = await this.storageService.restore(id, req.user.id)

    res.send(this.responseData(result))
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id)

    const storage = await this.storageService.requireById(id)
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, storage)

    const result = await this.storageService.remove(id, req.user.id)
    res.send(this.responseData(result))
  }
}
