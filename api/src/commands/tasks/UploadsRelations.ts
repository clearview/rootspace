import chalk from 'chalk'
import isImage from 'is-image'
import db from '../../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../database/repositories/tasks/TaskRepository'
import { UploadRepository } from '../../database/repositories/UploadRepository'
import { UploadType } from '../../types/upload'

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
        console.log(chalk.yellow('Processing upload id ' + attachment.id))

        const upload = await getCustomRepository(UploadRepository).findOne(attachment.id)

        upload.entityId = task.id
        upload.entity = 'Task'
        upload.type = UploadType.TaskAttachment

        const fileName = upload.path.split('/').pop()

        // tslint:disable-next-line:no-console
        console.log(chalk.yellow('File name ' + fileName))

        if (!isImage(fileName)) {
          await getCustomRepository(UploadRepository).save(upload)
          continue
        }

        // To do create image versions
      }
    }

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }
}
