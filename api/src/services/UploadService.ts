import httpRequestContext from 'http-request-context'
import { config } from 'node-config-ts'
import { nanoid } from 'nanoid'
import S3 from 'aws-sdk/clients/s3'
import path from 'path'
import fs from 'fs'
import Bull from 'bull'
import sharp from 'sharp'
import { getCustomRepository } from 'typeorm'
import { UploadRepository } from '../database/repositories/UploadRepository'
import { Upload } from '../database/entities/Upload'
import { ActivityEvent } from './events/ActivityEvent'
import { ActivityService } from './ActivityService'
import { FileActivities } from '../database/entities/activities/FileActivities'
import { ServiceFactory } from './factory/ServiceFactory'
import { UploadValue } from '../values/upload'
import { UploadType, UploadUniqueTypes, IUploadImageConfig, UploadImageConfig } from '../types/upload'

export class UploadService {
  private s3: S3
  private activityService: ActivityService

  constructor() {
    this.activityService = ServiceFactory.getInstance().getActivityService()

    this.s3 = new S3({
      accessKeyId: config.s3.accessKey,
      secretAccessKey: config.s3.secretKey,
    })
  }

  getUploadRepository(): UploadRepository {
    return getCustomRepository(UploadRepository)
  }

  getUploadById(id: number): Promise<Upload> {
    return this.getUploadRepository().findOne(id)
  }

  getUploadByEntityId(entityId: number, entity: string): Promise<Upload | undefined> {
    return this.getUploadRepository().getByEntityId(entityId, entity)
  }

  async upload(data: UploadValue) {
    const filePath = this.createFilePath(data.file.originalname, data.attributes.spaceId)

    const sFFile = await this.sendFileToS3({
      Key: filePath,
      Bucket: config.s3.bucket,
      ACL: 'public-read',
      ContentType: data.file.mimetype,
      Body: fs.createReadStream(data.file.path),
    })

    const versions = await this.createImageVersions(data)

    let upload = null

    if (UploadUniqueTypes.includes(data.attributes.type)) {
      upload = await this.getUploadByEntityId(data.attributes.entityId, data.attributes.entity)
    }

    if (!upload) {
      upload = this.getUploadRepository().create()
    }

    Object.assign(upload, data.attributes)

    upload.mimetype = data.file.mimetype
    upload.size = data.file.size
    upload.path = sFFile.Location
    upload.versions = versions

    upload = await this.getUploadRepository().save(upload)
    await this.registerActivityForUpload(FileActivities.Uploaded, upload)

    return upload
  }

  private createFilePath(fileName: string, spaceId: number) {
    return path.join(String(spaceId), nanoid(23), fileName.replace(/\s+/g, '-').toLowerCase())
  }

  private async createImageVersions(data: UploadValue): Promise<object | null> {
    const uploadType = data.attributes.type
    const file = data.file

    const cnfg = this.getUploadImageConfig(uploadType)

    if (!cnfg) {
      return null
    }

    const versions = {}
    const images = []

    for (const size of cnfg.sizes) {
      await sharp(file.path)
        .resize(size.width, size.height)
        .toBuffer()
        .then((output) => {
          images[size.name] = output
        })
        .catch((err) => {
          throw err
        })
    }

    for (const size of cnfg.sizes) {
      const originalFileName: string = file.originalname

      const versionfileName = [
        originalFileName.slice(0, originalFileName.lastIndexOf('.')),
        '-' + size.name,
        originalFileName.slice(originalFileName.lastIndexOf('.')),
      ].join('')

      const filePath = this.createFilePath(versionfileName, data.attributes.spaceId)

      const S3Result = await this.sendFileToS3({
        Key: filePath,
        Bucket: config.s3.bucket,
        ACL: 'public-read',
        ContentType: data.file.mimetype,
        Body: images[size.name],
      })

      versions[size.name] = S3Result.Location
    }

    return versions
  }

  private getUploadImageConfig(uploadType: UploadType): IUploadImageConfig | null {
    for (const cnfg of UploadImageConfig) {
      if (cnfg.type === uploadType) {
        return cnfg
      }
    }

    return null
  }

  sendFileToS3(params: S3.Types.PutObjectRequest): Promise<S3.ManagedUpload.SendData> {
    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err, output) => {
        if (err) {
          reject(err)
          return
        }
        resolve(output)
      })
    })
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
}
