import httpRequestContext from 'http-request-context'
import { config } from 'node-config-ts'
import { nanoid } from 'nanoid'
import path from 'path'
import fs from 'fs'
import Bull from 'bull'
import sharp from 'sharp'
import isImage from 'is-image'
import S3, { ManagedUpload, DeleteObjectOutput } from 'aws-sdk/clients/s3'
import { AWSError } from 'aws-sdk/lib/error'
import { getCustomRepository } from 'typeorm'
import { UploadRepository } from '../../database/repositories/UploadRepository'
import { Upload } from '../../database/entities/Upload'
import { ActivityEvent } from '../events/ActivityEvent'
import { ActivityService } from '../ActivityService'
import { FileActivities } from '../../database/entities/activities/FileActivities'
import { ServiceFactory } from '../factory/ServiceFactory'
import { UploadValue } from '../../values/upload'
import { UploadType, IUploadImageConfig, IUploadImageSize, IUploadVersions } from '../../types/upload'
import { UploadUniqueTypes, UploadImageConfig } from './config'
import { HttpErrName, HttpStatusCode, clientError } from '../../errors'

export class UploadService {
  private s3: S3
  private activityService: ActivityService

  private constructor() {
    this.activityService = ServiceFactory.getInstance().getActivityService()

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

  async registerActivityForUploadId(uploadActivity: FileActivities, uploadId: number): Promise<Bull.Job> {
    const upload = await this.getUploadById(uploadId)
    return this.registerActivityForUpload(uploadActivity, upload)
  }

  async registerActivityForUpload(uploadActivity: FileActivities, upload: Upload): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent.withAction(uploadActivity)
        .fromActor(actor.id)
        .forEntity(upload)
        .inSpace(upload.spaceId)
    )
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

  getUploadByEntityId(entityId: number, entity: string): Promise<Upload | undefined> {
    return this.getUploadRepository().getByEntityId(entityId, entity)
  }

  async upload(data: UploadValue) {
    const filePath = this.createFilePath(data.file.originalname, data.attributes.spaceId, data.attributes.entityId)

    const sFFile = await this.S3Upload({
      Key: filePath,
      ContentType: data.file.mimetype,
      Body: fs.createReadStream(data.file.path),
    })

    const versions = isImage(data.file.originalname) ? await this.createImageVersions(data) : null

    let upload = await this.obtainUploadEntity(data)
    Object.assign(upload, data.attributes)

    upload.path = sFFile.Location
    upload.key = sFFile.Key
    upload.versions = versions

    upload.mimetype = data.file.mimetype
    upload.size = data.file.size

    upload = await this.getUploadRepository().save(upload)
    await this.registerActivityForUpload(FileActivities.Uploaded, upload)

    return upload
  }

  private async obtainUploadEntity(data: UploadValue): Promise<Upload> {
    if (this.isUploadUniqueType(data.attributes.type)) {
      const upload = await this.getUploadByEntityId(data.attributes.entityId, data.attributes.entity)

      if (upload) {
        await this.removeUploadFiles(upload)
        return upload
      }
    }

    return this.getUploadRepository().create()
  }

  private isUploadUniqueType(type: UploadType): boolean {
    if (UploadUniqueTypes.includes(type)) {
      return true
    }

    return false
  }

  private createFilePath(fileName: string, spaceId: number, entityId: number) {
    if (!spaceId) {
      spaceId = 0
    }

    return path.join(String(spaceId), String(entityId), nanoid(23), fileName.replace(/\s+/g, '-').toLowerCase())
  }

  private async createImageVersions(data: UploadValue): Promise<IUploadVersions | null> {
    const cnfg = this.getUploadImageConfig(data.attributes.type)

    if (!cnfg) {
      return null
    }

    const versions = {}

    for (const size of cnfg.sizes) {
      const originalFileName: string = data.file.originalname

      const versionfileName = [
        originalFileName.slice(0, originalFileName.lastIndexOf('.')),
        '-' + size.name,
        originalFileName.slice(originalFileName.lastIndexOf('.')),
      ].join('')

      const filePath = this.createFilePath(versionfileName, data.attributes.spaceId, data.attributes.entityId)
      const image = await this.generateImage(data.file, size)

      const S3Result = await this.S3Upload({
        Key: filePath,
        ContentType: data.file.mimetype,
        Body: image,
      })

      versions[size.name] = {
        path: S3Result.Location,
        key: S3Result.Key,
      }
    }

    return versions
  }

  private generateImage(file: any, size: IUploadImageSize): Promise<Buffer | null> {
    return new Promise((resolve, reject) => {
      sharp(file.path)
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

  private getUploadImageConfig(uploadType: UploadType): IUploadImageConfig | null {
    for (const cnfg of UploadImageConfig) {
      if (cnfg.type === uploadType) {
        return cnfg
      }
    }

    return null
  }

  async remove(id: number) {
    const upload = await this.requireUploadById(id)

    this.removeUploadFiles(upload)
    return this.getUploadRepository().remove(upload)
  }

  private async removeUploadFiles(upload: Upload): Promise<void> {
    if (upload.key) {
      await this.S3DeleteObject({ Key: upload.key })
    }

    if (upload.versions) {
      for (const name in upload.versions) {
        if (upload.versions.hasOwnProperty(name)) {
          const version = upload.versions[name]
          await this.S3DeleteObject({ Key: version.key })
        }
      }
    }
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
}
