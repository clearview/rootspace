import httpRequestContext from 'http-request-context'
import { config } from 'node-config-ts'
import { nanoid } from 'nanoid'
import S3 from 'aws-sdk/clients/s3'
import path from 'path'
import fs from 'fs'
import Bull from 'bull'
import sharp from 'sharp'
import isImage from 'is-image'
import { getCustomRepository } from 'typeorm'
import { UploadRepository } from '../../database/repositories/UploadRepository'
import { Upload } from '../../database/entities/Upload'
import { ActivityEvent } from '../events/ActivityEvent'
import { ActivityService } from '../ActivityService'
import { FileActivities } from '../../database/entities/activities/FileActivities'
import { ServiceFactory } from '../factory/ServiceFactory'
import { UploadValue } from '../../values/upload'
import { UploadType, IUploadImageConfig, IUploadImageSize } from '../../types/upload'
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
    const filePath = this.createFilePath(data.file.originalname, data.attributes.spaceId)

    const sFFile = await this.sendFileToS3({
      Key: filePath,
      Bucket: config.s3.bucket,
      ACL: 'public-read',
      ContentType: data.file.mimetype,
      Body: fs.createReadStream(data.file.path),
    })

    const versions = isImage(data.file.originalname) ? await this.createImageVersions(data) : null

    let upload = await this.obtainUploadEntity(data)
    Object.assign(upload, data.attributes)

    upload.path = sFFile.Location
    upload.versions = versions

    upload.mimetype = data.file.mimetype
    upload.size = data.file.size

    upload = await this.getUploadRepository().save(upload)
    await this.registerActivityForUpload(FileActivities.Uploaded, upload)

    return upload
  }

  private async obtainUploadEntity(data: UploadValue): Promise<Upload> {
    if (UploadUniqueTypes.includes(data.attributes.type)) {
      const upload = await this.getUploadByEntityId(data.attributes.entityId, data.attributes.entity)

      if (upload) {
        return upload
      }
    }

    return this.getUploadRepository().create()
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
    const images = await this.generateImages(file, cnfg.sizes)

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

  private async generateImages(file: any, sizes: IUploadImageSize[]) {
    const images = []

    for (const size of sizes) {
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

    return images
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
    return this.getUploadRepository().remove(upload)
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
