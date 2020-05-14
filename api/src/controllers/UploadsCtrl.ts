import { Request, Response, NextFunction } from 'express'
import { UploadService } from '../services/UploadService'
import { BaseCtrl } from './BaseCtrl'

export class UploadsCtrl extends BaseCtrl {

  private uploadService: UploadService

  constructor() {
    super()
    this.uploadService = new UploadService()
  }

  async index(req: Request, res: Response, next: NextFunction) {
    const upload = await this.uploadService.upload(req.file, { spaceId: req.query.spaceId, userId: req.user.id})
    res.send(upload)
  }
}
