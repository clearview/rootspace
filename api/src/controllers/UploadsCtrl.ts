import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { Upload } from '../database/entities/Upload'
import { User } from '../database/entities/User'
import { Space } from '../database/entities/Space'
import { UploadType, UploadEntity, validateUpload, UploadValue, UploadUpdateValue } from '../services/upload'
import { UploadTypeEntityMap } from '../services/upload/config'
import { ContentEntity } from '../root/types'
import { EntityService, UploadService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../response/errors'

export class UploadsCtrl extends BaseCtrl {
  private uploadService: UploadService
  private entityService: EntityService

  constructor() {
    super()
    this.uploadService = ServiceFactory.getInstance().getUploadService()
    this.entityService = ServiceFactory.getInstance().getEntityService()
  }

  async download(req: Request, res: Response) {
    const upload = await this.uploadService.requireUploadById(Number(req.params.id))

    res.setHeader('Content-disposition', 'attachment; filename=' + upload.filename)
    res.setHeader('Content-type', upload.mimetype)

    this.uploadService
      .getStream(upload)
      .on('error', (err) => {
        res.status(500).json(this.responseError(err))
      })
      .pipe(res)
  }

  async uploadUserAvatar(req: Request, res: Response, next: NextFunction) {
    if (req.body.type !== UploadType.UserAvatar) {
      return next()
    }

    const data = req.body
    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    const user = await this.entityService.requireEntityByNameAndId<User>(UploadEntity.User, req.user.id)

    data.entityId = user.id
    data.entity = UploadEntity.User

    const value = UploadValue.fromObjectAndUserId(data, user.id).withFile(file)
    const upload = await this.uploadService.upload(value, user.id)

    res.send(this.responseData(upload))
  }

  async uploadSpaceLogo(req: Request, res: Response, next: NextFunction) {
    if (req.body.type !== UploadType.SpaceLogo) {
      return next()
    }

    const data = req.body
    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    const space = await this.entityService.requireEntityByNameAndId<Space>(UploadEntity.Space, data.spaceId)
    this.isSpaceAdmin(req, space.id)

    data.entityId = space.id
    data.entity = UploadEntity.Space

    const value = UploadValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.upload(value, req.user.id)

    res.send(this.responseBody(upload))
  }

  async upload(req: Request, res: Response) {
    const data = req.body
    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))

    data.entity = UploadTypeEntityMap.get(data.type)

    const entity = await this.entityService.requireEntityByNameAndId<ContentEntity>(data.entity, data.entityId)
    this.isSpaceMember(req, entity.spaceId)

    data.spaceId = entity.spaceId

    const value = UploadValue.fromObjectAndUserId(data, req.user.id).withFile(file)
    const upload = await this.uploadService.upload(value, req.user.id)

    res.send(this.responseBody(upload))
  }

  async update(req: Request, res: Response) {
    const upload = await this.uploadService.requireUploadById(Number(req.params.id))
    await this.authorize(req, upload)

    const fileType = upload.filename.split(".")[upload.filename.split(".").length - 1];
    const oldFilename = `${upload.name}.${fileType}`;
    const value = UploadUpdateValue.fromObject(req.body.data)

    const result = await this.uploadService.update(value, upload, req.user.id, oldFilename)
    res.send(this.responseBody(result))
  }

  async archive(req: Request, res: Response) {
    const upload = await this.uploadService.requireUploadById(Number(req.params.id))
    await this.authorize(req, upload)

    const result = await this.uploadService.archive(upload, req.user.id)
    res.send(this.responseBody(result))
  }

  async trash(req: Request, res: Response) {
    const upload = await this.uploadService.requireUploadById(Number(req.params.id))
    await this.authorize(req, upload)

    const result = await this.uploadService.archive(upload, req.user.id)
    res.send(this.responseBody(result))
  }

  async restore(req: Request, res: Response) {
    const upload = await this.uploadService.requireUploadById(Number(req.params.id), null, { withDeleted: true })
    await this.authorize(req, upload)

    const result = await this.uploadService.restore(upload, req.user.id)
    res.send(this.responseBody(result))
  }

  async delete(req: Request, res: Response) {
    const upload = await this.uploadService.requireUploadById(Number(req.params.id), null, { withDeleted: true })
    await this.authorize(req, upload)

    const result = await this.uploadService.remove(upload, req.user.id)
    res.send(this.responseBody(result))
  }

  private async authorize(req: Request, upload: Upload) {
    if (upload.type === UploadType.UserAvatar && req.user.id !== upload.userId) {
      throw clientError('Entity not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    if (upload.type === UploadType.SpaceLogo) {
      this.isSpaceAdmin(req, upload.spaceId)
    }

    this.isSpaceMember(req, upload.spaceId)
  }
}
