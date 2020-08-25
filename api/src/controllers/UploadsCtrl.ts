import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { validateUpload } from '../validation/upload'
import { UploadService } from '../services/UploadService'
import { UploadValue } from '../values/upload'
import { UploadType } from '../types/upload'

export class UploadsCtrl extends BaseCtrl {
  private uploadService: UploadService

  constructor() {
    super()
    this.uploadService = new UploadService()
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

    res.send(upload)
  }

  async upload(req: Request, res: Response) {
    const data = req.body
    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    const value = UploadValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.upload(value)

    res.send(upload)
  }
}
