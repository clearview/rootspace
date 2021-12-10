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
import { Storage } from '../../database/entities/Storage'
import { ServiceFactory } from '../factory/ServiceFactory'
import { Service } from '../Service'
import { EntityService } from '../'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { StorageActivity, TaskActivity } from '../activity/activities/content'
import { UploadValue, UploadUpdateValue, UploadType } from '.'
import { UploadImageConfig, UploadUniqueTypes } from './config'
import { UploadImageConfigType, UploadImageSize, UploadVersions } from './types'
import { UploadsFilter } from '../../shared/types/UploadsFilter'
import { QueryOptions } from '../../shared/types/DBQueryOptions'

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

  getUploadById(id: number, filter = {}, options: QueryOptions = {}): Promise<Upload | undefined> {
    return this.getUploadRepository().getUploadById(id, filter, options)
  }

  async requireUploadById(id: number, filter = {}, options: QueryOptions = {}): Promise<Upload> {
    const upload = await this.getUploadById(id, filter, options)

    if (!upload) {
      throw clientError('Can not find uplaod id ' + id, HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return upload
  }

  getUploadByEntity(entityId: number, entity: string): Promise<Upload | undefined> {
    return this.getUploadRepository().getUploadByEntity(entity, entityId)
  }

  getUploadsByEntity(
    entityId: number,
    entity: string,
    filter: UploadsFilter = {},
    options: QueryOptions = {}
  ): Promise<Upload[]> {
    return this.getUploadRepository().getUploadsByEntity(entity, entityId, filter, options)
  }

  getStream(upload: Upload) {
    const { region, bucket, key } = AmazonS3URI(upload.location)
    return this.getS3Object({ Key: key }).createReadStream()
  }

  async upload(data: UploadValue, actorId: number) {
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

    if (!data.attributes.name) {
      upload.name = path.parse(upload.filename).name
    }

    upload = await this.getUploadRepository().save(upload)

    // TO DO: implement other upload types activities
    if (upload.type === UploadType.TaskAttachment) {
      const task = await this.entityService.getEntityByNameAndId<Task>(upload.entity, upload.entityId)
      await this.notifyActivity(TaskActivity.attachmentAdded(task, upload, actorId))
    }

    if (upload.type === UploadType.Storage) {
      const storage = await this.entityService.getEntityByNameAndId<Storage>(upload.entity, upload.entityId)
      await this.notifyActivity(StorageActivity.uploadFile(storage, actorId, upload))
    }

    return upload
  }

  async update(data: UploadUpdateValue, target: number | Upload, actorId: number, oldFilename: string): Promise<Upload> {
    const upload = typeof target === 'number' ? await this.requireUploadById(target) : target

    Object.assign(upload, data.attributes)
    await this.getUploadRepository().save(upload)

    if (upload.type === UploadType.Storage) {
      const storage = await this.entityService.getEntityByNameAndId<Storage>(upload.entity, upload.entityId)
      await this.notifyActivity(
        StorageActivity.renameFile(storage, actorId, upload, oldFilename)
      )
    }

    return upload
  }

  private async obtainUploadEntity(data: UploadValue): Promise<Upload> {
    if (this.isUploadUniqueType(data.attributes.type)) {
      const upload = await this.getUploadByEntity(data.attributes.entityId, data.attributes.entity)

      if (upload) {
        await this.removeUploadFiles(upload)
        return upload
      }
    }

    return this.getUploadRepository().create()
  }

  private isUploadUniqueType(type: string): boolean {
    if (UploadUniqueTypes.includes(type)) {
      return true
    }

    return false
  }

  private createFilePath(fileName: string, spaceId: number, entityId: number) {
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

  private async createImageVersions(data: UploadValue): Promise<UploadVersions | null> {
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

  private createVersionFileName(fileName: string, suffix: string) {
    return [fileName.slice(0, fileName.lastIndexOf('.')), '-' + suffix, fileName.slice(fileName.lastIndexOf('.'))].join(
      ''
    )
  }

  private generateImage(file: any, size: UploadImageSize): Promise<Buffer | null> {
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

  private getUploadImageConfig(uploadType: string): UploadImageConfigType | null {
    for (const cnfg of UploadImageConfig) {
      if (cnfg.type === uploadType) {
        return cnfg
      }
    }

    return null
  }

  async archive(idOrUpload: number | Upload, actorId: number): Promise<Upload> {
    const upload = typeof idOrUpload === 'number' ? await this.requireUploadById(idOrUpload) : idOrUpload

    if (upload.type === UploadType.TaskAttachment) {
      const task = await this.entityService.getEntityByNameAndId<Task>(upload.entity, upload.entityId)
      await this.notifyActivity(TaskActivity.attachmentRemoved(task, upload, actorId))
    }

    if (upload.type === UploadType.Storage) {
      const storage = await this.entityService.getEntityByNameAndId<Storage>(upload.entity, upload.entityId)
      await this.notifyActivity(StorageActivity.deleteFile(storage, actorId, upload))
    }

    return this.getUploadRepository().softRemove(upload)
  }

  async restore(idOrUpload: number | Upload, actorId: number): Promise<Upload> {
    const upload =
      typeof idOrUpload === 'number'
        ? await this.requireUploadById(idOrUpload, null, { withDeleted: true })
        : idOrUpload

    return this.getUploadRepository().recover(upload)
  }

  async remove(idOrUpload: number | Upload, actorId: number): Promise<Upload> {
    const upload =
      typeof idOrUpload === 'number'
        ? await this.requireUploadById(idOrUpload, null, { withDeleted: true })
        : idOrUpload

    await this.removeUploadFiles(upload)
    return this.getUploadRepository().remove(upload)
  }

  private async removeUploadFiles(upload: Upload): Promise<void> {
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

  private S3Upload(params: Partial<S3.Types.PutObjectRequest>): Promise<ManagedUpload.SendData> {
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

  private S3DeleteObject(params: Partial<S3.Types.DeleteObjectRequest>) {
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

  private getS3Object(params: Partial<S3.Types.GetObjectRequest>) {
    const _params = {
      Bucket: params.Bucket ?? config.s3.bucket,
      Key: params.Key,
    }

    return this.s3.getObject(_params)
  }
}
