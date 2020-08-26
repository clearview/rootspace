import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { UploadValue } from '../values/upload'
import { UploadType } from '../types/upload'
import { validateUpload } from '../validation/upload'
import { UploadService } from '../services/upload/UploadService'
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

    const data = {
      userId: req.user.id,
      spaceId: 0,
      entityId: req.user.id,
      entity: 'User',
      type: req.body.type,
    }

    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    const value = UploadValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.upload(value)

    res.send(this.responseData(upload))
  }

  async uploadSpaceLogo(req: Request, res: Response, next: NextFunction) {
    if (req.body.type !== UploadType.SpaceLogo) {
      return next()
    }

    const data = {
      userId: req.user.id,
      spaceId: req.body.spaceId,
      entityId: req.body.spaceId,
      entity: 'Space',
      type: req.body.type,
    }

    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    const value = UploadValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.upload(value)

    res.send(this.responseData(upload))
  }

  async uploadSpaceLogo(req: Request, res: Response, next: NextFunction) {
    if (req.body.type !== UploadType.SpaceLogo) {
      return next()
    }

    const data = {
      userId: req.user.id,
      spaceId: req.body.spaceId,
      entityId: req.body.spaceId,
      entity: 'Space',
      type: req.body.type,
    }

    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    const value = UploadValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.upload(value)

    res.send(upload)
  }

  async upload(req: Request, res: Response) {
    const data = req.body
    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    const value = UploadValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.upload(value)

    res.send(this.responseData(upload))
  }
}
