import { config } from 'node-config-ts'
import { nanoid } from 'nanoid'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import isImage from 'is-image'
import AmazonS3URI from 'amazon-s3-uri'
import S3, { DeleteObjectOutput, ManagedUpload } from 'aws-sdk/clients/s3'
import { AWSError } from 'aws-sdk/lib/error'
import { getCustomRepository } from 'typeorm'
import { UploadRepository } from '../../database/repositories/UploadRepository'
import { Upload } from '../../database/entities/Upload'
import { Task } from '../../database/entities/tasks/Task'
import { EntityService } from '../index'
import { ServiceFactory } from '../factory/ServiceFactory'
import { Service } from '../Service'
import { UploadValue } from '../../values/upload'
import { IUploadImageConfig, IUploadImageSize, IUploadVersions, UploadType } from '../../types/upload'
import { UploadImageConfig, UploadUniqueTypes } from './config'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { TaskActivity } from '../activity/activities/content'

export class UploadService extends Service {
  private entityService: EntityService
  private s3: S3

  private constructor() {
    super()
    this.entityService = ServiceFactory.getInstance().getEntityService()

    this.s3 = new S3({
      accessKeyId: config.s3.accessKey,
      secretAccessKey: config.s3.secretKey,
    })
  }

  private static instance: UploadService

  static getInstance() {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService()
    }

    return UploadService.instance
  }

  getUploadRepository(): UploadRepository {
    return getCustomRepository(UploadRepository)
  }

  getUploadById(id: number): Promise<Upload | undefined> {
    return this.getUploadRepository().findOne(id)
  }

  async requireUploadById(id: number): Promise<Upload> {
    const upload = await this.getUploadById(id)

    if (!upload) {
      throw clientError('Can not find uplaod id ' + id, HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return upload
  }

  getUploadByEntity(entityId: number, entity: string): Promise<Upload | undefined> {
    return this.getUploadRepository().getByEntity(entity, entityId)
  }

  async upload(data: UploadValue, actorId: number) {
    const entity = await this.entityService.getEntityByNameAndId(data.attributes.entity, data.attributes.entityId)

    if (!entity) {
      throw clientError('Entity for uplaod not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    let upload = await this.obtainUploadEntity(data)

    Object.assign(upload, data.attributes)

    const key = this.createFilePath(data.file.originalname, data.attributes.spaceId, data.attributes.entityId)

    const s3Upload = await this.S3Upload({
      Key: key,
      ContentType: data.file.mimetype,
      Body: fs.createReadStream(data.file.path),
    })

    const versions = isImage(data.file.originalname) ? await this.createImageVersions(data) : null

    upload.location = s3Upload.Location
    upload.filename = data.file.originalname
    upload.versions = versions
    upload.mimetype = data.file.mimetype
    upload.size = data.file.size

    upload = await this.getUploadRepository().save(upload)

    // TO DO: implement other upload types activities
    if (upload.type === UploadType.TaskAttachment) {
      const task = await this.entityService.getEntityByNameAndId<Task>(upload.entity, upload.entityId)
      await this.notifyActivity(TaskActivity.attachmentAdded(task, upload, actorId))
    }

    return upload
  }

  async obtainUploadEntity(data: UploadValue): Promise<Upload> {
    if (this.isUploadUniqueType(data.attributes.type)) {
      const upload = await this.getUploadByEntity(data.attributes.entityId, data.attributes.entity)

      if (upload) {
        await this.removeUploadFiles(upload)
        return upload
      }
    }

    return this.getUploadRepository().create()
  }

  isUploadUniqueType(type: UploadType): boolean {
    if (UploadUniqueTypes.includes(type)) {
      return true
    }

    return false
  }

  createFilePath(fileName: string, spaceId: number, entityId: number) {
    if (!spaceId) {
      spaceId = 0
    }

    return path.join(
      String(spaceId),
      String(entityId),
      nanoid(23),
      nanoid(36),
      fileName.replace(/\s+/g, '-').toLowerCase()
    )
  }

  async createImageVersions(data: UploadValue): Promise<IUploadVersions | null> {
    const cnfg = this.getUploadImageConfig(data.attributes.type)

    if (!cnfg) {
      return null
    }

    const versions = {}

    for (const size of cnfg.sizes) {
      const versionfileName = this.createVersionFileName(data.file.originalname, size.name)
      const key = this.createFilePath(versionfileName, data.attributes.spaceId, data.attributes.entityId)

      const image = await this.generateImage(data.file.path, size)

      const s3Upload = await this.S3Upload({
        Key: key,
        ContentType: data.file.mimetype,
        Body: image,
      })

      versions[size.name] = {
        location: s3Upload.Location,
        filename: versionfileName,
      }
    }

    return versions
  }

  createVersionFileName(fileName: string, suffix: string) {
    return [fileName.slice(0, fileName.lastIndexOf('.')), '-' + suffix, fileName.slice(fileName.lastIndexOf('.'))].join(
      ''
    )
  }

  generateImage(file: any, size: IUploadImageSize): Promise<Buffer | null> {
    return new Promise((resolve, reject) => {
      sharp(file)
        .resize(size.width, size.height)
        .toBuffer()
        .then((output) => {
          resolve(output)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  getUploadImageConfig(uploadType: UploadType): IUploadImageConfig | null {
    for (const cnfg of UploadImageConfig) {
      if (cnfg.type === uploadType) {
        return cnfg
      }
    }

    return null
  }

  async remove(id: number, actorId: number): Promise<Upload> {
    const upload = await this.requireUploadById(id)
    await this.removeUploadFiles(upload)

    // TO DO: implement other upload types activities
    if (upload.type === UploadType.TaskAttachment) {
      if (upload.type === UploadType.TaskAttachment) {
        const task = await this.entityService.getEntityByNameAndId<Task>(upload.entity, upload.entityId)
        await this.notifyActivity(TaskActivity.attachmentRemoved(task, upload, actorId))
      }
    }

    return this.getUploadRepository().remove(upload)
  }

  async removeUploadFiles(upload: Upload): Promise<void> {
    this.removeUploadFile(upload.location)

    if (upload.versions) {
      for (const name in upload.versions) {
        if (upload.versions.hasOwnProperty(name)) {
          const version = upload.versions[name]
          await this.removeUploadFile(version.location)
        }
      }
    }
  }

  async removeUploadFile(location: string) {
    const { region, bucket, key } = AmazonS3URI(location)
    await this.S3DeleteObject({ Key: key })
  }

  S3Upload(params: Partial<S3.Types.PutObjectRequest>): Promise<ManagedUpload.SendData> {
    const _parmas = {
      Key: params.Key,
      Bucket: params.Bucket ?? config.s3.bucket,
      ACL: params.ACL ?? 'public-read',
      ContentType: params.ContentType,
      Body: params.Body,
    }

    return new Promise((resolve, reject) => {
      this.s3.upload(_parmas, (err: Error, output: ManagedUpload.SendData) => {
        if (err) {
          reject(err)
          return
        }
        resolve(output)
      })
    })
  }

  S3DeleteObject(params: Partial<S3.Types.DeleteObjectRequest>) {
    const _params = {
      Bucket: params.Bucket ?? config.s3.bucket,
      Key: params.Key,
    }

    return new Promise((resolve, reject) => {
      this.s3.deleteObject(_params, (err: AWSError, output: DeleteObjectOutput) => {
        if (err) {
          reject(err)
          return
        }
        resolve(output)
      })
    })
  }
}
