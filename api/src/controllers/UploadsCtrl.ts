import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { UploadValue } from '../values/upload'
import { UploadType, UploadEntity } from '../types/upload'
import { validateUpload } from '../validation/upload'
import { UploadService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'

export class UploadsCtrl extends BaseCtrl {
  private uploadService: UploadService

  constructor() {
    super()
    this.uploadService = ServiceFactory.getInstance().getUploadService()
  }

  async uploadUserAvatar(req: Request, res: Response, next: NextFunction) {
    if (req.body.type !== UploadType.UserAvatar) {
      return next()
    }

    return this.validateAndUpload(req, res, next)
  }

  async uploadSpaceLogo(req: Request, res: Response, next: NextFunction) {
    if (req.body.type !== UploadType.SpaceLogo) {
      return next()
    }

    return this.validateAndUpload(req, res, next)
  }

  async validateAndUpload(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    data.entityId = data.spaceId
    data.entity = UploadEntity.Space

    const value = UploadValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.upload(value, req.user.id)

    res.send(this.responseData(upload))
  }

  async uploadStorage(req: Request, res: Response, next: NextFunction) {
    if (req.body.type !== UploadType.Storage) {
      return next()
    }

    const data = req.body
    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    data.entity = UploadEntity.Storage

    const value = UploadValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.upload(value, req.user.id)

    res.send(this.responseData(upload))
  }

  async upload(req: Request, res: Response) {
    const data = req.body
    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    const value = UploadValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.upload(value, req.user.id)

    res.send(this.responseData(upload))
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id)
    const result = await this.uploadService.remove(id, req.user.id)

    res.send(this.responseData(result))
  }
}
