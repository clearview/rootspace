import chalk from 'chalk'
import isImage from 'is-image'
import got from 'got'
import AmazonS3URI from 'amazon-s3-uri'
import db from '../../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../database/repositories/tasks/TaskRepository'
import { UploadRepository } from '../../database/repositories/UploadRepository'
import { UploadType } from '../../types/upload'
import { ServiceFactory } from '../../services/factory/ServiceFactory'

export class UploadsRelations {
  static async run() {
    await db()

    try {
      await UploadsRelations.updateUploads()
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async updateUploads() {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Taks update uploads relations...'))

    const uploadService = ServiceFactory.getInstance().getUploadService()
    const uploadImageConfig = uploadService.getUploadImageConfig(UploadType.TaskAttachment)

    const tasks = await getCustomRepository(TaskRepository)
      .createQueryBuilder('task')
      .where('task.attachments IS NOT NULL')
      .getMany()

    for (const task of tasks) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow('Processing task id ' + task.id))

      const attachments: any[] = task.attachments as any[]

      for (const attachment of attachments) {
        // tslint:disable-next-line:no-console
        console.log(chalk.yellowBright('Processing upload id ' + attachment.id))

        const upload = await getCustomRepository(UploadRepository).findOne(attachment.id)

        if (upload.key !== null) {
          // tslint:disable-next-line:no-console
          console.log(chalk.yellow('Uplaod id ' + upload.id + ' has key value, skip.'))
          continue
        }

        const fileName = upload.path.split('/').pop()
        const { region, bucket, key } = AmazonS3URI(upload.path)

        // tslint:disable-next-line:no-console
        console.log(chalk.yellow('File name ' + fileName))

        // tslint:disable-next-line:no-console
        console.log(chalk.yellow('Key ' + key))

        upload.entityId = task.id
        upload.entity = 'Task'
        upload.type = UploadType.TaskAttachment
        upload.key = key

        await getCustomRepository(UploadRepository).save(upload)

        if (!isImage(fileName)) {
          continue
        }

        // tslint:disable-next-line:no-console
        console.log(chalk.yellow('Creating image versions'))

        try {
          const file = await got(upload.path, { resolveBodyOnly: true, responseType: 'buffer' })
          const versions = {}

          for (const size of uploadImageConfig.sizes) {
            const versionfileName = uploadService.createVersionFileName(fileName, size.name)

            const versionKey = uploadService.createFilePath(versionfileName, task.spaceId, task.id)
            const versionImage = await uploadService.generateImage(file, size)

            const S3Result = await uploadService.S3Upload({
              Key: versionKey,
              ContentType: attachment.type,
              Body: versionImage,
            })

            versions[size.name] = {
              path: S3Result.Location,
              key: S3Result.Key,
            }

            upload.versions = versions

            await getCustomRepository(UploadRepository).save(upload)
          }
        } catch (error) {
          // tslint:disable-next-line:no-console
          console.log(chalk.red(error))
        }
      }
    }

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }
}
