import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { StorageService, UploadService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import {
  StorageCreateValue,
  StorageUpdateValue,
  validateStorageCreate,
  validateStorageUpdate,
} from '../services/content/storage'
import { UploadEntity } from '../services/upload'
import { UploadsFilter } from '../shared/types/UploadsFilter'
import { QueryOptions } from '../shared/types/DBQueryOptions'

export class StorageCtrl extends BaseCtrl {
  private storageService: StorageService
  private uploadService: UploadService

  constructor() {
    super()
    this.storageService = ServiceFactory.getInstance().getStorageService()
    this.uploadService = ServiceFactory.getInstance().getUploadService()
  }

  async view(req: Request, res: Response) {
    const storage = await this.storageService.requireById(Number(req.params.id))
    this.isSpaceMember(req, storage.spaceId)

    res.send(this.responseBody(storage))
  }

  async files(req: Request, res: Response) {
    const storage = await this.storageService.requireById(Number(req.params.id))
    this.isSpaceMember(req, storage.spaceId)

    const filter: UploadsFilter = {}
    const options: QueryOptions = {}

    if (req.query.search) {
      filter.search = String(req.query.search)
    }

    if (req.query.offset) {
      options.offset = Number(req.query.offset)
    }

    if (req.query.limit) {
      options.limit = Number(req.query.limit)
    }

    const files = await this.uploadService.getUploadsByEntity(storage.id, UploadEntity.Storage, filter, options)
    res.send(this.responseBody(files))
  }

  async create(req: Request, res: Response) {
    const data = req.body.data
    await validateStorageCreate(data)

    this.isSpaceMember(req, data.spaceId)

    const value = StorageCreateValue.fromObjectAndUserId(data, Number(req.user.id))
    const result = await this.storageService.create(value)

    res.send(this.responseBody(result))
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id)
    const data = req.body.data

    await validateStorageUpdate(data)

    const storage = await this.storageService.requireById(id)
    this.isSpaceMember(req, storage.spaceId)

    const value = StorageUpdateValue.fromObject(data)

    const result = await this.storageService.update(value, id, req.user.id)
    res.send(this.responseBody(result))
  }

  async archive(req: Request, res: Response) {
    const id = Number(req.params.id)

    const storage = await this.storageService.requireById(id)
    this.isSpaceMember(req, storage.spaceId)

    const result = await this.storageService.archive(id, req.user.id)
    res.send(this.responseBody(result))
  }

  async restore(req: Request, res: Response) {
    const id = Number(req.params.id)

    const storage = await this.storageService.requireById(id, { withDeleted: true })
    this.isSpaceMember(req, storage.spaceId)

    const result = await this.storageService.restore(id, req.user.id)
    res.send(this.responseBody(result))
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id)

    const storage = await this.storageService.requireById(id)
    this.isSpaceMember(req, storage.spaceId)

    const result = await this.storageService.remove(id, req.user.id)
    res.send(this.responseBody(result))
  }
}
