import httpRequestContext from 'http-request-context'
import { config } from 'node-config-ts'
import { getCustomRepository } from 'typeorm'
import { UploadRepository } from '../database/repositories/UploadRepository'
import { Upload } from '../database/entities/Upload'
import { nanoid } from 'nanoid'
import S3 from 'aws-sdk/clients/s3'
import path from 'path'
import fs from 'fs'
import Bull from 'bull'
import { ActivityEvent } from './events/ActivityEvent'
import { ActivityService } from './ActivityService'
import { FileActivities } from '../database/entities/activities/FileActivities'

export class UploadService {

  private s3: S3
  private activityService: ActivityService

  constructor() {
    this.activityService = ActivityService.getInstance()
    this.s3 = new S3({
      accessKeyId: config.s3.accessKey,
      secretAccessKey: config.s3.secretKey
    })
  }

  getUploadRepository(): UploadRepository {
    return getCustomRepository(UploadRepository)
  }

  getUploadById(id: number): Promise<Upload> {
    return this.getUploadRepository().findOne(id)
  }

  async upload (file: any, metadata: any) {
    try {
      const filePath = path.join(
        String(metadata.spaceId),
        nanoid(23),
        file.originalname.replace(/\s+/g, '-').toLowerCase()
      )
      const sFFile: any = await this.sendFileToS3(file, filePath)
      const fileData: Upload = this.getUploadRepository().create()

      fileData.spaceId = metadata.spaceId
      fileData.userId = metadata.userId
      fileData.type = file.mimetype
      fileData.size = file.size
      fileData.path = sFFile.Location

      const upload = await this.getUploadRepository().save(fileData)
      await this.registerActivityForUpload(FileActivities.Uploaded, upload)

      return upload
    } catch (e) {
      throw new Error(e)
    }
  }

  sendFileToS3 (file: any, filePath: string) {
    return new Promise((resolve, reject) => {
      this.s3.upload({
        Key: filePath,
        Bucket: config.s3.bucket,
        ACL: 'public-read',
        ContentType: file.mimetype,
        Body: fs.createReadStream(file.path)
      }, (err, output) => {
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
      ActivityEvent
        .withAction(uploadActivity)
        .fromActor(actor.id)
        .forEntity(upload)
        .inSpace(upload.spaceId)
    )
  }
}
