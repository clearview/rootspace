import { NextFunction, Request, Response } from 'express'
import { UploadService } from '../services/UploadService'
import { UploadValidator } from '../validation/upload'
import { BaseCtrl } from './BaseCtrl'

export class UploadsCtrl extends BaseCtrl {

  private uploadService: UploadService

  constructor() {
    super()
    this.uploadService = new UploadService()
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const data = {
        spaceId: req.query.spaceId,
        userId: req.user.id,
        file: req.file
      }
      const validator = new UploadValidator()
      await validator.validate(data)

      const upload = await this.uploadService.upload(req.file, data)
      res.send(upload)
    } catch (err) {
      next(err)
    }
  }
}
