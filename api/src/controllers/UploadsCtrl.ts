import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { User } from '../database/entities/User'
import { Space } from '../database/entities/Space'
import { UploadType, UploadEntity, validateUpload, UploadValue } from '../services/upload'
import { UploadTypeEntityMap } from '../services/upload/config'
import { ContentEntity } from '../root/types'
import { EntityService, UploadService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'

export class UploadsCtrl extends BaseCtrl {
  private uploadService: UploadService
  private entityService: EntityService

  constructor() {
    super()
    this.uploadService = ServiceFactory.getInstance().getUploadService()
    this.entityService = ServiceFactory.getInstance().getEntityService()
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

    res.send(this.responseData(upload))
  }

  async upload(req: Request, res: Response) {
    const data = req.body
    const file = req.file

    await validateUpload(Object.assign({ ...data }, { file }))
    
    data.entity = UploadTypeEntityMap.get(data.type)

    const entity = await this.entityService.requireEntityByNameAndId<ContentEntity>(
      data.entity,
      data.entityId
    )

    this.isSpaceMember(req, entity.spaceId)

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
