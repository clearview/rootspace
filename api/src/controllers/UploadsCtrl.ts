import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { validateUpload } from '../validation/upload'
import { UploadService } from '../services/UploadService'
import { UploadCreateValue } from '../values/upload'

export class UploadsCtrl extends BaseCtrl {
  private uploadService: UploadService

  constructor() {
    super()
    this.uploadService = new UploadService()
  }

  async index(req: Request, res: Response) {
    const data = req.body
    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    const value = UploadCreateValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.create(value)

    res.send(upload)
  }
}
